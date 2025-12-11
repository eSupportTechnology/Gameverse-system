<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    
 protected $fillable = [
        'name',
        'date',
        'thumbnail',
    ];
    protected $appends = ['thumbnail_url'];


    public function getThumbnailUrlAttribute()
{
    return $this->thumbnail ? asset('storage/events/' . $this->thumbnail) : null;
}
}
