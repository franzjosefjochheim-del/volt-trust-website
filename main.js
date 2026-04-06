// VOLT TRUST main.js v8
document.addEventListener('DOMContentLoaded', () => {

  // NAV SCROLL SHADOW
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.style.boxShadow = window.scrollY > 40 ? '0 2px 24px rgba(17,32,24,.3)' : 'none';
  });

  // MOBILE MENU
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('navMobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (!isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ACTIVE NAV
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html') || (href !== 'index.html' && href !== '#' && page.startsWith(href.replace('.html','')))) {
      a.classList.add('active');
    }
  });

  // SCROLL REVEAL
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.06 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // SEGMENT TABS
  window.showSeg = function(idx) {
    document.querySelectorAll('.segment-tab').forEach((t, i) => t.classList.toggle('active', i === idx));
    document.querySelectorAll('.segment-panel').forEach((p, i) => p.classList.toggle('active', i === idx));
  };

  // FAQ TOGGLE
  window.toggleFaq = function(el) {
    const ans = el.nextElementSibling;
    const wasOpen = el.classList.contains('open');
    document.querySelectorAll('.faq-question.open').forEach(q => {
      q.classList.remove('open');
      q.nextElementSibling.classList.remove('open');
    });
    if (!wasOpen) { el.classList.add('open'); ans.classList.add('open'); }
  };

  // WISSEN TOGGLE
  window.toggleWissen = function(idx) {
    const artikel = document.getElementById('wissen-artikel-' + idx);
    if (!artikel) return;
    const isOpen = artikel.classList.contains('open');
    document.querySelectorAll('.wissen-artikel').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.wissen-card').forEach(c => c.classList.remove('active'));
    if (!isOpen) {
      artikel.classList.add('open');
      document.querySelectorAll('.wissen-card')[idx]?.classList.add('active');
      setTimeout(() => artikel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    }
  };
  window.closeWissen = function(idx) {
    document.getElementById('wissen-artikel-' + idx)?.classList.remove('open');
    document.querySelectorAll('.wissen-card')[idx]?.classList.remove('active');
  };

  // POTENZIALRECHNER
  window.calcPotenzial = function() {
    const v = document.getElementById('rVerbrauch')?.value;
    const b = document.getElementById('rBranche')?.value;
    const pv = document.getElementById('rPV')?.value || 'nein';
    if (!v || !b) return;
    const base = {
      klein:  {prod:[12000,25000],food:[8000,20000],health:[15000,35000],logistik:[10000,22000],gebaeude:[12000,28000],filiale:[8000,18000],andere:[8000,20000]},
      mittel: {prod:[30000,90000],food:[25000,75000],health:[60000,150000],logistik:[35000,80000],gebaeude:[35000,90000],filiale:[25000,70000],andere:[20000,65000]},
      gross:  {prod:[150000,450000],food:[120000,380000],health:[200000,550000],logistik:[130000,380000],gebaeude:[120000,350000],filiale:[100000,300000],andere:[100000,350000]},
      xl:     {prod:[500000,1800000],food:[400000,1500000],health:[600000,2000000],logistik:[450000,1600000],gebaeude:[400000,1400000],filiale:[350000,1200000],andere:[350000,1500000]}
    };
    let [min, max] = base[v][b] || base[v]['andere'];
    if (pv === 'ja')      { min = Math.round(min * 1.15); max = Math.round(max * 1.2); }
    if (pv === 'geplant') { min = Math.round(min * 1.08); max = Math.round(max * 1.12); }
    const fmt = n => n >= 1000000 ? (n/1000000).toFixed(1) + ' Mio. €' : (Math.round(n/1000)*1000).toLocaleString('de-DE') + ' €';
    const tips = {
      prod:     'Maschinenbetrieb erzeugt ausgeprägte Lastspitzen. Typisch: Beschaffungsoptimierung + BESS für maximalen Hebel.',
      food:     'Kontinuierliche Prozesse und Kühllasten bieten gute Prognostizierbarkeit. Hohe PV-Synergie möglich.',
      health:   '24/7-Grundlast ist ideal für BESS. Zusätzlich USV-Funktion möglich — Versorgungssicherheit als Doppelnutzen.',
      logistik: 'Kühlaggregat-Hochlauf erzeugt extreme Spitzen. Peak Shaving oft mit sehr kurzer Amortisation.',
      gebaeude: 'Morgenlicher Gleichzeitigkeitsbetrieb (HLK) als Hauptlasttreiber. Hohe PV-Synergie auf Dachflächen.',
      filiale:  'Gebündelte Beschaffung als erster großer Hebel. Rollout auf mehrere Standorte senkt Hardware-Kosten um 15–25 %.',
      andere:   'Detaillierte Analyse Ihres spezifischen Lastprofils erforderlich — erste Potenziale sind in fast allen Fällen vorhanden.'
    };
    document.getElementById('rRange').textContent = fmt(min) + ' – ' + fmt(max);
    document.getElementById('rText').textContent = tips[b] || tips.andere;
    document.getElementById('rechnerResult').classList.add('show');
  };
});
