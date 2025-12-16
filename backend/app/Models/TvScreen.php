<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TvScreen extends Model
{
    use HasFactory;

    protected $table = 'tv_screen';

    protected $fillable = [
        'file_path',
        'file_type',
        'status'
    ];
}

