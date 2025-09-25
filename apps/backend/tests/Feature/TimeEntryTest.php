<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Pharmacy;
use App\Models\TimeEntry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Carbon\Carbon;

class TimeEntryTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private Pharmacy $pharmacy;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->pharmacy = Pharmacy::factory()->create();
        $this->user = User::factory()->create([
            'role' => 'employee',
            'pharmacy_id' => $this->pharmacy->id
        ]);
    }

    /** @test */
    public function check_in_when_not_checked_in_creates_new_time_entry()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/time-entries/check-in');

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'user_id',
                        'pharmacy_id',
                        'check_in_time',
                        'date',
                        'user',
                        'pharmacy'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'message' => 'Check-in successful'
                ]);

        $this->assertDatabaseHas('time_entries', [
            'user_id' => $this->user->id,
            'pharmacy_id' => $this->pharmacy->id,
            'check_out_time' => null
        ]);

        $entry = TimeEntry::where('user_id', $this->user->id)
                         ->where('pharmacy_id', $this->pharmacy->id)
                         ->whereNull('check_out_time')
                         ->first();

        $this->assertEquals(now()->format('Y-m-d'), $entry->date->format('Y-m-d'));
    }

    /** @test */
    public function check_in_when_already_checked_in_returns_conflict()
    {
        Sanctum::actingAs($this->user);

        // First check-in
        TimeEntry::create([
            'user_id' => $this->user->id,
            'pharmacy_id' => $this->pharmacy->id,
            'check_in_time' => now(),
            'date' => now()->format('Y-m-d')
        ]);

        $response = $this->postJson('/api/time-entries/check-in');

        $response->assertStatus(409)
                ->assertJson([
                    'success' => false,
                    'message' => 'Already checked in'
                ]);
    }

    /** @test */
    public function check_in_without_authentication_returns_unauthorized()
    {
        $response = $this->postJson('/api/time-entries/check-in');

        $response->assertStatus(401);
    }

    /** @test */
    public function check_out_when_checked_in_updates_time_entry()
    {
        Sanctum::actingAs($this->user);

        $checkInTime = now()->subMinutes(60);
        $timeEntry = TimeEntry::create([
            'user_id' => $this->user->id,
            'pharmacy_id' => $this->pharmacy->id,
            'check_in_time' => $checkInTime,
            'date' => now()->format('Y-m-d')
        ]);

        $response = $this->putJson('/api/time-entries/check-out');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'user_id',
                        'pharmacy_id',
                        'check_in_time',
                        'check_out_time',
                        'duration_minutes',
                        'date'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'message' => 'Check-out successful'
                ]);

        $timeEntry->refresh();
        $this->assertNotNull($timeEntry->check_out_time);
        $this->assertNotNull($timeEntry->duration_minutes);
        $this->assertGreaterThan(0, $timeEntry->duration_minutes);
    }

    /** @test */
    public function check_out_when_not_checked_in_returns_conflict()
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson('/api/time-entries/check-out');

        $response->assertStatus(409)
                ->assertJson([
                    'success' => false,
                    'message' => 'Not currently checked in'
                ]);
    }

    /** @test */
    public function check_out_without_authentication_returns_unauthorized()
    {
        $response = $this->putJson('/api/time-entries/check-out');

        $response->assertStatus(401);
    }

    /** @test */
    public function get_status_when_checked_in_returns_current_entry()
    {
        Sanctum::actingAs($this->user);

        $timeEntry = TimeEntry::create([
            'user_id' => $this->user->id,
            'pharmacy_id' => $this->pharmacy->id,
            'check_in_time' => now()->subMinutes(30),
            'date' => now()->format('Y-m-d')
        ]);

        $response = $this->getJson('/api/time-entries/status');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'status',
                        'current_entry' => [
                            'id',
                            'user_id',
                            'pharmacy_id',
                            'check_in_time',
                            'date'
                        ],
                        'working_time'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'status' => 'checked-in'
                    ]
                ]);
    }

    /** @test */
    public function get_status_when_checked_out_returns_checked_out_status()
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/time-entries/status');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'status' => 'checked-out',
                        'current_entry' => null,
                        'working_time' => null
                    ]
                ]);
    }

    /** @test */
    public function get_status_without_authentication_returns_unauthorized()
    {
        $response = $this->getJson('/api/time-entries/status');

        $response->assertStatus(401);
    }

    /** @test */
    public function get_history_returns_completed_time_entries()
    {
        Sanctum::actingAs($this->user);

        // Create completed time entries
        TimeEntry::create([
            'user_id' => $this->user->id,
            'pharmacy_id' => $this->pharmacy->id,
            'check_in_time' => now()->subDays(2)->setTime(9, 0),
            'check_out_time' => now()->subDays(2)->setTime(17, 0),
            'duration_minutes' => 480,
            'date' => now()->subDays(2)->format('Y-m-d')
        ]);

        TimeEntry::create([
            'user_id' => $this->user->id,
            'pharmacy_id' => $this->pharmacy->id,
            'check_in_time' => now()->subDay()->setTime(9, 0),
            'check_out_time' => now()->subDay()->setTime(17, 30),
            'duration_minutes' => 510,
            'date' => now()->subDay()->format('Y-m-d')
        ]);

        $response = $this->getJson('/api/time-entries/history');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'entries' => [
                            '*' => [
                                'id',
                                'user_id',
                                'pharmacy_id',
                                'check_in_time',
                                'check_out_time',
                                'duration_minutes',
                                'date'
                            ]
                        ],
                        'total_minutes',
                        'total_days'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'total_minutes' => 990,
                        'total_days' => 2
                    ]
                ]);
    }

    /** @test */
    public function get_history_with_no_entries_returns_empty_data()
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/time-entries/history');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'entries' => [],
                        'total_minutes' => 0,
                        'total_days' => 0
                    ]
                ]);
    }

    /** @test */
    public function get_history_without_authentication_returns_unauthorized()
    {
        $response = $this->getJson('/api/time-entries/history');

        $response->assertStatus(401);
    }

    /** @test */
    public function get_today_entry_returns_current_day_entry()
    {
        Sanctum::actingAs($this->user);

        $timeEntry = TimeEntry::create([
            'user_id' => $this->user->id,
            'pharmacy_id' => $this->pharmacy->id,
            'check_in_time' => now()->setTime(9, 0),
            'check_out_time' => null,
            'date' => now()->format('Y-m-d')
        ]);

        $response = $this->getJson('/api/time-entries/today');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'user_id',
                        'pharmacy_id',
                        'check_in_time',
                        'date'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'id' => $timeEntry->id,
                        'user_id' => $this->user->id
                    ]
                ]);
    }

    /** @test */
    public function get_today_entry_with_no_entry_returns_null()
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/time-entries/today');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => null
                ]);
    }

    /** @test */
    public function get_today_entry_without_authentication_returns_unauthorized()
    {
        $response = $this->getJson('/api/time-entries/today');

        $response->assertStatus(401);
    }
}