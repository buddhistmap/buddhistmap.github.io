import { z } from 'zod';

const id = z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
const nonempty = z.string().trim().min(1);
const url = z.url().refine(value => ['http:', 'https:'].includes(new URL(value).protocol), 'Expected HTTP(S) URL');
export const ResourceSchema = z.object({
  id, type: z.enum(['read', 'listen', 'video', 'translation', 'original', 'reference']),
  language: nonempty, title: nonempty, provider: nonempty, url, description: nonempty.optional(),
}).strict();
export const EntitySchema = z.object({
  id, type: z.enum(['tradition', 'canon', 'pitaka', 'collection', 'text', 'section', 'concept', 'person', 'place']),
  title: nonempty, titles: z.record(nonempty, nonempty), aliases: z.array(nonempty),
  identifier: nonempty.optional(), parent: id.nullable(), description: nonempty,
  tags: z.array(nonempty), resourceIds: z.array(id), sources: z.array(url).min(1),
  relations: z.array(z.object({type: z.enum(['related', 'parallel', 'commentary', 'translation', 'references']), target: id, note: nonempty})),
}).strict();
export type Entity = z.infer<typeof EntitySchema>;
export type Resource = z.infer<typeof ResourceSchema>;

export function validateData(rawEntities: unknown, rawResources: unknown) {
  const entities = z.array(EntitySchema).parse(rawEntities);
  const resources = z.array(ResourceSchema).parse(rawResources);
  const byId = new Map(entities.map(entity => [entity.id, entity]));
  const resourceIds = new Set(resources.map(resource => resource.id));
  if (byId.size !== entities.length) throw new Error('Duplicate entity ID');
  if (resourceIds.size !== resources.length) throw new Error('Duplicate resource ID');
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
  return { entities, resources };
}
