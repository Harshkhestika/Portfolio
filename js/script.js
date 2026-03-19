/**
 * Harsh Khestika - Portfolio Website
 * JavaScript functionality
 * Author: Harsh Khestika
 * Version: 2.0
 */

// ========================================
// GLOBAL VARIABLES & CONFIGURATION
// ========================================

const config = {
    typingSpeed: 100,
    typingDelay: 2000,
    particleCount: 80,
    githubUsername: 'harshkhestika',
    githubRepoLimit: 6,
    web3formsAccessKey: 'ed573845-ba48-4272-8d1b-d05dd221bbc9' // Your Web3Forms access key
};

// Language color mapping for GitHub repositories
const languageColors = {
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#563d7c',
    PHP: '#4F5D95',
    TypeScript: '#2b7489',
    'C++': '#f34b7d',
    C: '#555555',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    default: '#8b949e'
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to limit rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format date to relative time (e.g., "2 days ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted relative time
 */
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    
    return 'just now';
}

// ========================================
// NAVBAR FUNCTIONALITY
// ========================================

/**
 * Initialize navigation bar functionality
 * - Scroll effect
 * - Active link highlighting
 * - Hamburger menu toggle
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    const handleScroll = debounce(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
    
    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close menu when clicking nav links
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Smooth scroll to section
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Close mobile menu
                    if (hamburger && navMenu) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            });
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Update active navigation link based on current scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ========================================
// TYPING ANIMATION
// ========================================

/**
 * Initialize typing animation for hero subtitle
 * Cycles through multiple roles with typewriter effect
 */
function initTypingAnimation() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;
    
    const roles = [
        'Full Stack Developer',
        'React Developer',
        'JavaScript Engineer',
        'Problem Solver'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Delete character
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Add character
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        // Determine typing speed
        let typeSpeed = isDeleting ? 50 : config.typingSpeed;
        
        // Check if word is complete
        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at end of word
            typeSpeed = config.typingDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to next role
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start typing animation
    type();
}

// ========================================
// PARTICLE BACKGROUND
// ========================================

/**
 * Initialize particle animation on canvas
 * Creates a subtle animated background effect
 */
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Set canvas size
    function setCanvasSize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    setCanvasSize();
    window.addEventListener('resize', debounce(setCanvasSize, 250));
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
            ctx.fill();
        }
    }
    
    // Initialize particles
    function initParticleArray() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Connect particles with lines
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(102, 126, 234, ${0.15 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    initParticleArray();
    animate();
}

// ========================================
// SCROLL REVEAL ANIMATION
// ========================================

/**
 * Initialize scroll reveal animations using Intersection Observer
 * Elements fade in as they enter viewport
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .about-content, .skill-category, .project-card, .cert-card, .contact-content'
    );
    
    if (revealElements.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(element => {
        element.classList.add('reveal');
        observer.observe(element);
    });
}

// ========================================
// SKILL BAR ANIMATION
// ========================================

/**
 * Animate skill progress bars when they come into view
 */
function initSkillBarAnimation() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    if (skillCards.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillCard = entry.target;
                const progressBar = skillCard.querySelector('.skill-progress');
                if (progressBar) {
                    const targetWidth = progressBar.getAttribute('data-width');
                    
                    // Animate progress bar
                    setTimeout(() => {
                        progressBar.style.width = `${targetWidth}%`;
                        skillCard.classList.add('animated');
                    }, 100);
                }
                
                observer.unobserve(skillCard);
            }
        });
    }, observerOptions);
    
    skillCards.forEach(card => observer.observe(card));
}

// ========================================
// GITHUB API INTEGRATION
// ========================================

/**
 * Fetch and display GitHub repositories using GitHub API
 */
async function fetchGitHubRepos() {
    const githubContainer = document.getElementById('githubRepos');
    if (!githubContainer) return;
    
    // Show loading state
    githubContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <div class="loading-spinner"></div>
            <p style="color: var(--color-text-secondary); margin-top: 1rem;">Loading repositories...</p>
        </div>
    `;
    
    try {
        // Using a CORS proxy to avoid rate limiting issues
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const githubApiUrl = `https://api.github.com/users/${config.githubUsername}/repos?sort=updated&per_page=${config.githubRepoLimit}`;
        
        const response = await fetch(proxyUrl + encodeURIComponent(githubApiUrl));
        
        if (!response.ok) {
            throw new Error('GitHub API request failed');
        }
        
        const repos = await response.json();
        
        // Clear loading state
        githubContainer.innerHTML = '';
        
        if (!repos || repos.length === 0) {
            githubContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p style="color: var(--color-text-secondary);">No repositories found.</p>
                </div>
            `;
            return;
        }
        
        // Render repository cards
        repos.forEach(repo => {
            const repoCard = createRepoCard(repo);
            githubContainer.appendChild(repoCard);
        });
        
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        
        // Fallback to static data from your screenshot
        githubContainer.innerHTML = `
            <div class="repo-card">
                <div class="repo-header">
                    <i class="fas fa-code-branch repo-icon"></i>
                    <h3 class="repo-name">Java</h3>
                </div>
                <div class="repo-footer">
                    <div class="repo-language">
                        <span class="language-dot" style="background-color: #b07219"></span>
                        <span>Java</span>
                    </div>
                    <div class="repo-updated">just now</div>
                </div>
            </div>
            
            <div class="repo-card">
                <div class="repo-header">
                    <i class="fas fa-code-branch repo-icon"></i>
                    <h3 class="repo-name">AI-Symptom-Checker-Chat-Bot</h3>
                </div>
                <div class="repo-footer">
                    <div class="repo-language">
                        <span class="language-dot" style="background-color: #e34c26"></span>
                        <span>HTML</span>
                    </div>
                    <div class="repo-updated">14 hours ago</div>
                </div>
            </div>
            
            <div class="repo-card">
                <div class="repo-header">
                    <i class="fas fa-code-branch repo-icon"></i>
                    <h3 class="repo-name">Crafting_Sign</h3>
                </div>
                <p class="repo-description">Production-ready MERN stack web application for premium acrylic signage ...</p>
                <div class="repo-footer">
                    <div class="repo-language">
                        <span class="language-dot" style="background-color: #f1e05a"></span>
                        <span>JavaScript</span>
                    </div>
                    <div class="repo-updated">5 days ago</div>
                </div>
            </div>
            
            <div class="repo-card">
                <div class="repo-header">
                    <i class="fas fa-code-branch repo-icon"></i>
                    <h3 class="repo-name">vrtechsolutions</h3>
                </div>
                <p class="repo-description">Powertools,</p>
                <div class="repo-footer">
                    <div class="repo-language">
                        <span class="language-dot" style="background-color: #e34c26"></span>
                        <span>HTML</span>
                    </div>
                    <div class="repo-updated">1 week ago</div>
                </div>
            </div>
            
            <div class="repo-card">
                <div class="repo-header">
                    <i class="fas fa-code-branch repo-icon"></i>
                    <h3 class="repo-name">Chittorgarh-TechSure</h3>
                </div>
                <div class="repo-footer">
                    <div class="repo-language">
                        <span class="language-dot" style="background-color: #e34c26"></span>
                        <span>HTML</span>
                    </div>
                    <div class="repo-updated">1 week ago</div>
                </div>
            </div>
            
            <div class="repo-card">
                <div class="repo-header">
                    <i class="fas fa-code-branch repo-icon"></i>
                    <h3 class="repo-name">Shri-Balaji-Construction</h3>
                </div>
                <div class="repo-footer">
                    <div class="repo-language">
                        <span class="language-dot" style="background-color: #e34c26"></span>
                        <span>HTML</span>
                    </div>
                    <div class="repo-updated">1 week ago</div>
                </div>
            </div>
        `;
    }
}

/**
 * Create a repository card element
 * @param {Object} repo - Repository data from GitHub API
 * @returns {HTMLElement} Repository card element
 */
function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    
    const languageColor = languageColors[repo.language] || languageColors.default;
    const description = repo.description || ''; // Empty string if no description
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;
    const updated = formatRelativeTime(repo.updated_at);
    
    card.innerHTML = `
        <div class="repo-header">
            <i class="fas fa-code-branch repo-icon"></i>
            <h3 class="repo-name">${repo.name}</h3>
        </div>
        ${description ? `<p class="repo-description">${description}</p>` : ''}
        <div class="repo-footer">
            ${repo.language ? `
                <div class="repo-language">
                    <span class="language-dot" style="background-color: ${languageColor}"></span>
                    <span>${repo.language}</span>
                </div>
            ` : ''}
            ${stars > 0 ? `
                <div class="repo-stats">
                    <i class="fas fa-star"></i>
                    <span>${stars}</span>
                </div>
            ` : ''}
            ${forks > 0 ? `
                <div class="repo-stats">
                    <i class="fas fa-code-branch"></i>
                    <span>${forks}</span>
                </div>
            ` : ''}
            <div class="repo-updated">${updated}</div>
        </div>
    `;
    
    // Make card clickable
    card.addEventListener('click', () => {
        window.open(repo.html_url, '_blank');
    });
    
    return card;
}

// ========================================
// CONTACT FORM WITH WEB3FORMS
// ========================================

/**
 * Initialize contact form with Web3Forms integration
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Set the access key
    const accessKeyInput = form.querySelector('input[name="access_key"]');
    if (accessKeyInput) {
        accessKeyInput.value = config.web3formsAccessKey;
    }
    
    const submitBtn = form.querySelector('.btn-submit, button[type="submit"]');
    const successMsg = document.getElementById('formSuccess');
    
    // Get the original button text
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Show loading state
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
        
        try {
            const formData = new FormData(form);
            
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Show success message
                if (successMsg) {
                    successMsg.classList.add('show');
                } else {
                    // Fallback alert if success message element doesn't exist
                    alert("Success! Your message has been sent.");
                }
                
                // Reset form
                form.reset();
                
                // Hide success message after 5 seconds
                if (successMsg) {
                    setTimeout(() => {
                        successMsg.classList.remove('show');
                    }, 5000);
                }
            } else {
                alert("Error: " + (data.message || "Something went wrong. Please try again."));
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert("Something went wrong. Please check your internet connection and try again.");
        } finally {
            // Hide loading state
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup && formGroup.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - Form element
 * @returns {boolean} True if form is valid
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate individual form field
 * @param {HTMLInputElement} field - Input field element
 * @returns {boolean} True if field is valid
 */
function validateField(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return true;
    
    const errorElement = formGroup.querySelector('.form-error');
    
    // Remove existing error
    formGroup.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    // Check if field is empty (for required fields)
    if (field.hasAttribute('required') && !field.value.trim()) {
        formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = 'This field is required';
        }
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            formGroup.classList.add('error');
            if (errorElement) {
                errorElement.textContent = 'Please enter a valid email address';
            }
            return false;
        }
    }
    
    // Phone validation (optional)
    if (field.type === 'tel' && field.value.trim() && field.hasAttribute('required')) {
        const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
        if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
            formGroup.classList.add('error');
            if (errorElement) {
                errorElement.textContent = 'Please enter a valid phone number';
            }
            return false;
        }
    }
    
    // Minimum length validation for message
    if (field.name === 'message' && field.value.trim() && field.value.trim().length < 10) {
        formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = 'Message must be at least 10 characters';
        }
        return false;
    }
    
    return true;
}

// ========================================
// SMOOTH SCROLL
// ========================================

/**
 * Initialize smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

/**
 * Lazy load images when they enter viewport
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
    console.log('Initializing portfolio...');
    
    // Core functionality
    initNavbar();
    initTypingAnimation();
    initParticles();
    
    // Animations
    initScrollReveal();
    initSkillBarAnimation();
    
    // Features
    fetchGitHubRepos();
    initContactForm(); // This now uses Web3Forms
    initSmoothScroll();
    initLazyLoading();
    
    // Console message for recruiters
    console.log('%c👋 Hello!', 'font-size: 24px; font-weight: bold; color: #667eea;');
    console.log('%cThanks for checking out my portfolio!', 'font-size: 14px; color: #a0aec0;');
    console.log('%cFeel free to explore the code: https://github.com/harshkhestika', 'font-size: 12px; color: #718096;');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}