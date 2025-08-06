import admin from "firebase-admin";

let app;
export function getFirestore() {
  if (!app) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Importante: las claves con \n vienen escapadas en env; las restauramos:
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Faltan variables de entorno de Firebase Admin.");
    }

    app = admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      // Para Firestore, no necesitas databaseURL; pero si usas RTDB, puedes agregarlo.
      // databaseURL: "https://roddox-27e1b-default-rtdb.firebaseio.com"
    });
  }
  return admin.firestore();
}

// Pequeño helper de respuestas
export function jsonResponse(status, data, extraHeaders = {}) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      ...extraHeaders
    },
    body: JSON.stringify(data)
  };
}
