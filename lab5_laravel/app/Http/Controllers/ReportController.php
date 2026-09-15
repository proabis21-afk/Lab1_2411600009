<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function productsCsv(): StreamedResponse
    {
        return response()->streamDownload(function (): void {
            $file = fopen('php://output', 'w');

            fputcsv($file, ['SKU', 'Product', 'Category', 'Quantity', 'Reorder level', 'Unit price', 'Supplier', 'Stock status']);

            Product::query()->orderBy('name')->each(function (Product $product) use ($file): void {
                $status = $product->isOutOfStock()
                    ? 'Out of stock'
                    : ($product->isLowStock() ? 'Low stock' : 'In stock');

                fputcsv($file, [
                    $product->sku,
                    $product->name,
                    $product->category,
                    $product->quantity,
                    $product->reorder_level,
                    $product->unit_price,
                    $product->supplier,
                    $status,
                ]);
            });

            fclose($file);
        }, 'inventory-report-'.now()->format('Y-m-d').'.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
