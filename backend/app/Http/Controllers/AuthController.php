<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
   public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $admin = Admin::where('email', $request->email)->first();

    if (!$admin || !Hash::check($request->password, $admin->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $admin->createToken('admin-token')->plainTextToken;

    return response()->json([
        'user' => $admin,
        'token' => $token
    ]);
}
    public function logout(Request $request)
{
    $request->user('admin')->tokens()->delete();
    return response()->json(['message' => 'Logged out']);
}

}
