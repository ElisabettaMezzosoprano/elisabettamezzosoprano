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

let emailJsLoadPromise = null;
function loadEmailJs() {
    if (typeof emailjs !== 'undefined') {
        return Promise.resolve(emailjs);
    }
    if (emailJsLoadPromise) {
        return emailJsLoadPromise;
    }

    emailJsLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.async = true;
        script.onload = () => resolve(emailjs);
        script.onerror = () => reject(new Error('EmailJS load failed'));
        document.head.appendChild(script);
    });

    return emailJsLoadPromise;
}

if (contactForm) {
    const submitBtn = contactForm.querySelector('.submit-btn');

    function handleContactSubmit(e) {
        e.preventDefault();

        // Mostra loading nel pulsante
        const originalText = submitBtn ? submitBtn.textContent : 'Invia';
        submitBtn.textContent = 'Invio...';
        submitBtn.disabled = true;

        const fromName = contactForm.querySelector('input[name="from_name"]')?.value?.trim() || '';
        const fromEmail = contactForm.querySelector('input[name="from_email"]')?.value?.trim() || '';
        const message = contactForm.querySelector('textarea[name="message"]')?.value?.trim() || '';

        const toEmail = contactForm.dataset.contactEmail
            || document.querySelector('.contact-email')?.textContent?.trim()
            || 'andrea46tarchiani@gmail.com';

        const publicKey = (contactForm.dataset.emailjsPublicKey || '').trim();
        const serviceId = (contactForm.dataset.emailjsServiceId || '').trim();
        const templateId = (contactForm.dataset.emailjsTemplateId || '').trim();
        const emailJsConfigured = Boolean(publicKey && serviceId && templateId);

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

        if (!emailJsConfigured) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Try to open the email client immediately (user gesture), then show a fallback action.
            window.location.href = mailto;

            showModal(
                'success',
                'Bozza email pronta',
                'Si apre la tua app email con il messaggio precompilato. Il sito non può verificare l\\'invio: la conferma la vedi solo nell\\'app email. Se non si apre automaticamente, clicca "Apri email".',
                { primaryLabel: 'Apri email', primaryHref: mailto }
            );

            contactForm.reset();
            return;
        }

        loadEmailJs()
            .then((emailJs) => {
                emailJs.init(publicKey);
                return emailJs.send(serviceId, templateId, {
                    from_name: fromName,
                    from_email: fromEmail,
                    message,
                    to_email: toEmail
                });
            })
            .then(() => {
                showModal('success', 'Messaggio inviato', 'Grazie. Il messaggio è stato inviato con successo.');
                contactForm.reset();
            })
            .catch((err) => {
                console.error('Contact form send failed:', err);
                showModal(
                    'error',
                    'Invio non riuscito',
                    'Non è stato possibile inviare il messaggio dal sito. Puoi usare "Apri email" come alternativa.',
                    { primaryLabel: 'Apri email', primaryHref: mailto }
                );
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    }

    // Handle both clicking the button and pressing Enter in a field.
    contactForm.addEventListener('submit', handleContactSubmit);
    if (submitBtn) {
        submitBtn.addEventListener('click', handleContactSubmit);
    }
}

// Funzione per mostrare il modale
function showModal(type, title, message, options = {}) {
    // Rimuovi modale esistente se presente
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }

    const primaryLabel = options.primaryLabel || 'Chiudi';
    const primaryHref = options.primaryHref || '';

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
                <button class="modal-btn">${primaryLabel}</button>
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
    modalBtn.onclick = function () {
        if (primaryHref) {
            window.location.href = primaryHref;
        }
        closeModal();
    };

    // Chiudi il modale cliccando fuori
    modal.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    return modal;
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

