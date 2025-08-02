export default async function handler(req, res) {
  const API_TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpcCI6IjEzMi4xODQuNTUuMTIzIiwicGxhdGZvcm0iOiJBUEkiLCJ1c3VhcmlvIjp7Il9pZCI6IjY4OGUzNmNjMjIzYmJmOTI0OTcwMDAwNSIsIm5hbWUiOiJyb2RyaWdvIiwicmFuZ28iOiJ1c2VyIiwic3BhbSI6MzAsImNfZXhwaXJ5IjoxNzU2NzQzMDE3fSwiaWF0IjoxNzU0MTY1NTAxLCJleHAiOjE3NTY2NzExMDF9.4Hm0rEYtfukAsYWVQqIUpGib3VwNCNda8fdyikqvP4U8RitVF-RU9-II2qWZLcScxMVJyP-9CgSA7vs7sWzJXw";

  if (req.method === "GET") {
    // Página HTML directamente servida
    res.setHeader("Content-Type", "text/html");
    return res.end(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Buscar por DNI</title>
        <style>
          body { font-family: sans-serif; margin: 2em; }
          input, button { font-size: 16px; padding: 8px; }
          pre { background: #f0f0f0; padding: 10px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h1>Consulta por DNI</h1>
        <input id="dni" placeholder="Ingrese DNI" />
        <button onclick="consultar()">Buscar</button>
        <pre id="resultado"></pre>

        <script>
          async function consultar() {
            const dni = document.getElementById("dni").value.trim();
            const resultado = document.getElementById("resultado");

            if (!dni) {
              resultado.textContent = "⚠️ Ingrese un DNI válido.";
              return;
            }

            resultado.textContent = "⏳ Buscando...";

            try {
              const res = await fetch(window.location.href, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dni })
              });

              const data = await res.json();
              resultado.textContent = JSON.stringify(data, null, 2);
            } catch {
              resultado.textContent = "❌ Error en la consulta.";
            }
          }
        </script>
      </body>
      </html>
    `);
  }

  if (req.method === "POST") {
    try {
      const { dni } = req.body;

      if (!dni) {
        return res.status(400).json({ error: "DNI requerido" });
      }

      const response = await fetch(`https://lookfriends.xyz/api/dni/${dni}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });

      if (!response.ok) throw new Error("Error al consultar");

      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Error al procesar la solicitud" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
