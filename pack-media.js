// Small original media assets; opaque, unguessable links allow TV and players
// without the author's session to access the selected clue.
export const MAX_PACK_ASSET=1024*1024;
export const assetId=url=>typeof url==='string'&&/^\/api\/pack-media\/[a-f0-9]{32}$/.test(url)?url.split('/').pop():null;
const types={'image/jpeg':'image','image/png':'image','image/webp':'image','audio/mpeg':'audio','audio/wav':'audio','audio/ogg':'audio','audio/mp4':'audio','video/mp4':'video','video/webm':'video'};
export function safeMediaUrl(value){const url=String(value||'').trim();if(assetId(url))return url;if(url.length>1500)throw Error('Enlace multimedia demasiado largo.');try{const u=new URL(url);if(u.protocol==='https:'&&!u.username&&!u.password)return u.href;}catch{}throw Error('Utiliza un enlace directo HTTPS o sube un archivo.');}
export function normalizePackMedia(value){if(value==null)return undefined;if(!['image','audio','video'].includes(value.type))throw Error('Selecciona imagen, audio o vídeo.');return {type:value.type,url:safeMediaUrl(value.url)};}
export function decodePackAsset(data){
 const mime=String(data?.mime||'').toLowerCase(),encoded=data?.base64;
 if(!types[mime]||typeof encoded!=='string'||encoded.length>Math.ceil(MAX_PACK_ASSET/3)*4||!(/^[A-Za-z0-9+/]+={0,2}$/).test(encoded))throw Error('Archivo no admitido o superior a 1 MB.');
 let bytes;try{bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));}catch{throw Error('Archivo no válido.');}
 if(bytes.length<12||bytes.length>MAX_PACK_ASSET)throw Error('Archivo no válido o superior a 1 MB.');
 const ascii=(i,n)=>String.fromCharCode(...bytes.slice(i,i+n));
 const signature=mime==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:mime==='image/png'?bytes[0]===137&&ascii(1,3)==='PNG':mime==='image/webp'?ascii(0,4)==='RIFF'&&ascii(8,4)==='WEBP':mime==='audio/wav'?ascii(0,4)==='RIFF'&&ascii(8,4)==='WAVE':mime==='audio/ogg'?ascii(0,4)==='OggS':mime==='audio/mpeg'?ascii(0,3)==='ID3'||bytes[0]===255&&(bytes[1]&224)===224:mime==='video/webm'?bytes[0]===26&&bytes[1]===69&&bytes[2]===223&&bytes[3]===163:ascii(4,4)==='ftyp';
 if(!signature)throw Error('El contenido no coincide con el formato seleccionado.');
 return {mime,kind:types[mime],bytes,encoded};
}
export const ASSET_SCHEMA='CREATE TABLE IF NOT EXISTS question_pack_assets (id TEXT PRIMARY KEY,owner TEXT NOT NULL,mime TEXT NOT NULL,kind TEXT NOT NULL,base64 TEXT NOT NULL,size INTEGER NOT NULL,created INTEGER NOT NULL)';
export async function uploadPackAsset(env,u,data){
 if(!u)return Response.json({error:'Identifícate primero.'},{status:401});
 let a;try{a=decodePackAsset(data);}catch(e){return Response.json({error:e.message},{status:400});}
 const db=env.DB;await db.prepare(ASSET_SCHEMA).run();
 const total=await db.prepare('SELECT COALESCE(SUM(size),0) AS bytes,COUNT(*) AS n FROM question_pack_assets WHERE owner=?').bind(u.id).first();
 if(Number(total.bytes)+a.bytes.length>20*1024*1024||Number(total.n)>=200)return Response.json({error:'Has alcanzado el límite de archivos de tus packs (20 MB o 200 archivos). Utiliza enlaces directos para contenido adicional.'},{status:400});
 const id=Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');
 await db.prepare('INSERT INTO question_pack_assets(id,owner,mime,kind,base64,size,created) VALUES(?,?,?,?,?,?,?)').bind(id,u.id,a.mime,a.kind,a.encoded,a.bytes.length,Date.now()).run();
 return Response.json({url:'/api/pack-media/'+id,type:a.kind},{headers:{'Cache-Control':'no-store'}});
}
export async function verifyPackAssets(db,u,pack){
 const refs=new Map();if(assetId(pack.cover))refs.set(assetId(pack.cover),'image');for(const q of pack.questions){const id=assetId(q.media?.url);if(id){if(refs.has(id)&&refs.get(id)!==q.media.type)throw Error('El tipo de archivo no coincide.');refs.set(id,q.media.type);}}
 for(const [id,kind] of refs){const row=await db.prepare('SELECT owner,kind FROM question_pack_assets WHERE id=?').bind(id).first();if(row?.owner!==u.id||row.kind!==kind)throw Error('Archivo multimedia no disponible o de otro usuario.');}
}
export function assetResponse(row,range){
 if(!row||!types[row.mime])return new Response(null,{status:404});
 const bytes=Uint8Array.from(atob(row.base64),c=>c.charCodeAt(0)),n=bytes.length,headers={'Content-Type':row.mime,'Cache-Control':'private,max-age=300','Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox",'Referrer-Policy':'no-referrer'};
 if(range){const m=/^bytes=(\d*)-(\d*)$/.exec(range);let start,end;if(m&&(m[1]||m[2])){if(!m[1]){start=Math.max(0,n-Number(m[2]));end=n-1;}else{start=Number(m[1]);end=m[2]?Math.min(n-1,Number(m[2])):n-1;}if(Number.isSafeInteger(start)&&Number.isSafeInteger(end)&&start>=0&&start<=end&&start<n)return new Response(bytes.slice(start,end+1),{status:206,headers:{...headers,'Content-Range':'bytes '+start+'-'+end+'/'+n,'Content-Length':String(end-start+1)}});}return new Response(null,{status:416,headers:{...headers,'Content-Range':'bytes */'+n}});}
 return new Response(bytes,{headers:{...headers,'Content-Length':String(n)}});
}
export async function readPackAsset(env,id,range){let row;try{row=await env.DB.prepare('SELECT mime,base64 FROM question_pack_assets WHERE id=?').bind(id).first();}catch{return new Response(null,{status:404});}return assetResponse(row,range);}
