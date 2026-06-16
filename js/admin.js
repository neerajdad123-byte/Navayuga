/* ═══════════ LUCKY'S BIRIYANIHOUSE ADMIN — admin.js ═══════════ */

const DEFAULT_PASSWORD = "luckys2024";
const STORAGE_MENU = "luckys_menu";
const STORAGE_SPECIAL = "luckys_special";
const STORAGE_USERS = "luckys_users";
const STORAGE_PASSWORD = "luckys_admin_password";

const DEFAULT_MENU = [];

function getMenu() {
  try { return JSON.parse(localStorage.getItem(STORAGE_MENU)) || structuredClone(DEFAULT_MENU); } catch (e) { return structuredClone(DEFAULT_MENU); }
}
function saveMenu(menu) { localStorage.setItem(STORAGE_MENU, JSON.stringify(menu)); }

function getSpecial() {
  try { return JSON.parse(localStorage.getItem(STORAGE_SPECIAL)) || { name: "", desc: "", price: "", img: "", active: false }; } catch (e) { return { name: "", desc: "", price: "", img: "", active: false }; }
}
function saveSpecial(s) { localStorage.setItem(STORAGE_SPECIAL, JSON.stringify(s)); }

function getUsers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_USERS)) || []; } catch (e) { return []; }
}

function getStoredPassword() {
  return localStorage.getItem(STORAGE_PASSWORD) || DEFAULT_PASSWORD;
}
function setStoredPassword(pw) { localStorage.setItem(STORAGE_PASSWORD, pw); }

/* DOM */
const loginScreen = document.getElementById("adminLogin");
const dashScreen = document.getElementById("adminDash");
const loginForm = document.getElementById("loginForm");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const btnLogout = document.getElementById("btnLogout");
const menuList = document.getElementById("menuList");
const userList = document.getElementById("userList");
const specialForm = document.getElementById("specialForm");
const passwordForm = document.getElementById("passwordForm");
const passwordMsg = document.getElementById("passwordMsg");
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const modalClose = document.getElementById("modalClose");
const editIndex = document.getElementById("editIndex");
const editName = document.getElementById("editName");
const editDesc = document.getElementById("editDesc");
const editPrice = document.getElementById("editPrice");
const editImg = document.getElementById("editImg");
const editImgFile = document.getElementById("editImgFile");
const editImgPreview = document.getElementById("editImgPreview");
const editImgPreviewImg = document.getElementById("editImgPreviewImg");
const specialImgFile = document.getElementById("specialImgFile");
const specialImgPreview = document.getElementById("specialImgPreview");
const specialImgPreviewImg = document.getElementById("specialImgPreviewImg");

let pendingEditFileDataUrl = "";

/* Image file → base64 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* Special img file preview */
specialImgFile.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const dataUrl = await fileToDataUrl(file);
  document.getElementById("specialImg").value = dataUrl;
  specialImgPreview.style.display = "block";
  specialImgPreviewImg.src = dataUrl;
});

/* Edit img file preview */
editImgFile.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const dataUrl = await fileToDataUrl(file);
  pendingEditFileDataUrl = dataUrl;
  editImgPreview.style.display = "block";
  editImgPreviewImg.src = dataUrl;
});

/* LOGIN */
if (sessionStorage.getItem("luckys_admin")) {
  showDash();
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (loginPassword.value === getStoredPassword()) {
    sessionStorage.setItem("luckys_admin", "1");
    showDash();
  } else {
    loginError.textContent = "Wrong password.";
  }
});

btnLogout.addEventListener("click", () => {
  sessionStorage.removeItem("luckys_admin");
  dashScreen.style.display = "none";
  loginScreen.style.display = "flex";
  loginPassword.value = "";
});

function showDash() {
  loginScreen.style.display = "none";
  dashScreen.style.display = "block";
  renderAll();
}

/* TABS */
document.querySelectorAll(".admin-tabs__btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".admin-tabs__btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".admin-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    renderAll();
  });
});

/* MENU */
function renderMenu() {
  const menu = getMenu();
  if (menu.length === 0) {
    menuList.innerHTML = '<div class="admin-empty">No items yet. Add one above.</div>';
    return;
  }
  menuList.innerHTML = menu
    .map(
      (item, i) => `
    <div class="admin-list__item">
      <img src="${item.img}" alt="${item.name}" />
      <div class="admin-list__item-info">
        <div class="admin-list__item-name">0${i + 1}. ${item.name}</div>
        <div class="admin-list__item-desc">${item.desc}</div>
      </div>
      <div class="admin-list__item-price">₹ ${item.price}</div>
      <div class="admin-list__item-actions">
        <button class="admin-btn admin-btn--edit" data-edit="${i}">Edit</button>
        <button class="admin-btn admin-btn--del" data-del="${i}">Delete</button>
      </div>
    </div>`
    )
    .join("");

  menuList.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => openEdit(parseInt(btn.dataset.edit)));
  });
  menuList.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => deleteItem(parseInt(btn.dataset.del)));
  });
}

document.getElementById("btnAddItem").addEventListener("click", () => openEdit(-1));

function openEdit(index) {
  pendingEditFileDataUrl = "";
  editImgPreview.style.display = "none";
  editImgPreviewImg.src = "";
  editImgFile.value = "";

  const menu = getMenu();
  if (index >= 0) {
    document.getElementById("editTitle").textContent = "Edit Item";
    editIndex.value = index;
    editName.value = menu[index].name;
    editDesc.value = menu[index].desc;
    editPrice.value = menu[index].price;
    editImg.value = menu[index].img;
  } else {
    document.getElementById("editTitle").textContent = "Add Item";
    editIndex.value = -1;
    editName.value = "";
    editDesc.value = "";
    editPrice.value = "";
    editImg.value = "images/placeholder.jpg";
  }
  editModal.classList.add("is-open");
}

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const menu = getMenu();
  const idx = parseInt(editIndex.value);
  const imgUrl = pendingEditFileDataUrl || editImg.value.trim() || "images/placeholder.jpg";
  const item = {
    name: editName.value.trim(),
    desc: editDesc.value.trim(),
    price: parseInt(editPrice.value) || 0,
    img: imgUrl,
  };
  if (!item.name || !item.price) return;
  if (idx >= 0) menu[idx] = item;
  else menu.push(item);
  saveMenu(menu);
  editModal.classList.remove("is-open");
  renderMenu();
});

modalClose.addEventListener("click", () => (editModal.classList.remove("is-open")));
editModal.addEventListener("click", (e) => { if (e.target === editModal) editModal.classList.remove("is-open"); });

function deleteItem(index) {
  if (!confirm("Delete this item?")) return;
  const menu = getMenu();
  menu.splice(index, 1);
  saveMenu(menu);
  renderMenu();
}

/* SPECIAL */
function renderSpecial() {
  const s = getSpecial();
  document.getElementById("specialName").value = s.name;
  document.getElementById("specialDesc").value = s.desc;
  document.getElementById("specialPrice").value = s.price;
  document.getElementById("specialImg").value = s.img;
  document.getElementById("specialActive").checked = s.active;
}

specialForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveSpecial({
    name: document.getElementById("specialName").value.trim(),
    desc: document.getElementById("specialDesc").value.trim(),
    price: parseInt(document.getElementById("specialPrice").value) || "",
    img: document.getElementById("specialImg").value.trim(),
    active: document.getElementById("specialActive").checked,
  });
  alert("Special item saved.");
  renderSpecial();
});

/* USERS */
function renderUsers() {
  const users = getUsers();
  if (users.length === 0) {
    userList.innerHTML = '<div class="admin-empty">No user submissions yet.</div>';
    return;
  }
  userList.innerHTML = users
    .map(
      (u, i) => `
    <div class="admin-user">
      <div class="admin-user__row">
        <div class="admin-user__field"><span>Name</span><span>${u.name || "—"}</span></div>
        <div class="admin-user__field"><span>WhatsApp</span><span>${u.whatsapp || "—"}</span></div>
        <div class="admin-user__field"><span>Birthday</span><span>${u.birthday || "—"}</span></div>
      </div>
      <div class="admin-user__time">Submitted: ${u.time || "Unknown"}</div>
    </div>`
    )
    .join("");
}

/* PASSWORD */
passwordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const current = document.getElementById("currentPassword").value;
  const next = document.getElementById("newPassword").value;
  if (current !== getStoredPassword()) {
    passwordMsg.textContent = "Current password is incorrect.";
    passwordMsg.style.color = "var(--rust)";
    return;
  }
  if (next.length < 4) {
    passwordMsg.textContent = "Password must be at least 4 characters.";
    passwordMsg.style.color = "var(--rust)";
    return;
  }
  setStoredPassword(next);
  passwordMsg.textContent = "Password updated.";
  passwordMsg.style.color = "var(--green)";
  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";
});

/* RENDER ALL */
function renderAll() {
  renderMenu();
  renderSpecial();
  renderUsers();
}
