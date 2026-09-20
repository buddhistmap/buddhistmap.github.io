import test from 'node:test';
import assert from 'node:assert/strict';
import entityData from '../data/entities.json';
import resourceData from '../data/resources.json';
import { validateData } from '../src/lib/schema';
import { search } from '../src/lib/search';
import { searchEntries } from '../src/lib/data';
test('seed data is valid',()=>assert.doesNotThrow(()=>validateData(entityData,resourceData)));
for(const [name,mutate] of [
 ['duplicate IDs',(e:any[])=>e.push(structuredClone(e[0]))],
 ['missing parent',(e:any[])=>e[1].parent='missing'],
 ['hierarchy cycle',(e:any[])=>e.find(x=>x.id==='pali-canon').parent='sutta-pitaka'],
 ['missing relationship',(e:any[])=>e[0].relations=[{type:'related',target:'missing',note:'Test'}]],
 ['missing resource',(e:any[])=>e[0].resourceIds=['missing']],
 ['invalid ID',(e:any[])=>e[0].id='../bad'],
 ['missing title',(e:any[])=>delete e[0].title],
] as const){test(`rejects ${name}`,()=>{const copy=structuredClone(entityData);mutate(copy);assert.throws(()=>validateData(copy,resourceData))})}
test('rejects unsafe source URLs',()=>{const copy=structuredClone(resourceData);copy[0].url='javascript:alert(1)';assert.throws(()=>validateData(entityData,copy))});
for(const [query,id] of [['DN1','dn-01'],['Phạm Võng','dn-01'],['pham vong','dn-01'],['Brahmajala','dn-01'],['Satipatthana','mn-010'],['MN 10','mn-010'],['Heart Sutra','t-0251'],['chuyen phap luan','sn-56-11'],['Dhp','dhammapada'],['Pháp Cú','dhammapada'],['Dhammapada','dhammapada'],['Pháp Tụ','dhammasangani'],['Đại phẩm','mahavagga']]){test(`finds ${query}`,()=>assert.ok(search(searchEntries,query).some(e=>e.id===id)))}
test('exact identifier is ranked first',()=>assert.equal(search(searchEntries,'DN1')[0].id,'dn-01'));
test('exact Dhp identifier is ranked first',()=>assert.equal(search(searchEntries,'Dhp')[0].id,'dhammapada'));
test('unknown query returns no matches',()=>assert.equal(search(searchEntries,'nonexistent-xyz').length,0));
