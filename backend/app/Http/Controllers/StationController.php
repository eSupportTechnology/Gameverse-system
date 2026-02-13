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

    // Store a new station
    public function store(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:191',
            'type'      => 'required|string|max:50',
            'location'  => 'required|string|max:100',
            'status'    => 'sometimes|string|max:20',
            'bookings'  => 'sometimes|integer|min:0',
            'thumbnail' => 'nullable|image|max:2048',
            'pricing'   => 'nullable|array',
            'pricing.*.duration' => 'required|integer|min:1',
            'pricing.*.price'    => 'required|numeric|min:0',
            'pricing.*.vrPrice'  => 'nullable|numeric|min:0',
        ]);

        // Handle thumbnail upload
        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('stations', 'public');
        }

        $station = Station::create([
            'name'      => $request->name,
            'type'      => $request->type,
            'location'  => $request->location,
            'status'    => $request->status ?? 'Available',
            'bookings'  => $request->bookings ?? 0,
            'thumbnail' => $thumbnailPath,
            'pricing'   => $request->pricing ?? [],
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
            'status'    => 'sometimes|string|max:20',
            'bookings'  => 'sometimes|integer|min:0',
            'thumbnail' => 'nullable|image|max:2048',
            'pricing'   => 'nullable|array',
            'pricing.*.duration' => 'required|integer|min:1',
            'pricing.*.price'    => 'required|numeric|min:0',
            'pricing.*.vrPrice'  => 'nullable|numeric|min:0',
        ]);

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $station->thumbnail = $request->file('thumbnail')->store('stations', 'public');
        }

        $station->update($request->only([
            'name',
            'type',
            'location',
            'status',
            'bookings',
            'thumbnail',
            'pricing',
        ]));

        return response()->json($station);
    }


    public function destroy($id)
    {
        $station = Station::findOrFail($id);
        $station->delete();

        return response()->json(['message' => 'Station deleted']);
    }

    public function updateCategory(Request $request, $type)
    {
        $data = ['description' => $request->description];
        if ($request->hasFile('common_thumbnail')) {
            $data['common_thumbnail'] = $request->file('common_thumbnail')->store('stations', 'public');
        }

        Station::where('type', $type)->update($data);
        return response()->json(['message' => 'Category updated']);
    }
}
