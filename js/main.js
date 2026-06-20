/* ═══════════════════════════════════════════
   LUCKY'S BIRIYANIHOUSE — main.js
   Requires: GSAP, ScrollTrigger, SplitType, Lenis (loaded via CDN)
   ═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

const isTouch = window.matchMedia("(hover: none)").matches;
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ───────────────────────────────
   THEME SWITCHER
─────────────────────────────── */
const themeSwitch = document.createElement('button');
themeSwitch.className = 'theme-switch';
themeSwitch.setAttribute('aria-label', 'Toggle theme');
themeSwitch.innerHTML = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
`;
document.body.appendChild(themeSwitch);

const moonIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const sunIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;

function getTheme() {
  return localStorage.getItem('luckys_theme') || 'light';
}

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeSwitch.innerHTML = moonIcon;
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeSwitch.innerHTML = sunIcon;
  }
  localStorage.setItem('luckys_theme', theme);
}

// Initialize theme
setTheme(getTheme());

themeSwitch.addEventListener('click', () => {
  const current = getTheme();
  setTheme(current === 'light' ? 'dark' : 'light');
});

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
   3. PRELOADER  (plays ONCE per browser session, not every navigation)
─────────────────────────────── */
const preloader = document.getElementById("preloader");
const counterEl = document.getElementById("counter");
const words = gsap.utils.toArray(".preloader__word");

// Already shown earlier this session? Skip the whole animation.
const PRELOADER_SESSION_KEY = "luckys_preloader_done";

function startSite() {
  lenis.start();
  heroIntro();
}

if (prefersReduced || sessionStorage.getItem(PRELOADER_SESSION_KEY)) {
  preloader.style.display = "none";
  startSite();
} else {
  // mark as seen so it won't replay when navigating back to home
  sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
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

  tl.to(".hero__img", { scale: 1, duration: 2, ease: "power3.out" }, 0)
    .to(".hero__title-text", {
      yPercent: 0, duration: 1.2, stagger: 0.12,
    }, 0.2)
    .to(".hero__eyebrow span", { yPercent: 0, duration: 0.9 }, 0.5)
    .to(".hero__tagline .line-inner", {
      yPercent: 0, duration: 0.9, stagger: 0.08,
    }, 0.7)
    .to(".hero__scroll", { opacity: 1, y: 0, duration: 0.8 }, 1)
    .to(".hero__badge", { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.6)" }, 0.9);

  gsap.to(".nav", {
    opacity: 1,
    visibility: "visible",
    duration: 0.7,
    delay: 1.1,
    ease: "power2.out",
  });
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
      else if (type === "-hide") {
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

// split-words blocks (story text)
gsap.utils.toArray(".split-words").forEach((block) => {
  gsap.from(block.querySelectorAll(".word"), {
    opacity: 0.12, y: 14, duration: 0.6, stagger: 0.025, ease: "power2.out",
    scrollTrigger: { trigger: block, start: "top 80%", end: "top 35%", scrub: true },
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

/* ───────────────────────────────
   10. LOCAL TIME (footer clock)
─────────────────────────────── */
const timeEl = document.getElementById("localTime");

function updateTime() {
  const now = new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  timeEl.textContent = `Eluru — ${now} IST`;
}
updateTime();
setInterval(updateTime, 30000);

/* ───────────────────────────────
   11. CART SYSTEM  (shared across pages via cart.js)
─────────────────────────────── */
const cartToggle = document.getElementById("cartToggle");
const cartEl = document.getElementById("cart");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartFooter = document.getElementById("cartFooter");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const cartCheckout = document.getElementById("cartCheckout");

function openCart() {
  cartEl.classList.add("is-open");
  cartOverlay.classList.add("is-open");
}
function closeCart() {
  cartEl.classList.remove("is-open");
  cartOverlay.classList.remove("is-open");
}

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function renderCart() {
  const cart = CART.get();
  const total = CART.total();
  cartCount.textContent = CART.count();
  cartCount.classList.add("bump");
  setTimeout(() => cartCount.classList.remove("bump"), 300);

  if (cart.length === 0) {
    cartEmpty.style.display = "flex";
    cartFooter.style.display = "none";
  } else {
    cartEmpty.style.display = "none";
    cartFooter.style.display = "block";
    cartItems.innerHTML = cart.map((item, i) => `
      <li class="cart__item">
        <div class="cart__item-info">
          <div class="cart__item-name">${item.name}</div>
          <div class="cart__item-price">₹ ${item.price} each</div>
        </div>
        <div class="cart__item-qty">
          <button data-qty-dec="${i}">−</button>
          <span>${item.qty}</span>
          <button data-qty-inc="${i}">+</button>
        </div>
        <button class="cart__item-remove" data-remove="${i}">&times;</button>
      </li>
    `).join("");
  }
  cartTotal.textContent = `₹ ${total}`;
}

// keep cart UI in sync across pages and browser tabs
CART.subscribe(renderCart);

cartItems.addEventListener("click", (e) => {
  const incBtn = e.target.closest("[data-qty-inc]");
  const decBtn = e.target.closest("[data-qty-dec]");
  const removeBtn = e.target.closest("[data-remove]");
  if (incBtn) CART.inc(parseInt(incBtn.dataset.qtyInc, 10));
  if (decBtn) CART.dec(parseInt(decBtn.dataset.qtyDec, 10));
  if (removeBtn) CART.remove(parseInt(removeBtn.dataset.remove, 10));
});

cartCheckout.addEventListener("click", () => {
  if (CART.get().length === 0) return;
  CART.checkout();
});

/* ───────────────────────────────
   12. USER INFO POPUP
─────────────────────────────── */
const userPopupOverlay = document.getElementById("userPopupOverlay");
const userPopup = document.getElementById("userPopup");
const userPopupForm = document.getElementById("userPopupForm");
const popupSkip = document.getElementById("popupSkip");

const STORAGE_USER = "luckys_user_info";

if (sessionStorage.getItem("luckys_popup_seen") || localStorage.getItem(STORAGE_USER)) {
  // already submitted or skipped this session
} else {
  setTimeout(() => {
    userPopupOverlay.classList.add("is-open");
    userPopup.classList.add("is-open");
  }, 4000);
}

function closePopup() {
  userPopupOverlay.classList.remove("is-open");
  userPopup.classList.remove("is-open");
  sessionStorage.setItem("luckys_popup_seen", "1");
}

userPopupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("popupName").value.trim();
  const whatsapp = document.getElementById("popupWhatsapp").value.trim();
  const birthday = document.getElementById("popupBirthday").value;
  if (!name) return;

  const userData = { name, whatsapp, birthday, time: new Date().toLocaleString("en-IN") };
  // local cache so checkout can attach this customer to the order
  localStorage.setItem(STORAGE_USER, JSON.stringify(userData));

  // save to the real data layer (cloud if configured, else local)
  if (window.db) {
    try { await db.addCustomer(userData); } catch (err) { console.warn("addCustomer failed", err); }
  }

  closePopup();
});

popupSkip.addEventListener("click", closePopup);

/* ───────────────────────────────
   13. SPECIAL ITEMS (injected) — reads from db.js
─────────────────────────────── */
async function syncSpecials() {
  let specials = [];
  if (window.db) {
    try { specials = await db.getSpecials(); } catch (e) { console.warn("getSpecials failed", e); specials = []; }
  }
  // legacy fallback
  if (!specials.length) {
    try { specials = JSON.parse(localStorage.getItem("luckys_special")) || []; } catch (e) { specials = []; }
  }
  const existing = document.getElementById("specialsSection");
  if (existing) existing.remove();

  const active = specials.filter(s => s.active && s.name);
  if (active.length === 0) return;

  const section = document.createElement("section");
  section.id = "specialsSection";
  section.className = "specials";

  const grid = active.map(s => `
    <a href="${s.category ? 'menu.html#' + s.category : 'menu.html'}" class="specials__card">
      ${s.img ? `<div class="specials__card-img"><img src="${s.img}" alt="${s.name}" /></div>` : ""}
      <div class="specials__card-body">
        <h3 class="specials__card-name">${s.name}</h3>
        <p class="specials__card-desc">${s.desc}</p>
        <span class="specials__card-price">₹ ${s.price} <span class="specials__card-arrow">→</span></span>
      </div>
    </a>
  `).join("");

  section.innerHTML = `
    <div class="specials__ribbon">✦ Today's Specials ✦</div>
    <div class="specials__grid">${grid}</div>
  `;
  const marquee = document.querySelector(".marquee");
  if (marquee) marquee.insertAdjacentElement("afterend", section);
}
syncSpecials();

// Subscribe to live specials changes so a special added / edited / toggled /
// deleted in the admin panel appears on this page instantly — no reload needed.
if (window.db && typeof db.onSpecialsChange === "function") {
  db.onSpecialsChange(() => syncSpecials());
}

/* ───────────────────────────────
   14. POPULATE CONTACT / HOURS / FOOTER FROM config.js
─────────────────────────────── */
function applyConfig() {
  if (!window.SITE_CONFIG) return;
  const c = SITE_CONFIG;

  // footer social + copyright
  const social = c.social || {};
  const links = [];
  if (social.instagram) links.push(`<a href="${social.instagram}" target="_blank" rel="noopener" class="footer__link magnetic" data-cursor="-sm">Instagram</a>`);
  if (social.zomato) links.push(`<a href="${social.zomato}" target="_blank" rel="noopener" class="footer__link magnetic" data-cursor="-sm">Zomato</a>`);
  if (social.swiggy) links.push(`<a href="${social.swiggy}" target="_blank" rel="noopener" class="footer__link magnetic" data-cursor="-sm">Swiggy</a>`);
  if (social.facebook) links.push(`<a href="${social.facebook}" target="_blank" rel="noopener" class="footer__link magnetic" data-cursor="-sm">Facebook</a>`);
  if (c.mapLink) links.push(`<a href="${c.mapLink}" target="_blank" rel="noopener" class="footer__link magnetic" data-cursor="-sm">Google Maps</a>`);
  const fl = document.getElementById("footerLinks");
  if (fl) fl.innerHTML = links.join("") || `<a href="#" class="footer__link">Lucky's</a>`;
  const copy = document.getElementById("footerCopyright");
  if (copy) copy.textContent = `© ${new Date().getFullYear()} ${c.name}. All flavours reserved.`;

  // reserve section
  const addr = document.getElementById("reserveAddress");
  if (addr && c.address) addr.innerHTML = c.address.replace(/,\s*/g, "<br/>");

  const hours = document.getElementById("reserveHours");
  if (hours) {
    const closed = (c.hours.closedDays || []).join(" & ");
    hours.textContent = `${c.hours.open} – ${c.hours.close}${closed ? ", closed " + closed : ", open every day"}`;
  }

  const contact = document.getElementById("reserveContact");
  if (contact) contact.innerHTML = `${c.phoneDisplay}<br/>${c.email}`;

  const reserveBtn = document.getElementById("reserveBtn");
  if (reserveBtn && c.phoneDial) reserveBtn.href = `tel:${c.phoneDial}`;

  const mapLink = document.getElementById("reserveMapLink");
  if (mapLink && c.mapLink) mapLink.href = c.mapLink;
  const mapIframe = document.getElementById("reserveMapIframe");
  if (mapIframe && c.mapEmbed) mapIframe.src = c.mapEmbed;
}
applyConfig();

/* ───────────────────────────────
   15. REFRESH ON RESIZE / LOAD
─────────────────────────────── */
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
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
