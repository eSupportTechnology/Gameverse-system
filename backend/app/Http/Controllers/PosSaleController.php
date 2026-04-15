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

            $usedRewards = $request->used_reward ?? [];

            $subtotal = $cartItems->sum(function ($c) use ($usedRewards) {

                $isRewardItem = false;

                if (is_array($usedRewards)) {
                    foreach ($usedRewards as $rewardName) {
                        if (
                            str_contains(
                                strtolower($rewardName),
                                strtolower($c->posItem->item_name)
                            )
                        ) {
                            $isRewardItem = true;
                            break;
                        }
                    }
                }

                $price = $isRewardItem ? 0 : $c->posItem->price;

                return $price * $c->quantity;
            });

            $discount = (float) ($request->discount ?? 0);
            $total = max($subtotal - $discount, 0);

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
                'items' => json_encode($itemsArray),

                // ✅ Store used reward
                'used_reward' => json_encode($request->used_reward ?? [])
            ]);

            // Process each cart item
            foreach ($cartItems as $cart) {

                $usedRewards = $request->used_reward ?? [];

                $isRewardItem = collect($usedRewards)->contains(function ($rewardName) use ($cart) {
                    return str_contains(
                        strtolower($rewardName),
                        strtolower($cart->posItem->item_name)
                    );
                });

                $price = $isRewardItem ? 0 : $cart->posItem->price;

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'item_id' => $cart->pos_item_id,
                    'quantity' => $cart->quantity,
                    'unit_price' => $price,
                    'subtotal' => $price * $cart->quantity,
                ]);

                // Update stock and paid amount
                PosItem::where('id', $cart->pos_item_id)->update([
                    'paid_amount' => DB::raw('paid_amount + ' . ($price * $cart->quantity)),
                    'stock' => DB::raw('stock - ' . $cart->quantity),
                ]);
            }

            // Clear cart
            Cart::query()->delete();

            DB::commit();

            // Update NFC points only if customer selected AND no reward was used
            if (!empty($request->customer_id) && empty($request->used_reward)) {
                $totalQuantity = $cartItems->sum('quantity');
                $this->updateNfcPointsForPos($request->customer_id, $totalQuantity);
            }

            return response()->json([
                'success' => true,
                'message' => 'Checkout completed successfully',
                'data' => $sale
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

        $points = is_array($nfcUser->points)
            ? $nfcUser->points
            : (json_decode($nfcUser->points, true) ?? []);

        $gift = is_array($nfcUser->gift)
            ? $nfcUser->gift
            : (json_decode($nfcUser->gift, true) ?? []);

        // Ensure Foodcourt key exists
        $points['Foodcourt'] = ($points['Foodcourt'] ?? 0) + $totalQuantity;

        // Ensure reward structure exists
        if (!isset($gift['Foodcourt Reward'])) {
            $gift['Foodcourt Reward'] = [
                'count' => 0,
                'rewards' => [
                    '1 Free Coffee',
                    '1 Free Mojito',
                    '1 Free Brownie with Ice Cream'
                ]
            ];
        }

        // Add rewards
        while ($points['Foodcourt'] >= 10) {
            $gift['Foodcourt Reward']['count'] += 1;
            $points['Foodcourt'] -= 10;
        }

        $nfcUser->points = $points;
        $nfcUser->gift = $gift;
        $nfcUser->save();
    }


    public function useReward(Request $request)
    {
        $request->validate([
            'card_no' => 'required',
            'type'    => 'required',
            'sale_id' => 'nullable'
        ]);

        $user = NfcUser::where('card_no', $request->card_no)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $gift = is_array($user->gift)
            ? $user->gift
            : (json_decode($user->gift, true) ?? []);

        if (!isset($gift[$request->type]) || $gift[$request->type]['count'] <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'No reward available'
            ], 400);
        }

        // Deduct reward
        $gift[$request->type]['count'] -= 1;

        // Track used rewards
        $usedRewards = is_array($user->used_rewards)
            ? $user->used_rewards
            : (json_decode($user->used_rewards, true) ?? []);

        $usedRewards[] = [
            'type' => $request->type,
            'sale_id' => $request->sale_id ?? null,
            'used_at' => now()
        ];

        $user->gift = $gift;
        $user->used_rewards = $usedRewards;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Reward used successfully'
        ]);
    }


    public function getUserRewards($cardNo)
    {
        $user = NfcUser::where('card_no', $cardNo)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $gift = is_array($user->gift)
            ? $user->gift
            : (json_decode($user->gift, true) ?? []);

        // ✅ Filter only Foodcourt Reward
        $foodcourtReward = $gift['Foodcourt Reward'] ?? null;

        return response()->json([
            'success' => true,
            'data' => [
                'Foodcourt Reward' => $foodcourtReward
            ]
        ]);
    }
}
