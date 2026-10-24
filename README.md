# COCO Music Hall

Azərbaycan dilində, HTML/CSS/vanilla JavaScript interfeysi, Node.js API, Neon PostgreSQL və Vercel yerləşdirməsi üçün hazırlanmış layihə. İlk ekran tam restoran fotosu, iri sans-serif başlıqlar, şüşə effektli naviqasiya və şampan qızılı düymələr üzərində qurulub. İstifadəçinin istəyi ilə altı nümunə yemək və qiymət əlavə edilib; bunlar açıq şəkildə “nümunə menyu” kimi işarələnir. Uydurma tədbir, ünvan və sosial hesab yayımlanmır.

## Səhifələr və interaktiv dizayn

Ziyarətçi mətnləri qısa saxlanılır: təkrarlanan şüarlar çıxarılıb, menyu, qiymətlər, tədbirlər, rezervasiya və əlaqə məlumatları önə çəkilib. Nümunə menyu və restoran təsdiqi barədə vacib qeydlər saxlanılıb.

- `/` — foto fon, əsas rezervasiya/menyu düymələri, məkan/tədbir keçidləri və rezervasiya forması.
- `/mekan.html` — atmosfer qalereyası və seçimə görə fotosu dəyişən məlumat bloku.
- `/tedbirler.html` — musiqi atmosferi və bazadan gələn real tədbirlər.
- `/menyu.html` — kateqoriya filtri, mətn axtarışı və təsadüfi yemək seçən kiçik oyun.
- `/elaqe.html` — zəng, WhatsApp, rezervasiya, ünvan sorğusu, sosial ikonlar və sual-cavab.
- `/rezervasiya.html` — ayrıca rezervasiya forması.

Hər biri ayrıca HTML faylıdır; naviqasiya və footer bütün səhifələrdə mövcuddur. `scripts/create-pages.mjs` mətn və səhifə şablonlarını saxlayır. Şablonları dəyişdikdən sonra `node scripts/create-pages.mjs` işlədin; bu əmr altı ziyarətçi HTML faylını yenidən yaradır. Hazır HTML faylları repozitoriyadadır, deploy zamanı build tələb olunmur. Lüks görünüş `public/luxury.css` faylındadır və bütün ziyarətçi səhifələrində əsas üslubdan sonra yüklənir. Admin ayrıca stylesheet ilə işləyir.

Devlab (`https://devlab.llc/`) istifadəçinin təqdim etdiyi dizayn istinadıdır: iri sans-serif başlıqlar, yumru düymələr və üzən naviqasiya COCO-nun foto və tünd-qızılı üslubuna uyğunlaşdırılıb. Saytın məzmunu və loqosu kopyalanmayıb. Plus Jakarta Sans dəyişən şrifti Google Fonts-un rəsmi repozitoriyasından lokal saxlanılır; SIL Open Font License faylı `public/assets/fonts/OFL.txt` ünvanındadır. Yenidən yükləmək üçün `node scripts/download-fonts.mjs` istifadə edilə bilər.

Effektlər: fon fotosunun yavaş hərəkəti, başlıqların yumşaq görünməsi, düymələrdə işıq keçidi və ox animasiyası, foto kartlarda yaxınlaşma və əlaqə kartlarında pointer işığı. Üzən boşqab, yarpaq/not kompozisiyası və konfetti çıxarılıb. Footer-də “Effektlər” düyməsi ilə hərəkəti söndürmək olur. Sisteminizdə `prefers-reduced-motion` aktivdirsə, effektlər başlanğıcda bağlıdır. Video və ağır animasiya kitabxanası yüklənmir; avtomatik səs yoxdur.

Səkkiz stok foto `public/assets/` qovluğunda lokal saxlanılır; mənbələr `public/assets/SOURCES.md` faylındadır. Fotolar COCO-nun real məkanı və yeməkləri deyil, illüstrativdir. Real foto material təqdim edildikdə dəyişdirilməlidir. Sayt işləyərkən Unsplash-a sorğu göndərmir və xarici şrift tələb etmir.

TikTok və Instagram hesabları yoxdursa, ikonlar “tezliklə” statusunda görünür, keçid olmur. Admin panelindən etibarlı hesab URL-ləri əlavə edildikdə həmin ikonlar aktiv keçidlərə çevrilir. Telefon və WhatsApp üçün təqdim edilmiş eyni real nömrə istifadə edilir.

## Lokal işə salma

Node.js 22 və ya daha yeni versiya:

```powershell
npm ci
npm run dev
```

Sayt: http://localhost:3000 — admin: http://localhost:3000/admin. `.env` olmadan bütün ziyarətçi səhifələri, illüstrativ fotolar və işarələnmiş nümunə menyu açılır. Tədbirlər üçün məlumatlandırıcı boş vəziyyət göstərilir. WhatsApp rezervasiya sorğusu baza olmadan da işləyir. Admin girişi və məzmun idarəsi baza qurulmadan işləmir.

Nümunə yeməklər yalnız frontend təqdimatıdır, bazaya yazılmır və sifariş/ödəniş yaratmır. Bazada ən az bir yayımlanmış yemək olduqda nümunələr avtomatik real menyu ilə əvəzlənir. API xətası olduqda xəta açıq göstərilir; nümunələr real məlumat kimi təqdim edilmir. Production API-si bağlantı xətasında yenə 503 qaytarır, saxta bazaya keçid yoxdur.

Rezervasiya üçün forma doldurmaq məcburi deyil. “WhatsApp-da rezerv et” düyməsi birbaşa restoranla söhbəti açır, alternativ olaraq zəng etmək olar. “Məlumat əlavə et” seçimi altında ad, qonaq sayı, tarix, saat və qeyd istəyə görə yazılır; heç bir sahə məcburi deyil. Mesaja yalnız doldurulan məlumatlar daxil edilir. Restoran təsdiqi barədə qeyd saxlanılıb.

## Neon bağlantısı və ilk admin

1. Neon hesabında PostgreSQL layihəsi yaradın. Connection string-i (serverless üçün pooled URL uyğundur) götürün; TLS üçün `sslmode=require` saxlayın.
2. `.env.example` faylını `.env` adı ilə kopyalayın. `DATABASE_URL` dəyərini həqiqi Neon bağlantısı ilə əvəz edin.
3. `APP_ORIGIN=http://localhost:3000` yazın. Dəyərdə yol və son slash olmamalıdır. Portu dəyişsəniz origin-i də dəyişin.
4. Sxemi və ilk admini yaradın:

```powershell
npm run migrate
npm run admin
```

Admin əmri interaktiv terminalda istifadəçi adı və iki dəfə gizli parol istəyir. Parol minimum 14 simvol olmalıdır; güclü, unikal paroldan istifadə edin. Standart parol yoxdur. Parol scrypt ilə təsadüfi salt istifadə edilərək saxlanılır. Parolu dəyişmək üçün eyni əmri eyni istifadəçi adı ilə yenidən başladın. Həmin adminin əvvəlki sessiyaları ləğv edilir. Parolu shell arqumentinə və ya kod faylına yazmayın.

`npm run migrate` təkrar başladıldıqda mövcud məlumatı silmir. Sonrakı sxem dəyişiklikləri üçün ayrıca nömrəli migrasiyalar əlavə olunmalıdır.

## Admin istifadəsi

`/admin` ünvanından daxil olun. Tədbir və yeməklər ilk dəfə qaralama kimi yaradıla bilər; “Yayımlansın” seçildikdə ziyarətçi səhifəsinə çıxır. Yemək yaratmazdan əvvəl kateqoriya yaradın. Kateqoriyanı silmək üçün ona bağlı yeməkləri silin və ya başqa kateqoriyaya köçürün. Şəkillər üçün açıq HTTPS URL istifadə edin; fayl yükləmə yoxdur. URL boş saxlanarsa şəkilsiz görünüş göstərilir. Şəkil URL-si sizin nəzarətinizdəki etibarlı xidmətdən olmalıdır; ziyarətçi brauzeri həmin xidmətə sorğu göndərir.

Sosial linklər bölməsində Instagram, TikTok və istənilən başqa platforma üçün ad və HTTPS keçid əlavə olunur. Əlavə edilməyən link göstərilmir. Məkan məlumatlarından təqdimatı, ünvanı və iş saatlarını redaktə edin. Tədbir saatı məkanın yerli saatıdır (Azərbaycan, UTC+4). Qiymətlər AZN ilə göstərilir. Ödəniş və bilet satışı inteqrasiyası yoxdur.

Rezervasiya forması məlumatları `encodeURIComponent` vasitəsilə kodlaşdırıb `https://wa.me/994552731235` keçidinə yönləndirir. Sayt mesajı özü göndərmir: istifadəçi WhatsApp-da göndərişi tamamlayır. Restoranın təsdiqinə qədər rezervasiya qüvvəyə minmir. Rezervasiyalar saytda saxlanılmır.

## Mühit dəyişənləri

| Dəyişən | Təyinat |
| --- | --- |
| `DATABASE_URL` | Gizli Neon PostgreSQL bağlantısı; yalnız server istifadə edir |
| `APP_ORIGIN` | İcazəli sayt origin-i; lokal və production üçün müvafiq dəyər |
| `PORT` | Lokal server portu, standart `3000` |
| `NODE_ENV` | Vercel-də `production`; Secure cookie və məcburi baza bağlantısı |
| `TEST_DATABASE_URL` | İstəyə bağlı ayrıca test PostgreSQL bağlantısı |

Sirləri Git-ə, brauzer koduna və ZIP-ə daxil etməyin. `.env` ignore olunur. Preview Vercel deployment-də admini yoxlamaq üçün həmin deployment URL-sini onun `APP_ORIGIN` dəyişəninə təyin edin. Lokal mühitdə eyni anda həm `127.0.0.1`, həm `localhost` istifadə etməyin.

## Təhlükəsizlik

Sessiya tokeninin yalnız SHA-256 hash-i bazada saxlanılır; sessiya 8 saat sonra bitir. Cookie `HttpOnly`, `SameSite=Strict`, production-da `Secure` parametrinə malikdir. Hər dəyişiklik üçün origin, server sessiyası və CSRF tokeni yoxlanılır (giriş üçün origin yoxlanılır). Girişdə IP üzrə 15 dəqiqədə 8 cəhd limiti PostgreSQL-də atomik sayılır. Vercel-də platformanın `x-vercel-forwarded-for` məlumatından, lokalda socket IP-dən istifadə edilir. Başqa reverse proxy üçün IP etibar qaydasını ayrıca uyğunlaşdırın.

Bütün SQL dəyərləri parametrli ötürülür, cədvəl/sahə adları sabit icazəli siyahıdan gəlir. Məzmun `textContent` ilə render edilir. Production üçün CSP və digər başlıqlar `vercel.json` daxilindədir. API xəta cavabları bağlantı sirrini açıqlamır. Login cəhdləri IP-nin hash-i ilə saxlanılır; dövri texniki qulluqda köhnə sessiyaları və cəhd qeydlərini təmizləyə bilərsiniz:

```sql
DELETE FROM sessions WHERE expires_at < now();
DELETE FROM login_attempts WHERE window_start < now() - interval '1 day';
```

## Testlər və yoxlamalar

```powershell
npm test
```

Testlər scrypt, səhv parol, giriş limiti, origin/CSRF, icazəsiz dəyişikliklər, sessiya cookie-si, CRUD, SQL parametr ötürülməsi, HTTPS/tarix/qiymət yoxlamasını əhatə edir. Standart testlər yalnız test daxilində SQL adapterindən istifadə edir; production-da alternativ və ya saxta baza yoxdur.

Həqiqi PostgreSQL testi üçün ayrıca test bazasının `TEST_DATABASE_URL` dəyişənini təyin edib `node --env-file=.env --test` başladın. Test öz sxemini transaction daxilində yaradır və sonda rollback edir; CREATE SCHEMA icazəsi tələb olunur. Həmin dəyişən olmadıqda bu test açıq şəkildə buraxılır. Təqdimat zamanı Neon hesabı olmadığı üçün real baza testi icra edilməyib.

Brauzer yoxlaması üçün lokal serveri başladın və:

```powershell
$env:PREVIEW_URL='http://localhost:3000'
node scripts/browser-check.js
```

Windows-da Chrome-un standart quraşdırma yolu istifadə edilir; başqa mühit üçün `CHROME_PATH` təyin edin. Bu yoxlama altı səhifəni 390, 768 və 1440 px ölçülərində açır; foto yüklənməsi, üfüqi daşma, mobil naviqasiya, menyu filtri/axtarışı, təsadüfi seçim oyunu, animasiya idarəsi, WhatsApp mesajının kodlaşdırılması və admin girişini yoxlayır. Əlavə brauzer ssenarilərində azaldılmış hərəkət rejimi, klaviatura fokusu, real məlumatla nümunə menyunun əvəzlənməsi, mətnin təhlükəsiz renderi, TikTok linki və tədbir dialoqu yoxlanır. Screenshot-lar `test-results/` qovluğuna yazılır. WhatsApp göndərişi testdə tutulur, real mesaj göndərilmir. Klaviatura fokusu, skip link və form etiketləri dəstəklənir; tam ekran oxuyucu auditi aparılmayıb.

## Vercel yerləşdirməsi

1. Layihəni öz Git repozitoriyanıza push edin və Vercel-də Import Project seçin (və ya lokal Vercel CLI ilə import edin).
2. Framework Preset: **Other**. Build Command boşdur; Output Directory: **public** (`vercel.json` bunu təyin edir). Install Command: `npm ci`. Node.js 22 və ya 24 seçin. Frontend statikdir, `/api/*` sorğuları Node serverless handler-ə, `/admin` admin HTML-ə yönləndirilir.
3. Vercel Environment Variables daxilində `DATABASE_URL` və dəqiq HTTPS `APP_ORIGIN` əlavə edin. Vercel production üçün `NODE_ENV=production` istifadə edir. `.env` faylını yükləməyin.
4. Neon üçün lokal `npm run migrate` və `npm run admin` əmrlərini təhlükəsiz terminalda tamamlayın.
5. Deploy edin. Domain dəyişdikdə `APP_ORIGIN` parametrini yeniləyib yenidən deploy edin. HTTPS girişini, qaralama/yayım görünüşünü, CRUD və WhatsApp keçidini real mühitdə yoxlayın.

Production-da `DATABASE_URL` yoxdur və ya bağlantı alınmırsa API 503 qaytarır; saxta bazaya səssiz keçid yoxdur. Neon/Vercel hesabı, bağlantı və giriş məlumatları təqdim olunmadığı üçün canlı yerləşdirmə, real admin yaradılması və Neon üzərində işləmə təsdiqlənməyib.

## ZIP təhvili

`coco-music-hall.zip` mənbələri, SQL sxemini, testləri, README-ni, `.env.example` və dependency lock faylını ehtiva edir. `node_modules`, `.env`, Git metadatası və test screenshot-ları arxivə daxil edilmir. Arxivi açdıqdan sonra `npm ci` işlədin.

Windows-da arxivi yenidən yaratmaq üçün `pwsh -File scripts/package.ps1` işlədin. Yoxlama nəticələri `VERIFICATION.md` faylındadır.


