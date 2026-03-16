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
    const submitBtn = contactForm.querySelector('.submit-btn');
    const copyBtn = contactForm.querySelector('.contact-copy');
    const gmailLink = contactForm.querySelector('.contact-gmail');
    const outlookLink = contactForm.querySelector('.contact-outlook');
    const mailtoLink = contactForm.querySelector('.contact-mailto');

    function buildEmailDraft() {
        const fromName = contactForm.querySelector('input[name="from_name"]')?.value?.trim() || '';
        const fromEmail = contactForm.querySelector('input[name="from_email"]')?.value?.trim() || '';
        const message = contactForm.querySelector('textarea[name="message"]')?.value?.trim() || '';

        const toEmail = contactForm.dataset.contactEmail
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
        const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        const outlook = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(toEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        return { toEmail, subject, body, mailto, gmail, outlook };
    }

    function syncContactLinks() {
        const draft = buildEmailDraft();
        if (mailtoLink) mailtoLink.href = draft.mailto;
        if (gmailLink) gmailLink.href = draft.gmail;
        if (outlookLink) outlookLink.href = draft.outlook;
    }

    ['input', 'change', 'keyup'].forEach((evt) => {
        contactForm.addEventListener(evt, syncContactLinks);
    });
    syncContactLinks();

    async function copyDraftText() {
        const draft = buildEmailDraft();
        const text = `A: ${draft.toEmail}\nOggetto: ${draft.subject}\n\n${draft.body}\n`;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                showModal('success', 'Copiato', 'Testo copiato negli appunti. Incollalo nella tua webmail (Gmail/Outlook).');
                return;
            }
        } catch { }

        // Fallback for non-secure contexts (e.g. file://)
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            showModal('success', 'Copiato', 'Testo copiato negli appunti. Incollalo nella tua webmail (Gmail/Outlook).');
        } catch {
            showModal('error', 'Copia non riuscita', 'Seleziona e copia manualmente l\\'indirizzo email nella sezione Contatti.');
        } finally {
            ta.remove();
        }
    }

    function handleContactSubmit(e) {
        e.preventDefault();

        // Mostra loading nel pulsante
        const originalText = submitBtn ? submitBtn.textContent : 'Invia';
        if (!submitBtn) {
            showModal('error', 'Contatto', 'Pulsante di invio non trovato. Ricarica la pagina e riprova.');
            return;
        }
        submitBtn.textContent = 'Apro...';
        submitBtn.disabled = true;

        const draft = buildEmailDraft();

        showModal(
            'success',
            'Scegli come inviare',
            'Apri Gmail o Outlook nel browser, oppure prova ad aprire l\\'app email. Se non hai nessuna app email, usa Gmail/Outlook o copia il testo.',
            {
                buttons: [
                    { label: 'Apri Gmail', href: draft.gmail },
                    { label: 'Apri Outlook', href: draft.outlook },
                    { label: 'Apri email', href: draft.mailto },
                    { label: 'Copia testo', action: 'copy' }
                ]
            }
        );

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }

    // Handle both clicking the button and pressing Enter in a field.
    contactForm.addEventListener('submit', handleContactSubmit);
    if (submitBtn) {
        submitBtn.addEventListener('click', handleContactSubmit);
    }
    if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            copyDraftText();
        });
    }
}

// Funzione per mostrare il modale
function showModal(type, title, message, options = {}) {
    // Rimuovi modale esistente se presente
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }

    const buttons = Array.isArray(options.buttons) && options.buttons.length
        ? options.buttons
        : [{ label: options.primaryLabel || 'Chiudi', href: options.primaryHref || '', action: '' }];

    const footerButtonsHtml = buttons.map((b, idx) => {
        const safeLabel = String(b.label || 'Chiudi');
        const safeHref = b.href ? String(b.href) : '';
        const safeAction = b.action ? String(b.action) : '';
        const attrs = [
            `class="modal-btn"`,
            `data-modal-idx="${idx}"`,
            safeHref ? `data-href="${safeHref.replace(/\"/g, '&quot;')}"` : '',
            safeAction ? `data-action="${safeAction.replace(/\"/g, '&quot;')}"` : ''
        ].filter(Boolean).join(' ');

        return `<button ${attrs}>${safeLabel}</button>`;
    }).join('');

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
                ${footerButtonsHtml}
            </div>
        </div>
    `;

    // Aggiungi il modale al body
    document.body.appendChild(modal);

    // Mostra il modale
    modal.style.display = 'block';

    // Gestisci la chiusura del modale
    const closeBtn = modal.querySelector('.close');
    const modalBtns = modal.querySelectorAll('.modal-btn');

    function closeModal() {
        modal.style.display = 'none';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }

    closeBtn.onclick = closeModal;
    modalBtns.forEach((btn) => {
        btn.onclick = function () {
            const href = btn.getAttribute('data-href') || '';
            const action = btn.getAttribute('data-action') || '';

            if (action === 'copy') {
                // Prefer the on-page copy button handler (same logic).
                const copyBtn = document.querySelector('.contact-copy');
                if (copyBtn) copyBtn.click();
                closeModal();
                return;
            }

            if (href) {
                if (href.startsWith('mailto:')) {
                    window.location.href = href;
                } else {
                    window.open(href, '_blank', 'noopener');
                }
            }
            closeModal();
        };
    });

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

