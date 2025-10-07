<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class UserRole extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'userroles';

    protected $fillable = [
        'fullname',
        'username',
        'email',
        'password',
        'role',
        'avatar',
        'active_status',
        'last_login_at',
        'must_reset_password',
        'temp_password_created_at',

    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'active_status' => 'boolean',
        'must_reset_password' => 'boolean',
        'temp_password_created_at' => 'datetime',
    ];

    public function bookings()
{
    return $this->hasMany(AdminBooking::class, 'user_id', 'id');
}
}
