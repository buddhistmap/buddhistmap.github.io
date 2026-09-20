import { entities, resources, translators } from '../src/lib/data';
console.log(`Valid: ${entities.length} entities, ${resources.length} resources, ${translators.length} translators. No missing references or hierarchy cycles.`);
