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

// Gestione del form di contatto: apre una bozza email (mailto) con i campi compilati.
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Mostra loading nel pulsante
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Apro email...';
        submitBtn.disabled = true;

        const fromName = this.querySelector('input[name="from_name"]')?.value?.trim() || '';
        const fromEmail = this.querySelector('input[name="from_email"]')?.value?.trim() || '';
        const message = this.querySelector('textarea[name="message"]')?.value?.trim() || '';

        const toEmail = this.dataset.contactEmail
            || document.querySelector('.contact-email')?.textContent?.trim()
            || 'andrea46tarchiani@gmail.com';

        const subject = 'Contatto dal sito - Elisabetta Ricci';
        const bodyLines = [
            `Nome: ${fromName}`,
            `Email: ${fromEmail}`,
            '',
            'Messaggio:',
            message
        ];
        const body = bodyLines.join('\n');

        const mailto = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        showModal('success', 'Bozza email pronta', 'Si aprirà la tua app email con il messaggio precompilato. Premi Invia per completare.');
        setTimeout(() => {
            window.location.href = mailto;
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            contactForm.reset();
        }, 80);
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

