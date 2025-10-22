<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperatorBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'phone_number',
        'station',
        'date',
        'start_time',
        'duration',
        'payment_method',
        'amount',
        'status',
    ];
}
