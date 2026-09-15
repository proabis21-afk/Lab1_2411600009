<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ $title ?? 'Light Way Inventory' }}</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
        <link rel="stylesheet" href="{{ asset('css/style.css') }}">
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.3/dist/cdn.min.js"></script>
    </head>
    <body>
        @include('layouts.navigation')

        <div class="container-fluid">
            <div class="row">
                @include('layouts.sidebar')

                <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
                    @isset($header)
                        <header class="dashboard-page-header">
                            {{ $header }}
                        </header>
                    @endisset

                    {{ $slot }}
                </main>
            </div>
        </div>
    </body>
</html>
