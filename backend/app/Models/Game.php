<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'location',
        'method',
        'price',
        'team_game',
        'description',
        'thumbnail',
    ];

    // Ensure team_game is always a boolean
    protected $casts = [
        'team_game' => 'boolean',
        'method' => 'array',
    ];
}
