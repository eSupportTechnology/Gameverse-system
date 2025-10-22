<?php

namespace App\Http\Controllers;

use App\Models\OperatorPosItem;
use Illuminate\Http\Request;

class OperatorPosItemController extends Controller
{
    // ✅ Store a new Operator POS Item
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'item_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'loyality_price' => 'required|boolean',
        ]);

        // Link item to authenticated operator
        $validated['user_id'] = $request->user()->id;

        $item = OperatorPosItem::create($validated);

        return response()->json([
            'message' => 'Operator POS Item added successfully!',
            'data' => $item
        ], 201);
    }

    // ✅ Fetch all operator items
    public function index(Request $request)
    {
        try {
            // Fetch all items with user details (optional)
            $items = OperatorPosItem::with('user')->get();

            return response()->json([
                'success' => true,
                'data' => $items
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch operator items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ✅ Update operator item
    public function updateItem(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'category' => 'required|string|max:255',
                'item_name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'loyality_price' => 'required|boolean',
            ]);

            $item = OperatorPosItem::find($id);
            if (!$item) {
                return response()->json([
                    'success' => false,
                    'message' => 'Operator item not found',
                ], 404);
            }

            $item->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Operator item updated successfully',
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
                'message' => 'Failed to update operator item: ' . $e->getMessage(),
            ], 500);
        }
    }
}
