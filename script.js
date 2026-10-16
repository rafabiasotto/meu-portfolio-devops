document.addEventListener('DOMContentLoaded', () => {
    const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Ano no rodapé
    document.getElementById('ano').textContent = new Date().getFullYear();

    // Data do último commit (API pública do GitHub)
    fetch('https://api.github.com/repos/rafabiasotto/meu-portfolio-devops/commits?per_page=1')
        .then(r => (r.ok ? r.json() : []))
        .then(commits => {
            const data = commits[0] && commits[0].commit.committer.date;
            if (!data) return;
            const txt = new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
            document.getElementById('atualizado').textContent = ` · atualizado em ${txt}`;
        })
        .catch(() => {});

    // Borda do topo ao rolar
    const topo = document.querySelector('.topo');
    const marcaTopo = () => topo.classList.toggle('rolou', window.scrollY > 10);
    window.addEventListener('scroll', marcaTopo, { passive: true });
    marcaTopo();

    // Menu mobile
    const btn = document.querySelector('.menu-btn');
    const links = document.querySelector('.nav-links');
    btn.addEventListener('click', () => {
        const aberto = links.classList.toggle('aberto');
        btn.setAttribute('aria-expanded', aberto);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        links.classList.remove('aberto');
        btn.setAttribute('aria-expanded', 'false');
    }));

    // Link ativo conforme a seção visível
    const navPorId = {};
    links.querySelectorAll('a[href^="#"]').forEach(a => { navPorId[a.getAttribute('href').slice(1)] = a; });
    const obsNav = new IntersectionObserver(entradas => {
        entradas.forEach(e => {
            if (e.isIntersecting && navPorId[e.target.id]) {
                Object.values(navPorId).forEach(a => a.classList.remove('ativo'));
                navPorId[e.target.id].classList.add('ativo');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(s => obsNav.observe(s));

    // Frases digitando no hero
    const frases = [
        'Nuvem governada, automatizada e eficiente.',
        'FinOps: saving medido em custo real.',
        'IaC com Terraform e GitHub Actions.',
        'Governança com TAGs, Policy e RBAC.'
    ];
    const alvo = document.getElementById('frase');
    if (!reduzMovimento) {
        let i = 0, pos = frases[0].length, apagando = true;
        const passo = () => {
            const frase = frases[i];
            if (apagando) {
                pos--;
                if (pos <= 0) { apagando = false; i = (i + 1) % frases.length; }
            } else {
                pos++;
                if (pos >= frases[i].length) {
                    alvo.textContent = frases[i];
                    apagando = true;
                    return setTimeout(passo, 2200);
                }
            }
            alvo.textContent = (apagando ? frase : frases[i]).slice(0, pos);
            setTimeout(passo, apagando ? 28 : 55);
        };
        setTimeout(passo, 2200);
    }

    // Entrada suave dos blocos
    const blocos = document.querySelectorAll('.card, .cert, .timeline > li, .numeros');
    if (!reduzMovimento && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entradas => {
            entradas.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
            });
        }, { threshold: 0.12 });
        blocos.forEach(b => { b.classList.add('revelar'); obs.observe(b); });
    }

    // Ampliar a imagem de arquitetura
    const lightbox = document.querySelector('.lightbox');
    const imgLb = lightbox.querySelector('img');
    document.querySelectorAll('[data-zoom]').forEach(el => el.addEventListener('click', () => {
        imgLb.src = el.dataset.zoom;
        imgLb.alt = el.querySelector('img').alt;
        lightbox.hidden = false;
    }));
    const fechar = () => { lightbox.hidden = true; };
    lightbox.addEventListener('click', fechar);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fechar(); });
});
