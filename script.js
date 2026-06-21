/* Paul Manaay, Portfolio interactions (shared by index.html and mmu/index.html)
   All numbers come from data/facts.js (window.FACTS). Nothing numeric is hardcoded here.
   1) Inject facts into the DOM (count-up numbers, labels, inline text, platforms, contact)
   2) Videos autoplay muted when scrolled into view, pause when out
   3) Stat numbers count up on enter-viewport
   4) Tap a video's speaker button to unmute */
(function () {
  document.documentElement.classList.add('js'); // progressive enhancement: scroll reveals only hide content when JS is running
  var F = window.FACTS || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Compact form for big stat/badge numbers: 1M+, 300k+, 9.4k+
  function compact(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M';
    if (n >= 1000)    return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
    return n.toLocaleString();
  }
  // Full form for body copy: £3,000+, 533, 1,000,000+
  function full(f) { return (f.prefix || '') + f.value.toLocaleString() + (f.suffix || ''); }

  /* ---- 1. Inject facts ---- */
  // Count-up numbers (stat cards / badges): element carries data-fact-count="key"
  document.querySelectorAll('[data-fact-count]').forEach(function (el) {
    var f = F[el.dataset.factCount];
    if (!f) return;
    el.dataset.count = f.value;
    if (f.prefix) el.dataset.prefix = f.prefix;
    if (f.suffix) el.dataset.suffix = f.suffix;
    if (el.dataset.badgeUnit) el.dataset.unit = el.dataset.badgeUnit; // short suffix after the number
    if (f.proofPending && !window.FACTS_PROOF_READY) el.dataset.proof = '1'; // not yet backed by screenshot + matching LinkedIn
    if (f.full) el.dataset.full = '1'; // show 1,000+ rather than compact 1k+
    el.textContent = (f.prefix || '') + '0' + (f.suffix || '');
  });
  // Labels under a stat: data-fact-label="key" → that fact's unit text
  document.querySelectorAll('[data-fact-label]').forEach(function (el) {
    var f = F[el.dataset.factLabel];
    if (f) el.textContent = f.unit;
  });
  // Inline text mentions in copy: data-fact-text="key" → full number (commas)
  document.querySelectorAll('[data-fact-text]').forEach(function (el) {
    var f = F[el.dataset.factText];
    if (f) el.textContent = full(f);
  });
  // Platforms strip: data-platforms
  document.querySelectorAll('[data-platforms]').forEach(function (el) {
    if (!F.platforms) return;
    el.innerHTML = F.platforms.map(function (p) { return '<span class="platform">' + p + '</span>'; }).join('');
  });
  // Platform count (count-up): data-fact-platform-count → FACTS.platforms.length, kept in sync with the array
  document.querySelectorAll('[data-fact-platform-count]').forEach(function (el) {
    if (!F.platforms) return;
    el.dataset.count = F.platforms.length;
    el.textContent = '0';
  });
  // Contact
  if (F.contact) {
    document.querySelectorAll('[data-fact-email]').forEach(function (a) {
      a.href = 'mailto:' + F.contact.email;
      a.textContent = F.contact.email; // overwrite the no-JS fallback label with the real address
    });
    document.querySelectorAll('[data-fact-linkedin]').forEach(function (a) {
      a.href = F.contact.linkedin;
    });
  }

  // Year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- 2. Videos play on scroll. The in-view video carries sound; the others mute,
     so it is never a wall of audio. Browsers block sound until the first user gesture,
     so we unmute the in-view video the moment the visitor clicks/taps/keys anywhere. ---- */
  var SVG_MUTED = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>';
  var SVG_SOUND = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  var videos = document.querySelectorAll('video.autoplay-on-scroll');
  var audioUnlocked = false;
  function playable(v) { return v.getAttribute('src') || v.querySelector('source'); }
  function muteBtn(v) { var c = v.closest('.media-card, .pg'); return c ? c.querySelector('.mute-toggle') : null; }
  function setBtn(v) {
    var b = muteBtn(v); if (!b) return;
    b.innerHTML = v.muted ? SVG_MUTED : SVG_SOUND;
    b.setAttribute('aria-pressed', String(!v.muted));
    b.setAttribute('aria-label', v.muted ? 'Unmute video' : 'Mute video');
  }
  function soloSound(v) { // mute every other video; give this one sound once unlocked
    videos.forEach(function (o) { if (o !== v) { o.muted = true; setBtn(o); } });
    if (audioUnlocked) v.muted = false;
    setBtn(v);
  }
  var videoObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var v = entry.target;
      if (!playable(v)) return;
      if (reduceMotion) { v.controls = true; return; } // let the visitor start it themselves
      if (entry.isIntersecting) {
        soloSound(v);
        v.play().catch(function () { v.muted = true; setBtn(v); v.play().catch(function () {}); });
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.5 });
  videos.forEach(function (v) { v.muted = true; setBtn(v); videoObserver.observe(v); });

  function unlockAudio() {
    if (audioUnlocked) return; audioUnlocked = true;
    var cy = window.innerHeight / 2, best = null, bestD = Infinity;
    videos.forEach(function (v) {
      var r = v.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var d = Math.abs((r.top + r.bottom) / 2 - cy);
      if (d < bestD) { bestD = d; best = v; }
    });
    if (best && playable(best)) { soloSound(best); best.play().catch(function () {}); }
  }
  ['pointerdown', 'touchstart', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, unlockAudio, { passive: true });
  });

  /* ---- 3. Count-up for stats / badges ---- */
  function animateCount(el) {
    var target = parseInt(el.dataset.count || '0', 10);
    if (!target) return;
    var prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '', unit = el.dataset.unit || '';
    var star = el.dataset.proof ? '*' : ''; // proof-gated figure: mark as being verified
    var useFull = el.dataset.full === '1';
    function disp(n) { return prefix + (useFull ? n.toLocaleString() : compact(n)) + suffix; }
    if (reduceMotion) { el.textContent = disp(target) + unit + star; return; } // no count-up
    var dur = 1400, start = null;
    function tick(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = disp(Math.floor(eased * target)) + unit + (p < 1 ? '' : star);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var countObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && entry.target.dataset.count && entry.target.dataset.count !== '0') {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { countObserver.observe(el); });

  /* ---- 3b. Reveal: funnel stages fade and rise in as they enter view, cascading top to bottom ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduceMotion) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.25, rootMargin: '0px 0px -15% 0px' });
      reveals.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* Proof gate: if any figure is still being verified, footnote the stats caption so
     nothing reads as a hard verified claim that could contradict LinkedIn. */
  if (!window.FACTS_PROOF_READY && document.querySelector('[data-proof="1"]')) {
    var statsEl = document.querySelector('section.stats');
    var note = statsEl && statsEl.nextElementSibling;
    if (note && note.classList && note.classList.contains('proof-note')) {
      note.textContent += ' Figures marked * are self-reported (Instagram Insights) and being verified.';
    }
  }

  /* ---- 4. Manual mute toggle (uses the shared monochrome SVG + setBtn) ---- */
  document.querySelectorAll('.mute-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.media-card, .pg');
      var v = card && card.querySelector('video');
      if (!v) return;
      audioUnlocked = true;
      if (v.muted) { // unmuting this one: mute the rest so only it has sound
        videos.forEach(function (o) { if (o !== v) { o.muted = true; setBtn(o); } });
        v.muted = false; v.play().catch(function () {});
      } else {
        v.muted = true;
      }
      setBtn(v);
    });
  });
})();
