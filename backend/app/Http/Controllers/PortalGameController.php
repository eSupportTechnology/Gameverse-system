<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PortalGame;
use Illuminate\Support\Facades\Storage;

class PortalGameController extends Controller
{
    /**
     * Get all games
     */
    public function index()
    {
        $games = PortalGame::all()->map(function ($game) {
            $game->thumbnail_url = $game->thumbnail
                ? asset('storage/' . $game->thumbnail)
                : null;
            return $game;
        });

        return response()->json([
            'success' => true,
            'data' => $games
        ]);
    }

    /**
     * Store a new game
     */
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        // Trim title
        $validated['title'] = trim($validated['title']);
        
        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
        } else {
            $validated['thumbnail'] = null;
        }

        // Create game
        $game = PortalGame::create($validated);

        // Add thumbnail URL for response
        $game->thumbnail_url = $game->thumbnail
            ? asset('storage/' . $game->thumbnail)
            : null;

        return response()->json([
            'success' => true,
            'message' => 'Game created successfully',
            'data' => $game
        ], 201);
    }

    /**
     * Update an existing game (using POST)
     */
    public function update(Request $request, $id)
    {
        $game = PortalGame::findOrFail($id);

        // Validate request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        // Trim title
        $validated['title'] = trim($validated['title']);

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists
            if ($game->thumbnail && Storage::disk('public')->exists($game->thumbnail)) {
                Storage::disk('public')->delete($game->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
        } else {
            // Keep existing thumbnail if no new one provided
            $validated['thumbnail'] = $game->thumbnail;
        }

        // Update game
        $game->update($validated);

        // Add thumbnail URL for response
        $game->thumbnail_url = $game->thumbnail
            ? asset('storage/' . $game->thumbnail)
            : null;

        return response()->json([
            'success' => true,
            'message' => 'Game updated successfully',
            'data' => $game
        ]);
    }

    /**
     * Delete a game
     */
    public function destroy($id)
    {
        $game = PortalGame::findOrFail($id);

        // Delete thumbnail if exists
        if ($game->thumbnail && Storage::disk('public')->exists($game->thumbnail)) {
            Storage::disk('public')->delete($game->thumbnail);
        }

        $game->delete();

        return response()->json([
            'success' => true,
            'message' => 'Game deleted successfully'
        ]);
    }

    /**
     * Get single game
     */
    public function show($id)
    {
        $game = PortalGame::findOrFail($id);
        
        $game->thumbnail_url = $game->thumbnail
            ? asset('storage/' . $game->thumbnail)
            : null;

        return response()->json([
            'success' => true,
            'data' => $game
        ]);
    }
}