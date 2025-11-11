<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperaterGame extends Model
{
    use HasFactory;

    protected $table = 'operater_games'; // Table name

    protected $fillable = [
        'operator_id',
        'title',
        'location',
        'method',
        'price',
        'is_team_game', // ✅ add this line
    ];

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }
}
