<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'sku' => strtoupper(fake()->unique()->bothify('SKU-####-???')),
            'description' => fake()->sentence(),
            'category' => fake()->randomElement(['Equipment', 'Apparel', 'Supplements', 'Accessories']),
            'quantity' => fake()->numberBetween(1, 100),
            'reorder_level' => fake()->numberBetween(1, 10),
            'unit_price' => fake()->randomFloat(2, 10, 1000),
            'supplier' => fake()->company(),
        ];
    }
}
