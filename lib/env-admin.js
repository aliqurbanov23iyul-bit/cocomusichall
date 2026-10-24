import {hashPassword,verifyPassword} from './security.js';

let cachedSecret, cachedHash;
function configuration(){
  const password=process.env.ADMIN_PASSWORD;
  if(password===undefined)return null;
  if(password.length<8||password.length>1024)throw Object.assign(new Error('ADMIN_PASSWORD minimum 8, maksimum 1024 simvol olmalıdır.'),{status:503});
  if(password!==cachedSecret){cachedSecret=password;cachedHash=hashPassword(password);}
  return {password,hash:cachedHash};
}

// Environment mode deliberately disables other database accounts.
export async function environmentLogin(db,username,password){
  const config=configuration();
  if(!config)return undefined;
  const valid=await verifyPassword(password,await config.hash);
  if(username!=='admin'||!valid)return null;
  let user=(await db('SELECT * FROM admins WHERE username=$1',['admin'])).rows[0];
  if(!user||!await verifyPassword(config.password,user.password_hash)){
    user=(await db('INSERT INTO admins(username,password_hash) VALUES($1,$2) ON CONFLICT(username) DO UPDATE SET password_hash=EXCLUDED.password_hash RETURNING *',['admin',await config.hash])).rows[0];
    await db('DELETE FROM sessions WHERE admin_id=$1',[user.id]);
  }
  return user;
}

export async function environmentSessionValid(db,session){
  const config=configuration();
  if(!config)return true;
  const user=(await db('SELECT * FROM admins WHERE username=$1',['admin'])).rows[0];
  return !!user&&String(user.id)===String(session.admin_id)&&await verifyPassword(config.password,user.password_hash);
}
