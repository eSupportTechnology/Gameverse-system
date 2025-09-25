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
            'time' => 'required|string|max:10',
        ]);

        $station = Station::create($request->all());
        return response()->json($station, 201);
    }

    // Update a station
    public function update(Request $request, $id)
    {
        $station = Station::findOrFail($id);
        $station->update($request->all());
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
