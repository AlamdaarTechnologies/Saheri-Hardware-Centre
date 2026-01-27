document.addEventListener('DOMContentLoaded', () => {
    // Preloader Logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 1000); // Minimum 1 second display for effect
        });
    }

    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Hamburger animation
            const bars = mobileToggle.querySelectorAll('.bar');
            if (navLinks.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // Close mobile menu on click

            // Reset hamburger if needed
            const bars = document.querySelectorAll('.mobile-toggle .bar');
            if (bars.length > 0) {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Reveal on Scroll Animation
    const sections = document.querySelectorAll('section');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        revealObserver.observe(section);
    });

    // --- Interactive Features ---

    // 1. Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower && window.matchMedia("(min-width: 769px)").matches) {
        let mouseX = 0, mouseY = 0;
        let posX = 0, posY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Immediate update for small cursor
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follower
        setInterval(() => {
            posX += (mouseX - posX) / 9;
            posY += (mouseY - posY) / 9;
            follower.style.left = posX + 'px';
            follower.style.top = posY + 'px';
        }, 10);

        // Hover Effect
        const hoverItems = document.querySelectorAll('a, button, .category-card, .gallery-item');
        hoverItems.forEach(item => {
            item.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            item.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // 2. Typewriter Effect
    class TypeWriter {
        constructor(txtElement, words, wait = 3000) {
            this.txtElement = txtElement;
            this.words = words;
            this.txt = '';
            this.wordIndex = 0;
            this.wait = parseInt(wait, 10);
            this.type();
            this.isDeleting = false;
        }

        type() {
            const current = this.wordIndex % this.words.length;
            const fullTxt = this.words[current];

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

            let typeSpeed = 200;

            if (this.isDeleting) {
                typeSpeed /= 2;
            }

            if (!this.isDeleting && this.txt === fullTxt) {
                typeSpeed = this.wait;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.wordIndex++;
                typeSpeed = 500;
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    }

    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }

    // 3. 3D Tilt Effect
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const centerX = rect.left + width / 2;
            const centerY = rect.top + height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            // Max tilt degrees
            const rotateX = (mouseY / (height / 2)) * -10;
            const rotateY = (mouseX / (width / 2)) * 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // 4. Count Up Stats
    const stats = document.querySelectorAll('.stat-number');

    if (stats.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const speed = 200; // Lower is slower

                    const updateCount = () => {
                        const count = +counter.innerText;
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 10);
                        } else {
                            counter.innerText = target;
                        }
                    };

                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => statsObserver.observe(stat));
    }
    // 5. Spotlight Glow Cards
    const cards = document.querySelectorAll('.category-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 6. Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Strength of the pull
            const strength = 15;
            const xMove = (x / rect.width) * (strength * 2);
            const yMove = (y / rect.height) * (strength * 2);

            btn.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
    // 7. Parallax Scrolling
    const parallaxElements = [
        { el: document.querySelector('.hero-image-container'), speed: 0.1 },
        { el: document.querySelector('.about-image'), speed: 0.05 }
    ];

    if (window.matchMedia("(min-width: 769px)").matches) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            parallaxElements.forEach(item => {
                if (item.el) {
                    // Calculate offset based on scroll position and speed
                    const offset = scrollY * item.speed;
                    item.el.style.transform = `translateY(${offset}px)`;
                }
            });
        });
    }
    // 9. Horizontal Gallery Scroll (Desktop) & Vertical 3D Stack (Mobile)
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const gallerySticky = document.querySelector('.gallery-sticky');
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryWrapper && gallerySticky && galleryTrack) {
        window.addEventListener('scroll', () => {
            const wrapperRect = galleryWrapper.getBoundingClientRect();
            const wrapperTop = wrapperRect.top;
            const scrollDist = -wrapperTop;
            const maxScroll = galleryWrapper.offsetHeight - window.innerHeight;

            // Safety check
            if (scrollDist < 0) return;

            const isMobile = window.matchMedia("(max-width: 768px)").matches;

            if (!isMobile) {
                // DESKTOP: Horizontal Scroll
                if (scrollDist < maxScroll) {
                    const progress = scrollDist / maxScroll;
                    // Move track left based on progress. Max move is track width - viewport width
                    // Added extra buffer (400) to ensure last card clears nicely
                    const maxTrackMove = galleryTrack.scrollWidth - window.innerWidth + 400;
                    const moveAmount = progress * maxTrackMove;

                    galleryTrack.style.transform = `translateX(-${moveAmount}px)`;

                    // Reset mobile styles if previously applied
                    galleryItems.forEach(item => {
                        item.style.transform = '';
                        item.style.opacity = '1';
                    });
                }
            }
        });
    }
});
