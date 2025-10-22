<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperatorPosSale extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'phone',
        'email',
        'subtotal',
        'discount',
        'total',
    ];

    // Each sale can have many operator sale items
    public function items()
    {
        return $this->hasMany(OperatorSaleItem::class, 'sale_id'); // foreign key
    }
}
