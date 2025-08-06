import { getFirestore, jsonResponse, textResponse } from "./firestore.js";

/** Obtiene el recurso después de /.netlify/functions/api */
function getResourceFromUrl(rawUrl) {
  const url = new URL(rawUrl);
  // path p.ej.: /.netlify/functions/api/telefonos
  const cleaned = url.pathname.replace(/\/\.netlify\/functions\/api\/?/, "");
  // si queda "" => raíz
  return cleaned.replace(/^\/+/, "");
}

/** Manejador principal */
export async function handler(event) {
  // Preflight CORS
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(200, { ok: true });
  }

  try {
    const method = event.httpMethod || "GET";
    if (method !== "GET") {
      return jsonResponse(405, { error: "Method Not Allowed" });
    }

    const db = getFirestore();
    const resource = getResourceFromUrl(event.rawUrl || "");
    const params = event.queryStringParameters || {};
    const limit = Math.min(parseInt(params.limit || "20", 10), 50);

    // Índice
    if (resource === "") {
      return jsonResponse(200, {
        endpoints: {
          "/api/telefonos?numero=...": "Consulta por número telefónico",
          "/api/sis?dni=...": "Consulta SIS por DNI",
          "/api/descargas?dni=...": "Descargas por DNI",
          "/api/busqueda?q=...": "Historial/búsquedas por término (también /api/búsqueda)",
          "/api/personas?dni=...": "Personas por DNI",
          "/api/info?dni=...": "Info por DNI"
        },
        tip: "Usa ?limit=10 para limitar resultados (máx 50)."
      });
    }

    switch (resource) {
      case "telefonos": {
        const numero = params.numero;
        if (!numero) return jsonResponse(400, { error: "Falta ?numero=" });
        const snap = await db.collection("telefonos")
          .where("Numero Telefónico", "==", numero)
          .limit(limit)
          .get();
        return jsonResponse(200, {
          count: snap.size,
          items: snap.docs.map(d => ({ id: d.id, ...d.data() }))
        });
      }

      case "sis": {
        const dni = params.dni;
        if (!dni) return jsonResponse(400, { error: "Falta ?dni=" });
        const snap = await db.collection("sis")
          .where("Número de Documento", "==", dni)
          .limit(limit)
          .get();
        return jsonResponse(200, {
          count: snap.size,
          items: snap.docs.map(d => ({ id: d.id, ...d.data() }))
        });
      }

      case "descargas": {
        const dni = params.dni;
        if (!dni) return jsonResponse(400, { error: "Falta ?dni=" });
        const snap = await db.collection("descargas")
          .where("dni", "==", dni)
          .limit(limit)
          .get();
        return jsonResponse(200, {
          count: snap.size,
          items: snap.docs.map(d => ({ id: d.id, ...d.data() }))
        });
      }

      case "busqueda":
      case "búsqueda": {
        const q = params.q;
        if (!q) return jsonResponse(400, { error: "Falta ?q=" });
        // Ajusta "termino" al campo real que guardas en tu colección
        const collectionName = "búsqueda";
        const snap = await db.collection(collectionName)
          .where("termino", "==", q)
          .limit(limit)
          .get();
        return jsonResponse(200, {
          count: snap.size,
          items: snap.docs.map(d => ({ id: d.id, ...d.data() }))
        });
      }

      case "personas": {
        const dni = params.dni;
        if (!dni) return jsonResponse(400, { error: "Falta ?dni=" });
        const snap = await db.collection("personas")
          .where("dni", "==", dni)
          .limit(limit)
          .get();
        return jsonResponse(200, {
          count: snap.size,
          items: snap.docs.map(d => ({ id: d.id, ...d.data() }))
        });
      }

      case "info": {
        const dni = params.dni;
        if (!dni) return jsonResponse(400, { error: "Falta ?dni=" });
        const snap = await db.collection("info")
          .where("dni", "==", dni)
          .limit(limit)
          .get();
        return jsonResponse(200, {
          count: snap.size,
          items: snap.docs.map(d => ({ id: d.id, ...d.data() }))
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
