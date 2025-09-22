<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserRole;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
   public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = UserRole::where('email', $request->email)
                        ->where('role', 'admin')
                        ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (!$user->active_status) {
            return response()->json(['message' => 'Account is inactive'], 403);
        }

        $token = $user->createToken('user-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id'       => $user->id,
                'fullname' => $user->fullname,
                'username' => $user->username,
                'email'    => $user->email,
                'role'     => $user->role,
            ],
            'token' => $token
        ]);
}
    public function logout(Request $request)
{
    $request->user('admin')->tokens()->delete();
    return response()->json(['message' => 'Logged out']);
}

}
