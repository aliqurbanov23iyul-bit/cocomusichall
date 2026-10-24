import readline from 'node:readline';
import {database} from '../lib/db.js';
import {hashPassword} from '../lib/security.js';
if(!process.stdin.isTTY)throw Error('Parol üçün interaktiv lokal terminal tələb olunur.');
const rl=readline.createInterface({input:process.stdin,output:process.stdout});
const ask=q=>new Promise(r=>rl.question(q,r));
const username=(await ask('Admin istifadəçi adı: ')).trim();
rl.close();
async function secret(prompt){process.stdout.write(prompt);process.stdin.setRawMode(true);process.stdin.resume();return new Promise(resolve=>{let value='';const listener=b=>{for(const c of b.toString()){if(c==='\u0003')process.exit(1);if(c==='\r'||c==='\n'){process.stdin.off('data',listener);process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n');resolve(value);return;}if(c==='\u007f'||c==='\b')value=value.slice(0,-1);else value+=c;}};process.stdin.on('data',listener);});}
const password=await secret('Yeni parol (gizli, minimum 14 simvol): ');const confirmation=await secret('Parolu təkrar edin: ');
if(!username||username.length>160||password.length<14||password.length>1024||password!==confirmation)throw Error('Ad və parol tələblərə uyğun deyil və ya parollar eyni deyil.');
const pool=database(),client=await pool.connect();try{await client.query('BEGIN');const result=await client.query('INSERT INTO admins(username,password_hash) VALUES($1,$2) ON CONFLICT(username) DO UPDATE SET password_hash=EXCLUDED.password_hash RETURNING id',[username,await hashPassword(password)]);await client.query('DELETE FROM sessions WHERE admin_id=$1',[result.rows[0].id]);await client.query('COMMIT');console.log('Admin saxlanıldı; əvvəlki sessiyalar bağlandı.');}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();await pool.end();}
