export default async function handler(req, res) {
  const API_TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpcCI6IjMuMjM5LjExNy4xMDQiLCJwbGF0Zm9ybSI6IkFQSSIsInVzdWFyaW8iOnsiX2lkIjoiNjg4ZTM2Y2MyMjNiYmY5MjQ5NzAwMDA1IiwibmFtZSI6InJvZHJpZ28iLCJyYW5nbyI6InVzZXIiLCJzcGFtIjozMCwiY19leHBpcnkiOjE3NTY3NDMwMTd9LCJpYXQiOjE3NTQxOTA1MDAsImV4cCI6MTc1NjY5NjEwMH0.Tv2rou_hl1i2fzWsgdyxLIV07ijQ9ldvkuOMnJCGyVSbISG8F5u-vyT60vAyn-u9--pTcldj2A6rgUegEch0mw";

  if (req.method === "GET") {
    res.setHeader("Content-Type", "text/html");
    return res.end(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Consulta por DNI</title>
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

      const response = await fetch("https://lookfriends.xyz/api/sbs", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni })
      });

      const result = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ error: result?.message || "Error externo" });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ Error al consultar:", error);
      return res.status(500).json({ error: "Error al procesar la solicitud" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
