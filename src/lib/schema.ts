import { z } from 'zod';

const id = z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
const nonempty = z.string().trim().min(1);
const url = z.url().refine(value => ['http:', 'https:'].includes(new URL(value).protocol), 'Expected HTTP(S) URL');
export const ResourceSchema = z.object({
  id, type: z.enum(['read', 'listen', 'video', 'translation', 'original', 'reference']),
  language: nonempty, title: nonempty, provider: nonempty, url, description: nonempty.optional(),
  audio: z.object({
    format: z.enum(['video', 'playlist']),
    kind: z.enum(['reading', 'chanting']),
    checkedAt: z.iso.date(),
    evidenceUrl: url,
    coverage: nonempty,
    catalogStatus: z.enum(['all-listed', 'partial', 'single']),
    listedCount: z.number().int().positive().optional(),
    parts: z.array(z.object({title: nonempty, url}).strict()).optional(),
  }).strict().optional(),
}).strict();
export const EntitySchema = z.object({
  id, type: z.enum(['tradition', 'canon', 'pitaka', 'collection', 'text', 'section', 'concept', 'person', 'place']),
  title: nonempty, titles: z.record(nonempty, nonempty), aliases: z.array(nonempty),
  identifier: nonempty.optional(), parent: id.nullable(), description: nonempty,
  volumes: z.number().int().positive().optional(),
  tags: z.array(nonempty), resourceIds: z.array(id), sources: z.array(url).min(1),
  relations: z.array(z.object({type: z.enum(['related', 'parallel', 'commentary', 'translation', 'references']), target: id, note: nonempty})),
}).strict();
export type Entity = z.infer<typeof EntitySchema>;
export type Resource = z.infer<typeof ResourceSchema>;

export const TranslatorSchema = z.object({
  id, name: nonempty, originalName: nonempty, aliases: z.array(nonempty),
  region: z.enum(['Việt Nam', 'Hán truyền']), period: nonempty,
  description: nonempty, historicalSummary: nonempty.optional(), scopeNote: nonempty,
  sources: z.array(url).min(1),
  works: z.array(z.object({
    entityId: id, role: z.enum(['translation', 'authorship']), group: nonempty,
    language: nonempty, sources: z.array(url).min(1), note: nonempty.optional(),
  }).strict()).min(1),
}).strict();
export type Translator = z.infer<typeof TranslatorSchema>;

export function validateData(rawEntities: unknown, rawResources: unknown, rawTranslators: unknown = []) {
  const entities = z.array(EntitySchema).parse(rawEntities);
  const resources = z.array(ResourceSchema).parse(rawResources);
  const byId = new Map(entities.map(entity => [entity.id, entity]));
  const resourceIds = new Set(resources.map(resource => resource.id));
  const translators = z.array(TranslatorSchema).parse(rawTranslators);
  if (new Set(translators.map(t => t.id)).size !== translators.length) throw new Error('Duplicate translator ID');
  for (const translator of translators) {
    const credits = new Set<string>();
    for (const work of translator.works) {
      const entity = byId.get(work.entityId);
      if (!entity) throw new Error(`Missing translated work: ${work.entityId}`);
      if (!['text', 'collection', 'section'].includes(entity.type)) throw new Error(`Invalid translated work type: ${work.entityId}`);
      const key = `${work.entityId}:${work.role}:${work.language}`;
      if (credits.has(key)) throw new Error(`Duplicate work credit: ${translator.id}/${key}`);
      credits.add(key);
    }
  }
  if (byId.size !== entities.length) throw new Error('Duplicate entity ID');
  if (resourceIds.size !== resources.length) throw new Error('Duplicate resource ID');
  for (const resource of resources) {
    const audio = resource.audio;
    if (!audio) continue;
    if (resource.type !== 'listen') throw new Error(`Audio metadata requires listen resource: ${resource.id}`);
    const source = new URL(resource.url);
    const youtubeUrl = (value: string) => {
      const link = new URL(value);
      return link.protocol === 'https:' && link.hostname === 'www.youtube.com' &&
        ((link.pathname === '/watch' && /^[\w-]{11}$/.test(link.searchParams.get('v') || '')) ||
         (link.pathname === '/playlist' && /^PL[\w-]+$/.test(link.searchParams.get('list') || '')));
    };
    if (!youtubeUrl(resource.url) || (audio.format === 'playlist') !== (source.pathname === '/playlist')) throw new Error(`Invalid YouTube audio URL: ${resource.id}`);
    const parts = audio.parts || [];
    const videos = new Set<string>();
    for (const part of parts) {
      const link = new URL(part.url);
      const video = link.searchParams.get('v');
      if (!youtubeUrl(part.url) || link.pathname !== '/watch' || videos.has(video!)) throw new Error(`Invalid or duplicate audio part: ${resource.id}`);
      if (audio.format === 'playlist' && link.searchParams.get('list') !== source.searchParams.get('list')) throw new Error(`Audio part belongs to another playlist: ${resource.id}`);
      videos.add(video!);
    }
    if (audio.catalogStatus === 'all-listed' && (!audio.listedCount || parts.length !== audio.listedCount)) throw new Error(`Incomplete playlist catalog: ${resource.id}`);
  }
  for (const entity of entities) {
    if (entity.type === 'text' && !entity.identifier) throw new Error(`Missing text identifier: ${entity.id}`);
    if (entity.type === 'tradition' && entity.parent) throw new Error(`Tradition must be a root: ${entity.id}`);
    for (const resource of entity.resourceIds) if (!resourceIds.has(resource)) throw new Error(`Missing resource: ${resource}`);
    for (const relation of entity.relations) {
      if (!byId.has(relation.target)) throw new Error(`Missing relationship: ${relation.target}`);
      if (relation.target === entity.id) throw new Error(`Self relationship: ${entity.id}`);
    }
    const seen = new Set<string>([entity.id]);
    let parent = entity.parent;
    while (parent) {
      if (seen.has(parent)) throw new Error(`Hierarchy cycle: ${entity.id}`);
      seen.add(parent);
      const ancestor = byId.get(parent);
      if (!ancestor) throw new Error(`Missing parent: ${parent}`);
      parent = ancestor.parent;
    }
  }
  return { entities, resources, translators };
}
