<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortalGame extends Model
{
    use HasFactory;

    // Specify the table name
    protected $table = 'portal_games';

    // Allow mass assignment for these fields
    protected $fillable = [
        'title',
        'desc',
        'thumbnail',
    ];
}
