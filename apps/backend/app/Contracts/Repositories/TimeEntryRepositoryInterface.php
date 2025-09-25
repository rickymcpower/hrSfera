<?php

namespace App\Contracts\Repositories;

use App\Models\TimeEntry;
use Illuminate\Database\Eloquent\Collection;

interface TimeEntryRepositoryInterface
{
    public function create(array $data): TimeEntry;
    public function update(TimeEntry $timeEntry, array $data): TimeEntry;
    public function findById(int $id): ?TimeEntry;
    public function findActiveByUserId(int $userId): ?TimeEntry;
    public function getByUserAndDate(int $userId, string $date): Collection;
    public function getByPharmacyAndDateRange(int $pharmacyId, string $startDate, string $endDate): Collection;
    public function getTodayEntryByUser(int $userId): ?TimeEntry;
}