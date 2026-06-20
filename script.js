document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE MENU ACCORDION / TOGGLE
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       STICKY HEADER & BACK-TO-TOP TRIGGER
       ========================================================================== */
    const mainHeader = document.getElementById('main-header');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    let lastKnownScrollPosition = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Sticky Navbar Toggle
                if (lastKnownScrollPosition > 100) {
                    mainHeader.classList.add('sticky');
                } else {
                    mainHeader.classList.remove('sticky');
                }

                // Back to Top Button Toggle
                if (lastKnownScrollPosition > 500) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Scroll to Top Smooth click event
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       SCROLLSPY: ACTIVE NAVIGATION STATE ON SCROLL
       ========================================================================== */
    const sections = document.querySelectorAll('section');

    const scrollSpyOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.35 // Triggers active link when 35% of section is visible
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });

    /* ==========================================================================
       STATS COUNTER INCREMENT ANIMATION
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.getElementById('stats');

    let animationTriggered = false;

    const runCounterAnimation = () => {
        statNumbers.forEach(stat => {
            const targetValue = parseInt(stat.getAttribute('data-target'), 10);
            const increment = targetValue / 50; // Divide to reach final number in ~50 steps
            let currentValue = 0;

            const updateCounter = () => {
                currentValue += increment;
                if (currentValue < targetValue) {
                    stat.innerText = Math.ceil(currentValue);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = targetValue;
                }
            };

            updateCounter();
        });
    };

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animationTriggered) {
                    runCounterAnimation();
                    animationTriggered = true; // Ensures the animation runs only once
                }
            });
        }, { threshold: 0.4 });

        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       INTERACTIVE FORM VALIDATION & ENQUIRY SUBMISSION
       ========================================================================== */
    const enquiryForm = document.getElementById('enquiry-form');
    const successOverlay = document.getElementById('success-overlay');
    const btnCloseSuccess = document.getElementById('btn-close-success');
    const submitBtn = document.getElementById('form-submit-btn');
    const btnText = document.getElementById('btn-text');

    // Form Field Selectors
    const fields = {
        name: {
            input: document.getElementById('form-name'),
            error: document.getElementById('name-error'),
            validate: (val) => val.trim().length >= 3
        },
        email: {
            input: document.getElementById('form-email'),
            error: document.getElementById('email-error'),
            validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
        },
        phone: {
            input: document.getElementById('form-phone'),
            error: document.getElementById('phone-error'),
            validate: (val) => /^[+]?[0-9\s-]{10,15}$/.test(val.trim().replace(/ /g, ''))
        },
        interest: {
            input: document.getElementById('form-interest'),
            error: document.getElementById('interest-error'),
            validate: (val) => val !== ""
        },
        message: {
            input: document.getElementById('form-message'),
            error: document.getElementById('message-error'),
            validate: (val) => val.trim().length >= 10
        }
    };

    // Real-time Field Blur Validation
    Object.keys(fields).forEach(key => {
        const field = fields[key];
        
        if (field.input) {
            field.input.addEventListener('blur', () => {
                validateField(field);
            });

            field.input.addEventListener('input', () => {
                if (field.input.classList.contains('invalid')) {
                    validateField(field);
                }
            });
        }
    });

    function validateField(field) {
        if (!field.input) return true;
        const isValid = field.validate(field.input.value);
        if (isValid) {
            field.input.classList.remove('invalid');
            field.input.classList.add('valid');
            field.error.classList.remove('active');
        } else {
            field.input.classList.remove('valid');
            field.input.classList.add('invalid');
            field.error.classList.add('active');
        }
        return isValid;
    }

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let formIsValid = true;

            // Run validation on all fields on submit
            Object.keys(fields).forEach(key => {
                const field = fields[key];
                const isValid = validateField(field);
                if (!isValid) {
                    formIsValid = false;
                }
            });

            if (formIsValid) {
                // Change Button to Loading State
                submitBtn.disabled = true;
                btnText.innerText = "Submitting...";
                const icon = submitBtn.querySelector('.btn-icon');
                if (icon) {
                    icon.className = "fa-solid fa-spinner fa-spin btn-icon";
                }

                // Gather Form Data
                const submissionData = {
                    name: fields.name.input.value.trim(),
                    company: document.getElementById('form-company').value.trim(),
                    email: fields.email.input.value.trim(),
                    phone: fields.phone.input.value.trim(),
                    interest: fields.interest.input.value,
                    message: fields.message.input.value.trim(),
                    timestamp: new Date().toISOString()
                };

                // Mock API Delay
                setTimeout(() => {
                    // Save to localStorage for demonstration purposes
                    let currentEnquiries = JSON.parse(localStorage.getItem('qbit_enquiries') || '[]');
                    currentEnquiries.push(submissionData);
                    localStorage.setItem('qbit_enquiries', JSON.stringify(currentEnquiries));

                    // Show Success Popup Overlay
                    successOverlay.classList.add('active');

                    // Reset Form State
                    enquiryForm.reset();
                    Object.keys(fields).forEach(key => {
                        fields[key].input.classList.remove('valid', 'invalid');
                    });

                    // Restore Button
                    submitBtn.disabled = false;
                    btnText.innerText = "Send Enquiry";
                    if (icon) {
                        icon.className = "fa-solid fa-paper-plane btn-icon";
                    }
                }, 1500);
            }
        });
    }

    // Modal Close triggers
    if (btnCloseSuccess && successOverlay) {
        btnCloseSuccess.addEventListener('click', () => {
            successOverlay.classList.remove('active');
        });
    }

    /* ==========================================================================
       PRODUCTS CATALOG PAGE: FILTERING LOGIC
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const catalogCards = document.querySelectorAll('.catalog-card');

    if (filterButtons.length > 0 && catalogCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active to current button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                catalogCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    /* ==========================================================================
       PRODUCT REDIRECT & ENQUIRY PRE-FILL LOGIC
       ========================================================================== */
    const urlParams = new URLSearchParams(window.location.search);
    const productQuery = urlParams.get('product');

    if (productQuery && fields.interest && fields.interest.input && fields.message && fields.message.input) {
        // Map slug query to friendly display name
        const productMapping = {
            'china-clay': 'China Clay',
            'crude-china-clay': 'Crude China Clay',
            'levigated-china-clay': 'Levigated China Clay',
            'calcined-kaolin-powder': 'Calcined Kaolin Powder',
            'silica-sand': 'Silica Sand',
            'silica-quartz-powder': 'Silica Quartz Powder',
            'refractory-clay': 'Refractory Clay',
            'kaolin-clay': 'Kaolin Clay'
        };

        const friendlyName = productMapping[productQuery];
        if (friendlyName) {
            // Set division select dropdown to 'minerals'
            fields.interest.input.value = 'minerals';
            fields.interest.input.classList.add('valid');

            // Fill enquiry message
            fields.message.input.value = `Hi, I am interested in inquiring about the pricing, packaging options, and technical specifications of ${friendlyName}. Please send us the detailed product brochure and quotation. Thanks!`;
            fields.message.input.classList.add('valid');
            
            // Scroll to the contact form section smoothly
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                setTimeout(() => {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        }
    }

    /* ==========================================================================
       VIDEO GALLERY SLIDESHOW LOGIC
       ========================================================================== */
    const slideshowContainer = document.getElementById('video-slideshow');
    if (slideshowContainer) {
        const slides = slideshowContainer.querySelectorAll('.video-slide');
        const dots = slideshowContainer.querySelectorAll('.dot');
        const prevBtn = document.getElementById('prev-slide-btn');
        const nextBtn = document.getElementById('next-slide-btn');
        const muteToggleBtn = document.getElementById('mute-toggle-btn');
        
        let currentSlideIndex = 0;
        let slideTimer = null;
        let isMuted = true; // Default muted due to browser autoplay policies

        // Function to play current video and pause/reset others
        const updateVideoPlayback = () => {
            slides.forEach((slide, index) => {
                const video = slide.querySelector('video');
                if (!video) return;

                if (index === currentSlideIndex) {
                    video.muted = isMuted;
                    // Play the active video
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log("Autoplay was prevented or video paused", error);
                        });
                    }
                } else {
                    // Pause and reset other videos
                    video.pause();
                    video.currentTime = 0;
                }
            });
        };

        // Go to specific slide index
        const showSlide = (index) => {
            // Remove active classes
            slides[currentSlideIndex].classList.remove('active');
            dots[currentSlideIndex].classList.remove('active');

            // Set new index with wrapping bounds
            currentSlideIndex = (index + slides.length) % slides.length;

            // Add active classes
            slides[currentSlideIndex].classList.add('active');
            dots[currentSlideIndex].classList.add('active');

            // Handle video playback
            updateVideoPlayback();

            // Reset auto-advance timer
            resetTimer();
        };

        // Next slide
        const nextSlide = () => {
            showSlide(currentSlideIndex + 1);
        };

        // Prev slide
        const prevSlide = () => {
            showSlide(currentSlideIndex - 1);
        };

        // Timer control functions
        const resetTimer = () => {
            if (slideTimer) clearInterval(slideTimer);
            slideTimer = setInterval(nextSlide, 5000); // 5 seconds interval
        };

        // Add event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
            });
        }

        // Dots controls
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });

        // Mute / Unmute Control
        if (muteToggleBtn) {
            muteToggleBtn.addEventListener('click', () => {
                isMuted = !isMuted;
                
                // Update active video muted state
                const activeVideo = slides[currentSlideIndex].querySelector('video');
                if (activeVideo) {
                    activeVideo.muted = isMuted;
                }

                // Update icon
                const icon = muteToggleBtn.querySelector('i');
                if (icon) {
                    if (isMuted) {
                        icon.className = 'fa-solid fa-volume-xmark';
                        muteToggleBtn.setAttribute('aria-label', 'Unmute Video');
                    } else {
                        icon.className = 'fa-solid fa-volume-high';
                        muteToggleBtn.setAttribute('aria-label', 'Mute Video');
                    }
                }
            });
        }

        // Initialize slideshow
        updateVideoPlayback();
        resetTimer();
    }

});
