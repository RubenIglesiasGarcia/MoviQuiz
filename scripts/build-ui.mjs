import { build } from 'esbuild';
await build({entryPoints:['src/ui.js'],bundle:true,minify:true,format:'esm',outdir:'public/generated',assetNames:'fonts/[name]-[hash]',loader:{'.woff2':'file','.woff':'file'},target:['es2020'],logLevel:'info'});
