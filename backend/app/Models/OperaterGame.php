<?php

namespace App\Models;



use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperaterGame extends Model
{
    use HasFactory;

    protected $table = 'operater_games'; // Important!

    protected $fillable = [
        'operator_id', 'title', 'location', 'method', 'price'
    ];

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }
}
