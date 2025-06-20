
// Main JavaScript functionality
class WebsiteManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAnimations();
        this.setupFloatingElements();
        this.setupModal();
        this.setupForm();
        
        // Apply theme on load
        applyTheme(CONFIG.activeTheme);
    }

    setupEventListeners() {
        // Mobile navigation
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('show');
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navLinks && navLinks.classList.contains('show')) {
                        navLinks.classList.remove('show');
                    }
                }
            });
        });

        // Header background on scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(25, 25, 25, 0.95)';
            } else {
                header.style.background = 'rgba(25, 25, 25, 0.8)';
            }
        });
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: `0px 0px -${CONFIG.animations.scrollOffset}px 0px`
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.service-card, .reason-card, .about-content, .brand-logo'
        );

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.6s ease-out';
            observer.observe(element);
        });
    }

    setupFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            // Add random delay to each floating element
            const delay = index * 3;
            element.style.animationDelay = `${delay}s`;
            
            // Set random animation duration for more natural movement
            const duration = CONFIG.animations.floatingSpeed + (Math.random() * 10);
            element.style.animationDuration = `${duration}s`;
        });
    }

    setupModal() {
        const modal = document.getElementById('modal');
        const ctaButton = document.getElementById('ctaButton');
        const closeModal = document.getElementById('closeModal');

        if (ctaButton && modal) {
            ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    openModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus on first input for accessibility
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    setupForm() {
        const contactForm = document.getElementById('contactForm');
        const formSuccess = document.getElementById('formSuccess');

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(e);
            });
        }
    }

    async handleFormSubmit(e) {
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const formSuccess = document.getElementById('formSuccess');
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Show loading state
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        try {
            // Prepare form data
            const formData = new URLSearchParams();
            const formElements = form.elements;
            
            for (let element of formElements) {
                if (element.name && element.value) {
                    formData.append(element.name, element.value);
                }
            }

            // Submit to Google Apps Script or your endpoint
            if (CONFIG.form.scriptURL && CONFIG.form.scriptURL !== 'your-google-apps-script-url-here') {
                const response = await fetch(CONFIG.form.scriptURL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData
                });

                // Redirect to thank you page
                if (CONFIG.form.thankYouPage) {
                    window.location.href = CONFIG.form.thankYouPage;
                } else {
                    this.showSuccessMessage();
                }
            } else {
                // Fallback - show success message
                console.warn('Form submission URL not configured. Please update CONFIG.form.scriptURL');
                this.showSuccessMessage();
            }

        } catch (error) {
            console.error('Form submission error:', error);
            alert('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
        } finally {
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    }

    validateForm(form) {
        const requiredFields = Object.entries(CONFIG.form.fields)
            .filter(([key, config]) => config.required)
            .map(([key]) => key);

        for (let fieldName of requiredFields) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field || !field.value.trim()) {
                field.focus();
                alert(`Por favor, completa el campo: ${CONFIG.form.fields[fieldName].label}`);
                return false;
            }

            // Email validation
            if (fieldName === 'email' && !this.isValidEmail(field.value)) {
                field.focus();
                alert('Por favor, ingresa un correo electrónico válido');
                return false;
            }
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showSuccessMessage() {
        const contactForm = document.getElementById('contactForm');
        const formSuccess = document.getElementById('formSuccess');
        
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
        
        // Auto-close modal after 3 seconds
        setTimeout(() => {
            this.closeModal();
            contactForm.style.display = 'block';
            formSuccess.style.display = 'none';
            contactForm.reset();
        }, 3000);
    }

    // Utility method to update theme dynamically
    changeTheme(themeName) {
        if (CONFIG.themes[themeName]) {
            applyTheme(themeName);
            console.log(`Theme changed to: ${themeName}`);
        }
    }

    // Method to update configuration
    updateConfig(newConfig) {
        Object.assign(CONFIG, newConfig);
        console.log('Configuration updated:', CONFIG);
    }
}

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.websiteManager = new WebsiteManager();
    
    // Make some methods globally available for console debugging
    window.changeTheme = (theme) => window.websiteManager.changeTheme(theme);
    window.updateConfig = (config) => window.websiteManager.updateConfig(config);
    
    console.log('Website initialized successfully!');
    console.log('Available themes:', Object.keys(CONFIG.themes));
    console.log('To change theme, use: changeTheme("blue") or changeTheme("green")');
});

// Prevent image drag for better UX
document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Add loading class removal when page is fully loaded
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
