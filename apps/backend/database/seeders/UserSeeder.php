<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'María García',
                'email' => 'maria.garcia@farmaciacentral.com',
                'password' => Hash::make('password123'),
                'role' => 'employee',
                'pharmacy_id' => 1,
            ],
            [
                'name' => 'Carlos López',
                'email' => 'carlos.lopez@farmaciacentral.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'pharmacy_id' => 1,
            ],
            [
                'name' => 'Ana Martínez',
                'email' => 'ana.martinez@farmaciasanjose.com',
                'password' => Hash::make('password123'),
                'role' => 'employee',
                'pharmacy_id' => 2,
            ],
            [
                'name' => 'Pedro Ruiz',
                'email' => 'pedro.ruiz@farmaciadelsol.com',
                'password' => Hash::make('password123'),
                'role' => 'employee',
                'pharmacy_id' => 3,
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }
    }
}
