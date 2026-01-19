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
class ReportsController extends Controller
{
    // NEW CUSTOMERS 
    public function newCustomersCount(Request $request)
    {
        $query = NfcUser::query();

        if ($request->has('filter')) {
            $start = $this->getStartDate($request->filter);
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
            $start = $this->getStartDate($request->filter);
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
        $query = SaleItem::query();

        if ($request->has('filter')) {
            $start = $this->getStartDate($request->filter);
            $query->where('created_at', '>=', $start);
        }

        return response()->json([
            'success' => true,
            'products_sold' => $query->sum('quantity') 
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
            $start = $this->getStartDate($request->filter);
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
            $start = $this->getStartDate($request->filter);
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
            $start = $this->getStartDate($request->filter);
            $query->where('created_at', '>=', $start);
        }

        $total = $query->sum('total');
        return response()->json(['success' => true, 'total' => $total]);
    }

    // Helper function to get start date based on filter
    private function getStartDate($filter)
    {
        return match ($filter) {
            'today' => Carbon::today(),
            'yesterday' => Carbon::yesterday(),
            'week' => Carbon::now()->startOfWeek(),
            'month' => Carbon::now()->startOfMonth(),
            'year' => Carbon::now()->startOfYear(),
            default => Carbon::today(),
        };
    }


}
