<?php

namespace App\Http\Controllers;

use App\Models\{PosItem, PosSale, SaleItem, Cart};
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class PosSaleController extends Controller
{
    // Checkout (create sale)
    public function checkout(Request $request)
    {
        DB::beginTransaction();

        try {
            // Get all cart items (global POS cart)
            $cartItems = Cart::with('posItem')->get();

            if ($cartItems->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            $subtotal = $cartItems->sum(function ($c) {
                return $c->posItem->price * $c->quantity;
            });

            $discount = (float) ($request->discount ?? 0);
            $total = max($subtotal - $discount, 0);


            // Create sale
            $sale = PosSale::create([
                'customer_name' => $request->customer_name ?: 'Walk-in',
                'customer_id'   => $request->customer_id,
                'subtotal'      => $subtotal,
                'discount'      => $discount,
                'total'         => $total,
            ]);


            // Create sale items
            foreach ($cartItems as $cart) {

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'item_id' => $cart->pos_item_id,
                    'quantity' => $cart->quantity,
                    'unit_price' => $cart->posItem->price,
                    'subtotal' => $cart->posItem->price * $cart->quantity,
                ]);

                // Update paid amount
                PosItem::where('id', $cart->pos_item_id)->update([
                    'paid_amount' => DB::raw(
                        'paid_amount + ' . ($cart->posItem->price * $cart->quantity)
                    ),
                ]);
            }

            // Clear cart
            Cart::query()->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Checkout completed successfully',
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
