<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\StationController;
use App\Http\Controllers\GameController;
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

// Protected routes
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Welcome Admin']);
    });
});


Route::get('/stations', [StationController::class, 'index']);

// Protected routes (only authenticated admin)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/stations', [StationController::class, 'store']);
    Route::put('/stations/{id}', [StationController::class, 'update']);
    Route::delete('/stations/{id}', [StationController::class, 'destroy']);
});



Route::middleware('auth:sanctum')->group(function () {
    Route::get('/games', [GameController::class, 'index']);
    Route::post('/games', [GameController::class, 'store']);
    Route::get('/games/{id}', [GameController::class, 'show']);
    Route::put('/games/{id}', [GameController::class, 'update']);
    Route::delete('/games/{id}', [GameController::class, 'destroy']);
});



