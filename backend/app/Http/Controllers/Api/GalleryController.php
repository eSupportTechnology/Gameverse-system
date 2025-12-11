<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Gallery;

class GalleryController extends Controller
{
    // Get all gallery images
    public function index()
    {
        return response()->json(Gallery::all(), 200);
    }

    // Upload new image
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        $path = $request->file('image')->store('gallery', 'public');

        $photo = Gallery::create([
            'image' => $path,
        ]);

        return response()->json($photo, 201);
    }

    // Delete image
    public function destroy($id)
    {
        $photo = Gallery::findOrFail($id);
        $photo->delete();

        return response()->json(['message' => 'Photo deleted'], 200);
    }
}
