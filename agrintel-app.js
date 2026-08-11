/**
 * AgriIntel — Shared UI Helpers
 * Charts, counters, gauges, view router, reveal animations.
 * Depends on agrintel-core.js (window.AgriIntel).
 */
(function (global) {
  'use strict';

  const APP = {
    /* ---------- formatting ---------- */
    inr(n) {
      if (n == null) return '—';
      if (Math.abs(n) >= 100000) return '₹' + (n / 100000).toFixed(n % 100000 === 0 ? 0 : 2) + 'L';
      if (Math.abs(n) >= 1000) return '₹' + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
      return '₹' + Math.round(n).toLocaleString('en-IN');
    },
    num(n, digits) {
      if (n == null) return '—';
      return n.toLocaleString('en-IN', { maximumFractionDigits: digits == null ? 0 : digits });
    },
    pct(n, digits) {
      return (n > 0 ? '+' : '') + n.toFixed(digits == null ? 1 : digits) + '%';
    },

    /* ---------- count up ---------- */
    countUp(el, target, opts) {
      if (!el) return;
      opts = opts || {};
      const dur = opts.duration || 1100;
      const decimals = opts.decimals || 0;
      const prefix = opts.prefix || '';
      const suffix = opts.suffix || '';
      const start = opts.start || 0;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = start + (target - start) * eased;
        el.textContent = prefix + val.toLocaleString('en-IN', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },

    /* ---------- SVG line chart ----------
       data: array of numbers; forecastFrom: index where forecast starts
       draws solid line for history + dashed line + fade for forecast */
    lineChart(container, data, forecastFrom, opts) {
      if (!container) return;
      opts = opts || {};
      const W = opts.width || 640;
      const H = opts.height || 200;
      const padL = opts.padL || 8, padR = opts.padR || 8, padT = 16, padB = 22;
      const vals = data;
      const min = Math.min.apply(null, vals);
      const max = Math.max.apply(null, vals);
      const span = (max - min) || 1;
      const innerW = W - padL - padR, innerH = H - padT - padB;
      const px = (i) => padL + (i / (vals.length - 1)) * innerW;
      const py = (v) => padT + innerH - ((v - min) / span) * innerH;

      let histPath = '', fcPath = '';
      vals.forEach((v, i) => {
        const isFc = forecastFrom != null && i >= forecastFrom;
        const prefix = isFc ? (fcPath === '' ? 'M' : 'L') : (histPath === '' ? 'M' : 'L');
        const seg = prefix + px(i).toFixed(1) + ' ' + py(v).toFixed(1);
        if (isFc) fcPath += seg;
        else histPath += seg;
      });

      const area = 'M' + px(0).toFixed(1) + ' ' + padT + ' ' +
        vals.map((v, i) => 'L' + px(i).toFixed(1) + ' ' + py(v).toFixed(1)).join(' ') +
        ' L' + px(vals.length - 1).toFixed(1) + ' ' + (padT + innerH) + ' L' + px(0).toFixed(1) + ' ' + (padT + innerH) + ' Z';

      const uid = 'ai' + Math.random().toString(36).slice(2, 8);
      let html = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="w-full h-auto" role="img" preserveAspectRatio="none">';
      html += '<defs><linearGradient id="' + uid + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="' + (opts.color || '#059669') + '" stop-opacity="0.28"/>' +
        '<stop offset="100%" stop-color="' + (opts.color || '#059669') + '" stop-opacity="0"/>' +
        '</linearGradient></defs>';

      // horizontal gridlines
      for (let g = 0; g <= 3; g++) {
        const gy = padT + (g / 3) * innerH;
        html += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (W - padR) + '" y2="' + gy + '" stroke="#ecebe4" stroke-width="1"/>';
        const label = max - (g / 3) * span;
        html += '<text x="' + (W - padR) + '" y="' + (gy + 3) + '" text-anchor="end" font-size="9" fill="#9aa39d" font-family="Inter">' +
          Math.round(label) + '</text>';
      }

      html += '<path d="' + area + '" fill="url(#' + uid + ')"/>';
      if (histPath) html += '<path d="' + histPath + '" fill="none" stroke="' + (opts.color || '#059669') + '" stroke-width="2.5" class="chart-line" style="stroke-dasharray:800; stroke-dashoffset:800; animation:aiDash 1.4s ease-out forwards"/>';
      if (fcPath) html += '<path d="' + fcPath + '" fill="none" stroke="' + (opts.forecastColor || '#0284c7') + '" stroke-width="2.5" stroke-dasharray="5 5" class="chart-line" style="opacity:.85"/>';

      // dots on last history point + last forecast point
      if (forecastFrom != null && forecastFrom > 0) {
        const lh = vals[forecastFrom - 1];
        html += '<circle cx="' + px(forecastFrom - 1).toFixed(1) + '" cy="' + py(lh).toFixed(1) + '" r="4" fill="#fff" stroke="' + (opts.color || '#059669') + '" stroke-width="2.5"/>';
        const lf = vals[vals.length - 1];
        html += '<circle cx="' + px(vals.length - 1).toFixed(1) + '" cy="' + py(lf).toFixed(1) + '" r="4" fill="#fff" stroke="' + (opts.forecastColor || '#0284c7') + '" stroke-width="2.5"/>';
      }
      html += '</svg>';
      container.innerHTML = html;
    },

    /* ---------- horizontal bar ---------- */
    bar(container, pct, color) {
      if (!container) return;
      container.innerHTML = '<div class="bar"><span style="width:0%;background:' + (color || '#059669') + '" data-w="' + pct + '"></span></div>';
      requestAnimationFrame(function () {
        setTimeout(function () {
          const s = container.querySelector('span');
          if (s) s.style.width = pct + '%';
        }, 60);
      });
    },

    /* ---------- risk gauge (semi-circle) ---------- */
    gauge(container, label, sublabel, value) {
      if (!container) return;
      const color = value > 66 ? '#e11d48' : value > 33 ? '#f59e0b' : '#059669';
      const R = 84, C = Math.PI * R; // half circumference
      const arc = (C * value) / 100;
      container.innerHTML =
        '<div class="relative w-[200px] h-[112px] mx-auto">' +
        '<svg viewBox="0 0 200 112" class="w-full h-full">' +
        '<path d="M 20 104 A 80 80 0 0 1 180 104" fill="none" stroke="#ecebe4" stroke-width="14" stroke-linecap="round"/>' +
        '<path id="gaugeVal" d="M 20 104 A 80 80 0 0 1 180 104" fill="none" stroke="' + color + '" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/>' +
        '</svg>' +
        '<div class="absolute inset-x-0 bottom-0 text-center">' +
        '<div class="font-display font-bold text-2xl" style="color:' + color + '">' + (label || '') + '</div>' +
        (sublabel ? '<div class="text-xs text-[#7c857f]">' + sublabel + '</div>' : '') +
        '</div></div>';
      setTimeout(function () {
        const v = container.querySelector('#gaugeVal');
        if (v) v.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)';
        if (v) v.style.strokeDashoffset = (C - arc).toFixed(1);
      }, 120);
    },

    /* ---------- toast ---------- */
    toast(msg, type) {
      let wrap = document.getElementById('aiToastWrap');
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.id = 'aiToastWrap';
        wrap.style.cssText = 'position:fixed;bottom:88px;left:50%;transform:translateX(-50%);z-index:200;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none';
        document.body.appendChild(wrap);
      }
      const t = document.createElement('div');
      t.style.cssText = 'background:#16211b;color:#fff;padding:12px 18px;border-radius:12px;font-family:Inter,sans-serif;font-size:13px;font-weight:500;box-shadow:0 12px 30px rgba(0,0,0,.25);opacity:0;transform:translateY(10px);transition:all .3s ease;display:flex;align-items:center;gap:8px;max-width:90vw';
      const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'i';
      t.innerHTML = '<span style="' + (type === 'success' ? 'color:#4ade80' : type === 'error' ? 'color:#fb7185' : 'color:#fbbf24') + ';font-weight:700">' + icon + '</span><span>' + msg + '</span>';
      wrap.appendChild(t);
      requestAnimationFrame(function () {
        t.style.opacity = '1'; t.style.transform = 'translateY(0)';
      });
      setTimeout(function () {
        t.style.opacity = '0'; t.style.transform = 'translateY(10px)';
        setTimeout(function () { t.remove(); }, 320);
      }, 2600);
    },

    /* ---------- view router (SPA) ---------- */
    go(viewId) {
      document.querySelectorAll('.app-view').forEach(function (v) { v.classList.remove('active'); });
      const target = document.getElementById('view-' + viewId);
      if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        global.dispatchEvent(new CustomEvent('ai:view', { detail: viewId }));
      }
      // nav state
      document.querySelectorAll('[data-nav]').forEach(function (n) {
        const on = n.getAttribute('data-nav') === viewId;
        n.classList.toggle('nav-on', on);
        n.classList.toggle('nav-off', !on);
      });
    },

    /* ---------- reveal ----------
       Persistent observer setup. Async content injected AFTER initReveal()
       is picked up automatically via a MutationObserver, so cards rendered
       by late-arriving promises still animate in instead of staying hidden. */
    initReveal() {
      let io = null;
      let mo = null;

      const revealOne = function (el) {
        if (!el || el.classList.contains('in')) return;
        if (!io) { el.classList.add('in'); return; } // no observer support
        io.observe(el);
      };

      const scan = function (root) {
        const nodes = root.querySelectorAll ? root.querySelectorAll('.reveal:not(.in)') : [];
        nodes.forEach(revealOne);
        if (root.classList && root.classList.contains('reveal') && !root.classList.contains('in')) revealOne(root);
      };

      if ('IntersectionObserver' in global) {
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add('in');
              io.unobserve(en.target);
            }
          });
        }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

        if ('MutationObserver' in global) {
          mo = new MutationObserver(function (muts) {
            muts.forEach(function (m) {
              if (m.type !== 'childList' || !m.addedNodes) return;
              m.addedNodes.forEach(function (node) {
                if (node.nodeType !== 1) return;
                scan(node);
              });
            });
          });
          if (document.body) mo.observe(document.body, { childList: true, subtree: true });
        }
      }

      // Reveal everything already in view + everything on no-observer browsers
      if (io) scan(document);
      else document.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('in'); });

      // Re-scan on view switches (SPA panels become visible again)
      global.addEventListener('ai:view', function () { setTimeout(function () { scan(document); }, 60); });
    },

    /* ---------- skeleton loading placeholder ---------- */
    skeleton(opts) {
      opts = opts || {};
      const rows = opts.rows == null ? 3 : opts.rows;
      let bars = '';
      for (let i = 0; i < rows; i++) {
        bars += '<div class="mt-3 shimmer-line" style="height:' + (opts.h || 13) + 'px;width:' + (96 - i * 7) + '%"></div>';
      }
      return '<div class="card p-6 h-full">' +
        '<div class="flex items-center justify-between">' +
        '<div class="shimmer-line" style="height:18px;width:46%"></div>' +
        '<div class="shimmer-line" style="height:26px;width:22%;border-radius:999px"></div>' +
        '</div>' + bars + '</div>';
    },

    /* ---------- risk helpers ---------- */
    riskTone(risk) {
      const r = String(risk).toLowerCase();
      if (r === 'low') return 'green';
      if (r === 'medium' || r === 'med') return 'amber';
      return 'red';
    },
    riskPillClass(risk) {
      const t = APP.riskTone(risk);
      return t === 'green' ? 'pill-green' : t === 'amber' ? 'pill-amber' : 'pill-red';
    }
  };

  global.AIApp = APP;
})(window);
