<?php

namespace App\Services;

use App\Contracts\Services\AuthServiceInterface;
use App\Contracts\Repositories\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthService implements AuthServiceInterface
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    public function login(string $email, string $password): ?array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || !Hash::check($password, $user->password)) {
            return null;
        }

        $token = $this->createToken($user);
        $user->load('pharmacy');

        return [
            'user' => $user,
            'token' => $token,
            'pharmacy' => $user->pharmacy
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    public function getCurrentUser(): ?User
    {
        return Auth::user();
    }

    public function createToken(User $user): string
    {
        return $user->createToken('api-token')->plainTextToken;
    }
}