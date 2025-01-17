<!-- Aquí va tu contenido específico -->
<nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
    <div class="container">
        <a class="navbar-brand" href="{{ route('welcome') }}"><img src="{{ asset('View/assets/img/logo.png') }}" alt="..." style="height: 70px; transition: transform 0.3s ease-in-out;"
                                                      onmouseover="this.style.transform='scale(1.2)'"
                                                      onmouseout="this.style.transform='scale(1)'"/></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            Menu
            <i class="fas fa-bars ms-1"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
                <li class="nav-item">
                    <a class="nav-link {{ request()->is('cards') ? 'active' : '' }}" href="{{ route('cards.index') }}">
                        Cards
                    </a>
                </li>
                <li class="nav-item"><a class="nav-link" href="#portfolio">Portfolio</a></li>
                <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                <li class="nav-item"><a class="nav-link" href="#team">Team</a></li>
                <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
            </ul>
        </div>
    </div>
</nav>
