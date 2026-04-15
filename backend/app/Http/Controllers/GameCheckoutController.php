<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\GameCheckout;
use App\Models\NfcUser;
use Illuminate\Support\Facades\Log;

class GameCheckoutController extends Controller
{
    public function checkout(Request $request, $id)
    {
        $request->validate([
            'method' => 'required|array',

            'balance' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',

            'nfc_card_number' => 'nullable|string|max:255',
            'customer_name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'used_reward'       => 'nullable|sometimes',

        ]);

        $game = Game::findOrFail($id);
        $usedReward = $request->used_reward ?? null;
        if (is_string($usedReward)) {
            $usedReward = json_decode($usedReward, true);
        }

        // 🔥 CHANGED: check if reward is used
        $isUsingReward = !empty($usedReward);

        $checkout = GameCheckout::create([
            'game_id' => $game->id,
            'method' => $request->method, // ✅ store JSON
            'balance' => $request->balance,
            'discount' => $request->discount ?? 0,
            'nfc_card_number' => $request->nfc_card_number,
            'customer_name' => $request->customer_name,
            'phone_number' => $request->phone_number,
        ]);

        $methodType = $request->method['type'] ?? null;

        $value = 0;

        if ($methodType === 'Coin') {
            $value = $request->method['coins'] ?? 0;
        } elseif ($methodType === 'Arrow') {
            $value = $request->method['arrows'] ?? 0;
        } elseif ($methodType === 'Per Hour') {
            $value = $request->method['hours'] ?? 0;
        }

        // ✅ Call function
        if (
            $request->nfc_card_number &&
            $methodType &&
            !$isUsingReward   // 🔥 THIS LINE IS THE MAIN FIX
        ) {
            $this->updateNfcPointsAndGifts(
                $request->nfc_card_number,
                $methodType,
                $value
            );
        }
        return response()->json([
            'success' => true,
            'data' => $checkout
        ]);
    }
    private function updateNfcPointsAndGifts($cardNumber, $methodType, $value)
    {
        $nfcUser = NfcUser::where('card_no', $cardNumber)->first();

        if (!$nfcUser || !$methodType) return;

        $points = $nfcUser->points ?? [];
        $gift   = $nfcUser->gift ?? [];

        if (!is_array($points)) $points = [];
        if (!is_array($gift)) $gift = [];

        $category = match ($methodType) {
            'Coin'  => 'Arcade',
            'Arrow' => 'Archery',
            default => null
        };

        if (!$category) return;

        // +1 per checkout
        $points[$category] = ($points[$category] ?? 0) + 1;

        // ARCDE REWARD
        if ($category === 'Arcade' && $points[$category] >= 10) {

            $gift['Arcade Reward'] = [
                'count' => ($gift['Arcade Reward']['count'] ?? 0) + 1,
                'rewards' => ['5 Free Coins']
            ];

            $points[$category] = 0;
        }

        // ARCHERY REWARD
        if ($category === 'Archery' && $points[$category] >= 10) {

            $gift['Archery Reward'] = [
                'count' => ($gift['Archery Reward']['count'] ?? 0) + 1,
                'rewards' => ['5 Free Arrows']
            ];

            $points[$category] = 0;
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
            'game_checkout_id' => 'nullable'
        ]);

        $user = NfcUser::where('card_no', $request->card_no)->first();
        if (!$user) return response()->json(['success' => false, 'message' => 'User not found'], 404);

        // Decode gift array safely
        $gift = is_array($user->gift) ? $user->gift : (json_decode($user->gift, true) ?? []);

        if (!isset($gift[$request->type]) || $gift[$request->type]['count'] <= 0) {
            return response()->json(['success' => false, 'message' => 'No reward available'], 400);
        }

        // Reduce reward count
        $gift[$request->type]['count'] -= 1;

        // Track used rewards
        $usedRewards = is_array($user->used_rewards) ? $user->used_rewards : (json_decode($user->used_rewards, true) ?? []);
        $usedRewards[] = [
            'type' => $request->type,
            'game_checkout_id' => $request->game_checkout_id ?? null,
            'used_at' => now()
        ];

        // Save back properly
        $user->gift = $gift;
        $user->used_rewards = $usedRewards;
        $user->save();

        return response()->json(['success' => true, 'message' => 'Reward used successfully']);
    }

    public function getUserRewards($cardNo)
    {
        $user = NfcUser::where('card_no', $cardNo)->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $gift = $user->gift ?? [];

        if (!is_array($gift)) {
            $gift = json_decode($gift, true) ?? [];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'Arcade' => [
                    'count' => $gift['Arcade Reward']['count'] ?? 0,
                    'rewards' => $gift['Arcade Reward']['rewards'] ?? []
                ],
                'Archery' => [
                    'count' => $gift['Archery Reward']['count'] ?? 0,
                    'rewards' => $gift['Archery Reward']['rewards'] ?? []
                ]
            ]
        ]);
    }
}
