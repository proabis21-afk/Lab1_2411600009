<x-app-layout>
    <x-slot name="header">
        <div class="page-heading">
            <div>
                <p class="eyebrow">{{ $product->category }}</p>
                <h1>{{ $product->name }}</h1>
                <p class="page-subtitle">SKU: {{ $product->sku }}</p>
            </div>
            <div class="page-actions">
                <a href="{{ route('products.index') }}" class="button-secondary">All products</a>
                <a href="{{ route('products.edit', $product) }}" class="button-primary">Edit product</a>
            </div>
        </div>
    </x-slot>

    <div class="content-container py-8">
        @if (session('success'))
            <div class="flash-message" role="status">{{ session('success') }}</div>
        @endif

        <div class="product-detail-grid">
            <section class="panel">
                <div class="panel-heading">
                    <div>
                        <p class="eyebrow">Product details</p>
                        <h2>Inventory information</h2>
                    </div>
                    @if ($product->isOutOfStock())
                        <span class="stock-badge stock-badge-danger">Out of stock</span>
                    @elseif ($product->isLowStock())
                        <span class="stock-badge stock-badge-warning">Low stock</span>
                    @else
                        <span class="stock-badge stock-badge-good">In stock</span>
                    @endif
                </div>

                <dl class="detail-list">
                    <div><dt>SKU</dt><dd>{{ $product->sku }}</dd></div>
                    <div><dt>Category</dt><dd>{{ $product->category }}</dd></div>
                    <div><dt>Supplier</dt><dd>{{ $product->supplier }}</dd></div>
                    <div><dt>Unit price</dt><dd>₱{{ number_format((float) $product->unit_price, 2) }}</dd></div>
                    <div><dt>Current quantity</dt><dd>{{ $product->quantity }} units</dd></div>
                    <div><dt>Reorder level</dt><dd>{{ $product->reorder_level }} units</dd></div>
                    <div><dt>Inventory value</dt><dd>₱{{ number_format($product->inventoryValue(), 2) }}</dd></div>
                    <div><dt>Last updated</dt><dd>{{ $product->updated_at->format('M j, Y g:i A') }}</dd></div>
                </dl>

                @if ($product->description)
                    <div class="product-description">
                        <h3>Description</h3>
                        <p>{{ $product->description }}</p>
                    </div>
                @endif
            </section>

            <aside class="panel action-panel">
                <p class="eyebrow">Product actions</p>
                <h2>Manage this item</h2>
                <p>Update the quantity when stock is delivered or issued. The adjustment will be saved below.</p>
                <a href="{{ route('products.edit', $product) }}" class="button-primary button-full">Edit product</a>
                <form method="POST" action="{{ route('products.destroy', $product) }}" onsubmit="return confirm('Delete {{ addslashes($product->name) }}? This cannot be undone.');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="button-danger button-full">Delete product</button>
                </form>
            </aside>
        </div>

        <section class="panel mt-7">
            <div class="panel-heading">
                <div>
                    <p class="eyebrow">Accountability log</p>
                    <h2>Recent stock transactions</h2>
                </div>
            </div>

            @if ($transactions->isEmpty())
                <div class="empty-state">No stock movement has been recorded for this product yet.</div>
            @else
                <div class="table-wrap">
                    <table class="inventory-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Reference</th>
                                <th>Recorded by</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($transactions as $transaction)
                                <tr>
                                    <td>{{ $transaction->created_at->format('M j, Y g:i A') }}</td>
                                    <td><span class="transaction-type transaction-{{ $transaction->type }}">{{ str_replace('_', ' ', ucfirst($transaction->type)) }}</span></td>
                                    <td>{{ $transaction->type === 'stock_out' ? '-' : '+' }}{{ $transaction->quantity }}</td>
                                    <td>{{ $transaction->reference ?? '—' }}</td>
                                    <td>{{ $transaction->user?->name ?? 'System' }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </section>
    </div>
</x-app-layout>
