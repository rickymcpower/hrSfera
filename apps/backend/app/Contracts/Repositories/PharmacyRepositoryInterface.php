<?php

namespace App\Contracts\Repositories;

use App\Models\Pharmacy;

interface PharmacyRepositoryInterface
{
    public function create(array $data): Pharmacy;
    public function update(Pharmacy $pharmacy, array $data): Pharmacy;
    public function findById(int $id): ?Pharmacy;
    public function getAll();
}