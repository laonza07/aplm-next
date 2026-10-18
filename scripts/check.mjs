import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const root = new URL('../',import.meta.url);
const html = await readFile(new URL('index.html',root),'utf8');
const context={window:{}};
vm.runInNewContext(await readFile(new URL('data/catalog.js',root),'utf8'),context);
const {links,menus,news}=context.window.APLM_CATALOG;
const original=JSON.parse(await readFile(new URL('data/oass-links.json',root),'utf8'));
assert.equal(links.length,191);
assert.equal(new Set(links.map(item=>item.id)).size,191);
for(const link of links){const source=original.find(item=>item.id===link.id);assert.equal(link.url,source.url,`Changed source URL #${link.id}`);assert.ok(['http:','https:'].includes(new URL(link.url).protocol));}
for(const menu of menus) for(const column of menu.columns) for(const id of column.ids) assert.ok(links.some(link=>link.id===id),`Unknown menu link ${id}`);
for(const item of news) assert.ok(links.some(link=>link.id===item.id));
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const value=match[1];if(!/^(?:https?:|tel:|mailto:|\.\/)/.test(value)) await access(new URL(value,root));}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate HTML IDs');
assert.equal((html.match(/https:\/\/app\.sskru\.ac\.th\/admission\/register/g)||[]).length,3);
new vm.Script(await readFile(new URL('app.js',root),'utf8'));
console.log('PASS: all 191 source URLs preserved; navigation/news IDs, admission CTAs, local assets, HTML IDs and JavaScript syntax checked.');
