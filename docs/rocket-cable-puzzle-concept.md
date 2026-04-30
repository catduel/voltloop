# Rocket Fuel + Cable Puzzle Concept

## Oyun Fikri

Bu oyun, klasik "liquid sort" mantigini roket hazirlama temasi ile birlestirir. Oyuncu sadece yakit tuplerini dogru sekilde ayirmakla kalmaz; ayni zamanda rokete bagli kablolari, enerji hatlarini ve kilitli sistemleri de dogru sirada cozer. Amac yalnizca dogru yakiti hazirlamak degil, roketin firlatma altyapisini tamamen aktif hale getirmektir.

## Ana Fantazi

Oyuncu bir "launch technician" gibi hisseder:

- yakiti dogru oranlarda hazirlar
- kablolari dogru portlara baglar
- guc dagitimini dengeler
- emniyet kilitlerini sirayla kaldirir
- son olarak firlatmayi baslatir

Bu sayede puzzle sadece renk ayirma olmaktan cikar, cok katmanli bir sistem bilmecesine donusur.

## Ana Oynanis Dongusu

1. Oyuncu yakit tupelerini tasir ve karisimlari duzeltir.
2. Dogru yakitlar olustukca belirli kablo terminalleri enerji alir.
3. Enerji alan terminaller, roket uzerindeki portlari veya kapali panel kilitlerini acar.
4. Yeni alanlar acildikca yeni tupler, yeni kablolar veya yeni kurallar devreye girer.
5. Tum yakit hedefleri ve tum kablo hedefleri saglaninca "Launch" aktif olur.

## Yeni Mekanik: Kablo Bulmacasi

Kablolar ikinci puzzle katmanidir. Her kablo bir yakit tipi, guc seviyesi veya sistem modulu ile baglantilidir.

### Kablo Kurallari

- Her roket portu belirli bir renkte veya voltaj tipinde kablo ister.
- Bazi kablolar ancak belirli yakit dogru hazirlandiginda aktif olur.
- Bazi portlar dogrudan degil, "relay node" uzerinden baglanir.
- Kablo hatlari birbiriyle kesisebilir ama ayni anda her hattan tek akim gecebilir.
- Yanlis baglanti roketi patlatmaz; ama sistemi "jam" eder ve bazi hamleleri gecici olarak kilitler.

## Kablo Tipleri

### 1. Renk Eslesme Kablosu

En temel tip. Mavi kablo mavi porta, sari kablo sari porta gider. Ama kablonun aktif olmasi icin ilgili yakit da hazir olmalidir.

### 2. Polarite Kablosu

Pozitif ve negatif uclar ters baglanirsa hat calismaz. Bu, oyuncuya yon duygusu kazandirir.

### 3. Gecikmeli Enerji Kablosu

Bir hatta enerji vermek diger hattin gucunu dusurebilir. Oyuncu once A sonra B baglamalidir.

### 4. Coklayici Hat

Tek enerji kaynagi iki farkli sisteme dagitilir ama tam guc yetmeyebilir. Oyuncu once hangi sistemi calistiracagina karar verir.

### 5. Kilit Acan Veri Kablosu

Bu kablolar renk degil sira ister. Portlara 1-2-3 sirasiyla baglanir. Yanlis sira paneli resetler.

## Yakit ve Kablo Etkilesimi

Bu tasarimin asil gucu burada:

- Yesil yakit hazir olursa "cooling line" aktif olur.
- Turuncu yakit hazir olursa "ignition bus" aktif olur.
- Mor karisim olusursa merkezi paneldeki veri kilidi acilir.
- Bazi tupler doluyken kablo yollarini fiziksel olarak kapatir; oyuncu once tupeleri bosaltip alan acmak zorunda kalir.
- Bazi kablolar sadece belirli hacimde yakit olunca etkinlesir. Ornek: tankta tam 4 birim varsa sensor yeşile doner.

Bu sayede oyuncu tek ekrana bakip hem sivi mantigini hem devre mantigini dusunur.

## Zorluk Katmanlari

### Katman 1: Saf Ayirma

Oyuncu sadece renkleri ayirir. Mevcut oyuna yakin baslangic.

### Katman 2: Karisim Sonucu

Iki renk birlesince yeni yakit tipi olusur. Bu yeni yakit belirli kablolari aktif eder.

### Katman 3: Kablo Portlari

Rokette 2-3 port acilir. Oyuncu dogru kabloyu dogru porta baglar.

### Katman 4: Sirali Aktivasyon

Portlar rastgele degil, belirli sira ile aktif edilmelidir.

### Katman 5: Kaynak Kisitlamasi

Bos tup sayisi azalir, kablo duzeltme sayisi sinirlanir, bazi hamleler geri donulmez hissettirir.

### Katman 6: Cift Hedef

Oyuncu seviyeyi bitirmek icin hem yakit hedefini hem de tum kablo hedeflerini tamamlar.

## Ornek Seviye Tasarimi: "Ignition Maze"

### Hedefler

- 2 birim yesil sogutma yakiti
- 2 birim turuncu atesleme yakiti
- 1 mavi veri hatti baglantisi
- 1 sari enerji hatti baglantisi
- merkez panelin kilidini ac

### Seviye Kurulumu

- 5 normal tup
- 1 buyuk depo
- 2 bos ara tup
- 4 kablo ucu
- 2 relay node
- 1 kilitli panel

### Puzzle Mantigi

- Oyuncu once sari ve kirmiziyi ayirmazsa turuncu karisim cikmaz.
- Turuncu olusmadan ignition portu elektrik almaz.
- Ignition portu acilmadan relay node-2 aktif olmaz.
- Relay node-2 aktif olmadan mavi veri kablosu merkeze uzanamaz.
- Ama mavi hatti erken baglamak, sari enerji hattini bloke eder.
- Bu nedenle oyuncu once sogutma, sonra ignition, sonra sari guc, en son mavi veri sirasini bulmak zorundadir.

Bu tip zincirleme bagimliliklar oyunu belirgin sekilde daha "hard puzzle" seviyesine tasir.

## Ek Sistemler

### Panel Yetkileri

Seviyede mini paneller olabilir:

- valve paneli: bir tupun akisini ters cevirir
- fuse paneli: bir kabloyu gecici kapatir
- switch paneli: iki portun gorevini degistirir

### Ariza Durumlari

- Asiri dolu hat: kablo gecici kisadevre olur
- Kirli yakit: belli karisimlar kabloyu kilitler
- Donmus hat: sogutma aktif olmadan bazi transferler yapilamaz

### Hamle Ekonomisi

Sadece move sayisi yerine 3 farkli skor tutulabilir:

- transfer sayisi
- kablo degisikligi sayisi
- reset kullanimi

Bu, ust seviye oyuncular icin optimizasyon katmani yaratir.

## Arayuz Onerisi

Ekrani 3 ana bolgeye ayir:

1. Sol alt: yakit tupleri
2. Sag alt: kablo dugumleri ve relay node'lar
3. Ust orta: roket silueti ve eksik sistem gostergeleri

Ek olarak:

- aktif olmayan kablolar soluk gorunsun
- enerji gecen kablolar animasyonla parlasin
- roket uzerindeki portlar "fuel-ready", "power-ready", "locked" gibi durumlar gostersin
- Launch butonu ancak tum checklist tamamlaninca parlasin

## Oyuncuyu Zorlayan Ama Adil Tutan Kurallar

- Her yeni seviye yalnizca 1 yeni mekanik eklesin
- Hata yapan oyuncu soft-lock olmamali; reset veya geri alma secenegi olmali
- Cozum tek adimli degil, ama sezgisel ipuclari olmali
- Kablo yolu karmaşasi gorunse de hedefler ekranda net yazmali

## Iyi Calisacak Tema Varyasyonlari

- Space launch pad
- Deep sea reactor startup
- Cyberpunk power core ignition
- Alien bio-engine activation

Ayni sistem farkli tema ile yeniden kullanilabilir.

## Neden Bu Fikir Guclu

Bu tasarim:

- mevcut liquid sort mantigini tamamen cope atmadan genisletir
- oyuncuya yeni bir zihinsel model verir
- sadece renk degil sira, baglanti, enerji ve alan yonetimi dusundurur
- level designer icin cok daha fazla kombinasyon alanı acar

## Kisa Ozet

En iyi versiyon su olabilir:

"Oyuncu roketi firlatmak icin dogru yakitlari ayirir, yeni karisimlar uretir, bu yakitlarla guc hatlarini aktif eder ve rokete giden kablo agini dogru sirada baglayarak tum sistemleri online hale getirir."

Bu, senin mevcut fikrinin daha zor, daha derin ve daha tatmin edici hali olur.

## Bir Sonraki Adim

Bu konsepti devam ettirmek icin 3 dogal yol var:

1. 10 level'lik zorluk akisi tasarlamak
2. Bu sistem icin oyun ekraninin wireframe'ini cizmek
3. HTML/CSS/JS ile oynanabilir bir prototip kurmak
