// Smooth scroll per i link di navigazione
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

// Gestione del form di contatto
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const emailJsConfigured = ![EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID].some(v => v.startsWith('YOUR_'));

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Mostra loading nel pulsante
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Invio in corso...';
        submitBtn.disabled = true;

        // Se EmailJS non e' configurato, evita un errore e mostra un messaggio pulito.
        if (!emailJsConfigured || typeof emailjs === 'undefined') {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showModal('error', 'Contatto', 'Il form di contatto e\\' in aggiornamento. Per favore scrivi direttamente all\\'email indicata nella sezione Contatti.');
            return;
        }

        emailjs.init(EMAILJS_PUBLIC_KEY);

        // Raccogli i dati del form
        const formData = {
            from_name: this.querySelector('input[type="text"]').value,
            from_email: this.querySelector('input[type="email"]').value,
            message: this.querySelector('textarea').value,
            to_email: 'andrea46tarchiani@gmail.com'
        };

        // Invia l'email
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData)
            .then(function (response) {
                // Ripristina il pulsante
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Mostra modale di successo
                showModal('success', 'Messaggio Inviato!', 'Grazie per il vostro messaggio! Vi contatterò il prima possibile.');

                // Resetta il form
                contactForm.reset();
            }, function (error) {
                // Ripristina il pulsante
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Mostra modale di errore
                showModal('error', 'Errore nell\'Invio', 'Si è verificato un errore nell\'invio del messaggio. Si prega di riprovare più tardi o contattarmi direttamente via email.');

                console.error('EmailJS error:', error);
            });
    });
}

// Funzione per mostrare il modale
function showModal(type, title, message) {
    // Rimuovi modale esistente se presente
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Crea il modale
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header ${type}">
                <span class="close">&times;</span>
                <h2>${title}</h2>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="modal-btn">Chiudi</button>
            </div>
        </div>
    `;

    // Aggiungi il modale al body
    document.body.appendChild(modal);

    // Mostra il modale
    modal.style.display = 'block';

    // Gestisci la chiusura del modale
    const closeBtn = modal.querySelector('.close');
    const modalBtn = modal.querySelector('.modal-btn');

    function closeModal() {
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }

    closeBtn.onclick = closeModal;
    modalBtn.onclick = closeModal;

    // Chiudi il modale cliccando fuori
    modal.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };
}

// Aggiungi animazione di scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-in-out';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.video-item, .cv-section, .photo-item').forEach(el => {
    observer.observe(el);
});

// Highlight active navigation link
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

