import {writeFile,mkdir} from 'node:fs/promises';
const assets={restaurant:'1517248135467-4c7edcad34c4',pasta:'1473093295043-cdd812d0e601',pizza:'1513104890138-7c749659a591',salad:'1512621776951-a57141f2eefd',platter:'1600891964599-f61ba0e24092',dessert:'1578985545062-69928b1d9587',drinks:'1544145945-f90425340c7e',stage:'1506157786151-b8491531f063'};
await mkdir('public/assets',{recursive:true});
await Promise.all(Object.entries(assets).map(async([name,id])=>{const url=`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${name==='restaurant'?1600:1000}&q=85&fm=jpg`;const response=await fetch(url);if(!response.ok)throw Error(`${name}: ${response.status}`);await writeFile(`public/assets/${name}.jpg`,Buffer.from(await response.arrayBuffer()));console.log(`${name}: downloaded`);}));
await writeFile('public/assets/SOURCES.md','# Foto mənbələri\n\nUnsplash-dan illüstrativ stok fotolar. Bunlar COCO-nun real məkanı, yeməkləri və ya tədbiri kimi təqdim edilmir. Real fotolar təqdim ediləndə dəyişdirilməlidir.\n\nLisenziya: https://unsplash.com/license\n\n'+Object.entries(assets).map(([name,id])=>`- ${name}.jpg: https://images.unsplash.com/photo-${id}`).join('\n'));



