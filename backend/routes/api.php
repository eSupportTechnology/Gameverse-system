<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\StationController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PosItemController;
use App\Http\Controllers\PosSaleController;


// Public route
Route::post('/admin/login', [AuthController::class, 'login']);
Route::post('/operator/login', [AuthController::class, 'operatoLogin']);
// routes/api.php
Route::middleware('auth:sanctum')->post('/reset-password', [AuthController::class, 'resetPassword']);


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


