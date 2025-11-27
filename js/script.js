function initializeAccurateNavigation() {
    console.log('Initializing accurate navigation...');

    function getAccurateScrollPosition(targetId) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return 0;
        
        const navbar = document.getElementById('navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;

        const elementRect = targetElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;

        let additionalOffset = 0;
        
        if (window.innerWidth < 768) { 
            additionalOffset = 20;
        } else if (window.innerWidth < 1024) { 
            additionalOffset = 30;
        } else { 
            additionalOffset = 20;
        }
        
        const finalOffset = absoluteElementTop - navbarHeight - additionalOffset;
        
        console.log(`Scrolling to ${targetId}:`, {
            elementTop: absoluteElementTop,
            navbarHeight: navbarHeight,
            additionalOffset: additionalOffset,
            finalOffset: finalOffset,
            windowWidth: window.innerWidth
        });
        
        return Math.max(0, finalOffset);
    }

    function scrollToSectionAccurate(targetId) {
        if (!targetId || targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) {
            console.warn(`Target element not found: ${targetId}`);
            return;
        }
        
        const targetPosition = getAccurateScrollPosition(targetId);
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        history.pushState(null, null, targetId);
    }

    function setupAccurateNavigation() {
        const desktopDropdownLinks = document.querySelectorAll('.dropdown-menu a');
        desktopDropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                scrollToSectionAccurate(targetId);
        
                const dropdown = this.closest('.dropdown-menu');
                if (dropdown) {
                    dropdown.classList.remove('opacity-100', 'visible');
                    dropdown.classList.add('opacity-0', 'invisible');
                }
            });
        });

        const mobileDropdownLinks = document.querySelectorAll('.mobile-dropdown-content a');
        mobileDropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                scrollToSectionAccurate(targetId);
                if (window.closeMobileMenu) {
                    window.closeMobileMenu();
                }
            });
        });

        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                scrollToSectionAccurate(targetId);
                
                if (window.innerWidth < 768 && window.closeMobileMenu) {
                    window.closeMobileMenu();
                }
            });
        });

        const footerLinks = document.querySelectorAll('footer a[href^="#"]');
        footerLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                scrollToSectionAccurate(targetId);
            });
        });
    }

    function setupEnhancedSectionDetection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .dropdown-menu a');
        
        function updateActiveNavigation() {
            let currentSection = '';
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active', 'text-primary-600', 'font-semibold');
                const href = link.getAttribute('href');
                if (href && href === `#${currentSection}`) {
                    link.classList.add('active', 'text-primary-600', 'font-semibold');
                }
            });
        }

        const scrollHandler = window.utils ? window.utils.throttle(updateActiveNavigation, 100) : updateActiveNavigation;
        window.addEventListener('scroll', scrollHandler);
        updateActiveNavigation(); 
    }

    setupAccurateNavigation();
    setupEnhancedSectionDetection();
    
    console.log('Accurate navigation initialized');
}

function initializeLogoSplash() {
    const logoSplash = document.getElementById('logo-splash');
    
    if (!logoSplash) return;
    
    const minDisplayTime = 2000;
    const startTime = Date.now();
    
    function hideSplash() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        
        setTimeout(() => {
            logoSplash.classList.add('hidden');
            
            setTimeout(() => {
                if (logoSplash.parentNode) {
                    logoSplash.parentNode.removeChild(logoSplash);
                }
            }, 1000);
            
        }, remainingTime);
    }
    
    if (document.readyState === 'complete') {
        hideSplash();
    } else {
        window.addEventListener('load', hideSplash);
    }
    
    logoSplash.addEventListener('click', hideSplash);
    setTimeout(hideSplash, 5000);
}

function initializeMobileDropdown() {
    console.log('Initializing mobile dropdown...');
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
 
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = mobileMenu.classList.toggle('active');
            console.log('Mobile menu toggled:', isActive);
            const icon = this.querySelector('i');
            if (icon) {
                if (isActive) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                if (window.lucide) {
                    lucide.createIcons();
                }
            }
        });
    }

    const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    console.log('Found dropdown toggles:', dropdownToggles.length);
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const content = this.nextElementSibling;
            const isActive = content.classList.contains('active');
            const icon = this.querySelector('.dropdown-icon');
            
            console.log('Dropdown clicked, current state:', isActive);

            document.querySelectorAll('.mobile-dropdown-content').forEach(item => {
                if (item !== content) {
                    item.classList.remove('active');
                }
            });
  
            document.querySelectorAll('.mobile-dropdown-toggle .dropdown-icon').forEach(item => {
                if (item !== icon) {
                    item.textContent = '+';
                    item.classList.remove('rotate-45');
                }
            });
 
            if (isActive) {
                content.classList.remove('active');
                if (icon) {
                    icon.textContent = '+';
                    icon.classList.remove('rotate-45');
                }
            } else {
                content.classList.add('active');
                if (icon) {
                    icon.textContent = '−';
                    icon.classList.add('rotate-45');
                }
            }
        });
    });
 
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mobile-dropdown') && !e.target.closest('#mobile-menu-button')) {
            closeAllMobileDropdowns();

            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    if (window.lucide) lucide.createIcons();
                }
            }
        }
    });
    
    function closeAllMobileDropdowns() {
        document.querySelectorAll('.mobile-dropdown-content').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.mobile-dropdown-toggle .dropdown-icon').forEach(icon => {
            icon.textContent = '+';
            icon.classList.remove('rotate-45');
        });
    }
 
    window.closeMobileMenu = function() {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            closeAllMobileDropdowns();
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                if (window.lucide) lucide.createIcons();
            }
        }
    };
}

function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        const formMessage = document.getElementById('form-message');
        
        // Show loading state
        submitButton.innerHTML = 'Sending...';
        submitButton.disabled = true;
        
        // Get form data
        const formData = new FormData(this);
        const data = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        try {
            const response = await fetch('send_email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data)
            });
            
            const result = await response.json();
            
            if (formMessage) {
                formMessage.classList.remove('hidden');
                if (result.success) {
                    formMessage.classList.remove('text-red-600');
                    formMessage.classList.add('text-green-600');
                    contactForm.reset();
                } else {
                    formMessage.classList.remove('text-green-600');
                    formMessage.classList.add('text-red-600');
                }
                formMessage.textContent = result.message;
            }
            
        } catch (error) {
            console.error('Error:', error);
            if (formMessage) {
                formMessage.classList.remove('hidden');
                formMessage.classList.remove('text-green-600');
                formMessage.classList.add('text-red-600');
                formMessage.textContent = 'Network error. Please try again.';
            }
        } finally {
            // Reset button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Hide message after 5 seconds
            if (formMessage) {
                setTimeout(() => {
                    formMessage.classList.add('hidden');
                }, 5000);
            }
        }
    });
}

function initializeEnhancedNavigation() {
    initializeAccurateNavigation();
}

function setupMobileEnhancements() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('is-mobile');

        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .floating-element {
                    animation-duration: 8s !important;
                }
                .particle {
                    animation-duration: 25s !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function initializeWebsite() {
    initializeLogoSplash();
  
    setTimeout(() => {
        if (window.AOS) {
            AOS.init({ 
                duration: 900, 
                once: true, 
                easing: 'ease-in-out',
                offset: 100
            });
        }

        try { 
            if (window.lucide) {
                lucide.createIcons();
                setTimeout(() => lucide.createIcons(), 1000);
            }
        } catch (err) { 
            console.warn('Lucide icons not available:', err);
        }

        const yearEl = document.getElementById('current-year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        initI18n();

        initializeEnhancedNavigation();

        initializeContactForm();

        setupMobileEnhancements();

        const header = document.getElementById('navbar');
        const onScroll = () => {
            if (!header) return;
            if (window.scrollY > 20) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

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

        const logoCarousel = document.querySelector('.logo-carousel');
        if (logoCarousel) {
            logoCarousel.addEventListener('mouseenter', () => { 
                logoCarousel.style.animationPlayState = 'paused'; 
            });
            logoCarousel.addEventListener('mouseleave', () => { 
                logoCarousel.style.animationPlayState = 'running'; 
            });
        }

        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const message = document.getElementById('message').value.trim();
                const msgEl = document.getElementById('form-message');

                if (!name || !email || !message) {
                    if (msgEl) {
                        msgEl.classList.remove('hidden');
                        msgEl.classList.remove('text-green-600');
                        msgEl.classList.add('text-red-600');
                        msgEl.textContent = 'Please complete all required fields.';
                    }
                    return;
                }

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

                if (msgEl) {
                    msgEl.classList.remove('hidden');
                    msgEl.classList.remove('text-red-600');
                    msgEl.classList.add('text-green-600');
                    msgEl.textContent = 'Thank you for your message! We will get back to you soon.';
                }

                setTimeout(() => {
                    e.target.reset();
                    if (msgEl) {
                        msgEl.classList.add('hidden');
                    }
                }, 3000);
            });
        }

        createParticles();
 
        optimizeBackgroundImage();
 
        lazyLoadImages();
  
        addScrollProgress();
    
        setTimeout(() => {
            if (document.getElementById('map')) {
                try {
                    initMap();
                } catch (error) {
                    console.warn('Map initialization failed:', error);
                }
            }
        }, 500);

        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });

        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page loaded in ${loadTime}ms`);
            });
        }
    }, 100);
}

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

function initMap() {
    const jakartaCoords = [-6.2088, 106.8456];
    
    const map = L.map('map').setView(jakartaCoords, 12);

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

    osmLayer.addTo(map);

    const baseMaps = {
        "Street Map": osmLayer,
        "Satellite": satelliteLayer,
        "Terrain": terrainLayer
    };

    L.control.layers(baseMaps).addTo(map);

    const customIcon = L.divIcon({
        html: '<div style="background-color: #dc2626; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

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

    map.on('locationfound', function(e) {
        L.marker(e.latlng).addTo(map)
            .bindPopup("You are here!").openPopup();
    });

    return map;
}

function optimizeBackgroundImage() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const bgImage = new Image();
    bgImage.src = 'assets/background/backgroundcompany.jpg';
    
    bgImage.onload = function() {
        console.log('Background image loaded successfully');
        heroSection.classList.add('bg-loaded');
    
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
  
        heroSection.style.background = 'linear-gradient(135deg, #0a2463 0%, #1e40af 100%)';

        console.warn('Background image not found. Using gradient fallback.');
    };
}

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

function enhancedSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const navbar = document.getElementById('navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
     
            if (window.innerWidth < 768 && window.closeMobileMenu) {
                window.closeMobileMenu();
            }
        });
    });
}

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

function handleImageErrors() {
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            console.warn('Image failed to load:', e.target.src);
            e.target.style.opacity = '0.5';
            e.target.alt = 'Image not available';
        }
    }, true);
}

function handleResponsiveImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.loading) {
            img.loading = 'lazy';
        }

        img.addEventListener('error', function() {
            this.style.opacity = '0.3';
            this.alt = 'Image failed to load';
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing website...');

    initializeMobileDropdown();
   
    initializeWebsite();

    if (typeof initI18n === 'function') initI18n();
  
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    handleImageErrors();
    handleResponsiveImages();
    
    registerCustomClickHandlers();
    
    console.log('Website initialization complete');
});

function testNavigation() {
    console.log('Testing navigation targets...');
    
    const testTargets = [
        '#about-profile', '#brand-promise', '#vision-mission', '#our-goals',
        '#it-infrastructure', '#iot-solutions', '#smart-building', '#managed-services',
        '#company-overview', '#business-plan', '#marketing-strategy', '#management-team',
        '#certified-professionals', '#business-partners'
    ];
    
    testTargets.forEach(target => {
        const element = document.querySelector(target);
        if (element) {
            console.log(`✓ ${target}: Found at position ${element.offsetTop}`);
        } else {
            console.log(`✗ ${target}: NOT FOUND`);
        }
    });
}

window.optimizeBackgroundImage = optimizeBackgroundImage;
window.lazyLoadImages = lazyLoadImages;
window.enhancedSmoothScroll = enhancedSmoothScroll;
window.testNavigation = testNavigation;

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

window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

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

function setNavbarHeightVar() {
    const navbar = document.getElementById('navbar');
    const root = document.documentElement;
    const h = navbar ? navbar.offsetHeight : 64;
    root.style.setProperty('--navbar-height', h + 'px');
}

function scrollToSectionWithAnimation(targetId, sourceEl) {
    if (!targetId || targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 64;

    let additionalOffset = 20;
    if (window.innerWidth < 768) additionalOffset = 12;
    else if (window.innerWidth < 1024) additionalOffset = 22;

    const absoluteElementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const finalOffset = Math.max(0, absoluteElementTop - navbarHeight - additionalOffset);

    if (sourceEl) {
        sourceEl.classList.add('click-press');
        sourceEl.addEventListener('animationend', function _onEnd() {
            sourceEl.classList.remove('click-press');
            sourceEl.removeEventListener('animationend', _onEnd);
        });
        setTimeout(() => sourceEl.classList.remove('click-press'), 700);
    }

    window.scrollTo({ top: finalOffset, behavior: 'smooth' });
    try { history.pushState(null, null, targetId); } catch (e) { /* ignore */ }

    if (window.innerWidth < 768 && window.closeMobileMenu) window.closeMobileMenu();
}

function registerCustomClickHandlers() {
    setNavbarHeightVar();

    const mappings = [
        { id: 'logo-link', href: '#home' },
        { id: 'discover-solutions', href: '#about' },
        { id: 'explore-services', href: '#services' },
        { id: 'get-managed-services', href: '#contact' }
    ];

    mappings.forEach(m => {
        const el = document.getElementById(m.id);
        if (!el) return;
        el.addEventListener('click', function(e) {
            e.preventDefault();
            el.classList.add('click-pulse');
            setTimeout(() => el.classList.remove('click-pulse'), 520);
            scrollToSectionWithAnimation(m.href, el);
        });
    });

    window.addEventListener('resize', setNavbarHeightVar);

    registerBusinessPlanLink();
}

function registerBusinessPlanLink() {
    try {
        const trigger = document.querySelector('a.scroll-link[href="#business-plan"]');
        if (!trigger) return;

        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (typeof scrollToSectionWithAnimation === 'function') {
                scrollToSectionWithAnimation('#business-plan', trigger);
            } else {
                const el = document.querySelector('#business-plan');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            const target = document.querySelector('#business-plan');
            if (target) {
  
                target.classList.remove('section-focus');
                setTimeout(() => {
                    target.classList.add('section-focus');
                    setTimeout(() => target.classList.remove('section-focus'), 1600);
                }, 500);
            }
        });
    } catch (err) {
        console.warn('registerBusinessPlanLink failed:', err);
    }
}

const translations = {
    id: {
        "nav_home": "Beranda",
        "nav_about": "Tentang Kami",
        "nav_services": "Layanan",
        "nav_business": "Bisnis & Kapabilitas",
        "nav_contact": "Kontak",
        "nav_company_profile": "Profil Perusahaan",
        "nav_brand_promise": "Janji Merek",
        "nav_vision_mission": "Visi & Misi",
        "nav_our_goals": "Tujuan Kami",
        "nav_it_infrastructure": "Infrastruktur TI",
        "nav_iot_solutions": "Solusi IoT",
        "nav_smart_building": "Bangunan & Kota Cerdas",
        "nav_managed_services": "Layanan Terkelola",
        "nav_company_overview": "Gambaran Perusahaan",
        "nav_business_plan": "Rencana Bisnis",
        "nav_marketing_strategy": "Strategi Pemasaran",
        "nav_management_team": "Tim Manajemen",
        "nav_certified_professionals": "Profesional Bersertifikat",
        "nav_business_partners": "Mitra Bisnis",

        "hero_title": "Menginovasi Masa Depan",
        "hero_subtitle": "Memberdayakan Bisnis Anda Melalui Teknologi Inovatif",
        "hero_description": "PRIMA TEKNOLOGI INOVASI adalah mitra terpercaya Anda dalam menghadirkan teknologi inovatif yang mendorong transformasi bisnis menuju masa depan digital. Kami berdedikasi untuk menyediakan solusi IoT, infrastruktur TI, dan teknologi terintegrasi yang efektif dan berorientasi hasil, memberdayakan perusahaan Anda untuk mencapai keunggulan kompetitif yang berkelanjutan di era digital.",
        "discover_solutions": "Temukan Solusi Kami",

        "stats_projects": "Proyek Selesai",
        "stats_experience": "Tahun Pengalaman",
        "stats_professionals": "Profesional Bersertifikat",
        "stats_satisfaction": "Kepuasan Klien",

        "about_title": "Tentang Kami",
        "about_profile": "PRIMA TEKNOLOGI INOVASI meyakini bahwa teknologi adalah fondasi pertumbuhan bisnis modern. Dengan visi untuk memberdayakan organisasi di era digital, kami menghadirkan solusi IoT, Infrastruktur TI, dan Teknologi yang inovatif, andal, dan terintegrasi yang disesuaikan dengan kebutuhan setiap klien. Dibangun atas profesionalisme, integritas, dan inovasi berkelanjutan, kami adalah mitra terpercaya Anda dalam mendorong transformasi digital dan kesuksesan jangka panjang.",
        "brand_promise": "Janji Merek",
        "brand_professionalism": "Profesionalisme",
        "brand_professionalism_desc": "Menjunjung tinggi etika kerja yang kuat dan memberikan kualitas layanan yang luar biasa dalam setiap proyek.",
        "brand_reliability": "Reliability",
        "brand_reliability_desc": "Konsistensi dan kepercayaan adalah fondasi hubungan jangka panjang dengan klien.",
        "brand_innovation": "Inovation",
        "brand_innovation_desc": "Mengubah ide menjadi solusi digital yang kuat untuk membentuk masa depan bersama yang berkelanjutan.",
        "brand_modernization": "Modernization",
        "brand_modernization_desc": "Tetap terdepan dengan mengadopsi teknologi dan perbaikan berkelanjutan yang inovatif dan efektif.",
        "brand_agility": "Agility",
        "brand_agility_desc": "Beradaptasi terhadap perubahan dan mendorong kemajuan melalui solusi fleksibel dan efektif.",
        
        "vision_title": "Visi Kami",
        "vision_quote": '"Menjadi mitra teknologi terkemuka yang mendorong pertumbuhan bisnis berkelanjutan melalui inovasi, integrasi, dan transformasi digital dalam Solusi IoT dan TI."',
        "vision_point1_title": "Membangun Keunggulan Digital",
        "vision_point1_desc": "Kami berkomitmen untuk menciptakan keunggulan digital yang berkembang dengan inovasi global, membantu bisnis tetap gesit, kompetitif, dan siap menghadapi masa depan.",
        "vision_point2_title": "Mendorong Pertumbuhan Ekosistem Teknologi Terintegrasi",
        "vision_point2_desc": "Kami berusaha untuk mendorong ekosistem teknologi yang terhubung dan berkelanjutan yang mendukung inovasi dan kemajuan digital di berbagai industri.",
        "vision_point3_title": "Menginspirasi Keberlanjutan Digital",
        "vision_point3_desc": "Kami mendorong organisasi untuk mengadopsi transformasi digital yang cerdas, efisien, dan berkelanjutan untuk pertumbuhan jangka panjang.",
        
        "mission_title": "Misi Kami",
        "mission_quote": '"Menghadirkan solusi teknologi yang inovatif, terintegrasi, dan bernilai yang membantu klien mencapai efisiensi, keamanan, dan pertumbuhan berkelanjutan untuk kesuksesan jangka panjang."',
        "mission_point1_title": "Mendorong Transformasi Digital",
        "mission_point1_desc": "Kami memberdayakan organisasi untuk mengadopsi inovasi digital melalui strategi yang disesuaikan yang meningkatkan efisiensi, produktivitas, dan pertumbuhan berkelanjutan di semua industri.",
        "mission_point2_title": "Meningkatkan Kapabilitas",
        "mission_point2_desc": "Kami membangun budaya pembelajaran dan kerja sama tim, memungkinkan individu dan organisasi untuk tumbuh dan mencapai keunggulan bersama.",
        "mission_point3_title": "Menghadirkan Keunggulan",
        "mission_point3_desc": "Kami mempertahankan standar global kualitas dan keamanan, memberikan solusi terpercaya melalui operasi yang transparan.",
        
        "goals_title": "Tujuan Kami",
        "goal1_title": "Menghadirkan Solusi Berdampak Tinggi",
        "goal1_desc": "Menyediakan solusi teknologi yang inovatif dan berorientasi hasil yang menciptakan nilai terukur bagi klien.",
        "goal2_title": "Memperkuat Kemitraan yang Bermakna",
        "goal2_desc": "Membangun kolaborasi jangka panjang yang berkelanjutan berdasarkan kepercayaan, integritas, dan pertumbuhan bersama.",
        "goal3_title": "Mendorong Transformasi Digital",
        "goal3_desc": "Mendukung bisnis dalam beradaptasi dengan teknologi emerging dan mencapai keunggulan di era digital.",
        "explore_services": "Jelajahi bagaimana Produk & Layanan kami dapat membantu bisnis Anda tumbuh lebih cerdas dan cepat.",

        "services_title": "Layanan & Solusi",
        "it_infrastructure_title": "Infrastruktur TI & Solusi",
        "it_intro": "Produk TI yang kami hadirkan bukan sekadar teknologi, tetapi solusi yang menjawab kebutuhan bisnis pelanggan secara komprehensif.",
        "it_point1": "Efisiensi, keamanan, keandalan",
        "it_point2": "Fleksibilitas, dan nilai strategis jangka panjang.",
        "iot_title": "Internet of Things (IoT)",
        "iot_intro": "Internet of Things (IoT) bukan hanya perangkat yang saling terhubung, tetapi ekosistem cerdas yang mengubah data menjadi nilai nyata bagi bisnis.",
        "iot_point1": "Pemantauan real-time, pemeliharaan prediktif",
        "iot_point2": "Keamanan, wawasan berbasis data, keunggulan kompetitif.",

         "services_title": "Layanan & Solusi",
        "it_infrastructure_title": "Infrastruktur TI & Solusi",
        "it_intro": "Produk TI yang kami hadirkan bukan sekadar teknologi, tetapi solusi yang menjawab kebutuhan bisnis pelanggan secara komprehensif.",
        "it_point1": "Efisiensi, keamanan, keandalan",
        "it_point2": "Fleksibilitas, dan nilai strategis jangka panjang.",
        "iot_title": "Internet of Things (IoT)",
        "iot_intro": "Internet of Things (IoT) bukan hanya perangkat yang saling terhubung, tetapi ekosistem cerdas yang mengubah data menjadi nilai nyata bagi bisnis.",
        "iot_point1": "Pemantauan real-time, pemeliharaan prediktif",
        "iot_point2": "Keamanan, wawasan berbasis data, keunggulan kompetitif.",

        "products_solutions_title": "Produk & Solusi",
        "server_storage_title": "Server & Storage System",
        "server_storage_desc1": "Menyediakan solusi server fisik dan virtual untuk pemrosesan data.",
        "server_storage_desc2": "Produk termasuk server rack, blade server, dan sistem penyimpanan NAS/SAN.",
        "server_storage_desc3": "Memastikan ketersediaan data, performa tinggi, dan keamanan penyimpanan.",
        
        "network_infrastructure_title": "Infrastruktur Jaringan",
        "network_infrastructure_desc1": "Membangun jaringan komunikasi data yang andal & aman.",
        "network_infrastructure_desc2": "Produk termasuk switch, router kecepatan tinggi, firewall, dan access point.",
        "network_infrastructure_desc3": "Instalasi LAN dan fiber optic dengan manajemen topologi yang efisien.",
        
        "data_center_title": "Data Center Solution",
        "data_center_desc1": "Solusi lengkap untuk membangun server room atau data center.",
        "data_center_desc2": "Produk termasuk sistem power, cooling, rack system, UPS, dan monitoring.",
        "data_center_desc3": "Fokus pada efisiensi energi, keamanan, dan kelangsungan operasional.",
        
        "enterprise_network_title": "Enterprise Network Solution",
        "enterprise_network_desc1": "Manfaat SD-WAN untuk meningkatkan performa jaringan dan efisiensi biaya.",
        "enterprise_network_desc2": "Solusi komprehensif termasuk SD-WAN, wireless enterprise-grade, dan NAC.",
        "enterprise_network_desc3": "Fokus pada peningkatan efisiensi operasional dan penguatan keamanan jaringan.",
        
        "seat_management_title": "Seat Management Solutions",
        "seat_management_desc1": "Mengelola perangkat pengguna (laptop, PC, printer, dll.) dari instalasi hingga maintenance.",
        "seat_management_desc2": "Monitoring dan maintenance proaktif untuk keandalan dan performa sistem.",
        "seat_management_desc3": "Memastikan skalabilitas mulus dan keamanan akses jaringan yang komprehensif di seluruh sistem.",
        
        "software_solutions_title": "Software Solutions",
        "software_solutions_desc1": "Membantu organisasi mendapatkan lisensi software resmi dan compliant.",
        "software_solutions_desc2": "Mendukung vendor global terkemuka (Microsoft, Adobe, Cisco, dll.).",
        "software_solutions_desc3": "Implementasi terstruktur yang selaras dengan best practice industri global.",

        "iot_solutions_title": "Solusi IoT",
        "iot_solutions_desc": "Solusi Internet of Things komprehensif yang menghubungkan perangkat, mengumpulkan data, dan memberikan wawasan yang dapat ditindaklanjuti untuk pengambilan keputusan yang lebih cerdas.",
        "iot_connectivity_title": "Konektivitas IoT",
        "iot_connectivity_desc": "Solusi konektivitas mulus untuk perangkat IoT dengan infrastruktur jaringan yang andal.",
        "iot_analytics_title": "Analisis Data",
        "iot_analytics_desc": "Platform analisis canggih untuk memproses dan mendapatkan wawasan dari data IoT.",
        "iot_security_title": "Keamanan IoT",
        "iot_security_desc": "Solusi keamanan komprehensif untuk melindungi ekosistem IoT dari ancaman.",

        "smart_building_title": "Solusi Bangunan & Kota Cerdas",
        "smart_building_desc": "Mewujudkan lingkungan bangunan yang cerdas, hemat energi, dan aman melalui integrasi sistem berbasis Internet of Things (IoT).",
        "smart_building1_title": "Integrasi Sistem IoT",
        "smart_building1_desc": "Mengintegrasikan sistem IoT untuk menciptakan bangunan yang cerdas, efisien, dan aman.",
        "smart_building2_title": "Otomatisasi Energi & Kontrol",
        "smart_building2_desc": "Mengotomatisasi sistem AC, pencahayaan, dan listrik untuk efisiensi energi yang lebih baik.",
        "smart_building3_title": "Sistem Peringatan Dini",
        "smart_building3_desc": "Mendeteksi asap, panas, dan api lebih awal dengan alarm dan sprinkler terintegrasi.",
        "smart_building4_title": "Komunikasi Terotomatisasi",
        "smart_building4_desc": "Menyediakan audio dan pengumuman otomatis untuk komunikasi yang efektif.",
        "smart_building5_title": "Monitoring Keamanan Canggih",
        "smart_building5_desc": "Meningkatkan keamanan bangunan dengan IP camera, sensor gerak, dan monitoring real-time.",
        "smart_building6_title": "Manajemen Akses Digital",
        "smart_building6_desc": "Mengelola akses dengan pintu otomatis, kartu ID pintar, dan sistem pengunjung digital.",

        "managed_services_title": "Layanan Terkelola",
        "managed_services_desc": "Solusi manajemen TI komprehensif untuk memastikan sistem Anda berjalan dengan lancar, aman, dan efisien 24/7.",
        "managed_service1_title": "Manajemen Perangkat",
        "managed_service1_desc": "Manajemen siklus hidup lengkap semua perangkat pengguna termasuk laptop, desktop, dan perangkat mobile.",
        "managed_service2_title": "Dukungan Teknis 24/7",
        "managed_service2_desc": "Dukungan ahli sepanjang waktu dengan waktu respons cepat untuk menyelesaikan masalah dengan cepat.",
        "managed_service3_title": "Monitoring Sistem",
        "managed_service3_desc": "Monitoring dan maintenance proaktif untuk memastikan performa optimal dan mencegah downtime.",
        "managed_service4_title": "Manajemen Aset",
        "managed_service4_desc": "Pelacakan dan manajemen komprehensif aset TI dan konfigurasi sistem yang terstruktur dan efisien.",
        "managed_service5_title": "Dukungan On-Site",
        "managed_service5_desc": "Dukungan teknis on-site khusus untuk respons langsung dan bantuan langsung.",
        "managed_service6_title": "Manajemen Keamanan",
        "managed_service6_desc": "Layanan keamanan komprehensif untuk melindungi infrastruktur Anda dari ancaman.",
        "get_managed_services": "Dapatkan Layanan Terkelola",

        "business_title": "Bisnis & Kapabilitas",
        "company_overview_title": "Gambaran Perusahaan",
        "company_overview_desc": "PRIMA TEKNOLOGI INOVASI adalah perusahaan teknologi yang berpikiran maju yang berdedikasi untuk menyediakan solusi TI inovatif dan terintegrasi yang memberdayakan bisnis untuk berkembang di era digital. Didorong oleh pertumbuhan konsisten klien, proyek, dan kehadiran pasar, kami terus memperluas keahlian di berbagai industri. Didukung oleh tim profesional dan mitra strategis, kami berkomitmen untuk menyediakan solusi bernilai, menjalin kolaborasi jangka panjang, dan mencapai pertumbuhan bisnis yang berkelanjutan melalui keunggulan teknologi.",
        "our_business_plan": "Rencana Bisnis Kami",
        
        "business_plan_title": "Rencana Bisnis",
        "business_plan1_title": "Inovasi Produk",
        "business_plan1_desc": "Terus berinvestasi dalam R&D untuk menghadirkan produk digital yang inovatif, terintegrasi, dan siap masa depan.",
        "business_plan2_title": "Ekspansi Pasar Digital",
        "business_plan2_desc": "Memperluas layanan dan menjangkau industri baru dengan menawarkan solusi teknologi yang disesuaikan.",
        "business_plan3_title": "Kemitraan Strategis Teknologi",
        "business_plan3_desc": "Membangun aliansi dengan penyedia teknologi dan mitra bisnis untuk meningkatkan kemampuan layanan.",
        "business_plan4_title": "Pertumbuhan Berkelanjutan",
        "business_plan4_desc": "Fokus pada profitabilitas jangka panjang dengan menyeimbangkan kinerja dengan inovasi dan efisiensi.",
        
        "marketing_strategy_title": "Strategi Pemasaran",
        "marketing_strategy1_title": "Poin Strategis",
        "marketing_strategy1_desc": "Memposisikan PRIMA TEKNOLOGI INOVASU sebagai mitra teknologi yang andal dan inovatif melalui solusi bernilai.",
        "marketing_strategy2_title": "Kesadaran Merek",
        "marketing_strategy2_desc": "Meningkatkan visibilitas melalui pemasaran digital, keterlibatan sosial yang luas, dan jaringan strategis.",
        "marketing_strategy3_title": "Pendekatan Berpusat pada Klien",
        "marketing_strategy3_desc": "Menghadirkan solusi yang disesuaikan dengan komunikasi transparan dan dukungan responsif.",
        "marketing_strategy4_title": "Kemitraan Strategis Terpadu",
        "marketing_strategy4_desc": "Memperluas jangkauan pasar melalui aliansi dengan pemimpin industri untuk solusi komprehensif.",
        
        "management_team_title": "Tim Manajemen",
        "certified_professionals_title": "Profesional Bersertifikat",
        "business_partners_title": "Mitra Bisnis Resmi",

        "testimonials_title": "Apa Kata Klien Kami",
        "testimonial1_text": "\"PRIMA TEKNOLOGI INOVASI mentransformasi infrastruktur TI kami dengan efisiensi dan profesionalisme. Tim mereka memberikan hasil melebihi ekspektasi kami.\"",
        "testimonial1_name": "John Doe",
        "testimonial1_position": "CTO, Tech Solutions Inc.",
        "testimonial2_text": "\"Solusi IoT yang diimplementasikan oleh PRIMA telah meningkatkan efisiensi operasional kami secara signifikan. Keahlian mereka benar-benar luar biasa.\"",
        "testimonial2_name": "Anna Smith", 
        "testimonial2_position": "Direktur Operasi, Smart Industries",
        "testimonial3_text": "\"Bekerja dengan PRIMA adalah perubahan besar dalam perjalanan transformasi digital kami. Tim mereka berpengetahuan, responsif, dan berorientasi hasil.\"",
        "testimonial3_name": "Michael Johnson",
        "testimonial3_position": "CEO, FutureTech Enterprises",

        "contact_title": "Mari Bekerja Sama",
        "contact_subtitle": "Kami siap menjadi mitra terpercaya Anda dalam membangun solusi yang lebih cerdas dan terhubung.",
        "contact_address": "Daerah Khusus Ibu Kota Jakarta",
        "our_location": "Lokasi Kami", 
        "location_city": "Jakarta, Indonesia",
        "open_google_maps": "Buka di Google Maps",
        "get_directions": "Dapatkan Petunjuk Arah",
        "send_message_title": "Kirim Pesan kepada Kami",
        "contact_name": "Nama Lengkap",
        "contact_name_placeholder": "John Doe",
        "contact_email": "Email Aktif",
        "contact_email_placeholder": "email@perusahaan.com", 
        "contact_message": "Pesan / Pertanyaan Bisnis",
        "contact_message_placeholder": "Saya tertarik dengan solusi Layanan Terkelola Anda...",
        "send_message": "Kirim Pesan",
        "fast_response": "Respon Cepat",
        "fast_response_desc": "Kami akan merespons pesan Anda dalam 1-2 jam kerja.",
        "contact_directly": "Atau hubungi kami langsung:",
        "telephone": "Telepon",

        "footer_description": "Menginovasi masa depan melalui solusi teknologi mutakhir.",
        "quick_links": "Tautan Cepat", 
        "footer_services": "Layanan",
        "connect_with_us": "Terhubung dengan Kami",
        "all_rights_reserved": "All rights reserved."
    },
    en: {
        "nav_home": "Home",
        "nav_about": "About Us",
        "nav_services": "Services",
        "nav_business": "Business & Capabilities",
        "nav_contact": "Contact",
        "nav_company_profile": "Company Profile",
        "nav_brand_promise": "Brand Promise",
        "nav_vision_mission": "Vision & Mission",
        "nav_our_goals": "Our Goals",
        "nav_it_infrastructure": "IT Infrastructure",
        "nav_iot_solutions": "IoT Solutions",
        "nav_smart_building": "Smart Building & City",
        "nav_managed_services": "Managed Services",
        "nav_company_overview": "Company Overview",
        "nav_business_plan": "Business Plan",
        "nav_marketing_strategy": "Marketing Strategy",
        "nav_management_team": "Management Team",
        "nav_certified_professionals": "Certified Professionals",
        "nav_business_partners": "Business Partners",

        "hero_title": "Innovating the Future",
        "hero_subtitle": "Empowering Your Business Through Innovative Technology",
        "hero_description": "PRIMA TEKNOLOGI INOVASI is your trusted partner in delivering innovative technologies that drive business transformation toward a digital future. We are dedicated to providing integrated IoT, IT infrastructure, and technology solutions that are effective and result-oriented, empowering your company to achieve a sustainable competitive advantage in the digital era.",
        "discover_solutions": "Discover Our Solutions",

        "stats_projects": "Projects Completed",
        "stats_experience": "Years Experience",
        "stats_professionals": "Certified Professionals",
        "stats_satisfaction": "Client Satisfaction",

        "about_title": "About Us",
        "about_profile": "PRIMA TEKNOLOGI INOVASI believes that technology is the foundation of modern business growth. With a vision to empower organizations in the digital era, we deliver innovative, reliable, and integrated IoT, IT Infrastructure, and Technology Solutions tailored to each client's needs. Built on professionalism, integrity, and continuous innovation, we are your trusted partner in driving digital transformation and long-term success.",
        "brand_promise": "Brand Promise",
        "brand_professionalism": "Professionalism",
        "brand_professionalism_desc": "Uphold strong work ethics and deliver exceptional service quality in every project.",
        "brand_reliability": "Reliability",
        "brand_reliability_desc": "Consistency and trust are the foundation of our long-term client relationships.",
        "brand_innovation": "Innovation",
        "brand_innovation_desc": "Transform ideas into powerful digital solutions that shape the future together.",
        "brand_modernization": "Modernization",
        "brand_modernization_desc": "Stay ahead by embracing technology and continuous improvement.",
        "brand_agility": "Agility",
        "brand_agility_desc": "Adapt quickly to change and drive progress through flexible, effective solutions.",
        
        "vision_title": "Our Vision",
        "vision_quote": "\"To become a leading technology partner that drives sustainable business growth through innovation, integration, and digital transformation in IoT and IT Solutions.\"",
        "vision_point1_title": "Building Digital Excellence",
        "vision_point1_desc": "We are committed to creating digital excellence that evolves with global innovation, helping businesses remain agile, competitive, and future-ready.",
        "vision_point2_title": "Driving Integrated Tech Ecosystem Growth",
        "vision_point2_desc": "We strive to drive a connected and sustainable technology ecosystem that supports innovation and digital advancement across industries.",
        "vision_point3_title": "Inspiring Digital Sustainability",
        "vision_point3_desc": "We encourage organizations to adopt smart, efficient, and sustainable digital transformation for long-term growth.",
        
        "mission_title": "Our Mission",
        "mission_quote": "\"To deliver innovative, integrated, and value-driven technology solutions that help clients achieve efficiency, security, and sustainable growth for long-term success.\"",
        "mission_point1_title": "Driving Digital Transformation",
        "mission_point1_desc": "We empower organizations to adopt digital innovation through tailored strategies that boost efficiency, productivity, and sustainable growth across all industries.",
        "mission_point2_title": "Enhancing Capability",
        "mission_point2_desc": "We build a culture of learning and teamwork, enabling individuals and organizations to grow and achieve excellence together.",
        "mission_point3_title": "Delivering Excellence",
        "mission_point3_desc": "We maintain global standards of quality and security, delivering trusted solutions through transparent and result-driven operations.",
        
        "goals_title": "Our Goals",
        "goal1_title": "Deliver High Impact Solutions",
        "goal1_desc": "Provide innovative and result-oriented technology solutions that create measurable value for clients.",
        "goal2_title": "Strengthen Meaningful Partnerships",
        "goal2_desc": "Build sustainable, long-term collaborations based on trust, integrity, and mutual growth.",
        "goal3_title": "Drive Digital Transformation",
        "goal3_desc": "Support businesses in adapting to emerging technologies and achieving advantage in the digital era.",
        "explore_services": "Explore how our Product & Services can help your business grow smarter and faster.",

        "services_title": "Services & Solutions",
        "it_infrastructure_title": "IT Infrastructure & Solutions",
        "it_intro": "\"The IT products we present are not just technology, but solutions that comprehensively address the business needs of customers.\"",
        "it_point1": "Efficiency, security, reliability",
        "it_point2": "Flexibility, and long-term strategic value.",
        "iot_title": "Internet of Things (IoT)",
        "iot_intro": "\"The Internet of Things (IoT) is not just devices that are interconnected, but a smart ecosystem that transforms data into real value for businesses.\"",
        "iot_point1": "Real-time monitoring, predictive maintenance",
        "iot_point2": "Security, data-driven insight, competitive advantage.",

        "services_title": "Services & Solutions",
        "it_infrastructure_title": "IT Infrastructure & Solutions",
        "it_intro": "\"The IT products we present are not just technology, but solutions that comprehensively address the business needs of customers.\"",
        "it_point1": "Efficiency, security, reliability",
        "it_point2": "Flexibility, and long-term strategic value.",
        "iot_title": "Internet of Things (IoT)",
        "iot_intro": "\"The Internet of Things (IoT) is not just devices that are interconnected, but a smart ecosystem that transforms data into real value for businesses.\"",
        "iot_point1": "Real-time monitoring, predictive maintenance",
        "iot_point2": "Security, data-driven insight, competitive advantage.",

        "products_solutions_title": "Products & Solutions",
        "server_storage_title": "Server & Storage System",
        "server_storage_desc1": "Providing physical and virtual server solutions for data processing.",
        "server_storage_desc2": "Products include server racks, blade servers, and NAS/SAN storage systems.",
        "server_storage_desc3": "Ensure data availability, high performance, and storage security.",
        
        "network_infrastructure_title": "Network Infrastructure",
        "network_infrastructure_desc1": "Building reliable & secure data communication networks.",
        "network_infrastructure_desc2": "Products include switches, high-speed routers, firewalls, and access points.",
        "network_infrastructure_desc3": "LAN and fiber optic installations with efficient topology management.",
        
        "data_center_title": "Data Center Solution",
        "data_center_desc1": "Complete solutions for building server rooms or data centers.",
        "data_center_desc2": "Products include power systems, cooling, rack systems, UPS, and monitoring.",
        "data_center_desc3": "Focus on energy efficiency, safety, and operational continuity.",
        
        "enterprise_network_title": "Enterprise Network Solution",
        "enterprise_network_desc1": "SD-WAN benefits for improving network performance and cost efficiency.",
        "enterprise_network_desc2": "Comprehensive solutions including SD-WAN, enterprise-grade wireless, and NAC.",
        "enterprise_network_desc3": "Focus on enhancing operational efficiency and strengthening network security.",
        
        "seat_management_title": "Seat Management Solutions",
        "seat_management_desc1": "Managing user devices (laptops, PCs, printers, etc.) from installation to maintenance.",
        "seat_management_desc2": "Proactive monitoring and maintenance for system reliability and performance.",
        "seat_management_desc3": "Ensuring seamless scalability and comprehensive network access security across systems.",
        
        "software_solutions_title": "Software Solutions",
        "software_solutions_desc1": "Helping organizations obtain official, compliant software licenses.",
        "software_solutions_desc2": "Supporting leading global vendors (Microsoft, Adobe, Cisco, etc.).",
        "software_solutions_desc3": "Structured implementation aligned with global industry best practices.",

        "iot_solutions_title": "IoT Solutions",
        "iot_solutions_desc": "Comprehensive Internet of Things solutions that connect devices, collect data, and provide actionable insights for smarter decision-making.",
        "iot_connectivity_title": "IoT Connectivity",
        "iot_connectivity_desc": "Seamless connectivity solutions for IoT devices with reliable network infrastructure.",
        "iot_analytics_title": "Data Analytics",
        "iot_analytics_desc": "Advanced analytics platform for processing and deriving insights from IoT data.",
        "iot_security_title": "IoT Security",
        "iot_security_desc": "Comprehensive security solutions to protect IoT ecosystems from threats.",

        "smart_building_title": "Smart Building & City Solutions",
        "smart_building_desc": "Realizing an intelligent, energy-efficient, and secure building environment through the integration of Internet of Things (IoT)-based systems.",
        "smart_building1_title": "IoT System Integration",
        "smart_building1_desc": "Integrating IoT systems to create smart, efficient, and secure buildings.",
        "smart_building2_title": "Energy & Control Automation",
        "smart_building2_desc": "Automating AC, lighting, and electrical systems for better energy efficiency.",
        "smart_building3_title": "Early Warning Systems",
        "smart_building3_desc": "Detecting smoke, heat, and fire early with integrated alarms and sprinklers.",
        "smart_building4_title": "Automated Communication",
        "smart_building4_desc": "Providing automated audio and announcements for effective communication.",
        "smart_building5_title": "Advanced Security Monitoring",
        "smart_building5_desc": "Enhancing building security with IP cameras, motion sensors, and real-time monitoring.",
        "smart_building6_title": "Digital Access Management",
        "smart_building6_desc": "Managing access with automated doors, smart ID cards, and digital visitor systems.",

        "managed_services_title": "Managed Services",
        "managed_services_desc": "Comprehensive IT management solutions to ensure your systems run smoothly, securely, and efficiently 24/7.",
        "managed_service1_title": "Device Management",
        "managed_service1_desc": "Complete lifecycle management of all user devices including laptops, desktops, and mobile devices.",
        "managed_service2_title": "24/7 Technical Support",
        "managed_service2_desc": "Round-the-clock expert support with rapid response times to resolve issues quickly.",
        "managed_service3_title": "System Monitoring",
        "managed_service3_desc": "Proactive monitoring and maintenance to ensure optimal performance and prevent downtime.",
        "managed_service4_title": "Asset Management",
        "managed_service4_desc": "Comprehensive tracking and management of IT assets and system configurations.",
        "managed_service5_title": "On-Site Support",
        "managed_service5_desc": "Dedicated on-site technical support for immediate response and hands-on assistance.",
        "managed_service6_title": "Security Management",
        "managed_service6_desc": "Comprehensive security services to protect your infrastructure from threats.",
        "get_managed_services": "Get Managed Services",

        "business_title": "Business & Capabilities",
        "company_overview_title": "Company Overview", 
        "company_overview_desc": "PRIMA TEKNOLOGI INOVASI is a forward-thinking technology company dedicated to delivering innovative and integrated IT solutions that empower businesses to thrive in the digital era. Driven by consistent growth in clients, projects, and market presence, we continuously expand our expertise across diverse industries. Backed by a professional team and strategic partnerships, we are committed to providing value-driven solutions, fostering long-term collaborations, and achieving sustainable business growth through technology excellence.",
        "our_business_plan": "Our Business Plan",
        
        "business_plan_title": "Business Plan",
        "business_plan1_title": "Product Innovation",
        "business_plan1_desc": "Continuously invest in R&D to deliver innovative, integrated, and future-ready digital products.",
        "business_plan2_title": "Digital Market Expansion", 
        "business_plan2_desc": "Expand services and reach new industries by offering customized and scalable technology solutions.",
        "business_plan3_title": "Tech Strategic Partnerships",
        "business_plan3_desc": "Build alliances with technology providers and business partners to enhance service capabilities.",
        "business_plan4_title": "Sustainable Growth",
        "business_plan4_desc": "Focus on long-term profitability by balancing performance with innovation and efficiency.",
        
        "marketing_strategy_title": "Marketing Strategy",
        "marketing_strategy1_title": "Strategic Point",
        "marketing_strategy1_desc": "Positioning PRIMA T.I. as a reliable and innovative technology partner through value-driven solutions.",
        "marketing_strategy2_title": "Brand Awareness",
        "marketing_strategy2_desc": "Enhancing visibility through digital marketing, social engagement, and strategic networking.",
        "marketing_strategy3_title": "Client-Centric Approach", 
        "marketing_strategy3_desc": "Delivering tailored solutions with transparent communication and responsive support.",
        "marketing_strategy4_title": "Strategic Partnerships",
        "marketing_strategy4_desc": "Expanding market reach through alliances with industry leaders for comprehensive solutions.",
        
        "management_team_title": "Management Team",
        "certified_professionals_title": "Certified Professionals", 
        "business_partners_title": "Official Business Partners",

        "testimonials_title": "What Our Clients Say",
        "testimonial1_text": "\"PRIMA TEKNOLOGI INOVASI transformed our IT infrastructure with efficiency and professionalism. Their team delivered beyond our expectations.\"",
        "testimonial1_name": "John Doe",
        "testimonial1_position": "CTO, Tech Solutions Inc.",
        "testimonial2_text": "\"The IoT solutions implemented by PRIMA have significantly improved our operational efficiency. Their expertise is truly remarkable for sure.\"", 
        "testimonial2_name": "Anna Smith",
        "testimonial2_position": "Operations Director, Smart Industries",
        "testimonial3_text": "\"Working with PRIMA was a game-changer for our digital transformation journey. Their team is knowledgeable, responsive, and results-driven.\"",
        "testimonial3_name": "Michael Johnson",
        "testimonial3_position": "CEO, FutureTech Enterprises",

        "contact_title": "Let's Work Together",
        "contact_subtitle": "We're ready to be your trusted partner in building smarter, connected solutions.",
        "contact_address": "Daerah Khusus Ibu Kota Jakarta",
        "our_location": "Our Location",
        "location_city": "Jakarta, Indonesia", 
        "open_google_maps": "Open in Google Maps",
        "get_directions": "Get Directions",
        "send_message_title": "Send Us a Message",
        "contact_name": "Full Name",
        "contact_name_placeholder": "John Doe",
        "contact_email": "Active Email",
        "contact_email_placeholder": "email@company.com",
        "contact_message": "Message / Business Inquiry", 
        "contact_message_placeholder": "I'm interested in your Managed Services solutions...",
        "send_message": "Send Message",
        "fast_response": "Fast Response",
        "fast_response_desc": "We will respond to your message within 1–2 business hours.",
        "contact_directly": "Or contact us directly:",
        "telephone": "Telephone",

        "footer_description": "Innovating the future through cutting-edge technology solutions.",
        "quick_links": "Quick Links",
        "footer_services": "Services", 
        "connect_with_us": "Connect With Us",
        "all_rights_reserved": "All rights reserved."
    }
};

function applyTranslations(lang) {
    if (!lang || !translations[lang]) return;
    document.querySelectorAll('[data-i18n-key]').forEach(el => {
        const key = el.getAttribute('data-i18n-key');
        if (!key) return;
        const txt = translations[lang][key];
        if (typeof txt === 'undefined') return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = txt;
        } else {
            el.textContent = txt;
        }
    });

    try { document.documentElement.lang = lang === 'id' ? 'id' : 'en'; } catch (e) {}
    const btnId = document.getElementById('lang-id');
    const btnEn = document.getElementById('lang-en');
    if (btnId && btnEn) {
        if (lang === 'id') {
            btnId.classList.add('font-semibold'); btnEn.classList.remove('font-semibold');
        } else {
            btnEn.classList.add('font-semibold'); btnId.classList.remove('font-semibold');
        }
    }

    try { localStorage.setItem('site_lang', lang); } catch (e) {}
}

function initI18n() {
    let lang = 'id';
    try {
        lang = localStorage.getItem('site_lang') || document.documentElement.lang || (navigator.language && navigator.language.startsWith('en') ? 'en' : 'id');
        if (!translations[lang]) lang = 'id';
    } catch (e) {
        lang = 'id';
    }

    applyTranslations(lang);

    const btnId = document.getElementById('lang-id');
    const btnEn = document.getElementById('lang-en');
    if (btnId) btnId.addEventListener('click', () => applyTranslations('id'));
    if (btnEn) btnEn.addEventListener('click', () => applyTranslations('en'));
}