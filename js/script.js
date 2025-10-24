/**
 * Inicialización de Librerías
 */
document.addEventListener('DOMContentLoaded', () => { // <-- Abre el listener DOMContentLoaded
    
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 1000, 
        easing: 'ease-in-out', 
        once: true, 
        mirror: false 
    });

    // Inicializar PureCounter (para estadísticas)
    new PureCounter();

    // --- CÓDIGO PARA INICIALIZAR ISOTOPE Y GLIGHTBOX EN MODAL EDUCACIÓN ---
    const educationModal = document.getElementById('modalEducacion');
    let isotopeInstance = null; 
    let lightboxInstance = null; 

    if (educationModal) {
        educationModal.addEventListener('shown.bs.modal', event => {
            const isoContainer = educationModal.querySelector('.isotope-container');
            
            if (isotopeInstance) {
                try { isotopeInstance.destroy(); } catch (e) { console.error("Error destroying Isotope:", e); }
                isotopeInstance = null;
            }

            if (isoContainer) {
                 setTimeout(() => {
                    try {
                        isotopeInstance = new Isotope(isoContainer, {
                            itemSelector: '.isotope-item',
                            layoutMode: 'fitRows', 
                            percentPosition: true 
                        });
                        isotopeInstance.layout(); 

                        const filters = educationModal.querySelectorAll('.isotope-filters li');
                        filters.forEach(filter => {
                            if (!filter.dataset.isotopeListenerAttached) { 
                                filter.addEventListener('click', function() {
                                    filters.forEach(el => el.classList.remove('filter-active'));
                                    this.classList.add('filter-active');
                                    if(isotopeInstance) {
                                        isotopeInstance.arrange({ filter: this.getAttribute('data-filter') });
                                        setTimeout(() => { if(isotopeInstance) isotopeInstance.layout(); }, 50); 
                                    }
                                });
                                filter.dataset.isotopeListenerAttached = 'true';
                            }
                        });
                    } catch (e) { console.error("Error initializing Isotope:", e); }
                }, 150); 
            }

            if (!lightboxInstance) { 
                try { lightboxInstance = GLightbox({ selector: '.glightbox' }); } catch (e) { console.error("Error initializing GLightbox:", e); }
            } else {
                 try { lightboxInstance.reload(); } catch(e) { console.error("Error reloading GLightbox:", e); }
            }
        });

        educationModal.addEventListener('hidden.bs.modal', event => {
             const filters = educationModal.querySelectorAll('.isotope-filters li');
             filters.forEach(filter => { delete filter.dataset.isotopeListenerAttached; });
             // if (isotopeInstance) { isotopeInstance.destroy(); isotopeInstance = null; }
             // if (lightboxInstance) { lightboxInstance.destroy(); lightboxInstance = null; }
         });
    }
    // --- FIN CÓDIGO MODAL EDUCACIÓN ---

    // === CÓDIGO CORREGIDO: Cierre automático del Navbar móvil ===
    const navLinks = document.querySelectorAll('#navbarNav .nav-link, #navbarNav .dropdown-item');
    const menuToggle = document.getElementById('navbarNav'); 
    // Buscamos el BOTÓN que abre/cierra el menú
    const togglerButton = document.querySelector('.navbar-toggler'); 

    if (menuToggle && togglerButton) { // Aseguramos que ambos existan
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                // Solo cierra si el menú está desplegado (clase 'show')
                if (menuToggle.classList.contains('show')) {
                    // Simulamos un clic en el botón toggler para cerrar
                    togglerButton.click(); 
                }
            });
        });
    }
    // === FIN CÓDIGO CORREGIDO ===

}); // <-- Cierra el listener DOMContentLoaded