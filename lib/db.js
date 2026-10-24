import pg from 'pg';
// PostgreSQL DATE is a calendar date, not an instant in the server timezone.
pg.types.setTypeParser(1082,value=>value);
let pool;
export function database(){if(!process.env.DATABASE_URL) throw Object.assign(new Error('Neon bağlantısı qurulmayıb. DATABASE_URL təyin edin və migrasiyanı başladın.'),{status:503}); return pool ||= new pg.Pool({connectionString:process.env.DATABASE_URL,max:3,connectionTimeoutMillis:8000});}
export const query=(sql,params=[])=>database().query(sql,params);
