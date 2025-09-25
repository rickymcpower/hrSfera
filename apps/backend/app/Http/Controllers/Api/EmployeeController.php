<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Contracts\Repositories\UserRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $employees = $this->userRepository->getByPharmacy($request->user()->pharmacy_id);

        return response()->json([
            'success' => true,
            'data' => $employees
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:employee,admin',
            'password' => 'required|string|min:8',
        ]);

        try {
            $employee = $this->userRepository->create([
                'name' => $request->name,
                'email' => $request->email,
                'role' => $request->role,
                'pharmacy_id' => $request->user()->pharmacy_id,
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Employee created successfully',
                'data' => $employee
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create employee'
            ], 400);
        }
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $employee = $this->userRepository->findById($id);

        if (!$employee || $employee->pharmacy_id !== $request->user()->pharmacy_id) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $employee
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $employee = $this->userRepository->findById($id);

        if (!$employee || $employee->pharmacy_id !== $request->user()->pharmacy_id) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $this->userRepository->delete($employee);

        return response()->json([
            'success' => true,
            'message' => 'Employee deleted successfully'
        ]);
    }
}
