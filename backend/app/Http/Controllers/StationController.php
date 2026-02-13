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
    'name'           => 'required|string|max:191',
    'type'           => 'required|string|max:50',
    'location'       => 'required|string|max:100',
    'price'          => 'required|array',       // <-- array
    'price.*'        => 'numeric|min:0',        // <-- each element numeric
    'time'           => 'required|array',       // <-- array
    'time.*'         => 'string|max:5',         // <-- each element like "30" or "60"
    'vrTime'         => 'nullable|array',
    'vrTime.*'       => 'string|max:5',
    'vrPrice'        => 'nullable|array',
    'vrPrice.*'      => 'numeric|min:0',
    'thumbnail'      => 'nullable|image|max:2048',
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
    'price'     => $request->price,      // array stored as JSON
    'time'      => $request->time,       // array stored as JSON
    'vrPrice'   => $request->vrPrice ?? null,
    'vrTime'    => $request->vrTime ?? null,
    'status'    => $request->status ?? 'Available',
    'bookings'  => $request->bookings ?? 0,
    'thumbnail' => $thumbnailPath,
]);



        return response()->json($station, 201);
    }


    public function update(Request $request, $id)
    {
        $station = Station::findOrFail($id);

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
