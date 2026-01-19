// Carrega o conteúdo do JSON e popula o site
async function loadContent() {
    try {
        const response = await fetch('content.json');
        const content = await response.json();
        
        // Popula a marca
        document.getElementById('brand-name').textContent = content.brand.name;
        document.getElementById('brand-highlight').textContent = content.brand.highlight;
        document.getElementById('footer-brand-name').textContent = content.brand.name;
        document.getElementById('footer-brand-highlight').textContent = content.brand.highlight;
        
        // Popula o menu de navegação
        const navMenu = document.getElementById('nav-menu');
        content.navigation.menu.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.href;
            a.textContent = item.label;
            if (item.class) a.className = item.class;
            li.appendChild(a);
            navMenu.appendChild(li);
        });
        
        // Popula o hero
        document.getElementById('hero-badge').textContent = content.hero.badge;
        document.getElementById('hero-title').textContent = content.hero.title;
        document.getElementById('hero-description').textContent = content.hero.description;
        document.getElementById('hero-btn-primary').textContent = content.hero.cta_primary.text;
        document.getElementById('hero-btn-secondary').textContent = content.hero.cta_secondary.text;
        
        // Carrega a imagem do hero
        if (content.hero.image) {
            document.getElementById('hero-img').src = content.hero.image;
        }
        
        // Popula os serviços
        document.getElementById('services-title').textContent = content.services.title;
        document.getElementById('services-subtitle').textContent = content.services.subtitle;
        const servicesGrid = document.getElementById('services-grid');
        content.services.items.forEach(service => {
            const card = document.createElement('div');
            card.className = 'card';
            let cardContent = `
                <div class="card__image">
                    <img src="${service.image || ''}" alt="${service.title}" />
                </div>
                <div class="card__content">
                    <i data-lucide="${service.icon}" class="card__icon"></i>
                    <h3 class="card__title">${service.title}</h3>
                    <p>${service.description}</p>
                </div>
            `;
            card.innerHTML = cardContent;
            servicesGrid.appendChild(card);
        });
        
        // Popula a seção sobre
        document.getElementById('about-title').textContent = content.about.title;
        document.getElementById('about-description').textContent = content.about.description;
        
        // Popula os depoimentos
        if (content.testimonials) {
            document.getElementById('testimonials-title').textContent = content.testimonials.title;
            document.getElementById('testimonials-subtitle').textContent = content.testimonials.subtitle;
            const testimonialsGrid = document.getElementById('testimonials-grid');
            content.testimonials.items.forEach(testimonial => {
                const card = document.createElement('div');
                card.className = 'testimonial__card';
                let stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
                card.innerHTML = `
                    <div class="testimonial__header">
                        <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial__image" />
                        <div class="testimonial__info">
                            <h4 class="testimonial__name">${testimonial.name}</h4>
                            <p class="testimonial__position">${testimonial.position}</p>
                        </div>
                    </div>
                    <div class="testimonial__rating">${stars}</div>
                    <p class="testimonial__text">"${testimonial.text}"</p>
                `;
                testimonialsGrid.appendChild(card);
            });
        }
        
        // Popula as empresas
        if (content.companies) {
            document.getElementById('companies-title').textContent = content.companies.title;
            document.getElementById('companies-subtitle').textContent = content.companies.subtitle;
            const companiesGrid = document.getElementById('companies-grid');
            content.companies.items.forEach(company => {
                const logoCard = document.createElement('div');
                logoCard.className = 'company__logo';
                logoCard.innerHTML = `<img src="${company.logo}" alt="${company.name}" />`;
                companiesGrid.appendChild(logoCard);
            });
        }
        
        // Popula o formulário de contato
        document.getElementById('contact-title').textContent = content.contact.title;
        const formFields = document.getElementById('form-fields');
        content.contact.form_fields.forEach(field => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form__group';
            
            const label = document.createElement('label');
            label.setAttribute('for', field.id);
            label.textContent = field.label;
            formGroup.appendChild(label);
            
            if (field.type === 'textarea') {
                const textarea = document.createElement('textarea');
                textarea.className = 'form__textarea';
                textarea.id = field.id;
                textarea.placeholder = field.placeholder;
                textarea.rows = field.rows;
                if (field.required) textarea.required = true;
                formGroup.appendChild(textarea);
            } else {
                const input = document.createElement('input');
                input.className = 'form__input';
                input.type = field.type;
                input.id = field.id;
                input.placeholder = field.placeholder;
                if (field.required) input.required = true;
                formGroup.appendChild(input);
            }
            
            formFields.appendChild(formGroup);
        });
        document.getElementById('contact-submit').textContent = content.contact.submit_button;
        
        // Popula o footer
        document.getElementById('footer-copyright').textContent = content.footer.copyright;
        
        // Configura o botão do WhatsApp
        if (content.social && content.social.whatsapp) {
            const phone = content.social.whatsapp.phone;
            const message = encodeURIComponent(content.social.whatsapp.message);
            const whatsappBtn = document.getElementById('whatsapp-btn');
            if (whatsappBtn) {
                whatsappBtn.href = `https://wa.me/${phone}?text=${message}`;
                whatsappBtn.setAttribute('aria-label', 'WhatsApp');
                whatsappBtn.title = content.social.whatsapp.title || 'Fale conosco no WhatsApp';
                whatsappBtn.dataset.platform = 'whatsapp';
                whatsappBtn.innerHTML = `<i data-lucide="whatsapp"></i>`;
            }
        }

        // Popula links das redes sociais no footer (se houver)
        if (content.social) {
            const socialContainer = document.getElementById('footer-social');
            if (socialContainer) {
                const platforms = ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube'];
                platforms.forEach(p => {
                    if (content.social[p]) {
                        const a = document.createElement('a');
                        a.href = content.social[p];
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        a.className = 'footer__social-link';
                        a.dataset.platform = p;
                        a.setAttribute('aria-label', p);
                        a.title = p.charAt(0).toUpperCase() + p.slice(1);
                        // use lucide icon name for platform (fallback to platform name)
                        a.innerHTML = `<i data-lucide="${p}"></i>`;
                        socialContainer.appendChild(a);
                    }
                });
                socialContainer.setAttribute('aria-hidden', 'false');
            }
        }
        
        // Reinicializa os ícones após popular o conteúdo
        lucide.createIcons();

        // Garantir que o ícone do WhatsApp fique visível (branco) dentro do botão verde
        const _whBtn = document.getElementById('whatsapp-btn');
        if (_whBtn) {
            const _svg = _whBtn.querySelector('svg');
            if (_svg) {
                _svg.setAttribute('fill', '#ffffff');
                _svg.setAttribute('stroke', '#ffffff');
                _svg.style.color = '#ffffff';
                _svg.style.width = '24px';
                _svg.style.height = '24px';
            }
        }

        // Try loading official SVG logos from CDN (simple-icons) and inline them
        async function fetchSvgIcon(platform) {
            try {
                const url = `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${platform}.svg`;
                const resp = await fetch(url);
                if (!resp.ok) throw new Error('Icon not found');
                let svgText = await resp.text();
                // Ensure svg has currentColor so we can color it via CSS if needed
                svgText = svgText.replace(/<svg([^>]+)>/, (m, attrs) => {
                    if (/currentColor/.test(m)) return `<svg${attrs}>`;
                    // add fill="currentColor" if not present
                    if (/fill=/.test(attrs)) return `<svg${attrs}>`;
                    return `<svg${attrs} fill=\"currentColor\">`;
                });
                return svgText;
            } catch (err) {
                console.warn('Could not load icon', platform, err);
                return null;
            }
        }

        async function inlineSocialSvgs() {
            const nodes = document.querySelectorAll('[data-platform]');
            if (!nodes.length) return;
            const promises = Array.from(nodes).map(async (node) => {
                const platform = node.dataset.platform;
                if (!platform) return;
                const svg = await fetchSvgIcon(platform);
                if (svg) {
                    node.innerHTML = svg;
                    const svgEl = node.querySelector('svg');
                    if (svgEl) {
                        // ensure white icon inside colored buttons
                        if (node.classList.contains('whatsapp') || node.dataset.platform === 'whatsapp' || node.closest('.whatsapp')) {
                            svgEl.setAttribute('fill', '#ffffff');
                            svgEl.style.width = '24px';
                            svgEl.style.height = '24px';
                        } else {
                            svgEl.style.width = '20px';
                            svgEl.style.height = '20px';
                            svgEl.style.color = 'currentColor';
                        }
                    }
                }
            });
            await Promise.all(promises);
        }

        inlineSocialSvgs();
        
        // Esconde o loading após carregar com sucesso
        hideLoading();
    } catch (error) {
        console.error('Erro ao carregar o conteúdo:', error);
        hideLoading();
    }
}

// Função para esconder o loading
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

// Inicializa os ícones
lucide.createIcons();

// Menu Mobile
const menuBtn = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.navbar__menu');
const overlay = document.querySelector('.navbar__overlay');

const toggleMenu = () => {
    navMenu.classList.toggle('active');
    menuBtn.classList.toggle('is-active');
    overlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
};

menuBtn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Aguarda o conteúdo carregar para adicionar event listeners aos links
document.addEventListener('DOMContentLoaded', async () => {
    await loadContent();

    const links = document.querySelectorAll('.navbar__list a');
    links.forEach(link => link.addEventListener('click', () => {
        if(navMenu.classList.contains('active')) toggleMenu();
    }));

    // Lead modal elements
    const leadModal = document.getElementById('lead-modal');
    const leadOverlay = document.getElementById('lead-modal-overlay');
    const leadClose = document.getElementById('lead-modal-close');
    const leadForm = document.getElementById('lead-form');

    if (!leadModal) return;

    // LocalStorage debounce: don't show more than once per 24h
    const SHOWN_KEY = 'leadModalShownAt';
    const wasShownRecently = () => {
        const v = localStorage.getItem(SHOWN_KEY);
        if (!v) return false;
        return (Date.now() - parseInt(v, 10)) < (1000 * 60 * 60 * 24);
    };
    const setShown = () => localStorage.setItem(SHOWN_KEY, Date.now().toString());

    const openLeadModal = (opts = {}) => {
        const { force = false } = opts;
        if (!force && wasShownRecently()) return;
        if (leadModal.getAttribute('aria-hidden') === 'false') return;
        leadModal.setAttribute('aria-hidden', 'false');
        leadModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        setShown();
    };

    const closeLeadModal = () => {
        leadModal.setAttribute('aria-hidden', 'true');
        leadModal.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    // Close handlers
    leadClose.addEventListener('click', closeLeadModal);
    leadOverlay.addEventListener('click', closeLeadModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLeadModal();
    });

    // Form submit (stub - replace with API call if needed)
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('lead-name').value.trim();
        const email = document.getElementById('lead-email').value.trim();
        const message = document.getElementById('lead-message').value.trim();
        const lead = { name, email, message, ts: new Date().toISOString() };
        console.log('Lead submitted', lead);
        // You can replace this with a `fetch()` POST to your backend here.
        closeLeadModal();
        // quick thank-you feedback
        setTimeout(() => alert('Obrigado! Entraremos em contato em breve.'), 200);
    });

    // Time-delayed trigger (e.g., 15s)
    const DELAY_MS = 15000;
    setTimeout(() => openLeadModal({ force: false }), DELAY_MS);

    // Exit-intent trigger (desktop only). Fires once.
    let exitIntentFired = false;
    const handleMouseOut = (e) => {
        if (exitIntentFired) return;
        e = e ? e : window.event;
        const from = e.relatedTarget || e.toElement;
        if (!from && e.clientY <= 10 && window.innerWidth > 768) {
            exitIntentFired = true;
            openLeadModal({ force: false });
            document.removeEventListener('mouseout', handleMouseOut);
        }
    };
    document.addEventListener('mouseout', handleMouseOut);

    // Open modal when user clicks primary contact CTAs (hero button or nav links to contact)
    const heroPrimary = document.getElementById('hero-btn-primary');
    if (heroPrimary) heroPrimary.addEventListener('click', (e) => { e.preventDefault(); openLeadModal({ force: true }); });

    // Attach to nav links that reference contact section (Portuguese/English)
    const navLinks = Array.from(document.querySelectorAll('.navbar__list a'));
    navLinks.forEach(a => {
        const href = a.getAttribute('href') || '';
        const text = (a.textContent || '').toLowerCase();
        if (href.toLowerCase().includes('contato') || href.toLowerCase().includes('contact') || text.includes('contato') || text.includes('contact')) {
            a.addEventListener('click', (e) => { e.preventDefault(); openLeadModal({ force: true }); if(navMenu.classList.contains('active')) toggleMenu(); });
        }
    });
});