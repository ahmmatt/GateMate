<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'organization_address')) {
                $table->text('organization_address')->nullable()->after('organization_description');
            }
            if (!Schema::hasColumn('users', 'organization_tiktok')) {
                $table->string('organization_tiktok', 100)->nullable()->after('organization_instagram');
            }
            if (!Schema::hasColumn('users', 'organization_twitter')) {
                $table->string('organization_twitter', 100)->nullable()->after('organization_tiktok');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['organization_address', 'organization_tiktok', 'organization_twitter']);
        });
    }
};
