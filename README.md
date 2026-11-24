# MobiQuiz

Concurso multijugador para una TV o proyector y móviles, inspirado en los concursos de pulsadores.

## Ejecutar
Requiere Node.js 22 o superior.

```sh
npm install
npm test
npm run check
npm start
```

Abre http://localhost:3000. Para jugar desde móviles en la misma Wi-Fi, abre la IP local del ordenador con el puerto 3000 y permite el acceso en el cortafuegos. El presentador crea una sala, abre la vista TV y comparte el enlace o código. Para televisión se puede usar un navegador de TV, HDMI o transmitir la pestaña de Chrome desde el sistema; no incorpora una integración Cast nativa.

## Google
Crea un cliente OAuth de tipo aplicación web en Google Cloud, añade los orígenes JavaScript autorizados (localhost para desarrollo y el dominio HTTPS de producción) y configura `GOOGLE_CLIENT_ID` en el entorno del servidor. No hace falta colocar un secreto OAuth en el frontend. Se verifica el token de identidad en el servidor. Sin esta configuración se puede jugar como invitado. Los perfiles de invitado y de Google son independientes.

## Persistencia
Las respuestas (incluidas las no contestadas), resultados, perfiles y sesiones se guardan en `data/store.json`. Configura `DATA_FILE` con una ubicación persistente y privada en producción. Esta versión usa una instancia Node única, memoria para salas activas y almacenamiento JSON local: las estadísticas se conservan al reiniciar, las salas activas no. Para una publicación a escala, sustituir por una base de datos transaccional y almacenamiento de estado compartido, añadir límites de petición y políticas de privacidad/retención. Usar HTTPS en producción.

## Pruebas
Opción múltiple, velocidad, verdadero/falso, estimación numérica, ordenar y texto libre. Cualquiera puede acompañarse de imagen, vídeo o audio mediante una URL HTTPS o una ruta local. Las respuestas correctas se mantienen en el servidor hasta revelar. Hay ocho preguntas de demostración, una de ellas usa un vídeo externo de MDN.

El presentador puede cargar un array JSON al crear la sala. Ejemplo:
```json
[{"category":"Geografía","mode":"choice","prompt":"¿Cuál es la capital de Portugal?","options":["Oporto","Lisboa","Braga","Faro"],"correct":1,"seconds":20,"difficulty":"Fácil"}]
```
Los índices comienzan en 0. Para ordenar, correct es un array de índices. Para número, correct es un número y tolerance es opcional. Para verdadero/falso, correct es booleano. Para texto, correct es una cadena. La puntuación combina acierto y velocidad; la prueba rápida aumenta el peso de la velocidad. El porcentaje incluye las preguntas no respondidas y el tiempo medio excluye las no respondidas. Los empates cuentan como victoria compartida.

## Siguientes pasos
Editor visual de preguntas, QR, Cast nativo opcional, reconexión de sala tras reinicio, banco de contenidos, ligas, logros y rankings sociales.
