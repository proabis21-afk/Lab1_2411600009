<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('sku', 50)->unique();
            $table->text('description')->nullable();
            $table->string('category', 100);
            $table->unsignedInteger('quantity')->default(0);
            $table->unsignedInteger('reorder_level')->default(5);
            $table->decimal('unit_price', 12, 2)->default(0);
            $table->string('supplier', 150);
            $table->timestamps();

            $table->index(['category', 'quantity']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
