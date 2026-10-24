import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import handler from './api/index.js';
const root=path.resolve('public');
http.createServer(async(req,res)=>{if(req.url.startsWith('/api/'))return handler(req,res);try{const url=new URL(req.url,'http://localhost');const file=url.pathname==='/admin'?'/admin.html':url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname);const target=path.resolve(root,'.'+file);if(!target.startsWith(root+path.sep))throw Error();const data=await readFile(target);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf'})[path.extname(target)]||'application/octet-stream');res.setHeader('X-Content-Type-Options','nosniff');res.end(data);}catch{res.statusCode=404;res.end('Tapılmadı');}}).listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('Local: http://localhost:'+(process.env.PORT||3000)));


