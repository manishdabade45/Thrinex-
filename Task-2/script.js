document.addEventListener('DOMContentLoaded', () => {
    // --- Dark/Light Theme Switcher ---
    const themeToggle = document.getElementById('theme-toggle');
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (theme === 'light') {
                    icon.className = 'fa-solid fa-sun';
                } else {
                    icon.className = 'fa-solid fa-moon';
                }
            }
        }
    };

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark ? 'dark' : 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    // --- Mobile Menu Navigation Toggle (Keyboard Accessible) ---
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('#nav-list');
    
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('open');
            
            const icon = navToggle.querySelector('i');
            if (icon) {
                if (isExpanded) {
                    icon.className = 'fa-solid fa-bars';
                } else {
                    icon.className = 'fa-solid fa-xmark';
                }
            }
        });

        // Close menu on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('open')) {
                navList.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // --- Accessible Reveal Animation on Scroll ---
    // Respect user preferences for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Animates once
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.reveal');
        animatedElements.forEach((el) => {
            el.classList.add('reveal-prep');
            observer.observe(el);
        });
    }

    // --- Contact Form Accessibility Validation Logic ---
    const contactForm = document.getElementById('portfolio-contact-form');
    if (contactForm) {
        const errorSummary = document.getElementById('error-summary');
        const successAlert = document.getElementById('success-alert');
        const fields = ['user-name', 'user-email', 'user-message'];

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent standard submission
            
            // Clear prior states
            errorSummary.classList.remove('visible');
            successAlert.classList.remove('visible');
            
            const list = errorSummary.querySelector('ul');
            if (list) list.innerHTML = '';
            
            let errors = [];

            fields.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                const errorSpan = document.getElementById(`${fieldId}-error`);
                
                if (input && errorSpan) {
                    input.classList.remove('error');
                    input.setAttribute('aria-invalid', 'false');
                    errorSpan.classList.remove('visible');

                    // Simple check: is empty
                    if (!input.value.trim()) {
                        errors.push({
                            id: fieldId,
                            message: `${getFieldName(fieldId)} is required.`
                        });
                        input.classList.add('error');
                        input.setAttribute('aria-invalid', 'true');
                        errorSpan.textContent = `${getFieldName(fieldId)} is required.`;
                        errorSpan.classList.add('visible');
                    } else if (fieldId === 'user-email' && !validateEmail(input.value)) {
                        errors.push({
                            id: fieldId,
                            message: 'Please enter a valid email address.'
                        });
                        input.classList.add('error');
                        input.setAttribute('aria-invalid', 'true');
                        errorSpan.textContent = 'Please enter a valid email address.';
                        errorSpan.classList.add('visible');
                    }
                }
            });

            if (errors.length > 0) {
                // Render error summary
                if (list) {
                    errors.forEach(err => {
                        const li = document.createElement('li');
                        const link = document.createElement('a');
                        link.href = `#${err.id}`;
                        link.textContent = err.message;
                        
                        // Clicking the summary links shifts focus to the incorrect field
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            const target = document.getElementById(err.id);
                            if (target) target.focus();
                        });

                        li.appendChild(link);
                        list.appendChild(li);
                    });
                }

                // Show error summary and shift focus to it
                errorSummary.classList.add('visible');
                errorSummary.setAttribute('tabindex', '-1');
                errorSummary.focus();
            } else {
                // Success path
                successAlert.classList.add('visible');
                successAlert.setAttribute('tabindex', '-1');
                successAlert.focus();
                
                // Reset form fields
                contactForm.reset();
            }
        });

        // Helper to format field name for errors
        function getFieldName(id) {
            if (id === 'user-name') return 'Name';
            if (id === 'user-email') return 'Email Address';
            if (id === 'user-message') return 'Message';
            return 'Field';
        }

        // Email validation regex
        function validateEmail(email) {
            const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return re.test(String(email).toLowerCase());
        }
    }
});
