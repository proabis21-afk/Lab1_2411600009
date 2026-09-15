<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>Light Way Inventory</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="{{ asset('css/style.css') }}">
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.3/dist/cdn.min.js"></script>
    </head>
    <body>
        <div class="login-page d-flex align-items-center justify-content-center p-3">
            <div class="login-card card">
                <div class="card-header text-center py-4 text-white">
                    <div class="login-logo mx-auto mb-2">LW</div>
                    <h1 class="h4 mb-1">Light Way</h1>
                    <p class="mb-0 small">Fitness Inventory Management</p>
                </div>
                <div class="card-body p-4">
                    {{ $slot }}
                </div>
            </div>
        </div>
    </body>
</html>
