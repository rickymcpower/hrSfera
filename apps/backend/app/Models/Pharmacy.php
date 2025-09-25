<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pharmacy extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'logo',
        'primary_color',
        'secondary_color',
        'address',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }
}
