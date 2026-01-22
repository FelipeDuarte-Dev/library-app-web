<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'publisher',
        'publication_year',
        'stock',
        'category',
    ];

    protected $casts = [
        'publication_year' => 'integer',
        'stock' => 'integer',
    ];
}
