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
            'method' => 'required',
            'price' => 'required|numeric|min:0',
            'team_game' => 'required|boolean',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $thumbnailPath = null;

        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('games', 'public');
        }

        $game = Game::create([
            'title' => $request->title,
            'location' => $request->location,
            'method' => $request->method,
            'price' => $request->price,
            'team_game' => $request->team_game,
            'description' => $request->description,
            'thumbnail' => $thumbnailPath,
        ]);

        return response()->json($game, 201);
    }

    // Update an existing game
    public function update(Request $request, $id)
    {
        $game = Game::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'method' => 'required',
            'price' => 'required|numeric|min:0',
            'team_game' => 'required|boolean',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('games', 'public');
            $game->thumbnail = $thumbnailPath;
        }

        $game->update([
            'title' => $request->title,
            'location' => $request->location,
            'method' => $request->method,
            'price' => $request->price,
            'team_game' => $request->team_game,
            'description' => $request->description,
        ]);

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

    // Update game method based on play type
    public function play(Request $request, $id)
    {
        $game = Game::findOrFail($id);

        if ($request->type === 'Per Hour') {
            $game->method = [
                'type' => 'Per Hour',
                'hours' => (int) $request->hours,
                'players' => (int) $request->players,
            ];
        }

        if ($request->type === 'Coin') {
            $game->method = [
                'type' => 'Coin',
                'coins' => (int) $request->coins,
            ];
        }

        if ($request->type === 'Arrow') {
            $game->method = [
                'type' => 'Arrow',
                'arrows' => (int) $request->arrows,
            ];
        }

        $game->save();

        return response()->json([
            'message' => 'Method updated',
            'method' => $game->method,
        ]);
    }
}
