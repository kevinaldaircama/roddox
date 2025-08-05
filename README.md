# Firebase API (Vercel)

## Endpoints
- GET /api/health
- POST /api/movimientos (requiere Authorization: Bearer <ID_TOKEN>)
- POST /api/descontar-creditos (requiere Authorization: Bearer <ID_TOKEN>)

## Autenticación
Usa Firebase Auth en el cliente para obtener el ID token:
`const token = await currentUser.getIdToken();`
Luego envíalo en el header:
`Authorization: Bearer ${token}`

## Variables de entorno (configúralas en Vercel)
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY (copiar tal cual, las nuevas líneas como \n)
- FIREBASE_DATABASE_URL (ej: https://roddox-27e1b-default-rtdb.firebaseio.com)
