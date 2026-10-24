

import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.env.PREVIEW_URL||'http://localhost:3001';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
await mkdir('test-results',{recursive:true});
const routes=[['home','/'],['venue','/mekan.html'],['events','/tedbirler.html'],['menu','/menyu.html'],['contact','/elaqe.html'],['reservation','/rezervasiya.html']];
async function revealAll(page){await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=650){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,60));}window.scrollTo({top:0,behavior:'instant'});});await page.waitForTimeout(900);}
try{
 for(const width of [390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const [name,path]of routes){
   await page.goto(base+path);await page.locator('[data-social-icons] .social-placeholder').first().waitFor();
   await page.locator('img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
   await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
   await revealAll(page);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${name}: horizontal overflow at ${width}`);
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)),true,`${name}: broken photo`);
   assert.equal(await page.locator('.site-footer [data-social-icons] use[href="/icons.svg#tiktok"]').count(),1);
   if(name==='home'){
    assert.equal(await page.locator('.hero-background img').count(),1);
    assert.equal(await page.locator('#plate-turn').count(),0);
    assert.match(await page.locator('.hero h1').textContent(),/COCO/);
    assert.equal(await page.locator('.hero .actions a[href="/rezervasiya.html"]').count(),1);
    if(width<801){await page.getByRole('button',{name:'Naviqasiyanı aç'}).click();assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'),'false');}
    await page.getByRole('button',{name:'Effektlər: açıq'}).click();assert.equal(await page.locator('body').evaluate(node=>node.classList.contains('motion-off')),true);await page.getByRole('button',{name:'Effektlər: bağlı'}).click();
   }
   if(name==='menu'){
    assert.equal(await page.locator('.dish-card').count(),6);
    await page.getByRole('button',{name:'Şirniyyatlar',exact:true}).click();assert.equal(await page.locator('.dish-card').count(),1);assert.equal(await page.locator('.dish-card h3').textContent(),'Giləmeyvəli tort');
    await page.getByRole('button',{name:'Hamısı',exact:true}).click();await page.getByRole('searchbox').fill('pesto');assert.equal(await page.locator('.dish-card').count(),1);await page.getByRole('searchbox').fill('');
    await page.getByRole('button',{name:'Mənim üçün seç'}).click();assert.match(await page.locator('#lucky-result').textContent(),/Nümunə seçim:/);
   }
   if(name==='venue'){await page.getByRole('button',{name:'Canlı musiqi',exact:true}).click();assert.equal(await page.locator('#mood-title').textContent(),'Canlı musiqi');assert.match(await page.locator('#mood-photo').getAttribute('src'),/stage/);}
   await revealAll(page);await page.screenshot({path:`test-results/${name}-${width}.png`,fullPage:true});
   if(name==='reservation'){
    assert.equal(await page.locator('#note').isVisible(),false);assert.equal(await page.locator('#reservation-form [required]').count(),0);
    await page.route('https://wa.me/**',route=>route.fulfill({status:200,body:'test intercepted'}));
    const directNavigation=page.waitForURL('https://wa.me/**');await page.getByRole('link',{name:'WhatsApp-da rezerv et',exact:true}).click();await directNavigation;
    const directTarget=new URL(page.url());assert.equal(directTarget.pathname,'/994552731235');assert.match(directTarget.searchParams.get('text'),/Masa rezerv etmək istəyirəm/);assert.doesNotMatch(directTarget.searchParams.get('text'),/Ad:|Qonaq sayı:/);
    if(width===390){await page.goto(base+path);await page.getByText('Məlumat əlavə et',{exact:false}).click();const emptyNavigation=page.waitForURL('https://wa.me/**');await page.getByRole('button',{name:'Məlumatlarla göndər'}).click();await emptyNavigation;assert.doesNotMatch(new URL(page.url()).searchParams.get('text'),/Ad:|Tarix:|Qonaq sayı:/);}
    await page.goto(base+path);await page.getByText('Məlumat əlavə et',{exact:false}).click();await page.locator('#guest-name').fill('Sınaq Ad & Ailə');await page.locator('#date').fill('2027-01-01');await page.locator('#time').fill('20:00');await page.locator('#guests').fill('4');await page.locator('#note').fill('Pəncərə kənarı, zəhmət olmasa.');
    const navigation=page.waitForURL('https://wa.me/**');await page.getByRole('button',{name:'Məlumatlarla göndər'}).click();await navigation;const target=new URL(page.url());assert.equal(target.pathname,'/994552731235');assert.match(target.searchParams.get('text'),/Sınaq Ad & Ailə/);assert.match(target.searchParams.get('text'),/Qonaq sayı: 4/);assert.match(target.searchParams.get('text'),/Pəncərə kənarı/);
   }
  }
  await page.goto(base+'/admin');await page.locator('#login:not(.hidden)').waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:`test-results/admin-${width}.png`,fullPage:true});assert.deepEqual(errors,[]);await page.close();
  console.log(`${width}px: 6 pages, photos, navigation, menu filters/search, game, effects, WhatsApp and admin passed`);
 }
 const page=await browser.newPage({viewport:{width:390,height:900},reducedMotion:'reduce'});
 await page.goto(base);await page.locator('.dish-card').first().waitFor();assert.equal(await page.locator('body').evaluate(n=>n.classList.contains('motion-off')),true);await page.locator('.skip').focus();assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('skip')),true);
 // Explicit browser-only fixtures exercise published data without adding fake business data.
 const fixture={configured:true,settings:{intro:'Restoran təqdimatı',address:'Test ünvanı',hours:'Test saatı'},categories:[{id:1,name:'Real kateqoriya',sort_order:0}],dishes:[{id:1,name:'Yayımlanmış yemək',description:'<script>window.xss=true</script>',price:25,category_id:1,image_url:''}],events:[{id:1,name:'Test tədbiri',description:'<img src=x onerror=alert(1)>',event_date:'2027-01-01',event_time:'20:00',price:30,image_url:''}],socials:[{id:1,name:'TikTok',url:'https://www.tiktok.com/@test-fixture'}]};
 await page.route('**/api/public',route=>route.fulfill({contentType:'application/json',body:JSON.stringify(fixture)}));
 await page.goto(base+'/menyu.html');await page.getByText('Yayımlanmış yemək',{exact:true}).waitFor();assert.equal(await page.locator('.demo-note').isVisible(),false);assert.equal(await page.evaluate(()=>window.xss),undefined);assert.equal(await page.locator('.site-footer a[aria-label="TikTok"]').count(),1);
 await page.goto(base+'/tedbirler.html');await page.getByRole('button',{name:'Tədbirin detalları'}).click();assert.equal(await page.locator('dialog').isVisible(),true);assert.match(await page.locator('#event-detail').textContent(),/Test tədbiri/);assert.equal(await page.locator('#event-detail img').count(),0);await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').isVisible(),false);
 await page.route('**/api/public',route=>route.fulfill({status:503,contentType:'application/json',body:'{"error":"Unavailable"}'}));await page.goto(base+'/menyu.html');await page.getByText('Canlı məlumatları yükləmək mümkün olmadı.',{exact:false}).waitFor();assert.equal(await page.locator('.demo-note').isVisible(),true);await page.close();
 console.log('Reduced motion, keyboard focus, safe data rendering, TikTok link, event dialog and explicit error state passed');
}finally{await browser.close();}


