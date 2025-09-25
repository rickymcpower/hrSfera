<?php

namespace App\Repositories;

use App\Contracts\Repositories\PharmacyRepositoryInterface;
use App\Models\Pharmacy;
use Illuminate\Database\Eloquent\Collection;

class PharmacyRepository implements PharmacyRepositoryInterface
{
    public function create(array $data): Pharmacy
    {
        return Pharmacy::create($data);
    }

    public function update(Pharmacy $pharmacy, array $data): Pharmacy
    {
        $pharmacy->update($data);
        return $pharmacy->fresh();
    }

    public function findById(int $id): ?Pharmacy
    {
        return Pharmacy::find($id);
    }

    public function getAll(): Collection
    {
        return Pharmacy::orderBy('name')->get();
    }
}