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

    // Optional: you can add a computed attribute for quantity
    // public function getQuantityAttribute() {
        // $values = ['Coin' => 100, 'Arrow' => 150, 'Per Hour' => 75];
        // return isset($values[$this->method]) ? intval($this->price / $values[$this->method]) : 0;
    // }
    
}
