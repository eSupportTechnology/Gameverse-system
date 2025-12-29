<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Http\Request;

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
}
