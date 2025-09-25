<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pharmacy;

class PharmacySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pharmacies = [
            [
                'name' => 'Farmacia Central',
                'logo' => '💊',
                'primary_color' => '#22c55e',
                'secondary_color' => '#16a34a',
                'address' => 'Calle Mayor 123, Madrid',
            ],
            [
                'name' => 'Farmacia San José',
                'logo' => '🏥',
                'primary_color' => '#3b82f6',
                'secondary_color' => '#1d4ed8',
                'address' => 'Avenida Diagonal 456, Barcelona',
            ],
            [
                'name' => 'Farmacia del Sol',
                'logo' => '☀️',
                'primary_color' => '#f59e0b',
                'secondary_color' => '#d97706',
                'address' => 'Plaza del Sol 789, Valencia',
            ],
        ];

        foreach ($pharmacies as $pharmacy) {
            Pharmacy::create($pharmacy);
        }
    }
}
