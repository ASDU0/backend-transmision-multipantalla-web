# Backend Transmisión Multipantalla

Servidor de señalización con Express + Socket.IO para coordinar conexiones WebRTC por categoría.

## Ejecutar en local
- Requisitos: Node 18+
- Variables (opcional): `FRONTEND_URL=http://localhost:3000`

Pasos:
1. Instalar dependencias: `npm install`
2. Iniciar: `npm start`
3. Probar: GET `http://localhost:4000/`

## Eventos Socket.IO
- `join-category` (string categoryId)
- `sending-signal` ({ category?, targetId?, callerID, signal })
- `returning-signal` ({ callerID, signal })
- `ice-candidate` ({ targetId, candidate })
- `viewer-ready` ({ category })

## Despliegue (Render)
- Start command: `node index.js`
- Var de entorno: `FRONTEND_URL` con la URL del frontend (p.ej. Vercel)