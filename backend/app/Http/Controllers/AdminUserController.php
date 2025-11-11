<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserRole;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendTempPassword;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AdminUserController extends Controller
{
    // add  user
    public function store(Request $request)
    {
        try {
            // Manual validation for more control
            $validator = Validator::make($request->all(), [
                'fullname'      => 'required|string|max:255',
                'username'      => 'required|string|max:50|unique:userroles,username',
                'email'         => 'required|email|unique:userroles,email',
                // password now optional on creation (we generate if omitted)
                'password'      => 'nullable|string|min:6',
                'role'          => 'required|in:admin,operator',
                'active_status' => 'sometimes|boolean',
                'avatar'        => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors'  => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();

            // Handle avatar upload
            $avatarPath = null;
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
            }

            // Decide password: use provided password OR generate temporary one
            $mustReset = false;
            $tempPasswordForEmail = null;

            if ($request->has('password') && $request->input('password') !== '') {
                $plainPassword = $request->input('password');
                $passwordToStore = Hash::make($plainPassword);
                $mustReset = true; 
                $tempPasswordCreatedAt = now();
                $tempPasswordForEmail = $plainPassword; 
                Log::error('get send password: ');
            } else {
                // generate a strong temporary password
                $tempPasswordForEmail = Str::random(12); // 12 chars
                $passwordToStore = Hash::make($tempPasswordForEmail);
                $mustReset = true;
                $tempPasswordCreatedAt = now();
                Log::error('get randome password: ');
            }

            $userData = [
                'fullname'      => $validated['fullname'],
                'username'      => $validated['username'],
                'email'         => $validated['email'],
                'password'      => $passwordToStore,
                'role'          => $validated['role'],
                'active_status' => $validated['active_status'] ?? true,
                'avatar'        => $avatarPath ? '/storage/' . $avatarPath : null,
                'must_reset_password' => $mustReset,
                'temp_password_created_at' => $mustReset ? $tempPasswordCreatedAt : null,
            ];

            Log::error('Insert user data: ', $userData);

            $user = UserRole::create($userData);

            // Try sending email only when we generated a temp password
            $tempForCreator = null;
            if ($mustReset) {
                try {
                    Mail::to($user->email)->queue(new SendTempPassword($user, $tempPasswordForEmail));
                    // Mail::to($user->email)->send(new SendTempPassword($user, $tempPasswordForEmail));
                } catch (\Exception $e) {
                    Log::error('Failed to send temp password email: ' . $e->getMessage());
                }
                // For local/testing only — return temp password to creator
                if (app()->environment('local')) {
                    $tempForCreator = $tempPasswordForEmail;
                }
                Log::error('Temp password: ' . $tempForCreator);
            }

            return response()->json([
                'message' => 'User created successfully',
                'user'    => [
                    'id'            => $user->id,
                    'fullname'      => $user->fullname,
                    'username'      => $user->username,
                    'email'         => $user->email,
                    'role'          => $user->role,
                    'active_status' => (bool) $user->active_status,
                    'last_login_at' => $user->last_login_at,
                    'avatar'        => $user->avatar
                        ? url($user->avatar)
                        : url('images/default.png'),
                ],
                // IMPORTANT: temp_password only returned in local when email couldn't be sent.
                'temp_password' => $tempForCreator
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong while creating the user.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // update user details
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'fullname'      => 'required|string|max:255',
            'username'      => 'required|string|max:255|unique:userroles,username,' . $id,
            'email'         => 'required|email|unique:userroles,email,' . $id,
            'role'          => 'required|in:admin,operator',
            'active_status' => 'sometimes|in:0,1',
            'password'      => 'nullable|string|min:6',
            'avatar'        => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }
        $validated = $validator->validated();

        $user = UserRole::findOrFail($id);

        // Update fields
        $user->fullname = $request->fullname;
        $user->username = $request->username;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->active_status = $request->active_status;

        // Only update password if provided
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }
        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar && file_exists(public_path($user->avatar))) {
                unlink(public_path($user->avatar));
            }

            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = '/storage/' . $avatarPath;
        }

        $user->save();

        return response()->json([
            'message' => 'User created successfully',
            'user'    => [
                'id'            => $user->id,
                'fullname'      => $user->fullname,
                'username'      => $user->username,
                'email'         => $user->email,
                'role'          => $user->role,
                'active_status' => (bool) $user->active_status,
                'last_login_at' => $user->last_login_at,
                'avatar'        => $user->avatar
                    ? url($user->avatar)
                    : url('images/default.png'),
            ]
        ], 201);
    }

    // delete user
    public function delete($id)
    {
        $user = UserRole::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    //  Fetch all users (renamed from index)
    public function fetchUsers()
    {
        $users = UserRole::all();
        $users->transform(function ($user) {
            $user->avatar = $user->avatar
                ? url($user->avatar)
                : url('images/default.png');
            return $user;
        });
        return response()->json($users);
    }
}
