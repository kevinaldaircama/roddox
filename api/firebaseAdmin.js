import admin from "firebase-admin";

// En Vercel guardaremos las credenciales como variables de entorno.
// PRIVATE_KEY suele necesitar reemplazar \n por saltos reales.
const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_DATABASE_URL
} = process.env;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
    }),
    databaseURL: FIREBASE_DATABASE_URL
  });
}

export const db = admin.firestore();
export const rtdb = admin.database();
export const auth = admin.auth();
