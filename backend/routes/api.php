<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;

// Public route
Route::post('/admin/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // add user
    Route::post('/add-user', [AdminUserController::class, 'store']);
    // update user
    Route::put('/update-user/{id}', [AdminUserController::class, 'update']);
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
