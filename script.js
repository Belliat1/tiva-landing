// Tiva Landing Page - JavaScript for Microinteractions and Scroll Effects

// Global image error handler
function handleImageError(imgElement) {
    console.warn(`Failed to load image: ${imgElement.src}`);
    imgElement.style.display = 'none';
    const fallbackIcon = imgElement.nextElementSibling;
    if (fallbackIcon && fallbackIcon.classList.contains('fallback-icon')) {
        fallbackIcon.style.display = 'flex';
    }
}

// Image loading utility
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}

// Check if images exist
async function checkImageExists(src) {
    try {
        await preloadImage(src);
        return true;
    } catch (error) {
        console.warn(`Image not found: ${src}`);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(253, 253, 251, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(12, 22, 63, 0.1)';
            } else {
                navbar.style.background = 'rgba(253, 253, 251, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate chart bars
                if (entry.target.classList.contains('chart-bar')) {
                    const value = entry.target.getAttribute('data-value');
                    const bar = entry.target.querySelector('::before');
                    if (bar) {
                        entry.target.style.setProperty('--target-width', value + '%');
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.solution-card, .case-card, .chart-bar, .product-card-main');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Floating elements animation
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 2}s`;
    });
    
    // Parallax effect for hero section
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroVisual.style.transform = `translateY(${parallax}px)`;
        });
    }
    
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (target === 500 ? '+' : target === 5 ? ' días' : target === 0 ? '%' : '');
        }, 20);
    };
    
    // Observe stats for counter animation
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber) {
                    const text = statNumber.textContent;
                    if (text.includes('500+')) {
                        animateCounter(statNumber, 500);
                    } else if (text.includes('5 días')) {
                        animateCounter(statNumber, 5);
                    } else if (text.includes('0%')) {
                        animateCounter(statNumber, 0);
                    }
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelectorAll('.hero-stats .stat');
    heroStats.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.solution-card, .case-card, .product-card-main');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // WhatsApp button pulse effect
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    whatsappButtons.forEach(button => {
        setInterval(() => {
            button.style.transform = 'scale(1.05)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    });
    
    // Loading animation for page
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    });
    
    // Form validation (if forms are added later)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form submission logic here
        });
    });
    
    // Scroll to top functionality
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTop.className = 'scroll-to-top';
    scrollToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--lime-green);
        color: var(--primary-blue);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        box-shadow: 0 4px 20px rgba(12, 22, 63, 0.2);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTop);
    
    scrollToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTop.style.opacity = '1';
            scrollToTop.style.visibility = 'visible';
        } else {
            scrollToTop.style.opacity = '0';
            scrollToTop.style.visibility = 'hidden';
        }
    });
    
    // Add CSS for scroll to top button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 30px rgba(12, 22, 63, 0.3) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // All scroll-based animations go here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Enhanced image loading with error handling
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // Handle successful load
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            console.log(`✅ Image loaded successfully: ${this.src}`);
            
            // Special check for Tiva logo
            if (this.src.includes('Logo_Tiva_Web_Simple')) {
                console.log('🎯 Logo de Tiva (PNG) cargado correctamente!');
                console.log('🔍 Verificando visibilidad del logo...');
                console.log(`   Opacity: ${this.style.opacity}`);
                console.log(`   Display: ${this.style.display}`);
                console.log(`   Visibility: ${this.style.visibility}`);
            }
        });
        
        // Handle load error
        img.addEventListener('error', function() {
            console.error(`❌ Failed to load image: ${this.src}`);
            
            // Special error handling for Tiva logo
            if (this.src.includes('Logo_Tiva_Web_Simple')) {
                console.error('🚨 ERROR CRÍTICO: Logo de Tiva no se pudo cargar!');
                console.error('   Verifica que el archivo existe: img/Logo_Tiva_Web_Simple.png');
            }
            
            handleImageError(this);
        });
    });
    
    // Special handling for Tiva logo - force visibility
    setTimeout(() => {
        const tivaLogos = document.querySelectorAll('img[src*="Logo_Tiva_Web_Simple"]');
        tivaLogos.forEach(logo => {
            console.log('🔧 Forzando visibilidad del logo de Tiva...');
            logo.style.opacity = '1';
            logo.style.display = 'block';
            logo.style.visibility = 'visible';
            console.log('✅ Logo de Tiva forzado a ser visible');
        });
    }, 1000);
    
    // Verify critical images exist
    const criticalImages = [
        './img/Logo_Tiva_Web_Simple.png',
        './img/Logo_Fondo_Blanco-removebg-preview.png',
        './img/logo_publiandes.png'
    ];
    
    console.log('🔍 Verificando imágenes críticas...');
    criticalImages.forEach(async (src) => {
        const exists = await checkImageExists(src);
        if (exists) {
            console.log(`✅ Imagen encontrada: ${src}`);
            if (src.includes('Logo_Tiva_Web_Simple')) {
                console.log('🎯 Logo de Tiva verificado correctamente!');
            }
        } else {
            console.error(`❌ Imagen NO encontrada: ${src}`);
            console.error(`   Ruta completa: ${window.location.origin}/${src}`);
            if (src.includes('Logo_Tiva_Web_Simple')) {
                console.error('🚨 PROBLEMA CRÍTICO: Logo de Tiva no encontrado!');
                console.error('   Verifica que el archivo existe en: img/Logo_Tiva_Web_Simple.png');
            }
        }
    });
    
    // Debug: Mostrar información del entorno
    console.log('🌐 Información del entorno:');
    console.log(`   Protocolo: ${window.location.protocol}`);
    console.log(`   Host: ${window.location.host}`);
    console.log(`   Pathname: ${window.location.pathname}`);
    console.log(`   URL completa: ${window.location.href}`);
    
    // Website Preview iframe functionality
    const iframes = document.querySelectorAll('iframe[src*="anamariagelatinas"], iframe[src*="inglesplus"]');
    iframes.forEach(iframe => {
        // Add loading state
        iframe.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transition = 'opacity 0.3s ease';
        });
        
        // Initial loading state
        iframe.style.opacity = '0';
        
        // Add hover effect to make it interactive
        const frameContent = iframe.closest('.frame-content');
        if (frameContent) {
            frameContent.addEventListener('mouseenter', function() {
                this.style.cursor = 'pointer';
            });
            
            frameContent.addEventListener('click', function() {
                const link = iframe.closest('.website-frame').querySelector('.frame-footer a');
                if (link) {
                    link.click();
                }
            });
        }
    });
    
    // Lead Capture Modal Functions
    window.openDemoForm = function(context = 'general') {
        const modal = document.getElementById('demo-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Pre-fill form based on context
            const interesSelect = document.getElementById('interes');
            if (interesSelect) {
                switch(context) {
                    case 'emprendedor':
                        interesSelect.value = 'tienda-whatsapp';
                        break;
                    case 'fotos':
                        interesSelect.value = 'fotos-ia';
                        break;
                    case 'apps':
                        interesSelect.value = 'apps';
                        break;
                    case 'empresarial':
                        interesSelect.value = 'ia-empresarial';
                        break;
                    case 'final':
                        interesSelect.value = 'tienda-whatsapp';
                        break;
                }
            }
            
            // Track modal open
            console.log(`📊 Modal opened from context: ${context}`);
        }
    };
    
    window.closeDemoForm = function() {
        const modal = document.getElementById('demo-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };
    
    // Form submission handler
    const demoForm = document.getElementById('demo-form');
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            if (!data.nombre || !data.email || !data.tipo_negocio || !data.interes || !data.consentimiento) {
                alert('Por favor completa todos los campos obligatorios.');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Success message
                alert('¡Perfecto! Nos pondremos en contacto contigo en las próximas 24 horas para agendar tu demo personalizado.');
                
                // Reset form
                this.reset();
                
                // Close modal
                closeDemoForm();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Track conversion
                console.log('🎉 Lead captured:', data);
                
                // Send to WhatsApp with context
                const whatsappMessage = `Hola! Me interesa ${data.interes} para mi ${data.tipo_negocio}. Mi presupuesto es ${data.presupuesto || 'por definir'}. Mi nombre es ${data.nombre} y mi email ${data.email}.`;
                const whatsappUrl = `https://wa.me/573012533436?text=${encodeURIComponent(whatsappMessage)}`;
                
                // Open WhatsApp after 2 seconds
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                }, 2000);
                
            }, 2000);
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('demo-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeDemoForm();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDemoForm();
        }
    });
    
    // Pricing Tabs Functionality
    window.switchTab = function(tabName) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked tab
        event.target.classList.add('active');
        
        // Hide all plans
        document.querySelectorAll('[id$="-plan"]').forEach(plan => {
            plan.style.display = 'none';
        });
        
        // Show selected plan
        const selectedPlan = document.getElementById(tabName + '-plan');
        if (selectedPlan) {
            selectedPlan.style.display = 'block';
        }
        
        // Track tab switch
        console.log(`📊 Switched to ${tabName} plan`);
    };
    
    // Console welcome message
    console.log('%c🚀 Tiva Landing Page', 'color: #A2D729; font-size: 20px; font-weight: bold;');
    console.log('%cTecnología simple para emprendedores. Infraestructura sólida para empresas.', 'color: #1E3A8A; font-size: 14px;');
    
    // Debug Tiva logo specifically
    setTimeout(() => {
        const tivaLogos = document.querySelectorAll('img[src*="Logo_Tiva_Web_Simple"]');
        console.log(`🔍 Encontrados ${tivaLogos.length} logos de Tiva`);
        tivaLogos.forEach((logo, index) => {
            console.log(`Logo ${index + 1}:`);
            console.log(`  - Src: ${logo.src}`);
            console.log(`  - Opacity: ${logo.style.opacity}`);
            console.log(`  - Display: ${logo.style.display}`);
            console.log(`  - Visibility: ${logo.style.visibility}`);
            console.log(`  - Computed opacity: ${window.getComputedStyle(logo).opacity}`);
            console.log(`  - Computed display: ${window.getComputedStyle(logo).display}`);
            console.log(`  - Computed visibility: ${window.getComputedStyle(logo).visibility}`);
        });
    }, 2000);
    
    // Photo comparison slider functionality
    const comparisonContainer = document.querySelector('.comparison-container');
    if (comparisonContainer) {
        const photoEnhanced = comparisonContainer.querySelector('.photo-enhanced');
        const slider = comparisonContainer.querySelector('.comparison-slider');
        const sliderHandle = comparisonContainer.querySelector('.slider-handle');
        
        // Debug images and force load
        const images = comparisonContainer.querySelectorAll('.comparison-img');
        images.forEach((img, index) => {
            console.log(`🖼️ Imagen ${index + 1}: ${img.src}`);
            
            // Force image visibility
            img.style.opacity = '1';
            img.style.visibility = 'visible';
            img.style.display = 'block';
            
            img.addEventListener('load', () => {
                console.log(`✅ Imagen ${index + 1} cargada correctamente`);
                img.style.opacity = '1';
                img.style.visibility = 'visible';
                img.style.display = 'block';
            });
            
            img.addEventListener('error', () => {
                console.log(`❌ Error cargando imagen ${index + 1}: ${img.src}`);
                // Show placeholder if image fails
                const placeholder = img.nextElementSibling;
                if (placeholder && placeholder.classList.contains('photo-placeholder')) {
                    placeholder.style.display = 'flex';
                    img.style.display = 'none';
                }
            });
            
            // Force reload if needed
            if (img.complete && img.naturalHeight === 0) {
                console.log(`🔄 Forzando recarga de imagen ${index + 1}`);
                const src = img.src;
                img.src = '';
                setTimeout(() => {
                    img.src = src + '?v=' + Date.now();
                }, 100);
            }
        });
        
        let isDragging = false;
        
        function updateSliderPosition(x) {
            const rect = comparisonContainer.getBoundingClientRect();
            const percentage = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
            
            photoEnhanced.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            slider.style.left = `${percentage}%`;
            
            // Mover el handle junto con la línea
            const handle = slider.querySelector('.slider-handle');
            if (handle) {
                handle.style.left = `${percentage}%`;
                handle.style.transform = 'translate(-50%, -50%)';
            }
        }
        
        function handleMouseMove(e) {
            if (isDragging) {
                updateSliderPosition(e.clientX);
            }
        }
        
        function handleMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        
        function handleMouseDown(e) {
            isDragging = true;
            updateSliderPosition(e.clientX);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        
        // Mouse events
        comparisonContainer.addEventListener('mousedown', handleMouseDown);
        
        // Touch events for mobile
        function handleTouchMove(e) {
            if (isDragging) {
                e.preventDefault();
                updateSliderPosition(e.touches[0].clientX);
            }
        }
        
        function handleTouchEnd() {
            isDragging = false;
            document.removeEventListener('touchmove', handleTouchMove, { passive: false });
            document.removeEventListener('touchend', handleTouchEnd);
        }
        
        function handleTouchStart(e) {
            isDragging = true;
            updateSliderPosition(e.touches[0].clientX);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        }
        
        comparisonContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
        
        // Force images to be visible after a delay
        setTimeout(() => {
            images.forEach((img, index) => {
                console.log(`🔧 Forzando visibilidad de imagen ${index + 1}`);
                img.style.opacity = '1';
                img.style.visibility = 'visible';
                img.style.display = 'block';
                
                // Check if image is actually loaded
                if (img.naturalWidth > 0) {
                    console.log(`✅ Imagen ${index + 1} tiene contenido`);
                } else {
                    console.log(`⚠️ Imagen ${index + 1} no tiene contenido, mostrando placeholder`);
                    const placeholder = img.nextElementSibling;
                    if (placeholder && placeholder.classList.contains('photo-placeholder')) {
                        placeholder.style.display = 'flex';
                        img.style.display = 'none';
                    }
                }
            });
        }, 1000);
        
        console.log('📸 Photo comparison slider initialized');
    }
});

// Utility functions
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

function throttle(func, limit) {
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

// Stores Directory Functions
function showStoresDirectory() {
    const modal = document.getElementById('stores-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeStoresModal() {
    const modal = document.getElementById('stores-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function toggleStorePreview(storeId) {
    const previewElement = document.getElementById(`${storeId}-preview`);
    const infoElement = document.getElementById(`${storeId}-info`);
    const button = event.target.closest('.btn-preview-toggle');
    
    if (previewElement.style.display === 'none') {
        // Mostrar preview
        previewElement.style.display = 'block';
        infoElement.style.display = 'none';
        button.innerHTML = '<i class="fas fa-times"></i> Cerrar Vista';
        button.classList.add('active');
        
        // Scroll suave al preview
        previewElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        // Ocultar preview
        previewElement.style.display = 'none';
        infoElement.style.display = 'block';
        button.innerHTML = '<i class="fas fa-eye"></i> Ver Tienda';
        button.classList.remove('active');
    }
}

function visitStore(storeId) {
    // Mapeo de IDs de tienda a URLs reales
    const storeUrls = {
        'anamaria-gelatinas': 'http://localhost:5175/catalog/anamaria-gelatinas',
        'techstore-colombia': 'http://localhost:5175/catalog/techstore-colombia',
        'hogar-deco': 'http://localhost:5175/catalog/hogar-deco',
        'belleza-natural': 'http://localhost:5175/catalog/belleza-natural',
        'sportmax': 'http://localhost:5175/catalog/sportmax',
        'fashion-store': 'http://localhost:5175/catalog/fashion-store'
    };
    
    const storeUrl = storeUrls[storeId] || `http://localhost:5175/catalog/${storeId}`;
    window.open(storeUrl, '_blank');
}

function filterStores() {
    const searchTerm = document.getElementById('store-search').value.toLowerCase();
    const storeCards = document.querySelectorAll('.store-card');
    
    storeCards.forEach(card => {
        const storeName = card.querySelector('h4').textContent.toLowerCase();
        const storeDescription = card.querySelector('.store-description').textContent.toLowerCase();
        
        if (storeName.includes(searchTerm) || storeDescription.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterByCategory(category) {
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const storeCards = document.querySelectorAll('.store-card');
    
    storeCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Cerrar modal al hacer click fuera de él
document.addEventListener('click', function(event) {
    const storesModal = document.getElementById('stores-modal');
    if (storesModal && event.target === storesModal) {
        closeStoresModal();
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeStoresModal();
    }
});

// Switch between pricing plans
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Hide all plan cards
    document.querySelectorAll('.product-card-main').forEach(card => {
        card.style.display = 'none';
    });
    
    // Show selected plan
    const selectedPlan = document.getElementById(`${tabName}-plan`);
    console.log('Selected plan element:', selectedPlan);
    
    if (selectedPlan) {
        selectedPlan.style.display = 'block';
        console.log('Plan displayed successfully');
    } else {
        console.error('Plan not found:', `${tabName}-plan`);
    }
}

// Pricing toggle functionality
function togglePricing() {
    const toggle = document.getElementById('pricing-toggle');
    const monthlyAmounts = document.querySelectorAll('.amount.monthly');
    const yearlyAmounts = document.querySelectorAll('.amount.yearly');
    const monthlyAnnualAmounts = document.querySelectorAll('.annual-amount.monthly');
    const yearlyAnnualAmounts = document.querySelectorAll('.annual-amount.yearly');
    const labels = document.querySelectorAll('.toggle-label');
    
    if (toggle.checked) {
        // Show yearly prices
        monthlyAmounts.forEach(amount => amount.style.display = 'none');
        yearlyAmounts.forEach(amount => amount.style.display = 'inline');
        monthlyAnnualAmounts.forEach(amount => amount.style.display = 'none');
        yearlyAnnualAmounts.forEach(amount => amount.style.display = 'inline');
        labels[0].classList.remove('active');
        labels[1].classList.add('active');
    } else {
        // Show monthly prices
        monthlyAmounts.forEach(amount => amount.style.display = 'inline');
        yearlyAmounts.forEach(amount => amount.style.display = 'none');
        monthlyAnnualAmounts.forEach(amount => amount.style.display = 'inline');
        yearlyAnnualAmounts.forEach(amount => amount.style.display = 'none');
        labels[0].classList.add('active');
        labels[1].classList.remove('active');
    }
}

// Initialize floating elements on page load
function initializeFloatingElements() {
    const floatingElements = document.querySelector('.floating-elements');
    if (floatingElements) {
        // Ensure floating elements are visible and in correct position
        floatingElements.style.opacity = '1';
        floatingElements.style.transform = 'scale(1) translateY(0)';
        floatingElements.style.transition = 'all 0.5s ease-out';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeFloatingElements();
});

// Mobile preview scroll behavior
let lastScrollY = window.scrollY;
let ticking = false;

function updateMobilePreview() {
    const dashboardMockup = document.querySelector('.dashboard-mockup');
    const heroSection = document.querySelector('.hero');
    const accessSection = document.querySelector('.access-section');
    const floatingElements = document.querySelector('.floating-elements');
    
    if (!dashboardMockup || !heroSection) return;
    
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const accessTop = accessSection ? accessSection.offsetTop : heroBottom + 200;
    const scrollY = window.scrollY;
    
    // Hide dashboard much earlier to prevent clipping
    if (scrollY > heroBottom - 400 || scrollY > accessTop - 600) {
        // Hide dashboard when scrolling past hero section
        dashboardMockup.style.opacity = '0';
        dashboardMockup.style.transform = 'scale(0.5) translateY(100px)';
        dashboardMockup.style.transition = 'all 0.5s ease-out';
        
        // Hide all floating elements
        if (floatingElements) {
            floatingElements.style.opacity = '0';
            floatingElements.style.transform = 'scale(0.8) translateY(50px)';
            floatingElements.style.transition = 'all 0.5s ease-out';
        }
    } else {
        // Show dashboard when in hero section
        dashboardMockup.style.opacity = '1';
        dashboardMockup.style.transform = 'scale(0.9) translateY(0)';
        dashboardMockup.style.transition = 'all 0.5s ease-out';
        
        // Show floating elements in their correct positions
        if (floatingElements) {
            floatingElements.style.opacity = '1';
            floatingElements.style.transform = 'scale(1) translateY(0)';
            floatingElements.style.transition = 'all 0.5s ease-out';
        }
    }
    
    lastScrollY = scrollY;
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateMobilePreview);
        ticking = true;
    }
}

// Add scroll listener for mobile preview
window.addEventListener('scroll', requestTick);
