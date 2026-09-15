<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        $lowStockQuery = Product::query()->whereColumn('quantity', '<=', 'reorder_level');

        $statistics = [
            'totalProducts' => Product::count(),
            'lowStockProducts' => (clone $lowStockQuery)->count(),
            'outOfStockProducts' => Product::where('quantity', 0)->count(),
            'inventoryValue' => (float) Product::query()
                ->selectRaw('COALESCE(SUM(quantity * unit_price), 0) as total')
                ->value('total'),
        ];

        return view('dashboard', [
            'statistics' => $statistics,
            'recentProducts' => Product::latest()->take(5)->get(),
            'lowStockItems' => $lowStockQuery->orderBy('quantity')->take(5)->get(),
        ]);
    }
}
