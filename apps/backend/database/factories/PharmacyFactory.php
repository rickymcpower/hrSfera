<?php

namespace Database\Factories;

use App\Models\Pharmacy;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pharmacy>
 */
class PharmacyFactory extends Factory
{
    protected $model = Pharmacy::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company() . ' Pharmacy',
            'logo' => '💊',
            'primary_color' => $this->faker->hexColor(),
            'secondary_color' => $this->faker->hexColor(),
            'address' => $this->faker->address(),
        ];
    }
}