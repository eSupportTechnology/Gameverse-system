<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\PosItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
     // POS default user id
    private function userId()
    {
        return 1;
    }

    public function index()
    {
        $cart = Cart::with('posItem')
            ->where('user_id', $this->userId())
            ->get();

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

    DB::transaction(function () use ($request) {

        $item = PosItem::lockForUpdate()->findOrFail($request->pos_item_id);

        if ($item->stock <= 0) {
            abort(400, 'Out of stock');
        }

        $cart = Cart::where('user_id', $this->userId())
                    ->where('pos_item_id', $item->id)
                    ->first();

        if ($cart) {
            // Increase cart quantity by 1
            $cart->quantity += 1;
            $cart->save();
        } else {
            // Create new cart entry 
            Cart::create([
                'user_id' => $this->userId(),
                'pos_item_id' => $item->id,
                'quantity' => 1
            ]);
        }

        // Reduce stock by 1
        $item->decrement('stock', 1);
    });

    return response()->json(['success' => true]);
}


    public function decrease(Request $request)
    {
        $cart = Cart::where('user_id', $this->userId())
            ->where('pos_item_id', $request->pos_item_id)
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
        $cart = Cart::where('user_id', $this->userId())
            ->where('pos_item_id', $request->pos_item_id)
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
        $carts = Cart::where('user_id', $this->userId())->get();

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
