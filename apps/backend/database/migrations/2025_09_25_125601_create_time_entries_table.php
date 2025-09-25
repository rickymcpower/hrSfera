<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('time_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('pharmacy_id')->constrained()->onDelete('cascade');
            $table->timestamp('check_in_time');
            $table->timestamp('check_out_time')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->date('date');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'date']);
            $table->index(['pharmacy_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_entries');
    }
};
