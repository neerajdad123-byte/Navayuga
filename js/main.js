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

let floatPos = { x: 0, y: 0 };
let floatMouse = { x: 0, y: 0 };
let floatActive = false;

if (!isTouch) {

  window.addEventListener("mousemove", (e) => {
    floatMouse.x = e.clientX;
    floatMouse.y = e.clientY;
  });

  gsap.ticker.add(() => {
    if (!floatActive) return;
    floatPos.x += (floatMouse.x - floatPos.x) * 0.1;
    floatPos.y += (floatMouse.y - floatPos.y) * 0.1;
    gsap.set(menuFloat, { left: floatPos.x + 170, top: floatPos.y + 100 });
  });

  menuItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      menuFloatImg.src = item.dataset.img;
      floatActive = true;
      // snap position so it doesn't fly across the screen
      floatPos.x = floatMouse.x + 170;
      floatPos.y = floatMouse.y + 100;
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
   13. CART SYSTEM
─────────────────────────────── */
const cart = [];
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

renderCart();

function renderCart() {
  cartItems.innerHTML = "";
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  cartCount.textContent = count;
  cartCount.classList.add("bump");
  setTimeout(() => cartCount.classList.remove("bump"), 300);

  if (cart.length === 0) {
    cartEmpty.style.display = "flex";
    cartFooter.style.display = "none";
  } else {
    cartEmpty.style.display = "none";
    cartFooter.style.display = "block";
    cart.forEach((item, i) => {
      const li = document.createElement("li");
      li.className = "cart__item";
      li.innerHTML = `
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
      `;
      cartItems.appendChild(li);
    });
  }
  cartTotal.textContent = `₹ ${total}`;
}

document.querySelectorAll(".menu__add").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".menu__item");
    const name = item.dataset.name;
    const price = parseInt(item.dataset.price, 10);
    const existing = cart.find((c) => c.name === name);

    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    btn.classList.add("added");
    btn.textContent = `${cart.find(c => c.name === name).qty}x`;
    setTimeout(() => {
      btn.classList.remove("added");
      btn.textContent = "Add";
    }, 800);

    renderCart();
  });
});

cartItems.addEventListener("click", (e) => {
  const incBtn = e.target.closest("[data-qty-inc]");
  const decBtn = e.target.closest("[data-qty-dec]");
  const removeBtn = e.target.closest("[data-remove]");

  if (incBtn) {
    const i = parseInt(incBtn.dataset.qtyInc, 10);
    cart[i].qty++;
    renderCart();
  }
  if (decBtn) {
    const i = parseInt(decBtn.dataset.qtyDec, 10);
    cart[i].qty--;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    renderCart();
  }
  if (removeBtn) {
    const i = parseInt(removeBtn.dataset.remove, 10);
    cart.splice(i, 1);
    renderCart();
  }
});

cartCheckout.addEventListener("click", () => {
  if (cart.length === 0) return;
  const names = cart.map((c) => `${c.qty}x ${c.name}`).join(", ");
  const msg = encodeURIComponent(
    `Hi Lucky's Biriyanihouse! I'd like to order:\n${cart.map(c => `  ${c.qty}x ${c.name} — ₹${c.price * c.qty}`).join("\n")}\n\nTotal: ₹${cart.reduce((s, i) => s + i.price * i.qty, 0)}`
  );
  window.open(`https://wa.me/914000000000?text=${msg}`, "_blank");
});

/* ───────────────────────────────
   14. USER INFO POPUP
─────────────────────────────── */
const userPopupOverlay = document.getElementById("userPopupOverlay");
const userPopup = document.getElementById("userPopup");
const userPopupForm = document.getElementById("userPopupForm");
const popupSkip = document.getElementById("popupSkip");

const STORAGE_USER = "navayuga_user_info";

if (sessionStorage.getItem("navayuga_popup_seen") || localStorage.getItem(STORAGE_USER)) {
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
  sessionStorage.setItem("navayuga_popup_seen", "1");
}

userPopupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("popupName").value.trim();
  const whatsapp = document.getElementById("popupWhatsapp").value.trim();
  const birthday = document.getElementById("popupBirthday").value;
  if (!name) return;

  const userData = { name, whatsapp, birthday, time: new Date().toLocaleString("en-IN") };
  localStorage.setItem(STORAGE_USER, JSON.stringify(userData));

  // also append to users array for admin
  const STORAGE_USERS = "navayuga_users";
  const users = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_USERS)) || []; } catch (e) { return []; } })();
  users.push(userData);
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));

  closePopup();
});

popupSkip.addEventListener("click", closePopup);

/* ───────────────────────────────
   15. DYNAMIC MENU + SPECIAL OF THE DAY
─────────────────────────────── */
const STORAGE_MENU = "navayuga_menu";
const STORAGE_SPECIAL = "navayuga_special";

const DEFAULT_MENU = [
  { name: "Nizami Haleem Royale", desc: "Eight-hour pounded lamb, bone-marrow ghee, crisped onion, mint", price: 740, img: "images/dish1.jpg" },
  { name: "Charcoal Malai Tikka", desc: "Smoked cream chicken, kasuri butter, charred lime, silver leaf", price: 690, img: "images/dish2.jpg" },
  { name: "Banarasi Chaat Theatre", desc: "Tamarind caviar, yogurt snow, pomegranate, sev clouds — built tableside", price: 520, img: "images/dish3.jpg" },
  { name: "Dakshin Ghee Roast", desc: "Mangalorean fire-paste prawns, curry-leaf oil, neer dosa veils", price: 880, img: "images/dish4.jpg" },
  { name: "The Lucky's Special Thali", desc: "Eleven small acts from across the subcontinent — the whole story, one plate", price: 1450, img: "images/thali.jpg" },
];

function loadMenu() {
  try {
    const data = localStorage.getItem(STORAGE_MENU);
    if (data) { const parsed = JSON.parse(data); if (parsed.length > 0) return parsed; }
  } catch (e) {}
  return structuredClone(DEFAULT_MENU);
}

function loadSpecial() {
  try {
    const data = localStorage.getItem(STORAGE_SPECIAL);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return { name: "", desc: "", price: "", img: "", active: false };
}

/* render menu dynamically if admin has customized it */
function syncMenu() {
  const menu = loadMenu();
  const menuList = document.querySelector(".menu__list");
  if (!menuList) return;

  menuList.innerHTML = "";
  menu.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "menu__item";
    li.dataset.img = item.img;
    li.dataset.cursor = "view";
    li.dataset.name = item.name;
    li.dataset.price = item.price;
    li.innerHTML = `
      <span class="menu__num">${String(i + 1).padStart(2, "0")}</span>
      <div class="menu__name-wrap">
        <h3 class="menu__name">${item.name}</h3>
        <p class="menu__desc">${item.desc}</p>
      </div>
      <span class="menu__price">₹ ${item.price}</span>
      <button class="menu__add" data-cursor="-sm">Add</button>
      <div class="menu__item-img"><img src="${item.img}" alt="${item.name}" /></div>
    `;
    menuList.appendChild(li);
  });

  // reattach cart listeners
  document.querySelectorAll(".menu__add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".menu__item");
      const name = item.dataset.name;
      const price = parseInt(item.dataset.price, 10);
      const existing = cart.find((c) => c.name === name);
      if (existing) { existing.qty++; } else { cart.push({ name, price, qty: 1 }); }
      btn.classList.add("added");
      btn.textContent = `${cart.find(c => c.name === name).qty}x`;
      setTimeout(() => { btn.classList.remove("added"); btn.textContent = "Add"; }, 800);
      renderCart();
    });
  });

  // reattach menu floating image listeners
  const menuItems = document.querySelectorAll(".menu__item");
  if (!isTouch) {
    menuItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        menuFloatImg.src = item.dataset.img;
        floatActive = true;
        floatPos.x = floatMouse.x + 170;
        floatPos.y = floatMouse.y + 100;
        gsap.to(menuFloat, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", overwrite: true });
      });
      item.addEventListener("mouseleave", () => {
        floatActive = false;
        gsap.to(menuFloat, { opacity: 0, scale: 0.85, duration: 0.4, ease: "power3.in", overwrite: true });
      });
    });
  } else {
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
}

/* render special of the day */
function syncSpecial() {
  const s = loadSpecial();
  const existing = document.getElementById("specialSection");
  if (existing) existing.remove();

  if (!s.active || !s.name) return;

  const section = document.createElement("section");
  section.id = "specialSection";
  section.className = "special";
  section.innerHTML = `
    <div class="special__ribbon">✦ Special of the Day ✦</div>
    <div class="special__inner">
      ${s.img ? `<div class="special__img"><img src="${s.img}" alt="${s.name}" /></div>` : ""}
      <div class="special__info">
        <h2 class="special__name">${s.name}</h2>
        <p class="special__desc">${s.desc}</p>
        <span class="special__price">₹ ${s.price}</span>
      </div>
    </div>
  `;

  const storySection = document.getElementById("story");
  if (storySection) {
    storySection.parentNode.insertBefore(section, storySection);
  }
}

syncMenu();
syncSpecial();

/* ───────────────────────────────
   16. REFRESH ON RESIZE / LOAD
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
