<x-app-layout>
    <x-slot name="header">
        <div class="page-heading">
            <div>
                <p class="eyebrow">Inventory catalog</p>
                <h1>Products</h1>
                <p class="page-subtitle">Manage stock levels, product details, and supplier information.</p>
            </div>
            <div class="page-actions">
                <a href="{{ route('reports.products.csv') }}" class="button-secondary">Download CSV</a>
                <a href="{{ route('products.create') }}" class="button-primary">+ Add product</a>
            </div>
        </div>
    </x-slot>

    <div class="content-container py-8">
        @if (session('success'))
            <div class="flash-message" role="status">{{ session('success') }}</div>
        @endif

        <section class="panel">
            <div class="panel-heading">
                <div>
                    <p class="eyebrow">{{ $products->total() }} recorded</p>
                    <h2>All products</h2>
                </div>
            </div>

            @if ($products->isEmpty())
                <div class="empty-state">
                    <p>No products have been added yet.</p>
                    <a href="{{ route('products.create') }}" class="button-primary">Add the first product</a>
                </div>
            @else
                <div class="table-wrap">
                    <table class="inventory-table inventory-table-wide">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Unit price</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th><span class="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($products as $product)
                                <tr>
                                    <td><a href="{{ route('products.show', $product) }}" class="table-product">{{ $product->name }}</a></td>
                                    <td class="table-muted">{{ $product->sku }}</td>
                                    <td>{{ $product->category }}</td>
                                    <td>₱{{ number_format((float) $product->unit_price, 2) }}</td>
                                    <td>{{ $product->quantity }} <span class="table-muted">/ reorder {{ $product->reorder_level }}</span></td>
                                    <td>
                                        @if ($product->isOutOfStock())
                                            <span class="stock-badge stock-badge-danger">Out of stock</span>
                                        @elseif ($product->isLowStock())
                                            <span class="stock-badge stock-badge-warning">Low stock</span>
                                        @else
                                            <span class="stock-badge stock-badge-good">In stock</span>
                                        @endif
                                    </td>
                                    <td>
                                        <div class="row-actions">
                                            <a href="{{ route('products.show', $product) }}" class="table-action">View</a>
                                            <a href="{{ route('products.edit', $product) }}" class="table-action">Edit</a>
                                            <form action="{{ route('products.destroy', $product) }}" method="POST" onsubmit="return confirm('Delete {{ addslashes($product->name) }}? This cannot be undone.');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="table-action table-action-danger">Delete</button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                <div class="pagination-wrap">
                    {{ $products->links() }}
                </div>
            @endif
        </section>
    </div>
</x-app-layout>
