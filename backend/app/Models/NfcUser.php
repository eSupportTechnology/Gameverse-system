<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NfcUser extends Model
{
    use HasFactory;

    protected $table = 'nfc_users';

    protected $fillable = [
        'full_name',
        'email',
        'card_no',
        'phone_no',
        'nic_number',
        'points',
        'gift',
        'status',
        'avatar',
        'used_rewards'
    ];

    protected $casts = [
        'points' => 'array',
        'gift'   => 'array',
        'used_rewards' => 'array',
    ];

    /**
     * Generate unique card number
     */
    public static function generateCardNo()
    {
        $lastUser = self::orderBy('id', 'desc')->first();
        $lastNumber = $lastUser ? intval(substr($lastUser->card_no, 2)) : 110;
        return 'GV' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
    }
}
