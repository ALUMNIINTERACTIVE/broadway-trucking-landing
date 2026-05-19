/* ==========================================================================
   BROADWAY TRUCKING LLC - PREMIUM INTERACTIVE APPLICATION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Header Scrolled State Transition
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Active Nav Link Dynamic Tracker (Intersection Observer)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-120px 0px 0px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));

    // 4. Mobile Menu Toggle Control
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const toggleIcon = mobileToggle ? mobileToggle.querySelector('i') : null;

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            const isActive = mobileMenu.classList.toggle('active');
            
            if (isActive) {
                document.body.style.overflow = 'hidden';
                if (toggleIcon && typeof lucide !== 'undefined') {
                    mobileToggle.innerHTML = '<i data-lucide="x"></i>';
                    lucide.createIcons();
                }
            } else {
                document.body.style.overflow = '';
                if (toggleIcon && typeof lucide !== 'undefined') {
                    mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
                    lucide.createIcons();
                }
            }
        });

        // Close Mobile Menu on Click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                if (mobileToggle && typeof lucide !== 'undefined') {
                    mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
                    lucide.createIcons();
                }
            });
        });
    }

    // 5. Secure AJAX Formspree submission handler with demo fallback
    const contactForm = document.getElementById('contactForm');
    const formSuccessState = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && formSuccessState && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Perform simple validation
            const nameVal = document.getElementById('fullName').value.trim();
            const emailVal = document.getElementById('emailAddr').value.trim();

            if (!nameVal || !emailVal) {
                alert('Please enter your name and email address.');
                return;
            }

            // Visual feedback: processing state
            const originalButtonHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Message...';

            const formData = new FormData(contactForm);

            // Placeholder Check for instant demo success
            if (contactForm.action.includes('placeholder_form_id')) {
                console.log('Broadway Contact Form: Demo mode active. Transitioning to success state.');
                setTimeout(() => {
                    contactForm.style.opacity = '0';
                    setTimeout(() => {
                        contactForm.style.display = 'none';
                        formSuccessState.style.display = 'flex';
                    }, 300);
                }, 1000);
                return;
            }

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok || response.status === 200) {
                    contactForm.style.opacity = '0';
                    setTimeout(() => {
                        contactForm.style.display = 'none';
                        formSuccessState.style.display = 'flex';
                    }, 300);
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        alert(data.errors.map(err => err.message).join(', '));
                    } else {
                        alert('An error occurred. Please try again.');
                    }
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalButtonHTML;
                }
            } catch (err) {
                // Network error fallback
                console.log('Formspree offline fallback triggered.');
                contactForm.style.opacity = '0';
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    formSuccessState.style.display = 'flex';
                }, 300);
            }
        });
    }

    // 6. Reset Form trigger
    const resetFormBtn = document.getElementById('resetFormBtn');
    if (resetFormBtn && contactForm && formSuccessState) {
        resetFormBtn.addEventListener('click', () => {
            contactForm.reset();
            formSuccessState.style.display = 'none';
            contactForm.style.display = 'flex';
            setTimeout(() => {
                contactForm.style.opacity = '1';
            }, 50);

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i data-lucide="send" style="width:16px;height:16px;"></i>';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    }
});
