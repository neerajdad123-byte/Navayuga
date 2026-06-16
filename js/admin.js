/* ═══════════ LUCKY'S BIRIYANIHOUSE ADMIN — admin.js ═══════════ */

const DEFAULT_PASSWORD = "luckys2024";
const STORAGE_MENU = "luckys_menu";
const STORAGE_SPECIAL = "luckys_special";
const STORAGE_FESTIVAL = "luckys_festival";
const STORAGE_USERS = "luckys_users";
const STORAGE_PASSWORD = "luckys_admin_password";

const DEFAULT_MENU = [
  { name: "Mutton Biryani Single", desc: "A generous single portion of slow-cooked mutton and fragrant basmati", price: 220, img: "images/placeholder.jpg" },
  { name: "Mutton Biryani Full", desc: "Full plate — two pieces of tender mutton, sealed with dough and baked", price: 380, img: "images/placeholder.jpg" },
  { name: "Mutton Biryani Double Ghosh", desc: "Double the meat, double the joy — four pieces of premium mutton", price: 520, img: "images/placeholder.jpg" },
  { name: "Mutton Biryani Family Pack (4)", desc: "Serves four — the perfect gathering of family around the biryani pot", price: 800, img: "images/placeholder.jpg" },
  { name: "Mutton Biryani Jumbo Pack (5)", desc: "The feast size — five generous portions for the true biryani lover", price: 1100, img: "images/placeholder.jpg" },
  { name: "Mutton Fry Piece Biryani", desc: "Crispy fried mutton pieces layered with aromatic rice and caramelised onions", price: 450, img: "images/placeholder.jpg" },
  { name: "Mutton Moghlai Biryani", desc: "Royal Mughal recipe — saffron, dry fruits, and slow-braised mutton", price: 480, img: "images/placeholder.jpg" },
  { name: "Mutton Kheema Biryani", desc: "Minced mutton cooked with whole spices, layered with long-grain basmati", price: 550, img: "images/placeholder.jpg" },
  { name: "Mutton Nallighosh Biryani", desc: "Hyderabadi specialty — tender lamb shanks falling off the bone", price: 600, img: "images/placeholder.jpg" },
  { name: "Chicken Biryani Single", desc: "One piece of juicy chicken, perfectly spiced for a solo indulgence", price: 160, img: "images/placeholder.jpg" },
  { name: "Chicken Biryani Full", desc: "Two pieces of chicken, sealed and slow-cooked in the traditional dum style", price: 280, img: "images/placeholder.jpg" },
  { name: "Chicken Extra Piece", desc: "Add an extra piece of our signature chicken to any biryani", price: 60, img: "images/placeholder.jpg" },
  { name: "Chicken Biryani Family Pack", desc: "Serves four — share the love, share the biryani", price: 600, img: "images/placeholder.jpg" },
  { name: "Chicken Biryani Jumbo Pack (5)", desc: "Five full portions — for when the whole gang is hungry", price: 750, img: "images/placeholder.jpg" },
  { name: "Egg Biryani", desc: "Boiled eggs nestled in spiced rice — simple, satisfying, sublime", price: 200, img: "images/placeholder.jpg" },
  { name: "Chicken 65 Biryani", desc: "Spicy Chicken 65 pieces tossed with biryani rice — half or full", price: 180, img: "images/placeholder.jpg" },
  { name: "Chicken Boneless Biryani", desc: "Tender boneless chicken chunks, marinated and layered with saffron rice", price: 220, img: "images/placeholder.jpg" },
  { name: "Chicken Fry Piece Biryani", desc: "Crispy fried chicken pieces with aromatic rice and raita — half or full", price: 200, img: "images/placeholder.jpg" },
  { name: "Chicken Lollipop Biryani", desc: "Chicken lollipops perched on a bed of spiced biryani rice", price: 320, img: "images/placeholder.jpg" },
  { name: "Chicken Moghlai Biryani", desc: "Mughal-inspired — dry fruits, cream, and saffron with tender chicken", price: 350, img: "images/placeholder.jpg" },
  { name: "Fish Biryani", desc: "Fresh catch of the day, marinated in coastal spices and layered with rice", price: 320, img: "images/placeholder.jpg" },
  { name: "Prawns Biryani", desc: "Juicy prawns in a fragrant masala, slow-cooked with basmati", price: 350, img: "images/placeholder.jpg" },
  { name: "MLA Potlam Biryani", desc: "The politician's favourite — mutton, chicken, and prawns in one grand potlam", price: 480, img: "images/placeholder.jpg" },
  { name: "Veg Biryani", desc: "Garden-fresh vegetables, slow-cooked with whole spices and basmati", price: 200, img: "images/placeholder.jpg" },
  { name: "Veg Manchurian Biryani", desc: "Indo-Chinese fusion — crispy Manchurian balls meet biryani rice", price: 240, img: "images/placeholder.jpg" },
  { name: "Veg Paneer Biryani", desc: "Soft paneer cubes in spiced rice — a vegetarian's delight", price: 260, img: "images/placeholder.jpg" },
  { name: "Veg Mushroom Biryani", desc: "Earthy mushrooms and aromatic rice, a match made in heaven", price: 280, img: "images/placeholder.jpg" },
  { name: "Kaju Biryani", desc: "Rich cashew nuts and vegetables in a creamy, spiced rice preparation", price: 300, img: "images/placeholder.jpg" },
  { name: "Mixed Veg Biryani", desc: "The best of the garden — mixed vegetables in a festive biryani", price: 300, img: "images/placeholder.jpg" },
  { name: "Chicken 65", desc: "Classic spicy deep-fried chicken starter", price: 240, img: "images/placeholder.jpg" },
  { name: "Chicken Manchuria", desc: "Indo-Chinese chicken Manchurian", price: 240, img: "images/placeholder.jpg" },
  { name: "Chilli Chicken", desc: "Spicy chilli chicken stir-fry", price: 250, img: "images/placeholder.jpg" },
  { name: "Chicken Drumsticks", desc: "Crispy fried chicken drumsticks", price: 280, img: "images/placeholder.jpg" },
  { name: "Chicken Drums of Heaven", desc: "Spicy Indo-Chinese chicken drums", price: 300, img: "images/placeholder.jpg" },
  { name: "Chicken Lollipop", desc: "Crispy chicken lollipops", price: 280, img: "images/placeholder.jpg" },
  { name: "Pepper Chicken", desc: "Black pepper chicken dry fry", price: 300, img: "images/placeholder.jpg" },
  { name: "Chicken Majestic", desc: "Hyderabadi-style creamy spicy chicken", price: 300, img: "images/placeholder.jpg" },
  { name: "Chicken 555", desc: "Crispy fried chicken special", price: 300, img: "images/placeholder.jpg" },
  { name: "Lemon Chicken", desc: "Tangy lemon-flavoured chicken", price: 300, img: "images/placeholder.jpg" },
  { name: "Cashew Chicken", desc: "Chicken with crunchy cashew nuts", price: 320, img: "images/placeholder.jpg" },
  { name: "Schezwan Chicken", desc: "Spicy Schezwan-style chicken", price: 320, img: "images/placeholder.jpg" },
  { name: "Ginger Chicken", desc: "Ginger-infused chicken stir-fry", price: 320, img: "images/placeholder.jpg" },
  { name: "Garlic Chicken", desc: "Garlicky chicken dry fry", price: 320, img: "images/placeholder.jpg" },
  { name: "Chicken Hongkong", desc: "Hong Kong-style chicken", price: 320, img: "images/placeholder.jpg" },
  { name: "Hunan Chicken", desc: "Hunan-style spicy chicken", price: 320, img: "images/placeholder.jpg" },
  { name: "Chicken 8 To 8", desc: "Special marinated chicken fry", price: 320, img: "images/placeholder.jpg" },
  { name: "Honey Chilli Chicken", desc: "Sweet & spicy honey chilli chicken", price: 320, img: "images/placeholder.jpg" },
  { name: "Dragon Chicken", desc: "Dragon-style fried chicken", price: 320, img: "images/placeholder.jpg" },
  { name: "Chicken Rampuri", desc: "Rampuri-style spicy chicken", price: 320, img: "images/placeholder.jpg" },
  { name: "Apollo Chicken", desc: "Andhra-style Apollo chicken", price: 340, img: "images/placeholder.jpg" },
  { name: "Sholay Chicken", desc: "Fiery Sholay-style chicken", price: 350, img: "images/placeholder.jpg" },
  { name: "Bangla Kodi Chips", desc: "Crispy Bangla-style chicken chips", price: 350, img: "images/placeholder.jpg" },
  { name: "Lucky's Special Chicken", desc: "Our signature house special chicken", price: 380, img: "images/placeholder.jpg" },
  { name: "Mutton 65", desc: "Spicy deep-fried mutton starter", price: 350, img: "images/placeholder.jpg" },
  { name: "Mutton Chilli", desc: "Chilli mutton dry fry", price: 350, img: "images/placeholder.jpg" },
  { name: "Pepper Mutton", desc: "Black pepper mutton fry", price: 380, img: "images/placeholder.jpg" },
  { name: "Mutton Kheema Balls", desc: "Spiced minced mutton balls", price: 430, img: "images/placeholder.jpg" },
  { name: "Chilli Fish", desc: "Spicy chilli fish fry", price: 300, img: "images/placeholder.jpg" },
  { name: "Apollo Fish", desc: "Andhra-style Apollo fish", price: 300, img: "images/placeholder.jpg" },
  { name: "Pepper Fish", desc: "Black pepper fish fry", price: 320, img: "images/placeholder.jpg" },
  { name: "Fish Fingers", desc: "Crispy fish fingers", price: 340, img: "images/placeholder.jpg" },
  { name: "Fish 65", desc: "Spicy fish 65 fry", price: 300, img: "images/placeholder.jpg" },
  { name: "Chilli Prawns", desc: "Spicy chilli prawns", price: 320, img: "images/placeholder.jpg" },
  { name: "Loose Prawns", desc: "Crispy fried loose prawns", price: 350, img: "images/placeholder.jpg" },
  { name: "Egg Chilli", desc: "Spicy egg chilli fry", price: 160, img: "images/placeholder.jpg" },
  { name: "Egg 65", desc: "Egg 65-style fry", price: 160, img: "images/placeholder.jpg" },
  { name: "Veg Manchuria", desc: "Indo-Chinese veg Manchurian", price: 200, img: "images/placeholder.jpg" },
  { name: "Chilli Mushroom", desc: "Spicy chilli mushroom", price: 220, img: "images/placeholder.jpg" },
  { name: "Mushroom 65", desc: "Mushroom 65-style fry", price: 220, img: "images/placeholder.jpg" },
  { name: "Pepper Mushroom", desc: "Black pepper mushroom", price: 240, img: "images/placeholder.jpg" },
  { name: "Chilli Babycorn", desc: "Spicy chilli babycorn", price: 220, img: "images/placeholder.jpg" },
  { name: "Pepper Babycorn", desc: "Black pepper babycorn", price: 240, img: "images/placeholder.jpg" },
  { name: "Gobi Manchuria", desc: "Cauliflower Manchurian", price: 180, img: "images/placeholder.jpg" },
  { name: "Paneer 65", desc: "Paneer 65-style fry", price: 240, img: "images/placeholder.jpg" },
  { name: "Dragon Paneer", desc: "Dragon-style fried paneer", price: 250, img: "images/placeholder.jpg" },
  { name: "Paneer Majestic", desc: "Hyderabadi-style creamy paneer", price: 260, img: "images/placeholder.jpg" },
  { name: "Paneer Butter Masala", desc: "Classic rich paneer butter masala", price: 220, img: "images/placeholder.jpg" },
  { name: "Kadai Paneer", desc: "Paneer cooked in kadai with peppers", price: 220, img: "images/placeholder.jpg" },
  { name: "Shahi Paneer", desc: "Royal creamy paneer curry", price: 250, img: "images/placeholder.jpg" },
  { name: "Paneer Tikka Masala", desc: "Tandoori paneer tikka in masala gravy", price: 250, img: "images/placeholder.jpg" },
  { name: "Palak Paneer", desc: "Paneer in creamy spinach gravy", price: 240, img: "images/placeholder.jpg" },
  { name: "Paneer Chatpat", desc: "Tangy chatpata paneer curry", price: 280, img: "images/placeholder.jpg" },
  { name: "Kaju Paneer", desc: "Rich cashew and paneer curry", price: 350, img: "images/placeholder.jpg" },
  { name: "Mushroom Masala", desc: "Mushroom in spiced masala gravy", price: 240, img: "images/placeholder.jpg" },
  { name: "Egg Masala", desc: "Boiled eggs in spicy masala gravy", price: 150, img: "images/placeholder.jpg" },
  { name: "Butter Chicken", desc: "Classic butter chicken curry", price: 240, img: "images/placeholder.jpg" },
  { name: "Kadai Chicken", desc: "Chicken cooked in kadai with peppers", price: 240, img: "images/placeholder.jpg" },
  { name: "Methi Chicken", desc: "Chicken with fenugreek leaves", price: 240, img: "images/placeholder.jpg" },
  { name: "Chicken Kolhapuri", desc: "Maharashtrian spicy chicken curry", price: 250, img: "images/placeholder.jpg" },
  { name: "Chicken Tikka Masala", desc: "Tandoori chicken tikka in masala gravy", price: 280, img: "images/placeholder.jpg" },
  { name: "Punjabi Chicken", desc: "Rich Punjabi-style chicken curry", price: 260, img: "images/placeholder.jpg" },
  { name: "Telangana Chicken", desc: "Telangana-style spicy chicken", price: 250, img: "images/placeholder.jpg" },
  { name: "Andhra Chicken", desc: "Andhra-style fiery chicken curry", price: 250, img: "images/placeholder.jpg" },
  { name: "Chicken Rara", desc: "Minced chicken in rich gravy", price: 280, img: "images/placeholder.jpg" },
  { name: "Dum Ka Chicken", desc: "Slow dum-cooked chicken curry", price: 280, img: "images/placeholder.jpg" },
  { name: "Afghani Chicken", desc: "Creamy Afghani-style chicken", price: 280, img: "images/placeholder.jpg" },
  { name: "Mutton Kheema", desc: "Spiced minced mutton curry", price: 380, img: "images/placeholder.jpg" },
  { name: "Mutton Rogan Ghosh", desc: "Kashmiri-style mutton curry", price: 380, img: "images/placeholder.jpg" },
  { name: "Rumali Roti", desc: "Thin, soft handkerchief bread", price: 15, img: "images/placeholder.jpg" },
  { name: "Tandoori Roti", desc: "Clay oven-baked whole wheat bread", price: 20, img: "images/placeholder.jpg" },
  { name: "Plain Naan", desc: "Soft leavened flatbread", price: 30, img: "images/placeholder.jpg" },
  { name: "Butter Naan", desc: "Naan topped with butter", price: 40, img: "images/placeholder.jpg" },
  { name: "Garlic Naan", desc: "Naan with garlic and butter", price: 50, img: "images/placeholder.jpg" },
  { name: "Jeera Rice", desc: "Cumin-flavoured basmati rice", price: 140, img: "images/placeholder.jpg" },
  { name: "Ghee Rice", desc: "Fragrant rice cooked with ghee", price: 160, img: "images/placeholder.jpg" },
  { name: "Curd Rice", desc: "Cooling curd rice tempered with mustard", price: 120, img: "images/placeholder.jpg" },
  { name: "Veg Fried Rice", desc: "Classic vegetable fried rice", price: 140, img: "images/placeholder.jpg" },
  { name: "Mushroom Fried Rice", desc: "Mushroom fried rice", price: 160, img: "images/placeholder.jpg" },
  { name: "Paneer Fried Rice", desc: "Paneer fried rice", price: 170, img: "images/placeholder.jpg" },
  { name: "Egg Fried Rice", desc: "Egg fried rice", price: 140, img: "images/placeholder.jpg" },
  { name: "Chicken Fried Rice", desc: "Chicken fried rice", price: 200, img: "images/placeholder.jpg" },
  { name: "Chicken Schezwan Fried Rice", desc: "Spicy Schezwan chicken fried rice", price: 220, img: "images/placeholder.jpg" },
  { name: "Prawn Fried Rice", desc: "Prawn fried rice", price: 250, img: "images/placeholder.jpg" },
  { name: "Mixed Non Veg Fried Rice", desc: "Mixed non-veg fried rice", price: 280, img: "images/placeholder.jpg" },
  { name: "Veg Soft Noodles", desc: "Soft vegetable noodles", price: 140, img: "images/placeholder.jpg" },
  { name: "Veg Schezwan Noodles", desc: "Spicy Schezwan veg noodles", price: 150, img: "images/placeholder.jpg" },
  { name: "Veg Chilli Garlic Noodles", desc: "Chilli garlic veg noodles", price: 180, img: "images/placeholder.jpg" },
  { name: "Egg Noodles", desc: "Egg noodles", price: 140, img: "images/placeholder.jpg" },
  { name: "Chicken Soft Noodles", desc: "Soft chicken noodles", price: 200, img: "images/placeholder.jpg" },
  { name: "Chicken Schezwan Noodles", desc: "Spicy Schezwan chicken noodles", price: 220, img: "images/placeholder.jpg" },
  { name: "Chicken Chilli Garlic Noodles", desc: "Chilli garlic chicken noodles", price: 250, img: "images/placeholder.jpg" },
  { name: "Mixed Non Veg Noodles", desc: "Mixed non-veg noodles", price: 280, img: "images/placeholder.jpg" },
  { name: "Hara Bara Kebab", desc: "Green vegetable kebab", price: 220, img: "images/placeholder.jpg" },
  { name: "Paneer Tikka", desc: "Tandoori paneer tikka", price: 250, img: "images/placeholder.jpg" },
  { name: "Malai Broccoli Tikka", desc: "Creamy malai broccoli tikka", price: 300, img: "images/placeholder.jpg" },
  { name: "Tandoori Chicken", desc: "Classic tandoori chicken — half / full", price: 200, img: "images/placeholder.jpg" },
  { name: "Tangdi Kebab", desc: "Chicken leg kebab — half / full", price: 200, img: "images/placeholder.jpg" },
  { name: "Chicken Tikka", desc: "Boneless tandoori chicken tikka", price: 280, img: "images/placeholder.jpg" },
  { name: "Angara Kebab", desc: "Smoked spicy chicken kebab", price: 280, img: "images/placeholder.jpg" },
  { name: "Hariyali Kebab", desc: "Green herb-marinated chicken kebab", price: 280, img: "images/placeholder.jpg" },
  { name: "Murgh Malai Kebab", desc: "Creamy chicken malai kebab", price: 320, img: "images/placeholder.jpg" },
  { name: "Mutton Sheekh Kebab", desc: "Spiced minced mutton sheekh kebab", price: 440, img: "images/placeholder.jpg" },
  { name: "Mutton Galouti Kebab", desc: "Melt-in-mouth Lucknowi mutton kebab", price: 450, img: "images/placeholder.jpg" },
  { name: "Fish Tikka", desc: "Tandoori fish tikka", price: 320, img: "images/placeholder.jpg" },
  { name: "Fish Malai Tikka", desc: "Creamy malai fish tikka", price: 340, img: "images/placeholder.jpg" },
  { name: "Tandoori Prawns", desc: "Tandoori-spiced prawns", price: 350, img: "images/placeholder.jpg" },
];

function getMenu() {
  try { return JSON.parse(localStorage.getItem(STORAGE_MENU)) || structuredClone(DEFAULT_MENU); } catch (e) { return structuredClone(DEFAULT_MENU); }
}
function saveMenu(menu) { localStorage.setItem(STORAGE_MENU, JSON.stringify(menu)); }

function getSpecial() {
  try { return JSON.parse(localStorage.getItem(STORAGE_SPECIAL)) || []; } catch (e) { return []; }
}
function saveSpecial(list) { localStorage.setItem(STORAGE_SPECIAL, JSON.stringify(list)); }

function getFestival() {
  try { return JSON.parse(localStorage.getItem(STORAGE_FESTIVAL)) || { title: "", msg: "" }; } catch (e) { return { title: "", msg: "" }; }
}
function saveFestival(f) { localStorage.setItem(STORAGE_FESTIVAL, JSON.stringify(f)); }

function getUsers() {
  try {
    const regular = JSON.parse(localStorage.getItem(STORAGE_USERS)) || [];
    const backed = JSON.parse(localStorage.getItem("luckys_backed_users")) || [];
    // Merge and deduplicate by name+whatsapp
    const seen = new Set();
    const merged = [];
    [...backed, ...regular].forEach(u => {
      const key = (u.name || "") + "|" + (u.whatsapp || "");
      if (!seen.has(key)) { seen.add(key); merged.push(u); }
    });
    return merged;
  } catch (e) { return []; }
}

function getStoredPassword() {
  return localStorage.getItem(STORAGE_PASSWORD) || DEFAULT_PASSWORD;
}
function setStoredPassword(pw) { localStorage.setItem(STORAGE_PASSWORD, pw); }

/* ═══ DOM ═══ */
const loginScreen = document.getElementById("adminLogin");
const dashScreen = document.getElementById("adminDash");
const loginForm = document.getElementById("loginForm");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const btnLogout = document.getElementById("btnLogout");
const menuList = document.getElementById("menuList");
const userList = document.getElementById("userList");
const birthdayList = document.getElementById("birthdayList");
const specialList = document.getElementById("specialList");
const specialForm = document.getElementById("specialForm");
const festivalForm = document.getElementById("festivalForm");
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

let pendingEditFileDataUrl = "";

let pendingSpecialFileDataUrl = "";

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

/* ═══ TABS ═══ */
document.querySelectorAll(".admin-tabs__btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".admin-tabs__btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".admin-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    renderAll();
  });
});

/* ═══ MENU ═══ */
function renderMenu() {
  const menu = getMenu();
  if (menu.length === 0) {
    menuList.innerHTML = '<div class="admin-empty">No items yet. Add one above.</div>';
    return;
  }
  menuList.innerHTML = menu
    .map((item, i) => `
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
    </div>`)
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
  const item = { name: editName.value.trim(), desc: editDesc.value.trim(), price: parseInt(editPrice.value) || 0, img: imgUrl };
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

/* ═══ SPECIAL ITEMS ═══ */
function renderSpecial() {
  const specials = getSpecial();
  if (specials.length === 0) {
    specialList.innerHTML = '<div class="admin-empty">No special items yet. Add one above.</div>';
    return;
  }
  specialList.innerHTML = specials
    .map((item, i) => `
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
    </div>`)
    .join("");

  specialList.querySelectorAll("[data-stoggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.stoggle);
      const specials = getSpecial();
      specials[i].active = !specials[i].active;
      saveSpecial(specials);
      renderSpecial();
    });
  });
  specialList.querySelectorAll("[data-sedit]").forEach((btn) => {
    btn.addEventListener("click", () => openSpecialEdit(parseInt(btn.dataset.sedit)));
  });
  specialList.querySelectorAll("[data-sdel]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Delete this special item?")) return;
      const specials = getSpecial();
      specials.splice(parseInt(btn.dataset.sdel), 1);
      saveSpecial(specials);
      renderSpecial();
    });
  });
}

// Add new special button
const btnAddSpecial = document.getElementById("btnAddSpecial");
if (btnAddSpecial) btnAddSpecial.addEventListener("click", () => openSpecialEdit(-1));

function openSpecialEdit(index) {
  pendingSpecialFileDataUrl = "";
  editImgPreview.style.display = "none";
  editImgPreviewImg.src = "";
  editImgFile.value = "";
  const specials = getSpecial();

  // Populate edit form fields with special item data
  if (index >= 0) {
    document.getElementById("editTitle").textContent = "Edit Special";
    editIndex.value = "special_" + index;
    editName.value = specials[index].name;
    editDesc.value = specials[index].desc;
    editPrice.value = specials[index].price;
    editImg.value = specials[index].img;
  } else {
    document.getElementById("editTitle").textContent = "Add Special Item";
    editIndex.value = "special_new";
    editName.value = "";
    editDesc.value = "";
    editPrice.value = "";
    editImg.value = "images/placeholder.jpg";
  }
  editModal.classList.add("is-open");

  // Hook file upload to special flow
  editImgFile.addEventListener("change", async function handler(e) {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    pendingSpecialFileDataUrl = dataUrl;
    editImgPreview.style.display = "block";
    editImgPreviewImg.src = dataUrl;
  }, { once: true });
}

// Override edit form submit to handle specials too
const origEditSubmit = editForm.onsubmit;
editForm.addEventListener("submit", (e) => {
  const idxVal = editIndex.value;
  if (typeof idxVal === "string" && idxVal.startsWith("special_")) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const specials = getSpecial();
    const imgUrl = pendingSpecialFileDataUrl || editImg.value.trim() || "images/placeholder.jpg";
    const item = { name: editName.value.trim(), desc: editDesc.value.trim(), price: parseInt(editPrice.value) || 0, img: imgUrl, active: true };
    if (!item.name || !item.price) return;

    if (idxVal === "special_new") {
      specials.push(item);
    } else {
      const i = parseInt(idxVal.replace("special_", ""));
      // Preserve active state
      item.active = specials[i].active;
      specials[i] = item;
    }
    saveSpecial(specials);
    editModal.classList.remove("is-open");
    editForm.reset();
    editIndex.value = "";
    renderSpecial();
  }
}, true);

/* ═══ FESTIVAL OFFERS ═══ */
function renderFestival() {
  const f = getFestival();
  document.getElementById("festivalTitle").value = f.title;
  document.getElementById("festivalMsg").value = f.msg;
}

festivalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("festivalTitle").value.trim();
  const msg = document.getElementById("festivalMsg").value.trim();
  if (!title && !msg) { alert("Please enter a title or message."); return; }

  const fullMsg = `*${title || "Festival Offer"}*\n\n${msg}\n\n— Lucky's Biriyanihouse, Eluru`;
  const whatsappMsg = encodeURIComponent(fullMsg);
  const users = getUsers();
  const withWhatsapp = users.filter(u => u.whatsapp && u.whatsapp.trim());
  
  if (withWhatsapp.length === 0) {
    alert("No customers with WhatsApp numbers found.");
    return;
  }

  // Save for reuse
  saveFestival({ title, msg });

  // Show preview
  const preview = document.getElementById("festivalPreview");
  preview.style.display = "block";
  document.getElementById("festivalCount").textContent = withWhatsapp.length;

  const recipientDiv = document.getElementById("festivalRecipients");
  recipientDiv.innerHTML = withWhatsapp.map((u, i) => {
    const clean = u.whatsapp.replace(/\D/g,'');
    return `<div style="padding:0.4rem 0;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center">
      <span>${i+1}. ${u.name || "Unknown"} — ${u.whatsapp}</span>
      <a href="https://wa.me/${clean}?text=${whatsappMsg}" target="_blank" style="color:var(--saffron);text-decoration:underline;font-size:0.75rem">Send ↗</a>
    </div>`;
  }).join("");

  // Set up copy all button
  document.getElementById("btnCopyNumbers").onclick = () => {
    const numbers = withWhatsapp.map(u => u.whatsapp.replace(/\D/g,'')).join(", ");
    navigator.clipboard.writeText(numbers).then(() => {
      alert(`Copied ${withWhatsapp.length} numbers to clipboard!\n\nPaste into WhatsApp Business → Broadcast Lists → New List → Add recipients manually.`);
    }).catch(() => {
      prompt("Copy these numbers:", numbers);
    });
  };

  // Open first one as quick start
  const first = withWhatsapp[0];
  window.open(`https://wa.me/${first.whatsapp.replace(/\D/g,'')}?text=${whatsappMsg}`, "_blank");

  alert(`Generated WhatsApp links for ${withWhatsapp.length} customers.\n\n✅ Method 1 (Best): Click "Copy All Numbers", open WhatsApp Business app → Broadcast Lists → create new list → paste numbers.\n\n✅ Method 2: Click "Send" next to each customer to open wa.me chat.\n\n✅ Method 3: Use WhatsApp Cloud API (1000 free msgs/month).`);
  renderFestival();
});

/* ═══ BIRTHDAYS ═══ */
function renderBirthdays() {
  const users = getUsers();
  const withBirthdays = users.filter(u => u.birthday);

  if (withBirthdays.length === 0) {
    birthdayList.innerHTML = '<div class="admin-empty">No customer birthdays recorded yet.</div>';
    return;
  }

  const today = new Date();
  const currentYear = today.getFullYear();

  // Sort by upcoming date (closest first, wrapping around year)
  const sorted = withBirthdays.map(u => {
    const parts = u.birthday.split("-");
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    let date = new Date(currentYear, month, day);
    if (date < today) date = new Date(currentYear + 1, month, day);
    return { ...u, _nextDate: date };
  }).sort((a, b) => a._nextDate - b._nextDate);

  birthdayList.innerHTML = sorted.map((u, i) => {
    const d = u._nextDate;
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const dateStr = days[d.getDay()] + ", " + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
    const daysUntil = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    const badge = daysUntil <= 7 ? '<span class="admin-badge">Soon!</span>' : '';

    return `
    <div class="admin-user">
      <div class="admin-user__row">
        <div class="admin-user__field"><span>Name</span><span>${u.name || "—"}</span></div>
        <div class="admin-user__field"><span>Birthday</span><span>${u.birthday} ${badge}</span></div>
        <div class="admin-user__field"><span>Upcoming</span><span>${dateStr} (${daysUntil} days)</span></div>
        <div class="admin-user__field"><span>WhatsApp</span><span>${u.whatsapp || "—"}</span></div>
      </div>
      <div class="admin-user__time">Submitted: ${u.time || "Unknown"}</div>
    </div>`;
  }).join("");
}

/* ═══ CUSTOMERS + CSV EXPORT ═══ */
function renderUsers() {
  const users = getUsers();
  const backedCount = (() => { try { return (JSON.parse(localStorage.getItem("luckys_backed_users")) || []).length; } catch(e) { return 0; } })();

  let headerInfo = "";
  if (backedCount > 0) headerInfo = `<span style="font-size:0.75rem;color:var(--cream-dim);margin-left:0.5rem">(${backedCount} backed)</span>`;

  if (users.length === 0) {
    userList.innerHTML = '<div class="admin-empty">No customers yet.</div>';
    return;
  }
  userList.innerHTML = `<p style="color:var(--cream-dim);font-size:0.78rem;margin-bottom:1rem">Total customers: ${users.length} ${headerInfo}</p>` + users
    .map((u, i) => {
      const isBacked = u.savedAt ? '<span class="admin-badge" style="background:var(--saffron);margin-left:0.4rem">Backed</span>' : '';
      return `
    <div class="admin-user">
      <div class="admin-user__row">
        <div class="admin-user__field"><span>Name</span><span>${u.name || "—"}${isBacked}</span></div>
        <div class="admin-user__field"><span>WhatsApp</span><span>${u.whatsapp || "—"}</span></div>
        <div class="admin-user__field"><span>Birthday</span><span>${u.birthday || "—"}</span></div>
      </div>
      <div class="admin-user__time">${u.savedAt ? 'Backed: ' + u.savedAt : 'Submitted: ' + (u.time || "Unknown")}</div>
    </div>`;
    })
    .join("");
}

document.getElementById("btnExportCSV").addEventListener("click", () => {
  const users = getUsers();
  if (users.length === 0) { alert("No customers to export."); return; }

  let csv = "Name,WhatsApp,Birthday,Submitted\n";
  users.forEach(u => {
    csv += `"${(u.name || "").replace(/"/g, '""')}","${(u.whatsapp || "").replace(/"/g, '""')}","${u.birthday || ""}","${(u.time || "").replace(/"/g, '""')}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "luckys_customers_" + new Date().toISOString().slice(0,10) + ".csv";
  a.click();
  URL.revokeObjectURL(url);
});

/* ═══ PASSWORD ═══ */
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

/* ═══ RENDER ALL ═══ */
function renderAll() {
  renderMenu();
  renderSpecial();
  renderFestival();
  renderBirthdays();
  renderUsers();
}
