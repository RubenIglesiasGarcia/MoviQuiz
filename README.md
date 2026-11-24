# MobiQuiz — Cloudflare Workers
PWA multijugador con móvil, TV opcional y modo individual. El backend de producción usa Durable Objects SQLite (estado y alarmas de sala, WebSocket hibernable), D1 (usuarios, sesiones y estadísticas) y Google Identity Services (verificación JWT RS256 en el Worker). El antiguo server.js se conserva como referencia, no como backend de producción.

## Configurar y desplegar
Node 22 o superior. `npm install`, `npm run check`, `npm test`.
Para desarrollo local: `npm run db:local`, `npm start` (puerto 8787). Para producción, ejecutar `npm run db:remote` y `npm run deploy` con autorización de Cloudflare, o conectar GitHub en Workers Builds. Configurar build command `npm install`, deploy command `npx wrangler d1 migrations apply DB --remote && npx wrangler deploy` (el token de build debe permitir D1 y Workers; si no, aplicar migración desde D1 SQL Console o CLI autorizado). La base D1 ya está referenciada en wrangler.jsonc. Usar plan gratuito y clase SQLite. No se necesita Pages ni un servidor Node permanente.

En Worker > Settings > Variables and Secrets añade GOOGLE_CLIENT_ID (texto, ID público de cliente OAuth). En Google añade el origen HTTPS exacto y http://localhost:8787 para desarrollo, sin ruta. El modo invitado funciona sin Google. El logo oficial puede colocarse como archivos public/icons/{180,192,512}.png; el icono generado anterior sirve de respaldo.

La política de privacidad y términos son borradores para revisar antes de publicación pública; añadir identidad y correo de contacto del responsable, revisar retención y dominio autorizado. Las salas expiran en 24 horas sin actividad; el perfil se puede eliminar desde estadísticas. Las estadísticas consultan las últimas 10.000 respuestas y 2.000 partidas. Las partidas necesitan Internet. Se conservan las seis modalidades de pregunta y las ocho preguntas de ejemplo. Revisar límites, abuso y pruebas entre dispositivos antes de lanzamiento general.
