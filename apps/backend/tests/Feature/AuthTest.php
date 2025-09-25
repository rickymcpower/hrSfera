<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Pharmacy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;

class AuthTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private Pharmacy $pharmacy;
    private User $user;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        // Create pharmacy
        $this->pharmacy = Pharmacy::factory()->create();

        // Create regular user
        $this->user = User::factory()->create([
            'email' => 'employee@test.com',
            'password' => bcrypt('password123'),
            'role' => 'employee',
            'pharmacy_id' => $this->pharmacy->id
        ]);

        // Create admin user
        $this->admin = User::factory()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'pharmacy_id' => $this->pharmacy->id
        ]);
    }

    /** @test */
    public function login_with_valid_credentials_returns_success_with_token()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'employee@test.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'user' => [
                            'id',
                            'name',
                            'email',
                            'role',
                            'pharmacy_id',
                            'pharmacy' => [
                                'id',
                                'name',
                                'logo',
                                'primary_color',
                                'secondary_color'
                            ]
                        ],
                        'token',
                        'pharmacy'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'message' => 'Login successful'
                ]);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $this->user->id
        ]);
    }

    /** @test */
    public function login_with_invalid_credentials_returns_unauthorized()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'employee@test.com',
            'password' => 'wrong_password'
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function login_with_missing_fields_returns_validation_error()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'employee@test.com'
            // password missing
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['password']);
    }

    /** @test */
    public function logout_with_valid_token_returns_success()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/auth/logout');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Logged out successfully'
                ]);
    }

    /** @test */
    public function logout_without_authentication_returns_unauthorized()
    {
        $response = $this->postJson('/api/auth/logout');

        $response->assertStatus(401);
    }

    /** @test */
    public function logout_with_expired_token_returns_unauthorized()
    {
        // Create token and then delete it to simulate expiry
        $token = $this->user->createToken('test-token');
        $token->accessToken->delete();

        $response = $this->postJson('/api/auth/logout', [], [
            'Authorization' => 'Bearer ' . $token->plainTextToken
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function get_user_info_with_valid_token_returns_user_data()
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/auth/user');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'user' => [
                            'id',
                            'name',
                            'email',
                            'role',
                            'pharmacy_id'
                        ],
                        'pharmacy'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'user' => [
                            'id' => $this->user->id,
                            'email' => $this->user->email
                        ]
                    ]
                ]);
    }

    /** @test */
    public function get_user_info_without_authentication_returns_unauthorized()
    {
        $response = $this->getJson('/api/auth/user');

        $response->assertStatus(401);
    }

    /** @test */
    public function get_user_info_with_invalid_token_returns_unauthorized()
    {
        $response = $this->getJson('/api/auth/user', [
            'Authorization' => 'Bearer invalid_token'
        ]);

        $response->assertStatus(401);
    }
}