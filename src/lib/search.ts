export function normalize(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}
export interface SearchEntry { id: string; title: string; identifier?: string; text: string; path: string; url: string; type: string }
export function search(entries: SearchEntry[], query: string): SearchEntry[] {
  const normalized = normalize(query);
  if (!normalized) return entries;
  const terms = normalized.split(/\s+/);
  const compact = normalized.replaceAll(' ', '');
  const score = (entry: SearchEntry) => Number(normalize(entry.identifier ?? '').replaceAll(' ', '') === compact) * 2 + Number(normalize(entry.title) === normalized);
  return entries.filter(e => terms.every(term => normalize(e.text).includes(term)) || (e.identifier && normalize(e.identifier).replaceAll(' ', '') === compact))
    .sort((a, b) => score(b) - score(a));
}
