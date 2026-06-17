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
const FIREBASE_CONFIG = {};
