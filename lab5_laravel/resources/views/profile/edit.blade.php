<x-app-layout>
    <x-slot name="header">
        <h2 class="mb-0">Profile</h2>
    </x-slot>

    <div class="content-container">
        <div class="row">
            <div class="col-lg-8">
                <div class="card chart-card mb-4">
                    <div class="card-body">
                        @include('profile.partials.update-profile-information-form')
                    </div>
                </div>

                <div class="card chart-card mb-4">
                    <div class="card-body">
                        @include('profile.partials.update-password-form')
                    </div>
                </div>

                <div class="card chart-card mb-4">
                    <div class="card-body">
                        @include('profile.partials.delete-user-form')
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
