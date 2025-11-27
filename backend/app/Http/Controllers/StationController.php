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
            'name'      => 'required|string|max:191',
            'type'      => 'required|string|max:50',
            'location'  => 'required|string|max:100',
            'price'     => 'required|numeric',
            'time'      => 'required|integer|min:1',
            'vrTime'    => 'nullable|integer|min:1',
            'vrPrice'   => 'nullable|numeric',
        ]);

        $station = Station::create([
            'name'      => $request->name,
            'type'      => $request->type,
            'location'  => $request->location,
            'price'     => $request->price,
            'time'      => $request->time,
            'vrTime'   => $request->vrTime,
            'vrPrice'  => $request->vrPrice,
            'status'    => $request->status ?? 'Available',
            'bookings'  => $request->bookings ?? 0,
        ]);

        return response()->json($station, 201);
    }

    public function update(Request $request, $id)
    {
        $station = Station::findOrFail($id);

        $request->validate([
            'name'      => 'sometimes|required|string|max:191',
            'type'      => 'sometimes|required|string|max:50',
            'location'  => 'sometimes|required|string|max:100',
            'price'     => 'sometimes|required|numeric',
            'time'      => 'sometimes|required|integer|min:1',
            'vrTime'    => 'nullable|integer|min:1',
            'vrPrice'   => 'nullable|numeric',
            'status'    => 'sometimes|string|max:20',
            'bookings'  => 'sometimes|integer|min:0',
        ]);

        $station->update($request->only([
            'name', 'type', 'location', 'price', 'time', 'status', 'bookings','vrPrice','vrTime'
        ]));

        return response()->json($station);
    }

    public function destroy($id)
    {
        $station = Station::findOrFail($id);
        $station->delete();

        return response()->json(['message' => 'Station deleted']);
    }
}
