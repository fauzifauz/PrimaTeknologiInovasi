// FIXED: Mobile dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            // Update aria-expanded attribute
            const isExpanded = mobileMenu.classList.contains('active');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
            
            // Toggle menu icon
            const menuIcon = mobileMenuButton.querySelector('i');
            if (menuIcon) {
                if (isExpanded) {
                    menuIcon.setAttribute('data-lucide', 'x');
                } else {
                    menuIcon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons(); // Refresh icons
            }
        });
    }
    
    // Mobile dropdown toggle functionality
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const content = this.nextElementSibling;
            const isActive = content.classList.contains('active');
            
            // Close all other dropdowns
            document.querySelectorAll('.mobile-dropdown-content').forEach(item => {
                if (item !== content) {
                    item.classList.remove('active');
                }
            });
            
            document.querySelectorAll('.mobile-dropdown-toggle').forEach(item => {
                if (item !== this) {
                    item.classList.remove('active');
                    const span = item.querySelector('span');
                    if (span) span.textContent = '+';
                }
            });
            
            // Toggle current dropdown
            if (!isActive) {
                content.classList.add('active');
                this.classList.add('active');
                const span = this.querySelector('span');
                if (span) span.textContent = '-';
            } else {
                content.classList.remove('active');
                this.classList.remove('active');
                const span = this.querySelector('span');
                if (span) span.textContent = '+';
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mobile-dropdown')) {
            document.querySelectorAll('.mobile-dropdown-content').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelectorAll('.mobile-dropdown-toggle').forEach(item => {
                item.classList.remove('active');
                const span = item.querySelector('span');
                if (span) span.textContent = '+';
            });
        }
    });
    
    // Close mobile menu when clicking on a link
    function closeMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            const menuIcon = mobileMenuButton.querySelector('i');
            if (menuIcon) {
                menuIcon.setAttribute('data-lucide', 'menu');
                lucide.createIcons(); // Refresh icons
            }
        }
    }
    
    // Attach close function to all mobile menu links
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Expose closeMobileMenu function globally for onclick attributes
    window.closeMobileMenu = closeMobileMenu;
});

// Particle animation for hero section
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 20 + 5;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 20 + 10;
        const animationDelay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;
        
        container.appendChild(particle);
    }
}

// Initialize Interactive Map
function initMap() {
    // Default coordinates for Jakarta
    const jakartaCoords = [-6.2088, 106.8456];
    
    // Initialize the map
    const map = L.map('map').setView(jakartaCoords, 12);

    // Add different tile layers
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    });

    const satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '© Google Maps'
    });

    const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '© OpenTopoMap'
    });

    // Add default layer
    osmLayer.addTo(map);

    // Add layer control
    const baseMaps = {
        "Street Map": osmLayer,
        "Satellite": satelliteLayer,
        "Terrain": terrainLayer
    };

    L.control.layers(baseMaps).addTo(map);

    // Add custom marker
    const customIcon = L.divIcon({
        html: '<div style="background-color: #dc2626; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    // Add marker with popup
    const marker = L.marker(jakartaCoords, { icon: customIcon }).addTo(map);
    marker.bindPopup(`
        <div style="text-align: center;">
            <strong>PRIMA TEKNOLOGI INOVASI</strong><br>
            <span style="color: #666; font-size: 12px;">Jakarta, Indonesia</span><br>
            <a href="https://maps.google.com/?q=Jakarta,Indonesia" target="_blank" 
               style="color: #1d4ed8; text-decoration: none; font-size: 12px;">
               📍 Open in Google Maps
            </a>
        </div>
    `).openPopup();

    // Add map controls
    const controls = L.control({ position: 'topright' });
    controls.onAdd = function() {
        const div = L.DomUtil.create('div', 'map-controls');
        div.innerHTML = `
            <button class="map-btn" onclick="map.setView([-6.2088, 106.8456], 12)" title="Reset View">
                <i data-lucide="home"></i>
            </button>
            <button class="map-btn" onclick="map.locate({setView: true, maxZoom: 16})" title="My Location">
                <i data-lucide="navigation"></i>
            </button>
        `;
        return div;
    };
    controls.addTo(map);

    // Handle location found
    map.on('locationfound', function(e) {
        L.marker(e.latlng).addTo(map)
            .bindPopup("You are here!").openPopup();
    });

    return map;
}

// Optimize background image loading
function optimizeBackgroundImage() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Preload background image
    const bgImage = new Image();
    bgImage.src = 'assets/background/backgroundcompany.jpg';
    
    bgImage.onload = function() {
        console.log('Background image loaded successfully');
        // Add loaded class for potential fade-in animation
        heroSection.classList.add('bg-loaded');
        
        // Optional: Add smooth transition effect
        const bgContainer = heroSection.querySelector('.bg-cover');
        if (bgContainer) {
            bgContainer.style.opacity = '0';
            setTimeout(() => {
                bgContainer.style.transition = 'opacity 0.5s ease-in-out';
                bgContainer.style.opacity = '1';
            }, 100);
        }
    };
    
    bgImage.onerror = function() {
        console.error('Failed to load background image');
        // Fallback to gradient background
        heroSection.style.background = 'linear-gradient(135deg, #0a2463 0%, #1e40af 100%)';
        
        // Show warning in console for development
        console.warn('Background image not found. Using gradient fallback.');
    };
}

// Lazy load images for better performance
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Enhanced smooth scrolling with offset
function enhancedSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth < 768) {
                closeMobileMenu();
            }
        });
    });
}

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress fixed top-0 left-0 w-0 h-1 bg-primary-600 z-50 transition-all duration-300';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        progressBar.style.width = `${scrollPercent}%`;
    });
}

// Main initialization function
function initializeWebsite() {
    // Initialize AOS
    if (window.AOS) {
        AOS.init({ 
            duration: 900, 
            once: true, 
            easing: 'ease-in-out',
            offset: 100
        });
    }

    // Initialize lucide icons
    try { 
        if (window.lucide) {
            lucide.createIcons();
            // Refresh icons after dynamic content
            setTimeout(() => lucide.createIcons(), 1000);
        }
    } catch (err) { 
        console.warn('Lucide icons not available:', err);
    }

    // Set current year in footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Enhanced smooth scrolling
    enhancedSmoothScroll();

    // Header shadow toggle on scroll
    const header = document.getElementById('navbar');
    const onScroll = () => {
        if (!header) return;
        if (window.scrollY > 20) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Hero parallax effect
    const hero = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    if (hero && heroContent && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            const tx = px * 15;
            const ty = py * 10;
            heroContent.style.transform = `translate3d(${tx}px, ${-ty}px, 0) scale(1)`;
        });
        hero.addEventListener('mouseleave', () => { 
            heroContent.style.transform = '';
        });
    }

    // Pause logo carousel on hover
    const logoCarousel = document.querySelector('.logo-carousel');
    if (logoCarousel) {
        logoCarousel.addEventListener('mouseenter', () => { 
            logoCarousel.style.animationPlayState = 'paused'; 
        });
        logoCarousel.addEventListener('mouseleave', () => { 
            logoCarousel.style.animationPlayState = 'running'; 
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const msgEl = document.getElementById('form-message');

            // Basic validation
            if (!name || !email || !message) {
                if (msgEl) {
                    msgEl.classList.remove('hidden');
                    msgEl.classList.remove('text-green-600');
                    msgEl.classList.add('text-red-600');
                    msgEl.textContent = 'Please complete all required fields.';
                }
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (msgEl) {
                    msgEl.classList.remove('hidden');
                    msgEl.classList.remove('text-green-600');
                    msgEl.classList.add('text-red-600');
                    msgEl.textContent = 'Please enter a valid email address.';
                }
                return;
            }

            // Simulate form submission
            if (msgEl) {
                msgEl.classList.remove('hidden');
                msgEl.classList.remove('text-red-600');
                msgEl.classList.add('text-green-600');
                msgEl.textContent = 'Thank you for your message! We will get back to you soon.';
            }

            // Clear form after successful submission simulation
            setTimeout(() => {
                e.target.reset();
                if (msgEl) {
                    msgEl.classList.add('hidden');
                }
            }, 3000);
        });
    }

    // Initialize particle animation
    createParticles();
    
    // Optimize background image loading
    optimizeBackgroundImage();
    
    // Lazy load images
    lazyLoadImages();
    
    // Add scroll progress indicator
    addScrollProgress();
    
    // Initialize map when page loads
    setTimeout(() => {
        if (document.getElementById('map')) {
            try {
                initMap();
            } catch (error) {
                console.warn('Map initialization failed:', error);
            }
        }
    }, 500);

    // Add loading state management
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
}

// Error handling for images
function handleImageErrors() {
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            console.warn('Image failed to load:', e.target.src);
            e.target.style.opacity = '0.5';
            e.target.alt = 'Image not available';
        }
    }, true);
}

// Responsive image handling
function handleResponsiveImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading lazy for better performance
        if (!img.loading) {
            img.loading = 'lazy';
        }
        
        // Add error handling
        img.addEventListener('error', function() {
            this.style.opacity = '0.3';
            this.alt = 'Image failed to load';
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    handleImageErrors();
    handleResponsiveImages();
});

// Export functions for global access if needed
window.optimizeBackgroundImage = optimizeBackgroundImage;
window.lazyLoadImages = lazyLoadImages;
window.enhancedSmoothScroll = enhancedSmoothScroll;

// Add some utility functions
window.utils = {
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
