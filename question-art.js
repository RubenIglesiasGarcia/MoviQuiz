// Decorative artwork is deliberately separate from answer-bearing media and scoring.
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export const artworkKeys=["general","geo","space","science","nature","history","film","music","sport","food","gaming","arts","literature","maths","memes"];
export function questionArtwork(q){
 if(q.media)return undefined;
 const c=normalize(q.category),p=normalize(q.prompt);
 const key=/meme|internet/.test(c)?'memes':/deporte/.test(c)?'sport':/cine|television|\btv\b/.test(c)?'film':/musica|sonido/.test(c)?'music':/videojuego/.test(c)?'gaming':/gastronomia/.test(c)?'food':/historia/.test(c)?'history':/literatura/.test(c)?'literature':/arte/.test(c)?'arts':/naturaleza/.test(c)?'nature':/geografia/.test(c)?'geo':/planeta|sistema solar|galaxia|astronom|universo|satelite/.test(p)?'space':/ciencia|tecnologia/.test(c)?'science':/numero|minuto|hora|centimetro|metro|lado|triangulo|calcula/.test(p)?'maths':'general';
 return '/question-art/'+key+'.svg';
}
export const illustrate=q=>q.media||q.illustration?q:{...q,illustration:questionArtwork(q)};
export function validArtwork(url){return typeof url==='string'&&artworkKeys.some(k=>url==='/question-art/'+k+'.svg');}
