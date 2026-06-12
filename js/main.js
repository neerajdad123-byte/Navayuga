/* ═══════════════════════════════════════════
   NAVAYUGA — main.js
   Requires: GSAP, ScrollTrigger, SplitType, Lenis (loaded via CDN)
   ═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

const isTouch = window.matchMedia("(hover: none)").matches;
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ───────────────────────────────
   1. LENIS SMOOTH SCROLL
─────────────────────────────── */
const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// stop scroll during preloader
lenis.stop();

/* ───────────────────────────────
   2. SPLIT TEXT (lines & words)
─────────────────────────────── */
const splitLines = new SplitType(".split-lines", { types: "lines", lineClass: "line" });
const splitWords = new SplitType(".split-words", { types: "words", wordClass: "word" });

// wrap each line's content for overflow-hidden reveals
document.querySelectorAll(".split-lines .line").forEach((line) => {
  const inner = document.createElement("span");
  inner.className = "line-inner";
  inner.style.display = "inline-block";
  inner.innerHTML = line.innerHTML;
  line.innerHTML = "";
  line.appendChild(inner);
});

/* ───────────────────────────────
   3. PRELOADER
─────────────────────────────── */
const preloader = document.getElementById("preloader");
const counterEl = document.getElementById("counter");
const words = gsap.utils.toArray(".preloader__word");

function startSite() {
  lenis.start();
  heroIntro();
}

if (prefersReduced) {
  preloader.style.display = "none";
  startSite();
} else {
  const tl = gsap.timeline({
    onComplete: () => {
      preloader.style.display = "none";
      startSite();
    },
  });

  // counter 0 → 100
  const count = { val: 0 };
  tl.to(count, {
    val: 100,
    duration: 2.6,
    ease: "power2.inOut",
    onUpdate: () => (counterEl.textContent = Math.round(count.val)),
  }, 0);

  // cycle words
  words.forEach((word, i) => {
    tl.fromTo(word,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      i * 0.62
    );
    if (i < words.length - 1) {
      tl.to(word, { opacity: 0, y: -30, duration: 0.35, ease: "power2.in" }, i * 0.62 + 0.45);
    }
  });

  // curtains lift
  tl.to(".preloader__inner", { opacity: 0, duration: 0.4 }, 2.7)
    .to(".preloader__curtain", { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 2.9)
    .to(".preloader__curtain--2", { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 3.05);
}

/* ───────────────────────────────
   4. HERO INTRO
─────────────────────────────── */
function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.from(".hero__img", { scale: 1.35, duration: 2, ease: "power3.out" }, 0)
    .from(".hero__title-text", {
      yPercent: 115, duration: 1.2, stagger: 0.12,
    }, 0.2)
    .from(".hero__eyebrow span", { yPercent: 110, duration: 0.9 }, 0.5)
    .from(".hero__tagline .line-inner", {
      yPercent: 110, duration: 0.9, stagger: 0.08,
    }, 0.7)
    .from(".hero__scroll", { opacity: 0, y: 20, duration: 0.8 }, 1)
    .from(".hero__badge", { opacity: 0, scale: 0.6, duration: 1, ease: "back.out(1.6)" }, 0.9)
    .from(".nav", { yPercent: -110, duration: 0.9 }, 0.6);
}

// hero parallax on scroll
gsap.to(".hero__img", {
  yPercent: 18,
  ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
});
gsap.to(".hero__content", {
  yPercent: -10, opacity: 0.3,
  ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
});

/* ───────────────────────────────
   5. CUSTOM CURSOR
─────────────────────────────── */
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursorFollower");
const followerLabel = follower.querySelector(".cursor-follower__label");

if (!isTouch) {
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const mouse = { x: pos.x, y: pos.y };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    gsap.set(cursor, { x: mouse.x, y: mouse.y });
  });

  gsap.ticker.add(() => {
    pos.x += (mouse.x - pos.x) * 0.12;
    pos.y += (mouse.y - pos.y) * 0.12;
    gsap.set(follower, { x: pos.x, y: pos.y });
  });

  // cursor states via data-cursor
  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const type = el.dataset.cursor;
      follower.className = "cursor-follower";
      if (type === "-sm") follower.classList.add("is--sm");
      else if (type === "-md") follower.classList.add("is--md");
      else if (type === "view") {
        follower.classList.add("is--view");
        followerLabel.textContent = "View";
      } else if (type === "-hide") {
        follower.classList.add("is--hide");
        cursor.classList.add("is--hide");
      }
    });
    el.addEventListener("mouseleave", () => {
      follower.className = "cursor-follower";
      cursor.classList.remove("is--hide");
      followerLabel.textContent = "";
    });
  });
}

/* ───────────────────────────────
   6. MAGNETIC ELEMENTS
─────────────────────────────── */
if (!isTouch) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ───────────────────────────────
   7. NAV — hide on scroll down
─────────────────────────────── */
let lastScroll = 0;
const nav = document.getElementById("nav");
lenis.on("scroll", ({ scroll }) => {
  if (scroll > lastScroll && scroll > 150) nav.classList.add("is-hidden");
  else nav.classList.remove("is-hidden");
  lastScroll = scroll;
});

// anchor links → lenis scroll
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = a.getAttribute("href");
    if (target.length > 1) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    }
  });
});

/* ───────────────────────────────
   8. SCROLL REVEALS
─────────────────────────────── */
// label lines
gsap.utils.toArray(".reveal-line > span").forEach((el) => {
  gsap.from(el, {
    yPercent: 110, duration: 1, ease: "power4.out",
    scrollTrigger: { trigger: el, start: "top 88%" },
  });
});

// split-lines blocks (skip hero — handled in intro)
gsap.utils.toArray(".split-lines").forEach((block) => {
  if (block.closest(".hero")) return;
  gsap.from(block.querySelectorAll(".line-inner"), {
    yPercent: 110, duration: 1, stagger: 0.09, ease: "power4.out",
    scrollTrigger: { trigger: block, start: "top 85%" },
  });
});

// split-words blocks (story text, vision quote)
gsap.utils.toArray(".split-words").forEach((block) => {
  gsap.from(block.querySelectorAll(".word"), {
    opacity: 0.12, y: 14, duration: 0.6, stagger: 0.025, ease: "power2.out",
    scrollTrigger: { trigger: block, start: "top 80%", end: "top 35%", scrub: true },
  });
});

// menu rows
gsap.utils.toArray(".menu__item").forEach((item, i) => {
  gsap.from(item, {
    opacity: 0, y: 50, duration: 0.8, ease: "power3.out",
    scrollTrigger: { trigger: item, start: "top 92%" },
  });
});

// gallery cards
gsap.utils.toArray(".gallery__card").forEach((card) => {
  gsap.from(card, {
    opacity: 0, y: 60, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: card, start: "top 92%" },
  });
});

// footer logo rise
gsap.from(".footer__logo", {
  yPercent: 60, duration: 1.2, ease: "power4.out",
  scrollTrigger: { trigger: ".footer", start: "top 80%" },
});

/* ───────────────────────────────
   9. PARALLAX via data-speed
─────────────────────────────── */
gsap.utils.toArray("[data-speed]").forEach((el) => {
  const speed = parseFloat(el.dataset.speed);
  gsap.to(el, {
    y: () => (1 - speed) * 200,
    ease: "none",
    scrollTrigger: {
      trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true,
    },
  });
});

// vision image parallax
gsap.fromTo(".vision__img",
  { yPercent: -12 },
  { yPercent: 12, ease: "none",
    scrollTrigger: { trigger: ".vision", start: "top bottom", end: "bottom top", scrub: true } }
);

/* ───────────────────────────────
   10. STATS COUNTERS
─────────────────────────────── */
gsap.utils.toArray(".story__stat-num").forEach((num) => {
  const target = parseInt(num.dataset.count, 10);
  const obj = { val: 0 };
  ScrollTrigger.create({
    trigger: num,
    start: "top 88%",
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => (num.textContent = Math.round(obj.val)),
      });
    },
  });
});

/* ───────────────────────────────
   11. MENU — FLOATING IMAGE
─────────────────────────────── */
const menuFloat = document.getElementById("menuFloat");
const menuFloatImg = menuFloat.querySelector("img");
const menuItems = document.querySelectorAll(".menu__item");

if (!isTouch) {
  const floatPos = { x: 0, y: 0 };
  const floatMouse = { x: 0, y: 0 };
  let floatActive = false;

  window.addEventListener("mousemove", (e) => {
    floatMouse.x = e.clientX;
    floatMouse.y = e.clientY;
  });

  gsap.ticker.add(() => {
    if (!floatActive) return;
    floatPos.x += (floatMouse.x - floatPos.x) * 0.1;
    floatPos.y += (floatMouse.y - floatPos.y) * 0.1;
    gsap.set(menuFloat, { left: floatPos.x, top: floatPos.y });
  });

  menuItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      menuFloatImg.src = item.dataset.img;
      floatActive = true;
      // snap position so it doesn't fly across the screen
      floatPos.x = floatMouse.x;
      floatPos.y = floatMouse.y;
      gsap.to(menuFloat, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
      });
    });
    item.addEventListener("mouseleave", () => {
      floatActive = false;
      gsap.to(menuFloat, {
        opacity: 0,
        scale: 0.85,
        duration: 0.4,
        ease: "power3.in",
        overwrite: true,
      });
    });
  });
} else {
  // mobile: inject inline images into each menu item
  menuItems.forEach((item) => {
    const wrap = document.createElement("div");
    wrap.className = "menu__item-img";
    const img = document.createElement("img");
    img.src = item.dataset.img;
    img.alt = item.querySelector(".menu__name").textContent;
    img.loading = "lazy";
    wrap.appendChild(img);
    item.appendChild(wrap);
  });
}

/* ───────────────────────────────
   12. LOCAL TIME (footer clock)
─────────────────────────────── */
const timeEl = document.getElementById("localTime");

function updateTime() {
  const now = new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  timeEl.textContent = `Bengaluru — ${now} IST`;
}
updateTime();
setInterval(updateTime, 30000);

/* ───────────────────────────────
   13. REFRESH ON RESIZE / LOAD
─────────────────────────────── */
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // re-split text so lines reflow correctly
    splitLines.split();
    splitWords.split();
    document.querySelectorAll(".split-lines .line").forEach((line) => {
      if (line.querySelector(".line-inner")) return;
      const inner = document.createElement("span");
      inner.className = "line-inner";
      inner.style.display = "inline-block";
      inner.innerHTML = line.innerHTML;
      line.innerHTML = "";
      line.appendChild(inner);
    });
    ScrollTrigger.refresh();
  }, 300);
});
