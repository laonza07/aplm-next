import './catalog.mjs';
import { cp, mkdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await mkdir(new URL('dist/',root),{recursive:true});
for (const entry of ['index.html','tour-demo.html','styles.css','app.js','theme.js','assets','data']) await cp(new URL(entry,root),new URL(`dist/${entry}`,root),{recursive:true});
console.log('Built dist/ — ready for static hosting.');
