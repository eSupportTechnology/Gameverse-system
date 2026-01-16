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
class ReportsController extends Controller
{
    // NEW CUSTOMERS 
    public function newCustomersCount()
    {
        return response()->json([
            'success' => true,
            'count' => User::count()
        ]);
    }

    // ✅ TOTAL BOOKINGS COUNT
    public function totalBookingsCount()
    {
        return response()->json([
            'success' => true,
            'count' => Booking::count()
        ]);
    }
    public function totalSales()
    {
        return response()->json([
            'success' => true,
            'total_sales' => PosSale::sum('total')
        ]);
    }

    public function productsSold()
    {
        return response()->json([
            'success' => true,
            'products_sold' => SaleItem::sum('quantity')
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

}
