<nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar vh-100 p-3">
    <ul class="nav flex-column">
        <li class="nav-item">
            <a class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">
                <i class="bi bi-speedometer2"></i> Dashboard
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link {{ request()->routeIs('products.*') ? 'active' : '' }}" href="{{ route('products.index') }}">
                <i class="bi bi-box-seam"></i> Products
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="{{ route('reports.products.csv') }}">
                <i class="bi bi-file-earmark-arrow-down"></i> Download Report
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link {{ request()->routeIs('profile.*') ? 'active' : '' }}" href="{{ route('profile.edit') }}">
                <i class="bi bi-person"></i> Profile
            </a>
        </li>
        <li class="nav-item mt-2">
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="nav-link nav-logout text-danger">
                    <i class="bi bi-box-arrow-right"></i> Logout
                </button>
            </form>
        </li>
    </ul>
</nav>
