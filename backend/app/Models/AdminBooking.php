<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminBooking extends Model
{
    use HasFactory;

    // table name
    protected $table = 'admin_booking';

    // mass-assignable fields
    protected $fillable = [
        'customer_name',
        'phone',
        'station',
        'date',
        'start_time',
        'duration', 
        'fees',
        'amount',
        'user_id',
    ];

    // Relationship with UserRole
    public function user()
    {
        return $this->belongsTo(UserRole::class, 'user_id', 'id');
    }
}
