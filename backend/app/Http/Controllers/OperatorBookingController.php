<?php

namespace App\Http\Controllers;

use App\Models\OperatorBooking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class OperatorBookingController extends Controller
{

    //Display a listing of the resource
    public function index(): JsonResponse
    {
        $bookings = OperatorBooking::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    // Create booking
    public function store(Request $request)
    {
        $validator =Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'station' => 'required|string|max:255',
            'date' => 'required|date',
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
            $booking = OperatorBooking::create($validator->validated());

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

    // Show single booking details
    public function show(string $id): JsonResponse
    {
        try {
            $booking = OperatorBooking::findOrFail($id);
            
            // Normalize booking data for frontend compatibility
            $normalizedBooking = [
                'id' => $booking->id,
                'customer_name' => $booking->customer_name,
                'phone_number' => $booking->phone_number,
                'station' => $booking->station,
                'date' => $booking->date ? $booking->date->format('Y-m-d') : null,
                'start_time' => $booking->start_time,
                'duration' => $booking->duration,
                'extended_time' => $booking->extended_time ?? '',
                'payment_method' => $booking->payment_method ?? '',
                'amount' => $booking->amount,
                'status' => $booking->status,
                'created_at' => $booking->created_at,
                'updated_at' => $booking->updated_at,
            ];
            
            return response()->json([
                'success' => true,
                'data' => $normalizedBooking
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }
    }

    // Update booking details
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $booking = OperatorBooking::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'customer_name' => 'string|max:255',
                'phone_number' => 'string|max:20',
                'station' => 'string|max:255',
                'date' => 'sometimes|date',
                'start_time' => 'string|max:10',
                'duration' => 'string|max:20',
                'extended_time' => 'nullable|string|max:20',
                'payment_method' => 'nullable|string|max:50',
                'amount' => 'numeric|min:0',
                'status' => 'sometimes|in:upcoming,inprogress,completed,cancelled'
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

    // Cancel booking
    public function destroy(string $id): JsonResponse
    {
        try {
            $booking = OperatorBooking::findOrFail($id);
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