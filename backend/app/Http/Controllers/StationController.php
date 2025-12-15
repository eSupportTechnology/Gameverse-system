<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Station;
use Illuminate\Support\Facades\Storage;

class StationController extends Controller
{
    // Fetch all stations
    public function index(Request $request)
    {
        if ($request->has('category')) {
            return response()->json(
                Station::where('type', $request->category)->get()
            );
        }

        return response()->json(Station::all());
    }

    // Create new station
    public function store(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:191',
            'type'      => 'required|string|max:50',
            'location'  => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'price'     => 'required|numeric',
            'time'      => 'required|integer|min:1',
            'vrTime'    => 'nullable|integer|min:1',
            'vrPrice'   => 'nullable|numeric',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $station = new Station();
        $station->name     = $request->name;
        $station->type     = $request->type;
        $station->location = $request->location;
        $station->description = $request->description;
        $station->price    = $request->price;
        $station->time     = $request->time;
        $station->vrTime   = $request->vrTime;
        $station->vrPrice  = $request->vrPrice;
        $station->status   = $request->status ?? 'Available';
        $station->bookings = $request->bookings ?? 0;

        // Handle thumbnail
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $station->thumbnail = asset('storage/' . $path);
        }

        $station->save();

        return response()->json($station, 201);
    }

    public function update(Request $request, $id)
    {
        $station = Station::findOrFail($id);

        $request->validate([
            'name'      => 'sometimes|required|string|max:191',
            'type'      => 'sometimes|required|string|max:50',
            'location'  => 'sometimes|required|string|max:100',
            'description' => 'nullable|string|max:500',
            'price'     => 'sometimes|required|numeric',
            'time'      => 'sometimes|required|integer|min:1',
            'vrTime'    => 'nullable|integer|min:1',
            'vrPrice'   => 'nullable|numeric',
            'status'    => 'sometimes|string|max:20',
            'bookings'  => 'sometimes|integer|min:0',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $station->update($request->only([
            'name', 'type', 'location','description', 'price', 'time', 'status', 'bookings','vrPrice','vrTime'
        ]));

        // Update thumbnail if uploaded
        if ($request->hasFile('thumbnail')) {
            // Optional: delete old file
            if ($station->thumbnail) {
                $oldPath = str_replace(asset('storage/'), '', $station->thumbnail);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $station->thumbnail = asset('storage/' . $path);
            $station->save();
        }

        return response()->json($station);
    }

    public function destroy($id)
    {
        $station = Station::findOrFail($id);

        // Optional: delete thumbnail file
        if ($station->thumbnail) {
            $oldPath = str_replace(asset('storage/'), '', $station->thumbnail);
            Storage::disk('public')->delete($oldPath);
        }

        $station->delete();

        return response()->json(['message' => 'Station deleted']);
    }
}
