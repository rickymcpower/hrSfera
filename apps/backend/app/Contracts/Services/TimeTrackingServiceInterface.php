<?php

namespace App\Contracts\Services;

use App\Models\TimeEntry;
use App\Models\User;

interface TimeTrackingServiceInterface
{
    public function checkIn(User $user): TimeEntry;
    public function checkOut(User $user): TimeEntry;
    public function getCurrentStatus(User $user): array;
    public function getTimeHistory(User $user, ?string $startDate = null, ?string $endDate = null): array;
    public function getTodayEntry(User $user): ?TimeEntry;
}