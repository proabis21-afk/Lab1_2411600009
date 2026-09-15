<x-app-layout>
    <x-slot name="header">
        <div class="page-heading">
            <div>
                <p class="eyebrow">New inventory entry</p>
                <h1>Add product</h1>
                <p class="page-subtitle">Enter complete product information to begin tracking its stock.</p>
            </div>
            <a href="{{ route('products.index') }}" class="button-secondary">Cancel</a>
        </div>
    </x-slot>

    <div class="content-container py-8">
        <form method="POST" action="{{ route('products.store') }}" class="panel form-panel">
            @csrf
            @include('products._form')

            <div class="form-actions">
                <a href="{{ route('products.index') }}" class="button-secondary">Cancel</a>
                <button type="submit" class="button-primary">Save product</button>
            </div>
        </form>
    </div>
</x-app-layout>
