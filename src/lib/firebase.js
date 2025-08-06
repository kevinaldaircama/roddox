import admin from 'firebase-admin';

function initFromEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) return false;

  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    databaseURL: 'https://roddox-27e1b-default-rtdb.firebaseio.com',
    storageBucket: 'roddox-27e1b.firebasestorage.app'
  });
  return true;
}

if (admin.apps.length === 0) {
  const ok = initFromEnv();
  if (!ok) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: 'https://roddox-27e1b-default-rtdb.firebaseio.com',
      storageBucket: 'roddox-27e1b.firebasestorage.app'
    });
  }
}

export const db = admin.firestore();
export const rtdb = admin.database();
