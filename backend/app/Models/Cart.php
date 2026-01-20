<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PosItem;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'pos_item_id',
        'quantity'
    ];

    public function posItem()
    {
        return $this->belongsTo(PosItem::class);
    }
}
