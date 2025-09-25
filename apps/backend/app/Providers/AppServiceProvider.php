<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repository bindings
        $this->app->bind(
            \App\Contracts\Repositories\UserRepositoryInterface::class,
            \App\Repositories\UserRepository::class
        );

        $this->app->bind(
            \App\Contracts\Repositories\TimeEntryRepositoryInterface::class,
            \App\Repositories\TimeEntryRepository::class
        );

        $this->app->bind(
            \App\Contracts\Repositories\PharmacyRepositoryInterface::class,
            \App\Repositories\PharmacyRepository::class
        );

        // Service bindings
        $this->app->bind(
            \App\Contracts\Services\TimeTrackingServiceInterface::class,
            \App\Services\TimeTrackingService::class
        );

        $this->app->bind(
            \App\Contracts\Services\AuthServiceInterface::class,
            \App\Services\AuthService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
