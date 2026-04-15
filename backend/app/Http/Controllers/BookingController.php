<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\NfcUser;
use App\Models\Station;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $bookings = Booking::orderBy('created_at', 'desc')->get()->map(function ($b) {
            // Normalize booking_date: Y-m-d format
            $bookingDate = $b->booking_date ? $b->booking_date->format('Y-m-d') : null;

            // Normalize start_time: 24h format
            $startTime = $b->start_time;
            if ($startTime && !preg_match('/AM|PM/i', $startTime)) {
                // assume already 24h format
            } elseif ($startTime) {
                // convert 12h to 24h
                $dt = Carbon::createFromFormat('h:i A', $startTime);
                $startTime = $dt->format('H:i');
            }

            return [
                'id' => $b->id,
                'customer_name' => $b->customer_name,
                'phone_number' => $b->phone_number,
                'station' => $b->station,
                'booking_date' => $bookingDate,
                'start_time' => $startTime,
                'duration' => $b->duration,
                'extended_time' => $b->extended_time ?? '0m',
                'status' => $b->status,
                'amount' => $b->amount,
                'number_of_players' => $b->number_of_players ?? 1,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nfc_card_number'   => 'nullable|string|max:255',
            'customer_name'     => 'required|string|max:255',
            'phone_number'      => 'required|string|max:20',
            'station'           => 'required|string|max:255',
            'booking_date'      => 'required|date',
            'start_time'        => 'required|string|max:10',
            'duration'          => 'required|string|max:20',
            'amount'            => 'required|numeric|min:0',
            'vr_play'           => 'nullable|in:yes,no',
            'number_of_players' => 'nullable|integer|min:1',
            'used_reward'       => 'nullable|sometimes',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {

            $data = $validator->validated();
            $data['used_reward'] = $request->used_reward ?? null;
            $timezone = 'Asia/Colombo';

            // Format start time
            $data['start_time'] = $this->formatStartTimeWithPM($data['start_time']);

            // Calculate new booking start & end
            $newStart = Carbon::createFromFormat(
                'Y-m-d h:i A',
                $data['booking_date'] . ' ' . $data['start_time'],
                $timezone
            );

            $newEnd = $newStart->copy()->addMinutes(
                $this->convertDurationToMinutes($data['duration'])
            );

            // Get station info
            $station = Station::where('name', $data['station'])->first();

            if (!$station) {
                return response()->json([
                    'success' => false,
                    'message' => 'Station not found'
                ], 404);
            }

            // Get existing bookings for that station and date
            $existingBookings = Booking::where('station', $data['station'])
                ->whereDate('booking_date', $data['booking_date'])
                ->get();

            $slotBookings = collect();

            foreach ($existingBookings as $booking) {

                $existingStart = Carbon::createFromFormat(
                    'Y-m-d h:i A',
                    $booking->booking_date->format('Y-m-d') . ' ' . $booking->start_time,
                    $timezone
                );

                $existingEnd = $existingStart->copy()->addMinutes(
                    $this->convertDurationToMinutes($booking->duration)
                );

                if ($newStart < $existingEnd && $newEnd > $existingStart) {
                    $slotBookings->push($booking);
                }
            }

            $stationType = $station->type;

            /*
        |--------------------------------------------------------------------------
        | POOL / SIMULATOR
        |--------------------------------------------------------------------------
        */

            if (in_array($stationType, ['Pool', 'Simulator'])) {

                if ($slotBookings->count() > 0) {
                    return response()->json([
                        'success' => false,
                        'message' => 'This station is already booked for this time'
                    ], 409);
                }
            }

            /*
        |--------------------------------------------------------------------------
        | PLAYSTATION
        |--------------------------------------------------------------------------
        */

            if ($stationType === 'PlayStation') {

                // Get bookings only for same slot
                $slotBookings = Booking::where('station', $data['station'])
                    ->whereDate('booking_date', $data['booking_date'])
                    ->where('start_time', $data['start_time'])
                    ->get();

                // FIRST BOOKING
                if ($slotBookings->count() === 0) {

                    if (empty($data['number_of_players'])) {
                        return response()->json([
                            'success' => false,
                            'message' => 'First PlayStation booking must define number of players'
                        ], 422);
                    }
                } else {

                    $capacity = $slotBookings->first()->number_of_players;

                    if ($slotBookings->count() >= $capacity) {
                        return response()->json([
                            'success' => false,
                            'message' => 'This slot is fully booked'
                        ], 409);
                    }

                    // Force same capacity
                    $data['number_of_players'] = $capacity;
                }
            }
            // Create booking
            $booking = Booking::create($data);
            // Update NFC points and gifts

            if (
                !empty($data['nfc_card_number']) &&
                empty($data['used_reward'])
            ) {
                $this->updateNfcPointsAndGifts(
                    $data['nfc_card_number'],
                    $data['station']
                );
            }
            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'data'    => $booking
            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking',
                'error'   => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $booking = Booking::findOrFail($id);
            $timezone = 'Asia/Colombo';

            $validator = Validator::make($request->all(), [
                'nfc_card_number'   => 'nullable|string|max:255',
                'customer_name'     => 'string|max:255',
                'phone_number'      => 'string|max:20',
                'station'           => 'string|max:255',
                'booking_date'      => 'date',
                'start_time'        => 'string|max:10',
                'duration'          => 'string|max:20',
                'extended_time'     => 'nullable|string|max:20',
                'payment_method'    => 'nullable|string|max:50',
                'amount'            => 'numeric|min:0',
                'status'            => 'in:pending,confirmed,cancelled,completed',
                'vr_play'           => 'nullable|in:yes,no',
                'number_of_players' => 'integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors'  => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();

            if (isset($data['start_time'])) {
                $data['start_time'] = $this->formatStartTimeWithPM($data['start_time']);
            }

            // Use updated or existing values
            $stationName = $data['station'] ?? $booking->station;
            $bookingDate = $data['booking_date'] ?? $booking->booking_date->format('Y-m-d');
            $startTime   = $data['start_time'] ?? $booking->start_time;
            $duration    = $data['duration'] ?? $booking->duration;

            $newStart = Carbon::createFromFormat('Y-m-d h:i A', $bookingDate . ' ' . $startTime, $timezone);
            $newEnd   = $newStart->copy()->addMinutes($this->convertDurationToMinutes($duration));

            // Get station info
            $station = Station::where('name', $stationName)->first();
            if (!$station) {
                return response()->json([
                    'success' => false,
                    'message' => 'Station not found'
                ], 404);
            }

            $stationType = $station->type;

            // Get all existing bookings for the same station and date, excluding current booking
            $existingBookings = Booking::where('station', $stationName)
                ->whereDate('booking_date', $bookingDate)
                ->where('id', '!=', $booking->id)
                ->get();

            $slotBookings = collect();
            foreach ($existingBookings as $b) {
                $existingStart = Carbon::createFromFormat(
                    'Y-m-d h:i A',
                    $b->booking_date->format('Y-m-d') . ' ' . $b->start_time,
                    $timezone
                );
                $existingEnd = $existingStart->copy()->addMinutes($this->convertDurationToMinutes($b->duration));

                if ($newStart < $existingEnd && $newEnd > $existingStart) {
                    $slotBookings->push($b);
                }
            }

            // -----------------------------------
            // Pool / Simulator logic
            // -----------------------------------
            if (in_array($stationType, ['Pool', 'Simulator'])) {
                if ($slotBookings->count() > 0) {
                    return response()->json([
                        'success' => false,
                        'message' => 'This station is already booked for this time'
                    ], 409);
                }
            }

            // -----------------------------------
            // PlayStation logic
            // -----------------------------------
            if ($stationType === 'PlayStation') {

                // Filter for exact start time
                $slotBookings = Booking::where('station', $stationName)
                    ->whereDate('booking_date', $bookingDate)
                    ->where('start_time', $startTime)
                    ->where('id', '!=', $booking->id)
                    ->get();

                if ($slotBookings->count() === 0) {
                    // First booking
                    if (empty($data['number_of_players'])) {
                        return response()->json([
                            'success' => false,
                            'message' => 'First PlayStation booking must define number of players'
                        ], 422);
                    }
                } else {
                    $capacity = $slotBookings->first()->number_of_players;

                    if ($slotBookings->count() >= $capacity) {
                        return response()->json([
                            'success' => false,
                            'message' => 'This slot is fully booked'
                        ], 409);
                    }

                    // Force same capacity for consistency
                    $data['number_of_players'] = $capacity;
                }
            }

            // Update booking
            $booking->update($data);
            // Update NFC points and gifts if NFC card provided
            if (!empty($data['nfc_card_number'])) {
                $this->updateNfcPointsAndGifts($data['nfc_card_number'], $stationName);
            }
            return response()->json([
                'success' => true,
                'message' => 'Booking updated successfully',
                'data' => $booking
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    private function updateNfcPointsAndGifts($cardNumber, $station)
    {
        $nfcUser = NfcUser::where('card_no', $cardNumber)->first();
        if (!$nfcUser) return;

        // Safely decode points & gifts
        $points = is_array($nfcUser->points) ? $nfcUser->points : (json_decode($nfcUser->points, true) ?? []);
        $gift   = is_array($nfcUser->gift)   ? $nfcUser->gift   : (json_decode($nfcUser->gift, true) ?? []);

        // Increment point for this station
        $points[$station] = ($points[$station] ?? 0) + 1;

        $rewardRules = [
            'PlayStation' => [
                'stations' => ['PS5 Station 1', 'PS5 Station 2', 'PS5 Station 3', 'PS5 Station 4', 'PS5 Station 5'],
                'rewards' => ['1 hour free PlayStation (VR not included)', '1 hour free Racing Simulator (VR not included)']
            ],
            'Racing Simulator' => [
                'stations' => ['Racing Simulator 1', 'Racing Simulator 2', 'Racing Simulator 3', 'Racing Simulator 4'],
                'rewards' => ['1 hour free Racing Simulator (VR not included)', '1 hour free PlayStation (VR not included)']
            ],
            'Supreme Billiard' => [
                'stations' => ['Supreme Billiard 1', 'Supreme Billiard 2'],
                'rewards' => ['1 hour free Billiards (Supreme zones)', '1 hour free PlayStation (VR not included)', '1 hour free Racing Simulator (VR not included)']
            ],
            'Premium Billiard' => [
                'stations' => ['Premium Billiard 1', 'Premium Billiard 2', 'Premium Billiard 3'],
                'rewards' => ['1 hour free Billiards (Premium zones)', '1 hour free PlayStation (VR not included)', '30 min free Racing Simulator (VR not included)']
            ]
        ];

        foreach ($rewardRules as $type => $rule) {
            $totalPoints = 0;
            foreach ($rule['stations'] as $s) {
                $totalPoints += $points[$s] ?? 0;
            }

            if ($totalPoints >= 10) {
                $key = "$type Reward";
                if (!isset($gift[$key])) {
                    $gift[$key] = [
                        'count' => 0,
                        'rewards' => $rule['rewards']
                    ];
                }
                $gift[$key]['count'] += 1;

                // Reset points
                foreach ($rule['stations'] as $s) {
                    $points[$s] = 0;
                }
            }
        }

        // Save back properly
        $nfcUser->points = $points;
        $nfcUser->gift   = $gift;
        $nfcUser->save();
    }

    public function useReward(Request $request)
    {
        $request->validate([
            'card_no' => 'required',
            'type'    => 'required',
            'booking_id' => 'nullable'
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
            'booking_id' => $request->booking_id ?? null,
            'used_at' => now()
        ];

        // Save back properly
        $user->gift = $gift;
        $user->used_rewards = $usedRewards;
        $user->save();

        return response()->json(['success' => true, 'message' => 'Reward used successfully']);
    }
    private function filterStationRewards($gift)
    {
        $allowedKeys = [
            'PlayStation Reward',
            'Racing Simulator Reward',
            'Supreme Billiard Reward',
            'Premium Billiard Reward',
        ];

        return collect($gift)
            ->only($allowedKeys)
            ->toArray();
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

        // ✅ Filter ONLY station rewards
        $filteredGift = $this->filterStationRewards($gift);

        return response()->json([
            'success' => true,
            'data' => $filteredGift
        ]);
    }
    /**
     * Private helper to format start_time in 12-hour PM format
     */
    private function formatStartTimeWithPM($time)
    {
        $time = trim($time);
        if (!str_contains($time, ':')) {
            $time .= ':00';
        }

        [$hour, $minute] = explode(':', $time);
        $hour = (int)$hour;

        // Since slots start from 12 PM, assume PM
        if ($hour < 12) {
            $hour += 12;
        }

        return Carbon::createFromFormat('H:i', sprintf('%02d:%02d', $hour, $minute))
            ->format('h:i A');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $booking = Booking::findOrFail($id);

            $normalizedBooking = [
                'id' => $booking->id,
                'nfc_card_number' => $booking->nfc_card_number,
                'customer_name' => $booking->customer_name,
                'phone_number' => $booking->phone_number,
                'station' => $booking->station,
                'booking_date' => $booking->booking_date ? $booking->booking_date->format('Y-m-d') : null,
                'start_time' => $booking->start_time,
                'duration' => $booking->duration,
                'amount' => $booking->amount,
                'status' => $booking->status,
                'vr_play' => $booking->vr_play,
                'extended_time' => $booking->extended_time ?? '',
                'payment_method' => $booking->payment_method ?? '',
                'created_at' => $booking->created_at,
                'updated_at' => $booking->updated_at,

                // Backward compatibility aliases
                'date' => $booking->booking_date ? $booking->booking_date->format('Y-m-d') : null,
                'time' => $booking->start_time,
                'phone' => $booking->phone_number,
                'user' => $booking->customer_name,
                'price' => $booking->amount,
                'number_of_players' => $booking->number_of_players ?? 1,
            ];

            return response()->json([
                'success' => true,
                'data' => $normalizedBooking
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }
    }


    public function destroy(string $id): JsonResponse
    {
        try {
            $booking = Booking::findOrFail($id);
            $booking->delete();

            return response()->json([
                'success' => true,
                'message' => 'Booking deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete booking'
            ], 500);
        }
    }

    public function autoUpdateStatuses()
    {
        $bookings = Booking::all();
        $timezone = 'Asia/Colombo';
        $now = Carbon::now($timezone);

        Log::info("Server timezone: {$timezone}");
        Log::info("Carbon now: " . $now->format('h:i A'));

        foreach ($bookings as $booking) {
            try {
                if (!$booking->booking_date || !$booking->start_time) {
                    Log::warning("Booking {$booking->id} missing date or start time.");
                    continue;
                }

                // Normalize start time: assume PM if no AM/PM
                $startTime = $booking->start_time;
                if (!preg_match('/AM|PM/i', $startTime)) {
                    $timeParts = explode(':', $startTime);
                    $hour = (int) $timeParts[0];
                    $minute = $timeParts[1] ?? '00';

                    if ($hour < 12) {
                        $hour += 12;
                    }

                    $startTime = $hour . ':' . $minute;
                }

                // Parse booking start datetime
                $bookingDate = Carbon::parse($booking->booking_date, $timezone)->format('Y-m-d');
                $start = Carbon::parse("{$bookingDate} {$startTime}", $timezone);

                // Calculate total duration
                $durationMinutes = $this->convertDurationToMinutes($booking->duration);
                $extendedMinutes = $this->convertDurationToMinutes($booking->extended_time ?? '');
                $totalMinutes = $durationMinutes + $extendedMinutes;

                $end = $start->copy()->addMinutes($totalMinutes);

                // Update status
                if ($now->between($start, $end)) {
                    $booking->status = 'confirmed';
                } elseif ($now->greaterThan($end)) {
                    $booking->status = 'completed';
                } else {
                    $booking->status = 'pending';
                }

                $booking->save();

                Log::info(
                    "Booking {$booking->id}: start={$start->format('h:i A')}, " .
                        "end={$end->format('h:i A')}, now={$now->format('h:i A')}, status={$booking->status}"
                );
            } catch (\Exception $e) {
                Log::error("Error updating booking {$booking->id}: " . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Statuses updated successfully',
        ]);
    }

    private function convertDurationToMinutes($duration)
    {
        if (!$duration) return 0;

        preg_match('/(?:(\d+)h)?\s*(?:(\d+)m)?/', $duration, $matches);

        $hours = isset($matches[1]) ? (int) $matches[1] : 0;
        $minutes = isset($matches[2]) ? (int) $matches[2] : 0;

        return ($hours * 60) + $minutes;
    }
}
