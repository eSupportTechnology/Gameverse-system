<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'location',
        'playing_method',
        'price',
        'quantity',
        'players',
        'category',
        'full_amount',
        'discount_price',
        'balance_payment',
        'status'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'full_amount' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'balance_payment' => 'decimal:2',
    ];
}
