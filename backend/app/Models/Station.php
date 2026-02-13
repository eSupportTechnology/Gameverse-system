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
        'status',
        'bookings',
        'thumbnail',
        'common_thumbnail',
        'pricing'
    ];

    protected $casts = [
        'pricing' => 'array',
    ];
}
