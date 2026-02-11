<?php

namespace App\Http\Controllers;

use App\Models\NfcUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class NfcUserController extends Controller
{
    /**
     * Display a listing of NFC users.
     */
    public function index()
    {
        try {
            $users = NfcUser::orderBy('created_at', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching NFC users: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch NFC users'
            ], 500);
        }
    }

    /**
     * Store a newly created NFC user.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name'  => 'required|string|max:255',
            'email'      => 'required|string|max:255',
            'phone_no'   => 'required|string|regex:/^\d{3}\s\d{7}$/|unique:nfc_users,phone_no',
            'nic_number' => 'required|string|unique:nfc_users,nic_number',
            'card_no'    => 'required|string|unique:nfc_users,card_no',
            'avatar'     => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status'     => 'nullable|in:active,inactive'
        ], [
            'phone_no.regex'  => 'Phone number format should be XXX XXXXXXX',
            'phone_no.unique' => 'This phone number is already registered',
            'nic_number.unique' => 'This NIC number is already registered',
            'card_no.unique'  => 'This card number is already registered'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 422);
        }

        try {
            // Handle avatar upload
            $avatarPath = null;
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')
                    ->store('avatars/nfc_users', 'public');
            }

            $nfcUser = NfcUser::create([
                'full_name'  => $request->full_name,
                'email'      => $request->email,
                'card_no'    => $request->card_no,
                'phone_no'   => $request->phone_no,
                'nic_number' => $request->nic_number,
                'points'     => 0,
                'status'     => $request->status ?? 'active',
                'avatar'     => $avatarPath
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $nfcUser
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating NFC user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create NFC user'
            ], 500);
        }
    }

    /**
     * Display the specified NFC user.
     */
    public function show($id)
    {
        try {
            $user = NfcUser::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'NFC user not found'
            ], 404);
        }
    }

    /**
     * Update the specified NFC user.
     */
    public function update(Request $request, $id)
    {
        try {
            $user = NfcUser::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'full_name'  => 'required|string|max:255',
                'email'  => 'required|string|max:255',
                'phone_no'   => 'required|string|regex:/^\d{3}\s\d{7}$/|unique:nfc_users,phone_no,' . $id,
                'nic_number' => 'required|string|unique:nfc_users,nic_number,' . $id,
                'avatar'     => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
                'status'     => 'nullable|in:active,inactive'
            ], [
                'phone_no.regex'  => 'Phone number format should be XXX XXXXXXX',
                'phone_no.unique' => 'This phone number is already registered',
                'nic_number.unique' => 'This NIC number is already registered'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first()
                ], 422);
            }

            // Handle avatar update
            if ($request->hasFile('avatar')) {
                // Delete old avatar if it exists and is a valid storage path
                if ($user->avatar && str_starts_with($user->avatar, 'avatars/')) {
                    Storage::disk('public')->delete($user->avatar);
                }

                $user->avatar = $request->file('avatar')
                    ->store('avatars/nfc_users', 'public');
            }

            $user->update([
                'full_name'  => $request->full_name,
                'email'  => $request->email,
                'phone_no'   => $request->phone_no,
                'nic_number' => $request->nic_number,
                'status'     => $request->status ?? $user->status,
                'avatar'     => $user->avatar
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating NFC user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update NFC user'
            ], 500);
        }
    }

    /**
     * Remove the specified NFC user.
     */
    public function destroy($id)
    {
        try {
            $user = NfcUser::findOrFail($id);

            // Delete avatar if it exists and is a valid storage path
            if ($user->avatar && str_starts_with($user->avatar, 'avatars/')) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting NFC user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete NFC user'
            ], 500);
        }
    }

    /**
     * Toggle user status (active/inactive)
     */
    public function toggleStatus($id)
    {
        try {
            $user = NfcUser::findOrFail($id);
            $user->status = $user->status === 'active' ? 'inactive' : 'active';
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'User status updated successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error toggling user status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user status'
            ], 500);
        }
    }

    /**
     * Search NFC users
     */
    public function search(Request $request)
    {
        try {
            $query = $request->input('query', '');

            $users = NfcUser::where('full_name', 'LIKE', "%{$query}%")
                ->orWhere('card_no', 'LIKE', "%{$query}%")
                ->orWhere('email', 'LIKE', "%{$query}%")
                ->orWhere('phone_no', 'LIKE', "%{$query}%")
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error searching NFC users: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to search NFC users'
            ], 500);
        }
    }
    /**
     * Get NFC user by card number (UID)
     */
    public function getByCard($cardNo)
    {
        try {
            $user = NfcUser::where('card_no', $cardNo)->first();

            if ($user) {
                return response()->json([
                    'success' => true,
                    'data' => $user
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }
        } catch (\Exception $e) {
            Log::error('Error fetching user by card: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server error'
            ], 500);
        }
    }
}
