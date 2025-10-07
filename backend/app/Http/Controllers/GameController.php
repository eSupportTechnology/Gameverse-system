<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use Illuminate\Validation\Rule;

class GameController extends Controller
{
    /**
     * Display a listing of all games or filter by category.
     */
    public function index(Request $request)
    {
        try {
            $query = Game::query();
            
            // Filter by category if provided
            if ($request->has('category') && $request->category !== 'All Games') {
                $query->where('category', $request->category);
            }
            
            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            $games = $query->latest()->get();
            
            return response()->json([
                'success' => true,
                'data' => $games,
                'message' => 'Games retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving games: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created game in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'playing_method' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'quantity' => 'nullable|integer|min:0',
                'players' => 'nullable|integer|min:0',
                'category' => ['required', Rule::in(['Arcade Machine', 'Archery', 'Carrom'])],
                'full_amount' => 'nullable|numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0',
                'balance_payment' => 'nullable|numeric|min:0',
                'status' => ['nullable', Rule::in(['Active', 'Inactive'])]
            ]);

            // Set default values for financial fields if not provided
            $validatedData['full_amount'] = $validatedData['full_amount'] ?? $validatedData['price'];
            $validatedData['discount_price'] = $validatedData['discount_price'] ?? 0;
            $validatedData['balance_payment'] = $validatedData['balance_payment'] ?? $validatedData['full_amount'];
            $validatedData['status'] = $validatedData['status'] ?? 'Active';

            $game = Game::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => $game,
                'message' => 'Game created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating game: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified game.
     */
    public function show(string $id)
    {
        try {
            $game = Game::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $game,
                'message' => 'Game retrieved successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Game not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving game: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified game in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $game = Game::findOrFail($id);
            
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'playing_method' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'quantity' => 'nullable|integer|min:0',
                'players' => 'nullable|integer|min:0',
                'category' => ['required', Rule::in(['Arcade Machine', 'Archery', 'Carrom'])],
                'full_amount' => 'nullable|numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0',
                'balance_payment' => 'nullable|numeric|min:0',
                'status' => ['nullable', Rule::in(['Active', 'Inactive'])]
            ]);

            // Update financial fields if not provided
            if (!isset($validatedData['full_amount'])) {
                $validatedData['full_amount'] = $validatedData['price'];
            }
            if (!isset($validatedData['discount_price'])) {
                $validatedData['discount_price'] = 0;
            }
            if (!isset($validatedData['balance_payment'])) {
                $validatedData['balance_payment'] = $validatedData['full_amount'];
            }
            if (!isset($validatedData['status'])) {
                $validatedData['status'] = 'Active';
            }

            $game->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => $game->fresh(),
                'message' => 'Game updated successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Game not found'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating game: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified game from storage.
     */
    public function destroy(string $id)
    {
        try {
            $game = Game::findOrFail($id);
            $game->delete();

            return response()->json([
                'success' => true,
                'message' => 'Game deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Game not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting game: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get games by category.
     */
    public function getByCategory(Request $request, string $category)
    {
        try {
            $games = Game::where('category', $category)->where('status', 'Active')->get();
            
            return response()->json([
                'success' => true,
                'data' => $games,
                'message' => 'Games retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving games: ' . $e->getMessage()
            ], 500);
        }
    }
}
