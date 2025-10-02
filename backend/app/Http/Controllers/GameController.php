<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GameController extends Controller
{
    // ✅ List all games
    public function index()
    {
        return response()->json(Game::all(), 200);
    }

    // ✅ Create new game
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'coin' => 'required|integer',
            'price' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $game = Game::create($request->only(['title', 'location', 'coin', 'price']));

        return response()->json($game, 201);
    }

    // ✅ Show single game
    public function show($id)
    {
        $game = Game::find($id);

        if (!$game) {
            return response()->json(['message' => 'Game not found'], 404);
        }

        return response()->json($game, 200);
    }

    // ✅ Update game
    public function update(Request $request, $id)
    {
        $game = Game::find($id);

        if (!$game) {
            return response()->json(['message' => 'Game not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'coin' => 'sometimes|required|integer',
            'price' => 'sometimes|required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $game->update($request->only(['title', 'location', 'coin', 'price']));

        return response()->json($game, 200);
    }

    // ✅ Delete game
    public function destroy($id)
    {
        $game = Game::find($id);

        if (!$game) {
            return response()->json(['message' => 'Game not found'], 404);
        }

        $game->delete();

        return response()->json(['message' => 'Game deleted successfully'], 200);
    }
}
