<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TimeEntryController;
use App\Http\Controllers\Api\EmployeeController;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // Time tracking routes
    Route::prefix('time-entries')->group(function () {
        Route::post('/check-in', [TimeEntryController::class, 'checkIn']);
        Route::put('/check-out', [TimeEntryController::class, 'checkOut']);
        Route::get('/status', [TimeEntryController::class, 'status']);
        Route::get('/history', [TimeEntryController::class, 'history']);
        Route::get('/today', [TimeEntryController::class, 'today']);
    });

    // Employee management routes (admin only)
    Route::middleware(['admin'])->group(function () {
        Route::apiResource('employees', EmployeeController::class);
    });
});