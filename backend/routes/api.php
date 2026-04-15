<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\StationController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PosItemController;
use App\Http\Controllers\PosSaleController;
use App\Http\Controllers\OperatorBookingController;
use App\Http\Controllers\NfcUserController;
use App\Http\Controllers\OperatorPosItemController;
use App\Http\Controllers\OperatorPosSaleController;
use App\Http\Controllers\OperaterGameController;
use App\Http\Controllers\PortalGameController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\TvScreenController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\GameCheckoutController;

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
Route::post('/auto-update-bookings', [BookingController::class, 'autoUpdateStatuses']);


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
Route::post('/stations/update-category/{type}', [StationController::class, 'updateCategory']);



Route::post('/games', [GameController::class, 'store']);
Route::put('/games/{id}', [GameController::class, 'update']);
Route::delete('/games/{id}', [GameController::class, 'destroy']);
Route::post('/games/{id}/balance', [GameController::class, 'checkout']);


// Routes for fetching games
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{id}', [GameController::class, 'show']);

Route::post('/games/{id}/play', [GameController::class, 'play']);
Route::post('/games/{id}/checkout', [GameCheckoutController::class, 'checkout']);

// Pos System  Admin

// Route::middleware('auth:sanctum')->group(function () {
Route::post('/pos/add-items', [PosItemController::class, 'store']);

Route::get('/pos/get-items', [PosItemController::class, 'index']);
Route::put('/pos/update-item/{id}', [PosItemController::class, 'updateItem']);
Route::post('/pos/checkout', [PosSaleController::class, 'checkout']);
// });

// Pos System operator
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/operator/items', [OperatorPosItemController::class, 'store']);
    Route::get('/operator/items', [OperatorPosItemController::class, 'index']);
    Route::put('/operator/items/{id}', [OperatorPosItemController::class, 'updateItem']);
    Route::post('/operator/checkout', [OperatorPosSaleController::class, 'checkout']);
});

// Operator Booking routes
Route::get('/operator-bookings', [OperatorBookingController::class, 'index']);
Route::post('/operator-bookings', [OperatorBookingController::class, 'store']);
Route::get('/operator-bookings/{id}', [OperatorBookingController::class, 'show']);
Route::put('/operator-bookings/{id}', [OperatorBookingController::class, 'update']);
Route::delete('/operator-bookings/{id}', [OperatorBookingController::class, 'destroy']);

// NFC User Management routes
Route::get('/nfc-users', [NfcUserController::class, 'index']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/nfc-users', [NfcUserController::class, 'store']);
    Route::get('/nfc-users/{id}', [NfcUserController::class, 'show']);
    Route::put('/nfc-users/{id}', [NfcUserController::class, 'update']);
    Route::delete('/nfc-users/{id}', [NfcUserController::class, 'destroy']);
    Route::patch('/nfc-users/{id}/toggle-status', [NfcUserController::class, 'toggleStatus']);
    Route::get('/nfc-users/search', [NfcUserController::class, 'search']);
});



// Operator game management routes
Route::middleware('auth:sanctum')->prefix('operator/games')->group(function () {
    Route::get('/', [OperaterGameController::class, 'index']);
    Route::post('/', [OperaterGameController::class, 'store']);
    Route::get('/{id}/edit', [OperaterGameController::class, 'edit']);
    Route::put('/{id}', [OperaterGameController::class, 'update']);
    Route::delete('/{id}', [OperaterGameController::class, 'destroy']);
});




Route::middleware('auth:sanctum')->group(function () {
    Route::get('/portal_games', [PortalGameController::class, 'index']);
    Route::post('/portal_games', [PortalGameController::class, 'store']);
    Route::post('/portal_games/{id}', [PortalGameController::class, 'update']); // Changed to POST
    Route::delete('/portal_games/{id}', [PortalGameController::class, 'destroy']);
});


// Event & Tournaments
Route::get('/events', [EventController::class, 'index']);
Route::post('/events', [EventController::class, 'store']);
Route::put('/events/{id}', [EventController::class, 'update']);
Route::delete('/events/{id}', [EventController::class, 'destroy']);

// Gallery
Route::get('/gallery', [GalleryController::class, 'index']);
Route::post('/gallery', [GalleryController::class, 'store']);
Route::delete('/gallery/{id}', [GalleryController::class, 'destroy']);

Route::get('/tv-screen', [TvScreenController::class, 'index']);
Route::post('/tv-screen', [TvScreenController::class, 'store']);
Route::patch('/tv-screen/{id}/toggle', [TvScreenController::class, 'toggleStatus']);
Route::delete('/tv-screen/{id}', [TvScreenController::class, 'destroy']);


Route::prefix('cart')->group(function () {

    Route::get('/', [CartController::class, 'index']);       // GET cart
    Route::post('/add', [CartController::class, 'add']);     // + add item
    Route::post('/decrease', [CartController::class, 'decrease']); // - decrease qty
    Route::post('/remove', [CartController::class, 'remove']); // delete item
    Route::post('/clear', [CartController::class, 'clear']); // clear cart

});

Route::get('/reports/new-customers', [ReportsController::class, 'newCustomersCount']);
Route::get('/reports/total-bookings', [ReportsController::class, 'totalBookingsCount']);

// Route::get('/reports/total-sales', [ReportsController::class, 'totalSales']);
Route::get('/reports/products-sold', [ReportsController::class, 'productsSold']);
Route::get('/reports/sales-chart', [ReportsController::class, 'salesChart']);

Route::get('/reports/total-bookings-amount', [ReportsController::class, 'totalBookingsAmount']);
Route::get('/reports/total-games-amount', [ReportsController::class, 'totalGamesAmount']);
Route::get('/reports/total-pos-amount', [ReportsController::class, 'totalPosAmount']);

Route::get('/reports/export-doc', [ReportsController::class, 'exportDoc']);
Route::get('/nfc-users/by-card/{cardNo}', [NfcUserController::class, 'getByCard']);

//booking rewards
Route::get('/rewards/{cardNo}', [BookingController::class, 'getUserRewards']);
Route::post('/use-reward', [BookingController::class, 'useReward']);

//pos rewards
Route::get('/rewards/{cardNo}', [PosSaleController::class, 'getUserRewards']);
Route::post('/use-reward', [PosSaleController::class, 'useReward']);

//game rewards
Route::get('/rewards/{cardNo}', [GameCheckoutController::class, 'getUserRewards']);
Route::post('/use-reward', [GameCheckoutController::class, 'useReward']);
