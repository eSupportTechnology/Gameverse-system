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


// Public route
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

// Pos System 
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/pos/add-items', [PosItemController::class, 'store']);
    Route::get('/pos/get-items', [PosItemController::class, 'index']);
    Route::put('/pos/update-item/{id}', [PosItemController::class, 'updateItem']);
    Route::post('/pos/checkout', [PosSaleController::class, 'checkout']);
});


