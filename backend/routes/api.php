<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;
// use App\Http\Controllers\BookingController;
use App\Http\Controllers\StationController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PosItemController;
use App\Http\Controllers\PosSaleController;
use App\Http\Controllers\OperatorBookingController;


// Public route
Route::post('/admin/login', [AuthController::class, 'login']);
Route::post('/operator/login', [AuthController::class, 'operatoLogin']);
// routes/api.php
Route::middleware('auth:sanctum')->post('/reset-password', [AuthController::class, 'resetPassword']);


Route::middleware('auth:sanctum')->group(function () {
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


Route::get('/stations', [StationController::class, 'index']);

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

// Pos System 
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/pos/add-items', [PosItemController::class, 'store']);
    Route::get('/pos/get-items', [PosItemController::class, 'index']);
    Route::put('/pos/update-item/{id}', [PosItemController::class, 'updateItem']);
    Route::post('/pos/checkout', [PosSaleController::class, 'checkout']);
});

// Operator Booking routes
Route::get('/bookings', [OperatorBookingController::class, 'index']);
Route::get('/bookings/{id}', [OperatorBookingController::class, 'show']);
Route::post('/bookings', [OperatorBookingController::class, 'store']);
Route::put('/bookings/{id}', [OperatorBookingController::class, 'update']);
Route::put('/bookings/{id}/cancel', [OperatorBookingController::class, 'cancel']);
Route::put('/bookings/{id}/update-time', [OperatorBookingController::class, 'updateTime']);


// NFC User Management routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/nfc-users', [NfcUserController::class, 'index']);
    Route::post('/nfc-users', [NfcUserController::class, 'store']);
    Route::get('/nfc-users/{id}', [NfcUserController::class, 'show']);
    Route::put('/nfc-users/{id}', [NfcUserController::class, 'update']);
    Route::delete('/nfc-users/{id}', [NfcUserController::class, 'destroy']);
    Route::patch('/nfc-users/{id}/toggle-status', [NfcUserController::class, 'toggleStatus']);
    Route::get('/nfc-users/search', [NfcUserController::class, 'search']);
});

