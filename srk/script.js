document.addEventListener('DOMContentLoaded', () => {
    const splash = document.querySelector('.splash-intro');
    
    // Splash Screen Image Preloader
    const imagesToLoad = [
        'ass/pro2outermain.jpeg',
        'ass/pro2enternce.jpeg',
        'ass/pro2add3.jpeg',
        'ass/pro2empty hall.jpeg',
        'ass/prodeco1plant.jpeg'
    ];

    let loadedCount = 0;
    const splashStartTime = Date.now();
    const MIN_SPLASH_MS = 2100; // Allows smooth cinematic sequence to unfold effortlessly

    const hideSplash = () => {
        if (!splash || splash.classList.contains('fade-out')) return;

        const elapsed = Date.now() - splashStartTime;
        const delay = Math.max(0, MIN_SPLASH_MS - elapsed);

        setTimeout(() => {
            splash.classList.add('fade-out');
            splash.setAttribute('aria-hidden', 'true');
            splash.addEventListener('transitionend', () => {
                splash.hidden = true;
                splash.style.display = 'none';
            }, { once: true });
        }, delay);
    };

    const imageLoaded = () => {
        loadedCount++;
        if (loadedCount === imagesToLoad.length) {
            hideSplash();
        }
    };

    imagesToLoad.forEach(src => {
        const img = new Image();
        img.onload = imageLoaded;
        img.onerror = imageLoaded;
        img.src = src;
    });

    // Fallback timeout in case images take longer or fail
    setTimeout(hideSplash, 3800);

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

    const roomSlider = document.querySelector('.room-slider-container');
    const roomTrack = document.querySelector('#roomSliderTrack');
    const roomSlides = roomTrack ? Array.from(roomTrack.querySelectorAll('.room-slide')) : [];
    const roomPrev = document.querySelector('#roomSliderPrev');
    const roomNext = document.querySelector('#roomSliderNext');
    const roomDots = document.querySelector('#roomSliderDots');
    let roomIndex = 0;
    let roomAutoSlide;
    let roomTouchStartX = 0;
    let roomTouchStartY = 0;

    if (roomSlider && roomTrack && roomSlides.length && roomPrev && roomNext && roomDots) {
        roomSlides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.className = 'room-slider-dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', `Show space ${index + 1}`);
            dot.addEventListener('click', () => {
                goToRoomSlide(index);
                resetRoomAutoSlide();
            });
            roomDots.appendChild(dot);
        });

        const roomDotButtons = Array.from(roomDots.querySelectorAll('.room-slider-dot'));

        function updateRoomSlider() {
            roomTrack.style.transform = `translateX(-${roomIndex * 100}%)`;
            roomDotButtons.forEach((dot, index) => {
                dot.classList.toggle('active', index === roomIndex);
                dot.setAttribute('aria-current', index === roomIndex ? 'true' : 'false');
            });
            roomSlides.forEach((slide, index) => {
                slide.setAttribute('aria-hidden', index === roomIndex ? 'false' : 'true');
            });
        }

        function goToRoomSlide(index) {
            roomIndex = (index + roomSlides.length) % roomSlides.length;
            updateRoomSlider();
        }

        function nextRoomSlide() {
            goToRoomSlide(roomIndex + 1);
        }

        function previousRoomSlide() {
            goToRoomSlide(roomIndex - 1);
        }

        function resetRoomAutoSlide() {
            clearInterval(roomAutoSlide);
            roomAutoSlide = setInterval(nextRoomSlide, 5000);
        }

        roomNext.addEventListener('click', () => {
            nextRoomSlide();
            resetRoomAutoSlide();
        });

        roomPrev.addEventListener('click', () => {
            previousRoomSlide();
            resetRoomAutoSlide();
        });

        roomSlider.addEventListener('mouseenter', () => clearInterval(roomAutoSlide));
        roomSlider.addEventListener('mouseleave', resetRoomAutoSlide);
        roomSlider.addEventListener('focusin', () => clearInterval(roomAutoSlide));
        roomSlider.addEventListener('focusout', event => {
            if (!roomSlider.contains(event.relatedTarget)) resetRoomAutoSlide();
        });

        roomSlider.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
                previousRoomSlide();
                resetRoomAutoSlide();
            }
            if (event.key === 'ArrowRight') {
                nextRoomSlide();
                resetRoomAutoSlide();
            }
        });

        roomSlider.addEventListener('touchstart', event => {
            roomTouchStartX = event.changedTouches[0].clientX;
            roomTouchStartY = event.changedTouches[0].clientY;
        }, { passive: true });

        roomSlider.addEventListener('touchend', event => {
            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - roomTouchStartX;
            const deltaY = touch.clientY - roomTouchStartY;

            if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
                deltaX < 0 ? nextRoomSlide() : previousRoomSlide();
                resetRoomAutoSlide();
            }
        }, { passive: true });

        updateRoomSlider();
        resetRoomAutoSlide();
    }

    const gallerySlider = document.querySelector('.gallery-slider');
    const galleryTrack = document.querySelector('#gallerySliderTrack');
    const gallerySlides = galleryTrack ? Array.from(galleryTrack.querySelectorAll('.gallery-slide')) : [];
    const galleryPrev = document.querySelector('#gallerySliderPrev');
    const galleryNext = document.querySelector('#gallerySliderNext');
    const galleryDots = document.querySelector('#gallerySliderDots');
    let galleryIndex = 0;
    let galleryAutoSlide;
    let galleryTouchStartX = 0;
    let galleryTouchStartY = 0;

    if (gallerySlider && galleryTrack && gallerySlides.length && galleryPrev && galleryNext && galleryDots) {
        gallerySlides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'gallery-slider-dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', `Show gallery image ${index + 1}`);
            dot.addEventListener('click', () => {
                goToGallerySlide(index);
                resetGalleryAutoSlide();
            });
            galleryDots.appendChild(dot);
        });

        const galleryDotButtons = Array.from(galleryDots.querySelectorAll('.gallery-slider-dot'));

        function updateGallerySlider() {
            galleryTrack.style.transform = `translateX(-${galleryIndex * 100}%)`;
            galleryDotButtons.forEach((dot, index) => {
                dot.classList.toggle('active', index === galleryIndex);
                dot.setAttribute('aria-current', index === galleryIndex ? 'true' : 'false');
            });
            gallerySlides.forEach((slide, index) => {
                slide.setAttribute('aria-hidden', index === galleryIndex ? 'false' : 'true');
            });
        }

        function goToGallerySlide(index) {
            galleryIndex = (index + gallerySlides.length) % gallerySlides.length;
            updateGallerySlider();
        }

        function nextGallerySlide() {
            goToGallerySlide(galleryIndex + 1);
        }

        function previousGallerySlide() {
            goToGallerySlide(galleryIndex - 1);
        }

        function resetGalleryAutoSlide() {
            clearInterval(galleryAutoSlide);
            galleryAutoSlide = setInterval(nextGallerySlide, 4000);
        }

        galleryNext.addEventListener('click', () => {
            nextGallerySlide();
            resetGalleryAutoSlide();
        });

        galleryPrev.addEventListener('click', () => {
            previousGallerySlide();
            resetGalleryAutoSlide();
        });

        gallerySlider.addEventListener('mouseenter', () => clearInterval(galleryAutoSlide));
        gallerySlider.addEventListener('mouseleave', resetGalleryAutoSlide);
        gallerySlider.addEventListener('focusin', () => clearInterval(galleryAutoSlide));
        gallerySlider.addEventListener('focusout', event => {
            if (!gallerySlider.contains(event.relatedTarget)) resetGalleryAutoSlide();
        });

        gallerySlider.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
                previousGallerySlide();
                resetGalleryAutoSlide();
            }
            if (event.key === 'ArrowRight') {
                nextGallerySlide();
                resetGalleryAutoSlide();
            }
        });

        gallerySlider.addEventListener('touchstart', event => {
            galleryTouchStartX = event.changedTouches[0].clientX;
            galleryTouchStartY = event.changedTouches[0].clientY;
        }, { passive: true });

        gallerySlider.addEventListener('touchend', event => {
            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - galleryTouchStartX;
            const deltaY = touch.clientY - galleryTouchStartY;

            if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
                deltaX < 0 ? nextGallerySlide() : previousGallerySlide();
                resetGalleryAutoSlide();
            }
        }, { passive: true });

        updateGallerySlider();
        resetGalleryAutoSlide();
    }
});
