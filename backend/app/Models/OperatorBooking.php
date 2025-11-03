<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OperatorBooking extends Model
{
    protected $fillable = [
        'customer_name',
        'phone_number',
        'station',
        'date',
        'start_time',
        'duration',
        'extended_time',
        'payment_method',
        'amount',
        'status'
    ];
    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2'
    ];
}
