// Carrega o conteúdo do JSON e popula o site
async function loadContent() {
    try {
        const response = await fetch('content.json');
        const content = await response.json();
        
        // --- 1. POPULA CONTEÚDO (MARCA, HERO, ETC) ---
        
        // Marca
        document.getElementById('brand-name').textContent = content.brand.name;
        document.getElementById('brand-highlight').textContent = content.brand.highlight;
        document.getElementById('footer-brand-name').textContent = content.brand.name;
        document.getElementById('footer-brand-highlight').textContent = content.brand.highlight;
        
        // Menu de navegação
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
        
        // Hero
        document.getElementById('hero-badge').textContent = content.hero.badge;
        document.getElementById('hero-title').textContent = content.hero.title;
        document.getElementById('hero-description').textContent = content.hero.description;
        document.getElementById('hero-btn-primary').textContent = content.hero.cta_primary.text;
        document.getElementById('hero-btn-secondary').textContent = content.hero.cta_secondary.text;
        if (content.hero.image) {
            document.getElementById('hero-img').src = content.hero.image;
        }
        
        // Serviços
        document.getElementById('services-title').textContent = content.services.title;
        document.getElementById('services-subtitle').textContent = content.services.subtitle;
        const servicesGrid = document.getElementById('services-grid');
        content.services.items.forEach(service => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card__image">
                    <img src="${service.image || ''}" alt="${service.title}" />
                </div>
                <div class="card__content">
                    <i data-lucide="${service.icon}" class="card__icon"></i>
                    <h3 class="card__title">${service.title}</h3>
                    <p>${service.description}</p>
                </div>
            `;
            servicesGrid.appendChild(card);
        });
        
        // Sobre
        document.getElementById('about-title').textContent = content.about.title;
        document.getElementById('about-description').textContent = content.about.description;
        
        // Depoimentos e Empresas (mantidos conforme original)
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
        
        // Formulário de Contato
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

        // --- 2. INTEGRAÇÃO WHATSAPP (VIA BACKEND PRÓPRIO) ---
                const contactForm = document.getElementById('contact-form');
                contactForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    // Botão de loading visual
                    const submitBtn = document.getElementById('contact-submit');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = "Enviando...";
                    submitBtn.disabled = true;

                    // Dados do formulário
                    const formData = {
                        name: document.getElementById('name').value,
                        email: document.getElementById('email').value,
                        message: document.getElementById('message').value
                    };

                    // Agora chamamos NOSSO servidor local, não o Facebook diretamente
                    // Se estiver rodando localmente na porta 3000:
                    const apiUrl = 'http://localhost:3000/api/send-whatsapp'; 

                    try {
                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formData)
                        });

                        const data = await response.json();

                        if (response.ok) {
                            alert('Mensagem enviada com sucesso! Entraremos em contato.');
                            contactForm.reset();
                        } else {
                            console.error('Erro no envio:', data);
                            alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
                        }
                    } catch (error) {
                        console.error('Erro na requisição:', error);
                        alert('Erro ao conectar com o servidor.');
                    } finally {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                });
        
        // Footer e Social Links
        document.getElementById('footer-copyright').textContent = content.footer.copyright;
        
        if (content.social && content.social.whatsapp) {
            const phone = content.social.whatsapp.phone;
            const msg = encodeURIComponent(content.social.whatsapp.message);
            const whatsappBtn = document.getElementById('whatsapp-btn');
            if (whatsappBtn) {
                whatsappBtn.href = `https://wa.me/${phone}?text=${msg}`;
                whatsappBtn.innerHTML = `<i data-lucide="whatsapp"></i>`;
            }
        }

        if (content.social) {
            const socialContainer = document.getElementById('footer-social');
            if (socialContainer) {
                const platforms = ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube'];
                platforms.forEach(p => {
                    if (content.social[p]) {
                        const a = document.createElement('a');
                        a.href = content.social[p];
                        a.className = 'footer__social-link';
                        a.innerHTML = `<i data-lucide="${p}"></i>`;
                        socialContainer.appendChild(a);
                    }
                });
            }
        }
        
        lucide.createIcons();
        hideLoading();

    } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
        hideLoading();
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
}

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

document.addEventListener('DOMContentLoaded', async () => {
    await loadContent();
    const links = document.querySelectorAll('.navbar__list a');
    links.forEach(link => link.addEventListener('click', () => {
        if(navMenu.classList.contains('active')) toggleMenu();
    }));
});