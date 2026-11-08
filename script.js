(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Isi dari CONFIG ---------- */
  $("#nameSlot").textContent = CONFIG.name;
  $("#heroSub").textContent = CONFIG.heroSub;
  document.title = "Happy 21st Birthday, " + CONFIG.name + "! 🎂";
  $("#questionText").textContent = CONFIG.question;
  $("#yesBtn").textContent = CONFIG.yesText;
  $("#noBtn").textContent = CONFIG.noTexts[0];
  $("#signature").innerHTML = CONFIG.closing + "<br>" + CONFIG.from + " 💙";

  const letterBody = $("#letterBody");
  CONFIG.letter.forEach((text) => {
    const p = document.createElement("p");
    p.textContent = text;
    letterBody.appendChild(p);
  });

  const factGrid = $("#factGrid");
  CONFIG.facts.forEach((f, i) => {
    const btn = document.createElement("button");
    btn.className = "fact";
    btn.type = "button";
    btn.setAttribute("aria-label", "Fakta " + (i + 1));
    btn.innerHTML =
      '<div class="fact-inner">' +
      '<div class="face front"><div class="emoji"></div><div class="title"></div><div class="tap">ketuk untuk buka</div></div>' +
      '<div class="face back"></div>' +
      "</div>";
    $(".emoji", btn).textContent = f.emoji;
    $(".title", btn).textContent = f.front;
    $(".back", btn).textContent = f.back;
    btn.addEventListener("click", () => btn.classList.toggle("flipped"));
    factGrid.appendChild(btn);
  });

  /* ---------- Kenangan Foto ---------- */
  const memoryGrid = $("#memoryGrid");
  if (memoryGrid && Array.isArray(CONFIG.memories)) {
    CONFIG.memories.forEach((m, i) => {
      const btn = document.createElement("button");
      btn.className = "memory-card";
      btn.type = "button";
      btn.setAttribute("aria-label", "Kenangan " + (i + 1));
      btn.innerHTML =
        '<div class="memory-inner">' +
        '<div class="memory-face memory-front">' +
        '  <img class="memory-img" alt="" loading="lazy">' +
        '  <div class="memory-front-overlay">' +
        '    <div class="memory-title"></div>' +
        '    <div class="memory-tap">ketuk untuk cerita ✨</div>' +
        '  </div>' +
        '</div>' +
        '<div class="memory-face memory-back">' +
        '  <div class="memory-back-emoji"></div>' +
        '  <div class="memory-back-text"></div>' +
        '  <div class="memory-back-tap">ketuk untuk lihat foto ↺</div>' +
        '</div>' +
        '</div>';
      const img = $(".memory-img", btn);
      img.src = m.img;
      img.alt = m.title || "Kenangan " + (i + 1);
      $(".memory-title", btn).textContent = m.title || ("Kenangan #" + (i + 1));
      $(".memory-back-emoji", btn).textContent = m.emoji || "💙";
      $(".memory-back-text", btn).textContent = m.back || "I love u";
      btn.addEventListener("click", () => btn.classList.toggle("flipped"));
      memoryGrid.appendChild(btn);
    });
  }

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  /* ---------- Konfeti (tanpa warna merah muda) ---------- */
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  const COLORS = ["#5bbcf4", "#2f9fe3", "#93d5fb", "#ffffff", "#ffd666", "#9fe3d0", "#c3e8ff"];
  let pieces = [];
  let running = false;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  function burst(x, y, count) {
    count = count || 140;
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 16,
        vy: Math.random() * -15 - 4,
        g: 0.32 + Math.random() * 0.1,
        w: 6 + Math.random() * 7,
        h: 4 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        round: Math.random() < 0.25
      });
    }
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  }

  function rain(duration) {
    const end = performance.now() + duration;
    (function drop() {
      burst(Math.random() * window.innerWidth, -10, 12);
      if (performance.now() < end) setTimeout(drop, 120);
    })();
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces = pieces.filter((p) => p.y < window.innerHeight + 30);
    pieces.forEach((p) => {
      p.vy += p.g;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    });
    if (pieces.length) {
      requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }

  function burstFromElement(el, count) {
    const r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, count);
  }

  /* ---------- Muncul saat di-scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Easter egg: ketuk angka 21 lima kali ---------- */
  const badge = $("#ageBadge");
  let badgeClicks = 0;
  badge.addEventListener("click", () => {
    badgeClicks++;
    if (badgeClicks === 5) {
      burstFromElement(badge, 200);
      showToast("Easter egg ketemu! Hadiahnya: aku traktir makan. 🍜");
      badgeClicks = 0;
    } else if (badgeClicks === 1) {
      showToast("Terus ketuk angkanya… ada kejutan 👀");
    }
  });

  /* ---------- Loading umur 21 ---------- */
  const barFill = $("#barFill");
  const barText = $("#barText");
  const bar = $(".bar");
  const forceBtn = $("#forceBtn");
  const loadDone = $("#loadDone");
  const loadMsgs = [
    "Mengunduh kedewasaan…",
    "Mengumpulkan 21 tahun kenangan…",
    "Memasang fitur 'sok tegar'…",
    "Menghitung jumlah lilin…",
    "Hampir selesai… (bohong)",
    "Menunggu sinyal dari semesta…"
  ];
  let progress = 0;
  let loadingStarted = false;
  let loadTimer;

  function setProgress(v) {
    progress = v;
    barFill.style.width = v + "%";
    bar.setAttribute("aria-valuenow", String(Math.round(v)));
  }

  function startLoading() {
    if (loadingStarted) return;
    loadingStarted = true;
    loadTimer = setInterval(() => {
      if (progress < 99) {
        setProgress(Math.min(99, progress + 1 + Math.random() * 3));
        const idx = Math.min(loadMsgs.length - 1, Math.floor(progress / 18));
        barText.textContent = Math.floor(progress) + "% · " + loadMsgs[idx];
      } else {
        clearInterval(loadTimer);
        setProgress(99);
        barText.textContent = "99% · Aduhh Macet nih. bantuu  dong ayyang";
        forceBtn.hidden = false;
      }
    }, 90);
  }

  const loadObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        startLoading();
        loadObserver.disconnect();
      }
    },
    { threshold: 0.4 }
  );
  loadObserver.observe($("#loading"));

  forceBtn.addEventListener("click", () => {
    setProgress(100);
    barText.textContent = "100% · Berhasil!";
    forceBtn.hidden = true;
    loadDone.hidden = false;
    loadDone.textContent = "Selamat Ulang tahun odee sayanggg 🎉";
    burstFromElement(bar, 160);
  });

  /* ---------- Tiup lilin ---------- */
  const candles = $$(".candle");
  const blowBtn = $("#blowBtn");
  const wishText = $("#wishText");
  let wishShown = false;

  function checkAllOut() {
    if (wishShown) return;
    if (candles.every((c) => c.classList.contains("out"))) {
      wishShown = true;
      wishText.textContent = CONFIG.wish;
      wishText.hidden = false;
      burstFromElement($("#cakeBox"), 220);
      blowBtn.textContent = "Nyalakan lagi 🔥";
    }
  }

  candles.forEach((c) =>
    c.addEventListener("click", () => {
      c.classList.add("out");
      checkAllOut();
    })
  );

  blowBtn.addEventListener("click", () => {
    if (wishShown) {
      candles.forEach((c) => c.classList.remove("out"));
      wishShown = false;
      wishText.hidden = true;
      blowBtn.textContent = "Tiup! 💨";
      return;
    }
    candles.forEach((c, i) => setTimeout(() => {
      c.classList.add("out");
      checkAllOut();
    }, i * 220));
  });

  /* ---------- Tombol "Tidak" yang kabur ---------- */
  const arena = $("#arena");
  const yesBtn = $("#yesBtn");
  const noBtn = $("#noBtn");
  const questionReply = $("#questionReply");
  let noCount = 0;
  let gone = false;

  function overlaps(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  function dodge(ev) {
    if (gone) return;
    if (ev && ev.cancelable) ev.preventDefault();
    noCount++;

    if (noCount >= CONFIG.noTexts.length + 2) {
      gone = true;
      noBtn.style.display = "none";
      questionReply.textContent = CONFIG.noGoneText;
      questionReply.hidden = false;
      yesBtn.style.transform = "scale(1.6)";
      return;
    }

    noBtn.textContent = CONFIG.noTexts[Math.min(noCount, CONFIG.noTexts.length - 1)];
    yesBtn.style.transform = "scale(" + Math.min(1 + noCount * 0.1, 1.6).toFixed(2) + ")";

    const a = arena.getBoundingClientRect();
    const maxX = Math.max(0, a.width - noBtn.offsetWidth);
    const maxY = Math.max(0, a.height - noBtn.offsetHeight);
    const yesRect = yesBtn.getBoundingClientRect();

    for (let tries = 0; tries < 12; tries++) {
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;
      noBtn.style.left = x + "px";
      noBtn.style.top = y + "px";
      noBtn.style.marginTop = "0";
      const r = noBtn.getBoundingClientRect();
      if (!overlaps(r, yesRect)) break;
    }
  }

  noBtn.addEventListener("mouseenter", dodge);
  noBtn.addEventListener("touchstart", dodge, { passive: false });
  noBtn.addEventListener("click", dodge);

  yesBtn.addEventListener("click", () => {
    questionReply.textContent = CONFIG.yesReply;
    questionReply.hidden = false;
    burstFromElement(yesBtn, 200);
  });

  /* ---------- Konfeti terakhir ---------- */
  $("#finalBtn").addEventListener("click", () => {
    rain(4000);
    showToast("Selamat ulang tahun! 🎂💙");
  });

  /* ---------- Konfeti sambutan ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => burst(window.innerWidth / 2, window.innerHeight * 0.4, 120), 600);
  });
})();
