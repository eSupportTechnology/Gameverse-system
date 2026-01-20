<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Http\Request;
use App\Models\PosSale;
use App\Models\SaleItem;
use Carbon\Carbon;
use App\Models\Game;;
use Illuminate\Support\Facades\DB;
use App\Models\NfcUser;
use PhpOffice\PhpWord\PhpWord;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Schema;

class ReportsController extends Controller
{
    // NEW CUSTOMERS 
    public function newCustomersCount(Request $request)
    {
        $query = NfcUser::query();

        if ($request->has('filter')) {
            $start = $this->getDateRange($request->filter);
            $query->where('created_at', '>=', $start);
        }

        return response()->json([
            'success' => true,
            'count' => $query->count()
        ]);
    }

    // ✅ TOTAL BOOKINGS COUNT
    public function totalBookingsCount(Request $request)
    {
        $query = Booking::query();

        if ($request->has('filter')) {
            $start = $this->getDateRange($request->filter);
            $query->where('created_at', '>=', $start);
        }

        return response()->json([
            'success' => true,
            'count' => $query->count()
        ]);
    }

    // public function totalSales()
    // {
    //     return response()->json([
    //         'success' => true,
    //         'total_sales' => PosSale::sum('total')
    //     ]);
    // }

    
    public function productsSold(Request $request)
{
    $query = PosSale::query();

    if ($request->has('filter')) {
        [$start, $end] = $this->getDateRange($request->filter);
        $query->whereBetween('created_at', [$start, $end]);
    }

    $productsSold = 0;

    // Loop through sales and sum quantity from items JSON
    $query->get()->each(function ($sale) use (&$productsSold) {
        $items = $sale->items; // make sure items is casted to array in PosSale model
        if (is_array($items)) {
            foreach ($items as $item) {
                $productsSold += $item['quantity'] ?? 0;
            }
        }
    });

    return response()->json([
        'success' => true,
        'products_sold' => $productsSold
    ]);
}




    public function salesChart(Request $request)
    {
        $filter = $request->query('filter', 'today');

        $start = match ($filter) {
            'today' => Carbon::today(),
            'yesterday' => Carbon::yesterday(),
            'week' => Carbon::now()->startOfWeek(),
            'month' => Carbon::now()->startOfMonth(),
            'year' => Carbon::now()->startOfYear(),
            default => Carbon::today(),
        };

        $bookingsAmount = Booking::where('created_at', '>=', $start)->sum('amount');
        $productsAmount = PosSale::where('created_at', '>=', $start)->sum('total');
        $GamesAmount = Game::where('created_at', '>=', $start)->sum('balance');

        return response()->json([
            'success' => true,
            'data' => [
                'bookings' => $bookingsAmount,
                'products' => $productsAmount,
                'games' => $GamesAmount ?? 0,
            ]
        ]);
    }

        // booking total section
    public function totalBookingsAmount(Request $request)
    {
        $query = Booking::query();
        
        if ($request->has('filter')) {
            $start = $this->getDateRange($request->filter);
            $query->where('created_at', '>=', $start);
        }

        $total = $query->sum('amount');

        return response()->json(['success' => true, 'total' => $total]);
    }

    // games total section
    public function totalGamesAmount(Request $request)
    {
        $query = Game::query();

        if ($request->has('filter')) {
            $start = $this->getDateRange($request->filter);
            $query->where('created_at', '>=', $start);
        }

        $total = $query->sum('balance');
        return response()->json(['success' => true, 'total' => $total]);
    }

    // POS-sales total section
    public function totalPosAmount(Request $request)
    {
        $query = PosSale::query();

        if ($request->has('filter')) {
            $start = $this->getDateRange($request->filter);
            $query->where('created_at', '>=', $start);
        }

        $total = $query->sum('total');
        return response()->json(['success' => true, 'total' => $total]);
    }

    // Helper function to get start date based on filter
  private function getDateRange($filter)
    {
        return match ($filter) {
            'today' => [
                Carbon::today('UTC'),
                Carbon::tomorrow('UTC')
            ],
            'yesterday' => [
                Carbon::yesterday('UTC'),
                Carbon::today('UTC')
            ],
            'week' => [
                Carbon::now('UTC')->startOfWeek(),
                Carbon::now('UTC')->endOfWeek()
            ],
            'month' => [
                Carbon::now('UTC')->startOfMonth(),
                Carbon::now('UTC')->endOfMonth()
            ],
            'year' => [
                Carbon::now('UTC')->startOfYear(),
                Carbon::now('UTC')->endOfYear()
            ],
            default => [
                Carbon::today('UTC'),
                Carbon::tomorrow('UTC')
            ],
        };
    }
    public function exportDoc(Request $request)
    {
        $filter = $request->query('filter', 'today');
        [$start, $end] = $this->getDateRange($filter);

        // Calculate totals
        $bookingsTotal = Booking::whereBetween('created_at', [$start, $end])->sum('amount');
        $gamesTotal = Game::whereBetween('created_at', [$start, $end])->sum('price');
        $posTotal = PosSale::whereBetween('created_at', [$start, $end])->sum('total');

        $totalSales = $bookingsTotal + $gamesTotal + $posTotal;

        // Products sold
        if (Schema::hasColumn('pos_sales', 'items_count')) {
            $productsSold = PosSale::whereBetween('created_at', [$start, $end])->sum('items_count');
        } else {
            $productsSold = PosSale::whereBetween('created_at', [$start, $end])->count();
        }

        $totalBookings = Booking::whereBetween('created_at', [$start, $end])->count();
        $newCustomers = NfcUser::whereBetween('created_at', [$start, $end])->count();

        $chartData = [
            'Bookings' => $bookingsTotal,
            'Products' => $posTotal,
            'Other Games' => $gamesTotal,
        ];

        //PHPWord Export
        $phpWord = new PhpWord();
        $section = $phpWord->addSection();

        $section->addText("Reports Export ($filter)", [
            'bold' => true,
            'size' => 18,
        ]);
        $section->addTextBreak(1);

        $section->addText("Analytics", ['bold' => true, 'size' => 14]);

        $table = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 150,
        ]);

        $table->addRow();
        $table->addCell(4000)->addText("Total Sales", ['bold' => true]);
        $table->addCell(4000)->addText("LKR " . number_format($totalSales));

        $table->addRow();
        $table->addCell()->addText("Total Bookings", ['bold' => true]);
        $table->addCell()->addText($totalBookings);

        $table->addRow();
        $table->addCell()->addText("Products Sold", ['bold' => true]);
        $table->addCell()->addText($productsSold);

        $table->addRow();
        $table->addCell()->addText("New Customers", ['bold' => true]);
        $table->addCell()->addText($newCustomers);

        $section->addTextBreak(2);

        // Chart 
        $section->addText("Chart Data (Total Sales for Each Category)", ['bold' => true, 'size' => 14]);

        $chartTable = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 150,
        ]);

        $chartTable->addRow();
        $chartTable->addCell(4000)->addText("Type", ['bold' => true]);
        $chartTable->addCell(4000)->addText("Amount", ['bold' => true]);

        foreach ($chartData as $type => $amount) {
            $chartTable->addRow();
            $chartTable->addCell()->addText($type);
            $chartTable->addCell()->addText("LKR " . number_format($amount));
        }

        $section->addTextBreak(2);

        // Quick Action Section
        $section->addText("Quick Actions", ['bold' => true, 'size' => 14]);
    
        // Booking 
        $section->addText("Booking Sales Details", ['bold' => true, 'size' => 15]);
        $section->addTextBreak(1);

        $bookings = Booking::whereBetween('created_at', [$start, $end])->get();

        $bookingTable = $section->addTable([
            'borderSize' => 6,
            'cellMargin' => 150,
        ]);

        $bookingTable->addRow();
        $bookingTable->addCell(2000)->addText("ID", ['bold' => true]);
        $bookingTable->addCell(3000)->addText("Amount", ['bold' => true]);
        $bookingTable->addCell(3000)->addText("Date", ['bold' => true]);

        foreach ($bookings as $b) {
            $bookingTable->addRow();
            $bookingTable->addCell()->addText($b->id);
            $bookingTable->addCell()->addText("LKR " . number_format($b->amount));
            $bookingTable->addCell()->addText($b->created_at->format('Y-m-d'));
        }

        $section->addTextBreak(3);

        // Product Sales
        $section->addText("Product Sales Details", ['bold' => true, 'size' => 15]);
        $section->addTextBreak(1);

        $posSales = PosSale::whereBetween('created_at', [$start, $end])->get();

        $productTable = $section->addTable([
            'borderSize' => 6,
            'cellMargin' => 150,
        ]);

        $productTable->addRow();
        $productTable->addCell(2500)->addText("Sale ID", ['bold' => true]);
        $productTable->addCell(3000)->addText("Total", ['bold' => true]);
        $productTable->addCell(2500)->addText("Date", ['bold' => true]);

        foreach ($posSales as $sale) {
            $productTable->addRow();
            $productTable->addCell()->addText($sale->id);
            $productTable->addCell()->addText("LKR " . number_format($sale->total));
            $productTable->addCell()->addText($sale->created_at->format('Y-m-d'));
        }

        $section->addTextBreak(3);

        // Other Games Sales
        $section->addText("Other Games Sales Details", ['bold' => true, 'size' => 15]);
        $section->addTextBreak(1);

        $games = Game::whereBetween('created_at', [$start, $end])->get();

        $gamesTable = $section->addTable([
            'borderSize' => 6,
            'cellMargin' => 150,
        ]);

        $gamesTable->addRow();
        $gamesTable->addCell(2500)->addText("Game ID", ['bold' => true]);
        $gamesTable->addCell(3000)->addText("Balance", ['bold' => true]);
        $gamesTable->addCell(2500)->addText("Date", ['bold' => true]);

        foreach ($games as $game) {
            $gamesTable->addRow();
            $gamesTable->addCell()->addText($game->id);
            $gamesTable->addCell()->addText("LKR " . number_format($game->balance));
            $gamesTable->addCell()->addText($game->created_at->format('Y-m-d'));
        }

        $section->addTextBreak(3);

        // customers section
        $section->addText("Customers Details", ['bold' => true, 'size' => 15]);
        $section->addTextBreak(1);

        $customers = NfcUser::whereBetween('created_at', [$start, $end])->get();

        $customerTable = $section->addTable([
            'borderSize' => 6,
            'cellMargin' => 150,
        ]);

        $customerTable->addRow();
        $customerTable->addCell(2000)->addText("Customer ID", ['bold' => true]);
        $customerTable->addCell(4000)->addText("Name", ['bold' => true]);
        $customerTable->addCell(3000)->addText("Created At", ['bold' => true]);

        foreach ($customers as $c) {
            $customerTable->addRow();
            $customerTable->addCell()->addText($c->id);
            $customerTable->addCell()->addText($c->name ?? '-');
            $customerTable->addCell()->addText($c->created_at->format('Y-m-d'));
        }

        // Prepare download response
        $filename = "report_{$filter}.docx";

        return new StreamedResponse(function () use ($phpWord) {
            $phpWord->save('php://output', 'Word2007');
        }, 200, [
            "Content-Type" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition" => "attachment; filename={$filename}",
            "Cache-Control" => "max-age=0",
        ]);
    }
}
