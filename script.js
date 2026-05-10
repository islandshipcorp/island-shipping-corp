// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinkItems = document.querySelectorAll('.nav-link');
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header background change on scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(30, 60, 114, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
        header.style.backdropFilter = 'none';
    }
});

// Intersection Observer for fade-in animations
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

// Observe all route cards and service items
const animatedElements = document.querySelectorAll('.route-card, .service-item, .contact-card');
animatedElements.forEach(el => {
    observer.observe(el);
});

// Add active state to navigation based on scroll position
const sections = document.querySelectorAll('section[id]');

function setActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.add('active');
        } else {
            document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Load routes from admin panel
function loadRoutesFromAdmin() {
    const savedRoutes = localStorage.getItem('isc_routes');
    if (savedRoutes) {
        const routes = JSON.parse(savedRoutes);
        const routesGrid = document.querySelector('.routes-grid');
        
        if (routesGrid) {
            routesGrid.innerHTML = '';
            routes.forEach(route => {
                const routeCard = document.createElement('div');
                routeCard.className = 'route-card';
                routeCard.innerHTML = `
                    <h3>${route.title}</h3>
                    <div class="route-info">
                        <p><strong>Duration:</strong> ${route.duration}</p>
                        <p><strong>Daily Trips:</strong> ${route.trips}</p>
                        <p><strong>Fare:</strong> ${route.fare}</p>
                    </div>
                `;
                routesGrid.appendChild(routeCard);
            });
        }
    }
}

// Load routes on page load
window.addEventListener('DOMContentLoaded', loadRoutesFromAdmin);

// Console welcome message
console.log('%c🚢 Island Shipping Corporation', 'color: #1e3c72; font-size: 20px; font-weight: bold;');
console.log('%cYour Trusted Ferry Service in Cebu', 'color: #2a5298; font-size: 14px;');

// Prevent console errors for missing logo initially
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG' && e.target.src.includes('logo.png')) {
        console.warn('Logo image not found. Please add logo.png to your project folder.');
        e.preventDefault();
    }
}, true);
