/* ════════════════════ config.js ════════════════════
   Fill these to switch from localStorage to Firebase.
   Leave ALL values empty to keep using localStorage (zero setup needed).

   Get yours from: https://console.firebase.google.com/
   ── Firestore Database → Create database (start in test mode)
   ── Project settings → Your apps → Web app → copy the config object below

   When you switch to Firebase:
    - customers, orders, menu items, & specials sync across ALL devices
    - replacing the 3 lines below is the ONLY change anywhere

   FIREBASE_CONFIG = {                                        //
      apiKey:          "",                                    //  ← paste yours
      authDomain:      "",                                    //  ← paste yours
      projectId:       "",                                    //  ← paste yours
      storageBucket:   "",                                    //  ← paste yours
      messagingSenderId:"",                                   //  ← paste yours
      appId:           "",                                    //  ← paste yours
   };                                                         //
   ═══════════════════════════════════════════════════════════ */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCCNC4Vrt4oj3TPYVoXgNcZveqxV7ruug8",
  authDomain: "lucky-s-biriyani.firebaseapp.com",
  projectId: "lucky-s-biriyani",
  storageBucket: "lucky-s-biriyani.firebasestorage.app",
  messagingSenderId: "876383464430",
  appId: "1:876383464430:web:0dc3110c5291454140fcff",
  measurementId: "G-SSZ0Q1MRN8"
};

/* ════════════════════ SITE_CONFIG ════════════════════
   One place for the business details shown across the site
   (cart checkout → WhatsApp, footer links, reserve section).
   Update the values here and they reflect everywhere.
   NOTE: the map embed/links in index.html are left as-is. */
const SITE_CONFIG = {
  name: "Lucky's Biriyanihouse",
  // WhatsApp order number — digits only, with country code (no +).
  whatsapp: "914000000000",
  // Phone shown in the Reserve section + tel: link.
  phoneDisplay: "+91 40 0000 0000",
  phoneDial: "+914000000000",
  email: "hello@luckysbiriyanihouse.in",
  hours: { open: "9:00 AM", close: "10:00 PM", closedDays: [] },
  address: "Main Road, Eluru, West Godavari, Andhra Pradesh 534001",
  // Social/order links — empty strings render no link.
  social: {
    instagram: "",
    zomato: "",
    swiggy: "",
    facebook: "",
  },
  // Left undefined on purpose so index.html's own map links/iframe stay intact.
  mapLink: undefined,
  mapEmbed: undefined,
};

/* Make available to every page (const doesn't attach to window on its own). */
window.FIREBASE_CONFIG = FIREBASE_CONFIG;
window.SITE_CONFIG = SITE_CONFIG;

