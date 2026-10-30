(() => {
  "use strict";

  const C = window.CONFIG || {};
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const herName = String(C.herName || "My Love").trim();
  const yourName = String(C.yourName || "").trim();
  const firstLetter = (s) => (s.match(/\p{L}/u) || ["♥"])[0].toUpperCase();

  /* ---------- Fill in the personal text ---------- */
  document.title = `Happy birthday, ${herName}`;
  $$("[data-her-name]").forEach((el) => (el.textContent = herName));
  $$("[data-her-full-name]").forEach((el) => (el.textContent = String(C.herFullName || "").trim() || herName));
  $$("[data-her-initial]").forEach((el) => (el.textContent = firstLetter(herName)));
  $$("[data-your-name]").forEach((el) => (el.textContent = yourName));
  $$("[data-your-initial]").forEach((el) => (el.textContent = yourName ? firstLetter(yourName) : "♥"));

  // Big name, split into letters so they can rise in one by one
  const heroName = $("#heroName");
  const hero = $(".hero");
  const words = herName.split(/\s+/);
  const longestWord = Math.max(...words.map((w) => [...w].length));
  hero.style.setProperty("--len", Math.max(longestWord, Math.min([...herName].length, 9), 4));
  hero.style.setProperty("--total", Math.max([...herName].length, 4));
  heroName.setAttribute("aria-label", herName);
  let letterIndex = 0;
  words.forEach((word, w) => {
    if (w > 0) heroName.appendChild(document.createTextNode(" "));
    const wordSpan = document.createElement("span");
    wordSpan.className = "word";
    wordSpan.setAttribute("aria-hidden", "true");
    [...word].forEach((ch) => {
      const span = document.createElement("span");
      span.className = "ch";
      span.textContent = ch;
      span.style.setProperty("--i", letterIndex++);
      wordSpan.appendChild(span);
    });
    heroName.appendChild(wordSpan);
  });

  $("#heroLine").textContent = C.heroLine || "";

  if (C.togetherSince) {
    const start = new Date(`${C.togetherSince}T00:00:00`);
    if (!Number.isNaN(start.getTime())) {
      const days = Math.floor((Date.now() - start.getTime()) / 86400000);
      if (days > 0) {
        const el = $("#together");
        el.textContent = `${days.toLocaleString()} days together, and counting.`;
        el.hidden = false;
      }
    }
  }

  /* ---------- Letter ---------- */
  const L = C.letter || {};
  $("#letterGreeting").textContent = L.greeting || "";
  const body = $("#letterBody");
  (L.paragraphs || []).forEach((text) => {
    const p = document.createElement("p");
    p.textContent = text;
    body.appendChild(p);
  });
  $("#letterClosing").textContent = L.closing || "";

  /* ---------- Photos ---------- */
  const photos = Array.isArray(C.photos) ? C.photos.filter((p) => p && p.src) : [];
  const tilts = [-2.4, 1.8, -1.3, 2.6, -1.9, 1.2, -2.8, 2.1];
  const tapes = [-4, 3, -2, 5, -3, 2];
  const scrapbook = $("#scrapbook");

  photos.forEach((photo, i) => {
    const fig = document.createElement("figure");
    fig.className = "polaroid";
    fig.style.setProperty("--r", `${tilts[i % tilts.length]}deg`);
    fig.style.setProperty("--tape", `${tapes[i % tapes.length]}deg`);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "polaroid-btn";
    btn.setAttribute("aria-label", `Open photo${photo.caption ? `: ${photo.caption}` : ` ${i + 1}`}`);

    const img = new Image();
    img.src = photo.src;
    img.alt = photo.alt || photo.caption || `Photo ${i + 1}`;
    img.loading = "lazy";
    img.decoding = "async";
    if (photo.position) img.style.objectPosition = photo.position;
    if (photo.focus) img.style.objectPosition = photo.focus;
    img.addEventListener("error", () => {
      photo.missing = true;
      const box = document.createElement("div");
      box.className = "photo-missing";
      box.innerHTML = `<span>Add your photo at<br><code></code></span>`;
      box.querySelector("code").textContent = photo.src;
      img.replaceWith(box);
      btn.disabled = true;
      btn.style.cursor = "default";
    });

    btn.appendChild(img);
    btn.addEventListener("click", () => openViewer(i));
    fig.appendChild(btn);

    if (photo.caption) {
      const cap = document.createElement("figcaption");
      cap.textContent = photo.caption;
      fig.appendChild(cap);
    }
    scrapbook.appendChild(fig);
  });

  if (!photos.length) $("#us").hidden = true;

  /* ---------- Photo viewer ---------- */
  const viewer = $("#lightbox");
  const vImg = $("#lbImg");
  const vCap = $("#lbCap");
  const vCount = $("#lbCount");
  let current = 0;

  const visible = () => photos.map((p, i) => i).filter((i) => !photos[i].missing);

  function showPhoto(i) {
    current = i;
    const p = photos[i];
    vImg.src = p.src;
    vImg.alt = p.alt || p.caption || `Photo ${i + 1}`;
    vCap.textContent = p.caption || "";
    const list = visible();
    vCount.textContent = `${list.indexOf(i) + 1} of ${list.length}`;
    const single = list.length < 2;
    $("#lbPrev").hidden = single;
    $("#lbNext").hidden = single;
  }

  function step(dir) {
    const list = visible();
    if (list.length < 2) return;
    const pos = list.indexOf(current);
    showPhoto(list[(pos + dir + list.length) % list.length]);
  }

  function openViewer(i) {
    if (typeof viewer.showModal !== "function") {
      window.open(photos[i].src, "_blank");
      return;
    }
    showPhoto(i);
    viewer.showModal();
  }

  $("#lbPrev").addEventListener("click", () => step(-1));
  $("#lbNext").addEventListener("click", () => step(1));
  $("#lbClose").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (e) => {
    if (e.target === viewer || e.target.id === "lbInner") viewer.close();
  });
  viewer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  let touchX = null;
  viewer.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  viewer.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    touchX = null;
  });

  /* ---------- Music ---------- */
  const musicBtn = $("#music");
  let audio = null;

  function setPlaying(on) {
    musicBtn.setAttribute("aria-pressed", String(on));
    musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  }

  if (C.music) {
    audio = new Audio(C.music);
    audio.loop = true;
    audio.preload = "auto";
    musicBtn.hidden = false;
    audio.addEventListener("error", () => {
      musicBtn.hidden = true;
      audio = null;
    });
    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    musicBtn.addEventListener("click", () => {
      if (!audio) return;
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    });
  }

  function startMusic() {
    if (audio) audio.play().catch(() => {});
  }

  /* ---------- Opening the envelope ---------- */
  const gate = $("#gate");
  const seal = $("#seal");
  let opened = false;

  function reveal() {
    document.body.classList.remove("is-locked");
    document.body.classList.add("is-revealed");
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;
    startMusic();

    if (reduceMotion) {
      gate.classList.add("is-gone");
      reveal();
      setTimeout(() => gate.remove(), 900);
      return;
    }

    gate.classList.add("is-breaking");
    setTimeout(() => gate.classList.add("is-open"), 500);
    setTimeout(() => gate.classList.add("is-rising"), 1150);
    setTimeout(() => {
      gate.classList.add("is-gone");
      reveal();
    }, 2500);
    setTimeout(() => gate.remove(), 3400);
  }

  seal.addEventListener("click", openEnvelope);

  /* ---------- Candles ---------- */
  const candleWrap = $("#candles");
  const age = parseInt(C.age, 10);
  const digits = age > 0 ? String(age).split("") : null;
  const count = digits ? digits.length : Math.min(Math.max(parseInt(C.candles, 10) || 5, 1), 9);
  const wishDone = $("#wishDone");
  const relight = $("#relight");
  let lit = count;

  if (digits) {
    candleWrap.classList.add("has-digits");
    $("#wishHint").textContent = "Close your eyes, make a wish, then tap the candles to blow them out.";
  }

  for (let i = 0; i < count; i++) {
    const c = document.createElement("button");
    c.type = "button";
    c.className = digits ? "candle is-digit" : "candle";
    c.setAttribute("aria-label", `Blow out candle ${i + 1}`);
    c.innerHTML = '<span class="flame"></span><span class="smoke"></span>' +
      (digits ? `<span class="digit" aria-hidden="true">${digits[i]}</span>` : "");
    c.addEventListener("click", () => {
      if (c.classList.contains("is-out")) return;
      c.classList.add("is-out");
      c.setAttribute("aria-label", `Candle ${i + 1} is out`);
      lit -= 1;
      if (lit === 0) celebrate();
    });
    candleWrap.appendChild(c);
  }

  function celebrate() {
    wishDone.textContent = C.wishMessage || "Happy birthday!";
    relight.hidden = false;
    if (!reduceMotion) burst();
  }

  relight.addEventListener("click", () => {
    $$(".candle").forEach((c, i) => {
      c.classList.remove("is-out");
      c.setAttribute("aria-label", `Blow out candle ${i + 1}`);
    });
    lit = count;
    wishDone.textContent = "";
    relight.hidden = true;
  });

  /* ---------- Petal confetti ---------- */
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  const colors = ["#8E5CC9", "#CDB8F0", "#5B2A86", "#F2C46D", "#EDE3FC", "#B28BE3"];
  let pieces = [];
  let running = false;

  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function burst() {
    sizeCanvas();
    const rect = candleWrap.getBoundingClientRect();
    const ox = rect.left + rect.width / 2;
    const oy = rect.top + rect.height / 2;
    for (let i = 0; i < 170; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
      const speed = 6 + Math.random() * 9;
      pieces.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 5 + Math.random() * 6,
        h: 9 + Math.random() * 8,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.25,
        sway: Math.random() * Math.PI * 2,
        color: colors[(Math.random() * colors.length) | 0],
        life: 0,
      });
    }
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  }

  function tick() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    pieces = pieces.filter((p) => p.y < h + 40 && p.life < 420);
    for (const p of pieces) {
      p.life += 1;
      p.vy += 0.16;
      p.vx *= 0.985;
      p.vy = Math.min(p.vy, 3.2);
      p.sway += 0.05;
      p.x += p.vx + Math.sin(p.sway) * 0.8;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.life > 360 ? (420 - p.life) / 60 : 1;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (pieces.length) {
      requestAnimationFrame(tick);
    } else {
      running = false;
      ctx.clearRect(0, 0, w, h);
    }
  }

  window.addEventListener("resize", () => {
    if (running) sizeCanvas();
  });
})();
