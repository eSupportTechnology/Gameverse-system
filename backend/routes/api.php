<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;

// Public route
Route::post('/admin/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Welcome Admin']);
    });
});

// Games management routes (protected by authentication middleware)
Route::middleware('auth:sanctum')->group(function () {
    // RESTful routes for games
    Route::apiResource('games', GameController::class);
    
    // Additional routes for specific functionality
    Route::get('games/category/{category}', [GameController::class, 'getByCategory']);
});
