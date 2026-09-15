<div class="form-grid">
    <div class="form-field form-field-wide">
        <label for="name">Product name <span aria-hidden="true">*</span></label>
        <input id="name" name="name" type="text" value="{{ old('name', $product->name) }}" maxlength="150" required autofocus>
        @error('name') <p class="field-error">{{ $message }}</p> @enderror
    </div>

    <div class="form-field">
        <label for="sku">SKU <span aria-hidden="true">*</span></label>
        <input id="sku" name="sku" type="text" value="{{ old('sku', $product->sku) }}" maxlength="50" required>
        @error('sku') <p class="field-error">{{ $message }}</p> @enderror
    </div>

    <div class="form-field">
        <label for="category">Category <span aria-hidden="true">*</span></label>
        <select id="category" name="category" required>
            <option value="">Choose a category</option>
            @foreach (['Strength Equipment', 'Weights', 'Fitness Accessories'] as $category)
                <option value="{{ $category }}" @selected(old('category', $product->category) === $category)>{{ $category }}</option>
            @endforeach
        </select>
        @error('category') <p class="field-error">{{ $message }}</p> @enderror
    </div>

    <div class="form-field">
        <label for="quantity">Current quantity <span aria-hidden="true">*</span></label>
        <input id="quantity" name="quantity" type="number" min="0" step="1" value="{{ old('quantity', $product->quantity) }}" required>
        @error('quantity') <p class="field-error">{{ $message }}</p> @enderror
    </div>

    <div class="form-field">
        <label for="reorder_level">Reorder level <span aria-hidden="true">*</span></label>
        <input id="reorder_level" name="reorder_level" type="number" min="0" step="1" value="{{ old('reorder_level', $product->reorder_level ?: 5) }}" required>
        @error('reorder_level') <p class="field-error">{{ $message }}</p> @enderror
    </div>

    <div class="form-field">
        <label for="unit_price">Unit price (₱) <span aria-hidden="true">*</span></label>
        <input id="unit_price" name="unit_price" type="number" min="0" step="0.01" value="{{ old('unit_price', $product->unit_price) }}" required>
        @error('unit_price') <p class="field-error">{{ $message }}</p> @enderror
    </div>

    <div class="form-field">
        <label for="supplier">Supplier <span aria-hidden="true">*</span></label>
        <input id="supplier" name="supplier" type="text" value="{{ old('supplier', $product->supplier) }}" maxlength="150" required>
        @error('supplier') <p class="field-error">{{ $message }}</p> @enderror
    </div>

    <div class="form-field form-field-wide">
        <label for="description">Description</label>
        <textarea id="description" name="description" rows="4" maxlength="2000" placeholder="Brief product details, dimensions, or use case">{{ old('description', $product->description) }}</textarea>
        @error('description') <p class="field-error">{{ $message }}</p> @enderror
    </div>
</div>
