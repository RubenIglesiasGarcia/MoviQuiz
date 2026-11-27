import {safeMediaUrl,normalizePackMedia,verifyPackAssets} from './pack-media.js';
import {builtinPack,officialPacks} from './community-packs.js';
import {validateQuestions} from './game.js';
import {difficultyIds} from './public/difficulty.js';
import {validVote,packRating} from './public/pack-ratings.js';
const voteTable="CREATE TABLE IF NOT EXISTS question_pack_votes (pack_id TEXT NOT NULL, voter TEXT NOT NULL, vote INTEGER NOT NULL CHECK(vote IN (-1,1)), PRIMARY KEY(pack_id,voter))";
const voteTotals="SELECT pack_id,SUM(CASE WHEN vote=1 THEN 1 ELSE 0 END) AS likes,SUM(CASE WHEN vote=-1 THEN 1 ELSE 0 END) AS dislikes,MAX(CASE WHEN voter=? THEN vote ELSE 0 END) AS positiveVote,MIN(CASE WHEN voter=? THEN vote ELSE 0 END) AS negativeVote FROM question_pack_votes";
const ratingFrom=row=>packRating({...row,myVote:Number(row?.positiveVote||row?.negativeVote||0)});
async function ensureVotes(db){await db.prepare(voteTable).run();}
async function ratePack(db,u,id,vote){await ensureVotes(db);const write=vote===0?db.prepare('DELETE FROM question_pack_votes WHERE pack_id=? AND voter=?').bind(id,u.id):db.prepare('INSERT INTO question_pack_votes(pack_id,voter,vote) VALUES(?,?,?) ON CONFLICT(pack_id,voter) DO UPDATE SET vote=excluded.vote').bind(id,u.id,vote);const [,totals]=await db.batch([write,db.prepare(voteTotals+' WHERE pack_id=? GROUP BY pack_id').bind(u.id,u.id,id)]);return response({rating:ratingFrom(totals.results[0])});}
export const categoryKey=c=>String(c||'General').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/^deportes?$/,'deporte').replace(/^cine( y tv)?$/,'cine').replace(/^cultura( general)?$/,'cultura').replace(/^musica( y sonido)?$/,'musica');
export const packId=id=>typeof id==='string'&&/^[a-f0-9]{24}$/.test(id);
export function validatePack(data){
 const title=String(data.title||'').trim(),description=String(data.description||'').trim(),visibility=data.visibility||'private';
 if(title.length<3||title.length>60||description.length>240||!['private','link','public'].includes(visibility))throw Error('Escribe un título de 3–60 caracteres, una descripción breve y elige visibilidad.');
 if(!Array.isArray(data.questions)||data.questions.length<3||data.questions.length>100)throw Error('Un pack debe contener entre 3 y 100 preguntas.');
 const used=new Set(),questions=data.questions.map((q,i)=>{
 if(!q||!['choice','order','number'].includes(q.mode)||!difficultyIds.includes(q.difficulty))throw Error('Pregunta '+(i+1)+': selecciona formato y dificultad.');
 if(typeof q.prompt!=='string'||q.prompt.trim().length<8||q.prompt.length>300||typeof q.category!=='string'||!q.category.trim()||q.category.length>60)throw Error('Pregunta '+(i+1)+': revisa enunciado y categoría.');
 const media=normalizePackMedia(q.media);
 const key=categoryKey(q.prompt).replace(/[^\p{L}\p{N}]/gu,'');if(used.has(key))throw Error('Pregunta repetida: '+q.prompt);used.add(key);
 if(q.mode==='choice'&&(!Array.isArray(q.options)||q.options.length!==4))throw Error('Pregunta '+(i+1)+': añade cuatro opciones.');
 if(q.mode==='order'&&(!Array.isArray(q.options)||q.options.length!==4))throw Error('Pregunta '+(i+1)+': añade cuatro elementos en el orden correcto.');
 const normalized=validateQuestions([{...q,correct:q.mode==='order'?[0,1,2,3]:q.correct,seconds:media?.type==='audio'||media?.type==='video'?40:q.mode==='order'?30:25,media}])[0];
 return {...normalized,id:'pack-'+i,estimateScale:q.mode==='number'?Math.max(.001,Number.isFinite(q.estimateScale)&&q.estimateScale>0?Math.min(q.estimateScale,1e12):Math.max(1,Math.abs(q.correct)*.1)):undefined};
 });const cover=data.cover? safeMediaUrl(data.cover):null;return {title,description,visibility,questions,cover};
}
const visible=(row,u)=>row&&(row.owner===u.id||row.visibility==='public'||row.visibility==='link');
export function unpackQuestions(raw){const v=typeof raw==='string'?JSON.parse(raw):raw;return Array.isArray(v)?{questions:v,cover:null}:{questions:v.questions||[],cover:v.cover||null};}
const meta=(row,u)=>({id:row.id,cover:row.cover??(row.questions?unpackQuestions(row.questions).cover:null),title:row.title,description:row.description,visibility:row.visibility,count:row.count,updated:row.updated,...(row.visibility==='public'&&row.author?{author:row.author}:{}),owned:row.owner===u.id});
const response=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const error=(msg,status=400)=>response({error:msg},status);
export async function packAPI(env,u,path,data={}){
 if(!u)return error('Identifícate primero.',401);
 const db=env.DB;
 if(path==='list'){await ensureVotes(db);const [mine,community,votes]=await db.batch([db.prepare("SELECT id,owner,title,description,visibility,count,updated,json_extract(questions,'$.cover') AS cover FROM question_packs WHERE owner=? ORDER BY updated DESC LIMIT 50").bind(u.id),db.prepare("SELECT p.id,p.owner,p.title,p.description,p.visibility,p.count,p.updated,json_extract(p.questions,'$.cover') AS cover,u.name AS author FROM question_packs p LEFT JOIN users u ON u.id=p.owner WHERE p.visibility='public' AND p.owner<>? AND NOT EXISTS(SELECT 1 FROM question_pack_reports WHERE pack_id=p.id AND reporter=?) ORDER BY p.updated DESC LIMIT 501").bind(u.id,u.id),db.prepare(voteTotals+' GROUP BY pack_id').bind(u.id,u.id)]);const ratings=new Map(votes.results.map(row=>[row.pack_id,ratingFrom(row)])),rated=p=>({...p,rating:ratings.get(p.id)||packRating()});return response({mine:mine.results.map(x=>rated(meta(x,u))),official:officialPacks.filter(p=>!p.author),community:[...officialPacks.map(rated),...community.results.slice(0,500).filter(x=>!builtinPack(x.id)).map(x=>rated(meta(x,u)))],truncated:community.results.length>500});}
 if(path==='save'){let pack;try{pack=validatePack(data);}catch(e){return error(e.message);}if(pack.visibility==='public'&&u.guest)return error('Publicar en la comunidad requiere una cuenta de Google.',403);try{await verifyPackAssets(db,u,pack);}catch(e){return error(e.message);}let id=data.id;if(id){if(!packId(id))return error('Código inválido.');const row=await db.prepare('SELECT owner FROM question_packs WHERE id=?').bind(id).first();if(row?.owner!==u.id)return error('No puedes modificar ese pack.',403);}else{const count=await db.prepare('SELECT COUNT(*) n FROM question_packs WHERE owner=?').bind(u.id).first();if(count.n>=50)return error('Límite de 50 packs por cuenta.');id=Array.from(crypto.getRandomValues(new Uint8Array(12)),x=>x.toString(16).padStart(2,'0')).join('');}
 const now=Date.now();await db.prepare('INSERT INTO question_packs(id,owner,title,description,visibility,questions,count,updated) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,visibility=excluded.visibility,questions=excluded.questions,count=excluded.count,updated=excluded.updated WHERE question_packs.owner=excluded.owner').bind(id,u.id,pack.title,pack.description,pack.visibility,JSON.stringify({questions:pack.questions,cover:pack.cover}),pack.questions.length,now).run();return response({pack:meta({id,owner:u.id,...pack,count:pack.questions.length,updated:now},u)});}
 if(!packId(data.id))return error('Código de pack inválido.');
 const built=builtinPack(data.id);if(path==='rate'){if(!validVote(data.vote))return error('Valoración inválida.');if(built){if(!built.author)return error('Solo se valoran packs de la comunidad.',403);return ratePack(db,u,data.id,data.vote);}const target=await db.prepare('SELECT owner,visibility FROM question_packs WHERE id=?').bind(data.id).first();if(!target||target.visibility!=='public')return error('Pack no disponible.',404);if(target.owner===u.id)return error('No puedes valorar tu propio pack.',403);return ratePack(db,u,data.id,data.vote);}
 const builtIn=built;if(builtIn){if(path==='lookup'){const {questions,...pack}=built;return response({pack});}return error('Este pack del catálogo no se puede modificar.',403);}
 const row=await db.prepare('SELECT * FROM question_packs WHERE id=?').bind(data.id).first();if(!visible(row,u))return error('Pack no disponible.',404);
 if(path==='lookup')return response({pack:meta(row,u)});
 if(path==='edit'){if(row.owner!==u.id)return error('Solo el autor puede editarlo.',403);return response({pack:{...meta(row,u),questions:unpackQuestions(row.questions).questions}});}
 if(path==='delete'){if(row.owner!==u.id)return error('Solo el autor puede eliminarlo.',403);await ensureVotes(db);await db.batch([db.prepare('DELETE FROM question_pack_votes WHERE pack_id=?').bind(row.id),db.prepare('DELETE FROM question_packs WHERE id=? AND owner=?').bind(row.id,u.id),db.prepare('DELETE FROM question_pack_reports WHERE pack_id=?').bind(row.id)]);return response({ok:true});}
 if(path==='report'){if(row.owner===u.id||row.visibility!=='public')return error('No puedes denunciar este pack.');const reason=String(data.reason||'').trim().slice(0,240);if(reason.length<3)return error('Indica el motivo.');await db.prepare('INSERT OR REPLACE INTO question_pack_reports(pack_id,reporter,reason,created) VALUES(?,?,?,?)').bind(row.id,u.id,reason,Date.now()).run();return response({ok:true});}
 return error('Acción desconocida.',404);
}
export async function loadPackSelection(env,u,selection){
 if(!selection||typeof selection!=='object'||Array.isArray(selection)||typeof selection.standard!=='boolean'||!Array.isArray(selection.packIds)||selection.packIds.length>10||selection.packIds.some(id=>!packId(id)))throw Error('Selección de packs inválida.');
 const categories=selection.categories===null?null:Array.isArray(selection.categories)&&selection.categories.length<=30&&selection.categories.every(c=>typeof c==='string'&&c.length<=60)?[...new Set(selection.categories.map(categoryKey))]:undefined;
 if(categories===undefined)throw Error('Selección de categorías inválida.');
 const ids=[...new Set(selection.packIds)],questions=[];for(const id of ids){const built=builtinPack(id);if(built){questions.push(...built.questions);continue;}const row=await env.DB.prepare('SELECT * FROM question_packs WHERE id=?').bind(id).first();if(!visible(row,u))throw Error('Algún pack ya no está disponible.');questions.push(...unpackQuestions(row.questions).questions);}
 if(!selection.standard&&!ids.length)throw Error('Activa al menos un pack o las preguntas estándar.');
 return {standard:selection.standard,categories,questions};
}
