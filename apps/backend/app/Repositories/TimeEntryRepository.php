<?php

namespace App\Repositories;

use App\Contracts\Repositories\TimeEntryRepositoryInterface;
use App\Models\TimeEntry;
use Illuminate\Database\Eloquent\Collection;

class TimeEntryRepository implements TimeEntryRepositoryInterface
{
    public function create(array $data): TimeEntry
    {
        return TimeEntry::create($data);
    }

    public function update(TimeEntry $timeEntry, array $data): TimeEntry
    {
        $timeEntry->update($data);
        return $timeEntry->fresh();
    }

    public function findById(int $id): ?TimeEntry
    {
        return TimeEntry::find($id);
    }

    public function findActiveByUserId(int $userId): ?TimeEntry
    {
        return TimeEntry::where('user_id', $userId)
            ->whereNull('check_out_time')
            ->first();
    }

    public function getByUserAndDate(int $userId, string $date): Collection
    {
        return TimeEntry::where('user_id', $userId)
            ->where('date', $date)
            ->orderBy('check_in_time', 'desc')
            ->get();
    }

    public function getByPharmacyAndDateRange(int $pharmacyId, string $startDate, string $endDate): Collection
    {
        return TimeEntry::where('pharmacy_id', $pharmacyId)
            ->whereBetween('date', [$startDate, $endDate])
            ->with('user')
            ->orderBy('date', 'desc')
            ->orderBy('check_in_time', 'desc')
            ->get();
    }

    public function getTodayEntryByUser(int $userId): ?TimeEntry
    {
        return TimeEntry::where('user_id', $userId)
            ->whereDate('date', today())
            ->orderBy('check_in_time', 'desc')
            ->first();
    }
}