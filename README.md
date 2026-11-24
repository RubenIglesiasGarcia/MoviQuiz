# MobiQuiz — Cloudflare Workers
PWA multijugador con móvil, TV opcional y modo individual. El backend de producción usa Durable Objects SQLite (estado y alarmas de sala, WebSocket hibernable), D1 (usuarios, sesiones y estadísticas) y Google Identity Services (verificación JWT RS256 en el Worker). El antiguo server.js se conserva como referencia, no como backend de producción.

## Configurar y desplegar
Node 22 o superior. `npm install`, `npm run check`, `npm test`.
Para desarrollo local: `npm run db:local`, `npm start` (puerto 8787). Para producción, ejecutar `npm run db:remote` y `npm run deploy` con autorización de Cloudflare, o conectar GitHub en Workers Builds. Configurar build command `npm install`, deploy command `npx wrangler d1 migrations apply DB --remote && npx wrangler deploy` (el token de build debe permitir D1 y Workers; si no, aplicar migración desde D1 SQL Console o CLI autorizado). La base D1 ya está referenciada en wrangler.jsonc. Usar plan gratuito y clase SQLite. No se necesita Pages ni un servidor Node permanente.

En Worker > Settings > Variables and Secrets añade GOOGLE_CLIENT_ID (texto, ID público de cliente OAuth). En Google añade el origen HTTPS exacto y http://localhost:8787 para desarrollo, sin ruta. El modo invitado funciona sin Google. El logo oficial puede colocarse como archivos public/icons/{180,192,512}.png; el icono generado anterior sirve de respaldo.

La política de privacidad y términos son borradores para revisar antes de publicación pública; añadir identidad y correo de contacto del responsable, revisar retención y dominio autorizado. Las salas expiran en 24 horas sin actividad; el perfil se puede eliminar desde estadísticas. Las estadísticas consultan las últimas 10.000 respuestas y 2.000 partidas. Las partidas necesitan Internet. Se conservan las seis modalidades de pregunta y las ocho preguntas de ejemplo. Revisar límites, abuso y pruebas entre dispositivos antes de lanzamiento general.

## Interfaz
Componentes visuales propios con Lit (escenario, pulsadores y contador segmentado), controles HTML nativos y fuentes Barlow Condensed/Space Grotesk autoalojadas con Fontsource. esbuild compila public/generated mediante npm install y antes de wrangler deploy; no hay que cambiar el comando de despliegue. No se utiliza un tema de dashboard ni CDN de componentes. Revisar en móvil y televisión después del despliegue.

## Vestuario y pantalla TV
Perfil persistente en D1, foto opcional redimensionada en el navegador y accesorios originales. La foto se muestra mediante URL aleatoria a quienes acceden a la sala; puede retirarse. Para Cast nativo registrar un Custom Web Receiver en https://cast.google.com/publish/ con URL HTTPS /cast-receiver.html, añadir CAST_APP_ID en Variables and Secrets y probar en un Chromecast registrado. Google cobra registro de desarrollador; no es obligatorio para abrir la vista TV por URL. Cast web no está soportado en Chrome iOS. El receptor aún requiere pruebas físicas.
