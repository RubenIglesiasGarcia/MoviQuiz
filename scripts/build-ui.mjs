import { build } from 'esbuild';
await build({entryPoints:['src/ui.js','src/character3d.js'],bundle:true,minify:true,format:'esm',outdir:'public/generated',assetNames:'fonts/[name]-[hash]',loader:{'.woff2':'file','.woff':'file'},target:['es2020'],logLevel:'info'});

import sharp from 'sharp';
await Promise.all([180,192,512].map(n=>sharp('public/icons/mobiquiz-v2.webp').resize(n,n).png().toFile('public/icons/v2-'+n+'.png')));
