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
    ];

    // Optional: you can add a computed attribute for quantity
    // public function getQuantityAttribute() {
        // $values = ['Coin' => 100, 'Arrow' => 150, 'Per Hour' => 75];
        // return isset($values[$this->method]) ? intval($this->price / $values[$this->method]) : 0;
    // }
}
