<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserRole;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

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
        if ($user && $user->active_status) {
            $user->update([
                'last_login_at' => now(),
            ]);
        }
        $token = $user->createToken('user-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id'       => $user->id,
                'fullname' => $user->fullname,
                'username' => $user->username,
                'email'    => $user->email,
                'role'     => $user->role,
                'last_login_at'  => $user->last_login_at,
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
