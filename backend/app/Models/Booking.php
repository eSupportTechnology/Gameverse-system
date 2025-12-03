<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{

    protected $fillable = [
        'nfc_card_number',
        'customer_name',
        'phone_number',
        'station',
        'booking_date',
        'start_time',
        'duration',
        'extended_time',
        'payment_method',
        'amount',
        'status',
        'is_online'
    ];


    protected $casts = [
        'booking_date' => 'date',
        'amount' => 'decimal:2'
    ];
}
