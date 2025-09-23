<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserRole;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AdminUserController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Manual validation for more control
            $validator = Validator::make($request->all(), [
                'fullname'      => 'required|string|max:255',
                'username'      => 'required|string|max:50|unique:userroles,username',
                'email'         => 'required|email|unique:userroles,email',
                'password'      => 'required|string|min:6',
                'role'          => 'required|in:admin,operator',
                'active_status' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors'  => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();

            $user = UserRole::create([
                'fullname'      => $validated['fullname'],
                'username'      => $validated['username'],
                'email'         => $validated['email'],
                'password'      => Hash::make($validated['password']),
                'role'          => $validated['role'],
                'active_status' => $validated['active_status'] ?? true,
            ]);

            return response()->json([
                'message' => 'User created successfully',
                'user'    => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong while creating the user.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'fullname' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:userroles,username,' . $id,
            'email'    => 'required|email|unique:userroles,email,' . $id,
            'role'     => 'required|string',
            'active_status' => 'boolean',
        ]);

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

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }


    // ✅ Fetch all users (renamed from index)
    public function fetchUsers()
    {
        $users = UserRole::all();
        return response()->json($users);
    }
}
