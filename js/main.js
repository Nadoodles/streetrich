(function () {
  'use strict';

  const { DROP, PRODUCTS, LOOKS, CODES, FREE_SHIPPING, renderGarment, renderLook } = window.SRF;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const money = v => '$' + v.toFixed(2);
  const pad = v => String(v).padStart(2, '0');
  const byId = id => PRODUCTS.find(p => p.id === id);

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
    }
  };

  function media(p, side) {
    const src = p[side];
    return src ? `<img src="${src}" alt="${p.name}, ${side}" loading="lazy">` : renderGarment(p, side);
  }

  /* ---------------- toast ---------------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 2600);
  }

  /* ---------------- header ---------------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuBtn = $('#menuBtn');
  const menu = $('#mobileMenu');
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  }
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

  /* ---------------- hero ---------------- */
  const hero = $('.hero');
  const video = $('.hero-video');
  video.addEventListener('loadeddata', () => hero.classList.add('has-video'));

  const bokeh = $('#bokeh');
  const lights = ['#ffb347', '#ff4a3d', '#fff2d6', '#ffd27a', '#ff6a2b'];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    const size = 6 + Math.random() * 26;
    s.style.cssText = `left:${Math.random() * 100}%;top:${40 + Math.random() * 40}%;width:${size}px;height:${size}px;background:${lights[i % lights.length]};animation-delay:${-Math.random() * 6}s;animation-duration:${4 + Math.random() * 5}s`;
    bokeh.appendChild(s);
  }

  /* ---------------- featured drop + countdown ---------------- */
  const dropProduct = byId(DROP.productId);
  $('#dropName').textContent = DROP.name;
  $('#dropBlurb').textContent = DROP.blurb;
  const dropArt = $('#dropArt');
  dropArt.innerHTML = `<div class="view view-front">${media(dropProduct, 'front')}</div><div class="view view-back is-on">${media(dropProduct, 'back')}</div>`;
  $$('.drop-toggle button').forEach(btn => btn.addEventListener('click', () => {
    $$('.drop-toggle button').forEach(b => b.classList.toggle('is-active', b === btn));
    $$('.view', dropArt).forEach(v => v.classList.toggle('is-on', v.classList.contains('view-' + btn.dataset.view)));
  }));

  const units = Object.fromEntries($$('#countdown [data-unit]').map(el => [el.dataset.unit, el]));
  const heroCountdown = $('#heroCountdown');
  const dropTime = new Date(DROP.date).getTime();
  function tick() {
    const diff = dropTime - Date.now();
    if (diff <= 0) {
      Object.values(units).forEach(el => (el.textContent = '00'));
      heroCountdown.textContent = 'Live now';
      return;
    }
    const d = Math.floor(diff / 864e5);
    const h = Math.floor(diff / 36e5) % 24;
    const m = Math.floor(diff / 6e4) % 60;
    const s = Math.floor(diff / 1e3) % 60;
    units.d.textContent = pad(d);
    units.h.textContent = pad(h);
    units.m.textContent = pad(m);
    units.s.textContent = pad(s);
    heroCountdown.textContent = `${pad(d)}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  }
  tick();
  setInterval(tick, 1000);

  /* ---------------- product grid ---------------- */
  const grid = $('#grid');
  grid.innerHTML = PRODUCTS.map((p, i) => {
    const sizes = p.sizes.map(s => {
      const out = p.soldOut || p.out.includes(s);
      return `<button type="button" class="size" data-size="${s}" ${out ? `disabled aria-label="${s} sold out"` : `aria-label="Add ${p.name}, size ${s}, to bag"`}>${s}</button>`;
    }).join('');
    return `
      <article class="card${p.soldOut ? ' is-sold' : ''}" data-id="${p.id}" data-cat="${p.category}" data-flash style="--d:${(i % 3) * 90}ms">
        <button class="card-media" type="button" aria-label="Show the back of the ${p.name}">
          <span class="view view-front">${media(p, 'front')}</span>
          <span class="view view-back">${media(p, 'back')}</span>
          ${p.soldOut ? '<span class="card-tag">Sold out</span>' : ''}
        </button>
        <div class="card-info">
          <h3 class="card-name">${p.name}</h3>
          <p class="card-meta">${p.color}</p>
          <p class="card-price">${p.soldOut ? 'Sold out' : money(p.price)}</p>
          <div class="sizes" role="group" aria-label="${p.name} sizes">${sizes}</div>
        </div>
      </article>`;
  }).join('');

  grid.addEventListener('click', e => {
    const size = e.target.closest('.size');
    if (size) {
      const card = size.closest('.card');
      addToCart(card.dataset.id, size.dataset.size);
      return;
    }
    const mediaBtn = e.target.closest('.card-media');
    if (mediaBtn && !finePointer) mediaBtn.closest('.card').classList.toggle('show-back');
  });

  function applyFilter(filter) {
    let count = 0;
    $$('.card', grid).forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.hidden = !show;
      if (show) count++;
    });
    $$('.chip').forEach(c => c.classList.toggle('is-active', c.dataset.filter === filter));
    $('#shopCount').textContent = `${pad(count)} ${count === 1 ? 'piece' : 'pieces'}`;
  }
  $$('.chip').forEach(chip => chip.addEventListener('click', () => applyFilter(chip.dataset.filter)));
  $$('[data-filter-link]').forEach(a => a.addEventListener('click', () => applyFilter(a.dataset.filterLink)));
  applyFilter('all');

  /* ---------------- bag ---------------- */
  const cart = store.get('srf-cart', { items: [], code: null });
  cart.items = cart.items.filter(i => byId(i.id));
  const drawer = $('#drawer');
  const bagBtn = $('#bagBtn');
  let lastFocus = null;

  function saveCart() { store.set('srf-cart', cart); }

  function addToCart(id, size) {
    const line = cart.items.find(i => i.id === id && i.size === size);
    if (line) line.qty++;
    else cart.items.push({ id, size, qty: 1 });
    saveCart();
    renderCart();
    bagBtn.classList.remove('bump');
    void bagBtn.offsetWidth;
    bagBtn.classList.add('bump');
    openBag();
  }

  function totals() {
    const subtotal = cart.items.reduce((sum, i) => sum + byId(i.id).price * i.qty, 0);
    const code = cart.code && CODES[cart.code];
    const discount = code ? Math.round(subtotal * code.pct * 100) / 100 : 0;
    return { subtotal, discount, code, total: subtotal - discount };
  }

  function renderCart() {
    const count = cart.items.reduce((n, i) => n + i.qty, 0);
    $('#bagCount').textContent = count;
    $('#drawerCount').textContent = count ? `(${count})` : '';
    const body = $('#cartItems');
    const foot = $('#cartFoot');

    if (!count) {
      body.innerHTML = `<div class="empty"><p class="empty-script">Your bag is empty</p><a class="btn btn-ghost" href="#shop" data-close>Shop the collection</a></div>`;
      foot.hidden = true;
      $('#shipBar').innerHTML = '';
      return;
    }
    foot.hidden = false;
    body.innerHTML = cart.items.map((i, idx) => {
      const p = byId(i.id);
      return `
        <div class="line-item">
          <div class="li-thumb">${media(p, 'front')}</div>
          <div class="li-info">
            <p class="li-name">${p.name}</p>
            <p class="li-meta">${p.color} / ${i.size}</p>
            <div class="qty" role="group" aria-label="Quantity">
              <button type="button" data-qty="-1" data-idx="${idx}" aria-label="Decrease quantity">−</button>
              <span>${i.qty}</span>
              <button type="button" data-qty="1" data-idx="${idx}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="li-right">
            <p>${money(p.price * i.qty)}</p>
            <button type="button" class="li-remove" data-remove="${idx}">Remove</button>
          </div>
        </div>`;
    }).join('');

    const t = totals();
    $('#subtotal').textContent = money(t.subtotal);
    $('#discountRow').hidden = !t.code;
    if (t.code) {
      $('#discountLabel').textContent = `${cart.code} — ${Math.round(t.code.pct * 100)}% off`;
      $('#discount').textContent = '−' + money(t.discount);
    }
    $('#total').textContent = money(t.total);
    const free = t.subtotal >= FREE_SHIPPING;
    $('#shipping').textContent = free ? 'Free' : 'Calculated at checkout';
    const pct = Math.min(100, (t.subtotal / FREE_SHIPPING) * 100);
    $('#shipBar').innerHTML = `<p>${free ? 'You unlocked free shipping.' : `You're ${money(FREE_SHIPPING - t.subtotal)} away from free shipping`}</p><div class="bar"><span style="width:${pct}%"></span></div>`;
  }

  $('#cartItems').addEventListener('click', e => {
    const q = e.target.closest('[data-qty]');
    const rm = e.target.closest('[data-remove]');
    if (q) {
      const line = cart.items[+q.dataset.idx];
      line.qty += +q.dataset.qty;
      if (line.qty < 1) cart.items.splice(+q.dataset.idx, 1);
    } else if (rm) {
      cart.items.splice(+rm.dataset.remove, 1);
    } else if (e.target.closest('[data-close]')) {
      closeBag();
      return;
    } else return;
    saveCart();
    renderCart();
  });

  function openBag() {
    if (document.body.classList.contains('bag-open')) return;
    lastFocus = document.activeElement;
    document.body.classList.add('bag-open');
    drawer.setAttribute('aria-hidden', 'false');
    setTimeout(() => $('#drawerClose').focus(), 50);
  }
  function closeBag() {
    document.body.classList.remove('bag-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  bagBtn.addEventListener('click', openBag);
  $('#drawerClose').addEventListener('click', closeBag);
  $('#overlay').addEventListener('click', closeBag);
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.body.classList.contains('bag-open')) closeBag();
    if (!menu.hidden) setMenu(false);
  });

  function applyCode(raw) {
    const code = raw.trim().toUpperCase();
    if (!CODES[code]) { toast('That code isn\'t valid.'); return false; }
    cart.code = code;
    saveCart();
    renderCart();
    return true;
  }

  // Promo box and dice are commented out in index.html for now; drop any code saved earlier.
  const promoForm = $('#promoForm');
  if (!promoForm && !$('#rollBtn')) cart.code = null;
  promoForm?.addEventListener('submit', e => {
    e.preventDefault();
    if (applyCode($('#promoInput').value)) {
      $('#promoInput').value = '';
      toast(`${cart.code} applied.`);
    }
  });
  $('#checkoutBtn').addEventListener('click', () => toast('Checkout is disabled in this demo.'));
  renderCart();

  /* ---------------- lookbook ---------------- */
  const track = $('#lbTrack');
  track.innerHTML = LOOKS.map((l, i) => `
    <figure class="look" data-flash style="--d:${Math.min(i, 3) * 90}ms">
      ${renderLook(l)}
      <figcaption>
        <span class="look-no">No. ${pad(i + 1)}</span>
        <span class="look-title">${l.title}</span>
        <span class="look-place">${l.place}</span>
      </figcaption>
    </figure>`).join('') + `
    <a class="look look-cta" href="https://www.instagram.com/streetrichfellasofficial/" target="_blank" rel="noopener" data-flash>
      <span class="gothic">Rep the Fellas</span>
      <span class="look-place">Tag @streetrichfellasofficial to get featured</span>
      <span class="btn btn-light">Follow on Instagram</span>
    </a>`;

  const step = () => (track.querySelector('.look')?.offsetWidth || 300) + 12;
  $('#lbPrev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('#lbNext').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  // Mouse drag-to-scroll (touch already scrolls natively)
  let drag = null;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    drag = { x: e.clientX, left: track.scrollLeft, moved: false };
  });
  addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) {
      drag.moved = true;
      track.classList.add('is-dragging');
    }
    track.scrollLeft = drag.left - dx;
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    track.classList.remove('is-dragging');
    if (moved) track.addEventListener('click', ev => ev.preventDefault(), { capture: true, once: true });
  });

  /* ---------------- flash reveal on scroll ---------------- */
  const flashEls = $$('[data-flash]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    flashEls.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    flashEls.forEach(el => io.observe(el));
  }

  /* ---------------- rhinestone cursor ---------------- */
  if (finePointer && !reduceMotion) {
    let last = 0;
    addEventListener('pointermove', e => {
      const now = performance.now();
      if (now - last < 38) return;
      last = now;
      const s = document.createElement('span');
      const size = 5 + Math.random() * 10;
      s.className = 'sparkle' + (Math.random() < 0.3 ? ' gold' : '');
      s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;--dx:${(Math.random() - 0.5) * 36}px;--dy:${12 + Math.random() * 28}px;--r:${Math.random() * 90}deg`;
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    }, { passive: true });
  }

  /* ---------------- dice (panel is commented out in index.html for now) ---------------- */
  const rollBtn = $('#rollBtn');
  if (rollBtn) initDice();

  function initDice() {
    const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
    const dice = [$('#die1'), $('#die2')];
    const roll6 = () => 1 + Math.floor(Math.random() * 6);
    function setFace(el, face) {
      el.innerHTML = Array.from({ length: 9 }, (_, i) => `<i class="${PIPS[face].includes(i) ? 'on' : ''}"></i>`).join('');
    }
    setFace(dice[0], 5);
    setFace(dice[1], 2);

    const result = $('#rollResult');
    rollBtn.addEventListener('click', () => {
      rollBtn.disabled = true;
      result.innerHTML = '';
      dice.forEach(d => d.classList.add('rolling'));
      const spin = setInterval(() => dice.forEach(d => setFace(d, roll6())), 80);
      setTimeout(() => {
        clearInterval(spin);
        const a = roll6();
        const b = roll6();
        setFace(dice[0], a);
        setFace(dice[1], b);
        dice.forEach(d => d.classList.remove('rolling'));
        const sum = a + b;
        let code = 'FELLAS10';
        let line = `You rolled ${sum}. Not bad.`;
        if (sum === 7 || sum === 11) { code = 'LUCKY20'; line = `${sum}! Lucky roll.`; }
        else if (a === b) { code = 'DOUBLES15'; line = `Doubles! ${a} and ${b}.`; }
        cart.code = code;
        saveCart();
        renderCart();
        result.innerHTML = `
          <p class="roll-line">${line}</p>
          <p class="roll-pct">${Math.round(CODES[code].pct * 100)}% off</p>
          <button type="button" class="code" id="copyCode" aria-label="Copy code ${code}">${code}<small>Tap to copy</small></button>
          <p class="roll-note">Applied to your bag automatically.</p>`;
        $('#copyCode').addEventListener('click', () => {
          navigator.clipboard?.writeText(code).then(() => toast('Code copied.'), () => toast(code));
        });
        rollBtn.textContent = 'Roll again';
        rollBtn.disabled = false;
      }, reduceMotion ? 50 : 1000);
    });
  }

  /* ---------------- newsletter signup (demo only) ---------------- */
  $('#signup').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    const msg = $('#formMsg');
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      msg.textContent = email ? 'That email doesn\'t look right.' : 'Drop your email.';
      msg.className = 'form-msg is-error';
      return;
    }
    form.reset();
    msg.textContent = 'You\'re in. Check your inbox.';
    msg.className = 'form-msg is-ok';
  });
})();
