export const packSortOptions=[['rating','Mejor valoración'],['likes','Más me gusta'],['votes','Más valorados'],['newest','Más recientes'],['oldest','Más antiguos'],['questions','Más preguntas'],['title','Nombre A–Z']];
export const validVote=v=>v===-1||v===0||v===1;
export function packRating(row={}){const likes=Math.max(0,Number(row.likes)||0),dislikes=Math.max(0,Number(row.dislikes)||0),votes=likes+dislikes;return {likes,dislikes,votes,approval:votes?Math.round(100*likes/votes):null,myVote:row.myVote===1||row.myVote===-1?row.myVote:0};}
export function ratingScore(p){const {likes,votes}=p.rating||packRating();return (likes+2)/(votes+4);}
const normalize=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function filterPacks(packs,query='',sort='rating',favorites=new Set()){
 const terms=normalize(query).trim().split(/\s+/).filter(Boolean);
 const value=p=>p.rating||packRating();
 const compare=(a,b)=>{switch(sort){
 case 'rating':return ratingScore(b)-ratingScore(a)||value(b).votes-value(a).votes;
 case 'likes':return value(b).likes-value(a).likes||ratingScore(b)-ratingScore(a);
 case 'votes':return value(b).votes-value(a).votes||ratingScore(b)-ratingScore(a);
 case 'newest':return (b.updated||0)-(a.updated||0);
 case 'oldest':return (a.updated||0)-(b.updated||0);
 case 'questions':return (b.count||0)-(a.count||0);
 case 'title':return String(a.title).localeCompare(String(b.title),'es',{sensitivity:'base'});
 default:return Number(favorites.has(b.id))-Number(favorites.has(a.id));
 }};
 return packs.filter(p=>{const hay=normalize([p.title,p.description,p.author,p.id].join(' '));return terms.every(term=>hay.includes(term));}).sort((a,b)=>compare(a,b)||(b.updated||0)-(a.updated||0)||String(a.id).localeCompare(String(b.id)));
}
