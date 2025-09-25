<?php

namespace Database\Factories;

use App\Models\TimeEntry;
use App\Models\User;
use App\Models\Pharmacy;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimeEntry>
 */
class TimeEntryFactory extends Factory
{
    protected $model = TimeEntry::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkIn = $this->faker->dateTimeBetween('-1 week', 'now');
        $checkOut = Carbon::instance($checkIn)->addHours(rand(4, 10));
        $durationMinutes = Carbon::instance($checkIn)->diffInMinutes($checkOut);

        return [
            'user_id' => User::factory(),
            'pharmacy_id' => Pharmacy::factory(),
            'check_in_time' => $checkIn,
            'check_out_time' => $checkOut,
            'duration_minutes' => $durationMinutes,
            'date' => Carbon::instance($checkIn)->format('Y-m-d'),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    /**
     * Create a time entry that is currently checked in (no check out time)
     */
    public function checkedIn(): static
    {
        return $this->state(fn (array $attributes) => [
            'check_out_time' => null,
            'duration_minutes' => null,
        ]);
    }

    /**
     * Create a time entry for today
     */
    public function today(): static
    {
        $checkIn = now()->setTime(rand(7, 10), rand(0, 59));

        return $this->state(fn (array $attributes) => [
            'check_in_time' => $checkIn,
            'date' => now()->format('Y-m-d'),
        ]);
    }
}