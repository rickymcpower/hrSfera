<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Pharmacy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;

class EmployeeTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private Pharmacy $pharmacy;
    private Pharmacy $otherPharmacy;
    private User $admin;
    private User $employee;
    private User $otherPharmacyAdmin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->pharmacy = Pharmacy::factory()->create();
        $this->otherPharmacy = Pharmacy::factory()->create();

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'pharmacy_id' => $this->pharmacy->id
        ]);

        $this->employee = User::factory()->create([
            'role' => 'employee',
            'pharmacy_id' => $this->pharmacy->id
        ]);

        $this->otherPharmacyAdmin = User::factory()->create([
            'role' => 'admin',
            'pharmacy_id' => $this->otherPharmacy->id
        ]);
    }

    /** @test */
    public function admin_can_get_employees_from_their_pharmacy()
    {
        Sanctum::actingAs($this->admin);

        // Create additional employees in the same pharmacy
        $employee2 = User::factory()->create([
            'role' => 'employee',
            'pharmacy_id' => $this->pharmacy->id
        ]);

        // Create employee in different pharmacy (should not appear)
        User::factory()->create([
            'role' => 'employee',
            'pharmacy_id' => $this->otherPharmacy->id
        ]);

        $response = $this->getJson('/api/employees');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'email',
                            'role',
                            'pharmacy_id',
                            'created_at',
                            'updated_at'
                        ]
                    ]
                ])
                ->assertJson([
                    'success' => true
                ]);

        // Should include admin, employee, and employee2 but not other pharmacy's employee
        $this->assertCount(3, $response->json('data'));

        $emails = collect($response->json('data'))->pluck('email')->toArray();
        $this->assertContains($this->admin->email, $emails);
        $this->assertContains($this->employee->email, $emails);
        $this->assertContains($employee2->email, $emails);
    }

    /** @test */
    public function employee_cannot_access_employee_list()
    {
        Sanctum::actingAs($this->employee);

        $response = $this->getJson('/api/employees');

        $response->assertStatus(403);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_employee_list()
    {
        $response = $this->getJson('/api/employees');

        $response->assertStatus(401);
    }

    /** @test */
    public function admin_can_create_employee_in_their_pharmacy()
    {
        Sanctum::actingAs($this->admin);

        $employeeData = [
            'name' => 'New Employee',
            'email' => 'new.employee@test.com',
            'password' => 'password123',
            'role' => 'employee'
        ];

        $response = $this->postJson('/api/employees', $employeeData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'name',
                        'email',
                        'role',
                        'pharmacy_id',
                        'created_at',
                        'updated_at'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'message' => 'Employee created successfully',
                    'data' => [
                        'name' => 'New Employee',
                        'email' => 'new.employee@test.com',
                        'role' => 'employee',
                        'pharmacy_id' => $this->pharmacy->id
                    ]
                ]);

        $this->assertDatabaseHas('users', [
            'name' => 'New Employee',
            'email' => 'new.employee@test.com',
            'role' => 'employee',
            'pharmacy_id' => $this->pharmacy->id
        ]);
    }

    /** @test */
    public function admin_cannot_create_employee_with_duplicate_email()
    {
        Sanctum::actingAs($this->admin);

        $employeeData = [
            'name' => 'New Employee',
            'email' => $this->employee->email, // Duplicate email
            'password' => 'password123',
            'role' => 'employee'
        ];

        $response = $this->postJson('/api/employees', $employeeData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function admin_cannot_create_employee_with_invalid_data()
    {
        Sanctum::actingAs($this->admin);

        $employeeData = [
            'name' => '', // Empty name
            'email' => 'invalid-email', // Invalid email
            'password' => '123', // Too short password
            'role' => 'invalid-role' // Invalid role
        ];

        $response = $this->postJson('/api/employees', $employeeData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name', 'email', 'password', 'role']);
    }

    /** @test */
    public function admin_can_get_specific_employee_from_their_pharmacy()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->getJson("/api/employees/{$this->employee->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'name',
                        'email',
                        'role',
                        'pharmacy_id'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'id' => $this->employee->id,
                        'email' => $this->employee->email,
                        'pharmacy_id' => $this->pharmacy->id
                    ]
                ]);
    }

    /** @test */
    public function admin_cannot_get_employee_from_different_pharmacy()
    {
        Sanctum::actingAs($this->admin);

        $otherPharmacyEmployee = User::factory()->create([
            'pharmacy_id' => $this->otherPharmacy->id
        ]);

        $response = $this->getJson("/api/employees/{$otherPharmacyEmployee->id}");

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'message' => 'Employee not found'
                ]);
    }

    /** @test */
    public function admin_cannot_get_nonexistent_employee()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->getJson("/api/employees/99999");

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'message' => 'Employee not found'
                ]);
    }

    /** @test */
    public function admin_can_delete_employee_from_their_pharmacy()
    {
        Sanctum::actingAs($this->admin);

        $employeeToDelete = User::factory()->create([
            'role' => 'employee',
            'pharmacy_id' => $this->pharmacy->id
        ]);

        $response = $this->deleteJson("/api/employees/{$employeeToDelete->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Employee deleted successfully'
                ]);

        $this->assertDatabaseMissing('users', [
            'id' => $employeeToDelete->id
        ]);
    }

    /** @test */
    public function admin_cannot_delete_employee_from_different_pharmacy()
    {
        Sanctum::actingAs($this->admin);

        $otherPharmacyEmployee = User::factory()->create([
            'pharmacy_id' => $this->otherPharmacy->id
        ]);

        $response = $this->deleteJson("/api/employees/{$otherPharmacyEmployee->id}");

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'message' => 'Employee not found'
                ]);

        // Employee should still exist
        $this->assertDatabaseHas('users', [
            'id' => $otherPharmacyEmployee->id
        ]);
    }

    /** @test */
    public function admin_cannot_delete_nonexistent_employee()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->deleteJson("/api/employees/99999");

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'message' => 'Employee not found'
                ]);
    }

    /** @test */
    public function employee_cannot_create_other_employees()
    {
        Sanctum::actingAs($this->employee);

        $employeeData = [
            'name' => 'New Employee',
            'email' => 'new.employee@test.com',
            'password' => 'password123',
            'role' => 'employee'
        ];

        $response = $this->postJson('/api/employees', $employeeData);

        $response->assertStatus(403);
    }

    /** @test */
    public function employee_cannot_delete_other_employees()
    {
        Sanctum::actingAs($this->employee);

        $response = $this->deleteJson("/api/employees/{$this->admin->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function employee_cannot_get_specific_employee()
    {
        Sanctum::actingAs($this->employee);

        $response = $this->getJson("/api/employees/{$this->admin->id}");

        $response->assertStatus(403);
    }
}