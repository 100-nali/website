/* Bloch-sphere hero + typewriter tagline.
   The trajectory is a nod to the quantum kicked top: smooth precession about z,
   interrupted by periodic twists whose angle depends on the z-component. */

(function () {
  'use strict';

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- typewriter ---------- */

  var typeEl = document.getElementById('type');
  var phrases = [
    'AI x quantum technologies',
    'continual learning for LLM agents',
    'reinforcement learning',
    'world models',
    'physics-informed machine learning'
  ];

  if (typeEl && !reduced) {
    var pi = 0, ci = 0, deleting = false;
    var tick = function () {
      var p = phrases[pi];
      if (!deleting) {
        ci += 1;
        typeEl.textContent = p.slice(0, ci);
        if (ci === p.length) { deleting = true; setTimeout(tick, 2600); return; }
        setTimeout(tick, 38 + Math.random() * 42);
      } else {
        ci -= 1;
        typeEl.textContent = p.slice(0, ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 420); return; }
        setTimeout(tick, 16);
      }
    };
    typeEl.textContent = '';
    setTimeout(tick, 500);
  }

  /* ---------- Bloch sphere ---------- */

  var canvas = document.getElementById('bloch');
  if (!canvas || !canvas.getContext) { return; }
  var ctx = canvas.getContext('2d');

  function rotZ(p, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return [c * p[0] - s * p[1], s * p[0] + c * p[1], p[2]];
  }
  function rotX(p, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return [p[0], c * p[1] - s * p[2], s * p[1] + c * p[2]];
  }
  function norm(p) {
    var n = Math.hypot(p[0], p[1], p[2]) || 1;
    return [p[0] / n, p[1] / n, p[2] / n];
  }

  var v = norm([0.55, 0.35, 0.76]);
  var trail = [v];
  var MAX_TRAIL = 300;
  var t = 0, sinceKick = 0;

  function step(dt) {
    t += dt;
    v = rotZ(v, 1.35 * dt);                       /* precession */
    v = rotX(v, 0.22 * dt * Math.sin(t * 0.9));   /* gentle nutation */
    sinceKick += dt;
    if (sinceKick > 1.7) {                        /* the kick: twist ∝ z */
      sinceKick = 0;
      v = rotX(v, 2.4 * v[2]);
    }
    v = norm(v);
    trail.push(v);
    if (trail.length > MAX_TRAIL) { trail.shift(); }
  }

  var azim = 0;
  var TILT = -1.02;

  function project(p, R, cx, cy) {
    var q = rotX(rotZ(p, azim), TILT);
    return { x: cx + q[0] * R, y: cy - q[2] * R, d: (1 - q[1]) / 2 };
  }

  function resize() {
    var s = canvas.clientWidth || 300;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(s * dpr);
    canvas.height = Math.round(s * dpr);
  }

  function strokePath(pts, R, cx, cy, style) {
    ctx.beginPath();
    for (var i = 0; i < pts.length; i++) {
      var s = project(pts[i], R, cx, cy);
      if (i === 0) { ctx.moveTo(s.x, s.y); } else { ctx.lineTo(s.x, s.y); }
    }
    ctx.strokeStyle = style;
    ctx.stroke();
  }

  function draw() {
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    var R = Math.min(w, h) * 0.42, cx = w / 2, cy = h / 2;
    var i, a, ptsList;

    ctx.lineWidth = Math.max(1, w / 340);

    /* wireframe: latitudes */
    var lats = [-0.66, -0.33, 0, 0.33, 0.66];
    for (var li = 0; li < lats.length; li++) {
      var z = lats[li], r = Math.sqrt(1 - z * z);
      ptsList = [];
      for (i = 0; i <= 72; i++) {
        a = (i / 72) * 2 * Math.PI;
        ptsList.push([r * Math.cos(a), r * Math.sin(a), z]);
      }
      strokePath(ptsList, R, cx, cy,
        z === 0 ? 'rgba(62,233,255,0.26)' : 'rgba(120,140,220,0.13)');
    }

    /* wireframe: longitudes */
    for (var k = 0; k < 3; k++) {
      var phi = (k * Math.PI) / 3;
      ptsList = [];
      for (i = 0; i <= 72; i++) {
        a = (i / 72) * 2 * Math.PI;
        ptsList.push([Math.sin(a) * Math.cos(phi), Math.sin(a) * Math.sin(phi), Math.cos(a)]);
      }
      strokePath(ptsList, R, cx, cy, 'rgba(120,140,220,0.13)');
    }

    /* pole labels */
    var p0 = project([0, 0, 1], R, cx, cy);
    var p1 = project([0, 0, -1], R, cx, cy);
    ctx.fillStyle = 'rgba(138,147,168,0.85)';
    ctx.font = Math.round(w * 0.045) + 'px "JetBrains Mono", monospace';
    ctx.fillText('|0⟩', p0.x + w * 0.02, p0.y - w * 0.015);
    ctx.fillText('|1⟩', p1.x + w * 0.02, p1.y + w * 0.045);

    /* trail: magenta tail -> cyan head, halo pass + core pass */
    var baseW = Math.max(1, w / 340);
    for (i = 1; i < trail.length; i++) {
      var s0 = project(trail[i - 1], R, cx, cy);
      var s1 = project(trail[i], R, cx, cy);
      var f = i / trail.length;
      var depth = 0.3 + 0.7 * s1.d;
      var cr = Math.round(255 + (62 - 255) * f);
      var cg = Math.round(79 + (233 - 79) * f);
      var cb = Math.round(216 + (255 - 216) * f);
      var rgb = cr + ',' + cg + ',' + cb;

      ctx.lineWidth = baseW * 3.2;
      ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.16 * f * depth).toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(s0.x, s0.y);
      ctx.lineTo(s1.x, s1.y);
      ctx.stroke();

      ctx.lineWidth = baseW * 1.25;
      ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.85 * f * depth).toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(s0.x, s0.y);
      ctx.lineTo(s1.x, s1.y);
      ctx.stroke();
    }
    ctx.lineWidth = baseW;

    /* state vector + glowing head */
    var hd = project(v, R, cx, cy);
    ctx.strokeStyle = 'rgba(191,244,255,0.45)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(hd.x, hd.y);
    ctx.stroke();

    var halo = ctx.createRadialGradient(hd.x, hd.y, 0, hd.x, hd.y, w * 0.055);
    halo.addColorStop(0, 'rgba(62,233,255,0.5)');
    halo.addColorStop(1, 'rgba(62,233,255,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(hd.x, hd.y, w * 0.055, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#dffaff';
    ctx.beginPath();
    ctx.arc(hd.x, hd.y, Math.max(2.2, w / 145), 0, 2 * Math.PI);
    ctx.fill();
  }

  resize();
  window.addEventListener('resize', function () {
    resize();
    if (reduced) { draw(); }
  });

  if (reduced) {
    /* static frame: pre-run the dynamics, draw once */
    for (var n = 0; n < 420; n++) { step(1 / 45); }
    draw();
  } else {
    var last = null;
    var loop = function (ts) {
      if (last === null) { last = ts; }
      var dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      azim += dt * 0.1;
      step(dt);
      draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
})();
