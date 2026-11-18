/* Sugar Cube : langue AR/FR/EN, rebond des tuiles, apparition au défilement */
(function () {
    'use strict';

    var root = document.documentElement;

    /* ---------- Langue (AR / FR / EN) ---------- */
    var langBtns = document.querySelectorAll('[data-set-lang]');

    function setLang(lang, save) {
        root.lang = lang;
        root.dir = lang === 'ar' ? 'rtl' : 'ltr';
        langBtns.forEach(function (b) {
            b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === lang));
        });
        if (save) {
            try { localStorage.setItem('sc-lang', lang); } catch (e) {}
        }
    }

    langBtns.forEach(function (b) {
        b.addEventListener('click', function () {
            setLang(b.getAttribute('data-set-lang'), true);
        });
    });

    setLang(root.lang, false);

    /* ---------- Animations (désactivées si l'utilisateur les réduit) ---------- */
    if (!root.classList.contains('js')) return;

    /* Rebond "gelée" quand on touche une tuile */
    document.querySelectorAll('.treat').forEach(function (el) {
        el.addEventListener('pointerdown', function () {
            el.classList.remove('is-bouncing');
            void el.offsetWidth; /* relance l'animation */
            el.classList.add('is-bouncing');
        });
    });

    document.addEventListener('animationend', function (e) {
        var el = e.target;
        if (e.animationName === 'jelly') el.classList.remove('is-bouncing');
        if (e.animationName === 'rise') el.classList.remove('reveal', 'is-visible');
    });

    /* Apparition douce des sections */
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    items.forEach(function (el) { io.observe(el); });
})();
