/**
 * Inicialización de Librerías
 */
document.addEventListener('DOMContentLoaded', () => { // <-- Abre el listener DOMContentLoaded
    
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 1000, // Duración de la animación en ms
        easing: 'ease-in-out', // Tipo de "aceleración"
        once: true, // Si la animación debe ocurrir solo una vez
        mirror: false // Si debe animarse al salir de la vista
    });

    // Inicializar PureCounter (para estadísticas)
    new PureCounter();

    // --- CÓDIGO PARA INICIALIZAR ISOTOPE Y GLIGHTBOX EN MODAL EDUCACIÓN ---
    const educationModal = document.getElementById('modalEducacion');
    let isotopeInstance = null; // Variable para guardar la instancia de Isotope
    let lightboxInstance = null; // Variable para guardar la instancia de GLightbox

    if (educationModal) {
        educationModal.addEventListener('shown.bs.modal', event => {
            // Inicializar Isotope DENTRO del modal una vez que es visible
            const isoContainer = educationModal.querySelector('.isotope-container');
            if (isoContainer && !isotopeInstance) { // Solo inicializar una vez
                 isotopeInstance = new Isotope(isoContainer, {
                    itemSelector: '.isotope-item',
                    layoutMode: 'fitRows' // Usamos fitRows
                });

                // Añadir lógica para los filtros DENTRO del modal
                const filters = educationModal.querySelectorAll('.isotope-filters li');
                filters.forEach(filter => {
                    // Evita duplicar listeners si el modal se reabre rápido
                    if (!filter.dataset.isotopeListenerAttached) { 
                        filter.addEventListener('click', function() {
                            filters.forEach(el => el.classList.remove('filter-active'));
                            this.classList.add('filter-active');
                            if(isotopeInstance) {
                                isotopeInstance.arrange({
                                    filter: this.getAttribute('data-filter')
                                });
                                // Refrescar layout después de filtrar
                                setTimeout(() => { 
                                    if(isotopeInstance) isotopeInstance.layout(); 
                                }, 50); 
                            }
                        });
                        filter.dataset.isotopeListenerAttached = 'true';
                    }
                });
            } else if (isoContainer && isotopeInstance) {
                 // Si ya existe, solo refrescar layout
                 isotopeInstance.layout();
            }

            // Inicializar o recargar GLightbox DENTRO del modal
            if (!lightboxInstance) { 
                try {
                    lightboxInstance = GLightbox({ selector: '.glightbox' });
                } catch (e) { console.error("Error initializing GLightbox:", e); }
            } else {
                 try {
                     lightboxInstance.reload(); 
                 } catch(e) { console.error("Error reloading GLightbox:", e); }
            }
        });

        // Al ocultar, reseteamos listeners de filtros
        educationModal.addEventListener('hidden.bs.modal', event => {
             const filters = educationModal.querySelectorAll('.isotope-filters li');
             filters.forEach(filter => {
                 delete filter.dataset.isotopeListenerAttached; 
             });
             // Considera destruir instancias si hay problemas persistentes
             // if (isotopeInstance) { isotopeInstance.destroy(); isotopeInstance = null; }
             // if (lightboxInstance) { lightboxInstance.destroy(); lightboxInstance = null; }
         });
    }
    // --- FIN CÓDIGO MODAL EDUCACIÓN ---

    // === CÓDIGO AÑADIDO: Cierre automático del Navbar móvil ===
    const navLinks = document.querySelectorAll('#navbarNav .nav-link, #navbarNav .dropdown-item');
    const menuToggle = document.getElementById('navbarNav');
    // Verifica si el elemento existe antes de crear la instancia Collapse
    if (menuToggle) {
        const bsCollapse = new bootstrap.Collapse(menuToggle, {
          toggle: false // Evita que se abra/cierre al inicializar
        });
    
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                // Solo cierra si el menú está visible (pantalla pequeña) y expandido
                if (menuToggle.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }
    // === FIN CÓDIGO AÑADIDO ===

}); // <-- Cierra el listener DOMContentLoaded