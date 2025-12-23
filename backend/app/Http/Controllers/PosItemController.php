<?php

namespace App\Http\Controllers;

use App\Models\PosItem;
use Illuminate\Http\Request;

class PosItemController extends Controller
{
    // Add a new POS item (Protected by Sanctum)
    public function store(Request $request)
    {
        // Validate input (no need to send user_id now)
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'item_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'loyality_price' => 'required|boolean',
        ]);

        // Automatically link the item to the authenticated user
        // $validated['user_id'] = $request->user()->id;
        // For now, we set a default user_id.
        $validated['user_id'] = 1;

        $item = PosItem::create($validated);

        return response()->json([
            'message' => 'POS Item added successfully!',
            'data' => $item
        ], 201);
    }

    public function index(Request $request)
    {
        try {
            // Fetch all items with related user details (optional)
            $items = PosItem::with('user')->get();

            return response()->json([
                'success' => true,
                'data' => $items
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update item
    public function updateItem(Request $request, $id)
    {
        try {
            // Validate request data
            $validated = $request->validate([
                'category' => 'required|string|max:255',
                'item_name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'loyality_price' => 'required|boolean',
            ]);

            // Find the item
            $item = PosItem::find($id);
            if (!$item) {
                return response()->json([
                    'success' => false,
                    'message' => 'Item not found',
                ], 404);
            }

            // Update fields
            $item->update([
                'category' => $validated['category'],
                'item_name' => $validated['item_name'],
                'price' => $validated['price'],
                'stock' => $validated['stock'],
                'loyality_price' => $validated['loyality_price'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Item updated successfully',
                'data' => $item,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update item: ' . $e->getMessage(),
            ], 500);
        }
    }
}
