<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    // Get all events
    public function index()
    {
        $events = Event::all();
        return response()->json(Event::all(), 200);
    }

    // Create new event
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'date' => 'required|date',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('events', 'public');
        } else {
            $path = null;
        }

        $event = Event::create([
            'name' => $request->name,
            'date' => $request->date,
            'thumbnail' => $path,
        ]);

        return response()->json($event, 201);
    }

    // Update event
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('events', 'public');
            $event->thumbnail = $path;
        }

        $event->name = $request->name ?? $event->name;
        $event->date = $request->date ?? $event->date;
        $event->save();

        return response()->json($event, 200);
    }

    // Delete event
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json(['message' => 'Event deleted'], 200);
    }
}
