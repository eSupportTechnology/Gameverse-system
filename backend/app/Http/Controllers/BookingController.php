<?php

namespace App\Http\Controllers;

use App\Models\Booking;
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
            $timezone = 'Asia/Colombo';

            // Convert start time to 12h format
            $data['start_time'] = $this->formatStartTimeWithPM($data['start_time']);

            $newStart = Carbon::createFromFormat(
                'Y-m-d h:i A',
                $data['booking_date'] . ' ' . $data['start_time'],
                $timezone
            );

            $newEnd = $newStart->copy()->addMinutes(
                $this->convertDurationToMinutes($data['duration'])
            );

            $existingBookings = Booking::where('station', $data['station'])
                ->whereDate('booking_date', $data['booking_date'])
                ->get();

            foreach ($existingBookings as $booking) {

                $existingStart = Carbon::createFromFormat(
                    'Y-m-d h:i A',
                    $booking->booking_date->format('Y-m-d') . ' ' . $booking->start_time,
                    $timezone
                );

                $existingEnd = $existingStart->copy()->addMinutes(
                    $this->convertDurationToMinutes($booking->duration)
                );

                // OVERLAP CHECK
                if ($newStart < $existingEnd && $newEnd > $existingStart) {

                    // Capacity logic
                    $slotCapacity = $booking->number_of_players;
                    $currentCount = $existingBookings
                        ->filter(function ($b) use ($existingStart) {
                            return $b->start_time === $existingStart->format('h:i A');
                        })
                        ->count();

                    if ($currentCount >= $slotCapacity) {
                        return response()->json([
                            'success' => false,
                            'message' => 'This time slot is fully booked'
                        ], 409);
                    }

                    // Force same number_of_players
                    $data['number_of_players'] = $slotCapacity;
                }
            }

            // First booking must define capacity
            if ($existingBookings->count() === 0 && empty($data['number_of_players'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Number of players required for first booking'
                ], 422);
            }

            $booking = Booking::create($data);

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
                'nfc_card_number' => 'nullable|string|max:255',
                'customer_name' => 'string|max:255',
                'phone_number' => 'string|max:20',
                'station' => 'string|max:255',
                'booking_date' => 'date',
                'start_time' => 'string|max:10',
                'duration' => 'string|max:20',
                'extended_time' => 'nullable|string|max:20',
                'payment_method' => 'nullable|string|max:50',
                'end_time' => 'nullable|string|max:10',
                'amount' => 'numeric|min:0',
                'status' => 'in:pending,confirmed,cancelled,completed',
                'vr_play' => 'nullable|in:yes,no',
                'number_of_players' => 'integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();

            if (isset($data['start_time'])) {
                $data['start_time'] = $this->formatStartTimeWithPM($data['start_time']);
            }

            // Overlap validation (excluding self)
            if (isset($data['station']) || isset($data['booking_date']) || isset($data['start_time'])) {

                $station = $data['station'] ?? $booking->station;
                $date = $data['booking_date'] ?? $booking->booking_date->format('Y-m-d');
                $startTime = $data['start_time'] ?? $booking->start_time;
                $duration = $data['duration'] ?? $booking->duration;

                $newStart = Carbon::createFromFormat(
                    'Y-m-d h:i A',
                    $date . ' ' . $startTime,
                    $timezone
                );

                $newEnd = $newStart->copy()->addMinutes(
                    $this->convertDurationToMinutes($duration)
                );

                $existingBookings = Booking::where('station', $station)
                    ->whereDate('booking_date', $date)
                    ->where('id', '!=', $booking->id)
                    ->get();

                foreach ($existingBookings as $b) {

                    $existingStart = Carbon::createFromFormat(
                        'Y-m-d h:i A',
                        $b->booking_date->format('Y-m-d') . ' ' . $b->start_time,
                        $timezone
                    );

                    $existingEnd = $existingStart->copy()->addMinutes(
                        $this->convertDurationToMinutes($b->duration)
                    );

                    if ($newStart < $existingEnd && $newEnd > $existingStart) {
                        return response()->json([
                            'success' => false,
                            'message' => 'This time range overlaps with another booking'
                        ], 409);
                    }
                }
            }

            $booking->update($data);

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
