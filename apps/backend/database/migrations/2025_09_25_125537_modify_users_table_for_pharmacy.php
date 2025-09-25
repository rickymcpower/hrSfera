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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['employee', 'admin'])->default('employee')->after('password');
            $table->foreignId('pharmacy_id')->constrained()->onDelete('cascade')->after('role');
            $table->index(['pharmacy_id', 'role']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['pharmacy_id']);
            $table->dropIndex(['pharmacy_id', 'role']);
            $table->dropColumn(['role', 'pharmacy_id']);
        });
    }
};
