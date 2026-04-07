<?php

namespace App\Http\Controllers;

use App\Models\{PosItem, PosSale, SaleItem, Cart, NfcUser};
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class PosSaleController extends Controller
{
    public function checkout(Request $request)
    {
        DB::beginTransaction();

        try {
            // Get all cart items
            $cartItems = Cart::with('posItem')->get();

            if ($cartItems->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            $subtotal = $cartItems->sum(fn($c) => $c->posItem->price * $c->quantity);
            $discount = (float) ($request->discount ?? 0);
            $total = max($subtotal - $discount, 0);

            // Prepare items array
            $itemsArray = $cartItems->map(fn($cart) => [
                'item_id' => $cart->pos_item_id,
                'quantity' => $cart->quantity
            ])->toArray();

            // Create sale
            $sale = PosSale::create([
                'customer_name' => $request->customer_name,
                'customer_id' => $request->customer_id,
                'email' => $request->email,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'items' => json_encode($itemsArray),
            ]);

            // Process each cart item
            foreach ($cartItems as $cart) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'item_id' => $cart->pos_item_id,
                    'quantity' => $cart->quantity,
                    'unit_price' => $cart->posItem->price,
                    'subtotal' => $cart->posItem->price * $cart->quantity,
                ]);

                // Update stock and paid amount
                PosItem::where('id', $cart->pos_item_id)->update([
                    'paid_amount' => DB::raw('paid_amount + ' . ($cart->posItem->price * $cart->quantity)),
                    'stock' => DB::raw('stock - ' . $cart->quantity),
                ]);
            }

            // Clear cart
            Cart::query()->delete();

            DB::commit();

            // Update NFC points only if customer selected
            if (!empty($request->customer_id)) {
                $totalQuantity = $cartItems->sum('quantity');
                $this->updateNfcPointsForPos($request->customer_id, $totalQuantity);
            }

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

    private function updateNfcPointsForPos($customerId, $totalQuantity)
    {
        $nfcUser = NfcUser::where('card_no', $customerId)->first();
        if (!$nfcUser) return;

        // Decode safely
        $points = is_array($nfcUser->points) ? $nfcUser->points : (json_decode($nfcUser->points, true) ?? []);
        $gift   = is_array($nfcUser->gift) ? $nfcUser->gift : (json_decode($nfcUser->gift, true) ?? []);

        // Increment Foodcourt points
        $points['Foodcourt'] = ($points['Foodcourt'] ?? 0) + $totalQuantity;

        // Add rewards
        while ($points['Foodcourt'] >= 10) {
            $existingRewards = array_filter($gift, fn($g) => $g['type'] === 'Foodcourt Reward');
            $rewardCount = count($existingRewards) + 1;

            $gift[] = [
                'type' => 'Foodcourt Reward',
                'rewards' => [
                    '1 Free Coffee',
                    '1 Free Mojito',
                    '1 Free Brownie with Ice Cream'
                ],
                'reward_count' => $rewardCount
            ];

            $points['Foodcourt'] -= 10;
        }

        $nfcUser->points = $points;
        $nfcUser->gift   = $gift;
        $nfcUser->save();
    }
}
