<?php

namespace App\Http\Controllers;

use App\Models\{OperatorPosItem, OperatorPosSale, OperatorSaleItem};
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class OperatorPosSaleController extends Controller
{
    // ✅ Checkout (Create Operator Sale)
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:operator_pos_items,id',
            'items.*.qty' => 'required|integer|min:1',
            'subtotal' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'total' => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            // Create main operator sale record
            $sale = OperatorPosSale::create([
                'customer_name' => $validated['customer_name'] ?? 'Walk-in',
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'subtotal' => $validated['subtotal'],
                'discount' => $validated['discount'] ?? 0,
                'total' => $validated['total'],
            ]);

            // Loop through items
            foreach ($validated['items'] as $item) {
                $product = OperatorPosItem::find($item['id']);

                if ($product->stock < $item['qty']) {
                    throw new \Exception("Not enough stock for {$product->item_name}");
                }

                // Decrease stock
                $product->decrement('stock', $item['qty']);

                // Create operator sale item
                OperatorSaleItem::create([
                    'sale_id' => $sale->id,
                    'item_id' => $product->id,
                    'quantity' => $item['qty'],
                    'unit_price' => $product->price,
                    'subtotal' => $product->price * $item['qty'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Checkout completed successfully!',
                'data' => $sale->load('items.item'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
