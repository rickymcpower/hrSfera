<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimeEntry extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'pharmacy_id',
        'check_in_time',
        'check_out_time',
        'duration_minutes',
        'date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'check_in_time' => 'datetime',
            'check_out_time' => 'datetime',
            'date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pharmacy(): BelongsTo
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function calculateDuration(): void
    {
        if ($this->check_out_time) {
            $this->duration_minutes = $this->check_in_time->diffInMinutes($this->check_out_time);
            $this->save();
        }
    }

    public function isActive(): bool
    {
        return $this->check_out_time === null;
    }
}
