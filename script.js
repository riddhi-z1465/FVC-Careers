// ===== SMOOTH SCROLL FOR NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// ===== JOB CARDS CAROUSEL =====
const jobCards = document.getElementById('jobCards');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;

if (prevBtn && nextBtn && jobCards) {
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        const maxIndex = jobCards.children.length - 3;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    function updateCarousel() {
        const cardWidth = jobCards.children[0].offsetWidth;
        const gap = 32; // 2rem gap
        const offset = -(currentIndex * (cardWidth + gap));
        jobCards.style.transform = `translateX(${offset}px)`;
    }
}

// ===== SEARCH FORM HANDLING =====
const searchForm = document.querySelector('.search-form');

if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const role = document.getElementById('role').value;
        const location = document.getElementById('location').value;
        
        console.log('Searching for:', { role, location });
        
        // Show a simple alert (in production, this would navigate to search results)
        alert(`Searching for ${role || 'all roles'} in ${location || 'all locations'}`);
    });
}

// ===== FAVORITE BUTTON TOGGLE =====
const favoriteBtn = document.querySelector('.favorite-btn');

if (favoriteBtn) {
    favoriteBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        const svg = this.querySelector('svg');
        
        if (this.classList.contains('active')) {
            svg.setAttribute('fill', 'currentColor');
            this.style.background = '#FF6B6B';
            this.style.color = '#FFFFFF';
        } else {
            svg.setAttribute('fill', 'none');
            this.style.background = '#FFFFFF';
            this.style.color = '#2D3436';
        }
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// ===== LOCATION TAGS INTERACTION =====
const locationTags = document.querySelectorAll('.location-tag');

locationTags.forEach(tag => {
    tag.addEventListener('click', function() {
        // Remove active class from all tags
        locationTags.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tag
        this.classList.add('active');
        
        console.log('Selected location:', this.textContent);
    });
});

// ===== JOB CARD CLICK HANDLING =====
const jobCardElements = document.querySelectorAll('.job-card');

jobCardElements.forEach(card => {
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('job-card-link')) {
            const link = this.querySelector('.job-card-link');
            if (link) {
                console.log('Job card clicked:', this.querySelector('.job-card-title').textContent);
            }
        }
    });
});

// ===== GALLERY LIGHTBOX EFFECT =====
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img) {
            console.log('Gallery item clicked:', img.alt);
            // In production, this would open a lightbox modal
        }
    });
});

// ===== FORM INPUT ANIMATIONS =====
const formInputs = document.querySelectorAll('.form-group input');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// ===== PARALLAX EFFECT FOR HERO IMAGE =====
const heroImage = document.querySelector('.hero-image');

if (heroImage) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    });
}

// ===== BUTTON RIPPLE EFFECT =====
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
    ripple.classList.add('ripple');
    
    const rippleElement = button.getElementsByClassName('ripple')[0];
    
    if (rippleElement) {
        rippleElement.remove();
    }
    
    button.appendChild(ripple);
}

const buttons = document.querySelectorAll('button, .search-btn, .contact-btn, .explore-btn');
buttons.forEach(button => {
    button.addEventListener('click', createRipple);
});

// Add ripple CSS
const style = document.createElement('style');
style.textContent = `
    button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%c Welcome to FVC Careers! ', 'background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); color: white; font-size: 20px; padding: 10px 20px; border-radius: 8px;');
console.log('%c We\'re building the future. Join us! ', 'color: #FF6B6B; font-size: 14px; font-weight: bold;');
