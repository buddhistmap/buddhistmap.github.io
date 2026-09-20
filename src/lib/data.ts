import entityData from '../../data/entities.json';
import resourceData from '../../data/resources.json';
import translatorData from '../../data/translators.json';
import { validateData, type Entity } from './schema';
export const { entities, resources, translators } = validateData(entityData, resourceData, translatorData);
export const labels: Record<Entity['type'], string> = {tradition:'Truyền thống',canon:'Kinh điển',pitaka:'Tạng',collection:'Bộ kinh',text:'Văn bản',section:'Phẩm / Phần',concept:'Khái niệm',person:'Nhân vật',place:'Địa điểm'};
export const segments: Record<Entity['type'], string> = {tradition:'traditions',canon:'canons',pitaka:'pitakas',collection:'collections',text:'texts',section:'sections',concept:'concepts',person:'people',place:'places'};
export const entityById = new Map(entities.map(e => [e.id,e]));
export const href = (e: Entity) => `/${segments[e.type]}/${e.id}/`;
export const children = (id: string | null) => entities.filter(e => e.parent === id);
export function ancestors(e: Entity): Entity[] {
  return e.parent ? [...ancestors(entityById.get(e.parent)!), entityById.get(e.parent)!] : [];
}
export const translatorHref = (id: string) => `/translators/${id}/`;
export const mapHref = (id: string) => `/map/#node-${id}`;
export const creditsFor = (id: string) => translators.flatMap(translator => translator.works.filter(work => work.entityId === id).map(work => ({translator,work})));
export function translatorVisibleIds(id: string): string[] {
  const translator = translators.find(t => t.id === id);
  if (!translator) return [];
  const works = new Set(translator.works.map(w => w.entityId));
  const matching = entities.filter(e => works.has(e.id) || ancestors(e).some(a => works.has(a.id)));
  return [...new Set(matching.flatMap(e => [e.id, ...ancestors(e).map(a => a.id)]))];
}
export const searchEntries = [
  ...entities.map(e => ({id:e.id,title:e.title,identifier:e.identifier,type:labels[e.type],url:href(e),path:ancestors(e).map(p=>p.title).join(' → '),text:[e.title,e.identifier,...Object.values(e.titles),...e.aliases,...e.tags,...creditsFor(e.id).map(c=>c.translator.name)].filter(Boolean).join(' ')})),
  ...translators.map(t => ({id:t.id,title:t.name,identifier:undefined,type:'Dịch giả',url:translatorHref(t.id),path:`Dịch giả → ${t.region}`,text:[t.name,t.originalName,...t.aliases].join(' ')})),
];
