<x-app-layout>
    <x-slot name="header">
        <div class="page-heading">
            <div>
                <p class="eyebrow">Inventory overview</p>
                <h1>Welcome back, {{ Auth::user()->name }}</h1>
                <p class="page-subtitle">Here is the current health of your fitness inventory.</p>
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

        <section class="stats-grid" aria-label="Inventory statistics">
            <article class="stat-card">
                <p class="stat-label">Total products</p>
                <p class="stat-value">{{ number_format($statistics['totalProducts']) }}</p>
                <p class="stat-detail">Unique products tracked</p>
            </article>
            <article class="stat-card stat-card-warning">
                <p class="stat-label">Low-stock items</p>
                <p class="stat-value">{{ number_format($statistics['lowStockProducts']) }}</p>
                <p class="stat-detail">At or below reorder level</p>
            </article>
            <article class="stat-card stat-card-danger">
                <p class="stat-label">Out of stock</p>
                <p class="stat-value">{{ number_format($statistics['outOfStockProducts']) }}</p>
                <p class="stat-detail">Needs replenishment now</p>
            </article>
            <article class="stat-card stat-card-accent">
                <p class="stat-label">Inventory value</p>
                <p class="stat-value">₱{{ number_format($statistics['inventoryValue'], 2) }}</p>
                <p class="stat-detail">Based on current unit prices</p>
            </article>
        </section>

        <div class="dashboard-grid mt-7">
            <section class="panel">
                <div class="panel-heading">
                    <div>
                        <p class="eyebrow">Latest additions</p>
                        <h2>Recently added products</h2>
                    </div>
                    <a href="{{ route('products.index') }}" class="text-link">View all products</a>
                </div>

                @if ($recentProducts->isEmpty())
                    <div class="empty-state">No products yet. Add your first product to begin tracking inventory.</div>
                @else
                    <div class="table-wrap">
                        <table class="inventory-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($recentProducts as $product)
                                    <tr>
                                        <td>
                                            <a href="{{ route('products.show', $product) }}" class="table-product">{{ $product->name }}</a>
                                            <span class="table-muted">{{ $product->sku }}</span>
                                        </td>
                                        <td>{{ $product->category }}</td>
                                        <td>
                                            <span class="{{ $product->isOutOfStock() ? 'stock-badge stock-badge-danger' : ($product->isLowStock() ? 'stock-badge stock-badge-warning' : 'stock-badge stock-badge-good') }}">
                                                {{ $product->quantity }} units
                                            </span>
                                        </td>
                                        <td><a href="{{ route('products.edit', $product) }}" class="table-action">Edit</a></td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endif
            </section>

            <aside class="panel low-stock-panel">
                <div class="panel-heading">
                    <div>
                        <p class="eyebrow">Replenishment alert</p>
                        <h2>Low-stock watchlist</h2>
                    </div>
                </div>

                @if ($lowStockItems->isEmpty())
                    <div class="empty-state">Great work—no products are currently at their reorder level.</div>
                @else
                    <ul class="watchlist">
                        @foreach ($lowStockItems as $product)
                            <li>
                                <div>
                                    <a href="{{ route('products.show', $product) }}">{{ $product->name }}</a>
                                    <span>{{ $product->quantity }} left · reorder at {{ $product->reorder_level }}</span>
                                </div>
                                <span class="{{ $product->isOutOfStock() ? 'stock-badge stock-badge-danger' : 'stock-badge stock-badge-warning' }}">
                                    {{ $product->isOutOfStock() ? 'Out' : 'Low' }}
                                </span>
                            </li>
                        @endforeach
                    </ul>
                @endif
            </aside>
        </div>
    </div>
</x-app-layout>
