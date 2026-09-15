<?php

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function productPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Galvanized Roofing Sheet',
        'sku' => 'ROOF-GI-001',
        'description' => 'Pre-painted galvanized iron roofing sheet.',
        'category' => 'Construction Materials',
        'quantity' => 20,
        'reorder_level' => 5,
        'unit_price' => 640.50,
        'supplier' => 'Roofline Trading',
    ], $overrides);
}

test('guests are redirected to login before viewing products', function () {
    $this->get(route('products.index'))
        ->assertRedirect(route('login'));
});

test('an authenticated user can add a product and its opening stock transaction', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('products.store'), productPayload());

    $product = Product::query()->where('sku', 'ROOF-GI-001')->firstOrFail();

    $response->assertRedirect(route('products.show', $product));
    $this->assertDatabaseHas('products', [
        'name' => 'Galvanized Roofing Sheet',
        'sku' => 'ROOF-GI-001',
        'quantity' => 20,
    ]);
    $this->assertDatabaseHas('inventory_transactions', [
        'product_id' => $product->id,
        'user_id' => $user->id,
        'type' => 'initial',
        'quantity' => 20,
    ]);
});

test('an inventory quantity reduction creates a stock out transaction', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'sku' => 'TOOL-DRILL-001',
        'quantity' => 12,
        'reorder_level' => 4,
    ]);

    $this->actingAs($user)->put(
        route('products.update', $product),
        productPayload([
            'sku' => $product->sku,
            'quantity' => 5,
        ]),
    )->assertRedirect(route('products.show', $product));

    $this->assertDatabaseHas('products', ['id' => $product->id, 'quantity' => 5]);
    $this->assertDatabaseHas('inventory_transactions', [
        'product_id' => $product->id,
        'user_id' => $user->id,
        'type' => 'stock_out',
        'quantity' => 7,
    ]);
});

test('product SKU must be unique', function () {
    $user = User::factory()->create();
    Product::factory()->create(['sku' => 'HARD-UNIQUE-001']);

    $this->actingAs($user)->from(route('products.create'))->post(
        route('products.store'),
        productPayload(['sku' => 'HARD-UNIQUE-001']),
    )->assertRedirect(route('products.create'))
        ->assertSessionHasErrors('sku');
});

test('an authenticated user can view the inventory screens and download the CSV report', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'name' => 'PVC Pipe 1/2 in.',
        'sku' => 'PLUMB-PVC12-TEST',
    ]);

    $this->actingAs($user)->get(route('products.index'))
        ->assertOk()
        ->assertSee($product->name);

    $this->actingAs($user)->get(route('products.create'))->assertOk();
    $this->actingAs($user)->get(route('products.show', $product))->assertOk();
    $this->actingAs($user)->get(route('products.edit', $product))->assertOk();

    $response = $this->actingAs($user)->get(route('reports.products.csv'));

    $response
        ->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8')
        ->assertStreamed();

    expect($response->streamedContent())->toContain('PLUMB-PVC12-TEST');
});

test('dashboard shows calculated inventory statistics', function () {
    $user = User::factory()->create();
    Product::factory()->create(['quantity' => 10, 'reorder_level' => 5, 'unit_price' => 25]);
    Product::factory()->create(['quantity' => 3, 'reorder_level' => 5, 'unit_price' => 50]);
    Product::factory()->create(['quantity' => 0, 'reorder_level' => 2, 'unit_price' => 100]);

    $this->actingAs($user)->get(route('dashboard'))
        ->assertOk()
        ->assertSee('Total products')
        ->assertSee('Low-stock items')
        ->assertSee('Out of stock')
        ->assertSee('₱400.00');
});
