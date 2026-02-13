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
            'thumbnail' => 'nullable|image|max:2048', // allows any valid image type
        ]);

        // Handle thumbnail upload
        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('stations', 'public');
        }

        $station = Station::create([
            'name'        => $request->name,
            'type'        => $request->type,
            'location'    => $request->location,
            'price'       => $request->price,
            'time'        => $request->time,
            'vrTime'      => $request->vrTime,
            'vrPrice'     => $request->vrPrice,
            'status'      => $request->status ?? 'Available',
            'bookings'    => $request->bookings ?? 0,
            'thumbnail'   => $thumbnailPath,
        ]);

        return response()->json($station, 201);
    }


    public function update(Request $request, $id)
    {
        $station = Station::findOrFail($id);

        $request->validate([
            'name'        => 'sometimes|required|string|max:191',
            'type'        => 'sometimes|required|string|max:50',
            'location'    => 'sometimes|required|string|max:100',
            'price'       => 'sometimes|required|numeric',
            'time'        => 'sometimes|required|integer|min:1',
            'vrTime'      => 'nullable|integer|min:1',
            'vrPrice'     => 'nullable|numeric',
            'status'      => 'sometimes|string|max:20',
            'bookings'    => 'sometimes|integer|min:0',
            'thumbnail' => 'nullable|image|max:2048', // allows any valid image type
        ]);

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('stations', 'public');
            $station->thumbnail = $thumbnailPath;
        }

        $station->update($request->only([
            'name',
            'type',
            'location',
            'price',
            'time',
            'status',
            'bookings',
            'vrPrice',
            'vrTime',
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
