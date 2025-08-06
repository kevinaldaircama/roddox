# Firebase Firestore API on Netlify Functions (Node 18+)

API sin secretos en el repositorio. Configura variables en Netlify:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (una sola línea con `\n`)

## Estructura
```
/
├─ netlify.toml
├─ package.json
├─ .gitignore
└─ netlify/
   └─ functions/
      ├─ api.js
      └─ firestore.js
```

## Deploy
1. Crea un repo en GitHub y sube estos archivos.
2. En Netlify → **Add new site** → **Import from Git**.
3. En **Site settings → Environment variables** agrega las tres variables.
4. Deploy → si cambiaste de runtime, usa **Clear cache and deploy site**.
5. Prueba: `https://TU-SITIO.netlify.app/api/`
