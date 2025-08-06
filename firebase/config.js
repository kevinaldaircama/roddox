// public/firebase/config.js
(async function initFirebase() {
  if (typeof window === 'undefined' || !window.firebase) {
    console.error('Firebase SDK no cargado. Incluye los <script> de Firebase en el HTML.');
    return;
  }
  try {
    const res = await fetch('/firebase-config', { credentials: 'same-origin' });
    if (!res.ok) throw new Error('No se pudo obtener la configuración de Firebase');
    const config = await res.json();

    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }
    window.firebaseApp = firebase.app();
    window.firebaseAuth = firebase.auth();
    window.firebaseReadyResolve && window.firebaseReadyResolve();
  } catch (err) {
    console.error('Error inicializando Firebase:', err);
    window.firebaseReadyReject && window.firebaseReadyReject(err);
  }
})();

window.firebaseReady = new Promise((resolve, reject) => {
  window.firebaseReadyResolve = resolve;
  window.firebaseReadyReject = reject;
});
