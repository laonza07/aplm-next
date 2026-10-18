/* No runtime dependencies. catalog.js is generated from the original OASS snapshot. */
(() => {
  'use strict';
  const catalog = window.APLM_CATALOG;
  if (!catalog) return;
  const { links, categories, menus, news } = catalog;
  const byId = new Map(links.map(link => [link.id, link]));
  const arrow = '<span aria-hidden="true">↗</span>';
  const chevron = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function safeUrl(url) { try { const parsed = new URL(url); return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : null; } catch { return null; } }
  function anchor(link, label, className = '') {
    if (!link || !safeUrl(link.url)) return '';
    return `<a class="${className}" href="${escape(link.url)}" target="_blank" rel="noopener noreferrer">${escape(label || link.label)}</a>`;
  }
  document.querySelectorAll('[data-oass]').forEach(element => {
    const item = byId.get(Number(element.dataset.oass));
    if (!item || !safeUrl(item.url)) return;
    element.href = item.url;
    element.target = '_blank';
    element.rel = 'noopener noreferrer';
  });
  const navGroups = document.querySelector('#nav-groups');
  navGroups.innerHTML = menus.map(menu => `<div class="nav-group"><button class="menu-trigger" aria-expanded="false" aria-controls="menu-${menu.id}">${escape(menu.label)}${chevron}</button><div class="mega-menu" id="menu-${menu.id}" hidden><div class="mega-grid">${menu.columns.map(column => `<section class="mega-column"><h3>${escape(column.title)}</h3><ul>${column.ids.map(id => `<li>${anchor(byId.get(id), catalog.labels[id])}</li>`).join('')}</ul>${column.category ? `<a class="menu-all" href="#directory" data-select="${column.category}">ดูทั้งหมด →</a>` : ''}</section>`).join('')}</div><div class="mega-bottom">รวมบริการจาก OASS <a href="#directory">ค้นหาบริการทั้งหมด ↗</a></div></div></div>`).join('');
  const triggers = [...document.querySelectorAll('.menu-trigger')];
  function closeMenus(except) {
    triggers.forEach(trigger => { if (trigger === except) return; trigger.setAttribute('aria-expanded', 'false'); document.getElementById(trigger.getAttribute('aria-controls')).hidden = true; });
  }
  triggers.forEach(trigger => trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') !== 'true';
    closeMenus(trigger);
    trigger.setAttribute('aria-expanded', String(open));
    document.getElementById(trigger.getAttribute('aria-controls')).hidden = !open;
  }));
  document.addEventListener('click', event => { if (!event.target.closest('.navigation')) closeMenus(); });
  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('#navigation');
  function closeMobile() { navigation.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'เปิดเมนูหลัก'); }
  toggle.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'ปิดเมนูหลัก' : 'เปิดเมนูหลัก');
    if (!open) closeMenus();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const expanded = triggers.find(trigger => trigger.getAttribute('aria-expanded') === 'true');
    if (expanded) { closeMenus(); expanded.focus(); }
    else if (navigation.classList.contains('is-open')) { closeMobile(); toggle.focus(); }
  });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) { closeMenus(); closeMobile(); } });
  matchMedia('(min-width:901px)').addEventListener('change', event => { if (event.matches) { closeMobile(); closeMenus(); } });
  document.querySelector('#news-list').innerHTML = news.map(item => `<a class="news-item" href="${escape(byId.get(item.id).url)}" target="_blank" rel="noopener noreferrer"><div><span class="news-category">${escape(item.category)}</span><h3>${escape(item.title)}</h3><p>อ่านประกาศจากแหล่งข้อมูลต้นทาง</p></div>${arrow}</a>`).join('');

  const input = document.querySelector('#service-search');
  const results = document.querySelector('#directory-results');
  const filters = document.querySelector('#filters');
  const clear = document.querySelector('#clear-search');
  const more = document.querySelector('#load-more');
  const empty = document.querySelector('#empty-state');
  const count = document.querySelector('#result-count');
  const defaultLimit = 12;
  const priority = [178,183,180,181,182,184,22,69,70,2,4,191];
  const orderedLinks = [...links].sort((a,b) => {
    const rank = id => priority.includes(id) ? priority.indexOf(id) : priority.length + id;
    return rank(a.id) - rank(b.id);
  });
  let active = 'all', limit = defaultLimit;
  const normalize = text => String(text).normalize('NFC').toLocaleLowerCase('th').replace(/\s+/g, ' ').trim();
  filters.innerHTML = [{id:'all',label:'ทั้งหมด'}, ...categories].map(category => `<button type="button" class="filter" data-category="${category.id}" aria-pressed="${category.id === active}">${escape(category.label)}</button>`).join('');
  const categoryName = id => categories.find(category => category.id === id)?.label || 'ลิงก์ต้นฉบับ';
  function render() {
    const query = normalize(input.value);
    const matched = orderedLinks.filter(link => (active === 'all' || link.category === active) && (!query || normalize(`${link.label} ${link.originalLabel} ${categoryName(link.category)} ${link.url}`).includes(query)));
    const visible = matched.slice(0, limit);
    results.innerHTML = visible.map(link => `<a class="directory-link" href="${escape(link.url)}" target="_blank" rel="noopener noreferrer"><small>${escape(categoryName(link.category))}${/\.pdf(?:$|[?#])/i.test(link.url) ? ' · PDF' : ''}</small><h3>${escape(link.label)}</h3>${link.warning ? `<span class="link-warning">${escape(link.warning)}</span>` : ''}<span class="external-arrow" aria-hidden="true">↗</span></a>`).join('');
    count.textContent = `พบ ${matched.length} รายการ · แสดง ${visible.length} รายการ`;
    empty.hidden = matched.length > 0;
    more.hidden = visible.length >= matched.length;
    if (!more.hidden) more.firstChild.textContent = `แสดงเพิ่มเติม (${matched.length - visible.length} รายการ) `;
    clear.hidden = !input.value;
    filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === active)));
  }
  filters.addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (!button) return; active = button.dataset.category; limit = defaultLimit; render(); });
  document.addEventListener('click', event => {
    const selected = event.target.closest('[data-select]');
    if (!selected) return;
    active = selected.dataset.select;
    limit = defaultLimit;
    input.value = '';
    render();
    closeMenus(); closeMobile();
  });
  input.addEventListener('input', () => { limit = defaultLimit; render(); });
  document.querySelector('.search-form').addEventListener('submit', event => { event.preventDefault(); render(); });
  clear.addEventListener('click', () => { input.value = ''; limit = defaultLimit; render(); input.focus(); });
  document.querySelector('#reset-search').addEventListener('click', () => { active = 'all'; input.value = ''; limit = defaultLimit; render(); input.focus(); });
  more.addEventListener('click', () => { limit += defaultLimit; render(); });
  render();

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero');
  const art = document.querySelector('.hero-art');
  const word = document.querySelector('.hero-word');
  const progress = document.querySelector('.reading-progress');
  let scheduled = false;
  function paintScroll() {
    scheduled = false;
    const range = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? Math.min(1, scrollY / range) : 0})`;
    if (reducedMotion.matches) { art.style.transform = ''; word.style.transform = ''; return; }
    const box = hero.getBoundingClientRect();
    if (box.bottom > 0 && box.top < innerHeight) {
      const offset = Math.max(0, -box.top);
      art.style.transform = `translate3d(0,${Math.min(offset * .14, 100)}px,0)`;
      word.style.transform = `translate3d(0,${Math.min(offset * .23, 150)}px,0)`;
    }
    const backToTop = document.querySelector('#backToTop');
    if (backToTop) {
      if (scrollY > 300) backToTop.classList.add('is-visible');
      else backToTop.classList.remove('is-visible');
    }
  }
  function scheduleScroll() { if (!scheduled) { scheduled = true; requestAnimationFrame(paintScroll); } }
  addEventListener('scroll', scheduleScroll, {passive:true});
  addEventListener('resize', scheduleScroll, {passive:true});
  reducedMotion.addEventListener('change', scheduleScroll);
  paintScroll();
  const backToTopBtn = document.querySelector('#backToTop');
  if (backToTopBtn) backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── PR News Tabs ── */
  const prTabs = document.querySelectorAll('.pr-tab');
  const prPanels = document.querySelectorAll('.pr-tab-panel');
  prTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      prTabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      prPanels.forEach(p => { p.classList.remove('is-active'); p.hidden = true; });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('pr-' + target);
      if (panel) { panel.classList.add('is-active'); panel.hidden = false; }
    });
  });

  /* ── Activities Carousel ── */
  const carouselSection = document.querySelector('#activities');
  const carouselTrack = document.querySelector('#carouselTrack');
  const carouselSlides = document.querySelectorAll('.carousel-slide');
  const carouselPrev = document.querySelector('#carouselPrev');
  const carouselNext = document.querySelector('#carouselNext');
  const carouselDots = document.querySelector('#carouselDots');

  if (carouselTrack && carouselSlides.length > 0) {
    let currentSlide = 0;
    let autoSlideTimer = null;

    const getVisibleCount = () => {
      if (window.innerWidth <= 900) return 1;
      if (window.innerWidth <= 1200) return 2;
      return 3;
    };

    const getMaxIndex = () => Math.max(0, carouselSlides.length - getVisibleCount());

    const renderDots = () => {
      if (!carouselDots) return;
      const max = getMaxIndex();
      carouselDots.innerHTML = Array.from({ length: max + 1 }, (_, i) => 
        `<button class="carousel-dot${i === currentSlide ? ' is-active' : ''}" type="button" aria-label="สไลด์ชุดที่ ${i + 1}" data-index="${i}"></button>`
      ).join('');
    };

    const updateCarousel = (index) => {
      const max = getMaxIndex();
      currentSlide = Math.max(0, Math.min(index, max));
      const firstSlide = carouselSlides[0];
      const gap = 24;
      const slideWidth = firstSlide.getBoundingClientRect().width;
      const offset = (slideWidth + gap) * currentSlide;
      carouselTrack.style.transform = `translateX(-${offset}px)`;

      if (carouselDots) {
        carouselDots.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
          dot.classList.toggle('is-active', idx === currentSlide);
        });
      }
    };

    const nextSlide = () => {
      const max = getMaxIndex();
      updateCarousel(currentSlide >= max ? 0 : currentSlide + 1);
    };

    const prevSlide = () => {
      const max = getMaxIndex();
      updateCarousel(currentSlide <= 0 ? max : currentSlide - 1);
    };

    if (carouselNext) carouselNext.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    if (carouselPrev) carouselPrev.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

    if (carouselDots) {
      carouselDots.addEventListener('click', (e) => {
        const dot = e.target.closest('[data-index]');
        if (!dot) return;
        updateCarousel(Number(dot.dataset.index));
        resetAutoSlide();
      });
    }

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextSlide, 5000);
    };

    const stopAutoSlide = () => {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    };

    const resetAutoSlide = () => {
      stopAutoSlide();
      startAutoSlide();
    };

    if (carouselSection) {
      carouselSection.addEventListener('mouseenter', stopAutoSlide);
      carouselSection.addEventListener('mouseleave', startAutoSlide);
      carouselSection.addEventListener('touchstart', stopAutoSlide, { passive: true });
      carouselSection.addEventListener('touchend', startAutoSlide, { passive: true });
    }

    // Touch swipe support
    let touchStartX = 0;
    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
        resetAutoSlide();
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      renderDots();
      updateCarousel(currentSlide);
    }, { passive: true });

    renderDots();
    updateCarousel(0);
    startAutoSlide();
  }

  /* ── Collapsible Floating CTA Dock ── */
  const floatingDock = document.querySelector('#floatingDock');
  const floatingToggle = document.querySelector('#floatingToggle');
  const floatingTooltip = document.querySelector('#floatingToggleTooltip');

  if (floatingDock && floatingToggle) {
    const setCollapsed = (collapsed) => {
      floatingDock.classList.toggle('is-collapsed', collapsed);
      floatingToggle.setAttribute('aria-expanded', String(!collapsed));
      floatingToggle.setAttribute('aria-label', collapsed ? 'เปิดเมนูด่วน' : 'พับเก็บเมนูด่วน');
      if (floatingTooltip) {
        floatingTooltip.textContent = collapsed ? 'เปิดเมนูด่วน' : 'พับเก็บเมนู';
      }
    };

    floatingToggle.addEventListener('click', () => {
      const isNowCollapsed = !floatingDock.classList.contains('is-collapsed');
      setCollapsed(isNowCollapsed);
      try {
        localStorage.setItem('aplm_cta_collapsed', String(isNowCollapsed));
      } catch (err) {}
    });

    try {
      if (localStorage.getItem('aplm_cta_collapsed') === 'true') {
        setCollapsed(true);
      }
    } catch (err) {}
  }

  /* ── Hero Video Background Controls ── */
  const heroVideo = document.querySelector('#heroVideo');
  const heroSoundToggle = document.querySelector('#heroSoundToggle');
  const heroPlayToggle = document.querySelector('#heroPlayToggle');
  const soundLabel = document.querySelector('#soundLabel');

  if (heroVideo) {
    if (reducedMotion.matches) {
      heroVideo.pause();
      if (heroPlayToggle) heroPlayToggle.classList.add('is-paused');
    }

    if (heroSoundToggle) {
      heroSoundToggle.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        heroSoundToggle.classList.toggle('is-unmuted', !heroVideo.muted);
        if (soundLabel) {
          soundLabel.textContent = heroVideo.muted ? 'เปิดเสียง' : 'ปิดเสียง';
        }
        heroSoundToggle.setAttribute('aria-label', heroVideo.muted ? 'เปิดเสียงวิดีโอ' : 'ปิดเสียงวิดีโอ');
      });
    }

    if (heroPlayToggle) {
      heroPlayToggle.addEventListener('click', () => {
        if (heroVideo.paused) {
          heroVideo.play();
          heroPlayToggle.classList.remove('is-paused');
          heroPlayToggle.setAttribute('aria-label', 'หยุดวิดีโอชั่วคราว');
        } else {
          heroVideo.pause();
          heroPlayToggle.classList.add('is-paused');
          heroPlayToggle.setAttribute('aria-label', 'เล่นวิดีโอ');
        }
      });
    }
  }
})();
