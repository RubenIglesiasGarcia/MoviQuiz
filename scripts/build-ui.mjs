import { build } from 'esbuild';
await build({entryPoints:['src/ui.js','src/character3d.js','src/room-qr.js'],bundle:true,minify:true,format:'esm',outdir:'public/generated',assetNames:'fonts/[name]-[hash]',loader:{'.woff2':'file','.woff':'file'},target:['es2020'],logLevel:'info'});

// Some build environments install optional native dependencies differently (Bun vs npm).
// Keep the PWA installable even when the native image converter cannot load.
import {writeFile} from 'node:fs/promises';
import {iconPng} from '../icons.js';
try{
 const {default:sharp}=await import('sharp');
 await Promise.all([180,192,512].map(n=>sharp('public/icons/mobiquiz-v2.webp').resize(n,n).png().toFile('public/icons/v2-'+n+'.png')));
 console.log('PWA icons generated from the original logo.');
}catch(error){
 console.warn('Native image conversion unavailable; using bundled PNG icon fallback:',error.message);
 await Promise.all([180,192,512].map(n=>writeFile('public/icons/v2-'+n+'.png',iconPng(n))));
}
console.log('UI build complete.');

// Use actual Lucide SVGs, not approximations or remote icon requests.
import {readFile} from 'node:fs/promises';
const uiIcons=["users-round","log-in","trophy","layers","arrow-up-right","download","brain","mic","gamepad-2","settings","chart-no-axes-column","smile","ellipsis","thumbs-up","thumbs-down","star","volume-2","volume-x","maximize","x","check","plus","shuffle","sparkles","orbit","joystick","share-2","arrow-left","pencil","trash-2","copy","flag","play","check-circle","user-round","sliders-horizontal","tree-palm"];
const iconSymbols=await Promise.all(uiIcons.map(async name=>{const source=await readFile('node_modules/lucide-static/icons/'+name+'.svg','utf8');const inner=source.slice(source.indexOf('>',source.indexOf('<svg'))+1,source.lastIndexOf('</svg>'));return '<symbol id="'+name+'" viewBox="0 0 24 24">'+inner+'</symbol>';}));
await writeFile('public/generated/icons.svg','<svg xmlns="http://www.w3.org/2000/svg">'+iconSymbols.join('')+'</svg>');
