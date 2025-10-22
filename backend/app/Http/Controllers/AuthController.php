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

        // Allow both admin and super admin
        $user = UserRole::where('email', $request->email)
            ->whereIn('role', ['admin', 'super_admin'])
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

        // if ($user && $user->active_status) {
        //     // Format current time as 12-hour with AM/PM
        //     $lastLoginTime = now()->format('h:i A'); // e.g., 10:30 PM

        //     $user->update([
        //         'last_login_at' => $lastLoginTime,
        //     ]);
        // }
        $token = $user->createToken('user-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id'       => $user->id,
                'fullname' => $user->fullname,
                'username' => $user->username,
                'email'    => $user->email,
                'role'     => $user->role,
                'last_login_at'  => $user->last_login_at,
                'avatar'        => $user->avatar
                    ? url($user->avatar)
                    : url('images/default.png'),
            ],
            'must_reset_password' => $user->must_reset_password,
            'token' => $token
        ]);
    }

    // oparator login
    public function operatoLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Allow both operator and super admin
        $user = UserRole::where('email', $request->email)
            ->whereIn('role', ['operator', 'super_admin'])
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

        $token = $user->createToken('operator-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id'       => $user->id,
                'fullname' => $user->fullname,
                'username' => $user->username,
                'email'    => $user->email,
                'role'     => $user->role,
                'last_login_at' => $user->last_login_at,
                'avatar'        => $user->avatar
                    ? url($user->avatar)
                    : url('images/default.png'),
            ],
            'must_reset_password' => $user->must_reset_password,
            'token' => $token
        ]);
    }


    public function resetPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
            // requires `password` + `password_confirmation`
        ]);

        $user = $request->user(); // comes from Sanctum token

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Update password and reset flags
        $user->update([
            'password' => Hash::make($request->password),
            'must_reset_password' => false,
            'temp_password_created_at' => null,
        ]);

        return response()->json([
            'message' => 'Password reset successful',
            'user' => [
                'id' => $user->id,
                'fullname' => $user->fullname,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ], 200);
    }
    public function logout(Request $request)
    {
        $request->user('admin')->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
