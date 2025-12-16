<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TvScreen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TvScreenController extends Controller
{
    // List all posts
    public function index()
    {
        return TvScreen::latest()->get();
    }

    // Upload + Post
    public function store(Request $request)
{
    $request->validate([
        //increased max file to 50mb
        'file' => 'required|file|max:51200', 
    ]);

    $file = $request->file('file');

    $path = $file->store('tv-screen', 'public');

    $tv = TvScreen::create([
        'file_path' => $path,
        'file_type' => str_contains($file->getMimeType(), 'video') ? 'video' : 'image',
        'status' => 'posted',
    ]);

    return response()->json($tv);
}


    // Hold / Play
    public function toggleStatus($id)
    {
        $tv = TvScreen::findOrFail($id);

        $tv->status = $tv->status === 'posted' ? 'hold' : 'posted';
        $tv->save();

        return response()->json($tv);
    }

    // Delete
    public function destroy($id)
    {
        $tv = TvScreen::findOrFail($id);

        Storage::disk('public')->delete($tv->file_path);
        $tv->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
