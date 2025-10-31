<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OperaterGame;
use Illuminate\Support\Facades\Auth;

class OperaterGameController extends Controller
{
    /**
     * GET /operator/games
     * Fetch only games created by the logged-in operator
     */
    public function index(Request $request)
    {
        $operator = $request->user(); // get operator from token
        $games = OperaterGame::where('operator_id', $operator->id)->get();

        return response()->json([
            'success' => true,
            'data' => $games
        ]);
    }

    /**
     * GET /operator/games/create
     */
    public function create()
    {
        return response()->json([
            'success' => true,
            'message' => 'Ready to create a new game'
        ]);
    }

    /**
     * POST /operator/games
     */
    public function store(Request $request)
    {
        $operator = $request->user(); // get operator from token

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'method' => 'required|in:Coin,Arrow,Per Hour',
            'price' => 'required|numeric|min:0'
        ]);

        $game = OperaterGame::create([
            'operator_id' => $operator->id,
            'title' => $validated['title'],
            'location' => $validated['location'],
            'method' => $validated['method'],
            'price' => $validated['price'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $game
        ], 201);
    }

    /**
     * GET /operator/games/{id}/edit
     */
    public function edit(Request $request, $id)
    {
        $operator = $request->user();
        $game = OperaterGame::where('id', $id)
            ->where('operator_id', $operator->id)
            ->first();

        if (!$game) {
            return response()->json([
                'success' => false,
                'message' => 'Game not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $game
        ]);
    }

    /**
     * PUT /operator/games/{id}
     */
    public function update(Request $request, $id)
    {
        $operator = $request->user();
        $game = OperaterGame::where('id', $id)
            ->where('operator_id', $operator->id)
            ->first();

        if (!$game) {
            return response()->json([
                'success' => false,
                'message' => 'Game not found'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'method' => 'sometimes|required|in:Coin,Arrow,Per Hour',
            'price' => 'sometimes|required|numeric|min:0'
        ]);

        $game->update($validated);

        return response()->json([
            'success' => true,
            'data' => $game
        ]);
    }

    /**
     * DELETE /operator/games/{id}
     */
    public function destroy(Request $request, $id)
    {
        $operator = $request->user();
        $game = OperaterGame::where('id', $id)
            ->where('operator_id', $operator->id)
            ->first();

        if (!$game) {
            return response()->json([
                'success' => false,
                'message' => 'Game not found'
            ], 404);
        }

        $game->delete();

        return response()->json([
            'success' => true,
            'message' => 'Game deleted successfully'
        ]);
    }
}
