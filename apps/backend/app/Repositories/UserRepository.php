<?php

namespace App\Repositories;

use App\Contracts\Repositories\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository implements UserRepositoryInterface
{
    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user->fresh();
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function getByPharmacy(int $pharmacyId): Collection
    {
        return User::where('pharmacy_id', $pharmacyId)
            ->orderBy('name')
            ->get();
    }

    public function getAdminsByPharmacy(int $pharmacyId): Collection
    {
        return User::where('pharmacy_id', $pharmacyId)
            ->where('role', 'admin')
            ->orderBy('name')
            ->get();
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }
}