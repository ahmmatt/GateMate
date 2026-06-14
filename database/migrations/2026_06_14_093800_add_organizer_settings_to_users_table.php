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
            // Organizer Profile / Settings fields
            if (!Schema::hasColumn('users', 'organization_name')) {
                $table->string('organization_name', 255)->nullable()->after('full_name');
            }
            if (!Schema::hasColumn('users', 'organization_type')) {
                $table->string('organization_type', 100)->nullable()->after('organization_name');
            }
            if (!Schema::hasColumn('users', 'organization_description')) {
                $table->text('organization_description')->nullable()->after('organization_type');
            }
            if (!Schema::hasColumn('users', 'organization_website')) {
                $table->string('organization_website', 255)->nullable()->after('organization_description');
            }
            if (!Schema::hasColumn('users', 'organization_instagram')) {
                $table->string('organization_instagram', 100)->nullable()->after('organization_website');
            }
            if (!Schema::hasColumn('users', 'bank_name')) {
                $table->string('bank_name', 100)->nullable()->after('organization_instagram');
            }
            if (!Schema::hasColumn('users', 'bank_account_number')) {
                $table->string('bank_account_number', 50)->nullable()->after('bank_name');
            }
            if (!Schema::hasColumn('users', 'bank_account_name')) {
                $table->string('bank_account_name', 255)->nullable()->after('bank_account_number');
            }
            if (!Schema::hasColumn('users', 'notification_prefs')) {
                $table->json('notification_prefs')->nullable()->after('bank_account_name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'organization_name',
                'organization_type',
                'organization_description',
                'organization_website',
                'organization_instagram',
                'bank_name',
                'bank_account_number',
                'bank_account_name',
                'notification_prefs',
            ]);
        });
    }
};
