<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameCheckout extends Model
{
    protected $fillable = [
    'game_id',
    'method',
    'balance',
    'discount',
    'nfc_card_number',
    'customer_name',
    'phone_number',
];

protected $casts = [
    'method' => 'array',
];
}
