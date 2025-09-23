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
        'last_login_at'
    ];

    protected $hidden = [
        'password',
    ];
}
