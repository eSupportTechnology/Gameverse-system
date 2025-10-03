<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'station' => 'required|string',
            'date' => 'required|date',
            'start_time' => 'required|string',
            'duration' => 'required|string',
            'payment_method' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        $booking = Booking::create($validated);

        return response()->json([
            'message' => 'Booking created successfully',
            'data' => $booking
        ], 201);
    }

    public function index()
    {
        return Booking::all();
    }
}
