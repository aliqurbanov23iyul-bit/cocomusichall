import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('public/assets/fonts',{recursive:true});
for(const [url,file]of [['https://raw.githubusercontent.com/google/fonts/main/ofl/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf','jakarta.ttf'],['https://raw.githubusercontent.com/google/fonts/main/ofl/plusjakartasans/OFL.txt','OFL.txt']]){const response=await fetch(url);if(!response.ok)throw Error(`Font download: ${response.status}`);await writeFile('public/assets/fonts/'+file,Buffer.from(await response.arrayBuffer()));console.log(file+' hazırdır');}
