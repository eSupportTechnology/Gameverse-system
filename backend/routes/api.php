<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;

// Public route
Route::post('/admin/login', [AuthController::class, 'login']);

// Booking routes (you can add auth middleware if needed)
Route::get('/bookings', [BookingController::class, 'index']);      // get all bookings
Route::post('/bookings', [BookingController::class, 'store']);     // create a booking
Route::get('/bookings/{id}', [BookingController::class, 'show']);  // get single booking
Route::put('/bookings/{id}', [BookingController::class, 'update']); // update booking
Route::delete('/bookings/{id}', [BookingController::class, 'destroy']); // delete booking

// Protected routes
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Welcome Admin']);
    });
});
