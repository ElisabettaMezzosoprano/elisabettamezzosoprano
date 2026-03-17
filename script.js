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

// Contatto email: gestito in HTML con link mailto (+ notifica di supporto).
let emailNotificationTimeoutId = null;

function showEmailNotification(message) {
    const el = document.getElementById('email-notification');
    if (!el) return;

    el.textContent = message;
    el.classList.add('is-visible');
    el.setAttribute('aria-hidden', 'false');

    if (emailNotificationTimeoutId) {
        window.clearTimeout(emailNotificationTimeoutId);
    }

    emailNotificationTimeoutId = window.setTimeout(() => {
        el.classList.remove('is-visible');
        el.setAttribute('aria-hidden', 'true');
    }, 9000);
}

document.querySelectorAll('.secondary-btn[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
        showEmailNotification("\u00E8 stata aperta l'applicazione per inviare l'email, se non \u00E8 cos\u00EC, contattarmi via email tramite andrea46tarchiani@gmail.com");
    });
});

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

