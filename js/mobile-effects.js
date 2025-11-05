/* Amélioration des animations et transitions pour mobile */
document.addEventListener('DOMContentLoaded', function() {
    // Optimisation des effets tactiles
    const addTouchEffect = (elements) => {
        elements.forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            el.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
    };

    // Appliquer les effets tactiles aux éléments interactifs
    addTouchEffect(document.querySelectorAll('.btn-primary, .btn-secondary, .product-card, .header-cart, .menu-icon'));

    // Animation fluide du menu mobile
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('overlay');
    const closeMenu = document.getElementById('close-menu');

    if (menuToggle && mobileMenu && overlay) {
        const toggleMenu = (show) => {
            if (show) {
                mobileMenu.style.transform = 'translateX(0)';
                mobileMenu.style.opacity = '1';
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto';
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenu.style.transform = 'translateX(-100%)';
                mobileMenu.style.opacity = '0';
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
                document.body.style.overflow = '';
            }
        };

        menuToggle.addEventListener('click', () => toggleMenu(true));
        closeMenu.addEventListener('click', () => toggleMenu(false));
        overlay.addEventListener('click', () => toggleMenu(false));
    }

    // Animation fluide pour la barre de progression de livraison gratuite
    const freeShippingBar = document.querySelector('.free-shipping-fill');
    if (freeShippingBar) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(freeShippingBar);
    }

    // Animations au scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.scroll-animate');
        elements.forEach(el => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        el.classList.add('visible');
                        observer.unobserve(el);
                    }
                },
                { threshold: 0.1 }
            );
            observer.observe(el);
        });
    };

    animateOnScroll();
});