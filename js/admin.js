/* ═══════════ LUCKY'S BIRIYANIHOUSE ADMIN — admin.js ═══════════
   Now powered by db.js (Firebase cloud OR localStorage fallback).
   Passwords are SHA-256 hashed — plaintext never stored on disk.
   Menu data sourced from menu-data.js (shared with menu.html). */

// DEFAULT_MENU comes from menu-data.js (loaded before this script)
// data helpers use db.js
async function getMenu() {
  const m = await db.getMenu();
  if (m.length) return m;
  // Nothing in the backend yet → use the shared default list (with categories).
  return (window.MENU_DATA || []).map(d => ({ ...d }));
}
async function saveMenu(m)   { await db.saveMenu(m); }
async function getSpecials() { return await db.getSpecials(); }
async function saveSpecials(l) { await db.saveSpecials(l); }
async function getFestival() { return await db.getFestival(); }
async function saveFestival(f) { return await db.saveFestival(f); }
async function getUsers()    { return await db.getCustomers(); }
async function verifyPassword(pw) { return await db.verifyPassword(pw); }
async function setPassword(pw)    { return await db.setPassword(pw); }
async function getOrders()   { return await db.getOrders(); }

/* One-time seed: if the backend menu collection is empty AND we haven't
   seeded this browser yet, push the full default menu (with categories) so
   the admin list matches what customers see on menu.html. Safe to re-run —
   guarded by a settings flag so it never overwrites later edits. */
async function ensureMenuSeeded() {
  if (!window.db) return; // localStorage backend: getMenu already returns defaults
  const existing = await db.getMenu();
  if (existing && existing.length) return; // already populated — don't touch
  const defaults = (window.MENU_DATA || []).map(d => ({ ...d }));
  if (!defaults.length) return;
  try { await db.saveMenu(defaults); } catch (e) { console.warn("Menu seed failed", e); }
}

/* ═══ DOM ═══ */
const loginScreen       = document.getElementById("adminLogin");
const dashScreen        = document.getElementById("adminDash");
const loginForm         = document.getElementById("loginForm");
const loginPassword     = document.getElementById("loginPassword");
const loginError        = document.getElementById("loginError");
const btnLogout         = document.getElementById("btnLogout");
const adminStatus       = document.getElementById("adminStatus");
const menuList          = document.getElementById("menuList");
const userList          = document.getElementById("userList");
const birthdayList      = document.getElementById("birthdayList");
const specialList       = document.getElementById("specialList");
const ordersList        = document.getElementById("ordersList");
const festivalForm      = document.getElementById("festivalForm");
const passwordForm      = document.getElementById("passwordForm");
const passwordMsg       = document.getElementById("passwordMsg");
const editModal         = document.getElementById("editModal");
const editForm          = document.getElementById("editForm");
const modalClose        = document.getElementById("modalClose");
const editIndex         = document.getElementById("editIndex");
const editName          = document.getElementById("editName");
const editDesc          = document.getElementById("editDesc");
const editPrice         = document.getElementById("editPrice");
const editImg           = document.getElementById("editImg");
const editImgFile       = document.getElementById("editImgFile");
const editImgPreview    = document.getElementById("editImgPreview");
const editImgPreviewImg = document.getElementById("editImgPreviewImg");
const editCategory      = document.getElementById("editCategory");
const specialCategoryRow= document.getElementById("specialCategoryRow");

let pendingEditFileDataUrl   = "";
let pendingSpecialFileDataUrl= "";

/* Image file → base64 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* Edit img file preview */
if (editImgFile) {
  editImgFile.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    pendingEditFileDataUrl = dataUrl;
    editImgPreview.style.display = "block";
    editImgPreviewImg.src = dataUrl;
  });
}

/* ═══ LOGIN ═══ */
initLogin();

async function initLogin() {
  if (sessionStorage.getItem("luckys_admin")) {
    showDash();
    return;
  }
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";
    try {
      const ok = await verifyPassword(loginPassword.value);
      if (ok) {
        sessionStorage.setItem("luckys_admin", "1");
        showDash();
      } else {
        loginError.textContent = "Wrong password. Default is: admin";
      }
    } catch (err) {
      loginError.textContent = "Error: " + err.message;
      console.error("Login error:", err);
    }
  });
}

btnLogout.addEventListener("click", () => {
  sessionStorage.removeItem("luckys_admin");
  // Send the user back to the main page (as requested)
  window.location.href = "index.html";
});

async function showDash() {
  loginScreen.style.display = "none";
  dashScreen.style.display = "block";
  adminStatus.textContent = "🔗 Backend: " + db.getBackendLabel();
  // Seed the menu on first use so the admin list matches menu.html.
  try { await ensureMenuSeeded(); } catch (e) { console.warn("seed skipped", e); }
  renderAll();
}

/* ═══ TABS ═══ */
document.querySelectorAll(".admin-tabs__btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".admin-tabs__btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    renderAll();
  });
});

/* ═══ ORDERS ═══ */
async function renderOrders() {
  const orders = await getOrders();
  if (!orders || orders.length === 0) {
    ordersList.innerHTML = '<div class="admin-empty">No orders yet. Orders placed via the cart appear here.</div>';
    return;
  }
  ordersList.innerHTML = orders.map((o, i) => {
    const itemsHtml = (o.items || []).map(item => 
      `<span style="display:inline-block;background:var(--bg-3);padding:0.2rem 0.5rem;border-radius:4px;margin:0.15rem">${item.qty}x ${item.name}</span>`
    ).join(" ");
    const time = o.createdAt ? new Date(o.createdAt).toLocaleString("en-IN") : (o.time || "");
    return `
    <div class="admin-list__item" style="flex-direction:column;align-items:flex-start;gap:0.5rem">
      <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
        <span style="font-family:var(--serif);font-weight:400">Order #${orders.length - i}</span>
        <span style="font-size:0.75rem;color:var(--cream-dim)">${time}</span>
      </div>
      <div style="font-size:0.8rem;color:var(--cream-dim)">Customer: ${o.customerName || "—"} ${o.customerWA ? "· WA: " + o.customerWA : ""}</div>
      <div style="font-size:0.82rem">${itemsHtml}</div>
      <div style="font-family:var(--serif);color:var(--saffron);font-size:1.05rem">₹ ${o.total || 0}</div>
    </div>`;
  }).join("");
}

document.getElementById("btnRefreshOrders").addEventListener("click", () => { renderOrders(); renderAll(); });

/* ═══ MENU ═══ */
async function renderMenu() {
  const menu = await getMenu();
  if (menu.length === 0) {
    menuList.innerHTML = '<div class="admin-empty">No items yet. Add one above.</div>';
    return;
  }
  menuList.innerHTML = menu.map((item, i) => `
    <div class="admin-list__item">
      <img src="${item.img}" alt="${item.name}" />
      <div class="admin-list__item-info">
        <div class="admin-list__item-name">${String(i+1).padStart(2,"0")}. ${item.name}</div>
        <div class="admin-list__item-desc">${item.desc}</div>
      </div>
      <div class="admin-list__item-price">₹ ${item.price}</div>
      <div class="admin-list__item-actions">
        <button class="admin-btn admin-btn--edit" data-edit="${i}">Edit</button>
        <button class="admin-btn admin-btn--del" data-del="${i}">Delete</button>
      </div>
    </div>`).join("");

  menuList.querySelectorAll("[data-edit]").forEach(btn => btn.addEventListener("click", () => openEdit(parseInt(btn.dataset.edit))));
  menuList.querySelectorAll("[data-del]").forEach(btn => btn.addEventListener("click", () => deleteItem(parseInt(btn.dataset.del))));
}

document.getElementById("btnAddItem").addEventListener("click", () => openEdit(-1));

async function openEdit(index) {
  if (!editModal) return;
  pendingEditFileDataUrl = "";
  if (editImgPreview) editImgPreview.style.display = "none";
  if (editImgPreviewImg) editImgPreviewImg.src = "";
  if (editImgFile) editImgFile.value = "";
  const menu = await getMenu();
  if (index >= 0) {
    document.getElementById("editTitle").textContent = "Edit Item";
    editIndex.value = index;
    editName.value = menu[index].name;
    editDesc.value = menu[index].desc;
    editPrice.value = menu[index].price;
    editImg.value = menu[index].img;
    if (editCategory) editCategory.value = menu[index].cat || "";
  } else {
    document.getElementById("editTitle").textContent = "Add Item";
    editIndex.value = -1;
    editName.value = "";
    editDesc.value = "";
    editPrice.value = "";
    editImg.value = "images/placeholder.svg";
    if (editCategory) editCategory.value = "";
  }
  // Show the category selector for regular menu items too, so new dishes
  // land in the right section on menu.html.
  if (specialCategoryRow) {
    specialCategoryRow.style.display = "flex";
    const lbl = specialCategoryRow.querySelector("label");
    if (lbl) lbl.textContent = "Menu Category";
  }
  editModal.classList.add("is-open");
}

/* ═══ EDIT FORM (single handler — handles both menu items & specials) ═══
   The hidden editIndex tells us which mode we're in:
     "" or a non-negative integer → menu item (index in the menu list)
     "special_new"               → adding a special
     "special_<n>"               → editing special at index n
   One handler avoids the fragile capture+stopImmediatePropagation trick. */
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const idxVal = editIndex.value;

  // ── Special item? ──
  if (typeof idxVal === "string" && idxVal.startsWith("special_")) {
    const specials = await getSpecials();
    const imgUrl = pendingSpecialFileDataUrl || editImg.value.trim() || "images/placeholder.svg";
    const category = editCategory ? editCategory.value.trim() : "";
    const item = { name: editName.value.trim(), desc: editDesc.value.trim(), price: parseInt(editPrice.value) || 0, img: imgUrl, active: true, category };
    if (!item.name || !item.price) return;
    if (idxVal === "special_new") {
      specials.push(item);
    } else {
      const i = parseInt(idxVal.replace("special_", ""));
      if (Number.isNaN(i) || !specials[i]) return;
      item.active = specials[i].active; // preserve existing active flag
      specials[i] = item;
    }
    await saveSpecials(specials);
    editModal.classList.remove("is-open");
    editForm.reset();
    editIndex.value = "";
    renderSpecial();
    return;
  }

  // ── Menu item ──
  const menu = await getMenu();
  const idx = parseInt(idxVal);
  const imgUrl = pendingEditFileDataUrl || editImg.value.trim() || "images/placeholder.svg";
  const cat = editCategory ? editCategory.value.trim() : "";
  const item = { name: editName.value.trim(), desc: editDesc.value.trim(), price: parseInt(editPrice.value) || 0, img: imgUrl, cat };
  if (!item.name || !item.price) return;
  if (!Number.isNaN(idx) && idx >= 0 && menu[idx]) {
    // preserve any extra fields the base item had (e.g. priceHalf/priceFull)
    item.cat = cat || menu[idx].cat || "other";
    menu[idx] = { ...menu[idx], ...item };
  } else {
    item.cat = cat || "other";
    menu.push(item);
  }
  await saveMenu(menu);
  editModal.classList.remove("is-open");
  renderMenu();
});

modalClose.addEventListener("click", () => editModal.classList.remove("is-open"));
editModal.addEventListener("click", (e) => { if (e.target === editModal) editModal.classList.remove("is-open"); });

async function deleteItem(index) {
  if (!confirm("Delete this item?")) return;
  const menu = await getMenu();
  menu.splice(index, 1);
  await saveMenu(menu);
  renderMenu();
}

/* ═══ SPECIAL ITEMS ═══ */
async function renderSpecial() {
  const specials = await getSpecials();
  if (!specials || specials.length === 0) {
    specialList.innerHTML = '<div class="admin-empty">No special items yet. Add one above.</div>';
    return;
  }
  specialList.innerHTML = specials.map((item, i) => `
    <div class="admin-list__item">
      <img src="${item.img}" alt="${item.name}" />
      <div class="admin-list__item-info">
        <div class="admin-list__item-name">${item.name} ${item.active ? '<span class="admin-badge" style="background:var(--green);margin-left:0.4rem">Active</span>' : '<span class="admin-badge" style="background:var(--cream-dim);margin-left:0.4rem">Inactive</span>'}</div>
        <div class="admin-list__item-desc">${item.desc}</div>
      </div>
      <div class="admin-list__item-price">₹ ${item.price}</div>
      <div class="admin-list__item-actions">
        <button class="admin-btn admin-btn--edit" data-stoggle="${i}">${item.active ? 'Deactivate' : 'Activate'}</button>
        <button class="admin-btn admin-btn--edit" data-sedit="${i}">Edit</button>
        <button class="admin-btn admin-btn--del" data-sdel="${i}">Delete</button>
      </div>
    </div>`).join("");

  specialList.querySelectorAll("[data-stoggle]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const i = parseInt(btn.dataset.stoggle);
      const specials = await getSpecials();
      specials[i].active = !specials[i].active;
      await saveSpecials(specials);
      renderSpecial();
    });
  });
  specialList.querySelectorAll("[data-sedit]").forEach(btn => {
    btn.addEventListener("click", () => openSpecialEdit(parseInt(btn.dataset.sedit)));
  });
  specialList.querySelectorAll("[data-sdel]").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this special item?")) return;
      const specials = await getSpecials();
      specials.splice(parseInt(btn.dataset.sdel), 1);
      await saveSpecials(specials);
      renderSpecial();
    });
  });
}

const btnAddSpecial = document.getElementById("btnAddSpecial");
if (btnAddSpecial) btnAddSpecial.addEventListener("click", () => openSpecialEdit(-1));

async function openSpecialEdit(index) {
  pendingSpecialFileDataUrl = "";
  if (editImgPreview) editImgPreview.style.display = "none";
  if (editImgPreviewImg) editImgPreviewImg.src = "";
  if (editImgFile) editImgFile.value = "";
  const specials = await getSpecials();
  if (index >= 0) {
    document.getElementById("editTitle").textContent = "Edit Special";
    editIndex.value = "special_" + index;
    editName.value = specials[index].name;
    editDesc.value = specials[index].desc;
    editPrice.value = specials[index].price;
    editImg.value = specials[index].img;
    if (editCategory) editCategory.value = specials[index].category || "";
  } else {
    document.getElementById("editTitle").textContent = "Add Special Item";
    editIndex.value = "special_new";
    editName.value = "";
    editDesc.value = "";
    editPrice.value = "";
    editImg.value = "images/placeholder.svg";
    if (editCategory) editCategory.value = "";
  }
  if (specialCategoryRow) specialCategoryRow.style.display = "flex";
  editModal.classList.add("is-open");
  if (editImgFile) {
    editImgFile.addEventListener("change", async function handler(e) {
      const file = e.target.files[0];
      if (!file) return;
      const dataUrl = await fileToDataUrl(file);
      pendingSpecialFileDataUrl = dataUrl;
      if (editImgPreview) editImgPreview.style.display = "block";
      if (editImgPreviewImg) editImgPreviewImg.src = dataUrl;
    }, { once: true });
  }
}

/* (editForm submit is handled by the single consolidated handler above,
     which dispatches between menu items and specials based on editIndex.) */

/* ═══ FESTIVAL OFFERS ═══ */
async function renderFestival() {
  const f = await getFestival();
  document.getElementById("festivalTitle").value = f.title || "";
  document.getElementById("festivalMsg").value = f.msg || "";
}

festivalForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("festivalTitle").value.trim();
  const msg = document.getElementById("festivalMsg").value.trim();
  if (!title && !msg) { alert("Please enter a title or message."); return; }
  const fullMsg = `*${title || "Festival Offer"}*\n\n${msg}\n\n— Lucky's Biriyanihouse, Eluru`;
  const encoded = encodeURIComponent(fullMsg);
  const users = await getUsers();
  const withWA = users.filter(u => u.whatsapp && u.whatsapp.trim());
  if (!withWA.length) { alert("No customers with WhatsApp numbers found."); return; }
  await saveFestival({ title, msg });
  const preview = document.getElementById("festivalPreview");
  preview.style.display = "block";
  document.getElementById("festivalCount").textContent = withWA.length;
  document.getElementById("festivalRecipients").innerHTML = withWA.map((u, i) => {
    const c = u.whatsapp.replace(/\D/g,'');
    return `<div style="padding:0.4rem 0;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center"><span>${i+1}. ${u.name||"Unknown"} — ${u.whatsapp}</span><a href="https://wa.me/${c}?text=${encoded}" target="_blank" style="color:var(--saffron);text-decoration:underline;font-size:0.75rem">Send ↗</a></div>`;
  }).join("");
  document.getElementById("btnCopyNumbers").onclick = () => {
    const nums = withWA.map(u => u.whatsapp.replace(/\D/g,'')).join(", ");
    navigator.clipboard.writeText(nums).then(() => alert("Copied " + withWA.length + " numbers! Paste into WhatsApp Business → Broadcast Lists."));
  };
  window.open("https://wa.me/" + withWA[0].whatsapp.replace(/\D/g,'') + "?text=" + encoded, "_blank");
  alert("Generated WhatsApp links for " + withWA.length + " customers.");
  renderFestival();
});

/* ═══ BIRTHDAYS ═══ */
async function renderBirthdays() {
  const users = await getUsers();
  const withBD = users.filter(u => u.birthday);
  if (!withBD.length) { birthdayList.innerHTML = '<div class="admin-empty">No customer birthdays recorded yet.</div>'; return; }
  const today = new Date(), y = today.getFullYear();
  const sorted = withBD.map(u => {
    const p = u.birthday.split("-");
    let d = new Date(y, parseInt(p[1])-1, parseInt(p[2]));
    if (d < today) d = new Date(y+1, parseInt(p[1])-1, parseInt(p[2]));
    return { ...u, _nextDate: d };
  }).sort((a,b) => a._nextDate - b._nextDate);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  birthdayList.innerHTML = sorted.map(u => {
    const d = u._nextDate;
    const ds = days[d.getDay()] + ", " + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
    const du = Math.ceil((d - today) / 86400000);
    const badge = du <= 7 ? '<span class="admin-badge">Soon!</span>' : '';
    return `<div class="admin-user"><div class="admin-user__row"><div class="admin-user__field"><span>Name</span><span>${u.name||"—"}</span></div><div class="admin-user__field"><span>Birthday</span><span>${u.birthday} ${badge}</span></div><div class="admin-user__field"><span>Upcoming</span><span>${ds} (${du} days)</span></div><div class="admin-user__field"><span>WhatsApp</span><span>${u.whatsapp||"—"}</span></div></div><div class="admin-user__time">Submitted: ${u.time||"Unknown"}</div></div>`;
  }).join("");
}

/* ═══ CUSTOMERS + CSV ═══ */
async function renderUsers() {
  const users = await getUsers();
  if (!users.length) { userList.innerHTML = '<div class="admin-empty">No customers yet.</div>'; return; }
  userList.innerHTML = `<p style="color:var(--cream-dim);font-size:0.78rem;margin-bottom:1rem">Total customers: ${users.length}</p>` + users.map(u => {
    const backed = u.savedAt ? '<span class="admin-badge" style="background:var(--saffron);margin-left:0.4rem">Backed</span>' : '';
    return `<div class="admin-user"><div class="admin-user__row"><div class="admin-user__field"><span>Name</span><span>${u.name||"—"}${backed}</span></div><div class="admin-user__field"><span>WhatsApp</span><span>${u.whatsapp||"—"}</span></div><div class="admin-user__field"><span>Birthday</span><span>${u.birthday||"—"}</span></div></div><div class="admin-user__time">${u.savedAt?'Backed: '+u.savedAt:'Submitted: '+(u.time||"Unknown")}</div></div>`;
  }).join("");
}

document.getElementById("btnExportCSV").addEventListener("click", async () => {
  const users = await getUsers();
  if (!users.length) { alert("No customers."); return; }
  let csv = "Name,WhatsApp,Birthday,Submitted\n";
  users.forEach(u => csv += `"${(u.name||"").replace(/"/g,'""')}","${(u.whatsapp||"").replace(/"/g,'""')}","${u.birthday||""}","${(u.time||"").replace(/"/g,'""')}"\n`);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "luckys_customers_" + new Date().toISOString().slice(0,10) + ".csv"; a.click();
});

/* ═══ PASSWORD ═══ */
passwordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cur = document.getElementById("currentPassword").value;
  const next = document.getElementById("newPassword").value;
  if (!await verifyPassword(cur)) { passwordMsg.textContent = "Wrong password."; passwordMsg.style.color = "var(--rust)"; return; }
  if (next.length < 4) { passwordMsg.textContent = "Minimum 4 chars."; passwordMsg.style.color = "var(--rust)"; return; }
  await setPassword(next);
  passwordMsg.textContent = "Password updated!"; passwordMsg.style.color = "var(--green)";
  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";
});

/* ═══ RENDER ALL ═══ */
async function renderAll() {
  renderOrders();
  renderMenu();
  renderSpecial();
  renderFestival();
  renderBirthdays();
  renderUsers();
}
