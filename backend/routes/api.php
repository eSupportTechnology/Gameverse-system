<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\OperatorBookingController;
use App\Http\Controllers\StationController;
use App\Http\Controllers\GameController;


// Admin and Operator Login
Route::post('/admin/login', [AuthController::class, 'login']);
Route::post('/operator/login', [AuthController::class, 'operatoLogin']);

// Public station routes
Route::get('/stations', [StationController::class, 'index']);

// Public booking routes (operator or customer side)
Route::get('/bookings', [OperatorBookingController::class, 'index']);
Route::get('/bookings/{id}', [OperatorBookingController::class, 'show']);
Route::post('/bookings', [OperatorBookingController::class, 'store']);
Route::put('/bookings/{id}', [OperatorBookingController::class, 'update']);
Route::put('/bookings/{id}/cancel', [OperatorBookingController::class, 'cancel']);
Route::put('/bookings/{id}/update-time', [OperatorBookingController::class, 'updateTime']);

// Games - public view
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{id}', [GameController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {

    // Reset password
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Admin logout and dashboard
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/dashboard', fn() => response()->json(['message' => 'Welcome Admin']));

        // User management
        Route::post('/add-user', [AdminUserController::class, 'store']);
        Route::put('/update-user/{id}', [AdminUserController::class, 'update']);
        Route::delete('/delete-user/{id}', [AdminUserController::class, 'delete']);

        // Station management
        Route::post('/stations', [StationController::class, 'store']);
        Route::put('/stations/{id}', [StationController::class, 'update']);
        Route::delete('/stations/{id}', [StationController::class, 'destroy']);

        // Game management
        Route::post('/games', [GameController::class, 'store']);
        Route::put('/games/{id}', [GameController::class, 'update']);
        Route::delete('/games/{id}', [GameController::class, 'destroy']);
    });
});

// Fetch all users (optional if you want public access)
Route::get('/users', [AdminUserController::class, 'fetchUsers']);