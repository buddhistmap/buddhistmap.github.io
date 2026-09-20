import { entities, href, segments } from '../lib/data';
export function GET() {
 const paths=['/','/map/','/search/','/resources/','/about/',...new Set(entities.map(e=>`/${segments[e.type]}/`)),...entities.map(href)];
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>https://buddhistmap.github.io${path}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
}
