<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;

class GameController extends Controller
{
    // Fetch all games
    public function index()
    {
        $games = Game::all();
        return response()->json($games);
    }

    // Fetch a single game by ID
    public function show($id)
    {
        $game = Game::find($id);
        if (!$game) {
            return response()->json(['message' => 'Game not found'], 404);
        }
        return response()->json($game);
    }

    // Create a new game
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'method' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'team_game' => 'required|boolean', // Now required to always get true/false
        ]);

        $game = Game::create([
            'title' => $request->title,
            'location' => $request->location,
            'method' => $request->method,
            'price' => $request->price,
            'team_game' => $request->team_game,
        ]);

        return response()->json($game, 201);
    }

    // Update an existing game
    public function update(Request $request, $id)
    {
        $game = Game::find($id);
        if (!$game) {
            return response()->json(['message' => 'Game not found'], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'method' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'team_game' => 'required|boolean',
        ]);

        // Update fields individually
        $game->title = $request->title;
        $game->location = $request->location;
        $game->method = $request->method;
        $game->price = $request->price;
        $game->team_game = $request->team_game; // works for true/false
        $game->save();

        return response()->json($game);
    }

    // Delete a game
    public function destroy($id)
    {
        $game = Game::find($id);
        if (!$game) {
            return response()->json(['message' => 'Game not found'], 404);
        }

        $game->delete();
        return response()->json(['message' => 'Game deleted successfully']);
    }

    public function checkout(Request $request, $id)
    {
        $request->validate([
            'balance' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
        ]);

        $game = Game::findOrFail($id);

        // Set the balance and discount from the checkout form
        $game->balance = $request->balance;
        $game->discount = $request->discount ?? 0;
        $game->save();

        return response()->json([
            'success' => true,
            'message' => 'Payment successful',
            'data' => $game
        ]);
    }
}
