<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Contracts\Services\AuthServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private AuthServiceInterface $authService
    ) {}

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $result = $this->authService->login(
            $request->email,
            $request->password
        );

        if (!$result) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => $result
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        $user = $request->user()->load('pharmacy');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'pharmacy' => $user->pharmacy
            ]
        ]);
    }
}
