import entityData from '../../data/entities.json';
import resourceData from '../../data/resources.json';
import { validateData, type Entity } from './schema';
export const { entities, resources } = validateData(entityData, resourceData);
export const labels: Record<Entity['type'], string> = {tradition:'Truyền thống',canon:'Kinh điển',pitaka:'Tạng',collection:'Bộ kinh',text:'Văn bản',section:'Phẩm / Phần',concept:'Khái niệm',person:'Nhân vật',place:'Địa điểm'};
export const segments: Record<Entity['type'], string> = {tradition:'traditions',canon:'canons',pitaka:'pitakas',collection:'collections',text:'texts',section:'sections',concept:'concepts',person:'people',place:'places'};
export const entityById = new Map(entities.map(e => [e.id,e]));
export const href = (e: Entity) => `/${segments[e.type]}/${e.id}/`;
export const children = (id: string | null) => entities.filter(e => e.parent === id);
export function ancestors(e: Entity): Entity[] {
  return e.parent ? [...ancestors(entityById.get(e.parent)!), entityById.get(e.parent)!] : [];
}
export const searchEntries = entities.map(e => ({id:e.id,title:e.title,identifier:e.identifier,type:labels[e.type],url:href(e),path:ancestors(e).map(p=>p.title).join(' → '),text:[e.title,e.identifier,...Object.values(e.titles),...e.aliases,...e.tags].filter(Boolean).join(' ')}));
