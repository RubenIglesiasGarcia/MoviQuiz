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
