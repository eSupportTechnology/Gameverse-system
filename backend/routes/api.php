<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Public route
Route::post('/admin/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Welcome Admin']);
    });
});
