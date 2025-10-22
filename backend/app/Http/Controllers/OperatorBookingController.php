<?php

namespace App\Http\Controllers;

use App\Models\OperatorBooking;
use Illuminate\Http\Request;

class OperatorBookingController extends Controller
{
    // Create booking
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

        $booking = OperatorBooking::create($validated);

        return response()->json([
            'message' => 'Booking created successfully',
            'data' => $booking
        ], 201);
    }

    // Show all bookings
    public function index()
    {
        return OperatorBooking::all();
    }

    // Show single booking details
    public function show($id)
    {
        $booking = OperatorBooking::find($id);

        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        return response()->json($booking);
    }

    // Update booking details
    public function update(Request $request, $id)
    {
        // Find the booking
        $booking = OperatorBooking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        // Validate request data (optional but recommended)
        $validated = $request->validate([
            'customer_name' => 'sometimes|string|max:255',
            'phone_number'  => 'sometimes|string|max:20',
            'station'       => 'sometimes|string|max:255',
            'date'          => 'sometimes|date',
            'start_time'    => 'sometimes|date_format:H:i:s',
            'duration'      => 'sometimes|string|max:50',
            'payment_method'=> 'sometimes|string|max:50',
            'amount'        => 'sometimes|numeric',
            'status'        => 'sometimes|string|max:50',
        ]);

        // Update the booking
        $booking->update($validated);

        return response()->json([
            'message' => 'Booking updated successfully',
            'data' => $booking
        ]);
    }

    // Cancel booking
    public function cancel($id)
    {
        $booking = OperatorBooking::find($id);

        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $booking->status = 'Cancelled';
        $booking->save();

        return response()->json(['message' => 'Booking cancelled successfully']);
    }

    // Update booking time
    public function updateTime(Request $request, $id)
    {
        $booking = OperatorBooking::find($id);

        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $validated = $request->validate([
            'start_time' => 'string|nullable',
            'duration' => 'string|nullable',
        ]);

        $booking->update($validated);

        return response()->json([
            'message' => 'Booking time updated successfully',
            'data' => $booking
        ]);
    }
}
