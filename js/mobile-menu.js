/**
 * Funcionalidad del menú móvil hamburguesa
 * Maneja la apertura, cierre y navegación del menú en dispositivos móviles
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    // Verificar que los elementos existen
    if (!menuToggle || !menu || !menuOverlay) {
        return;
    }
    
    // Estado del menú
    let isMenuOpen = false;
    
    /**
     * Abre el menú móvil
     */
    function openMenu() {
        isMenuOpen = true;
        menuToggle.classList.add('active');
        menu.classList.add('active');
        
        // Accesibilidad
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    }
    
    /**
     * Cierra el menú móvil
     */
    function closeMenu() {
        isMenuOpen = false;
        menuToggle.classList.remove('active');
        menu.classList.remove('active');
        
        // Accesibilidad
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    }
    
    /**
     * Alterna el estado del menú
     */
    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // Event listeners
    
    // Click en el botón hamburguesa
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // Overlay removido - funcionalidad deshabilitada
    
    // Tecla Escape para cerrar el menú
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Cerrar menú al redimensionar la ventana (si se cambia a desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Obtener enlaces del menú
    const menuLinks = document.querySelectorAll('#menu a');
    
    // Navegación suave para enlaces internos (sin cerrar menú)
    menuLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        
        // Solo aplicar scroll suave a enlaces internos (que empiecen con #)
        if (href && href.startsWith('#') && href !== '#') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Scroll suave al elemento
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // NO cerrar menú automáticamente
                }
            });
        }
    });
    
    // Mejorar la experiencia táctil en dispositivos móviles
    if ('ontouchstart' in window) {
        // Agregar clase para dispositivos táctiles
        document.body.classList.add('touch-device');
        
        // Mejorar el comportamiento del hover en dispositivos táctiles
        const hoverElements = document.querySelectorAll('.servicio-card, .cta-button');
        
        hoverElements.forEach(function(element) {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-hover');
            });
            
            element.addEventListener('touchend', function() {
                const self = this;
                setTimeout(function() {
                    self.classList.remove('touch-hover');
                }, 300);
            });
        });
    }
    
    // Optimización de rendimiento: throttle para eventos de scroll y resize
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
    
    // Aplicar throttle al evento resize
    const throttledResize = throttle(function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMenu();
        }
    }, 250);
    
    window.addEventListener('resize', throttledResize);
    
    // ===== FUNCIONALIDAD DE GALERÍA LIGHTBOX =====
    
    // Crear lightbox si no existe
    function createLightbox() {
        if (document.querySelector('.galeria-lightbox')) return;
        
        const lightbox = document.createElement('div');
        lightbox.className = 'galeria-lightbox';
        lightbox.innerHTML = `
            <button class="galeria-close" aria-label="Cerrar imagen">&times;</button>
            <img src="" alt="" class="galeria-lightbox-img">
        `;
        document.body.appendChild(lightbox);
        
        // Event listeners para el lightbox
        const closeBtn = lightbox.querySelector('.galeria-close');
        const lightboxImg = lightbox.querySelector('.galeria-lightbox-img');
        
        // Cerrar lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            lightboxImg.src = '';
            lightboxImg.alt = '';
        }
        
        // Click en botón cerrar
        closeBtn.addEventListener('click', closeLightbox);
        
        // Click en overlay
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
        
        return lightbox;
    }
    
    // Inicializar galería
    function initGallery() {
        const galleryImages = document.querySelectorAll('.galeria-columna img');
        
        if (galleryImages.length === 0) return;
        
        const lightbox = createLightbox();
        const lightboxImg = lightbox.querySelector('.galeria-lightbox-img');
        
        galleryImages.forEach(function(img) {
            img.addEventListener('click', function() {
                lightboxImg.src = this.src;
                lightboxImg.alt = this.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            
            // Mejorar accesibilidad
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            img.setAttribute('aria-label', 'Ver imagen en tamaño completo: ' + img.alt);
            
            // Soporte para teclado
            img.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // Lazy loading para imágenes
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('fade-in');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }
    
    // Inicializar funcionalidades de galería
    initGallery();
    initLazyLoading();
});
