<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    use HasFactory;

     protected $table = 'sale_items'; // ensure correct table name

    protected $fillable = [
        'sale_id',
        'item_id',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    // Each SaleItem belongs to one sale
    public function sale()
    {
        return $this->belongsTo(PosSale::class, 'sale_id');
    }

    // Each SaleItem belongs to one item
    public function item()
    {
        return $this->belongsTo(PosItem::class, 'item_id');
    }
}
