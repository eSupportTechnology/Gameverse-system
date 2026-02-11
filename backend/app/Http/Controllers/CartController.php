<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\PosItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::with('posItem')->get();

        return response()->json([
            'success' => true,
            'data' => $cart
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'pos_item_id' => 'required|exists:pos_items,id'
        ]);

        $cart = Cart::firstOrCreate(
            [
                'pos_item_id' => $request->pos_item_id
            ],
            [
                'quantity' => 0
            ]
        );

        $cart->increment('quantity');

        return response()->json(['success' => true, 'data' => $cart]);
    }

    public function decrease(Request $request)
    {
        $cart = Cart::where('pos_item_id', $request->pos_item_id)
            ->firstOrFail();

        DB::transaction(function () use ($cart) {

            PosItem::where('id', $cart->pos_item_id)->increment('stock');

            if ($cart->quantity <= 1) {
                $cart->delete();
            } else {
                $cart->decrement('quantity');
            }
        });

        return response()->json(['success' => true]);
    }

    public function remove(Request $request)
    {
        $cart = Cart::where('pos_item_id', $request->pos_item_id)
            ->firstOrFail();

        DB::transaction(function () use ($cart) {

            PosItem::where('id', $cart->pos_item_id)
                ->increment('stock', $cart->quantity);

            $cart->delete();
        });

        return response()->json(['success' => true]);
    }

    public function clear()
    {
        $carts = Cart::all();

        DB::transaction(function () use ($carts) {
            foreach ($carts as $cart) {
                PosItem::where('id', $cart->pos_item_id)
                    ->increment('stock', $cart->quantity);
                $cart->delete();
            }
        });

        return response()->json(['success' => true]);
    }
}
