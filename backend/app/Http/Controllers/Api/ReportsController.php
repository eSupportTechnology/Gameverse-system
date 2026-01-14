<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Http\Request;
use App\Models\PosSale;
use App\Models\SaleItem;
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
}
