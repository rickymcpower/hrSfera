<?php

namespace App\Contracts\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    public function create(array $data): User;
    public function update(User $user, array $data): User;
    public function findById(int $id): ?User;
    public function findByEmail(string $email): ?User;
    public function getByPharmacy(int $pharmacyId): Collection;
    public function getAdminsByPharmacy(int $pharmacyId): Collection;
    public function delete(User $user): bool;
}