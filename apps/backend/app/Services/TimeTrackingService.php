<?php

namespace App\Services;

use App\Contracts\Services\TimeTrackingServiceInterface;
use App\Contracts\Repositories\TimeEntryRepositoryInterface;
use App\Models\TimeEntry;
use App\Models\User;
use Carbon\Carbon;

class TimeTrackingService implements TimeTrackingServiceInterface
{
    public function __construct(
        private TimeEntryRepositoryInterface $timeEntryRepository
    ) {}

    public function checkIn(User $user): TimeEntry
    {
        // Verificar si ya está fichado
        $activeEntry = $this->timeEntryRepository->findActiveByUserId($user->id);

        if ($activeEntry) {
            throw new \Exception('User already checked in');
        }

        // Crear nueva entrada
        return $this->timeEntryRepository->create([
            'user_id' => $user->id,
            'pharmacy_id' => $user->pharmacy_id,
            'check_in_time' => now(),
            'date' => now()->format('Y-m-d')
        ]);
    }

    public function checkOut(User $user): TimeEntry
    {
        $activeEntry = $this->timeEntryRepository->findActiveByUserId($user->id);

        if (!$activeEntry) {
            throw new \Exception('No active check-in found');
        }

        $checkOut = now();
        $durationMinutes = $activeEntry->check_in_time->diffInMinutes($checkOut);

        return $this->timeEntryRepository->update($activeEntry, [
            'check_out_time' => $checkOut,
            'duration_minutes' => $durationMinutes
        ]);
    }

    public function getCurrentStatus(User $user): array
    {
        $activeEntry = $this->timeEntryRepository->findActiveByUserId($user->id);

        return [
            'status' => $activeEntry ? 'checked-in' : 'checked-out',
            'current_entry' => $activeEntry,
            'working_time' => $activeEntry ? $activeEntry->check_in_time->diffForHumans() : null
        ];
    }

    public function getTimeHistory(User $user, ?string $startDate = null, ?string $endDate = null): array
    {
        $startDate = $startDate ?: Carbon::now()->startOfMonth()->format('Y-m-d');
        $endDate = $endDate ?: Carbon::now()->format('Y-m-d');

        $entries = $this->timeEntryRepository->getByPharmacyAndDateRange(
            $user->pharmacy_id,
            $startDate,
            $endDate
        )->where('user_id', $user->id);

        return [
            'entries' => $entries,
            'total_minutes' => $entries->sum('duration_minutes'),
            'total_days' => $entries->groupBy('date')->count()
        ];
    }

    public function getTodayEntry(User $user): ?TimeEntry
    {
        return $this->timeEntryRepository->getTodayEntryByUser($user->id);
    }
}