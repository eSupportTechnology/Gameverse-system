<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperatorPosItem extends Model
{
     use HasFactory;

     protected $fillable = [
        'category',
        'item_name',
        'price',
        'stock',
        'loyality_price',
        'user_id',
    ];

    // Each operator item belongs to a user
    public function user()
    {
        return $this->belongsTo(UserRole::class, 'user_id', 'id');
    }
}
