<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\GameCheckout;

class GameCheckoutController extends Controller
{
    public function checkout(Request $request, $id)
    {
        $request->validate([
            'method' => 'required|array',

            'balance' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',

            'nfc_card_number' => 'nullable|string|max:255',
            'customer_name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $game = Game::findOrFail($id);

        $checkout = GameCheckout::create([
            'game_id' => $game->id,
            'method' => $request->method, // ✅ store JSON
            'balance' => $request->balance,
            'discount' => $request->discount ?? 0,
            'nfc_card_number' => $request->nfc_card_number,
            'customer_name' => $request->customer_name,
            'phone_number' => $request->phone_number,
        ]);

        return response()->json([
            'success' => true,
            'data' => $checkout
        ]);
    }
}
