// Conta Analiz – Malzeme, kaplama/boya ve cıvata modülleri için veri
// Değerler tipik (garanti edilmeyen) değerlerdir; tasarımda ilgili EN/ASTM standardındaki minimum değerler esas alınır.
(function (g) {
  // ---------- Ek referanslar (DATA.REF'e eklenir) ----------
  const REF2 = {
    en573: { kisa: 'EN 573-3', ad: 'EN 573-3 – Alüminyum ve alaşımları: kimyasal bileşim ve ürün şekilleri (EN AW-xxxx gösterimi)', url: 'https://standards.iteh.ai/catalog/standards/cen/' },
    en485: { kisa: 'EN 485-2', ad: 'EN 485-2 – Alüminyum levha, şerit ve plaka: mekanik özellikler', url: '' },
    en755: { kisa: 'EN 755-2', ad: 'EN 755-2 – Alüminyum ekstrüzyon çubuk, boru ve profil: mekanik özellikler', url: '' },
    astmB209: { kisa: 'ASTM B209 / B221', ad: 'ASTM B209 (levha/plaka) ve ASTM B221 (ekstrüzyon) – ABD alüminyum ürün standartları; havacılıkta AMS-QQ-A-250/x', url: 'https://www.astm.org/b0209-14.html' },
    alProp: { kisa: 'Al alaşım özellikleri', ad: 'Aluminum Association tipik değerleri (6061-T6: Rm 310 / Rp 276 MPa; 7075-T6: Rm 572 / Rp 503 MPa; 2024-T3: Rm 483 / Rp 345 MPa) – United Aluminum / ASM özet tabloları', url: 'https://unitedaluminum.com/?p=44' },
    alSec: { kisa: 'Al seçim rehberi', ad: 'Alaşım seçim karşılaştırmaları: 1050 ve 5083 işleme zayıf, 6082 iyi işlenir ve iyi eloksal alır; 2024 ve 7075 koruyucu kaplama ister; 5xxx deniz ortamı (Metal Supermarkets, Protolabs, GEMS seçim kılavuzları)', url: 'https://www.metalsupermarkets.co.uk/7-things-to-consider-when-choosing-an-aluminium-grade/' },
    en10025: { kisa: 'EN 10025-2', ad: 'EN 10025-2 – Sıcak haddelenmiş alaşımsız yapı çelikleri (S235JR, S355J2 …)', url: 'https://lucefin.com/oaleekso/files_mf/1522935764S355J2.pdf' },
    en683: { kisa: 'EN ISO 683', ad: 'EN ISO 683-1 / -2 – Islah çelikleri (C45, 42CrMo4) – eski EN 10083', url: 'https://roymech.org/Useful_Tables/Matter/Steel_Data/Steel-10083.html' },
    en10088: { kisa: 'EN 10088-3', ad: 'EN 10088-3 – Paslanmaz çelik yarı mamul, çubuk ve profiller (1.4301, 1.4404, 1.4305, 1.4542)', url: 'https://cromostal.pl/en/tabela-wlasciwosci-mechanicznych.html' },
    mil8625: { kisa: 'MIL-PRF-8625', ad: 'MIL-PRF-8625 – Alüminyum anodik kaplama. Tip II: sülfürik asit eloksal; Tip III: sert eloksal. Class 1: boyasız (doğal), Class 2: boyalı (renkli/siyah).', url: 'https://www.finishing.com/295/15.shtml' },
    mil5541b: { kisa: 'MIL-DTL-5541', ad: 'MIL-DTL-5541 – Alüminyumda kimyasal dönüşüm kaplaması. Tip I: altı değerlikli krom içerir (sarı/altın); Tip II: Cr6 içermez (şeffaf/açık mavi). Class 1A: boyasız en iyi korozyon + boya altı; Class 3: düşük elektrik temas direnci (elektrik/elektronik, EMI).', url: 'https://en.everybodywiki.com/MIL-DTL-5541' },
    iso7599: { kisa: 'ISO 7599', ad: 'ISO 7599 – Alüminyum anodik oksidasyon (dekoratif ve koruyucu eloksal), kalınlık sınıfları AA5…AA25', url: '' },
    iso10074: { kisa: 'ISO 10074', ad: 'ISO 10074 – Alüminyumda sert anodik oksidasyon (sert eloksal)', url: '' },
    mil23377: { kisa: 'MIL-PRF-23377 / 85285', ad: 'MIL-PRF-23377 (epoksi astar) + MIL-PRF-85285 (poliüretan son kat) – askeri/havacılık boya sistemi', url: '' },
    en12206: { kisa: 'EN 12206-1', ad: 'EN 12206-1 – Mimari alüminyum için toz boya (Qualicoat ile birlikte kullanılır)', url: '' },
    ams2404: { kisa: 'AMS 2404 / ISO 4527', ad: 'AMS 2404, ASTM B733, ISO 4527 – Akımsız (kimyasal) nikel kaplama', url: '' },
    iso2081: { kisa: 'ISO 2081 / ISO 4042', ad: 'ISO 2081 – Demir/çelik üzerine elektrolitik çinko kaplama; ISO 4042 – bağlantı elemanlarında elektrolitik kaplama (≥ 10.9 sınıfında hidrojen gevrekliği önlemleri)', url: '' },
    iso19598: { kisa: 'ISO 19598', ad: 'ISO 19598 – Çinko ve çinko alaşımı (Zn-Ni) elektrolitik kaplamalar', url: '' },
    iso1461: { kisa: 'ISO 1461', ad: 'ISO 1461 – Demir ve çelik ürünlerde sıcak daldırma galvaniz', url: '' },
    iso9717: { kisa: 'ISO 9717', ad: 'ISO 9717 – Fosfat dönüşüm kaplamaları', url: '' },
    mil13924: { kisa: 'MIL-DTL-13924', ad: 'MIL-DTL-13924 – Demir esaslı metallerde siyah oksit (brünür) kaplama', url: '' },
    astmA967: { kisa: 'ASTM A967 / AMS 2700', ad: 'ASTM A967 ve AMS 2700 – Paslanmaz çelik pasivasyonu (nitrik veya sitrik asit)', url: '' },
    iso12944: { kisa: 'ISO 12944', ad: 'ISO 12944 – Çelik yapıların boya sistemleriyle korozyondan korunması (korozif ortam sınıfları C1–C5, CX)', url: '' },
    vdiTablo: { kisa: 'VDI 2230 tablo (Marek)', ad: 'VDI 2230 yöntemiyle, µG = µK kabulüyle, akma sınırının %90’ı kullanılarak hesaplanmış sıkma kuvveti FM (kN) ve sıkma torku MA (Nm) – M4…M16, 8.8 / 10.9 / 12.9, µ = 0,08…0,14', url: 'https://www.marek.eu/katalog-obrazku/produkt-24858/58479-technical-information-screws-nuts-en.pdf' },
    zimmer: { kisa: 'Zimmer tork tablosu', ad: 'Zimmer Group – ISO 4762 / 4017 bağlama vidaları sıkma torkları, µ = 0,12 (M3: 1,3 Nm)', url: 'https://www.zimmer-group.com/en/td' },
    iso286: { kisa: 'ISO 286-1 / -2', ad: 'ISO 286-1/-2 – Uzunluk ölçüleri için ISO kod sistemi: standart tolerans kaliteleri (IT), temel sapmalar, delik/mil sınır sapmaları ve tercih edilen geçmeler', url: 'https://en.wikipedia.org/wiki/IT_Grade' },
    roymech286: { kisa: 'Roymech ISO toleranslar', ad: 'Roymech – ISO 286 kullanım örnekleri (Ø40 H7 = +25/0, Ø40 g6 = −9/−25, 300 K7 = +16/−36), tipik geçmeler ve işleme yöntemi ↔ IT tablosu', url: 'https://www.roymech.co.uk/Useful_Tables/ISO_Tolerances/how-to-use-iso-tolerances/' },
    iso2768: { kisa: 'ISO 2768-1', ad: 'ISO 2768-1 – Ayrıca tolerans verilmemiş doğrusal ve açısal ölçüler için genel toleranslar: f (ince), m (orta), c (kaba), v (çok kaba)', url: 'https://amesweb.info/fits-tolerances/iso-2768-linear-dimensions-tolerances.aspx' },
    iso27682: { kisa: 'ISO 2768-2', ad: 'ISO 2768-2 – Geometrik genel toleranslar H, K, L (doğrusallık/düzlemsellik, diklik, simetri, salgı); geri çekilmiş, yerini ISO 22081 almıştır', url: 'https://www.modulusmetal.com/iso-2768-1-and-iso-2768-2-tolerances' },
    en10087: { kisa: 'EN 10087', ad: 'EN 10087 – Otomat çelikleri (11SMn30, 11SMnPb30 …): kimyasal bileşim ve mekanik özellikler', url: '' },
    iso4957: { kisa: 'ISO 4957', ad: 'ISO 4957 – Takım çelikleri (1.2312, 1.2379 …)', url: '' },
    en1563: { kisa: 'EN 1563', ad: 'EN 1563 – Küresel grafitli (sünek) dökme demir: EN-GJS-400-15 vb.', url: '' },
    iso1101: { kisa: 'ISO 1101', ad: 'ISO 1101 – Geometrik ürün spesifikasyonu (GPS): form, yönelim, konum ve salgı toleransları', url: '' },
    loctiteTL: { kisa: 'Loctite vida sabitleyiciler', ad: 'Henkel Loctite vida sabitleyiciler: 222 (düşük mukavemet, küçük vidalar), 243 (orta mukavemet, elle sökülebilir), 270 (yüksek mukavemet, kalıcı)', url: 'https://www.henkel-adhesives.com/' }
  };

  // ---------- Alüminyum ----------
  // puanlar 1–5: isl (işlenebilirlik), kay (kaynak), kor (korozyon), elk (eloksal), sek (şekillendirme)
  const ALUMINYUM = [
    { kod: '1050A', temper: 'H14', en: 'EN AW-1050A', sembol: 'Al99,5', wnr: '3.0255', seri: 1, rho: 2.71, E: 69, Rm: 120, Rp: 100, A: 6, k: 229, cte: 24.0, tMax: 150,
      p: { isl: 1, kay: 5, kor: 5, elk: 5, sek: 5 }, bul: 5, mal: 1, urun: 'Levha, şerit',
      kullanim: 'Elektrik baraları, ısı ileten parçalar, kimyasal tanklar, derin çekme, isim plakası.',
      not: 'Saf alüminyum: çok yumuşak, talaş sarar; CNC işlemeye uygun değil. İletkenlik ve şekillendirme için seçilir.', sicak: 'Yaşlandırma yoktur; dayanımı zaten düşüktür.' },
    { kod: '2024', temper: 'T351', en: 'EN AW-2024', sembol: 'AlCu4Mg1', wnr: '3.1355', seri: 2, rho: 2.78, E: 73, Rm: 470, Rp: 325, A: 15, k: 121, cte: 23.2, tMax: 150,
      p: { isl: 4, kay: 1, kor: 2, elk: 3, sek: 2 }, bul: 3, mal: 4, urun: 'Plaka, çubuk',
      kullanim: 'Uçak gövde ve kanat parçaları, yorulmaya maruz yüksek yüklü parçalar.',
      not: 'Yorulma dayanımı çok iyi; bakır içerdiği için korozyona zayıf, mutlaka eloksal/boya ister. Ergitme kaynağı yapılmaz.', sicak: '150 °C civarına kadar dayanımını 7075’ten daha iyi korur.' },
    { kod: '5083', temper: 'H111', en: 'EN AW-5083', sembol: 'AlMg4,5Mn0,7', wnr: '3.3547', seri: 5, rho: 2.66, E: 71, Rm: 275, Rp: 125, A: 15, k: 117, cte: 24.2, tMax: 65,
      p: { isl: 2, kay: 5, kor: 5, elk: 4, sek: 4 }, bul: 4, mal: 2, urun: 'Levha, plaka (döküm tooling plate)',
      kullanim: 'Gemi, deniz ortamı, kaynaklı tank ve basınçlı kap, kriyojenik uygulamalar, kalıp/tablası (döküm plaka).',
      not: 'Isıl işlemle sertleşmez. Deniz suyu korozyonu ve kaynak kabiliyeti en iyilerdendir. Talaşlı işlemede yapışkan.', sicak: '65 °C üzerinde uzun süre kalırsa gerilmeli korozyona hassaslaşır.' },
    { kod: '6060', temper: 'T6', en: 'EN AW-6060', sembol: 'AlMgSi', wnr: '3.3206', seri: 6, rho: 2.70, E: 69, Rm: 215, Rp: 170, A: 10, k: 200, cte: 23.4, tMax: 150,
      p: { isl: 3, kay: 4, kor: 5, elk: 5, sek: 4 }, bul: 5, mal: 1, urun: 'Ekstrüzyon profil, boru',
      kullanim: 'Mimari profiller, kasalar, soğutucu profilleri, dekoratif eloksallı parçalar (6063 ile benzer).',
      not: 'En kolay ekstrüde edilen alaşım; yüzey kalitesi ve dekoratif eloksal çok iyi. Dayanım orta.', sicak: '~150 °C üzerinde T6 dayanımı düşmeye başlar.' },
    { kod: '6061', temper: 'T6 / T651', en: 'EN AW-6061', sembol: 'AlMg1SiCu', wnr: '3.3211', seri: 6, rho: 2.70, E: 69, Rm: 310, Rp: 276, A: 12, k: 167, cte: 23.6, tMax: 150,
      p: { isl: 4, kay: 4, kor: 4, elk: 5, sek: 3 }, bul: 4, mal: 2, urun: 'Plaka, çubuk, boru',
      kullanim: 'Genel makine ve CNC parçaları, muhafazalar, braketler, fikstürler, savunma ve havacılık ikincil yapıları.',
      not: 'Dünyada en yaygın “genel amaçlı” alaşım. İyi işlenir, temiz eloksal alır, kaynaklanır (kaynak bölgesinde dayanım düşer).', sicak: '~150 °C üzerinde T6 dayanımı düşmeye başlar.' },
    { kod: '6082', temper: 'T6 / T651', en: 'EN AW-6082', sembol: 'AlSi1MgMn', wnr: '3.2315', seri: 6, rho: 2.70, E: 70, Rm: 310, Rp: 260, A: 10, k: 172, cte: 23.4, tMax: 150,
      p: { isl: 4, kay: 4, kor: 4, elk: 4, sek: 3 }, bul: 5, mal: 2, urun: 'Çubuk, plaka, profil',
      kullanim: 'Avrupa ve Türkiye’de 6061’in yerine en çok stoklanan yapısal alaşım: makine parçaları, kaynaklı konstrüksiyon.',
      not: '6061 ile hemen hemen aynı dayanım; Türkiye’de çubuk/plakada en kolay bulunanı. Eloksal görünümü 6061’e göre biraz daha mat.', sicak: '~150 °C üzerinde T6 dayanımı düşmeye başlar.' },
    { kod: '7075', temper: 'T6 / T651', en: 'EN AW-7075', sembol: 'AlZn5,5MgCu', wnr: '3.4365', seri: 7, rho: 2.81, E: 72, Rm: 572, Rp: 503, A: 11, k: 130, cte: 23.4, tMax: 120,
      p: { isl: 5, kay: 1, kor: 2, elk: 3, sek: 1 }, bul: 4, mal: 4, urun: 'Plaka, çubuk',
      kullanim: 'Yüksek yüklü havacılık/savunma parçaları, kalıplar, bisiklet ve spor ekipmanı, hafif ama çok dayanıklı parçalar.',
      not: 'En yüksek dayanımlı yaygın alaşım; çeliğe yakın akma. Çok temiz talaş verir. Kaynaklanmaz, gerilmeli korozyon çatlağına (SCC) yatkın; T73/T7351 daha dayanıklıdır. Eloksalda renk tonu kahverengimsi olabilir.', sicak: '100–120 °C üzerinde aşırı yaşlanma ile dayanım kaybeder.' }
  ];
  const AL_SERI = [
    { s: '1xxx', el: 'Saf Al (≥ %99)', isil: false, ozet: 'İletken, kolay şekillenir, korozyona çok dayanıklı; dayanımı çok düşük.', ornek: '1050A, 1100' },
    { s: '2xxx', el: 'Bakır (Cu)', isil: true, ozet: 'Yüksek dayanım ve yorulma; korozyona zayıf, kaynaklanmaz.', ornek: '2024, 2014, 2017' },
    { s: '3xxx', el: 'Mangan (Mn)', isil: false, ozet: 'Orta-düşük dayanım; iyi şekillendirme. Kaplar, ısı eşanjörleri.', ornek: '3003, 3103' },
    { s: '4xxx', el: 'Silisyum (Si)', isil: false, ozet: 'Kaynak teli, döküm ve dövme piston alaşımları; düşük ısıl genleşme. (4032 ısıl işlemle sertleşir.)', ornek: '4043, 4047, 4032' },
    { s: '5xxx', el: 'Magnezyum (Mg)', isil: false, ozet: 'Deniz suyu korozyonu ve kaynak çok iyi; soğuk işlemle sertleşir.', ornek: '5083, 5754, 5052' },
    { s: '6xxx', el: 'Mg + Si', isil: true, ozet: 'Dengeli: iyi dayanım, işleme, kaynak, eloksal. Ekstrüzyon alaşımı.', ornek: '6060, 6061, 6082' },
    { s: '7xxx', el: 'Çinko (Zn)', isil: true, ozet: 'En yüksek dayanım, çok iyi işlenir; kaynaklanmaz, SCC riski.', ornek: '7075, 7050, 7020' }
  ];
  const TEMPER = [
    ['O', 'Tavlı – en yumuşak'], ['H1x / H32 / H111', 'Soğuk işlemle sertleştirilmiş (ısıl işlem görmeyen alaşımlar)'],
    ['T4', 'Çözeltiye alma + doğal yaşlandırma'], ['T6', 'Çözeltiye alma + yapay yaşlandırma (tam sertlik)'],
    ['T651', 'T6 + germe ile gerilim giderme – işlemede çarpılma az, plaka/çubukta tercih edin'], ['T73 / T7351', '7075 için aşırı yaşlandırılmış: biraz daha düşük dayanım, çok daha iyi SCC dayanımı']
  ];

  // ---------- Çelik ----------
  const CELIK = [
    { kod: 'S235JR', wnr: '1.0038', grup: 'Yapı çeliği', std: 'EN 10025-2', ref: 'en10025', rho: 7.85, E: 210, Rm: 430, Rp: 235, A: 26, k: 50, cte: 12, tMax: 350,
      p: { isl: 3, kay: 5, kor: 1, ist: 1, sek: 5 }, bul: 5, mal: 1, manyetik: true, kullanim: 'Sac konstrüksiyon, şase, kaynaklı çerçeve, braket.', not: 'En ucuz ve en yaygın çelik. Mutlaka kaplama/boya ister.' },
    { kod: 'S355J2', wnr: '1.0577', grup: 'Yapı çeliği', std: 'EN 10025-2', ref: 'en10025', rho: 7.85, E: 210, Rm: 550, Rp: 355, A: 22, k: 45, cte: 12, tMax: 350,
      p: { isl: 3, kay: 5, kor: 1, ist: 1, sek: 4 }, bul: 5, mal: 1, manyetik: true, kullanim: 'Yüksek yüklü kaynaklı yapılar, platformlar, kaldırma ekipmanı.', not: 'S235’ten %50 daha yüksek akma; −20 °C çentik darbe garantili (J2). Kaynak kabiliyeti çok iyi.' },
    { kod: 'C45', wnr: '1.0503', grup: 'Islah çeliği', std: 'EN ISO 683-1', ref: 'en683', rho: 7.85, E: 210, Rm: 620, Rp: 340, A: 14, k: 46, cte: 11.5, tMax: 350,
      p: { isl: 4, kay: 2, kor: 1, ist: 4, sek: 3 }, bul: 5, mal: 1, manyetik: true, kullanim: 'Mil, pim, cıvata, dişli, makine parçası; indüksiyonla yüzey sertleştirilebilir.', not: 'Normalize (+N) halde verilir; ıslah veya indüksiyon sertleştirme ile dayanım artar. Kaynakta ön ısıtma gerekir.' },
    { kod: '42CrMo4', wnr: '1.7225', grup: 'Islah çeliği', std: 'EN ISO 683-2', ref: 'en683', rho: 7.85, E: 210, Rm: 1000, Rp: 750, A: 11, k: 42, cte: 12, tMax: 400,
      p: { isl: 3, kay: 1, kor: 1, ist: 5, sek: 2 }, bul: 4, mal: 2, manyetik: true, kullanim: 'Yüksek mukavemetli mil, dişli, krank, cıvata ve yüksek yüklü bağlantı parçaları.', not: 'Islah edilmiş (+QT) halde akma ~750 MPa. Kaynak önerilmez. AISI 4140 eşdeğeri.' },
    { kod: '1.4301', wnr: 'X5CrNi18-10', grup: 'Paslanmaz (ostenitik)', std: 'EN 10088-3', ref: 'en10088', rho: 7.9, E: 200, Rm: 600, Rp: 230, A: 45, k: 15, cte: 16.5, tMax: 800,
      p: { isl: 2, kay: 5, kor: 4, ist: 1, sek: 5 }, bul: 5, mal: 3, manyetik: false, kullanim: 'Gıda, kimya, genel paslanmaz parça ve sac. AISI 304.', not: 'En yaygın paslanmaz. Manyetik değildir. İşlemede yapışkan, takım aşındırır. Klorürlü ortamda (deniz) çukurcuk korozyonu yapabilir.' },
    { kod: '1.4404', wnr: 'X2CrNiMo17-12-2', grup: 'Paslanmaz (ostenitik)', std: 'EN 10088-3', ref: 'en10088', rho: 8.0, E: 200, Rm: 580, Rp: 220, A: 40, k: 15, cte: 16.0, tMax: 800,
      p: { isl: 2, kay: 5, kor: 5, ist: 1, sek: 5 }, bul: 4, mal: 4, manyetik: false, kullanim: 'Deniz ortamı, klorürlü su, ilaç ve medikal. AISI 316L.', not: 'Molibden sayesinde klorüre karşı 304’ten belirgin şekilde iyi. Düşük karbon (L): kaynak sonrası taneler arası korozyona dayanıklı.' },
    { kod: '1.4305', wnr: 'X8CrNiS18-9', grup: 'Paslanmaz (kolay işlenen)', std: 'EN 10088-3', ref: 'en10088', rho: 7.9, E: 200, Rm: 600, Rp: 190, A: 35, k: 15, cte: 16.5, tMax: 800,
      p: { isl: 4, kay: 1, kor: 3, ist: 1, sek: 3 }, bul: 4, mal: 3, manyetik: false, kullanim: 'Otomat tezgâhında seri işlenen paslanmaz parçalar: burç, pim, bağlantı elemanı. AISI 303.', not: 'Kükürt katkısı talaşı kırar, işleme çok kolaylaşır; karşılığında korozyon dayanımı 304’ten düşük ve kaynaklanmaz.' },
    { kod: '1.4542', wnr: 'X5CrNiCuNb16-4', grup: 'Paslanmaz (çökelme sertleşmeli)', std: 'EN 10088-3', ref: 'en10088', rho: 7.8, E: 197, Rm: 1000, Rp: 800, A: 12, k: 18, cte: 10.8, tMax: 300,
      p: { isl: 3, kay: 3, kor: 4, ist: 5, sek: 2 }, bul: 3, mal: 4, manyetik: true, kullanim: 'Yüksek dayanım + paslanmazlık gereken mil, valf, havacılık bağlantı parçası. 17-4PH.', not: 'Yaşlandırma ile 800–1000 MPa akma. Manyetiktir. Isıl işlem durumu (ör. P800, H1150) çizimde belirtilmelidir.' }
  ];
  const CELIK_GRUP = [
    { id: 'yapi', g: 'Yapı çelikleri', ozet: 'Ucuz, kaynaklı konstrüksiyon. Paslanır, kaplama ister.', ornek: 'S235JR, S275JR, S355J2' },
    { id: 'islah', g: 'Islah çelikleri', ozet: 'Isıl işlemle yüksek dayanım ve sertlik; mil, dişli, pim.', ornek: 'C45, 42CrMo4, 34CrNiMo6' },
    { id: 'sement', g: 'Sementasyon çelikleri', ozet: 'Yüzeyi sert (58–62 HRC), çekirdeği tok; dişli, kam, pim.', ornek: '16MnCr5' },
    { id: 'otomat', g: 'Otomat çelikleri', ozet: 'Seri talaşlı imalat için en kolay işlenen çelikler; kaynaklanmaz.', ornek: '11SMnPb30' },
    { id: 'takim', g: 'Takım ve kalıp çelikleri', ozet: 'Kalıp, zımba, kesici; sertleştirilerek kullanılır.', ornek: '1.2312, 1.2379' },
    { id: 'ostenitik', g: 'Ostenitik paslanmaz', ozet: 'Paslanmaz, manyetik değil, kaynaklanır; işlemesi zordur.', ornek: '1.4301 (304), 1.4307 (304L), 1.4404 (316L)' },
    { id: 'kolay', g: 'Kolay işlenen paslanmaz', ozet: 'Seri talaşlı imalat için; kaynaklanmaz.', ornek: '1.4305 (303)' },
    { id: 'martenzit', g: 'Martenzitik paslanmaz', ozet: 'Sertleştirilebilir paslanmaz: bıçak, valf, pompa mili. Manyetiktir.', ornek: '1.4021 (420)' },
    { id: 'dubleks', g: 'Dubleks paslanmaz', ozet: '304/316’nın yaklaşık 2 katı akma, klorüre çok dayanıklı.', ornek: '1.4462 (2205)' },
    { id: 'cokelme', g: 'Çökelme sertleşmeli paslanmaz', ozet: 'Paslanmaz + yüksek dayanım; yaşlandırma ile sertleşir.', ornek: '1.4542 (17-4PH)' },
    { id: 'dokme', g: 'Dökme demir', ozet: 'Karmaşık gövdeler için döküm; titreşim sönümü iyi, ucuz.', ornek: 'EN-GJS-400-15' }
  ];
  const GID = { 'S235JR': 'yapi', 'S355J2': 'yapi', 'C45': 'islah', '42CrMo4': 'islah', '1.4301': 'ostenitik', '1.4404': 'ostenitik', '1.4305': 'kolay', '1.4542': 'cokelme' };
  CELIK.forEach(c => { c.gid = GID[c.kod]; });
  CELIK.push(
    { kod: 'S275JR', wnr: '1.0044', gid: 'yapi', grup: 'Yapı çeliği', std: 'EN 10025-2', ref: 'en10025', rho: 7.85, E: 210, Rm: 480, Rp: 275, A: 23, k: 50, cte: 12, tMax: 350,
      p: { isl: 3, kay: 5, kor: 1, ist: 1, sek: 5 }, bul: 4, mal: 1, manyetik: true, kullanim: 'S235 ile S355 arası yük taşıyan kaynaklı şase, kolon, kiriş.', not: 'Eski St44 karşılığı. S235 yetmeyip S355 gerekmeyen yerlerde.' },
    { kod: '34CrNiMo6', wnr: '1.6582', gid: 'islah', grup: 'Islah çeliği', std: 'EN ISO 683-2', ref: 'en683', rho: 7.85, E: 210, Rm: 1100, Rp: 900, A: 10, k: 38, cte: 12, tMax: 400,
      p: { isl: 2, kay: 1, kor: 1, ist: 5, sek: 2 }, bul: 3, mal: 3, manyetik: true, kullanim: 'Büyük kesitli, çok yüksek yüklü mil, krank, dişli ve savunma parçaları.', not: 'Nikel sayesinde büyük çaplarda da çekirdeğe kadar sertleşir; 42CrMo4’ün yetmediği kalın kesitlerde. AISI 4340 benzeri.' },
    { kod: '16MnCr5', wnr: '1.7131', gid: 'sement', grup: 'Sementasyon çeliği', std: 'EN ISO 683-3', ref: 'en683', rho: 7.85, E: 210, Rm: 1000, Rp: 700, A: 10, k: 44, cte: 12, tMax: 200,
      p: { isl: 4, kay: 2, kor: 1, ist: 5, sek: 3 }, bul: 5, mal: 2, manyetik: true, kullanim: 'Dişli, kam, pim, aşınmaya maruz miller; yüzeyi sert çekirdeği tok olması gereken parçalar.', not: 'Değerler sementasyon + sertleştirme sonrası çekirdek içindir; yüzey 58–62 HRC. Çizimde sertlik derinliği (ör. CHD 0,8–1,0 mm) yazılmalı.' },
    { kod: '11SMnPb30', wnr: '1.0718', gid: 'otomat', grup: 'Otomat çeliği', std: 'EN 10087', ref: 'en10087', rho: 7.85, E: 210, Rm: 460, Rp: 375, A: 8, k: 52, cte: 12, tMax: 300,
      p: { isl: 5, kay: 1, kor: 1, ist: 1, sek: 2 }, bul: 5, mal: 1, manyetik: true, kullanim: 'Otomat tornada seri üretilen burç, pim, ara parça, bağlantı parçaları.', not: 'Kükürt ve kurşun talaşı kırar: en kolay işlenen çelik. Kaynaklanmaz, yüksek yük için uygun değil. Kurşun RoHS istisnalı; kurşunsuz muadili 11SMn30.' },
    { kod: '1.2312', wnr: '40CrMnMoS8-6', gid: 'takim', grup: 'Takım/kalıp çeliği', std: 'ISO 4957', ref: 'iso4957', rho: 7.85, E: 210, Rm: 1000, Rp: 850, A: 12, k: 34, cte: 12.5, tMax: 300,
      p: { isl: 4, kay: 2, kor: 1, ist: 4, sek: 2 }, bul: 4, mal: 3, manyetik: true, kullanim: 'Plastik enjeksiyon kalıp gövdeleri, fikstür ve kalıp plakaları.', not: 'Ön sertleştirilmiş (~300 HB) satılır, ısıl işlem gerektirmeden işlenir. Kükürtlü olduğu için iyi işlenir, parlatma sınırlıdır. P20+S karşılığı.' },
    { kod: '1.2379', wnr: 'X153CrMoV12', gid: 'takim', grup: 'Takım/kalıp çeliği', std: 'ISO 4957', ref: 'iso4957', rho: 7.7, E: 210, Rm: 850, Rp: 600, A: 10, k: 20, cte: 10.5, tMax: 425,
      p: { isl: 2, kay: 1, kor: 2, ist: 5, sek: 1 }, bul: 4, mal: 4, manyetik: true, kullanim: 'Kesme ve zımbalama kalıbı, zımba, ovalama, aşınma plakası.', not: 'Mekanik değerler tavlı haldedir; sertleştirilince 58–62 HRC. Aşınma dayanımı çok yüksek, tokluğu düşük. Sertleştirme sonrası taşlama veya tel erozyon gerekir. AISI D2.' },
    { kod: '1.4307', wnr: 'X2CrNi18-9', gid: 'ostenitik', grup: 'Paslanmaz (ostenitik)', std: 'EN 10088-3', ref: 'en10088', rho: 7.9, E: 200, Rm: 600, Rp: 220, A: 45, k: 15, cte: 16.5, tMax: 800,
      p: { isl: 2, kay: 5, kor: 4, ist: 1, sek: 5 }, bul: 5, mal: 3, manyetik: false, kullanim: 'Kaynaklı paslanmaz konstrüksiyon, tank, boru. AISI 304L.', not: 'Düşük karbonlu 304: kaynak sonrası taneler arası korozyona dayanıklı. Kaynaklı parçalarda 1.4301 yerine tercih edin.' },
    { kod: '1.4021', wnr: 'X20Cr13', gid: 'martenzit', grup: 'Paslanmaz (martenzitik)', std: 'EN 10088-3', ref: 'en10088', rho: 7.7, E: 215, Rm: 750, Rp: 550, A: 12, k: 30, cte: 10.5, tMax: 450,
      p: { isl: 3, kay: 1, kor: 2, ist: 5, sek: 2 }, bul: 4, mal: 2, manyetik: true, kullanim: 'Pompa ve valf milleri, kesici, cerrahi alet, aşınan paslanmaz parçalar. AISI 420.', not: 'Değerler ıslah (+QT) halde. Sertleştirilebilir ama korozyon dayanımı 304’ten belirgin şekilde düşük. Manyetiktir; kaynaklanmaz.' },
    { kod: '1.4462', wnr: 'X2CrNiMoN22-5-3', gid: 'dubleks', grup: 'Paslanmaz (dubleks)', std: 'EN 10088-3', ref: 'en10088', rho: 7.8, E: 200, Rm: 750, Rp: 500, A: 25, k: 15, cte: 13, tMax: 280,
      p: { isl: 2, kay: 4, kor: 5, ist: 1, sek: 3 }, bul: 3, mal: 4, manyetik: true, kullanim: 'Deniz suyu, kimya ve petrol ekipmanı, yüksek yüklü paslanmaz parçalar. 2205.', not: '316L’nin yaklaşık 2 katı akma; klorür ve gerilmeli korozyona çok dayanıklı. ~280 °C üzerinde gevrekleşme riski. İşlemesi 316L’den zor.' },
    { kod: 'EN-GJS-400-15', wnr: '5.3106', gid: 'dokme', grup: 'Küresel grafitli dökme demir', std: 'EN 1563', ref: 'en1563', rho: 7.1, E: 169, Rm: 400, Rp: 250, A: 15, k: 36, cte: 12.5, tMax: 350,
      p: { isl: 4, kay: 1, kor: 2, ist: 2, sek: 1 }, bul: 4, mal: 1, manyetik: true, kullanim: 'Pompa, valf ve dişli kutusu gövdeleri, makine tezgâhı parçaları, karmaşık döküm gövdeler.', not: 'Sünek döküm: gri dökme demire göre çok daha tok. İyi işlenir, titreşim sönümü iyidir. Kaynak önerilmez. Eski GGG40.' }
  );
  // Ek alüminyum alaşımları
  ALUMINYUM.push(
    { kod: '2011', temper: 'T3', en: 'EN AW-2011', sembol: 'AlCu6BiPb', wnr: '3.1655', seri: 2, rho: 2.83, E: 70, Rm: 379, Rp: 296, A: 15, k: 151, cte: 22.9, tMax: 150,
      p: { isl: 5, kay: 1, kor: 1, elk: 2, sek: 2 }, bul: 4, mal: 3, urun: 'Çekme çubuk',
      kullanim: 'Otomat tornada seri üretilen vida, burç, pim, bağlantı parçaları.', not: 'Alüminyumun “otomat” alaşımı: talaş kırılır, en kolay işlenen Al. Korozyona zayıf, kaynaklanmaz, eloksal kalitesi düşük. Kurşunlu; kurşunsuz muadili 2033/6026.', sicak: '~150 °C üzerinde dayanım düşer.' },
    { kod: '2014', temper: 'T6 / T651', en: 'EN AW-2014', sembol: 'AlCu4SiMg', wnr: '3.1255', seri: 2, rho: 2.80, E: 73, Rm: 483, Rp: 414, A: 13, k: 154, cte: 23.0, tMax: 150,
      p: { isl: 4, kay: 1, kor: 1, elk: 2, sek: 2 }, bul: 3, mal: 4, urun: 'Dövme, çubuk, plaka',
      kullanim: 'Dövme havacılık ve otomotiv parçaları, ağır yüklü braketler, jant.', not: 'Yüksek dayanım ve sertlik; dövmeye çok uygun. Bakır nedeniyle mutlaka koruyucu kaplama ister.', sicak: '~150 °C’ye kadar dayanımını iyi korur.' },
    { kod: '2017A', temper: 'T4 / T451', en: 'EN AW-2017A', sembol: 'AlCu4MgSi(A)', wnr: '3.1325', seri: 2, rho: 2.79, E: 72, Rm: 425, Rp: 275, A: 13, k: 134, cte: 23.6, tMax: 150,
      p: { isl: 4, kay: 1, kor: 2, elk: 3, sek: 3 }, bul: 4, mal: 3, urun: 'Çubuk, plaka',
      kullanim: 'Genel yüksek dayanımlı makine parçaları, perçin, cıvata; “Avional / Dural”.', not: 'Türkiye’de çubukta sık bulunan 2xxx alaşımı. 6082’den belirgin şekilde dayanıklı, iyi işlenir; korozyona zayıf.', sicak: '~150 °C üzerinde dayanım düşer.' },
    { kod: '3003', temper: 'H14', en: 'EN AW-3003', sembol: 'AlMn1Cu', wnr: '3.0517', seri: 3, rho: 2.73, E: 69, Rm: 150, Rp: 145, A: 8, k: 159, cte: 23.2, tMax: 150,
      p: { isl: 2, kay: 5, kor: 5, elk: 4, sek: 5 }, bul: 4, mal: 1, urun: 'Levha, şerit, folyo',
      kullanim: 'Isı eşanjörü, radyatör, çatı ve cephe kaplama, kap, depo, sac kutu.', not: '1xxx’ten yaklaşık %20 daha dayanıklı, şekillendirmesi çok iyi. Isıl işlemle sertleşmez.', sicak: 'Isıl işlemsiz; dayanım zaten düşüktür.' },
    { kod: '4032', temper: 'T6', en: 'EN AW-4032', sembol: 'AlSi12,5MgCuNi', wnr: '–', seri: 4, rho: 2.68, E: 79, Rm: 380, Rp: 315, A: 9, k: 154, cte: 19.4, tMax: 200,
      p: { isl: 3, kay: 1, kor: 3, elk: 1, sek: 1 }, bul: 2, mal: 3, urun: 'Dövme, çubuk',
      kullanim: 'Dövme piston, kompresör parçaları; düşük ısıl genleşme ve aşınma dayanımı gereken yerler.', not: 'Yüksek silisyum: ısıl genleşmesi en düşük Al alaşımlarından, aşınmaya dayanıklı. Eloksal gri ve kalitesiz; takım aşındırır.', sicak: 'Yüksek sıcaklıkta dayanımını iyi korur (~200 °C).' },
    { kod: '5005', temper: 'H14', en: 'EN AW-5005', sembol: 'AlMg1(B)', wnr: '3.3315', seri: 5, rho: 2.70, E: 69, Rm: 159, Rp: 152, A: 6, k: 200, cte: 23.8, tMax: 65,
      p: { isl: 2, kay: 5, kor: 5, elk: 5, sek: 4 }, bul: 4, mal: 1, urun: 'Levha',
      kullanim: 'Dekoratif eloksallı sac, cephe paneli, ön panel, isim plakası.', not: 'Eloksal kalitesi en iyi sac alaşımlarından; renk tonu homojen. Dayanım düşük.', sicak: 'Isıl işlemsiz.' },
    { kod: '5052', temper: 'H32', en: 'EN AW-5052', sembol: 'AlMg2,5', wnr: '3.3523', seri: 5, rho: 2.68, E: 70, Rm: 228, Rp: 193, A: 12, k: 138, cte: 23.8, tMax: 65,
      p: { isl: 2, kay: 5, kor: 5, elk: 4, sek: 4 }, bul: 4, mal: 2, urun: 'Levha',
      kullanim: 'Büküm sac muhafaza, elektronik kutu, yakıt tankı, deniz ortamı sac parçaları.', not: 'Bükülebilen sacta en yaygın tercih: iyi dayanım, çok iyi korozyon ve büküm. 6061 sac bükümde çatlarken 5052 çatlamaz.', sicak: '65 °C üzerinde uzun süre kalırsa gerilmeli korozyona hassaslaşabilir.' },
    { kod: '5754', temper: 'H111', en: 'EN AW-5754', sembol: 'AlMg3', wnr: '3.3535', seri: 5, rho: 2.67, E: 70, Rm: 215, Rp: 100, A: 18, k: 147, cte: 23.9, tMax: 65,
      p: { isl: 2, kay: 5, kor: 5, elk: 4, sek: 5 }, bul: 5, mal: 2, urun: 'Levha, gözyaşı sac',
      kullanim: 'Avrupa’da 5052’nin muadili: sac muhafaza, araç üst yapısı, tank, gözyaşı (baklava) sac.', not: 'Türkiye’de sacta en kolay bulunan 5xxx alaşımı. Çok iyi kaynak, büküm ve korozyon.', sicak: '65 °C üzerinde uzun süre kalırsa gerilmeli korozyona hassaslaşabilir.' },
    { kod: '6063', temper: 'T6', en: 'EN AW-6063', sembol: 'AlMg0,7Si', wnr: '–', seri: 6, rho: 2.70, E: 69, Rm: 241, Rp: 214, A: 12, k: 200, cte: 23.4, tMax: 150,
      p: { isl: 3, kay: 4, kor: 5, elk: 5, sek: 4 }, bul: 5, mal: 1, urun: 'Ekstrüzyon profil, boru',
      kullanim: 'Mimari profil, soğutucu (heatsink), boru, karmaşık kesitli ince cidarlı profiller.', not: '6060’tan biraz daha dayanıklı ekstrüzyon alaşımı; ısıl iletkenliği yüksek, eloksal görünümü çok iyi.', sicak: '~150 °C üzerinde T6 dayanımı düşmeye başlar.' },
    { kod: '6005A', temper: 'T6', en: 'EN AW-6005A', sembol: 'AlSiMg(A)', wnr: '3.3210', seri: 6, rho: 2.70, E: 69, Rm: 270, Rp: 225, A: 8, k: 180, cte: 23.5, tMax: 150,
      p: { isl: 3, kay: 4, kor: 4, elk: 4, sek: 3 }, bul: 3, mal: 2, urun: 'Ekstrüzyon profil',
      kullanim: 'Yapısal ince cidarlı profiller: raylı araç, merdiven, iskele, sanayi profilleri.', not: '6063 ile 6082 arası dayanım; ince cidarlı karmaşık profilleri 6082’den kolay ekstrüde edilir.', sicak: '~150 °C üzerinde T6 dayanımı düşmeye başlar.' },
    { kod: '7020', temper: 'T6', en: 'EN AW-7020', sembol: 'AlZn4,5Mg1', wnr: '3.4335', seri: 7, rho: 2.78, E: 70, Rm: 350, Rp: 280, A: 10, k: 140, cte: 23.1, tMax: 120,
      p: { isl: 4, kay: 4, kor: 3, elk: 3, sek: 3 }, bul: 3, mal: 3, urun: 'Plaka, profil',
      kullanim: 'Kaynaklı yüksek dayanımlı yapılar: askeri köprü, zırhlı araç gövdesi, bisiklet kadrosu.', not: 'Kaynaklanabilen tek yaygın 7xxx alaşımı; kaynak bölgesi oda sıcaklığında kendiliğinden kısmen yaşlanıp dayanım kazanır.', sicak: '~120 °C üzerinde dayanım düşer.' },
    { kod: '7050', temper: 'T7451', en: 'EN AW-7050', sembol: 'AlZn6CuMgZr', wnr: '3.4144', seri: 7, rho: 2.83, E: 72, Rm: 524, Rp: 469, A: 11, k: 157, cte: 23.5, tMax: 120,
      p: { isl: 5, kay: 1, kor: 3, elk: 3, sek: 1 }, bul: 2, mal: 5, urun: 'Kalın plaka',
      kullanim: 'Kalın kesitli havacılık parçaları: kanat bağlantıları, gövde çerçeveleri.', not: 'Kalın plakada 7075’ten daha iyi dayanım–tokluk–SCC dengesi. T7451 aşırı yaşlandırılmış ve gerilim giderilmiştir.', sicak: '~120 °C üzerinde dayanım düşer.' }
  );
  ALUMINYUM.sort((a, b) => a.seri - b.seri || a.kod.localeCompare(b.kod));


  // ---------- Kaplama / boya ----------
  // taban: al | celik | paslanmaz ; puanlar 1–5: kor (korozyon), asi (aşınma), mal (maliyet: 1 ucuz)
  const KAPLAMA = [
    { id: 'kromat3', taban: ['al'], ad: 'Kromat dönüşüm – Alodine (Class 3, iletken)', std: 'MIL-DTL-5541 Tip II Class 3', ref: ['mil5541b'], kal: '< 1 µm', kalUm: 0.5, iletken: true, kor: 3, asi: 1, mal: 1, boyut: 'Yok', renk: 'Şeffaf / açık mavi (Tip II), altın-sarı (Tip I)',
      ne: 'EMI conta temas yüzeyleri, topraklama, elektrik kontak yüzeyleri, iletken kalması gereken muhafazalar.', dikkat: 'Çizilmeye karşı dayanıksız; boyasız dış ortamda sınırlı koruma. Tip I (Cr6) RoHS/REACH kısıtlıdır, Tip II tercih edin.',
      notTR: 'YÜZEY İŞLEMİ: MIL-DTL-5541 TİP II CLASS 3 KİMYASAL DÖNÜŞÜM KAPLAMA (Cr6 İÇERMEZ).', notEN: 'FINISH: CHEMICAL CONVERSION COAT PER MIL-DTL-5541, TYPE II, CLASS 3 (NON-HEXAVALENT CHROMIUM).' },
    { id: 'kromat1a', taban: ['al'], ad: 'Kromat dönüşüm – Alodine (Class 1A, korozyon/boya altı)', std: 'MIL-DTL-5541 Tip II Class 1A', ref: ['mil5541b'], kal: '< 1 µm', kalUm: 0.8, iletken: false, kor: 3, asi: 1, mal: 1, boyut: 'Yok',
      renk: 'Şeffaf / açık mavi', ne: 'Boya altı ön işlem, boyasız parçada en iyi dönüşüm kaplaması korozyonu.', dikkat: 'Class 3’e göre daha kalın: temas direnci daha yüksek, EMI/topraklama yüzeyinde Class 3 kullanın.',
      notTR: 'YÜZEY İŞLEMİ: MIL-DTL-5541 TİP II CLASS 1A KİMYASAL DÖNÜŞÜM KAPLAMA (Cr6 İÇERMEZ).', notEN: 'FINISH: CHEMICAL CONVERSION COAT PER MIL-DTL-5541, TYPE II, CLASS 1A.' },
    { id: 'eloksal', taban: ['al'], ad: 'Eloksal (anodik oksit, Tip II)', std: 'MIL-PRF-8625 Tip II / ISO 7599', ref: ['mil8625', 'iso7599'], kal: '5–25 µm (tipik 10–15)', kalUm: 15, iletken: false, kor: 4, asi: 3, mal: 2, boyut: 'Kalınlığın ~%50’si dışa büyür',
      renk: 'Doğal (Class 1) veya renkli/siyah (Class 2)', ne: 'Görünür ve dekoratif parçalar, genel korozyon koruması, renk kodlama, el temaslı yüzeyler.', dikkat: 'Elektrik yalıtkandır: topraklama/EMI yüzeyleri ve vida dişleri maskelenmeli. Hassas geçmelerde kaplama payı bırakın.',
      notTR: 'YÜZEY İŞLEMİ: MIL-PRF-8625 TİP II CLASS 2 SİYAH ELOKSAL, 10–15 µm, SIZDIRMAZLIK (SEAL) UYGULANACAKTIR.', notEN: 'FINISH: ANODIZE PER MIL-PRF-8625, TYPE II, CLASS 2, BLACK, 10–15 µm, SEALED.' },
    { id: 'serteloksal', taban: ['al'], ad: 'Sert eloksal (Tip III)', std: 'MIL-PRF-8625 Tip III / ISO 10074', ref: ['mil8625', 'iso10074'], kal: '25–75 µm (tipik 50)', kalUm: 50, iletken: false, kor: 4, asi: 5, mal: 3, boyut: 'Kalınlığın ~%50’si dışa büyür',
      renk: 'Koyu gri / bronz; siyah boyanabilir', ne: 'Aşınan, kayan yüzeyler; kılavuz, piston, yüksek yüzey sertliği gereken parçalar.', dikkat: 'Keskin kenarlarda yanma/çatlak: kenarları R ≥ 0,5 mm yapın. Yorulma dayanımını düşürür. 2xxx ve 7xxx alaşımlarda kalite sınırlı.',
      notTR: 'YÜZEY İŞLEMİ: MIL-PRF-8625 TİP III CLASS 1 SERT ELOKSAL, 50 ±10 µm. ÖLÇÜLER KAPLAMA SONRASI İÇİNDİR.', notEN: 'FINISH: HARD ANODIZE PER MIL-PRF-8625, TYPE III, CLASS 1, 50 ±10 µm. DIMENSIONS APPLY AFTER COATING.' },
    { id: 'enp', taban: ['al', 'celik'], ad: 'Akımsız nikel (kimyasal nikel)', std: 'AMS 2404 / ASTM B733 / ISO 4527', ref: ['ams2404'], kal: '5–25 µm', kalUm: 12, iletken: true, kor: 4, asi: 4, mal: 4, boyut: 'Her yüzeyde eşit kalınlık',
      renk: 'Parlak metalik', ne: 'Hem iletken hem aşınmaya dayanıklı yüzey; karmaşık şekillerde eşit kalınlık; lehimlenebilir yüzey.', dikkat: 'Pahalı. Hasar görürse Ni–Al galvanik çifti alüminyumu hızlı korozyona uğratır.',
      notTR: 'YÜZEY İŞLEMİ: AMS 2404 AKIMSIZ NİKEL KAPLAMA, 12 ±3 µm.', notEN: 'FINISH: ELECTROLESS NICKEL PER AMS 2404, 12 ±3 µm.' },
    { id: 'yasboya', taban: ['al', 'celik'], ad: 'Yaş boya sistemi (epoksi astar + PU son kat)', std: 'MIL-PRF-23377 + MIL-PRF-85285 / ISO 12944', ref: ['mil23377', 'iso12944'], kal: '50–100 µm', kalUm: 80, iletken: false, kor: 5, asi: 2, mal: 3, boyut: 'Büyük – geçme yüzeyleri maskelenmeli',
      renk: 'RAL / FED-STD-595 renk', ne: 'Askeri/dış ortam cihazları, kamuflaj renkleri, en yüksek atmosferik korozyon koruması.', dikkat: 'Alüminyumda mutlaka kromat (Class 1A) ön işlem; çelikte fosfat veya kumlama. Temas ve geçme yüzeyleri maskelenir.',
      notTR: 'YÜZEY İŞLEMİ: MIL-DTL-5541 TİP II CLASS 1A ÖN İŞLEM + MIL-PRF-23377 EPOKSİ ASTAR + MIL-PRF-85285 POLİÜRETAN SON KAT, RENK RAL ____, TOPLAM KURU FİLM 60–100 µm.', notEN: 'FINISH: PRETREAT PER MIL-DTL-5541 TYPE II CLASS 1A, PRIME PER MIL-PRF-23377, TOPCOAT PER MIL-PRF-85285, COLOR RAL ____, TOTAL DFT 60–100 µm.' },
    { id: 'tozboya', taban: ['al', 'celik'], ad: 'Elektrostatik toz boya (polyester)', std: 'EN 12206-1 / Qualicoat (Al), ISO 12944 (çelik)', ref: ['en12206', 'iso12944'], kal: '60–120 µm', kalUm: 80, iletken: false, kor: 4, asi: 3, mal: 2, boyut: 'Büyük – geçme yüzeyleri maskelenmeli',
      renk: 'RAL renk, mat/parlak/doku', ne: 'Endüstriyel kabin, şase, dış ortam parçaları; ekonomik ve dayanıklı renkli yüzey.', dikkat: 'Fırınlama 180–200 °C: 7075 ve 2024’te dayanım kaybı olabilir. Delik ve dişler maskelenir/tıpalanır.',
      notTR: 'YÜZEY İŞLEMİ: KROMATSIZ ÖN İŞLEM + ELEKTROSTATİK POLYESTER TOZ BOYA, RAL ____ MAT, 60–100 µm. DİŞLİ DELİKLER VE TEMAS YÜZEYLERİ MASKELENECEKTİR.', notEN: 'FINISH: CHROME-FREE PRETREATMENT + POLYESTER POWDER COAT, RAL ____ MATT, 60–100 µm. MASK THREADS AND CONTACT SURFACES.' },
    { id: 'cinko', taban: ['celik'], ad: 'Elektrolitik çinko + pasivasyon', std: 'ISO 2081 (bağlantı elemanı: ISO 4042)', ref: ['iso2081'], kal: '5–12 µm', kalUm: 8, iletken: true, kor: 2, asi: 2, mal: 1, boyut: 'Küçük',
      renk: 'Gümüş/mavi (şeffaf pasivasyon), sarı, siyah', ne: 'İç ortam çelik parçalar ve standart bağlantı elemanları; ekonomik koruma.', dikkat: '10.9 ve 12.9 cıvatalarda hidrojen gevrekliği riski: kaplama sonrası fırınlama veya lamel çinko isteyin. Dış ortamda kısa ömür.',
      notTR: 'YÜZEY İŞLEMİ: ISO 2081’E GÖRE ELEKTROLİTİK ÇİNKO KAPLAMA, EN AZ 8 µm, Cr6 İÇERMEYEN ŞEFFAF PASİVASYON.', notEN: 'FINISH: ELECTROPLATED ZINC PER ISO 2081, 8 µm MIN, Cr(VI)-FREE CLEAR PASSIVATE.' },
    { id: 'cinkonikel', taban: ['celik'], ad: 'Çinko-nikel (Zn-Ni)', std: 'ISO 19598', ref: ['iso19598'], kal: '8–12 µm', kalUm: 10, iletken: true, kor: 4, asi: 2, mal: 2, boyut: 'Küçük',
      renk: 'Gümüş veya siyah', ne: 'Otomotiv ve dış ortam; alüminyumla temas eden çelik parçalar (galvanik olarak uyumlu).', dikkat: 'Düz çinkodan pahalı; tedarikçi sayısı daha az.',
      notTR: 'YÜZEY İŞLEMİ: ISO 19598’E GÖRE ÇİNKO-NİKEL KAPLAMA (%12–16 Ni), 8–12 µm, Cr6 İÇERMEYEN PASİVASYON.', notEN: 'FINISH: ZINC-NICKEL PER ISO 19598 (12–16 % Ni), 8–12 µm, Cr(VI)-FREE PASSIVATE.' },
    { id: 'galvaniz', taban: ['celik'], ad: 'Sıcak daldırma galvaniz', std: 'ISO 1461', ref: ['iso1461'], kal: '45–85 µm', kalUm: 70, iletken: true, kor: 5, asi: 3, mal: 2, boyut: 'Büyük, kalınlık düzensiz',
      renk: 'Mat gri', ne: 'Dış ortam çelik konstrüksiyon, direk, şase; uzun ömürlü (onlarca yıl) koruma.', dikkat: 'Hassas ölçülü ve dişli parçalara uygun değil; ince saclar çarpılabilir. Havalandırma delikleri gerekir.',
      notTR: 'YÜZEY İŞLEMİ: ISO 1461’E GÖRE SICAK DALDIRMA GALVANİZ.', notEN: 'FINISH: HOT-DIP GALVANIZE PER ISO 1461.' },
    { id: 'fosfat', taban: ['celik'], ad: 'Fosfat (çinko / manganez fosfat)', std: 'ISO 9717', ref: ['iso9717'], kal: '2–15 µm', kalUm: 8, iletken: false, kor: 1, asi: 3, mal: 1, boyut: 'Küçük',
      renk: 'Gri-siyah', ne: 'Boya altı ön işlem; manganez fosfat yağ ile aşınma alıştırma yüzeyi (dişli, mil).', dikkat: 'Tek başına korozyon koruması zayıf; yağ veya boya ile birlikte kullanılır.',
      notTR: 'YÜZEY İŞLEMİ: ISO 9717’YE GÖRE ÇİNKO FOSFAT + KOROZYON ÖNLEYİCİ YAĞ.', notEN: 'FINISH: ZINC PHOSPHATE PER ISO 9717 + CORROSION-PREVENTIVE OIL.' },
    { id: 'brunur', taban: ['celik'], ad: 'Siyah oksit (brünür)', std: 'MIL-DTL-13924', ref: ['mil13924'], kal: '~1 µm', kalUm: 1, iletken: true, kor: 1, asi: 2, mal: 1, boyut: 'Yok',
      renk: 'Siyah', ne: 'Takım, fikstür, kalıp parçaları; ölçü değişmemesi gereken çelik parçada görünüm ve hafif koruma.', dikkat: 'Yağsız halde hemen paslanır; iç ortam içindir.',
      notTR: 'YÜZEY İŞLEMİ: MIL-DTL-13924 SİYAH OKSİT (BRÜNÜR) + YAĞ.', notEN: 'FINISH: BLACK OXIDE PER MIL-DTL-13924 + OIL.' },
    { id: 'pasivasyon', taban: ['paslanmaz'], ad: 'Pasivasyon', std: 'ASTM A967 / AMS 2700', ref: ['astmA967'], kal: '< 0,01 µm', kalUm: 0.01, iletken: true, kor: 5, asi: 1, mal: 1, boyut: 'Yok',
      renk: 'Değişmez', ne: 'İşleme sonrası yüzeydeki serbest demiri temizleyip paslanmaz çeliğin doğal korozyon direncini geri kazandırmak.', dikkat: 'Kaplama değildir; ölçü değiştirmez. 1.4305 (303) gibi kükürtlü sınıflarda yöntemi tedarikçiyle seçin.',
      notTR: 'YÜZEY İŞLEMİ: ASTM A967’YE GÖRE PASİVASYON (SİTRİK ASİT).', notEN: 'FINISH: PASSIVATE PER ASTM A967 (CITRIC).' },
    { id: 'pasToz', taban: ['paslanmaz'], ad: 'Toz boya (paslanmaz üzeri)', std: 'ISO 12944', ref: ['iso12944'], kal: '60–120 µm', kalUm: 80, iletken: false, kor: 5, asi: 3, mal: 2, boyut: 'Büyük', renk: 'RAL',
      ne: 'Renk istenen paslanmaz kabin ve paneller.', dikkat: 'Yapışma için hafif kumlama veya astar gerekir.',
      notTR: 'YÜZEY İŞLEMİ: HAFİF KUMLAMA + ELEKTROSTATİK POLYESTER TOZ BOYA, RAL ____, 60–100 µm.', notEN: 'FINISH: LIGHT GRIT BLAST + POLYESTER POWDER COAT, RAL ____, 60–100 µm.' }
  ];
  // "Ne istiyorum?" kriterleri
  const ISTEK = [
    { k: 'iletken', ad: 'Yüzey elektriksel iletken kalsın (EMI, topraklama)' },
    { k: 'asinma', ad: 'Aşınmaya / çizilmeye dayanıklı olsun' },
    { k: 'disOrtam', ad: 'Dış ortam / tuz / nem' },
    { k: 'renk', ad: 'Renkli veya dekoratif görünüm' },
    { k: 'boyut', ad: 'Ölçü değişmesin (hassas geçme, diş)' },
    { k: 'ucuz', ad: 'En düşük maliyet' }
  ];

  // ---------- Cıvata ----------
  // VDI 2230 tablosu (Marek): [µ] → [F88, F109, F129, M88, M109, M129]  F: kN, M: Nm
  const TORK = {
    M4: { '0.08': [4.40, 6.40, 7.5, 2.2, 3.2, 3.8], '0.10': [4.20, 6.20, 7.3, 2.5, 3.7, 4.3], '0.12': [4.05, 6.00, 7.0, 2.8, 4.1, 4.8], '0.14': [3.90, 5.70, 6.7, 3.1, 4.5, 5.3] },
    M5: { '0.08': [7.16, 10.50, 12.3, 4.3, 6.3, 7.3], '0.10': [6.90, 10.10, 11.9, 4.9, 7.2, 8.5], '0.12': [6.63, 9.74, 11.4, 5.5, 8.1, 9.5], '0.14': [6.36, 9.34, 10.9, 6.0, 8.9, 10.4] },
    M6: { '0.08': [10.10, 14.90, 17.4, 7.4, 10.9, 12.7], '0.10': [9.74, 14.30, 16.7, 8.5, 12.5, 14.7], '0.12': [9.35, 13.70, 16.1, 9.5, 14.0, 16.4], '0.14': [8.97, 13.20, 15.4, 10.4, 15.3, 17.9] },
    M8: { '0.08': [18.50, 27.20, 31.9, 17.9, 26.2, 30.7], '0.10': [17.90, 26.20, 30.7, 20.6, 30.3, 35.5], '0.12': [17.20, 25.20, 29.5, 23.1, 34.0, 39.7], '0.14': [16.50, 24.20, 28.3, 25.3, 37.2, 43.6] },
    M10: { '0.08': [29.50, 43.30, 50.7, 36, 53, 61], '0.10': [28.40, 41.80, 48.9, 41, 61, 71], '0.12': [27.30, 40.20, 47.0, 46, 68, 80], '0.14': [26.20, 38.50, 45.1, 51, 75, 88] },
    M12: { '0.08': [43.00, 63.10, 73.9, 61, 90, 105], '0.10': [41.40, 60.90, 71.2, 71, 104, 122], '0.12': [39.90, 58.50, 68.5, 80, 117, 137], '0.14': [38.30, 56.20, 65.8, 87, 128, 150] },
    M14: { '0.08': [59.0, 86.7, 101.0, 97, 143, 167], '0.10': [56.9, 83.6, 97.8, 113, 165, 194], '0.12': [54.7, 80.4, 94.1, 127, 186, 218], '0.14': [52.6, 77.2, 90.3, 139, 205, 239] },
    M16: { '0.08': [81.0, 119.0, 139.0, 147, 216, 253], '0.10': [78.2, 115.0, 134.0, 172, 252, 295], '0.12': [75.3, 111.0, 130.0, 194, 285, 333], '0.14': [72.4, 106.0, 124.0, 214, 314, 367] }
  };
  const SINIF = [
    { k: '8.8', i: 0, Rp: 640, ad: '8.8 – genel makine (en yaygın)' },
    { k: '10.9', i: 1, Rp: 940, ad: '10.9 – yüksek mukavemet' },
    { k: '12.9', i: 2, Rp: 1100, ad: '12.9 – en yüksek (imbus vidalarda yaygın)' },
    { k: 'A2-70', i: 0, Rp: 450, paslanmaz: true, ad: 'A2-70 – paslanmaz (304)' },
    { k: 'A4-70', i: 0, Rp: 450, paslanmaz: true, ad: 'A4-70 – paslanmaz (316)' },
    { k: 'A4-80', i: 0, Rp: 600, paslanmaz: true, ad: 'A4-80 – paslanmaz, yüksek' }
  ];
  const SURTUNME = [
    { k: '0.08', ad: 'µ 0,08 – MoS₂ / özel yağlı' },
    { k: '0.10', ad: 'µ 0,10 – yağlı' },
    { k: '0.12', ad: 'µ 0,12 – hafif yağlı / galvaniz (standart kabul)' },
    { k: '0.14', ad: 'µ 0,14 – kuru, siyah oksit' }
  ];
  const VIDA_TIP = [
    { k: 'ISO 4762', ad: 'ISO 4762 – imbus (silindir başlı)' },
    { k: 'ISO 4017', ad: 'ISO 4017 – altıköşe başlı' },
    { k: 'ISO 10642', ad: 'ISO 10642 – havşa başlı imbus' },
    { k: 'ISO 7380', ad: 'ISO 7380 – mercimek başlı imbus' }
  ];
  const KILIT = [
    { k: '', ad: 'Yok' },
    { k: 'LOCTITE 222', ad: 'Loctite 222 – düşük (küçük / ayar vidaları)' },
    { k: 'LOCTITE 243', ad: 'Loctite 243 – orta (elle sökülür, en yaygın)' },
    { k: 'LOCTITE 270', ad: 'Loctite 270 – yüksek (kalıcı, ısıtarak sökülür)' }
  ];


  // ---------- v1.6: ek çelikler, AISI adları ve bükülebilirlik ----------
  Object.assign(REF2, {
    ua: { kisa: 'United Aluminum bükme tablosu', ad: 'United Aluminum – sac için 90° soğuk bükmede minimum iç yarıçap (t cinsinden), 1/64–1/8 in kalınlık: 3003-H14 0–1t, 5052-H32 0–1,5t, 6061-T6 1–2,5t, 2024-T3 2,5–5t, 7075-T6 3–6t', url: 'https://unitedaluminum.com/?p=859' },
    oceanBend: { kisa: 'Bükme yarıçapı rehberi', ad: 'Malzemeye göre minimum bükme yarıçapı tablosu (ör. 304 tavlı 0,5t; 6061-T6 pratikte 3–4t; 7075-T6 5–6t) – üretici deneyimine dayalı', url: 'https://oceanplayer.com/?p=13703' },
    tkS235: { kisa: 'thyssenkrupp S235JR', ad: 'thyssenkrupp S235JR (1.0038) veri sayfası – soğuk bükme için önerilen minimum iç yarıçap (≤ 90°): S235JRC/J2C için t ≤ 6 mm: 1t, 6–8 mm: 1,5t', url: 'https://ucpcdn.thyssenkrupp.com/_legacy/UCPthyssenkruppBAMXFrance/assets.files/product_pdf/carbon_flat_steel_/plates_and_slabs_carbon_steel/s235jr_1_0038_11_2016_engl.pdf' },
    gn504: { kisa: 'SCI GN 5.04', ad: 'SteelConstruction.info GN 5.04 – soğuk bükülecek yapı çeliği “C” sembolüyle (ör. S355J2C) sipariş edilmeli; EN 10025-2 tablosu minimum iç yarıçapları verir', url: 'https://www.SteelConstruction.info/images/f/f9/GN_5-04.pdf' },
    ssab355: { kisa: 'SSAB S355J2+N', ad: 'SSAB S355J2+N – tüm yönlerde garanti minimum bükme yarıçapı 1,5 × t (30 mm’ye kadar)', url: 'https://websitecdn.ssab.com/en/brands-and-products/ssab-zero/s355j2-plus-n-zero' },
    dc01: { kisa: 'EN 10130 DC01', ad: 'EN 10130 DC01 (1.0330) soğuk haddelenmiş yumuşak çelik: Re ≤ 280 MPa, Rm 270–410 MPa, A80 ≥ %28 (thyssenkrupp tablosu)', url: 'https://d2zo35mdb530wx.cloudfront.net/_binary/UCPtkMXMaterialsProcessingEuropeCopy/en/c-steel/cold-rolled-sheet/tkmpe_cold_rolled_sheet_en.pdf' },
    fab63: { kisa: 'The Fabricator – bükme', ad: 'The Fabricator (S. Benson): soğuk haddelenmiş yumuşak çelikte doğal minimum iç yarıçap ≈ kalınlığın %63’ü; 304 paslanmaz havada bükmede kalıp açıklığının %20–22’si kadar yarıçap oluşturur', url: 'https://www.thefabricator.com/thefabricator/article/bending/why-should-you-care-about-inside-bend-radiir' },
    datsko: { kisa: 'Datsko–Yang bükme formülü', ad: 'Datsko & Yang (1959) / Machinery’s Handbook: minimum iç yarıçap kesit daralmasından (Z, %) tahmin edilir: Z < %20 için R/t = 50/Z − 1; Z > %20 için R/t = (100−Z)² / (200Z − Z²)', url: 'https://vulcanhammer.info/2022/05/02/minimum-bend-radius-for-plate-bending/' },
    tk51: { kisa: 'thyssenkrupp 51CrV4', ad: 'thyssenkrupp precidur 51CrV4 (1.8159): küreselleştirme tavlı (GKZ) Rm ≤ 670 MPa, A80 ≥ %20; haddelenmiş Rm ≈ 930 MPa, A80 ≥ %9', url: 'https://www.thyssenkrupp-steel.com/media/content_1/publikationen/precision_steel/produktinformationen_1/verguetungsstahl/thyssenkrupp_51crv4_product_information_precision_steel_en.pdf' },
    saar51: { kisa: 'Saarstahl 51CrV4', ad: 'Saarstahl 51CrV4 (1.8159, SAE 6150) – ıslah hâlinde ≤ 16 mm: Rp0,2 ≥ 900, Rm 1100–1300 MPa, A ≥ %9', url: 'https://www.saarstahl.com/app/uploads/2024/03/20160318100831-51CrV4-50CrV4-.pdf' },
    saar100: { kisa: '100Cr6 veri sayfası', ad: '100Cr6 (1.3505, AISI 52100) – ISO 683-17; yumuşak tavlı (+AC) en fazla 207 HB; sertleştirilmiş 58–66 HRC; kaynaklanmaz', url: 'https://ucpcdn.thyssenkrupp.com/_binary/UCPthyssenkruppBAMXSchweiz/de/downloads/werkstoffdatenblaetter-baustahl/datenblatt-baustahl-thyroforce-3505/edelbau_3505.pdf' },
    meus2344: { kisa: 'Meusburger 1.2344', ad: 'Meusburger 1.2344 / AISI H13 – tavlı en fazla 230 HB (≈ 780 N/mm²), ulaşılabilir sertlik 54 HRC, ısıl iletkenlik 26 W/m·K', url: 'https://meusburger.com/DA/DK/material-grades/12344-12344-esr-hot-work-steel' },
    dew4016: { kisa: 'DEW 1.4016', ad: 'Deutsche Edelstahlwerke 1.4016 (AISI 430) – tavlı: Rp0,2 ≥ 240, Rm 400–630 MPa, A5 ≥ %20; kaynak kabiliyeti zayıf', url: 'https://swisssteel-group.com/content-media/documents/Data-Sheets/Stainless-Steel/Datenblatt_4016_UK.pdf' },
    salzQT: { kisa: 'Salzgitter ıslah çelikleri', ad: 'Salzgitter – EN ISO 683 ıslah çelikleri tablosu (42CrMo4, 34CrMo4, 51CrV4 …) ve AISI/SAE karşılıkları', url: 'https://salzgitter-flachstahl.de/en/products/hot-rolled-products/steel-grades/quenched-and-tempered-steels.html' }
  });

  // AISI / SAE / ASTM karşılıkları (≈ yaklaşık)
  const AISI = { 'S235JR': '≈ A36', 'S275JR': '≈ A36 / A283 C', 'S355J2': '≈ A572 Gr 50', 'C45': '1045', '42CrMo4': '4140', '34CrNiMo6': '≈ 4340', '16MnCr5': '≈ 5115', '11SMnPb30': '≈ 12L14',
    '1.2312': 'P20+S', '1.2379': 'D2', '1.4301': '304', '1.4307': '304L', '1.4404': '316L', '1.4305': '303', '1.4021': '420', '1.4462': '2205', '1.4542': '17-4PH (630)', 'EN-GJS-400-15': '≈ A536 60-42-10' };
  CELIK.forEach(c => { if (AISI[c.kod]) c.aisi = AISI[c.kod]; });

  CELIK.push(
    { kod: 'DC01', wnr: '1.0330', aisi: '≈ 1008 / A1008 CS', gid: 'yapi', grup: 'Soğuk haddelenmiş sac', std: 'EN 10130', ref: 'dc01', rho: 7.85, E: 210, Rm: 340, Rp: 210, A: 28, k: 55, cte: 12, tMax: 300,
      p: { isl: 2, kay: 5, kor: 1, ist: 1, sek: 5 }, bul: 5, mal: 1, manyetik: true, kullanim: 'Büküm sac parçalar, kutu ve kapaklar, elektrik panosu, braket, boyalı/kaplamalı sac gövdeler.', not: 'Soğuk haddelenmiş yumuşak çelik sac (genelde 0,4–3 mm). Değerler EN 10130 aralığının ortasıdır (Re ≤ 280, Rm 270–410, A80 ≥ %28). Paslanır: boya, toz boya veya galvanizli (DX51D+Z) muadili kullanılır.' },
    { kod: '25CrMo4', wnr: '1.7218', aisi: '≈ 4130', gid: 'islah', grup: 'Islah çeliği', std: 'EN ISO 683-2', ref: 'en683', rho: 7.85, E: 210, Rm: 900, Rp: 700, A: 12, k: 42, cte: 12, tMax: 400,
      p: { isl: 3, kay: 3, kor: 1, ist: 4, sek: 3 }, bul: 3, mal: 2, manyetik: true, kullanim: 'Kaynaklı ince cidarlı boru konstrüksiyon (şasi, kafes), basınçlı tüp, mil ve bağlantı parçası.', not: 'Değerler ıslah (+QT, ≤ 16 mm) standart minimumlarıdır. Karbonu düşük olduğundan 42CrMo4’e göre kaynağa daha uygundur (ön ısıtma önerilir). AISI 4130 eşdeğeri.' },
    { kod: '51CrV4', wnr: '1.8159', aisi: '6150', gid: 'yay', grup: 'Yay çeliği (ıslah)', std: 'EN ISO 683-2 / EN 10089', ref: 'saar51', rho: 7.85, E: 210, Rm: 1100, Rp: 900, A: 9, k: 40, cte: 12, tMax: 300,
      p: { isl: 2, kay: 1, kor: 1, ist: 5, sek: 2 }, bul: 4, mal: 2, manyetik: true, kullanim: 'Yaprak ve helezon yay, yay rondelası, burulma çubuğu, yüksek yüklü mil ve dişli.', not: 'Değerler ıslah (+QT, ≤ 16 mm) standart minimumlarıdır. Yay olarak 1400–1700 MPa’ya kadar sertleştirilir. Kaynaklanmaz.' },
    { kod: '100Cr6', wnr: '1.3505', aisi: '52100', gid: 'yay', grup: 'Rulman çeliği', std: 'ISO 683-17', ref: 'saar100', rho: 7.81, E: 210, Rm: 700, Rp: 420, A: 20, k: 43, cte: 12, tMax: 150,
      p: { isl: 3, kay: 1, kor: 1, ist: 5, sek: 1 }, bul: 4, mal: 2, manyetik: true, kullanim: 'Rulman bilyası ve bileziği, kılavuz mili, pim, mastar, aşınmaya maruz küçük parçalar.', not: 'Tavlı (+AC, ≤ 207 HB) teslim edilir; değerler tavlı hâl için yaklaşıktır (207 HB ≈ 700 MPa). Sertleştirilince 60–64 HRC. Kaynaklanmaz.' },
    { kod: '1.2344', wnr: 'X40CrMoV5-1', aisi: 'H13', gid: 'takim', grup: 'Takım/kalıp çeliği (sıcak iş)', std: 'ISO 4957', ref: 'meus2344', rho: 7.8, E: 215, Rm: 780, Rp: 500, A: 15, k: 26, cte: 11.5, tMax: 550,
      p: { isl: 3, kay: 2, kor: 1, ist: 5, sek: 1 }, bul: 4, mal: 4, manyetik: true, kullanim: 'Basınçlı döküm ve dövme kalıbı, ekstrüzyon kalıbı, yüksek parlatma isteyen plastik kalıp.', not: 'Tavlı (≤ 229 HB ≈ 780 MPa) teslim edilir; Rp ve A tavlı hâl için yaklaşıktır. Sertleştirilip 44–52 HRC’de kullanılır; 500 °C üstünde sertliğini korur. Nitrürlenebilir.' },
    { kod: '1.4401', wnr: 'X5CrNiMo17-12-2', aisi: '316', gid: 'ostenitik', grup: 'Paslanmaz (ostenitik)', std: 'EN 10088-3', ref: 'en10088', rho: 8.0, E: 200, Rm: 600, Rp: 220, A: 40, k: 15, cte: 16.0, tMax: 800,
      p: { isl: 2, kay: 5, kor: 5, ist: 1, sek: 5 }, bul: 4, mal: 4, manyetik: false, kullanim: 'Deniz ortamı, kimya ve gıda ekipmanı; kaynak gerekmeyen 316 parçalar.', not: '316L’nin normal karbonlu sürümü; kaynaklı parçalarda 1.4404 (316L) tercih edilir.' },
    { kod: '1.4541', wnr: 'X6CrNiTi18-10', aisi: '321', gid: 'ostenitik', grup: 'Paslanmaz (ostenitik, Ti stabilize)', std: 'EN 10088-3', ref: 'en10088', rho: 7.9, E: 200, Rm: 580, Rp: 200, A: 40, k: 15, cte: 16.5, tMax: 850,
      p: { isl: 2, kay: 5, kor: 4, ist: 1, sek: 4 }, bul: 4, mal: 3, manyetik: false, kullanim: 'Egzoz, ısı değiştirici, 400–800 °C’de çalışan kaynaklı parçalar.', not: 'Titanyum karbonu bağlar: kaynak ve yüksek sıcaklıkta taneler arası korozyona dayanıklı. Parlatılmış yüzey istenen yerde 304 tercih edilir (Ti karbürleri).' },
    { kod: '1.4016', wnr: 'X6Cr17', aisi: '430', gid: 'ferritik', grup: 'Paslanmaz (ferritik)', std: 'EN 10088-2/-3', ref: 'dew4016', rho: 7.7, E: 220, Rm: 480, Rp: 300, A: 25, k: 25, cte: 10, tMax: 800,
      p: { isl: 3, kay: 2, kor: 3, ist: 1, sek: 3 }, bul: 4, mal: 2, manyetik: true, kullanim: 'Ev aletleri, iç mekân dekoratif sac, mutfak ekipmanı, manyetik olması gereken paslanmaz parçalar.', not: 'Nikelsiz, ucuz paslanmaz; manyetiktir. Korozyon dayanımı 304’ten düşük (iç ortam). Kaynakta tane büyümesi ve gevrekleşme olur.' },
    { kod: 'EN-GJL-250', wnr: '5.1301', aisi: '≈ A48 Class 35', gid: 'dokme', grup: 'Lamel grafitli (gri) dökme demir', std: 'EN 1561', ref: 'dokmeEsd', rho: 7.2, E: 110, Rm: 250, Rp: 165, A: 0.5, k: 48, cte: 11, tMax: 350,
      p: { isl: 5, kay: 1, kor: 2, ist: 1, sek: 1 }, bul: 5, mal: 1, manyetik: true, kullanim: 'Tezgâh gövdesi ve kızakları, motor bloğu, pompa gövdesi, fren diski, titreşim sönümü istenen gövdeler.', not: 'Eski GG25. Çekmede gevrek (%A < 1), basmada güçlü; titreşim sönümü ve işlenebilirliği çok iyi. Rp yerine Rp0,1 yaklaşık değeri verilmiştir.' },
    { kod: 'EN-GJS-500-7', wnr: '5.3200', aisi: '≈ A536 80-55-06', gid: 'dokme', grup: 'Küresel grafitli dökme demir', std: 'EN 1563', ref: 'en1563', rho: 7.1, E: 169, Rm: 500, Rp: 320, A: 7, k: 35, cte: 12.5, tMax: 350,
      p: { isl: 4, kay: 1, kor: 2, ist: 2, sek: 1 }, bul: 4, mal: 1, manyetik: true, kullanim: 'Daha yüksek dayanım isteyen dişli kutusu, hidrolik gövde, krank, makine parçaları.', not: 'Eski GGG50. Ferritik-perlitik; GJS-400’e göre daha dayanıklı, daha az sünek.' }
  );
  CELIK_GRUP.splice(CELIK_GRUP.findIndex(x => x.id === 'takim') + 1, 0, { id: 'yay', g: 'Yay ve rulman çelikleri', ozet: 'Yüksek karbonlu; sertleştirilerek yay, bilya, aşınma parçası.', ornek: '51CrV4 (6150), 100Cr6 (52100)' });
  CELIK_GRUP.splice(CELIK_GRUP.findIndex(x => x.id === 'martenzit'), 0, { id: 'ferritik', g: 'Ferritik paslanmaz', ozet: 'Nikelsiz, ucuz, manyetik paslanmaz; iç ortam ve sac.', ornek: '1.4016 (430)' });
  const GRUP_SIRA = CELIK_GRUP.map(x => x.id);
  CELIK.sort((a, b) => GRUP_SIRA.indexOf(a.gid) - GRUP_SIRA.indexOf(b.gid));

  // Bükülebilirlik: p (1–5), r (min. iç yarıçap / durum), n (not), ref
  const AL_BUK = {
    '1050A': [4, '0 (≤ 1,6 mm) · 1 t (3,2 mm) – 90°', '1100-H14 verisi (saf Al, benzer). Yumuşak (O) hâlde düz katlanabilir.', 'ua'],
    '3003': [4, '0 (≤ 1,6 mm) · 1 t (3,2 mm) – 90°', 'H14 için tablo değeri. O hâlinde 0.', 'ua'],
    '5005': [4, '0 (≤ 1,6 mm) · 1 t (3,2 mm) – 90°', 'H14 için tablo değeri.', 'ua'],
    '5052': [3, '1 t (1,6 mm) · 1,5 t (3,2 mm) – 90°', 'H32: sac bükümü için en çok tercih edilen alaşım. O hâlinde 0–½ t.', 'ua'],
    '5083': [4, '≈ ½ t (3,2 mm) – yaklaşık', 'Tabloda yok; H111 tavlıya yakın olduğundan 5052-O değeri esas alındı (yaklaşık).', 'ua'],
    '5754': [4, '≈ ½ t (3,2 mm) – yaklaşık', 'Tabloda yok; H111 tavlıya yakın olduğundan 5052-O değeri esas alındı (yaklaşık).', 'ua'],
    '6061': [3, '1,5 t (1,6 mm) · 2,5 t (3,2 mm) – 90°', 'T6 tablo değeri; pratikte 3–4 t önerilir. T4’te 1–1,5 t, O hâlinde 0–1 t.', 'ua'],
    '6082': [3, '≈ 6061-T6: 1,5–2,5 t (yaklaşık)', 'Tabloda yok; dayanımı 6061-T6 ile benzer olduğundan aynı değer alındı. Sıkı bükümlerde T4’te bükülüp yaşlandırılabilir.', 'ua'],
    '6060': [3, '≈ 6061-T6 ya da biraz daha iyi (yaklaşık)', 'Tabloda yok. Profil bükümünde T4/T5 hâli daha uygundur.', 'ua'],
    '6063': [3, '≈ 6061-T6 ya da biraz daha iyi (yaklaşık)', 'Tabloda yok. Profil bükümünde T4/T5 hâli daha uygundur.', 'ua'],
    '6005A': [3, '≈ 6061-T6 (yaklaşık)', 'Tabloda yok; benzer dayanımlı 6xxx.', 'ua'],
    '2024': [2, '4 t (1,6 mm) · 5 t (3,2 mm) – 90°', '2024-T3 tablo değeri. O hâlinde 0–½ t: büküp sonra ısıl işlem yapın.', 'ua'],
    '2017A': [2, '≈ 2024-T4: 4–5 t (yaklaşık)', 'Tabloda yok; benzer 2xxx T4 değeri esas alındı.', 'ua'],
    '7075': [1, '5 t (1,6 mm) · 6 t (3,2 mm) – 90°', 'T6’da bükme pratik değildir; O hâlinde 1 t ile bükülüp ısıl işlem yapılır.', 'ua'],
    '7020': [2, '6061-T6 ile 7075-T6 arası (yaklaşık)', 'Tabloda yok. Kaynaklı 7xxx; sıkı bükümden kaçının.', 'ua'],
    '7050': [1, 'Bükme için uygun değil', 'Kalın plaka ürünü; yüksek dayanım, düşük süneklik.', 'ua'],
    '2011': [1, 'Bükme için uygun değil', 'Otomat çubuk alaşımı (Bi/Pb katkılı).', 'ua'],
    '2014': [1, 'Bükme için uygun değil (T6)', 'Yüksek dayanımlı 2xxx; 2024-T81 benzeri ≥ 6 t gerekir (yaklaşık).', 'ua'],
    '4032': [1, 'Bükme için uygun değil', 'Dövme piston alaşımı; yüksek silisyum.', 'ua']
  };
  const DATS = 'datsko';
  const CE_BUK = {
    'DC01': [5, '≈ 0,6 t (doğal minimum); ince sacta üst üste katlanabilir', 'Bükme sacı olarak üretilir. Kalın sacta 1 t seçmek güvenlidir.', 'fab63'],
    'S235JR': [4, '1 t (t ≤ 6 mm) · 1,5 t (6–8 mm) – 90°', 'Garanti için soğuk şekillendirme kalitesi S235JRC sipariş edin.', 'tkS235'],
    'S275JR': [4, '≈ 1–1,5 t (C kalitesiyle)', 'Bükülecekse S275JRC sipariş edin; değerler EN 10025-2 tablosundadır.', 'gn504'],
    'S355J2': [3, '1,5 t (≤ 30 mm, tüm yönler)', 'Yüksek akma nedeniyle geri yaylanma S235’ten fazladır.', 'ssab355'],
    'C45': [2, 'Tablo değeri yok – Datsko–Yang ile hesaplayın', 'Normalize hâlde soğuk bükme sınırlıdır (%A ≈ 14). Kalın kesitte sıcak bükün; ıslah/sertleştirmeden sonra bükmeyin.', DATS],
    '25CrMo4': [2, 'Tavlı / normalize hâlde orta – hesaplayın', 'Boru ve sac tavlı hâlde bükülür, sonra ıslah edilir; ıslahlı hâlde bükmeyin.', DATS],
    '42CrMo4': [1, '+QT hâlde soğuk bükme önerilmez', 'Gerekiyorsa tavlı (+A) hâlde veya sıcak bükülüp sonra ıslah edilir.', DATS],
    '34CrNiMo6': [1, '+QT hâlde soğuk bükme önerilmez', 'Büyük kesitli dövme/mil malzemesi; bükme parçası için seçilmez.', DATS],
    '16MnCr5': [3, 'Sementasyondan ÖNCE bükün', 'Yumuşak tavlı hâlde bükülür; sertleştirilmiş yüzey bükülmez.', DATS],
    '11SMnPb30': [1, 'Bükme için uygun değil', 'Kükürt/kurşun inklüzyonları dış lifte çatlar (%A ≈ 8).', DATS],
    '51CrV4': [2, 'Tavlıda bükülür, ıslahlıda bükülmez', 'Küreselleştirme tavlı şerit (A80 ≥ %20) bükülüp sonra ıslah edilir; ıslahlı/haddelenmiş hâlde (A ≈ %9) bükmeyin.', 'tk51'],
    '100Cr6': [1, 'Bükme için uygun değil', 'Yüksek karbonlu rulman çeliği; şekillendirme yerine talaşlı imalat.', DATS],
    '1.2312': [1, 'Bükme için uygun değil', 'Ön sertleştirilmiş (~300 HB) kalıp çeliği.', DATS],
    '1.2379': [1, 'Bükme için uygun değil', 'Ledeburitik takım çeliği; karbürler çatlar.', DATS],
    '1.2344': [1, 'Bükme için uygun değil', 'Takım çeliği; şekli talaşlı imalat / erozyonla verilir.', DATS],
    '1.4301': [5, '≈ 0,5 t (90°, tavlı) – pratikte 1–2 t', 'İnce sacta 180° katlanabilir. Geri yaylanma ve aynı kalıpta oluşan iç yarıçap yumuşak çelikten büyüktür.', 'oceanBend'],
    '1.4307': [5, '≈ 0,5 t (90°, tavlı) – pratikte 1–2 t', '304 ile aynı davranış; kaynaklı-bükümlü parçalar için iyi seçim.', 'oceanBend'],
    '1.4401': [5, '≈ 0,5 t (90°, tavlı) – pratikte 1–2 t', '304 ile benzer; biraz daha sert.', 'oceanBend'],
    '1.4404': [5, '≈ 0,5 t (90°, tavlı) – pratikte 1–2 t', '304 ile benzer; biraz daha sert.', 'oceanBend'],
    '1.4541': [4, '≈ 0,5–1 t (tavlı)', 'Ostenitik; 304’e yakın davranır.', 'oceanBend'],
    '1.4305': [2, 'Bükme önerilmez', 'Çubuk ürünüdür; kükürt inklüzyonları bükmede çatlar.', DATS],
    '1.4016': [3, '≈ 1–3 t (kaynaklar arasında fark var)', 'Ostenitiklerden zayıf; soğukta (< 0 °C) ve kalın sacta çatlamaya yatkın. Bükme hattını haddeleme yönüne dik koyun.', 'oceanBend'],
    '1.4021': [1, 'Islahlı hâlde bükülmez', 'Martenzitik; ancak tavlı ince sac sınırlı bükülebilir.', DATS],
    '1.4462': [3, 'Ostenitiklerden büyük yarıçap (≈ 2 t ve üstü, yaklaşık)', 'Akma 304’ün ~2 katı: daha fazla kuvvet ve geri yaylanma. Kesin değeri üreticiden alın.', DATS],
    '1.4542': [1, 'Yaşlandırılmış hâlde bükülmez', 'Gerekirse Condition A’da (çözeltiye alınmış) sınırlı bükülüp sonra yaşlandırılır.', DATS],
    'EN-GJS-400-15': [1, 'Bükülmez (döküm)', 'Döküm parçalar şekillendirilmez; düzeltme için bile soğuk bükme önerilmez.', 'dokmeEsd'],
    'EN-GJS-500-7': [1, 'Bükülmez (döküm)', 'Döküm parçalar şekillendirilmez.', 'dokmeEsd'],
    'EN-GJL-250': [1, 'Bükülmez (gevrek)', 'Gri dökme demir çekmede gevrektir (%A < 1).', 'dokmeEsd']
  };
  const bukAta = (L, M) => L.forEach(m => { const b = M[m.kod]; if (b) { m.buk = { p: b[0], r: b[1], n: b[2], ref: b[3] }; m.p.buk = b[0]; } });
  bukAta(ALUMINYUM, AL_BUK); bukAta(CELIK, CE_BUK);

  const out = { REF2, ALUMINYUM, AL_SERI, TEMPER, CELIK, CELIK_GRUP, KAPLAMA, ISTEK, TORK, SINIF, SURTUNME, VIDA_TIP, KILIT };
  g.MVERI = out;
  if (g.DATA) Object.assign(g.DATA.REF, REF2);
  if (typeof module !== 'undefined') module.exports = out;
})(typeof window !== 'undefined' ? window : globalThis);
