import { getFirestore, jsonResponse } from "./firestore.js";

export async function handler(event) {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(200, { ok: true });
  }
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method Not Allowed" });
  }

  try {
    const db = getFirestore();

    // Ruta: /api/<recurso>
    const path = event.path || "";
    // En Netlify, cuando usas redirect /api/* => /.netlify/functions/api
    // event.path puede llegar como "/.netlify/functions/api" con querys.
    // Usaremos el param "resource" si viene, si no, tratamos de leer de query.
    const resource = (new URL(event.rawUrl)).pathname
      .replace(/\/.netlify\/functions\/api\/?/, "")
      .replace(/^\/+/, ""); // queda "", "telefonos", "sis", etc.

    const params = event.queryStringParameters || {};
    const limit = Math.min(parseInt(params.limit || "20", 10), 50);

    switch (resource) {
      case "telefonos": {
        const numero = params.numero;
        if (!numero) return jsonResponse(400, { error: "Falta ?numero=" });
        const snap = await db.collection("telefonos")
          .where("Numero Telefónico", "==", numero).limit(limit).get();
        return jsonResponse(200, { count: snap.size, items: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
      }
      case "sis": {
        const dni = params.dni;
        if (!dni) return jsonResponse(400, { error: "Falta ?dni=" });
        const snap = await db.collection("sis")
          .where("Número de Documento", "==", dni).limit(limit).get();
        return jsonResponse(200, { count: snap.size, items: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
      }
      case "descargas": {
        const dni = params.dni;
        if (!dni) return jsonResponse(400, { error: "Falta ?dni=" });
        const snap = await db.collection("descargas")
          .where("dni", "==", dni).limit(limit).get();
        return jsonResponse(200, { count: snap.size, items: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
      }
      case "busqueda":
      case "búsqueda": { // soporta ambas
        const q = params.q;
        if (!q) return jsonResponse(400, { error: "Falta ?q=" });
        // Ejemplo: buscar por texto exacto en campo "termino" (ajusta a tu esquema)
        const snap = await db.collection("búsqueda")
          .where("termino", "==", q).limit(limit).get();
        return jsonResponse(200, { count: snap.size, items: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
      }
      case "personas": {
        const dni = params.dni;
        if (!dni) return jsonResponse(400, { error: "Falta ?dni=" });
        const snap = await db.collection("personas")
          .where("dni", "==", dni).limit(limit).get();
        return jsonResponse(200, { count: snap.size, items: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
      }
      case "info": {
        const dni = params.dni;
        if (!dni) return jsonResponse(400, { error: "Falta ?dni=" });
        const snap = await db.collection("info")
          .where("dni", "==", dni).limit(limit).get();
        return jsonResponse(200, { count: snap.size, items: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
      }
      case "": {
        // índice de la API
        return jsonResponse(200, {
          endpoints: {
            "/api/telefonos?numero=...": "Consulta por número telefónico",
            "/api/sis?dni=...": "Consulta SIS por DNI",
            "/api/descargas?dni=...": "Descargas por DNI",
            "/api/busqueda?q=...": "Historial/búsquedas por término",
            "/api/personas?dni=...": "Personas por DNI",
            "/api/info?dni=...": "Info por DNI"
          },
          tip: "Usa ?limit=10 para limitar resultados (máx 50)."
        });
      }
      default:
        return jsonResponse(404, { error: "Recurso no encontrado", recurso: resource });
    }
  } catch (err) {
    console.error(err);
    return jsonResponse(500, { error: "Error interno", detail: String(err?.message || err) });
  }
}

export { handler as default };
