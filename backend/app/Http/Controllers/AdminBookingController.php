<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdminBooking;
use Illuminate\Support\Facades\Auth;

class AdminBookingController extends Controller
{
    public function addBooking(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'station' => 'required|string|max:100',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i:s',
            'duration' => 'required|string', 
            'fees' => 'required|string',   
            'amount' => 'required|numeric',
        ]);

        // Convert duration string to minutes
        $durationStr = $request->duration; // e.g., "1h 30m"
        $hours = 0;
        $minutes = 0;

        if (preg_match('/(\d+)h/', $durationStr, $matches)) {
            $hours = (int)$matches[1];
        }
        if (preg_match('/(\d+)m/', $durationStr, $matches)) {
            $minutes = (int)$matches[1];
        }
        $totalMinutes = ($hours * 60) + $minutes;

        $user = $request->user();

        $booking = AdminBooking::create([
            'customer_name' => $request->customer_name,
            'phone' => $request->phone,
            'station' => $request->station,
            'date' => $request->date,
            'start_time' => $request->start_time,
            'duration' => $totalMinutes,
            'fees' => $request->fees,
            'amount' => $request->amount,
            'user_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully',
            'data' => $booking->load('user')
        ]);
    }


    // Get booking data
    public function getBooking()
{
    // Eager load related user info
    $bookings = AdminBooking::with('user')->get();

    return response()->json([
        'success' => true,
        'data' => $bookings
    ]);
}
}
