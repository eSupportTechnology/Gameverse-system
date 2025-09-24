<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;

// Public route
Route::post('/admin/login', [AuthController::class, 'login']);

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
