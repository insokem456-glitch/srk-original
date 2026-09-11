document.addEventListener('DOMContentLoaded', () => {
    const splash = document.querySelector('.splash-intro');
    
    // Splash Screen Logic
    setTimeout(() => {
        splash.classList.add('fade-out');
        splash.addEventListener('transitionend', () => {
            splash.hidden = true;
        }, { once: true });
    }, 450);

    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Sticky Navbar
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
            scrollTicking = false;
        });
    }, { passive: true });

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const galleryFilters = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const selectedCategory = filter.dataset.filter;

            galleryFilters.forEach(item => item.classList.remove('active'));
            filter.classList.add('active');

            galleryItems.forEach(item => {
                const matches = selectedCategory === 'all' || item.dataset.category === selectedCategory;
                item.classList.toggle('is-hidden', !matches);
            });
        });
    });
});
