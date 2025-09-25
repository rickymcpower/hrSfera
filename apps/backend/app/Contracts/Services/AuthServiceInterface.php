<?php

namespace App\Contracts\Services;

use App\Models\User;

interface AuthServiceInterface
{
    public function login(string $email, string $password): ?array;
    public function logout(User $user): void;
    public function getCurrentUser(): ?User;
    public function createToken(User $user): string;
}