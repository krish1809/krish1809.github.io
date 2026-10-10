(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Theme ---------- */
  const themeColor = $('meta[name="theme-color"]');
  const syncThemeColor = () => themeColor?.setAttribute('content', root.dataset.theme === 'light' ? '#f7f6f1' : '#09090b');
  syncThemeColor();

  $('.theme-toggle')?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* storage unavailable */ }
    syncThemeColor();
  });

  /* ---------- Nav: scrolled state + progress bar ---------- */
  const nav = $('.nav');
  const progress = $('.progress');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      nav.classList.toggle('is-scrolled', y > 12);
      progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('.menu-toggle');
  const menu = $('#mobile-menu');
  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  };
  menuBtn?.addEventListener('click', () => setMenu(menu.hidden));
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  window.matchMedia('(min-width: 821px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Active section in nav ---------- */
  const navLinks = $$('.nav__links a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => { const s = $(a.hash); if (s) sectionObserver.observe(s); });
  // clear the highlight when back at the hero
  const hero = $('.hero');
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) navLinks.forEach((a) => a.classList.remove('is-active'));
  }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Pointer effects ---------- */
  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
      hero.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
    $$('.card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - r.left}px`);
        card.style.setProperty('--y', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Copy email ---------- */
  const toast = $('.toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2200);
  };
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.classList.add('is-done');
        showToast('Email copied to clipboard');
        setTimeout(() => btn.classList.remove('is-done'), 1800);
      } catch (e) {
        window.location.href = `mailto:${btn.dataset.copy}`;
      }
    });
  });

  /* ---------- Footer clock + year ---------- */
  const clock = $('#clock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
    const tick = () => { clock.textContent = `${fmt.format(new Date())} IST`; };
    tick();
    setInterval(tick, 30000);
  }
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Hero terminal replay ---------- */
  const SCRIPTS = {
    devpilot: {
      title: 'run #6 · krish1809/devpilot-demo#4',
      href: '#project-devpilot',
      lines: [
        ['q', 'issue', '"the weather report shows the wrong Celsius temperature"'],
        ['', 'retrieve', 'hybrid search · pgvector + full-text'],
        ['', 'localize', 'weather.py → units.py (the real bug)'],
        ['', 'plan', 'to_celsius(): 5 / 8 → 5 / 9'],
        ['', 'test', 'docker sandbox · no network · passed'],
        ['wait', 'review', 'approval bound to the diff’s SHA-256'],
        ['ok', 'approved', 'opened PR #5 · 2 LLM calls · 2,337 tokens'],
      ],
    },
    aura: {
      title: 'why this reply? · what Aura noticed',
      href: '#project-aura',
      lines: [
        ['q', 'you', '"maybe I could make a small study plan for tomorrow"'],
        ['', 'feeling', 'calm / neutral · 93%'],
        ['', 'voice', 'not a voice message'],
        ['', 'face', 'camera off'],
        ['', 'cause', 'kept from earlier: "my mom keeps comparing me to my cousin"'],
        ['', 'topic', 'studies & exams · 81%'],
        ['', 'strategy', 'offered reassurance · 32%'],
        ['ok', 'aura', '"It sounds like you’re already taking steps towards managing your anxiety."'],
      ],
    },
    chat: {
      title: 'message lifecycle · #project-team',
      href: '#project-chat',
      lines: [
        ['q', 'send', '"@Asha can you review the threat model part?"'],
        ['', 'sign', 'ECDSA P-256 · per-browser key'],
        ['', 'route', 'Go load balancer · TLS · WebSocket'],
        ['', 'check', 'sender is a member of #project-team'],
        ['', 'encrypt', 'AES-256-GCM · fresh 12-byte nonce'],
        ['', 'store', 'MongoDB, before broadcast'],
        ['ok', 'verify', 'signature valid · GCM tag intact'],
      ],
    },
  };

  const term = $('.term');
  if (term) {
    const tabs = $$('[role="tab"]', term);
    const panel = $('[role="tabpanel"]', term);
    const title = $('.term__title', term);
    const list = $('.term__lines', term);
    const jump = $('.term__jump', term);
    const order = tabs.map((t) => t.dataset.tab);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let runId = 0;
    let visible = true;

    const makeLine = (kind, key, value) => {
      const li = document.createElement('li');
      li.className = kind ? `ln ln--${kind}` : 'ln';
      const k = document.createElement('span');
      k.className = 'ln__k';
      k.textContent = key;
      const v = document.createElement('span');
      v.className = 'ln__v';
      v.textContent = value;
      li.append(k, v);
      return li;
    };

    const selectTab = (i) => {
      tabs.forEach((t, j) => {
        t.setAttribute('aria-selected', String(i === j));
        t.tabIndex = i === j ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', tabs[i].id);
      const s = SCRIPTS[order[i]];
      title.textContent = s.title;
      jump.setAttribute('href', s.href);
      return s;
    };

    const play = async (i) => {
      const id = ++runId;
      const s = selectTab(i);
      list.textContent = '';

      if (reduceMotion) {
        s.lines.forEach((l) => list.append(makeLine(...l)));
        return;
      }

      const caret = document.createElement('span');
      caret.className = 'caret';
      for (const [kind, key, value] of s.lines) {
        if (id !== runId) return;
        const li = makeLine(kind, key, '');
        const out = li.lastChild;
        const text = document.createTextNode('');
        out.append(text, caret);
        list.append(li);
        const delay = value.length > 44 ? 11 : 17;
        for (let c = 1; c <= value.length; c++) {
          if (id !== runId) return;
          text.data = value.slice(0, c);
          await sleep(delay);
        }
        await sleep(240);
      }
      await sleep(4200);
      while (!visible || document.hidden) { if (id !== runId) return; await sleep(400); }
      if (id === runId) play((i + 1) % order.length);
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => play(i));
      tab.addEventListener('keydown', (e) => {
        const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        const next = (i + dir + tabs.length) % tabs.length;
        tabs[next].focus();
        play(next);
      });
    });

    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(term);
    play(0);
  }
})();
