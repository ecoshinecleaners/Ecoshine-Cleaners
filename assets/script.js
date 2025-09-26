// Mobile nav toggle
document.querySelectorAll('.nav-toggle').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.nav').classList.toggle('open'));
});

// simpleParallax for hero bg (subtle parallax on scroll)
/* global simpleParallax */
window.addEventListener('DOMContentLoaded', () => {
  const heroImg = document.querySelector('.hero .bg img');
  const isMobile = window.matchMedia('(max-width: 768px)').matches; if (!isMobile && heroImg && window.simpleParallax) {
    new simpleParallax(heroImg, { scale: 1.25, delay: .6, transition: 'cubic-bezier(0,0,.2,1)' });
  }
});


// IntersectionObservers to animate in gallery images & cards
const inView = (els) => {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .18 });
  els.forEach(el => io.observe(el));
};

window.addEventListener('DOMContentLoaded', () => {
  inView(document.querySelectorAll('.gallery-grid img'));
  inView(document.querySelectorAll('.card'));
});

// Sticky stack cover logic: as the next sticky layer scrolls in, fade previous ~80%
(() => {
  const layers = window.matchMedia('(max-width: 768px)').matches ? [] : Array.from(document.querySelectorAll('.sticky-stack .sticky-layer'));
  if (!layers.length) return;

  const updateCover = () => {
    layers.forEach((layer, idx) => {
      const next = layers[idx + 1];
      if (!next) return;
      const rect = layer.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();

      // When next layer overlaps 80% of viewport, mark current as covered
      const coverage = Math.max(0, Math.min(1, (window.innerHeight - nextRect.top) / window.innerHeight));
      const covered = coverage > 0.8;
      layer.classList.toggle('covered', covered);
      layer.closest('.section')?.classList.toggle('covered', covered);
    });
  };

  updateCover();
  window.addEventListener('scroll', updateCover, { passive: true });
  window.addEventListener('resize', updateCover);
})();

// Smooth scroll for internal anchors (safeguard for browsers without native behavior)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// Utility: fill contact links from global dataset (set in HTML via data-*)
(() => {
  const root = document.documentElement;
  const tel = root.dataset.phone || '+13074135799';   // TODO: replace with business card phone
  const email = root.dataset.email || 'ecoshinecleanersllc@gmail.com'; // TODO: replace with business card email
  const callBtns = document.querySelectorAll('[data-call]');
  const mailBtns = document.querySelectorAll('[data-mail]');
  callBtns.forEach(b => b.setAttribute('href', `tel:${tel.replace(/[^+\d]/g,'')}`));
  mailBtns.forEach(b => b.setAttribute('href', `mailto:${email}`));
})();

// Floating Call button (mobile) with dismiss + localStorage
(() => {
  const root = document.documentElement;
  const tel = (root.dataset.phone || '').replace(/[^+\d]/g,'');
  if (!tel) return;

  const hidden = localStorage.getItem('fab_call_hidden') === '1';
  if (hidden) return;

  const fabWrap = document.createElement('div');
  fabWrap.className = 'fab-call';
  fabWrap.innerHTML = `<button class="close" aria-label="Hide">×</button>
    <a class="fab" href="tel:${tel}">📞 Call Us</a>`;
  document.body.appendChild(fabWrap);

  fabWrap.querySelector('.close').addEventListener('click', () => {
    fabWrap.remove();
    localStorage.setItem('fab_call_hidden', '1');
  }, { passive: true });
})();


// Custom parallax (desktop only): move hero image slower than scroll
(() => {
  const heroImg = document.querySelector('.hero .bg img');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (!heroImg || prefersReduced || isMobile) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY * 0.12;
      heroImg.style.transform = `translateY(${y}px) scale(1.15)`;
      ticking = false;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();


// Hero cover amount: fade out hero completely when the next section fully reaches the top
(() => {
  const hero = document.querySelector('.hero.sticky-layer');
  const next = document.getElementById('gallery');
  if (!hero || !next) return;
  if (window.matchMedia('(max-width: 768px)').matches) return; // mobile off

  const update = () => {
    const nr = next.getBoundingClientRect();
    const amount = Math.max(0, Math.min(1, (window.innerHeight - nr.top) / window.innerHeight));
    hero.style.setProperty('--cover', amount.toFixed(3));
    hero.classList.toggle('covered', amount >= 1);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();


// Close mobile nav when a menu item is clicked
(() => {
  document.querySelectorAll('.nav ul a').forEach(a => {
    a.addEventListener('click', () => {
      const nav = a.closest('.nav');
      nav?.classList.remove('open');
    });
  });
})();
window.addEventListener('DOMContentLoaded', () => {
  inView(document.querySelectorAll('.about-media img, .about-copy, .collage-grid img'));
  (() => {
    const grid = document.querySelector('.collage-grid.equal');
    if (!grid) return;
    const tiles = Array.from(grid.children);
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    tiles.forEach(t => grid.appendChild(t));
  })();
});