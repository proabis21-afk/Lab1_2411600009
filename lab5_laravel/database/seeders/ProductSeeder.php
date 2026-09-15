<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Adjustable Dumbbell Set 20kg',
                'sku' => 'EQ-DB-001',
                'description' => 'Premium adjustable dumbbells for home workouts.',
                'category' => 'Equipment',
                'quantity' => 25,
                'reorder_level' => 8,
                'unit_price' => 3499.00,
                'supplier' => 'FitPro Equipment Co',
            ],
            [
                'name' => 'Resistance Bands Set (5 levels)',
                'sku' => 'EQ-RB-002',
                'description' => 'Color coded resistance bands with handles and door anchor.',
                'category' => 'Equipment',
                'quantity' => 40,
                'reorder_level' => 15,
                'unit_price' => 799.00,
                'supplier' => 'PowerBand Fitness',
            ],
            [
                'name' => 'Yoga Mat Premium 6mm',
                'sku' => 'EQ-YM-003',
                'description' => 'Non-slip eco-friendly yoga mat with carrying strap.',
                'category' => 'Equipment',
                'quantity' => 30,
                'reorder_level' => 10,
                'unit_price' => 1299.00,
                'supplier' => 'ZenFit Supplies',
            ],
            [
                'name' => "Men's Performance T-Shirt",
                'sku' => 'AP-TS-004',
                'description' => 'Moisture-wicking athletic t-shirt with anti-odor tech.',
                'category' => 'Apparel',
                'quantity' => 60,
                'reorder_level' => 20,
                'unit_price' => 799.00,
                'supplier' => 'ActiveWear PH',
            ],
            [
                'name' => "Women's High Waist Leggings",
                'sku' => 'AP-LG-005',
                'description' => 'Sculpting high-waist workout leggings with side pockets.',
                'category' => 'Apparel',
                'quantity' => 45,
                'reorder_level' => 12,
                'unit_price' => 1199.00,
                'supplier' => 'ActiveWear PH',
            ],
            [
                'name' => 'Whey Protein Isolate 2kg',
                'sku' => 'SU-WP-006',
                'description' => 'Grass-fed whey protein isolate, chocolate flavor.',
                'category' => 'Supplements',
                'quantity' => 18,
                'reorder_level' => 8,
                'unit_price' => 2899.00,
                'supplier' => 'NutriMax Labs',
            ],
            [
                'name' => 'Creatine Monohydrate 500g',
                'sku' => 'SU-CR-007',
                'description' => 'Micronized creatine monohydrate for strength and recovery.',
                'category' => 'Supplements',
                'quantity' => 22,
                'reorder_level' => 10,
                'unit_price' => 999.00,
                'supplier' => 'NutriMax Labs',
            ],
            [
                'name' => 'Pre Workout Energy Formula',
                'sku' => 'SU-PW-008',
                'description' => 'Citrus pre-workout with 300mg caffeine and beta-alanine.',
                'category' => 'Supplements',
                'quantity' => 16,
                'reorder_level' => 6,
                'unit_price' => 1499.00,
                'supplier' => 'NutriMax Labs',
            ],
            [
                'name' => 'Fitness Tracker Smartwatch',
                'sku' => 'AC-SW-009',
                'description' => 'Heart rate, GPS, sleep tracking and 14-day battery.',
                'category' => 'Accessories',
                'quantity' => 12,
                'reorder_level' => 5,
                'unit_price' => 4599.00,
                'supplier' => 'TechFit Gadgets',
            ],
            [
                'name' => 'Gym Gloves with Wrist Support',
                'sku' => 'AC-GL-010',
                'description' => 'Padded weightlifting gloves with full wrist wrap.',
                'category' => 'Accessories',
                'quantity' => 35,
                'reorder_level' => 10,
                'unit_price' => 599.00,
                'supplier' => 'GripStrong',
            ],
            [
                'name' => 'Kettlebell 16kg',
                'sku' => 'EQ-KB-011',
                'description' => 'Cast iron kettlebell with durable powder coat finish.',
                'category' => 'Equipment',
                'quantity' => 8,
                'reorder_level' => 4,
                'unit_price' => 1899.00,
                'supplier' => 'FitPro Equipment Co',
            ],
            [
                'name' => 'Jump Rope Speed Rope',
                'sku' => 'EQ-JR-012',
                'description' => 'Adjustable steel cable speed rope for cardio training.',
                'category' => 'Equipment',
                'quantity' => 50,
                'reorder_level' => 20,
                'unit_price' => 499.00,
                'supplier' => 'PowerBand Fitness',
            ],
            [
                'name' => 'Protein Shaker Bottle 700ml',
                'sku' => 'AC-SB-013',
                'description' => 'BPA-free shaker bottle with mixing ball and measurement marks.',
                'category' => 'Accessories',
                'quantity' => 4,
                'reorder_level' => 16,
                'unit_price' => 299.00,
                'supplier' => 'HydratePro',
            ],
            [
                'name' => 'Foam Roller High Density',
                'sku' => 'EQ-FR-014',
                'description' => 'Deep tissue foam roller 45cm for muscle recovery.',
                'category' => 'Equipment',
                'quantity' => 15,
                'reorder_level' => 8,
                'unit_price' => 799.00,
                'supplier' => 'ZenFit Supplies',
            ],
            [
                'name' => 'BCAA Amino Acids 300g',
                'sku' => 'SU-BC-015',
                'description' => '2:1:1 BCAA ratio, fruit punch flavor. Supports muscle recovery.',
                'category' => 'Supplements',
                'quantity' => 9,
                'reorder_level' => 10,
                'unit_price' => 1299.00,
                'supplier' => 'NutriMax Labs',
            ],
        ];

        $userId = User::query()->where('email', 'admin@lightway.test')->value('id');

        foreach ($products as $data) {
            $product = Product::query()->updateOrCreate(['sku' => $data['sku']], $data);

            if ($product->wasRecentlyCreated && $product->quantity > 0) {
                $product->inventoryTransactions()->create([
                    'user_id' => $userId,
                    'type' => 'initial',
                    'quantity' => $product->quantity,
                    'reference' => 'Sample opening stock',
                ]);
            }
        }
    }
}
