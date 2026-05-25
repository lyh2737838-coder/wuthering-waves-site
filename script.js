/* ============ 加载屏 ============ */
(function loader() {
    const bar = document.getElementById('loaderBar');
    const percentEl = document.getElementById('loaderPercent');
    const loaderEl = document.getElementById('loader');
    let progress = 0;
    const timer = setInterval(() => {
        progress += Math.random() * 6 + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);
            setTimeout(() => {
                loaderEl.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 500);
        }
        bar.style.width = progress + '%';
        percentEl.textContent = Math.floor(progress) + '%';
    }, 80);
    document.body.style.overflow = 'hidden';
})();

/* ============ 自定义光标 ============ */
(function cursor() {
    if (window.matchMedia('(max-width: 700px)').matches) return;
    const cur = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    let mx = 0, my = 0, tx = 0, ty = 0;

    window.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cur.style.left = mx + 'px';
        cur.style.top = my + 'px';
    });

    function loop() {
        tx += (mx - tx) * 0.18;
        ty += (my - ty) * 0.18;
        trail.style.left = tx + 'px';
        trail.style.top = ty + 'px';
        requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll('a, button, .char-card, .world-card, .news-item, .platform').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cur.classList.add('hover');
            trail.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cur.classList.remove('hover');
            trail.classList.remove('hover');
        });
    });
})();

/* ============ 粒子背景 ============ */
(function particles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 1.6 + 0.3;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = -Math.random() * 0.5 - 0.1;
            this.life = Math.random() * 1;
            this.lifeSpeed = Math.random() * 0.005 + 0.002;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life += this.lifeSpeed;
            if (this.life > 1 || this.y < -10 || this.x < -10 || this.x > w + 10) {
                this.x = Math.random() * w;
                this.y = h + 10;
                this.life = 0;
            }
        }
        draw() {
            const alpha = Math.sin(this.life * Math.PI) * 0.8;
            ctx.fillStyle = `rgba(93, 212, 220, ${alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(93, 212, 220, 0.6)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 70; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });

        // 连线
        ctx.shadowBlur = 0;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120) {
                    ctx.strokeStyle = `rgba(93, 212, 220, ${(1 - dist/120) * 0.15})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

/* ============ 顶部导航：滚动样式 + 当前激活 ============ */
(function nav() {
    const navEl = document.getElementById('nav');
    const links = document.querySelectorAll('.nav-menu a');
    const dots = document.querySelectorAll('.side-dots .dot');
    const backTop = document.getElementById('backTop');

    function onScroll() {
        const y = window.scrollY;
        if (y > 50) navEl.classList.add('scrolled');
        else navEl.classList.remove('scrolled');
        if (y > 800) backTop.classList.add('show');
        else backTop.classList.remove('show');
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
            }
        });
    });

    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // 当前段落高亮（IntersectionObserver）
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
                dots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === '#' + id));
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(s => observer.observe(s));
})();

/* ============ 英雄区视差（鼠标移动） ============ */
(function heroParallax() {
    const layers = document.querySelectorAll('.hero-layer');
    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', e => {
        const rect = hero.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        layers.forEach((l, i) => {
            const depth = (i + 1) * 12;
            l.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
        });
        const title = document.querySelector('.hero-title');
        if (title) title.style.transform = `translate(${cx * 8}px, ${cy * 8}px)`;
    });

    hero.addEventListener('mouseleave', () => {
        layers.forEach(l => l.style.transform = '');
        const title = document.querySelector('.hero-title');
        if (title) title.style.transform = '';
    });
})();

/* ============ 标题字符动画时序 ============ */
(function titleStagger() {
    const chars = document.querySelectorAll('.title-char');
    chars.forEach((c, i) => {
        c.style.animationDelay = (0.6 + i * 0.06) + 's';
    });
})();

/* ============ 角色筛选 + 轮播 ============ */
(function characters() {
    const tabs = document.querySelectorAll('.char-tab');
    const cards = document.querySelectorAll('.char-card');
    const track = document.getElementById('charTrack');
    const prev = document.querySelector('.char-prev');
    const next = document.querySelector('.char-next');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const el = tab.dataset.element;
            cards.forEach(card => {
                if (el === 'all' || card.dataset.element === el) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
            track.scrollTo({ left: 0, behavior: 'smooth' });
        });
    });

    prev.addEventListener('click', () => track.scrollBy({ left: -304, behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: 304, behavior: 'smooth' }));

    // 卡片 3D 倾斜
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const cx = (e.clientX - rect.left) / rect.width - 0.5;
            const cy = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-10px) rotateY(${cx * 8}deg) rotateX(${-cy * 8}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();

/* ============ 世界观卡片 3D 倾斜 ============ */
(function worldTilt() {
    document.querySelectorAll('[data-tilt]').forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const cx = (e.clientX - rect.left) / rect.width - 0.5;
            const cy = (e.clientY - rect.top) / rect.height - 0.5;
            el.style.transform = `translateY(-10px) rotateY(${cx * 6}deg) rotateX(${-cy * 6}deg)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
})();

/* ============ 新闻 tab 过滤 ============ */
(function news() {
    const tabs = document.querySelectorAll('.news-tab');
    const items = document.querySelectorAll('.news-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.dataset.tab;
            items.forEach(item => {
                if (cat === 'all' || item.dataset.cat === cat) {
                    item.classList.remove('hide');
                    item.style.animation = 'none';
                    void item.offsetWidth;
                    item.style.animation = 'fadeUp 0.5s forwards';
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });
})();

/* ============ 滚动出现动画 ============ */
(function reveal() {
    const targets = document.querySelectorAll(
        '.section-header, .char-card, .world-card, .news-item, .platform, .qr-block'
    );
    targets.forEach(t => t.classList.add('reveal'));

    const obs = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('in'), i * 60);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    targets.forEach(t => obs.observe(t));
})();

/* ============ 音乐切换 ============ */
(function music() {
    const btn = document.getElementById('musicToggle');
    let on = true;
    btn.addEventListener('click', () => {
        on = !on;
        btn.classList.toggle('muted', !on);
    });
})();

/* ============ 字符悬停闪烁 ============ */
(function titleGlitch() {
    const chars = document.querySelectorAll('.title-char');
    chars.forEach(c => {
        c.addEventListener('mouseenter', () => {
            const original = c.textContent;
            const random = ['#', '$', '%', '&', '@', '*'];
            let count = 0;
            const interval = setInterval(() => {
                c.textContent = random[Math.floor(Math.random() * random.length)];
                count++;
                if (count > 3) {
                    clearInterval(interval);
                    c.textContent = original;
                }
            }, 50);
        });
    });
})();

/* ============ 视差滚动效果（各 section） ============ */
(function scrollParallax() {
    const heroBg = document.querySelector('.hero-bg');
    const worldBg = document.querySelector('.world-bg');
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (heroBg) heroBg.style.transform = `translateY(${y * 0.3}px)`;
        if (worldBg) {
            const worldEl = document.getElementById('world');
            const top = worldEl.offsetTop;
            const offset = y - top;
            worldBg.style.transform = `translateY(${offset * 0.15}px)`;
        }
    }, { passive: true });
})();

/* ============ 数据数字滚动（meta） ============ */
(function counters() {
    const metas = document.querySelectorAll('.meta-num');
    const animated = new WeakSet();

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated.has(entry.target)) {
                animated.add(entry.target);
                const el = entry.target;
                const text = el.textContent;
                const num = parseFloat(text);
                if (!isNaN(num)) {
                    const suffix = text.replace(/[0-9.]/g, '');
                    let cur = 0;
                    const step = num / 40;
                    const t = setInterval(() => {
                        cur += step;
                        if (cur >= num) { cur = num; clearInterval(t); }
                        el.textContent = (num % 1 === 0 ? Math.floor(cur) : cur.toFixed(1)) + suffix;
                    }, 30);
                }
            }
        });
    }, { threshold: 0.5 });
    metas.forEach(m => obs.observe(m));
})();
