<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Contracts\Services\TimeTrackingServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TimeEntryController extends Controller
{
    public function __construct(
        private TimeTrackingServiceInterface $timeTrackingService
    ) {}

    public function checkIn(Request $request): JsonResponse
    {
        try {
            $timeEntry = $this->timeTrackingService->checkIn($request->user());

            return response()->json([
                'success' => true,
                'message' => 'Check-in successful',
                'data' => $timeEntry->load('user', 'pharmacy')
            ], 201);
        } catch (\Exception $e) {
            if (str_contains($e->getMessage(), 'already checked in')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Already checked in'
                ], 409);
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function checkOut(Request $request): JsonResponse
    {
        try {
            $timeEntry = $this->timeTrackingService->checkOut($request->user());

            return response()->json([
                'success' => true,
                'message' => 'Check-out successful',
                'data' => $timeEntry
            ], 200);
        } catch (\Exception $e) {
            if (str_contains($e->getMessage(), 'No active check-in')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not currently checked in'
                ], 409);
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function status(Request $request): JsonResponse
    {
        $status = $this->timeTrackingService->getCurrentStatus($request->user());

        return response()->json([
            'success' => true,
            'data' => $status
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $history = $this->timeTrackingService->getTimeHistory(
            $request->user(),
            $request->get('start_date'),
            $request->get('end_date')
        );

        return response()->json([
            'success' => true,
            'data' => $history
        ]);
    }

    public function today(Request $request): JsonResponse
    {
        $todayEntry = $this->timeTrackingService->getTodayEntry($request->user());

        return response()->json([
            'success' => true,
            'data' => $todayEntry
        ]);
    }
}
