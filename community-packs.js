// Curated public catalog, independent of D1 migrations and user accounts.
// Verified November 26, 2026: Know Your Meme (November poll, Jupiter Incident 2011,
// Huss Huss Huss, Lucia Will Appreciate This, My Moon My Man, Gucci Morty,
// I Got So Mad, 2016 Trend, Great Meme Reset, August poll and Pattinson casting parodies).
// Spanish-language trends: https://www.que.es/2026/11/17/tendencias-tiktok-noviembre-sonidos-virales/
const questions=[
  {
    "id": "meme-2026-0",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Muy fácil",
    "prompt": "¿Qué videojuego originó el meme «Lucia Will Appreciate This»?",
    "options": [
      "GTA VI",
      "Minecraft",
      "Fortnite",
      "EA Sports FC"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "El aviso de GTA VI se convirtió en una plantilla para bromas en noviembre.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-1",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Muy fácil",
    "prompt": "¿Qué red social fue protagonista de la difusión de «I Got So Mad»?",
    "options": [
      "TikTok",
      "LinkedIn",
      "Wikipedia",
      "GitHub"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "Se popularizó en vídeos cortos de TikTok en noviembre.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-2",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Muy fácil",
    "prompt": "¿A qué año mira con nostalgia la tendencia «2026 is the new…»?",
    "options": [
      "2016",
      "2006",
      "1996",
      "2020"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "La tendencia recupera la estética y los recuerdos de 2016.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-3",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Muy fácil",
    "prompt": "¿Qué personaje aparece vestido de lujo en el meme «Gucci Morty»?",
    "options": [
      "Morty",
      "Bart Simpson",
      "Bob Esponja",
      "Finn"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "El montaje presenta al personaje de Rick y Morty con un estilo de lujo.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-4",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Fácil",
    "prompt": "¿Qué planeta aparece en el título del falso incidente espacial viral de noviembre de 2026?",
    "options": [
      "Júpiter",
      "Marte",
      "Venus",
      "Saturno"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "Jupiter Incident 2011 inventa una aventura espacial absurda.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-5",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Fácil",
    "prompt": "¿Qué actor aparece en los montajes que lo fichan para prácticamente cualquier papel?",
    "options": [
      "Robert Pattinson",
      "Tom Holland",
      "Ryan Reynolds",
      "Pedro Pascal"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "Las bromas imitan anuncios de casting y exageran la cantidad de papeles del actor.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-6",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Fácil",
    "prompt": "¿Qué suelen mostrar las publicaciones de «My Moon My Man»?",
    "options": [
      "Fotos de una pareja",
      "Resultados de fútbol",
      "Recetas de cocina",
      "Trucos de Excel"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "La tendencia conecta dos imágenes en un carrusel romántico.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-7",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Fácil",
    "prompt": "¿Qué juego sirvió de escenario al vídeo viral «Huss Huss Huss» de noviembre?",
    "options": [
      "Roblox",
      "The Sims 4",
      "Rocket League",
      "Fall Guys"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "El clip que impulsó la tendencia se hizo en Roblox.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-8",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Media",
    "prompt": "¿Qué tipo de reacción exagera el meme «I Got So Mad»?",
    "options": [
      "Enfadarse por algo y hacer una tontería",
      "Celebrar un cumpleaños sorpresa",
      "Contar un sueño recurrente",
      "Confundir nombres de famosos"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "El chiste contrapone un gran enfado con una reacción absurda o insignificante.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-9",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Media",
    "prompt": "¿Quién interpretó la versión de «My Moon My Man» que impulsó el trend de parejas?",
    "options": [
      "FINNEAS",
      "The Weeknd",
      "Bad Bunny",
      "Harry Styles"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "La versión en directo de FINNEAS se viralizó en noviembre de 2026.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-10",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Media",
    "prompt": "¿Qué cantante popularizó originalmente «My Moon My Man»?",
    "options": [
      "Feist",
      "Lorde",
      "Adele",
      "Sia"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "La canción original de Feist es de 2007.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-11",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Media",
    "prompt": "¿Qué propone la campaña «Great Meme Reset» de 2026?",
    "options": [
      "Recuperar los memes de los años 2010",
      "Prohibir los GIF",
      "Eliminar todos los comentarios",
      "Crear una única red social"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "La propuesta nostálgica pretendía recuperar formatos antiguos frente al brainrot.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-12",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Difícil",
    "prompt": "¿Qué streamer aparece entre los protagonistas del ficticio Jupiter Incident 2011?",
    "options": [
      "IShowSpeed",
      "Ibai",
      "Rubius",
      "Ninja"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "Las versiones iniciales incorporan a IShowSpeed, CaseOh y Joe Bartolozzi.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-13",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Difícil",
    "prompt": "¿Qué otro streamer aparece en los montajes de Jupiter Incident 2011 junto a IShowSpeed?",
    "options": [
      "CaseOh",
      "AuronPlay",
      "TheGrefg",
      "Pokimane"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "CaseOh es una figura recurrente de la historia ficticia.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-14",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Difícil",
    "prompt": "¿En qué mes de 2026 se popularizó Gucci Morty?",
    "options": [
      "Agosto",
      "Febrero",
      "Abril",
      "Junio"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "El montaje se difundió con fuerza a finales de agosto.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-15",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Difícil",
    "prompt": "¿Qué artista se asocia al sonido «entiende, corazón» viral en TikTok en noviembre?",
    "options": [
      "Prince Royce",
      "Quevedo",
      "Rauw Alejandro",
      "Bizarrap"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "El fragmento de Prince Royce circulaba entre usuarios hispanohablantes.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-16",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Muy difícil",
    "prompt": "¿Qué personaje inspiró la tendencia de fan art llamada Petra Parker?",
    "options": [
      "Spider-Man",
      "Superman",
      "Daredevil",
      "The Flash"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "Petra Parker es una reinterpretación relacionada con Spider-Man.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-17",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Muy difícil",
    "prompt": "¿En qué plataforma se publicó el vídeo que impulsó «Huss Huss Huss» el 13 de noviembre de 2026?",
    "options": [
      "TikTok",
      "Twitch",
      "Vimeo",
      "Discord"
    ],
    "correct": 0,
    "seconds": 25,
    "explanation": "El clip de Roblox fue publicado en TikTok.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-n0",
    "category": "Memes e Internet",
    "mode": "number",
    "difficulty": "Muy difícil",
    "prompt": "¿En qué año se publicó originalmente la canción «My Moon My Man» de Feist?",
    "correct": 2007,
    "tolerance": 0,
    "estimateScale": 4,
    "seconds": 25,
    "explanation": "La canción original se publicó en 2007.",
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-2026-n1",
    "category": "Memes e Internet",
    "mode": "number",
    "difficulty": "Muy difícil",
    "prompt": "¿Cuántos años separan 2016 de 2026 en el meme nostálgico del año?",
    "correct": 10,
    "tolerance": 0,
    "estimateScale": 2,
    "seconds": 25,
    "explanation": "La diferencia entre ambos años es de una década.",
    "illustration": "/question-art/memes.svg"
  }
];
export const memePack={id:'6d656d657332303236313131',title:'Memes e Internet 2026 · Vol. 1',description:'20 preguntas sobre memes, trends y cultura de Internet de 2026. Actualizado en noviembre.',visibility:'public',count:questions.length,updated:Date.UTC(2026,10,26),owned:false,builtin:true};
export const builtinPack=id=>id===memePack.id?{...memePack,questions}:null;
