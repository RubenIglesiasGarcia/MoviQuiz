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

El logo aprobado se sirve en /icons/mobiquiz-v2.webp; la compilación genera los PNG de instalación en 180, 192 y 512 px. La versión de partida del logo está optimizada para tamaño pequeño.

## Personajes y progresión
Avatares 3D originales de geometría ligera con Three.js en vestuario, perfil, reacción personal y podio; marcador con fallback 2D. Los modelos se pueden girar arrastrando. XP y seis logros con accesorios verificados en servidor; solo partidas oficiales creadas sin JSON personalizado suman progresión, los resultados anteriores sin marca de oficial no se cuentan como XP. Sonidos originales sintetizados mediante Web Audio y botón de silencio; algunos navegadores requieren interacción previa. Los dispositivos sin WebGL usan el avatar 2D.

### Plató 3D
La vista TV muestra una escena Three.js con hasta ocho concursantes (el marcador conserva todos), atriles, pulsadores, luces y cámara animada. Usa geometría ligera y fallback sin WebGL. El vestuario permite captura frontal con guía ovalada y confirmación antes de subir la foto. Probar cámara, TV y Chromecast reales tras desplegar.

### Gran concurso
Modo fiesta inicial: calentamiento, pulsador con turno y rebote, subasta de hasta 500 puntos del juego y final doble. Preguntas privadas opcionales solo en lobby, máximo dos por usuario, aprobadas por anfitrión, excluyendo al autor y anfitrión de responderlas. Si se incluyen, la partida no suma XP oficial. No hay publicación comunitaria ni moderación automática; el anfitrión debe revisar veracidad y contenido. Pendiente ampliar el banco y probar sincronización real.

El Gran concurso incorpora además Farsante (inventar respuestas y votar, sin revelar autores antes de tiempo), Patata caliente (turno con tiempo reducido y pase a otro concursante) y Tartazo (acertar para elegir un objetivo, penalización limitada). Son puntos ficticios del concurso; no hay dinero. Las respuestas de farsante solo se muestran en la sala y no cuentan como preguntas oficiales de XP. No existe todavía un filtro automático de texto. Las rondas sociales se omiten si solo juega una persona.

El plató incorpora un presentador animado, mensajes contextuales y voz opcional por síntesis del navegador (requiere soporte y activación local). Se muestran la patata caliente sobre el atril activo y una tarta 3D sobre quien recibe un tartazo. El modo TV conserva subtítulos aunque no haya síntesis de voz.

UX: QR local de entrada, propuestas de preguntas desde lobby sin JSON, vestuario solo accesible antes de empezar, regreso a la sala desde navegación, resultados con reparto animado y cambio de orden. El servidor retiene la revelación 5.5 segundos y congela el avatar de sala al comenzar. Google requiere configurar GOOGLE_CLIENT_ID y origen autorizado en la consola de Google.

Resultados: siete segundos de presentación, puntos animados y posiciones anteriores guardadas por servidor, subida/bajada con desplazamiento de atriles en TV y repertorio de gestos por ronda y jugador. Ordenación táctil/ratón con botones de teclado alternativos. Audio y vídeo intentan reproducirse al entrar en la pregunta, respetando el botón Sonido y las políticas del navegador; si se bloquean aparece un botón de reproducción. No se reinicia automáticamente el medio en la revelación.

Modos: clásico con dificultad estricta (12 preguntas), gran concurso con pruebas sociales, arcade con nueve rondas de memoria, observación y reflejos. El banco local se amplía con 46 preguntas; las partidas de arcade no cuentan para XP de cultura general. Revancha con código y jugadores conservados; selección de ambiente y personalidad en lobby; gala final de premios. Temas de plató iniciales son variaciones cromáticas, no mapas 3D completos.

También se puede seleccionar modo y dificultad en individual, con lobby previo para el vestuario. Espacial, tropical y retro incorporan decoración 3D procedural propia. La señal de reflejos no publica su instante de inicio antes de activarse.

Arcade amplía a 13 rondas individuales con conteo visual y escalera numérica. En salas con dos o más jugadores, arcade y gran concurso incorporan dos dibujos en directo: palabra privada para el dibujante, trazos sincronizados en TV y móviles, intentos limitados y puntos compartidos. Las rondas de dibujo no son oficiales para XP de conocimientos. No existe moderación automática de dibujos; jugar con personas de confianza.
