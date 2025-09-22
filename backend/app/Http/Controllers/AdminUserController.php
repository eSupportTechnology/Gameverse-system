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
}
