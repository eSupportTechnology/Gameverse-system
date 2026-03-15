<?php

namespace App\Http\Controllers;

use App\Models\{PosItem, PosSale, SaleItem, Cart, NfcUser};
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
            // Prepare items array
            $itemsArray = $cartItems->map(function ($cart) {
                return [
                    'item_id' => $cart->pos_item_id,
                    'quantity' => $cart->quantity
                ];
            })->toArray();

            // Create sale
            $sale = PosSale::create([
                'customer_name' => $request->customer_name,
                'customer_id' => $request->customer_id,
                'email' => $request->email,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'items' => json_encode($itemsArray), // <--- important
            ]);



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
                    // Reduce stock here
                    'stock' => DB::raw('stock - ' . $cart->quantity),
                ]);
            }

            // Clear cart
            Cart::query()->delete();

            DB::commit();
            if (!empty($request->customer_id)) {
                // Total quantity = sum of all cart item quantities
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

        // Ensure points & gifts are arrays
        $points = is_array($nfcUser->points) ? $nfcUser->points : (json_decode($nfcUser->points, true) ?? []);
        $gift   = is_array($nfcUser->gift) ? $nfcUser->gift : (json_decode($nfcUser->gift, true) ?? []);

        // Increment Foodcourt points by total quantity
        $points['Foodcourt'] = ($points['Foodcourt'] ?? 0) + $totalQuantity;

        // Check if points reach 10
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

            // Reduce points by 10 for each reward
            $points['Foodcourt'] -= 10;
        }

        // Save back to user
        $nfcUser->points = $points;
        $nfcUser->gift   = $gift;
        $nfcUser->save();
    }
}
