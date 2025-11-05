// Gestion des animations au scroll
document.addEventListener('DOMContentLoaded', function() {
    // Animation des éléments au scroll
    const scrollAnimates = document.querySelectorAll('.scroll-animate, .reveal-on-scroll');
    
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;

        scrollAnimates.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }

    // Vérifier au chargement
    checkScroll();
    
    // Vérifier au scroll
    window.addEventListener('scroll', checkScroll);

    // Animation des cartes produits
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.classList.add('scroll-animate');
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Animation du footer
    const footer = document.querySelector('.site-footer');
    if (footer) {
        footer.classList.add('footer-gradient');
    }

    // Animation des boutons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.classList.add('hover-shadow', 'hover-color');
    });

    // Animation des images
    const productImages = document.querySelectorAll('.product-card img');
    productImages.forEach(img => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('hover-scale');
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
    });
});