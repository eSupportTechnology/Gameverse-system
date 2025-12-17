<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Station; 

class ReportsController extends Controller
{
  public function bookingSales(Request $request)
{
    $query = Booking::where('status', 'completed');

    if ($request->station) {
        $query->where('station', $request->station);
    }

    if ($request->date) {
        $query->whereDate('booking_date', $request->date);
    }

    return response()->json([
        'success' => true,
        'data' => $query->orderBy('start_time')->get()
    ]);
}

public function bookingStations()
{
    $stations = Booking::where('status', 'completed')
        ->whereNotNull('station')
        ->distinct()
        ->orderBy('station')
        ->pluck('station'); // returns array of station names

    return response()->json([
        'success' => true,
        'data' => $stations
    ]);
}


    public function stations()
    {
        return response()->json([
            'success' => true,
            'data' => Station::where('status', 'active')->get()
        ]);
    }
}
