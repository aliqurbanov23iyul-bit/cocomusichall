import {readFile} from 'node:fs/promises';
import {database} from '../lib/db.js';
const pool=database();try{await pool.query(await readFile(new URL('../sql/001_init.sql',import.meta.url),'utf8'));console.log('Neon sxemi hazırdır.');}finally{await pool.end();}
