import {randomBytes,scrypt as scryptCb,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
const scrypt=promisify(scryptCb);
const scryptOptions={N:131072,r:8,p:1,maxmem:256*1024*1024};
export const token=()=>randomBytes(32).toString('hex');
export const digest=v=>createHash('sha256').update(v).digest('hex');
export async function hashPassword(password){const salt=randomBytes(16).toString('hex');const key=await scrypt(password,salt,64,scryptOptions);return `scrypt:${salt}:${key.toString('hex')}`;}
export async function verifyPassword(password,hash){const [kind,salt,hex]=hash.split(':');if(kind!=='scrypt'||!salt||!hex)return false; const key=await scrypt(password,salt,64,scryptOptions);const expected=Buffer.from(hex,'hex');return expected.length===key.length&&timingSafeEqual(key,expected);}
export function httpsUrl(value){if(value==='')return '';try{const u=new URL(value);if(u.protocol==='https:'&&!u.username&&!u.password)return u.href;}catch{}throw Object.assign(new Error('Etibarlı HTTPS ünvanı daxil edin.'),{status:400});}
export function validate(kind,input){const out={};const fail=()=>{throw Object.assign(new Error('Məlumatları yoxlayın: tələb olunan sahə və ya format yanlışdır.'),{status:400});};const str=(k,max=3000,required=false)=>{if(typeof input[k]!=='string'||input[k].length>max||(required&&!input[k].trim()))fail();out[k]=input[k].trim();};
if(kind==='settings'){for(const k of ['intro','address','hours'])str(k);return out;}
str('name',160,true);
if(kind==='socials'){str('url',2000,true);out.url=httpsUrl(out.url);return out;}
if(kind==='categories'){if(!['number','string'].includes(typeof input.sort_order)||! /^-?\d+$/.test(String(input.sort_order))||!Number.isInteger(Number(input.sort_order))||Math.abs(Number(input.sort_order))>10000)fail();out.sort_order=Number(input.sort_order);return out;}
str('description');str('image_url',2000);out.image_url=httpsUrl(out.image_url);if(!['number','string'].includes(typeof input.price)||!/^\d+(\.\d{1,2})?$/.test(String(input.price))||!Number.isFinite(Number(input.price))||Number(input.price)<0||Number(input.price)>999999.99)fail();out.price=Number(input.price);if(typeof input.published!=='boolean')fail();out.published=input.published;
if(kind==='dishes'){if(!/^\d+$/.test(String(input.category_id))||!Number.isSafeInteger(Number(input.category_id))||Number(input.category_id)<1)fail();out.category_id=Number(input.category_id);}
if(kind==='events'){str('event_date',10,true);str('event_time',5,true);if(!/^\d{4}-\d{2}-\d{2}$/.test(out.event_date)||!Number.isFinite(Date.parse(out.event_date))||new Date(out.event_date).toISOString().slice(0,10)!==out.event_date||!/^([01]\d|2[0-3]):[0-5]\d$/.test(out.event_time))fail();}return out;}


