<?php


namespace App\Http\Controllers;

use App\Models\{PosItem, PosSale, SaleItem};
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class PosSaleController extends Controller
{
    // ✅ Checkout (Create Sale)
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:pos_items,id',
            'items.*.qty' => 'required|integer|min:1',
            'subtotal' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'total' => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            // Create main sale record
            $sale = PosSale::create([
                'customer_name' => $validated['customer_name'] ?? 'Walk-in',
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'subtotal' => $validated['subtotal'],
                'discount' => $validated['discount'] ?? 0,
                'total' => $validated['total'],
            ]);

            // Loop through items
            foreach ($validated['items'] as $item) {
                $product = PosItem::find($item['id']);

                if ($product->stock < $item['qty']) {
                    throw new \Exception("Not enough stock for {$product->item_name}");
                }

                // Decrease stock
                $product->decrement('stock', $item['qty']);

                // Create sale item
                SaleItem::create([
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
