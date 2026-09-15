<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class ProductController extends Controller
{
    public function index(): View
    {
        return view('products.index', [
            'products' => Product::query()->orderBy('name')->paginate(10),
        ]);
    }

    public function create(): View
    {
        return view('products.create', ['product' => new Product]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedData($request);

        $product = DB::transaction(function () use ($validated, $request): Product {
            $product = Product::create($validated);

            if ($product->quantity > 0) {
                $product->inventoryTransactions()->create([
                    'user_id' => $request->user()->id,
                    'type' => 'initial',
                    'quantity' => $product->quantity,
                    'reference' => 'Initial inventory entry',
                ]);
            }

            return $product;
        });

        return redirect()->route('products.show', $product)
            ->with('success', 'Product added to the inventory.');
    }

    public function show(Product $product): View
    {
        return view('products.show', [
            'product' => $product,
            'transactions' => $product->inventoryTransactions()
                ->with('user')
                ->latest()
                ->take(10)
                ->get(),
        ]);
    }

    public function edit(Product $product): View
    {
        return view('products.edit', compact('product'));
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $this->validatedData($request, $product);
        $previousQuantity = $product->quantity;

        DB::transaction(function () use ($validated, $product, $previousQuantity, $request): void {
            $product->update($validated);
            $difference = $product->quantity - $previousQuantity;

            if ($difference !== 0) {
                $product->inventoryTransactions()->create([
                    'user_id' => $request->user()->id,
                    'type' => $difference > 0 ? 'stock_in' : 'stock_out',
                    'quantity' => abs($difference),
                    'reference' => 'Manual quantity adjustment',
                ]);
            }
        });

        return redirect()->route('products.show', $product)
            ->with('success', 'Product information updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        DB::transaction(fn () => $product->delete());

        return redirect()->route('products.index')
            ->with('success', 'Product deleted from the inventory.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedData(Request $request, ?Product $product = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'sku' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products', 'sku')->ignore($product),
            ],
            'description' => ['nullable', 'string', 'max:2000'],
            'category' => ['required', 'string', 'max:100'],
            'quantity' => ['required', 'integer', 'min:0'],
            'reorder_level' => ['required', 'integer', 'min:0'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'supplier' => ['required', 'string', 'max:150'],
        ], [
            'sku.unique' => 'This SKU is already assigned to another product.',
            'quantity.min' => 'Quantity cannot be negative.',
            'reorder_level.min' => 'Reorder level cannot be negative.',
            'unit_price.min' => 'Unit price cannot be negative.',
        ]);
    }
}
