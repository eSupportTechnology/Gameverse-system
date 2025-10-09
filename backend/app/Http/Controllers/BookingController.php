<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $bookings = Booking::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'station' => 'required|string|max:255',
            'booking_date' => 'required|date',
            'start_time' => 'required|string|max:10',
            'duration' => 'required|string|max:20',
            'amount' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $booking = Booking::create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'data' => $booking
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $booking = Booking::findOrFail($id);
            
            // Normalize booking data for frontend compatibility
            $normalizedBooking = [
                'id' => $booking->id,
                'customer_name' => $booking->customer_name,
                'phone_number' => $booking->phone_number,
                'station' => $booking->station,
                'booking_date' => $booking->booking_date ? $booking->booking_date->format('Y-m-d') : null,
                'start_time' => $booking->start_time,
                'duration' => $booking->duration,
                'amount' => $booking->amount,
                'status' => $booking->status,
                'extended_time' => $booking->extended_time ?? '',
                'payment_method' => $booking->payment_method ?? '',
                'created_at' => $booking->created_at,
                'updated_at' => $booking->updated_at,
                // Add backward compatibility aliases
                'date' => $booking->booking_date ? $booking->booking_date->format('Y-m-d') : null,
                'time' => $booking->start_time,
                'phone' => $booking->phone_number,
                'user' => $booking->customer_name,
                'price' => $booking->amount,
            ];
            
            return response()->json([
                'success' => true,
                'data' => $booking
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $booking = Booking::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'customer_name' => 'string|max:255',
                'phone_number' => 'string|max:20',
                'station' => 'string|max:255',
                'booking_date' => 'date',
                'start_time' => 'string|max:10',
                'duration' => 'string|max:20',
                'extended_time' => 'nullable|string|max:20',
                'payment_method' => 'nullable|string|max:50',
                'amount' => 'numeric|min:0',
                'status' => 'in:pending,confirmed,cancelled,completed'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $booking->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Booking updated successfully',
                'data' => $booking
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update booking'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $booking = Booking::findOrFail($id);
            $booking->delete();

            return response()->json([
                'success' => true,
                'message' => 'Booking deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete booking'
            ], 500);
        }
    }
}
