import {test} from 'node:test';
import assert from 'node:assert/strict';
import {environmentLogin,environmentSessionValid} from '../lib/env-admin.js';
import {verifyPassword} from '../lib/security.js';

test('environment admin: minimum, wrong login, hash storage, rotation and revocation',async()=>{
  const previous=process.env.ADMIN_PASSWORD;
  let user,revocations=0,writes=0;
  const db=async(sql,p)=>{
    if(sql.startsWith('SELECT'))return {rows:user?[user]:[]};
    if(sql.startsWith('INSERT')){writes++;user={id:7,username:p[0],password_hash:p[1]};return {rows:[user]};}
    if(sql.startsWith('DELETE')){revocations++;return {rows:[]};}
    throw Error('Unexpected query');
  };
  try{
    delete process.env.ADMIN_PASSWORD;
    assert.equal(await environmentLogin(db,'admin','anything'),undefined);
    process.env.ADMIN_PASSWORD='1234567';
    await assert.rejects(environmentLogin(db,'admin','1234567'),{status:503});
    process.env.ADMIN_PASSWORD='test-12345678';
    assert.equal(await environmentLogin(db,'admin','wrong'),null);
    assert.equal(await environmentLogin(db,'other','test-12345678'),null);
    assert.equal(writes,0);
    assert.equal((await environmentLogin(db,'admin','test-12345678')).id,7);
    assert.match(user.password_hash,/^scrypt:/);
    assert.equal(await verifyPassword('test-12345678',user.password_hash),true);
    assert.equal(await environmentSessionValid(db,{admin_id:7}),true);
    assert.equal(await environmentSessionValid(db,{admin_id:9}),false);
    await environmentLogin(db,'admin','test-12345678');
    assert.equal(writes,1);
    process.env.ADMIN_PASSWORD='new-test-87654321';
    assert.equal(await environmentSessionValid(db,{admin_id:7}),false);
    assert.equal(await environmentLogin(db,'admin','test-12345678'),null);
    await environmentLogin(db,'admin','new-test-87654321');
    assert.equal(revocations,2);
    assert.equal(await environmentSessionValid(db,{admin_id:7}),true);
  }finally{if(previous===undefined)delete process.env.ADMIN_PASSWORD;else process.env.ADMIN_PASSWORD=previous;}
});
