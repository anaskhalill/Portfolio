// Narendra Portfolio JavaScript Logic

document.addEventListener('DOMContentLoaded', () => {
    
    // Elements
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuCheckbox = document.getElementById('checkbox');
    const navLinksContainer = document.getElementById('nav-links');
    const backToTopBtn = document.getElementById('back-to-top');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // Sticky Navbar & Back-to-Top visibility on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active Section Link Highlight
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Mobile Menu Toggle (checkbox hamburger)
    if (menuCheckbox) {
        menuCheckbox.addEventListener('change', () => {
            navLinksContainer.classList.toggle('active', menuCheckbox.checked);
        });

        // Close the menu (and uncheck the box) when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                menuCheckbox.checked = false;
            });
        });
    }

    // Loading Screen — shows on every page load, then fades out
    const siteLoader = document.getElementById('site-loader');
    if (siteLoader) {
        document.body.classList.add('loading');

        const hideLoader = () => {
            document.body.classList.remove('loading');
            siteLoader.classList.add('hidden');
            setTimeout(() => siteLoader.remove(), 800);
        };

        // Let the rocket show for a moment, then reveal the site.
        // (Timed instead of waiting for the `load` event so the
        //  loader never lingers behind autoplay videos / embeds.)
        setTimeout(hideLoader, 1800);
    }

    // Light / Dark mode toggle (GLOW STONE lamp)
    const themeCheckbox = document.getElementById('theme-checkbox');
    if (themeCheckbox) {
        const applyTheme = (isLight) => {
            document.documentElement.classList.toggle('light-mode', isLight);
            themeCheckbox.checked = isLight;
            try {
                localStorage.setItem('anas-theme', isLight ? 'light' : 'dark');
            } catch (e) { /* storage unavailable */ }
        };

        themeCheckbox.addEventListener('change', () => applyTheme(themeCheckbox.checked));

        let savedTheme = null;
        try {
            savedTheme = localStorage.getItem('anas-theme');
        } catch (e) { /* storage unavailable */ }
        if (savedTheme === 'light') applyTheme(true);
    }

    // Donation amount buttons
    const donationBtns = document.querySelectorAll('.donation-btn');
    donationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            donationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Scroll to Top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Project Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: "43TsqjoiCvqkTClw8" });
    }

    // Contact Form Submission (EmailJS Integration)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const submitBtn = contactForm.querySelector('.submit-btn');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            // Basic email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !subject || !message) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill out all fields before submitting.';
                return;
            }

            if (!emailRegex.test(email)) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please enter a valid email address.';
                return;
            }

            const originalBtnText = submitBtn.innerHTML;

            // Loading state animation
            submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            submitBtn.disabled = true;
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message
            };

            emailjs.send('service_hrw5veq', 'template_935e2od', templateParams)
                .then(() => {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Message sent successfully! Anas will get back to you soon.';
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('EmailJS Error:', error);
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'Failed to send message. Please try again or reach out directly.';
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;

                    setTimeout(() => {
                        formStatus.textContent = '';
                        formStatus.className = 'form-status';
                    }, 6000);
                });
        });
    }

    // Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateStats = () => {
        if (animated) return;
        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;

        const rect = heroStats.getBoundingClientRect();
        if (rect.top <= window.innerHeight) {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const suffix = stat.textContent.replace(/[0-9]/g, '');
                let count = 0;
                const speed = target / 30;

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        stat.textContent = Math.ceil(count) + suffix;
                        setTimeout(updateCount, 30);
                    } else {
                        stat.textContent = target + suffix;
                    }
                };
                updateCount();
            });
            animated = true;
        }
    };

    window.addEventListener('scroll', animateStats);
    animateStats(); // Initial check

    // Page Visibility API - Pause video marquee when tab is not visible
    document.addEventListener('visibilitychange', () => {
        const marqueeTrack = document.querySelector('.video-marquee-track');
        if (!marqueeTrack) return;
        if (document.hidden) {
            marqueeTrack.classList.add('is-paused');
        } else {
            marqueeTrack.classList.remove('is-paused');
        }
    });

    // Carousel Arrow Navigation Controls (reviews + services)
    const wireCarousel = (trackId, prevId, nextId, cardSelector) => {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);

        if (!track || !prevBtn || !nextBtn) return;

        const step = () =>
            (track.querySelector(cardSelector)?.offsetWidth || 340) + 24;

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -step(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: step(), behavior: 'smooth' });
        });
    };

    wireCarousel('reviews-track', 'reviews-prev', 'reviews-next', '.review-card');
    wireCarousel('services-track', 'services-prev', 'services-next', '.stack-card');


    // =====================================================
    // 3D MOTION LAYER
    // Scroll progress, 3D reveals, tilt + glare, hero
    // parallax, magnetic buttons. Disabled for touch
    // devices and prefers-reduced-motion.
    // =====================================================

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // --- Scroll progress bar ---
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar && !reduceMotion) {
        const updateProgress = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // --- 3D scroll reveal ---
    const revealEls = document.querySelectorAll(
        '.section-header, .hero-content, .tilted-card-figure, .about-text-col, ' +
        '.long-video-card, .experience-item, .certificate-card, .review-card, .donation-card, ' +
        '.contact-info, .contact-form, .services-left-col, .services-right-col'
    );
    if (!reduceMotion && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    // after the reveal finishes, free the element so tilt can own its transform
                    setTimeout(() => entry.target.classList.remove('reveal'), 1100);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    }

    // --- 3D tilt cards with glare ---
    const tiltCards = document.querySelectorAll(
        '.long-video-card, .experience-item, .certificate-card, .review-card, .donation-card'
    );
    if (!reduceMotion && finePointer) {
        tiltCards.forEach(card => {
            card.classList.add('tilt-3d');

            // lift the card's direct children up in 3D
            Array.from(card.children)
                .filter(child => !child.classList.contains('glare'))
                .forEach(child => child.classList.add('tilt-pop'));

            // light glare that follows the cursor
            const glare = document.createElement('span');
            glare.className = 'glare';
            card.insertAdjacentElement('afterbegin', glare);

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width;
                const py = (e.clientY - rect.top) / rect.height;
                const rx = (0.5 - py) * 10;
                const ry = (px - 0.5) * 12;
                card.style.transform =
                    'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale(1.02)';
                glare.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
                glare.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // --- Hero parallax layers ---
    const hero = document.querySelector('.hero-section');
    const parallaxLayers = [
        { el: document.querySelector('.hero-bg-name-wrapper'), depth: 34 },
        { el: document.querySelector('.hero-bg-image'), depth: 22 },
        { el: document.querySelector('.hero-headline-row'), depth: -16 },
        { el: document.querySelector('.hero-badge'), depth: -8 }
    ].filter(layer => layer.el);

    if (!reduceMotion && finePointer && hero) {
        parallaxLayers.forEach(layer => layer.el.classList.add('hero-parallax'));

        let parallaxRaf = null;

        hero.addEventListener('mousemove', (e) => {
            if (parallaxRaf) return;
            parallaxRaf = requestAnimationFrame(() => {
                parallaxRaf = null;
                const rect = hero.getBoundingClientRect();
                const nx = (e.clientX - rect.left) / rect.width - 0.5;
                const ny = (e.clientY - rect.top) / rect.height - 0.5;

                parallaxLayers.forEach(layer => {
                    const tx = (-nx * layer.depth).toFixed(2);
                    const ty = (-ny * layer.depth * 0.7).toFixed(2);

                    if (layer.el.classList.contains('hero-bg-name-wrapper')) {
                        // keep the vertical centering, then offset
                        layer.el.style.transform = 'translateY(-50%) translate3d(' + tx + 'px, ' + ty + 'px, 0)';
                    } else if (layer.el.classList.contains('hero-bg-image')) {
                        // scale slightly so the photo never shows edges while drifting
                        layer.el.style.transform = 'scale(1.07) translate3d(' + (tx * 0.4).toFixed(2) + 'px, ' + (ty * 0.4).toFixed(2) + 'px, 0)';
                    } else {
                        layer.el.style.transform = 'translate3d(' + (tx * 0.5).toFixed(2) + 'px, ' + (ty * 0.5).toFixed(2) + 'px, 0)';
                    }
                });
            });
        });

        hero.addEventListener('mouseleave', () => {
            parallaxLayers.forEach(layer => {
                layer.el.style.transform = '';
            });
        });
    }

    // --- Magnetic buttons ---
    const magneticBtns = document.querySelectorAll('.hero-actions .btn, .donate-cta');
    if (!reduceMotion && finePointer) {
        magneticBtns.forEach(btn => {
            btn.classList.add('magnetic');

            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const dx = e.clientX - rect.left - rect.width / 2;
                const dy = e.clientY - rect.top - rect.height / 2;
                const clamp = (v) => Math.max(-8, Math.min(8, v));
                btn.style.transform =
                    'translate3d(' + clamp(dx * 0.25).toFixed(2) + 'px, ' + clamp(dy * 0.25).toFixed(2) + 'px, 0)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
});
