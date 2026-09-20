export function normalize(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}
export interface SearchEntry { id: string; title: string; identifier?: string; text: string; path: string; url: string; type: string }
export function search(entries: SearchEntry[], query: string): SearchEntry[] {
  const normalized = normalize(query);
  if (!normalized) return entries;
  const terms = normalized.split(/\s+/);
  const compact = normalized.replaceAll(' ', '');
  return entries.filter(e => terms.every(term => normalize(e.text).includes(term)) || (e.identifier && normalize(e.identifier).replaceAll(' ', '') === compact))
    .sort((a, b) => Number(normalize(b.identifier ?? '').replaceAll(' ', '') === compact) - Number(normalize(a.identifier ?? '').replaceAll(' ', '') === compact));
}
