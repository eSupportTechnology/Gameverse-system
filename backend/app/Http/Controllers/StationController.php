<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Station;

class StationController extends Controller
{
    // Fetch all stations
    public function index()
    {
        return response()->json(Station::all());
    }

    // Create new station
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:191',
            'type' => 'required|string|max:50',
            'location' => 'required|string|max:100',
            'price' => 'required|numeric',
            'time' => 'required|integer|min:1', // store total minutes
        ]);

        $station = Station::create([
            'name' => $request->name,
            'type' => $request->type,
            'location' => $request->location,
            'price' => $request->price,
            'time' => $request->time, // integer minutes
            'status' => $request->status ?? 'Available',
            'bookings' => $request->bookings ?? 0,
        ]);

        return response()->json($station, 201);
    }

    // Update a station
    public function update(Request $request, $id)
    {
        $station = Station::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:191',
            'type' => 'sometimes|required|string|max:50',
            'location' => 'sometimes|required|string|max:100',
            'price' => 'sometimes|required|numeric',
            'time' => 'sometimes|required|integer|min:1', // total minutes
            'status' => 'sometimes|string|max:20',
            'bookings' => 'sometimes|integer|min:0',
        ]);

        $station->update($request->only([
            'name', 'type', 'location', 'price', 'time', 'status', 'bookings'
        ]));

        return response()->json($station);
    }

    // Delete a station
    public function destroy($id)
    {
        $station = Station::findOrFail($id);
        $station->delete();

        return response()->json(['message' => 'Station deleted']);
    }
}
