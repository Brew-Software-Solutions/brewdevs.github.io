let currentSlide = 0;
        const slides = document.querySelectorAll('.project-preview');
        const dots = document.querySelectorAll('.dot');
        let touchStartX = 0;
        let touchEndX = 0;
        let autoSlideInterval;
        let isPaused = false;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;

        function showSlide(n) {
            const currentElement = slides[currentSlide];
            const nextElement = slides[n];
            
            // Determine direction for animation
            const direction = n > currentSlide ? 1 : -1;
            
            // Set initial positions
            currentElement.style.transition = 'none';
            nextElement.style.transition = 'none';
            currentElement.style.transform = 'translateX(0)';
            nextElement.style.transform = `translateX(${direction * 100}%)`;
            
            // Force reflow to ensure transitions work
            void currentElement.offsetWidth;
            
            // Enable transitions and move slides
            currentElement.style.transition = 'transform 0.5s ease-out';
            nextElement.style.transition = 'transform 0.5s ease-out';
            currentElement.style.transform = `translateX(${-direction * 100}%)`;
            nextElement.style.transform = 'translateX(0)';
            
            // Update active states
            currentElement.classList.remove('active');
            nextElement.classList.add('active');
            
            // Update dots
            dots[currentSlide].classList.remove('active');
            dots[n].classList.add('active');
            
            // Update current slide index
            currentSlide = n;
            
            // Clean up transitions after animation
            setTimeout(() => {
                currentElement.style.transition = '';
                nextElement.style.transition = '';
            }, 500);
        }

        function nextSlide() {
            let n = currentSlide + 1;
            if (n >= slides.length) n = 0;
            showSlide(n);
        }

        function prevSlide() {
            let n = currentSlide - 1;
            if (n < 0) n = slides.length - 1;
            showSlide(n);
        }

        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        }

        function startAutoSlide() {
            if (!isPaused) {
                autoSlideInterval = setInterval(nextSlide, 5000);
            }
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Show/hide go up button based on scroll position
        window.addEventListener('scroll', () => {
            const goUpBtn = document.querySelector('.go-up-btn');
            const scrollTop = window.scrollY;

            if (scrollTop > 100) {
                goUpBtn.classList.add('visible');
            } else {
                goUpBtn.classList.remove('visible');
            }
        });

        slides.forEach(slide => {

            // Mouse events
            slide.addEventListener('mousedown', e => {
                isDragging = true;
                startPos = e.clientX;
                slide.style.cursor = 'grabbing';
            });

            slide.addEventListener('mousemove', e => {
                if (!isDragging) return;
                const currentPos = e.clientX;
                const diff = currentPos - startPos;
                
                if (Math.abs(diff) > 50) {
                    isDragging = false;
                    slide.style.cursor = 'grab';
                    if (diff > 0) {
                        rotate(1);
                    } else {
                        rotate(-1);
                    }
                }
            });

            slide.addEventListener('mouseup', () => {
                isDragging = false;
                slide.style.cursor = 'grab';
                isPaused = false;
                //startAutoSlide();
            });

            slide.addEventListener('mouseleave', () => {
                isDragging = false;
                slide.style.cursor = 'grab';
                isPaused = false;
                //startAutoSlide();
            });
        });

        // Initial start of auto slide
        //startAutoSlide();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                rotate(-1);
            } else if (e.key === 'ArrowRight') {
                rotate(1);
            }
        });

        let currentRotation = 0;
        const carousel = document.querySelector('.project-carousel');

        function rotate(direction) {
            currentRotation += direction * 120; // Changed from 60 to 120 degrees for 3 items (360/3 = 120)
            carousel.style.transform = `rotateY(${currentRotation}deg)`;
        }