// api/buscar-dni.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { dni } = req.body;

  if (!dni) {
    return res.status(400).json({ error: "DNI requerido" });
  }

  const API_TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpcCI6IjEzMi4xODQuNTUuMTIzIiwicGxhdGZvcm0iOiJBUEkiLCJ1c3VhcmlvIjp7Il9pZCI6IjY4OGUzNmNjMjIzYmJmOTI0OTcwMDAwNSIsIm5hbWUiOiJyb2RyaWdvIiwicmFuZ28iOiJ1c2VyIiwic3BhbSI6MzAsImNfZXhwaXJ5IjoxNzU2NzQzMDE3fSwiaWF0IjoxNzU0MTY1NTAxLCJleHAiOjE3NTY2NzExMDF9.4Hm0rEYtfukAsYWVQqIUpGib3VwNCNda8fdyikqvP4U8RitVF-RU9-II2qWZLcScxMVJyP-9CgSA7vs7sWzJXw";

  try {
    const response = await fetch(`https://lookfriends.xyz/api/dni/${dni}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Error al obtener los datos del servidor" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error al procesar la solicitud" });
  }
}
