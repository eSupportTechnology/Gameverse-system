<?php

namespace App\Http\Controllers;

use App\Models\{PosItem, PosSale, SaleItem, Cart};
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class PosSaleController extends Controller
{
    private function userId()
    {
        return 1; // default POS user
    }
        // Checkout (create sale)
    public function checkout(Request $request)
    {
        DB::beginTransaction();

        try {
            $cartItems = Cart::with('posItem')
                ->where('user_id', $this->userId())
                ->get();

            if ($cartItems->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            $subtotal = $cartItems->sum(fn ($c) =>
                $c->posItem->price * $c->quantity
            );

            $discount = 0;
            $total = $subtotal - $discount;

            // Create sale
            $sale = PosSale::create([
                'customer_name' => $request->customer_name ?? 'Walk-in',
                'phone' => $request->phone,
                'email' => $request->email,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
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
            }

            // Clear cart
            Cart::where('user_id', $this->userId())->delete();

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
