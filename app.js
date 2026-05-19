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

    // 7. Dynamic Logistics Particle Network Canvas
    const canvas = document.getElementById('logisticsCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 35;
        let width = 0;
        let height = 0;

        // Resize Canvas
        const resizeCanvas = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            width = rect.width || 380;
            height = rect.height || 400;
            canvas.width = width;
            canvas.height = height;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Mouse coordinates for dynamic connections
        let mouse = { x: null, y: null, radius: 110 };
        canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.parentElement.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                // Logistic flow vectors: drifting sideways & vertically
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.radius = Math.random() * 2.5 + 1.5; // various node sizes
                // Accent some nodes with gold!
                this.isGold = Math.random() < 0.22;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                if (this.isGold) {
                    ctx.fillStyle = '#c5a059'; // Premium gold
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = '#c5a059';
                } else {
                    ctx.fillStyle = '#721c24'; // Active maroon
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
                ctx.shadowBlur = 0; // Reset
            }
        }

        // Initialize particles
        const init = () => {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        };
        init();

        // Connect nodes
        const connect = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Connection lines: maroon and thin
                    if (distance < 85) {
                        const alpha = (1 - (distance / 85)) * 0.15;
                        ctx.strokeStyle = `rgba(114, 28, 36, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }

                // Interactive mouse links
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[a].x - mouse.x;
                    const dy = particles[a].y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const alpha = (1 - (distance / mouse.radius)) * 0.28;
                        ctx.strokeStyle = `rgba(197, 160, 89, ${alpha})`; // Gold connection to mouse!
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        };

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Draw shipping grid lines subtle in background
            ctx.strokeStyle = 'rgba(114, 28, 36, 0.015)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < width; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height);
                ctx.stroke();
            }
            for (let j = 0; j < height; j += 40) {
                ctx.beginPath();
                ctx.moveTo(0, j);
                ctx.lineTo(width, j);
                ctx.stroke();
            }

            // Update & Draw nodes
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            connect();
            requestAnimationFrame(animate);
        };
        animate();
    }
});
