<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'customer_name',
        'phone_number',
        'station',
        'booking_date',
        'start_time',
        'duration',
        'amount',
        'status'
    ];

    protected $casts = [
        'booking_date' => 'date',
        'amount' => 'decimal:2'
    ];
}
