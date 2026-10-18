import { mkdir, writeFile } from 'node:fs/promises';
const directory=new URL('../assets/fonts/',import.meta.url);
await mkdir(directory,{recursive:true});
const response=await fetch('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&family=Bodoni+Moda:wght@400..900&display=swap',{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}});
if(!response.ok) throw new Error(`Font CSS ${response.status}`);
const css=await response.text();
await writeFile(new URL('google-fonts-source.css',directory),css);
const blocks=[...css.matchAll(/(?:\/\*\s*([^*]+?)\s*\*\/\s*)?@font-face\s*\{([^}]+)\}/g)];
for(const [filename,family,subset] of [['thai.woff2','Noto Sans Thai','thai'],['latin.woff2','Noto Sans Thai','latin'],['display.woff2','Bodoni Moda','latin']]){
  const block=blocks.find(match=>match[2].includes(`'${family}'`)&&match[1]?.trim()===subset);
  if(!block) throw new Error(`Missing ${family}/${subset}`);
  const url=block[2].match(/url\(([^)]+)\)/)[1];
  const font=await fetch(url);if(!font.ok)throw new Error(`Font ${font.status}`);
  await writeFile(new URL(filename,directory),new Uint8Array(await font.arrayBuffer()));
  console.log(`Saved ${filename}`);
}
for(const [filename,url] of [['OFL-NotoSansThai.txt','https://raw.githubusercontent.com/google/fonts/main/ofl/notosansthai/OFL.txt'],['OFL-BodoniModa.txt','https://raw.githubusercontent.com/google/fonts/main/ofl/bodonimoda/OFL.txt']]){
  const license=await fetch(url);if(!license.ok)throw new Error(`License ${license.status}`);await writeFile(new URL(filename,directory),await license.text());
}
