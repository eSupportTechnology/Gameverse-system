<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Station extends Model
{
    // Allow mass assignment for these fields
    protected $fillable = [
        'name',
        'type',
        'location',
        'description',
        'price',
        'status',
        'bookings',
        'time',
        'vrTime',
        'vrPrice',
        'thumbnail',
    ];
    protected $casts = [
    'price' => 'array',
    'time' => 'array',
    'vrPrice' => 'array',
    'vrTime' => 'array',
];
}
