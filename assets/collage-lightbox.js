document.addEventListener('DOMContentLoaded', () => {
    (() => {
        const grid = document.getElementById('collage');
        const lb = document.getElementById('lightbox');
        const imgEl = lb.querySelector('.lb__img');
        const prevBtn = lb.querySelector('.lb__prev');
        const nextBtn = lb.querySelector('.lb__next');
        const closeBtn = lb.querySelector('.lb__close');
        const countEl = lb.querySelector('.lb__count');

        const images = Array.from(grid.querySelectorAll('img'));
        let index = 0;

        function openAt(i) {
            index = (i + images.length) % images.length;
            const src = images[index].getAttribute('src');
            const alt = images[index].getAttribute('alt') || '';
            imgEl.src = src;
            imgEl.alt = alt;
            countEl.textContent = `${index + 1} / ${images.length}`;
            lb.classList.add('is-open');
            lb.setAttribute('aria-hidden', 'false');
            document.documentElement.style.overflow = 'hidden'; // lock scroll
            closeBtn.focus({preventScroll: true});
        }

        function close() {
            lb.classList.remove('is-open');
            lb.setAttribute('aria-hidden', 'true');
            imgEl.removeAttribute('src');
            document.documentElement.style.overflow = ''; // unlock scroll
        }

        function next() {
            openAt(index + 1);
        }

        function prev() {
            openAt(index - 1);
        }

        // Click-to-open
        images.forEach((im, i) => {
            im.addEventListener('click', () => openAt(i));
            im.setAttribute('tabindex', '0');
            im.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openAt(i);
                }
            });
        });

        // Controls
        nextBtn.addEventListener('click', next);
        prevBtn.addEventListener('click', prev);
        closeBtn.addEventListener('click', close);

        // Click outside image closes
        lb.addEventListener('click', (e) => {
            const clickedBackdrop = e.target === lb || e.target === lb.querySelector('.lb__stage');
            if (clickedBackdrop) close();
        });

        // Keyboard navigation
        window.addEventListener('keydown', (e) => {
            if (!lb.classList.contains('is-open')) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowRight') next();
            else if (e.key === 'ArrowLeft') prev();
        });

        // Basic touch swipe
        let startX = 0, startY = 0, swiping = false;
        imgEl.addEventListener('touchstart', (e) => {
            if (!e.touches.length) return;
            swiping = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, {passive: true});

        imgEl.addEventListener('touchmove', (e) => {
            // prevent slight vertical scroll from triggering swipe horizontally
            if (!swiping) return;
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
        }, {passive: false});

        imgEl.addEventListener('touchend', (e) => {
            if (!swiping) return;
            const endX = (e.changedTouches && e.changedTouches[0].clientX) || startX;
            const dx = endX - startX;
            const threshold = 40; // px
            if (dx > threshold) prev();
            else if (dx < -threshold) next();
            swiping = false;
        });
    })();
})