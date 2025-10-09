<?php

use App\Http\Controllers\OperatorBookingController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\StationController;


// Admin and Operator Login
Route::post('/admin/login', [AuthController::class, 'login']);
Route::post('/operator/login', [AuthController::class, 'operatoLogin']);

// Password Reset
Route::middleware('auth:sanctum')->post('/reset-password', [AuthController::class, 'resetPassword']);

// Admin Logout and Dashboard
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
    Route::post('/stations', [StationController::class, 'store']);
    Route::put('/stations/{id}', [StationController::class, 'update']);
    Route::delete('/stations/{id}', [StationController::class, 'destroy']);
});
