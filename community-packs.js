import {packExpansion} from './question-expansion.js';
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

questions.push(...[
  {
    "id": "meme-classic-0",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Muy fácil",
    "prompt": "¿Qué animal aparece en el meme Doge?",
    "options": [
      "Perro",
      "Gato",
      "Loro",
      "Caballo"
    ],
    "correct": 0,
    "seconds": 25,
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-classic-1",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Muy fácil",
    "prompt": "¿Qué meme muestra a un hombre distraído mirando a otra mujer?",
    "options": [
      "Distracted Boyfriend",
      "Success Kid",
      "Bad Luck Brian",
      "Hide the Pain Harold"
    ],
    "correct": 0,
    "seconds": 25,
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-classic-2",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Fácil",
    "prompt": "¿Qué personaje amarillo suele usarse en el meme de la imaginación con arcoíris?",
    "options": [
      "Bob Esponja",
      "Pikachu",
      "Homer Simpson",
      "Winnie the Pooh"
    ],
    "correct": 0,
    "seconds": 25,
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-classic-3",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Fácil",
    "prompt": "¿Qué cantante protagoniza el Rickroll?",
    "options": [
      "Rick Astley",
      "George Michael",
      "Phil Collins",
      "Elton John"
    ],
    "correct": 0,
    "seconds": 25,
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-classic-4",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Media",
    "prompt": "¿Qué animal aparece en el meme de la mujer gritando a un animal sentado a la mesa?",
    "options": [
      "Gato",
      "Perro",
      "Conejo",
      "Loro"
    ],
    "correct": 0,
    "seconds": 25,
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-classic-5",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Media",
    "prompt": "¿Qué personaje protagoniza el meme This Is Fine?",
    "options": [
      "Un perro",
      "Un gato",
      "Un oso",
      "Un pato"
    ],
    "correct": 0,
    "seconds": 25,
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-classic-6",
    "category": "Memes e Internet",
    "mode": "choice",
    "difficulty": "Difícil",
    "prompt": "¿Qué meme español nació de la frase «ola k ase»?",
    "options": [
      "Una llama",
      "Una cabra",
      "Un caballo",
      "Una alpaca"
    ],
    "correct": 0,
    "seconds": 25,
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-order-1",
    "category": "Memes e Internet",
    "mode": "order",
    "difficulty": "Media",
    "prompt": "Ordena estas plataformas por su lanzamiento original.",
    "options": [
      "YouTube",
      "Twitter",
      "Instagram",
      "TikTok"
    ],
    "correct": [
      0,
      1,
      2,
      3
    ],
    "seconds": 30,
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-number-1",
    "category": "Memes e Internet",
    "mode": "number",
    "difficulty": "Fácil",
    "prompt": "¿En qué año se lanzó YouTube?",
    "correct": 2005,
    "tolerance": 0,
    "estimateScale": 3,
    "seconds": 25,
    "illustration": "/question-art/memes.svg"
  },
  {
    "id": "meme-number-2",
    "category": "Memes e Internet",
    "mode": "number",
    "difficulty": "Difícil",
    "prompt": "¿En qué año se publicó Never Gonna Give You Up de Rick Astley?",
    "correct": 1987,
    "tolerance": 0,
    "estimateScale": 4,
    "seconds": 25,
    "illustration": "/question-art/memes.svg"
  }
]);
const themes=[
  {
    "id": "706f6b656d6f6e3030303031",
    "title": "Pokémon",
    "description": "Pokédex, tipos, regiones, evolución y videojuegos.",
    "art": "gaming",
    "questions": [
      {
        "id": "pokemon-c0",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué Pokémon acompaña a Ash al inicio del anime?",
        "options": [
          "Pikachu",
          "Eevee",
          "Charmander",
          "Meowth"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c1",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿De qué tipo es Squirtle?",
        "options": [
          "Agua",
          "Fuego",
          "Planta",
          "Roca"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c2",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué objeto se utiliza para capturar Pokémon?",
        "options": [
          "Poké Ball",
          "Poción",
          "Repelente",
          "Caramelo Raro"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c3",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿En qué evoluciona Charmander primero?",
        "options": [
          "Charmeleon",
          "Charizard",
          "Dragonite",
          "Arcanine"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c4",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué Pokémon duerme bloqueando caminos en Kanto?",
        "options": [
          "Snorlax",
          "Gengar",
          "Onix",
          "Lapras"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c5",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué tipo es supereficaz contra Fuego?",
        "options": [
          "Agua",
          "Planta",
          "Hielo",
          "Acero"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c6",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué región se explora en Rubí y Zafiro?",
        "options": [
          "Hoenn",
          "Johto",
          "Sinnoh",
          "Teselia"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c7",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Cuál es la evolución de Magikarp?",
        "options": [
          "Gyarados",
          "Milotic",
          "Sharpedo",
          "Seaking"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c8",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué Pokémon puede evolucionar en Umbreon?",
        "options": [
          "Eevee",
          "Ditto",
          "Zorua",
          "Meowth"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c9",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué legendario aparece en la portada de Pokémon Oro?",
        "options": [
          "Ho-Oh",
          "Lugia",
          "Suicune",
          "Entei"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c10",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué tipo se añadió en sexta generación?",
        "options": [
          "Hada",
          "Acero",
          "Siniestro",
          "Dragón"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c11",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Quién es la campeona de Sinnoh en Diamante y Perla?",
        "options": [
          "Cintia",
          "Diantha",
          "Iris",
          "Lance"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c12",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué fósil permite revivir a Omanyte?",
        "options": [
          "Fósil Helix",
          "Fósil Domo",
          "Ámbar Viejo",
          "Fósil Garra"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c13",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué Pokémon posee formas Ataque, Defensa y Velocidad?",
        "options": [
          "Deoxys",
          "Rotom",
          "Castform",
          "Unown"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c14",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿En qué región transcurren Espada y Escudo?",
        "options": [
          "Galar",
          "Alola",
          "Kalos",
          "Paldea"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c15",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué habilidad invoca lluvia al entrar en combate?",
        "options": [
          "Llovizna",
          "Sequía",
          "Chorro Arena",
          "Nevada"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c16",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué Pokémon evoluciona de Feebas?",
        "options": [
          "Milotic",
          "Huntail",
          "Gorebyss",
          "Lanturn"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c17",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué tipo tiene inmunidad natural al Eléctrico?",
        "options": [
          "Tierra",
          "Roca",
          "Acero",
          "Planta"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c18",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué región se conocía como Hisui?",
        "options": [
          "Sinnoh",
          "Hoenn",
          "Johto",
          "Kalos"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c19",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué Pokémon tiene la habilidad Disfraz?",
        "options": [
          "Mimikyu",
          "Zoroark",
          "Ditto",
          "Kecleon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c20",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué Pokémon ocupa el número 201 de la Pokédex Nacional?",
        "options": [
          "Unown",
          "Wobbuffet",
          "Forretress",
          "Girafarig"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c21",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué Pokémon de Galar evoluciona a Runerigus?",
        "options": [
          "Yamask",
          "Cofagrigus",
          "Golett",
          "Sandygast"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c22",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué tipo adquiere Rotom Lavado además de Eléctrico?",
        "options": [
          "Agua",
          "Fantasma",
          "Acero",
          "Hielo"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c23",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué habilidad evita que el rival reduzca las estadísticas del usuario?",
        "options": [
          "Cuerpo Puro",
          "Tenacidad",
          "Competitivo",
          "Respondón"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-c24",
        "category": "Pokémon",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué Pokémon aparece en la portada de Pokémon Cristal?",
        "options": [
          "Suicune",
          "Entei",
          "Raikou",
          "Lugia"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-n0",
        "category": "Pokémon",
        "mode": "number",
        "difficulty": "Muy fácil",
        "prompt": "¿Cuántos iniciales se ofrecen en Pokémon Rojo y Azul?",
        "correct": 3,
        "estimateScale": 1,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-n1",
        "category": "Pokémon",
        "mode": "number",
        "difficulty": "Fácil",
        "prompt": "¿Cuántas medallas de gimnasio hay en Kanto?",
        "correct": 8,
        "estimateScale": 2,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-n2",
        "category": "Pokémon",
        "mode": "number",
        "difficulty": "Media",
        "prompt": "¿Cuántos Pokémon incluye la primera generación?",
        "correct": 151,
        "estimateScale": 20,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-n3",
        "category": "Pokémon",
        "mode": "number",
        "difficulty": "Difícil",
        "prompt": "¿Qué número nacional tiene Pikachu?",
        "correct": 25,
        "estimateScale": 10,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-n4",
        "category": "Pokémon",
        "mode": "number",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué número nacional tiene Arceus?",
        "correct": 493,
        "estimateScale": 40,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-o0",
        "category": "Pokémon",
        "mode": "order",
        "difficulty": "Muy fácil",
        "prompt": "Ordena estos Pokémon por número nacional.",
        "options": [
          "Bulbasaur",
          "Charmander",
          "Squirtle",
          "Pikachu"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-o1",
        "category": "Pokémon",
        "mode": "order",
        "difficulty": "Fácil",
        "prompt": "Ordena estas regiones por generación de debut.",
        "options": [
          "Kanto",
          "Johto",
          "Hoenn",
          "Sinnoh"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-o2",
        "category": "Pokémon",
        "mode": "order",
        "difficulty": "Media",
        "prompt": "Ordena estos juegos por lanzamiento original.",
        "options": [
          "Rojo y Verde",
          "Oro y Plata",
          "Rubí y Zafiro",
          "Diamante y Perla"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-o3",
        "category": "Pokémon",
        "mode": "order",
        "difficulty": "Difícil",
        "prompt": "Ordena estos otros Pokémon por número de la Pokédex Nacional.",
        "options": [
          "Pikachu",
          "Meowth",
          "Mewtwo",
          "Mew"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "pokemon-o4",
        "category": "Pokémon",
        "mode": "order",
        "difficulty": "Muy difícil",
        "prompt": "Ordena estas mecánicas por su debut.",
        "options": [
          "Megaevolución",
          "Movimientos Z",
          "Dinamax",
          "Teracristalización"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      }
    ]
  },
  {
    "id": "646967696d6f6e3030303031",
    "title": "Digimon",
    "description": "Adventure, 02, Tamers, Frontier, compañeros y digievoluciones.",
    "art": "gaming",
    "questions": [
      {
        "id": "digimon-c0",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué Digimon acompaña a Tai en Adventure?",
        "options": [
          "Agumon",
          "Gabumon",
          "Patamon",
          "Gomamon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c1",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué Digimon acompaña a Matt?",
        "options": [
          "Gabumon",
          "Tentomon",
          "Palmon",
          "Biyomon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c2",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿En qué se convierte Agumon en su nivel Champion clásico?",
        "options": [
          "Greymon",
          "Garurumon",
          "Angemon",
          "Kabuterimon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c3",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Cómo se llama el mundo al que viajan los niños elegidos?",
        "options": [
          "Mundo Digital",
          "Kanto",
          "Mundo Espejo",
          "Ciudad Z"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c4",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué Digimon parece un pequeño dinosaurio rojo en Tamers?",
        "options": [
          "Guilmon",
          "Terriermon",
          "Renamon",
          "Impmon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c5",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué Digimon acompaña a Mimi?",
        "options": [
          "Palmon",
          "Gatomon",
          "Biyomon",
          "Gomamon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c6",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué Digimon acompaña a Kari?",
        "options": [
          "Gatomon",
          "Patamon",
          "Hawkmon",
          "Veemon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c7",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué Digimon se convierte en Angemon?",
        "options": [
          "Patamon",
          "Gomamon",
          "Gabumon",
          "Tentomon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c8",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Quién protagoniza Adventure 02?",
        "options": [
          "Davis",
          "Tai",
          "Takato",
          "Takuya"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c9",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué Digimon acompaña a Henry en Tamers?",
        "options": [
          "Terriermon",
          "Lopmon",
          "Guilmon",
          "Renamon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c10",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué Digimon nace al fusionar WarGreymon y MetalGarurumon?",
        "options": [
          "Omnimon",
          "Imperialdramon",
          "Gallantmon",
          "Alphamon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c11",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué emblema representa Tai?",
        "options": [
          "Valor",
          "Amistad",
          "Esperanza",
          "Luz"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c12",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué Digimon acompaña a Davis?",
        "options": [
          "Veemon",
          "Wormmon",
          "Armadillomon",
          "Hawkmon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c13",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué villano controla los engranajes negros en Adventure?",
        "options": [
          "Devimon",
          "Piedmon",
          "Myotismon",
          "Etemon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c14",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué Digimon acompaña a Rika en Tamers?",
        "options": [
          "Renamon",
          "Guilmon",
          "Terriermon",
          "Impmon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c15",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué forma obtiene Veemon con el Digi-Huevo del Valor?",
        "options": [
          "Flamedramon",
          "Raidramon",
          "Magnamon",
          "ExVeemon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c16",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué pareja se fusiona para crear Paildramon?",
        "options": [
          "ExVeemon y Stingmon",
          "Angemon y Angewomon",
          "Greymon y Garurumon",
          "Aquilamon y Ankylomon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c17",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué personaje usa el espíritu humano del fuego en Frontier?",
        "options": [
          "Takuya",
          "Koji",
          "Junpei",
          "Tomoki"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c18",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué Digimon evoluciona a Beelzemon en Tamers?",
        "options": [
          "Impmon",
          "Guilmon",
          "Cyberdramon",
          "Monodramon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c19",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué Digimon resulta de la fusión de Aquilamon y Gatomon?",
        "options": [
          "Silphymon",
          "Shakkoumon",
          "Paildramon",
          "Dinobeemon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c20",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué Señor Demonio representa la pereza?",
        "options": [
          "Belphemon",
          "Lucemon",
          "Daemon",
          "Leviamon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c21",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué Digimon usa Terra Force?",
        "options": [
          "WarGreymon",
          "MetalGarurumon",
          "Magnadramon",
          "Phoenixmon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c22",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué forma Mega alcanza Guilmon mediante biomerging?",
        "options": [
          "Gallantmon",
          "Megidramon",
          "Rapidmon",
          "Sakuyamon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c23",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué Digimon acompaña a Ryo en Tamers?",
        "options": [
          "Cyberdramon",
          "Impmon",
          "Guardromon",
          "Lopmon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-c24",
        "category": "Digimon",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué Royal Knight surge de Veemon con el Digi-Huevo de los Milagros?",
        "options": [
          "Magnamon",
          "UlforceVeedramon",
          "Craniamon",
          "Dynasmon"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-n0",
        "category": "Digimon",
        "mode": "number",
        "difficulty": "Muy fácil",
        "prompt": "¿Cuántos niños llegan inicialmente al Mundo Digital en Adventure?",
        "correct": 7,
        "estimateScale": 2,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-n1",
        "category": "Digimon",
        "mode": "number",
        "difficulty": "Fácil",
        "prompt": "¿Cuántos protagonistas humanos forman el trío inicial de Tamers?",
        "correct": 3,
        "estimateScale": 1,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-n2",
        "category": "Digimon",
        "mode": "number",
        "difficulty": "Media",
        "prompt": "¿Cuántos episodios tiene Adventure de 1999?",
        "correct": 54,
        "estimateScale": 8,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-n3",
        "category": "Digimon",
        "mode": "number",
        "difficulty": "Difícil",
        "prompt": "¿En qué año se estrenó Tamers en Japón?",
        "correct": 2001,
        "estimateScale": 3,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-n4",
        "category": "Digimon",
        "mode": "number",
        "difficulty": "Muy difícil",
        "prompt": "¿En qué año se lanzó Digimon World para PlayStation en Japón?",
        "correct": 1999,
        "estimateScale": 3,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-o0",
        "category": "Digimon",
        "mode": "order",
        "difficulty": "Muy fácil",
        "prompt": "Ordena la línea clásica de Agumon.",
        "options": [
          "Agumon",
          "Greymon",
          "MetalGreymon",
          "WarGreymon"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-o1",
        "category": "Digimon",
        "mode": "order",
        "difficulty": "Fácil",
        "prompt": "Ordena la línea clásica de Gabumon.",
        "options": [
          "Gabumon",
          "Garurumon",
          "WereGarurumon",
          "MetalGarurumon"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-o2",
        "category": "Digimon",
        "mode": "order",
        "difficulty": "Media",
        "prompt": "Ordena las series por estreno japonés.",
        "options": [
          "Adventure",
          "Adventure 02",
          "Tamers",
          "Frontier"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-o3",
        "category": "Digimon",
        "mode": "order",
        "difficulty": "Difícil",
        "prompt": "Ordena la línea clásica de Guilmon.",
        "options": [
          "Guilmon",
          "Growlmon",
          "WarGrowlmon",
          "Gallantmon"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      },
      {
        "id": "digimon-o4",
        "category": "Digimon",
        "mode": "order",
        "difficulty": "Muy difícil",
        "prompt": "Ordena estas cuatro series de anime por su primer estreno en Japón.",
        "options": [
          "Frontier",
          "Savers",
          "Xros Wars",
          "Ghost Game"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/gaming.svg"
      }
    ]
  },
  {
    "id": "766f6c6579626f6c30303031",
    "title": "Voleibol",
    "description": "Reglamento, rotaciones, táctica, pista, playa y competiciones.",
    "art": "sport",
    "questions": [
      {
        "id": "voleibol-c0",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué separa a los dos equipos?",
        "options": [
          "Una red",
          "Una portería",
          "Una canasta",
          "Una valla"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c1",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué jugador suele vestir una camiseta diferente?",
        "options": [
          "Líbero",
          "Colocador",
          "Opuesto",
          "Central"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c2",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué gesto pone el balón en juego?",
        "options": [
          "Saque",
          "Bloqueo",
          "Remate",
          "Recepción"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c3",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Con qué parte del cuerpo se puede golpear legalmente el balón?",
        "options": [
          "Cualquiera",
          "Solo manos",
          "Solo brazos",
          "Solo por encima de la cintura"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c4",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Cuántos equipos juegan simultáneamente en pista?",
        "options": [
          "2",
          "3",
          "4",
          "6"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c5",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Cuántos sets necesita ganar un equipo al mejor de cinco?",
        "options": [
          "3",
          "2",
          "4",
          "5"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c6",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿En qué sentido se rota al recuperar el saque?",
        "options": [
          "Horario",
          "Antihorario",
          "Libre",
          "Diagonal"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c7",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué jugador suele organizar el ataque?",
        "options": [
          "Colocador",
          "Líbero",
          "Central",
          "Árbitro"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c8",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Cuántos jugadores de cada equipo hay en pista indoor?",
        "options": [
          "6",
          "5",
          "7",
          "4"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c9",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué país ganó el oro masculino indoor en París 2024?",
        "options": [
          "Francia",
          "Polonia",
          "Italia",
          "Brasil"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c10",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué zona ocupa el jugador que va a sacar?",
        "options": [
          "1",
          "2",
          "3",
          "6"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c11",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Cuántos toques tiene un equipo tras su propio bloqueo indoor?",
        "options": [
          "3",
          "2",
          "1",
          "4"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c12",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué país ganó el oro femenino indoor en París 2024?",
        "options": [
          "Italia",
          "Estados Unidos",
          "Brasil",
          "Turquía"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c13",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿A qué posición suele sustituir el líbero al pasar a zaguero?",
        "options": [
          "Central",
          "Colocador",
          "Opuesto",
          "Árbitro"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c14",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué sistema tiene un único colocador y cinco atacantes?",
        "options": [
          "5-1",
          "6-2",
          "4-2",
          "3-3"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c15",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Puede un zaguero completar un ataque con el balón totalmente por encima de la red si despega desde la zona delantera?",
        "options": [
          "No",
          "Sí siempre",
          "Solo tras bloqueo",
          "Solo si es colocador"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c16",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué pasa si el saque toca la red y cruza legalmente?",
        "options": [
          "El juego continúa",
          "Se repite el saque",
          "Es falta automática",
          "Se cambia de árbitro"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c17",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué jugador no puede bloquear ni intentar bloquear?",
        "options": [
          "Líbero",
          "Central delantero",
          "Opuesto delantero",
          "Receptor delantero"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c18",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué selección ganó el Mundial masculino de 2022?",
        "options": [
          "Italia",
          "Polonia",
          "Brasil",
          "Francia"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c19",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿En qué ciudad se creó el voleibol en 1895?",
        "options": [
          "Holyoke",
          "Springfield",
          "Chicago",
          "Boston"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c20",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué nombre recibió originalmente el voleibol?",
        "options": [
          "Mintonette",
          "Volley Court",
          "Netball",
          "Hand Tennis"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c21",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué ocurre si el líbero coloca de dedos desde zona delantera y un compañero completa un ataque con el balón totalmente por encima de la red?",
        "options": [
          "Falta de ataque",
          "Falta de rotación",
          "Punto a favor",
          "Se repite la jugada"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c22",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Cuál es la altura oficial de la red masculina sénior de playa?",
        "options": [
          "2,43 m",
          "2,35 m",
          "2,24 m",
          "2,50 m"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c23",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué selección ganó el Mundial femenino de 2018?",
        "options": [
          "Serbia",
          "Italia",
          "China",
          "Estados Unidos"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-c24",
        "category": "Voleibol",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué selección ganó el primer oro olímpico masculino indoor en 1964?",
        "options": [
          "Unión Soviética",
          "Japón",
          "Checoslovaquia",
          "Polonia"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-n0",
        "category": "Voleibol",
        "mode": "number",
        "difficulty": "Muy fácil",
        "prompt": "¿Cuántos jugadores por equipo hay en playa?",
        "correct": 2,
        "estimateScale": 1,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-n1",
        "category": "Voleibol",
        "mode": "number",
        "difficulty": "Fácil",
        "prompt": "¿Cuántos puntos como mínimo necesita un equipo para ganar el quinto set?",
        "correct": 15,
        "estimateScale": 3,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-n2",
        "category": "Voleibol",
        "mode": "number",
        "difficulty": "Media",
        "prompt": "¿Cuántos metros de largo tiene una pista indoor?",
        "correct": 18,
        "estimateScale": 3,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-n3",
        "category": "Voleibol",
        "mode": "number",
        "difficulty": "Difícil",
        "prompt": "¿Cuántos centímetros mide la red femenina sénior indoor?",
        "correct": 224,
        "estimateScale": 10,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-n4",
        "category": "Voleibol",
        "mode": "number",
        "difficulty": "Muy difícil",
        "prompt": "¿En qué año debutó el voleibol de playa como deporte olímpico de medalla?",
        "correct": 1996,
        "estimateScale": 5,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-o0",
        "category": "Voleibol",
        "mode": "order",
        "difficulty": "Muy fácil",
        "prompt": "Ordena las primeras cuatro zonas siguiendo una rotación desde zona 1.",
        "options": [
          "1",
          "6",
          "5",
          "4"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-o1",
        "category": "Voleibol",
        "mode": "order",
        "difficulty": "Fácil",
        "prompt": "Ordena una jugada típica desde el saque rival.",
        "options": [
          "Saque rival",
          "Recepción",
          "Colocación",
          "Remate"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-o2",
        "category": "Voleibol",
        "mode": "order",
        "difficulty": "Media",
        "prompt": "Ordena estas sedes olímpicas de verano entre 1964 y 2024, de más antigua a más reciente.",
        "options": ["Ciudad de México","Seúl","Atenas","Río de Janeiro"],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-o3",
        "category": "Voleibol",
        "mode": "order",
        "difficulty": "Difícil",
        "prompt": "Ordena las fases habituales de un bloqueo.",
        "options": [
          "Lectura",
          "Desplazamiento",
          "Salto",
          "Caída"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/sport.svg"
      },
      {
        "id": "voleibol-o4",
        "category": "Voleibol",
        "mode": "order",
        "difficulty": "Muy difícil",
        "prompt": "Ordena las sedes olímpicas por año.",
        "options": [
          "Montreal",
          "Barcelona",
          "Sídney",
          "Río de Janeiro"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/sport.svg"
      }
    ]
  },
  {
    "id": "656c656374726f6e69636131",
    "title": "Música electrónica moderna",
    "description": "EDM, techno, house, bass, festivales, producción y cultura DJ.",
    "art": "music",
    "questions": [
      {
        "id": "electronica-c0",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué DJ publicó Animals en 2013?",
        "options": [
          "Martin Garrix",
          "David Guetta",
          "Tiësto",
          "Avicii"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c1",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué artista publicó Levels en 2011?",
        "options": [
          "Avicii",
          "Kygo",
          "Zedd",
          "Alesso"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c2",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué significa BPM?",
        "options": [
          "Pulsos por minuto",
          "Bajos por mezcla",
          "Bits por melodía",
          "Beats por megabyte"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c3",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué dúo publicó Get Lucky con Pharrell Williams?",
        "options": [
          "Daft Punk",
          "Disclosure",
          "Justice",
          "The Chainsmokers"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c4",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Muy fácil",
        "prompt": "¿Qué equipo suele usar un DJ para combinar dos señales?",
        "options": [
          "Mezclador",
          "Violín",
          "Trombón",
          "Arpa"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c5",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿En qué país nació Tomorrowland?",
        "options": [
          "Bélgica",
          "España",
          "Países Bajos",
          "Alemania"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c6",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué productor publicó Strobe?",
        "options": [
          "deadmau5",
          "Skrillex",
          "Calvin Harris",
          "Diplo"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c7",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué artista noruego publicó Firestone?",
        "options": [
          "Kygo",
          "Alan Walker",
          "Matoma",
          "Cashmere Cat"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c8",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué grupo publicó Don't You Worry Child?",
        "options": [
          "Swedish House Mafia",
          "Above & Beyond",
          "Major Lazer",
          "Pendulum"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c9",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Fácil",
        "prompt": "¿Qué efecto repite ecos rítmicos?",
        "options": [
          "Delay",
          "Compresor",
          "Ecualizador",
          "Limitador"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c10",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué artista lanzó Actual Life (April 14 – December 17 2020)?",
        "options": [
          "Fred again..",
          "Four Tet",
          "Bicep",
          "Bonobo"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c11",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué dúo publicó Latch con Sam Smith?",
        "options": [
          "Disclosure",
          "Gorgon City",
          "CamelPhat",
          "ODESZA"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c12",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué productor lanzó Losing It en 2018?",
        "options": [
          "FISHER",
          "Chris Lake",
          "John Summit",
          "Dom Dolla"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c13",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué artista publicó Opus en 2015?",
        "options": [
          "Eric Prydz",
          "deadmau5",
          "Maceo Plex",
          "Solomun"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c14",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Media",
        "prompt": "¿Qué dúo lanzó Glue en 2017?",
        "options": [
          "Bicep",
          "ARTBAT",
          "Tale Of Us",
          "Adriatique"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c15",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué dúo fundó Afterlife en 2016?",
        "options": [
          "Tale Of Us",
          "Mind Against",
          "CamelPhat",
          "Mathame"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c16",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué artista publicó Quest for Fire en 2023?",
        "options": [
          "Skrillex",
          "Porter Robinson",
          "Madeon",
          "Flume"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c17",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué DJ fundó el sello KNTXT?",
        "options": [
          "Charlotte de Witte",
          "Amelie Lens",
          "Nina Kraviz",
          "Peggy Gou"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c18",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué artista lanzó Nurture en 2021?",
        "options": [
          "Porter Robinson",
          "Madeon",
          "Seven Lions",
          "Illenium"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c19",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Difícil",
        "prompt": "¿Qué técnica sincroniza manualmente el tempo de dos pistas?",
        "options": [
          "Beatmatching",
          "Sidechain",
          "Mastering",
          "Sampling"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c20",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué productor lanzó el álbum Skin en 2016?",
        "options": [
          "Flume",
          "Kaytranada",
          "Skrillex",
          "Diplo"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c21",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué dúo publicó el álbum Woman en 2016?",
        "options": [
          "Justice",
          "Daft Punk",
          "Disclosure",
          "Bicep"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c22",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué artista publicó el álbum Singularity en 2018?",
        "options": [
          "Jon Hopkins",
          "Four Tet",
          "Bonobo",
          "Floating Points"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c23",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué DJ fundó el sello EXHALE?",
        "options": [
          "Amelie Lens",
          "Charlotte de Witte",
          "ANNA",
          "Nina Kraviz"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-c24",
        "category": "Música electrónica moderna",
        "mode": "choice",
        "difficulty": "Muy difícil",
        "prompt": "¿Qué alias utiliza Eric Prydz para gran parte de su techno?",
        "options": [
          "Cirez D",
          "Pryda Friends",
          "Testpilot",
          "HI-LO"
        ],
        "correct": 0,
        "seconds": 25,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-n0",
        "category": "Música electrónica moderna",
        "mode": "number",
        "difficulty": "Muy fácil",
        "prompt": "¿Cuántos pulsos tiene un compás de 4/4?",
        "correct": 4,
        "estimateScale": 1,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-n1",
        "category": "Música electrónica moderna",
        "mode": "number",
        "difficulty": "Fácil",
        "prompt": "¿Cuántos pulsos hay en un minuto de música a 128 BPM?",
        "correct": 128,
        "estimateScale": 10,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-n2",
        "category": "Música electrónica moderna",
        "mode": "number",
        "difficulty": "Media",
        "prompt": "¿En qué año murió Avicii?",
        "correct": 2018,
        "estimateScale": 3,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-n3",
        "category": "Música electrónica moderna",
        "mode": "number",
        "difficulty": "Difícil",
        "prompt": "¿Cuántos segundos dura un compás de 4/4 a 120 BPM?",
        "correct": 2,
        "estimateScale": 1,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-n4",
        "category": "Música electrónica moderna",
        "mode": "number",
        "difficulty": "Muy difícil",
        "prompt": "¿Cuántos pulsos hay en 16 compases de 4/4?",
        "correct": 64,
        "estimateScale": 8,
        "tolerance": 0,
        "seconds": 30,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-o0",
        "category": "Música electrónica moderna",
        "mode": "order",
        "difficulty": "Muy fácil",
        "prompt": "Ordena estas indicaciones italianas de tempo, de más lenta a más rápida.",
        "options": ["Largo","Andante","Allegro","Presto"],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-o1",
        "category": "Música electrónica moderna",
        "mode": "order",
        "difficulty": "Fácil",
        "prompt": "Ordena estos éxitos por año de publicación.",
        "options": [
          "Levels",
          "Animals",
          "Faded",
          "Losing It"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-o2",
        "category": "Música electrónica moderna",
        "mode": "order",
        "difficulty": "Media",
        "prompt": "Ordena las fases típicas de una mezcla de DJ.",
        "options": [
          "Preescucha",
          "Sincronización",
          "Transición",
          "Salida de la pista anterior"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-o3",
        "category": "Música electrónica moderna",
        "mode": "order",
        "difficulty": "Difícil",
        "prompt": "Ordena estos álbumes por lanzamiento.",
        "options": [
          "Random Access Memories",
          "Skin",
          "Nurture",
          "Quest for Fire"
        ],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/music.svg"
      },
      {
        "id": "electronica-o4",
        "category": "Música electrónica moderna",
        "mode": "order",
        "difficulty": "Muy difícil",
        "prompt": "Ordena estos equipos de DJ por su primera comercialización.",
        "options": ["Technics SL-1200 original","Pioneer CDJ-500","Pioneer CDJ-1000","Pioneer DDJ-SX"],
        "correct": [
          0,
          1,
          2,
          3
        ],
        "seconds": 30,
        "illustration": "/question-art/music.svg"
      }
    ]
  }
];
// UEFA historical finals and 2024/25 format: https://www.uefa.com/uefachampionsleague/statistics/all-time/
themes.push({
  "id": "6368616d70696f6e73303031",
  "title": "Fútbol · Champions League",
  "description": "Finales, clubes, leyendas, remontadas y formato de la Copa de Europa. Historia hasta 2025.",
  "art": "sport",
  "questions": [
    {
      "id": "ucl-choice-0",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Muy fácil",
      "prompt": "¿Qué club español juega en el Santiago Bernabéu?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Real Madrid",
        "Barcelona",
        "Atlético de Madrid",
        "Sevilla"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-1",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Muy fácil",
      "prompt": "¿En qué país juega el Bayern de Múnich?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Alemania",
        "Italia",
        "Francia",
        "Austria"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-2",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Muy fácil",
      "prompt": "¿Qué club inglés juega en Anfield?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Liverpool",
        "Chelsea",
        "Arsenal",
        "Manchester City"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-3",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Muy fácil",
      "prompt": "¿Qué club italiano es conocido como los rossoneri?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "AC Milan",
        "Inter",
        "Juventus",
        "Napoli"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-4",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Muy fácil",
      "prompt": "¿Qué club portugués juega en el Estádio da Luz?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Benfica",
        "Porto",
        "Sporting CP",
        "Braga"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-5",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Muy fácil",
      "prompt": "¿En qué país juega el Paris Saint-Germain?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Francia",
        "Bélgica",
        "Suiza",
        "Italia"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-6",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Fácil",
      "prompt": "¿Qué club ganó la Champions de 2023?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Manchester City",
        "Inter",
        "Bayern",
        "Real Madrid"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-7",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Fácil",
      "prompt": "¿Qué club ganó la final de 2024?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Real Madrid",
        "Borussia Dortmund",
        "Bayern",
        "Manchester City"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-8",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Fácil",
      "prompt": "¿Qué club remontó una desventaja de tres goles en la final de 2005?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Liverpool",
        "Chelsea",
        "Manchester United",
        "Arsenal"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-9",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Fácil",
      "prompt": "¿Quién marcó de cabeza el empate del Real Madrid en el descuento de la final de 2014?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Sergio Ramos",
        "Cristiano Ronaldo",
        "Gareth Bale",
        "Marcelo"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-10",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Fácil",
      "prompt": "¿Qué club conquistó su primera Champions en 2025?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Paris Saint-Germain",
        "Arsenal",
        "Atlético de Madrid",
        "Bayer Leverkusen"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-11",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Fácil",
      "prompt": "¿Qué equipo ganó la final de 2019 frente al Tottenham?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Liverpool",
        "Chelsea",
        "Manchester City",
        "Manchester United"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-12",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Media",
      "prompt": "¿Quién dirigió al Porto campeón de 2004?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "José Mourinho",
        "Rafael Benítez",
        "Pep Guardiola",
        "Carlo Ancelotti"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-13",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Media",
      "prompt": "¿Qué equipo derrotó al Bayern en la final de 2012?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Chelsea",
        "Barcelona",
        "Inter",
        "Real Madrid"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-14",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Media",
      "prompt": "¿Qué club ganó la final de 1999 con dos goles en el descuento?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Manchester United",
        "Bayern",
        "Juventus",
        "Real Madrid"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-15",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Media",
      "prompt": "¿Qué club ganó la final de 2010 bajo la dirección de José Mourinho?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Inter",
        "AC Milan",
        "Chelsea",
        "Porto"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-16",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Media",
      "prompt": "¿Qué club perdió 5-0 la final de 2025?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Inter",
        "Bayern",
        "Juventus",
        "Atlético de Madrid"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-17",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Media",
      "prompt": "¿Qué club ganó la primera final bajo la denominación UEFA Champions League en 1993?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Olympique de Marsella",
        "AC Milan",
        "Ajax",
        "Barcelona"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-18",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Difícil",
      "prompt": "¿Qué club ganó la Copa de Europa de 1992 con un gol de Ronald Koeman?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Barcelona",
        "Sampdoria",
        "Benfica",
        "AC Milan"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-19",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Difícil",
      "prompt": "¿Qué jugador marcó de volea el gol decisivo en la final de 2002?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Zinedine Zidane",
        "Raúl",
        "Luís Figo",
        "Fernando Morientes"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-20",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Difícil",
      "prompt": "¿Qué club ganó la final de 1997 ante la Juventus?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Borussia Dortmund",
        "Bayern",
        "Ajax",
        "AC Milan"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-21",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Difícil",
      "prompt": "¿En qué estadio se jugó la final de 2005?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Estadio Olímpico Atatürk",
        "Wembley",
        "San Siro",
        "Estadio da Luz"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-22",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Difícil",
      "prompt": "¿Qué club derrotó al Barcelona por 4-0 en la final de 1994?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "AC Milan",
        "Juventus",
        "Inter",
        "Sampdoria"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-23",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Difícil",
      "prompt": "¿Qué entrenador ganó la Champions de 2020 con el Bayern?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Hansi Flick",
        "Jupp Heynckes",
        "Thomas Tuchel",
        "Julian Nagelsmann"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-24",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Muy difícil",
      "prompt": "¿Qué club ganó la Copa de Europa de 1986 en Sevilla?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Steaua de Bucarest",
        "Barcelona",
        "Benfica",
        "Porto"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-25",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Muy difícil",
      "prompt": "¿Qué equipo venció al Benfica en la final de 1968?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Manchester United",
        "Celtic",
        "Inter",
        "Real Madrid"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-26",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Muy difícil",
      "prompt": "¿Qué club ganó la Copa de Europa de 1991?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Estrella Roja",
        "Olympique de Marsella",
        "Sampdoria",
        "Spartak de Moscú"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-27",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Muy difícil",
      "prompt": "¿Qué club ganó la Copa de Europa de 1988 por penaltis?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "PSV Eindhoven",
        "Ajax",
        "Benfica",
        "Porto"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-28",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Muy difícil",
      "prompt": "¿Qué equipo ganó la final de 1987 con el famoso gol de tacón de Rabah Madjer?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Porto",
        "Bayern",
        "Benfica",
        "Celtic"
      ],
      "correct": 0
    },
    {
      "id": "ucl-choice-29",
      "category": "Champions League",
      "mode": "choice",
      "difficulty": "Muy difícil",
      "prompt": "¿Qué club ganó la final de 1979 con un gol de Trevor Francis?",
      "seconds": 25,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Nottingham Forest",
        "Malmö",
        "Liverpool",
        "Hamburgo"
      ],
      "correct": 0
    },
    {
      "id": "ucl-number-0",
      "category": "Champions League",
      "mode": "number",
      "difficulty": "Muy fácil",
      "prompt": "¿Cuántos equipos juegan una final de Champions?",
      "seconds": 30,
      "illustration": "/question-art/sport.svg",
      "correct": 2,
      "tolerance": 0,
      "estimateScale": 1
    },
    {
      "id": "ucl-number-1",
      "category": "Champions League",
      "mode": "number",
      "difficulty": "Fácil",
      "prompt": "¿Cuántos puntos vale una victoria en la fase de liga?",
      "seconds": 30,
      "illustration": "/question-art/sport.svg",
      "correct": 3,
      "tolerance": 0,
      "estimateScale": 1
    },
    {
      "id": "ucl-number-2",
      "category": "Champions League",
      "mode": "number",
      "difficulty": "Media",
      "prompt": "¿Cuántos equipos participan en la fase de liga desde 2024/25?",
      "seconds": 30,
      "illustration": "/question-art/sport.svg",
      "correct": 36,
      "tolerance": 0,
      "estimateScale": 5
    },
    {
      "id": "ucl-number-3",
      "category": "Champions League",
      "mode": "number",
      "difficulty": "Difícil",
      "prompt": "¿En qué año se disputó la primera final de la Copa de Europa?",
      "seconds": 30,
      "illustration": "/question-art/sport.svg",
      "correct": 1956,
      "tolerance": 0,
      "estimateScale": 5
    },
    {
      "id": "ucl-number-4",
      "category": "Champions League",
      "mode": "number",
      "difficulty": "Muy difícil",
      "prompt": "¿Cuántos goles marcó Cristiano Ronaldo en la Champions 2013/14?",
      "seconds": 30,
      "illustration": "/question-art/sport.svg",
      "correct": 17,
      "tolerance": 0,
      "estimateScale": 3
    },
    {
      "id": "ucl-order-0",
      "category": "Champions League",
      "mode": "order",
      "difficulty": "Muy fácil",
      "prompt": "Ordena estas finales de Champions de más antigua a reciente.",
      "seconds": 30,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Liverpool-Milan (la remontada de Estambul)",
        "Inter-Bayern (el triplete de Mourinho)",
        "Chelsea-Bayern (penaltis en Múnich)",
        "Real Madrid-Atlético (la Décima)"
      ],
      "correct": [
        0,
        1,
        2,
        3
      ]
    },
    {
      "id": "ucl-order-1",
      "category": "Champions League",
      "mode": "order",
      "difficulty": "Fácil",
      "prompt": "Ordena las fases desde la primera hasta la última del formato actual.",
      "seconds": 30,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Fase de liga",
        "Octavos",
        "Cuartos",
        "Final"
      ],
      "correct": [
        0,
        1,
        2,
        3
      ]
    },
    {
      "id": "ucl-order-2",
      "category": "Champions League",
      "mode": "order",
      "difficulty": "Media",
      "prompt": "Ordena estos campeones de cuatro ediciones consecutivas, empezando por 1992.",
      "seconds": 30,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Barcelona",
        "Olympique de Marsella",
        "AC Milan",
        "Ajax"
      ],
      "correct": [
        0,
        1,
        2,
        3
      ]
    },
    {
      "id": "ucl-order-3",
      "category": "Champions League",
      "mode": "order",
      "difficulty": "Difícil",
      "prompt": "Ordena estas ciudades según las finales disputadas entre 2005 y 2014.",
      "seconds": 30,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Estambul (Liverpool-Milan)",
        "Roma (Barcelona-Manchester United)",
        "Londres (Barcelona-Manchester United)",
        "Lisboa (Real Madrid-Atlético)"
      ],
      "correct": [
        0,
        1,
        2,
        3
      ]
    },
    {
      "id": "ucl-order-4",
      "category": "Champions League",
      "mode": "order",
      "difficulty": "Muy difícil",
      "prompt": "Ordena estos clubes por fecha de su primera Copa de Europa.",
      "seconds": 30,
      "illustration": "/question-art/sport.svg",
      "options": [
        "Celtic",
        "Ajax",
        "Nottingham Forest",
        "Porto"
      ],
      "correct": [
        0,
        1,
        2,
        3
      ]
    }
  ]
});
// Community pack curated for Chubi; stable ID for future additions.
const cristinaPack={
  "id": "6372697374696e6132303236",
  "title": "Cumple de Cristina",
  "description": "¿Cuánto sabes realmente de Cristina? Demuestra que la conoces mejor que el resto.",
  "author": "Chubi",
  "art": "general",
  "questions": [
    {
      "id": "cumple-cristina-1",
      "category": "Cumple de Cristina",
      "mode": "choice",
      "difficulty": "Media",
      "prompt": "¿Qué alimento detecta Cristina en cantidades diminutas al segundo, del asco que le da?",
      "options": [
        "Canela",
        "Anchoas",
        "Fuet",
        "Cilantro"
      ],
      "correct": 0,
      "seconds": 25
    },
    {
      "id": "cumple-cristina-2",
      "category": "Cumple de Cristina",
      "mode": "choice",
      "difficulty": "Media",
      "prompt": "¿De quién se disfrazó Cristina en un carnaval en Denia?",
      "options": [
        "Pétalo",
        "Burbuja",
        "Cactus",
        "El Profesor"
      ],
      "correct": 3,
      "seconds": 25
    },
    {
      "id": "cumple-cristina-3",
      "category": "Cumple de Cristina",
      "mode": "choice",
      "difficulty": "Media",
      "prompt": "¿En qué equipo juega Cristina actualmente al voleibol?",
      "options": [
        "Fuenlabrada",
        "Cubas",
        "Valdemoro",
        "Carpe Diem"
      ],
      "correct": 1,
      "seconds": 25
    }
  ],
  "updated": 1795737600000
};
const entries=[{id:"6d656d657332303236313131",title:"Memes e Internet",description:"Memes clásicos, cultura de Internet y tendencias de 2026.",art:"memes",questions},...themes,cristinaPack];
const keys={'6d656d657332303236313131':'memes','706f6b656d6f6e3030303031':'pokemon','646967696d6f6e3030303031':'digimon','766f6c6579626f6c30303031':'volley','656c656374726f6e69636131':'electro','6368616d70696f6e73303031':'champions'};
const catalog=new Map(entries.map(({questions,...meta})=>{const added=packExpansion[keys[meta.id]]||[],seen=new Set(questions.map(q=>q.prompt));questions=[...questions,...added.filter(q=>!seen.has(q.prompt))];return [meta.id,{meta:{...meta,visibility:'public',count:questions.length,updated:meta.updated??Date.UTC(2026,10,27),owned:false,builtin:true},questions}];}));
export const officialPacks=[...catalog.values()].map(x=>x.meta);
export const memePack=officialPacks[0];
export const builtinPack=id=>{const entry=catalog.get(id);return entry?{...entry.meta,questions:entry.questions}:null;};
