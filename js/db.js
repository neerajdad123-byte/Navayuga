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
  menu:        "luckys_menu",
  specials:    "luckys_special",
  users:       "luckys_users",
  backedUsers: "luckys_backed_users",
  password:    "luckys_admin_password",
  festival:    "luckys_festival",
  whatsapp:    "luckys_whatsapp_api",
  orders:      "luckys_orders",
};

/* ── Local helpers ── */
function _lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function _lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

/* ── Firebase init ── */
let _db = null;  // Firestore instance (lazy)
function _firestore() {
  if (_db) return _db;
  if (!USE_FIREBASE) return null;
  // firebase SDK must be loaded via CDN in admin.html
  if (typeof firebase === "undefined") return null;
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    _db = firebase.firestore();
    _db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
    return _db;
  } catch (e) {
    console.warn("Firebase init failed — falling back to localStorage", e);
    return null;
  }
}

/* ── Public API ── */
const db = {

  /* ─── CUSTOMERS ─── */
  async getCustomers() {
    const fs = _firestore();
    if (fs) {
      const snap = await fs.collection("customers").orderBy("savedAt", "desc").get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
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
      const ref = await fs.collection("customers").add({ ...data, savedAt: new Date().toISOString() });
      return ref.id;
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
      const snap = await fs.collection("orders").orderBy("createdAt", "desc").limit(200).get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return _lsGet(STORAGE_KEYS.orders, []);
  },

  async addOrder(order) {
    const data = { ...order, createdAt: new Date().toISOString() };
    const fs = _firestore();
    if (fs) {
      const ref = await fs.collection("orders").add(data);
      return ref.id;
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
      const snap = await fs.collection("specials").get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return _lsGet(STORAGE_KEYS.specials, []);
  },

  async saveSpecials(list) {
    const fs = _firestore();
    if (fs) {
      const batch = fs.batch();
      const existing = await fs.collection("specials").get();
      existing.docs.forEach(d => batch.delete(d.ref));
      list.forEach(item => batch.set(fs.collection("specials").doc(), item));
      await batch.commit();
      return;
    }
    _lsSet(STORAGE_KEYS.specials, list);
  },

  /* ─── MENU ─── */
  async getMenu() {
    const fs = _firestore();
    if (fs) {
      const snap = await fs.collection("menu").get();
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (data.length > 0) return data;
    }
    return _lsGet(STORAGE_KEYS.menu, []);
  },

  async saveMenu(list) {
    const fs = _firestore();
    if (fs) {
      const batch = fs.batch();
      const existing = await fs.collection("menu").get();
      existing.docs.forEach(d => batch.delete(d.ref));
      list.forEach(item => batch.set(fs.collection("menu").doc(), item));
      await batch.commit();
      return;
    }
    _lsSet(STORAGE_KEYS.menu, list);
  },

  /* ─── SETTINGS ─── */
  async getSetting(key) {
    const fs = _firestore();
    if (fs) {
      const doc = await fs.collection("settings").doc(key).get();
      return doc.exists ? doc.data().value : null;
    }
    return _lsGet(STORAGE_KEYS[key], null);
  },

  async setSetting(key, value) {
    const fs = _firestore();
    if (fs) {
      await fs.collection("settings").doc(key).set({ value }, { merge: true });
      return;
    }
    _lsSet(STORAGE_KEYS[key], value);
  },

  /* ─── CONVENIENCE: password ─── */
  async getPasswordHash() {
    return await db.getSetting("password_hash") || "6cabf56fe0e08cdc0a6d9a2c7a436d758e5ae258e5a9bfb17647e031d2195243";
  },
  async verifyPassword(plaintext) {
    const storedHash = await db.getPasswordHash();
    const enteredHash = await sha256(plaintext);
    return storedHash === enteredHash;
  },
  async setPassword(plaintext) {
    // store only SHA-256 hash — plaintext never touches disk
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
