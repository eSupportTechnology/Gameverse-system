<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index()
    {
        return response()->json(Game::all());
    }

    public function show($id)
    {
        $game = Game::findOrFail($id);
        return response()->json($game);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'location' => 'required|string',
            'method' => 'required|in:Coin,Arrow,Per Hour',
            'price' => 'required|integer|min:0',
        ]);

        $game = Game::create($request->only(['title','location','method','price']));
        return response()->json($game, 201);
    }

    public function update(Request $request, $id)
    {
        $game = Game::findOrFail($id);

        $request->validate([
            'title' => 'required|string',
            'location' => 'required|string',
            'method' => 'required|in:Coin,Arrow,Per Hour',
            'price' => 'required|integer|min:0',
        ]);

        $game->update($request->only(['title','location','method','price']));
        return response()->json($game);
    }

    public function destroy($id)
    {
        $game = Game::findOrFail($id);
        $game->delete();
        return response()->json(['message' => 'Game deleted successfully.']);
    }
}
