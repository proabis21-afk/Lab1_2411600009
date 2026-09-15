<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
        <a class="navbar-brand fw-bold d-flex align-items-center" href="{{ route('dashboard') }}">
            <span class="navbar-logo me-2">LW</span>
            Light Way
        </a>

        <div class="ms-auto d-flex align-items-center">
            <span class="navbar-text text-white me-3 d-none d-sm-inline">
                Welcome, {{ Auth::user()->name }}
            </span>

            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="btn btn-outline-light btn-sm">Logout</button>
            </form>
        </div>
    </div>
</nav>
