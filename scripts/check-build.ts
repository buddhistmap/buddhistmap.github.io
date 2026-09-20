import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
function files(dir:string):string[]{return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)])}
const pages=files('dist').filter(file=>file.endsWith('.html'));
let checked=0;
for(const page of pages){
  const html=readFileSync(page,'utf8');
  for(const match of html.matchAll(/(?:href|src)="(\/[^\"]*)"/g)){
    const path=decodeURIComponent(match[1].split(/[?#]/)[0]);
    const target=join('dist',path.endsWith('/')?path+'index.html':path);
    if(!existsSync(target))throw new Error(`Broken internal link in ${page}: ${path}`);
    const fragment=match[1].split('#')[1];
    if(fragment && target.endsWith('.html')){
      const id=decodeURIComponent(fragment);
      if(!readFileSync(target,'utf8').includes(`id="${id}"`))throw new Error(`Missing anchor in ${page}: ${match[1]}`);
    }
    checked++;
  }
}
console.log(`Verified ${checked} internal links/assets across ${pages.length} HTML pages.`);
