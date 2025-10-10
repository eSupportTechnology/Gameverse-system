<?php

use App\Http\Controllers\OperatorBookingController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\StationController;


// Admin and Operator Login
use App\Http\Controllers\GameController;
//use App\Http\Controllers\BookingController;
// Public route
Route::post('/admin/login', [AuthController::class, 'login']);
Route::post('/operator/login', [AuthController::class, 'operatoLogin']);

// Password Reset
Route::middleware('auth:sanctum')->post('/reset-password', [AuthController::class, 'resetPassword']);

// Admin Logout and Dashboard

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // add user
    Route::post('/add-user', [AdminUserController::class, 'store']);
    // update user
    Route::put('/update-user/{id}', [AdminUserController::class, 'update']);
    // delete user
    Route::delete('/delete-user/{id}', [AdminUserController::class, 'delete']);
});

// fetch all users
Route::get('/users', [AdminUserController::class, 'fetchUsers']);

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

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/add-user', [AdminUserController::class, 'store']);
    Route::put('/update-user/{id}', [AdminUserController::class, 'update']);
    Route::delete('/delete-user/{id}', [AdminUserController::class, 'delete']);
});

// Fetch all users (accessible without auth)
Route::get('/users', [AdminUserController::class, 'fetchUsers']);

// Public/General booking routes
Route::post('/bookings', [OperatorBookingController::class, 'store']);          // Create booking
Route::get('/bookings', [OperatorBookingController::class, 'index']);           // Get all bookings
Route::get('/bookings/{id}', [OperatorBookingController::class, 'show']);       // Get single booking details
Route::put('/bookings/{id}', [OperatorBookingController::class, 'update']);     // Update booking
Route::put('/bookings/{id}/cancel', [OperatorBookingController::class, 'cancel']); // Cancel booking
Route::put('/bookings/{id}/update-time', [OperatorBookingController::class, 'updateTime']); // Update booking time

// Public station routes
Route::get('/stations', [StationController::class, 'index']);

// Admin-only station management
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
// Protected routes (only authenticated admin)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/stations', [StationController::class, 'store']);
    Route::put('/stations/{id}', [StationController::class, 'update']);
    Route::delete('/stations/{id}', [StationController::class, 'destroy']);
});



Route::post('/games', [GameController::class, 'store']);
Route::put('/games/{id}', [GameController::class, 'update']);
Route::delete('/games/{id}', [GameController::class, 'destroy']);

// Routes for fetching games
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{id}', [GameController::class, 'show']);


