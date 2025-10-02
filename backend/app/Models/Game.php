<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    // ✅ Table name (optional if it matches plural of model)
    protected $table = 'games';

    // ✅ Fields that can be mass-assigned
    protected $fillable = [
        'title',
        'location',
        'coin',
        'price',
    ];
}
