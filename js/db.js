/* ════════════════════ db.js ════════════════════
   Single data layer for the entire site.
   Uses Firebase Firestore when FIREBASE_CONFIG is filled,
   otherwise falls back to localStorage automatically.

   Collections (when Firebase):
     customers/{id}       —  { name, whatsapp, birthday, time, savedAt }
     orders/{id}          —  { items, total, customerName, customerWA, createdAt }
     specials/{id}        —  { name, desc, price, img, active, category }
     menu/{id}            —  { name, desc, price, img }
     settings/{id}        —  storage for password, festival, whatsapp keys, etc.

   The admin panel NEVER talks to localStorage directly —
   it calls db.xxx() and db.js picks the right backend.
   ══════════════════════════════════════════════ */

const USE_FIREBASE = !!(FIREBASE_CONFIG && FIREBASE_CONFIG.projectId);

/* ── SHA-256 helper (vanilla JS, no dependencies) ── */
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

const STORAGE_KEYS = {
  menu:          "luckys_menu",
  specials:      "luckys_special",
  users:         "luckys_users",
  backedUsers:   "luckys_backed_users",
  password:      "luckys_admin_password",
  password_hash: "luckys_admin_password",
  festival:      "luckys_festival",
  whatsapp:      "luckys_whatsapp_api",
  orders:        "luckys_orders",
};

/* ── Local helpers ── */
function _lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function _lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

/* ── In-tab change listeners (used by onMenuChange / onSpecialsChange on localStorage) ── */
const _menuListeners = new Set();
function _notifyMenuListeners() {
  _menuListeners.forEach(fn => { try { fn(null); } catch (e) { console.warn(e); } });
}
const _specialsListeners = new Set();
function _notifySpecialsListeners() {
  _specialsListeners.forEach(fn => { try { fn(null); } catch (e) { console.warn(e); } });
}

/* ── Firebase init ── */
let _db = null;  // Firestore instance (lazy)
function _firestore() {
  if (_db) return _db;
  if (!USE_FIREBASE) return null;
  // firebase SDK must be loaded via CDN in admin.html
  if (typeof firebase === "undefined") return null;
  try {
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    _db = firebase.firestore();
    _db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
    return _db;
  } catch (e) {
    console.warn("Firebase init failed — falling back to localStorage", e);
    _db = null;
    return null;
  }
}

/* ── Public API ── */
const db = {

  /* ─── CUSTOMERS ─── */
  async getCustomers() {
    const fs = _firestore();
    if (fs) {
      try {
        const snap = await fs.collection("customers").orderBy("savedAt", "desc").get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) { console.warn("Firestore getCustomers failed, using localStorage", e); }
    }
    // localStorage fallback
    const regular = _lsGet(STORAGE_KEYS.users, []);
    const backed  = _lsGet(STORAGE_KEYS.backedUsers, []);
    const seen = new Set();
    const merged = [];
    [...backed, ...regular].forEach(u => {
      const key = (u.name||"") + "|" + (u.whatsapp||"");
      if (!seen.has(key)) { seen.add(key); merged.push(u); }
    });
    return merged;
  },

  async addCustomer(data) {
    const fs = _firestore();
    if (fs) {
      try {
        const ref = await fs.collection("customers").add({ ...data, savedAt: new Date().toISOString() });
        return ref.id;
      } catch (e) { console.warn("Firestore addCustomer failed, using localStorage", e); }
    }
    const regular = _lsGet(STORAGE_KEYS.users, []);
    regular.push(data);
    _lsSet(STORAGE_KEYS.users, regular);
    // also back up
    const backed = _lsGet(STORAGE_KEYS.backedUsers, []);
    backed.push({ ...data, savedAt: new Date().toISOString() });
    _lsSet(STORAGE_KEYS.backedUsers, backed);
  },

  /* ─── ORDERS ─── */
  async getOrders() {
    const fs = _firestore();
    if (fs) {
      try {
        const snap = await fs.collection("orders").orderBy("createdAt", "desc").limit(200).get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) { console.warn("Firestore getOrders failed, using localStorage", e); }
    }
    return _lsGet(STORAGE_KEYS.orders, []);
  },

  async addOrder(order) {
    const data = { ...order, createdAt: new Date().toISOString() };
    const fs = _firestore();
    if (fs) {
      try {
        const ref = await fs.collection("orders").add(data);
        return ref.id;
      } catch (e) { console.warn("Firestore addOrder failed, using localStorage", e); }
    }
    const orders = _lsGet(STORAGE_KEYS.orders, []);
    orders.unshift(data);
    if (orders.length > 200) orders.length = 200;
    _lsSet(STORAGE_KEYS.orders, orders);
  },

  /* ─── SPECIALS ─── */
  async getSpecials() {
    const fs = _firestore();
    if (fs) {
      try {
        const snap = await fs.collection("specials").get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) { console.warn("Firestore getSpecials failed, using localStorage", e); }
    }
    return _lsGet(STORAGE_KEYS.specials, []);
  },

  async saveSpecials(list) {
    const fs = _firestore();
    if (fs) {
      try {
        const batch = fs.batch();
        const existing = await fs.collection("specials").get();
        existing.docs.forEach(d => batch.delete(d.ref));
        list.forEach(item => batch.set(fs.collection("specials").doc(), item));
        await batch.commit();
      } catch (e) { console.warn("Firestore saveSpecials failed, using localStorage", e); }
    }
    // Always save to localStorage + notify listeners as fallback cache
    _lsSet(STORAGE_KEYS.specials, list);
    _notifySpecialsListeners();
  },

  /* ─── MENU ───
     On first visit to a freshly-deployed site (empty Firestore), this
     auto-seeds the menu from MENU_DATA so customers see every dish
     immediately — no admin login required. Once seeded it's authoritative,
     so later admin add/edit/delete all persist and flow back to the site. */
  async getMenu() {
    const fs = _firestore();
    if (fs) {
      try {
        const snap = await fs.collection("menu").get();
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (data.length > 0) return data;
      } catch (e) { console.warn("Firestore getMenu failed, using localStorage", e); }
      // Firestore empty/unreachable → seed once from the shared default menu.
      const defaults = (window.MENU_DATA || []);
      if (defaults.length) {
        try { await db.saveMenu(defaults.map(d => ({ ...d }))); }
        catch (e) { console.warn("Menu auto-seed failed", e); }
      }
      return defaults.map(d => ({ ...d }));
    }
    return _lsGet(STORAGE_KEYS.menu, []);
  },

  async saveMenu(list) {
    const fs = _firestore();
    if (fs) {
      try {
        const batch = fs.batch();
        const existing = await fs.collection("menu").get();
        existing.docs.forEach(d => batch.delete(d.ref));
        list.forEach(item => batch.set(fs.collection("menu").doc(), item));
        await batch.commit();
      } catch (e) { console.warn("Firestore saveMenu failed, using localStorage", e); }
    }
    // Always save to localStorage + notify listeners as fallback cache
    _lsSet(STORAGE_KEYS.menu, list);
    _notifyMenuListeners();
  },

  /* ─── LIVE MENU UPDATES ───
     Subscribe to menu changes so menu.html refreshes the moment an admin
     adds/edits/deletes a dish — no reload needed. On Firestore this uses
     onSnapshot (true real-time, cross-device). On localStorage it's an
     in-tab callback fired by saveMenu(). Returns an unsubscribe function. */
  onMenuChange(callback) {
    const fs = _firestore();
    if (fs) {
      let unsubscribed = false;
      const unsub = fs.collection("menu").onSnapshot(
        () => { if (!unsubscribed) db.getMenu().then(callback).catch(() => {}); },
        (err) => {
          console.warn("menu onSnapshot failed, falling back to in-tab", err);
          unsubscribed = true;
          _menuListeners.add(callback);
        }
      );
      return () => { unsubscribed = true; unsub(); _menuListeners.delete(callback); };
    }
    _menuListeners.add(callback);
    return () => _menuListeners.delete(callback);
  },

  /* ─── LIVE SPECIALS UPDATES ───
     Mirrors onMenuChange for the specials collection, so a special added /
     edited / toggled / deleted in the admin panel shows up on the main page
     (and anywhere else that subscribes) instantly — no reload needed.
     Firestore = true real-time via onSnapshot; localStorage = in-tab callback. */
  onSpecialsChange(callback) {
    const fs = _firestore();
    if (fs) {
      let unsubscribed = false;
      const unsub = fs.collection("specials").onSnapshot(
        () => { if (!unsubscribed) db.getSpecials().then(callback).catch(() => {}); },
        (err) => {
          console.warn("specials onSnapshot failed, falling back to in-tab", err);
          unsubscribed = true;
          _specialsListeners.add(callback);
        }
      );
      return () => { unsubscribed = true; unsub(); _specialsListeners.delete(callback); };
    }
    _specialsListeners.add(callback);
    return () => _specialsListeners.delete(callback);
  },

  /* ─── SETTINGS ─── */
  async getSetting(key) {
    const fs = _firestore();
    if (fs) {
      try {
        const doc = await fs.collection("settings").doc(key).get();
        if (doc.exists) return doc.data().value;
      } catch (e) {
        console.warn("Firestore read failed for", key, e);
      }
    }
    return _lsGet(STORAGE_KEYS[key], null);
  },

  async setSetting(key, value) {
    const fs = _firestore();
    if (fs) {
      try {
        await fs.collection("settings").doc(key).set({ value }, { merge: true });
        return;
      } catch (e) { console.warn("Firestore setSetting failed, using localStorage", e); }
    }
    _lsSet(STORAGE_KEYS[key], value);
  },

  /* ─── CONVENIENCE: password ─── */
  async getPasswordHash() {
    const fromSetting = await db.getSetting("password_hash");
    if (fromSetting) return fromSetting;
    try {
      const legacy = localStorage.getItem("undefined");
      if (legacy) { const p = JSON.parse(legacy); if (typeof p === "string" && p.length === 64) return p; }
    } catch {}
    try {
      const plain = localStorage.getItem("luckys_admin_password");
      if (plain) { const p = JSON.parse(plain); if (p && typeof p === "string" && p.length < 64) return await sha256(p); }
    } catch {}
    return "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";
  },
  async verifyPassword(plaintext) {
    const storedHash = await db.getPasswordHash();
    const enteredHash = await sha256(plaintext);
    return storedHash === enteredHash;
  },
  async setPassword(plaintext) {
    const hash = await sha256(plaintext);
    return await db.setSetting("password_hash", hash);
  },

  /* ─── CONVENIENCE: festival ─── */
  async getFestival() {
    return await db.getSetting("festival") || { title: "", msg: "" };
  },
  async saveFestival(f) {
    return await db.setSetting("festival", f);
  },

  /* ─── STATUS ─── */
  getBackendLabel() {
    return USE_FIREBASE ? "🔥 Firestore" : "💾 localStorage";
  },
};

/* Make db available to admin.js (which runs after db.js in the <script> order) */
window.db = db;
