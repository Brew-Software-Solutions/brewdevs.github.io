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
            const direction = n > currentSlide ? 'right' : 'left';
            
            // Remove active class and add appropriate animation
            currentElement.style.animation = `slideOut${direction === 'right' ? 'Left' : 'Right'} 0.5s ease-out`;
            currentElement.classList.remove('active');
            
            // Update dots
            dots[currentSlide].classList.remove('active');
            
            // Update current slide
            currentSlide = n;
            
            // Add active class to new slide with animation
            nextElement.style.animation = 'slideIn 0.5s ease-out';
            nextElement.classList.add('active');
            
            // Update dots
            dots[currentSlide].classList.add('active');
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
            // Touch events
            slide.addEventListener('touchstart', e => {
                touchStartX = e.touches[0].clientX;
                isPaused = true;
                stopAutoSlide();
            });

            slide.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].clientX;
                handleSwipe();
                isPaused = false;
                startAutoSlide();
            });

            // Mouse events
            slide.addEventListener('mousedown', e => {
                isDragging = true;
                startPos = e.clientX;
                slide.style.cursor = 'grabbing';
                isPaused = true;
                stopAutoSlide();
            });

            slide.addEventListener('mousemove', e => {
                if (!isDragging) return;
                const currentPos = e.clientX;
                const diff = currentPos - startPos;
                
                if (Math.abs(diff) > 50) {
                    isDragging = false;
                    slide.style.cursor = 'grab';
                    if (diff > 0) {
                        prevSlide();
                    } else {
                        nextSlide();
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
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });