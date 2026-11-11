const loader = document.getElementById("loader");
if (loader) {
    window.addEventListener("load", () => setTimeout(() => loader.classList.add("hide"), 1500));
}

const header = document.getElementById("header");
if (header) {
    window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 40));
}

const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");
if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
        menuButton.classList.toggle("active");
        nav.classList.toggle("active");
        document.body.classList.toggle("menu-open");
    });
    document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => {
        menuButton.classList.remove("active");
        nav.classList.remove("active");
        document.body.classList.remove("menu-open");
    }));
}

let currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) link.classList.add("active-page");
});

const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        }
    }), { threshold: .12 });
    reveals.forEach(el => observer.observe(el));
} else {
    reveals.forEach(el => el.classList.add("show"));
}

const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".portfolio-card");
filters.forEach(button => button.addEventListener("click", () => {
    filters.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    const category = button.dataset.filter;
    cards.forEach(card => card.classList.toggle("hide-project", category !== "all" && !card.classList.contains(category)));
}));

const contactForm = document.getElementById("contactForm");
if (contactForm) contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const service = document.getElementById("service").value;
    const message = document.getElementById("message").value.trim();
    const status = document.getElementById("formMessage");
    if (!name || !email || !service || !message) {
        status.textContent = "Completa todos los campos.";
        return;
    }
    const phone = "51980304326"; // Número proporcionado en el proyecto original
    const text = `Hola MegaPixel 👋\n\nMi nombre es ${name}.\nCorreo: ${email}\nServicio: ${service}\n\nMi proyecto:\n${message}`;
    status.textContent = "Abriendo WhatsApp...";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

document.querySelectorAll(".year").forEach(el => el.textContent = new Date().getFullYear());
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && nav) {
        nav.classList.remove("active");
        menuButton?.classList.remove("active");
        document.body.classList.remove("menu-open");
    }
});

// Carrusel de fotos de inicio: botones, puntos, teclado y cambio automático.
(() => {
    const root = document.getElementById('photoCarousel');
    if (!root) return;
    const slides = [...root.querySelectorAll('.photo-slide')];
    const dots = root.querySelector('.carousel-dots');
    let current = 0;
    slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Mostrar foto ${i + 1}`);
        b.addEventListener('click', () => show(i));
        dots.appendChild(b);
    });
    function show(i) {
        current = (i + slides.length) % slides.length;
        root.querySelector('.photo-track').style.transform = `translateX(-${current * 100}%)`;
        slides.forEach((s, j) => s.classList.toggle('is-current', j === current));
        [...dots.children].forEach((d, j) => {
            d.classList.toggle('active', j === current);
            d.setAttribute('aria-current', String(j === current));
        });
    }
    root.querySelector('.prev').addEventListener('click', () => show(current - 1));
    root.querySelector('.next').addEventListener('click', () => show(current + 1));
    root.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') show(current + 1);
        if (e.key === 'ArrowLeft') show(current - 1);
    });
    show(0);
    let timer;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const start = () => timer = setInterval(() => show(current + 1), 5000);
        const stop = () => clearInterval(timer);
        start();
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        root.addEventListener('focusin', stop);
        root.addEventListener('focusout', e => {
            if (!root.contains(e.relatedTarget)) start();
        });
    }
})();

// Mostrar indicación cuando todavía no se ha añadido una fotografía real.
document.querySelectorAll('.photo-category img, .work-photo img').forEach(img => {
    const missing = () => img.parentElement.classList.add('photo-missing');
    img.addEventListener('error', missing);
    if (img.complete && img.naturalWidth === 0) missing();
});

// Galería sin cuadros: solamente fotografías, ampliables al hacer clic.
(() => {
    const grid = document.getElementById('worksGrid');
    if (!grid) return;
    const key = new URLSearchParams(location.search).get('categoria') || 'branding';
    const titles = {
        branding: ['BRANDING', 'Nuestros proyectos de identidad visual.'],
        foto: ['FOTOGRAFÍA', 'Nuestros trabajos fotográficos.'],
        diseno: ['DISEÑO GRÁFICO', 'Nuestros proyectos gráficos.'],
        decoraciones: ['DECORACIONES', 'Nuestros sets fotográficos.']
    };
    const selected = titles[key] ? key : 'branding';
    document.getElementById('categoryTitle').textContent = titles[selected][0];
    document.getElementById('categoryDescription').textContent = titles[selected][1];
    grid.querySelectorAll('.work-category').forEach(section => section.hidden = section.dataset.category !== selected);
    const lightbox = document.getElementById('photoLightbox');
    const large = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');
    const close = () => {
        lightbox.hidden = true;
        large.removeAttribute('src');
        document.body.classList.remove('lightbox-open');
    };
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') close();
    });
    grid.querySelectorAll('.photo-only-item').forEach(button => {
        const img = button.querySelector('img');
        const fail = () => button.hidden = true;
        img.addEventListener('error', fail);
        if (img.complete && !img.naturalWidth) fail();
        button.addEventListener('click', () => {
            large.src = img.src;
            caption.textContent = img.alt;
            lightbox.hidden = false;
            document.body.classList.add('lightbox-open');
        });
    });
})();
