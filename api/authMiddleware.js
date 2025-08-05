import { auth } from "./firebaseAdmin.js";

// Espera Authorization: Bearer <ID_TOKEN>
export async function verifyFirebaseToken(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Falta token" });
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded; // uid disponible en req.user.uid
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token inválido", details: e.message });
  }
}
