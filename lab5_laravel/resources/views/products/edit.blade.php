<x-app-layout>
    <x-slot name="header">
        <div class="page-heading">
            <div>
                <p class="eyebrow">Update inventory entry</p>
                <h1>Edit product</h1>
                <p class="page-subtitle">Changes to quantity are recorded in this product's stock history.</p>
            </div>
            <a href="{{ route('products.show', $product) }}" class="button-secondary">Back to product</a>
        </div>
    </x-slot>

    <div class="content-container py-8">
        <form method="POST" action="{{ route('products.update', $product) }}" class="panel form-panel">
            @csrf
            @method('PUT')
            @include('products._form')

            <div class="form-actions">
                <a href="{{ route('products.show', $product) }}" class="button-secondary">Cancel</a>
                <button type="submit" class="button-primary">Save changes</button>
            </div>
        </form>
    </div>
</x-app-layout>
