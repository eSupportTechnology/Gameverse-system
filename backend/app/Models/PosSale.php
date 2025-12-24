<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosSale extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'customer_id',
        'email',
        'subtotal',
        'discount',
        'total',
        'items'
    ];

    public function items()
    {
        return $this->hasMany(SaleItem::class, 'sale_id'); // foreign key specified
    }
}
