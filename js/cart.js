/* ═══════════════════════════════════════════════════════════
   LUCKY'S BIRIYANIHOUSE — cart.js
   ───────────────────────────────────────────────────────────
   ONE shared cart for ALL pages. Saved to localStorage so
   adding Mutton Biryani on menu.html keeps it in the cart when
   you jump back to index.html. Includes checkout → WhatsApp +
   saves order to db.js (cloud or local).
   ═══════════════════════════════════════════════════════════ */

const CART = (() => {
  const STORE_KEY = "luckys_cart";

  // in-memory + persistent
  let items = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(items)); } catch (e) {}
    notify();
  }

  /* listeners so each page's UI (count badge, sidebar, total) stays in sync */
  const listeners = new Set();
  function subscribe(fn) { listeners.add(fn); fn(); return () => listeners.delete(fn); }
  function notify() { listeners.forEach(fn => fn()); }

  /* cross-tab sync — open two pages, cart updates live */
  window.addEventListener("storage", (e) => {
    if (e.key === STORE_KEY) { items = load(); notify(); }
  });

  /* ── ACTIONS ── */
  function add(name, price, qty = 1) {
    const existing = items.find(i => i.name === name);
    if (existing) existing.qty += qty;
    else items.push({ name, price: Number(price), qty });
    save();
  }
  function inc(i) { items[i].qty++; save(); }
  function dec(i) {
    items[i].qty--;
    if (items[i].qty <= 0) items.splice(i, 1);
    save();
  }
  function remove(i) { items.splice(i, 1); save(); }
  function clear() { items = []; save(); }

  function get() { return items.slice(); }
  function count() { return items.reduce((s, i) => s + i.qty, 0); }
  function total() { return items.reduce((s, i) => s + i.price * i.qty, 0); }

  /* ── CHECKOUT: WhatsApp + save to db.js ── */
  async function checkout() {
    if (!items.length) return;

    // ── After-hours notice (9am–10pm IST) ──
    const istDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const istHour = new Date(istDate).getHours();
    const isAfterHours = istHour < 9 || istHour >= 22;

    const wa = (window.SITE_CONFIG && SITE_CONFIG.whatsapp) || "914000000000";
    const baseMsg = items.map(c => `  ${c.qty}x ${c.name} — ₹${c.price * c.qty}`).join("\n");
    const msg = isAfterHours
      ? encodeURIComponent(`🌙 AFTER-HOURS ORDER\n\nHi Lucky's! Placing an order for tomorrow:\n${baseMsg}\n\nTotal: ₹${total()}\n\n(Ordered after hours — please process when you open)` )
      : encodeURIComponent(`Hi Lucky's! I'd like to order:\n${baseMsg}\n\nTotal: ₹${total()}`);

    if (isAfterHours) {
      alert("🌙 It's currently outside opening hours (9 am – 10 pm).\n\nYour order will still be sent to Lucky's and processed when they open. Thank you!");
    }
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");

    if (window.db) {
      try {
        const customer = JSON.parse(localStorage.getItem("luckys_user_info")) || null;
        await db.addOrder({
          items: items.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
          total: total(),
          customerName: customer ? customer.name : "",
          customerWA: customer ? customer.whatsapp : "",
        });
      } catch (e) {}
    }
  }

  /* ── PUBLIC: check if currently open ── */
  function isOpen() {
    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const h = new Date(now).getHours();
    return h >= 9 && h < 22;
  }

  return { add, inc, dec, remove, clear, get, count, total, checkout, subscribe, isOpen };
})();

window.CART = CART;
