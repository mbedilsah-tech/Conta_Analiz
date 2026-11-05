// Conta Analiz – veri tabanı
// Bütün değerler el kitaplarından derlenmiş BAŞLANGIÇ değerleridir.
// Kesin tasarımda tedarikçi veri sayfası ve ilgili standart esas alınmalıdır.
(function (g) {

  // ---------------- Referanslar ----------------
  const REF = {
    parker: { kisa: 'Parker ORD 5700', ad: 'Parker O-Ring Handbook (ORD 5700) – statik yüz contası kanal tasarımı, malzeme uyumluluğu, yüzey kalitesi', url: 'https://www.parker.com/content/dam/Parker-com/Literature/O-Ring-Division-Literature/ORD-5700.pdf' },
    chomHb: { kisa: 'Chomerics El Kitabı', ad: 'Parker Chomerics – Conductive Elastomer Engineering Handbook (iletken O-ring en fazla %25 sapma; contalar sıkıştırılamaz akışkan gibi düşünülür, ≤%97 kanal doluluğu)', url: 'https://www.parker.com/Literature/Chomerics/Parker%20Chomerics%20Conductive%20Elastomer%20Engineering%20Handbook.pdf' },
    chomDO: { kisa: 'Chomerics D/O-Ring', ad: 'Parker Chomerics – Conductive Elastomer Molded D- and O-Rings (O-ring %10–25, D-ring %8–20 sapma; en kötü tolerans durumunda ≤%97 doluluk)', url: 'https://www.parker.com/content/dam/Parker-com/Literature/Chomerics/Parker-Chomerics-Conductive-Elastomer-Molded-D-and-O-Rings.pdf' },
    chomBond: { kisa: 'Chomerics CHO-BOND', ad: 'Parker Chomerics – Conductive Compounds Selector Guide (CHO-BOND 1030, 1035, 360-20, 584-29; 1086 astar)', url: 'https://www.parker.com/content/dam/Parker-com/Literature/Chomerics/Parker-Chomerics-CHO-BOND-1035.pdf' },
    astm: { kisa: 'ASTM D2000', ad: 'ASTM D2000 – Standard Classification System for Rubber Products in Automotive Applications (SAE J200 eşdeğeri)', url: 'https://www.astm.org/d2000-18.html' },
    as568: { kisa: 'SAE AS568', ad: 'SAE AS568 – Aerospace Size Standard for O-rings', url: 'https://www.sae.org/standards/content/as568f/' },
    iso3601: { kisa: 'ISO 3601', ad: 'ISO 3601-1 (ölçü/tolerans), -2 (kanal tasarımı), -3 (yüzey kusurları kalite kabul), -5 (malzeme uygunluğu)', url: 'https://www.iso.org/standard/67402.html' },
    arp1231: { kisa: 'SAE ARP1231', ad: 'SAE ARP1231 – Gland Design, Elastomeric O-Ring Seals, General Considerations', url: 'https://www.sae.org/standards/content/arp1231/' },
    mil83528: { kisa: 'MIL-DTL-83528', ad: 'MIL-DTL-83528 – Gasketing Material, Conductive, Shielding Gasket, Electronic, Elastomer, EMI/RFI', url: 'https://quicksearch.dla.mil/' },
    iso2230: { kisa: 'ISO 2230', ad: 'ISO 2230 – Rubber products – Guidelines for storage (depolama ve raf ömrü)', url: 'https://www.iso.org/standard/50340.html' },
    d2240: { kisa: 'ASTM D2240', ad: 'ASTM D2240 – Durometer (Shore A) sertlik ölçümü', url: 'https://www.astm.org/d2240-15r21.html' },
    mil5541: { kisa: 'MIL-DTL-5541', ad: 'MIL-DTL-5541 – Alüminyum kromat dönüşüm kaplaması (Class 3: düşük elektrik direnci, EMI temas yüzeyleri)', url: 'https://quicksearch.dla.mil/' },
    loctite: { kisa: 'Henkel Loctite', ad: 'Henkel Loctite – Design Guide for Bonding Rubbers and Thermoplastic Elastomers', url: 'https://www.henkel-adhesives.com/' },
    iso273: { kisa: 'ISO 273', ad: 'ISO 273 – Cıvata geçiş delikleri (ince/orta/kaba seri)', url: 'https://www.iso.org/standard/4166.html' },
    ee: { kisa: 'Engineers Edge – cıvata aralığı', ad: 'Engineers Edge – Gasket Compression and Fastener Spacing Design Equation. Kapak/flanş kiriş modeli: ΔH = (13·Pmin + 2·Pmax)·C⁴·b / (480·E·a·t³). Cıvata ortasında conta basıncının minimuma indiği parabolik dağılım varsayılır.', url: 'https://engineersedge.com/general_engineering/gasket_cover_compression.htm' },
    krishnan: { kisa: 'Krishnan & Nair', ad: 'R. Krishnan, K.R.M. Nair – Fastener Spacing and Tightening Torque of Gasket Joints of Oil Filled Transformers (cıvata aralığı denkleminin dayandığı çalışma; Engineers Edge kaynakçasında)', url: 'https://engineersedge.com/general_engineering/gasket_cover_compression.htm' },
    marks: { kisa: 'Marks’ Handbook', ad: 'Marks’ Standard Handbook for Mechanical Engineers – sürekli kiriş eğilme bağıntıları', url: '' },
    oren: { kisa: 'SAE 810362', ad: 'J. Oren – Creating Gasket Seals with Rigid Flanges, SAE Technical Paper 810362 (1981): basit ve sürekli kiriş formülleriyle yeterince rijit flanş tasarımı; çoklu cıvata sürekli kiriş etkisi', url: 'https://saemobilus.sae.org/papers/creating-gasket-seals-rigid-flanges-810362' },
    lindley: { kisa: 'Lindley denklemi', ad: 'P.B. Lindley – O-ring sıkıştırma kuvveti: F = π·D·d·E·(1,25·ε^1,5 + 50·ε^6). Burada birim uzunluk için q = d·E·(1,25·ε^1,5 + 50·ε^6) kullanıldı.', url: 'https://www.xmbestseal.com/info/how-to-calculate-rubber-seal-compression-force-103529791.html' },
    parkerKuvvet: { kisa: 'Parker ORD 5700 §2.4.6', ad: 'Parker O-Ring Handbook ORD 5700 §2.4.6 – O-ring sıkıştırma yükü eğrileri (kesit, sertlik ve sıkıştırma oranına göre birim uzunluk kuvveti). Lindley sonucunu bu eğrilerle karşılaştırın.', url: 'https://parker.com/promotionsite/oring-ehandbook/us/ehome/ci.O–Ring-Compression-Force,EN.EN' },
    gent: { kisa: 'Gent (1958)', ad: 'A.N. Gent – Shore A sertliğinden Young modülü: E = 0,0981·(56 + 7,62336·S) / (0,137505·(254 − 2,54·S)) MPa', url: '' },
    kural: { kisa: 'Genel pratik', ad: 'Genel mühendislik pratiği / temkinli başlangıç değeri – prototip testi veya FEA ile doğrulanmalıdır', url: '' },
    ostim: { kisa: 'OSTİM Firma Rehberi', ad: 'OSTİM OSB firma rehberi (ostim.org.tr/companies) – Kasım 2026 itibarıyla', url: 'https://ostim.org.tr/companies' }
  };

  // ---------------- Ortamlar ----------------
  const ORTAMLAR = [
    { k: 'hava', ad: 'Hava / inert gaz (N₂)' },
    { k: 'su', ad: 'Su (< 80 °C)' },
    { k: 'buhar', ad: 'Sıcak su / buhar' },
    { k: 'yag', ad: 'Mineral yağ / hidrolik yağ' },
    { k: 'yakit', ad: 'Yakıt (benzin, dizel, JP-8)' },
    { k: 'ozon', ad: 'Dış ortam / ozon / UV' },
    { k: 'vakum', ad: 'Vakum' },
    { k: 'glikol', ad: 'Su-glikol / antifriz' },
    { k: 'fren', ad: 'Fren hidroliği (glikol bazlı DOT)' },
    { k: 'kimyasal', ad: 'Seyreltik asit / baz' }
  ];
  // Uyum puanı: 3 çok iyi, 2 iyi, 1 sınırlı (test edin), 0 uygun değil
  const U = (hava, su, buhar, yag, yakit, ozon, vakum, glikol, fren, kimyasal) => ({ hava, su, buhar, yag, yakit, ozon, vakum, glikol, fren, kimyasal });

  // ---------------- Malzemeler ----------------
  // bul: Türkiye piyasasında bulunurluk (5 = her yerde stok, 1 = sipariş/ithalat)
  // mal: göreli maliyet (1 ucuz … 5 çok pahalı)
  const MALZEMELER = [
    { kod: 'NBR', ad: 'NBR – Nitril kauçuk', tmin: -30, tmax: 100, tKisa: 120, shore: [70, 80, 90, 60], bul: 5, mal: 1, emi: false,
      ortam: U(2, 2, 0, 3, 2, 0, 2, 2, 0, 1),
      d2000: { grade: 2, type: 'B', cls: 'G', sert: 7, ceki: '14', ek: 'B14 EO14 EO34 F17' },
      not: 'En yaygın ve en ekonomik conta malzemesi. Mineral yağ ve yakıta iyi; ozon, UV ve dış ortamda çatlar. Düşük sıcaklık tipleri (−40 °C) bulunur.' },
    { kod: 'EPDM', ad: 'EPDM – Etilen propilen', tmin: -50, tmax: 150, tKisa: 160, shore: [70, 60, 80, 50], bul: 5, mal: 1, emi: false,
      ortam: U(3, 3, 3, 0, 0, 3, 2, 3, 3, 2),
      d2000: { grade: 2, type: 'C', cls: 'A', sert: 7, ceki: '10', ek: 'A25 B35 F17' },
      not: 'Su, buhar, glikol, fren hidroliği, ozon ve dış ortama çok iyi. Mineral yağ, gres ve yakıtla KESİNLİKLE kullanılmaz (aşırı şişer). Montajda mineral yağlı gres kullanmayın.' },
    { kod: 'FKM', ad: 'FKM (Viton®) – Florokarbon', tmin: -20, tmax: 200, tKisa: 230, shore: [75, 80, 90, 70], bul: 4, mal: 3, emi: false,
      ortam: U(3, 2, 1, 3, 3, 3, 3, 2, 0, 3),
      d2000: { grade: 2, type: 'H', cls: 'K', sert: 7, ceki: '10', ek: 'B37 B38 EF31 EO78 F15 Z1' },
      not: 'Yüksek sıcaklık, yakıt, yağ ve çoğu kimyasal için en iyi “standart” seçim. Düşük sıcaklık zayıf (standart −20 °C, LT tipleri −40 °C). Sıcak su/buhar, keton ve fren hidroliğine uygun değil.' },
    { kod: 'VMQ', ad: 'VMQ – Silikon', tmin: -60, tmax: 200, tKisa: 230, shore: [70, 60, 50, 80], bul: 4, mal: 2, emi: false,
      ortam: U(3, 2, 1, 1, 0, 3, 1, 2, 1, 1),
      d2000: { grade: 2, type: 'G', cls: 'E', sert: 7, ceki: '05', ek: 'A19 B37 EO16 EO36 F19' },
      not: 'Çok geniş sıcaklık aralığı, ozon/UV dayanımı çok iyi, düşük sıkma kuvvetinde iyi sızdırmazlık. Yırtılma ve aşınma dayanımı zayıf; statik uygulamaya uygun, dinamikte zayıf. Yakıta uygun değil.' },
    { kod: 'HNBR', ad: 'HNBR – Hidrojenize nitril', tmin: -30, tmax: 150, tKisa: 160, shore: [70, 80, 90], bul: 3, mal: 3, emi: false,
      ortam: U(3, 3, 2, 3, 2, 2, 2, 3, 0, 1),
      d2000: { grade: 2, type: 'D', cls: 'H', sert: 7, ceki: '14', ek: 'A26 B16 EO16 EO36 F17' },
      not: 'NBR’nin ısı ve ozon dayanımı artırılmış hali. Yağ ile yüksek sıcaklık birlikteyse iyi bir orta yol.' },
    { kod: 'CR', ad: 'CR (Neopren) – Kloropren', tmin: -40, tmax: 100, tKisa: 120, shore: [70, 60, 50, 80], bul: 3, mal: 2, emi: false,
      ortam: U(2, 2, 1, 2, 1, 2, 1, 2, 0, 1),
      d2000: { grade: 2, type: 'B', cls: 'C', sert: 7, ceki: '10', ek: 'A14 B14 EO14 F17' },
      not: 'Orta yağ dayanımı ile iyi hava/ozon dayanımını birleştirir. Kabin, kapı ve genel endüstriyel profil contalarda yaygın. Sünger formu kolay bulunur.' },
    { kod: 'FVMQ', ad: 'FVMQ – Florosilikon', tmin: -60, tmax: 175, tKisa: 200, shore: [70, 60, 80], bul: 2, mal: 4, emi: false,
      ortam: U(3, 2, 1, 3, 3, 3, 1, 2, 0, 1),
      d2000: { grade: 2, type: 'F', cls: 'K', sert: 7, ceki: '05', ek: 'B37 EO78 F19' },
      not: 'Silikonun sıcaklık aralığı + yakıt/yağ dayanımı. Havacılık yakıt sistemleri. Pahalı; mekanik dayanım düşük; teslim süresi uzun olabilir.' },
    { kod: 'ACM', ad: 'ACM – Poliakrilat', tmin: -20, tmax: 150, tKisa: 175, shore: [70, 80], bul: 2, mal: 3, emi: false,
      ortam: U(2, 0, 0, 3, 1, 2, 1, 0, 0, 0),
      d2000: { grade: 2, type: 'D', cls: 'H', sert: 7, ceki: '08', ek: 'B16 EO16 EO36' },
      not: 'Sıcak motor/şanzıman yağlarına iyi. Suya ve buhara uygun değil. Otomotiv dışında nadir.' },
    { kod: 'FFKM', ad: 'FFKM – Perflorokarbon', tmin: -15, tmax: 300, tKisa: 320, shore: [75, 90], bul: 1, mal: 5, emi: false,
      ortam: U(3, 3, 3, 3, 3, 3, 3, 3, 3, 3),
      d2000: null,
      not: 'Neredeyse tüm kimyasallar ve 300 °C üstü. Çok pahalı, teslim süresi uzun. Yalnızca başka malzeme çalışmıyorsa seçin. Genellikle ASTM D2000 yerine üretici spesifikasyonu ile çağrılır.' },

    // ---------- EMI (iletken elastomer) ----------
    { kod: 'AgAl-VMQ', ad: 'Ag/Al dolgulu silikon (ör. CHO-SEAL 1285)', tmin: -55, tmax: 160, tKisa: 160, shore: [65], bul: 3, mal: 4, emi: true,
      mil: 'MIL-DTL-83528 Type B', ortam: U(3, 2, 1, 1, 0, 3, 1, 2, 1, 1),
      not: 'Askeri/havacılık EMI uygulamalarında en yaygın iletken elastomer. Alüminyum gövdelerle galvanik uyumu iyi. Tip B, 10 GHz’de ~100 dB düzlem dalga ekranlama şartını karşılar.' },
    { kod: 'AgAl-FVMQ', ad: 'Ag/Al dolgulu florosilikon (ör. CHO-SEAL 1298)', tmin: -55, tmax: 160, tKisa: 160, shore: [70], bul: 2, mal: 5, emi: true,
      mil: 'MIL-DTL-83528 Type D', ortam: U(3, 2, 1, 3, 3, 3, 1, 2, 0, 1),
      not: 'Yakıt/solvent temasının olduğu EMI uygulamaları; korozyon performansı çok iyi. Pahalı.' },
    { kod: 'NiC-VMQ', ad: 'Ni/C (nikel-grafit) dolgulu silikon', tmin: -55, tmax: 150, tKisa: 150, shore: [60, 65], bul: 3, mal: 2, emi: true,
      mil: 'Ticari (genelde QPL dışı)', ortam: U(3, 2, 1, 1, 0, 3, 1, 2, 1, 1),
      not: 'Gümüş içermez → düşük ve stabil fiyat. Ticari/endüstriyel EMI ve çevresel sızdırmazlık için iyi başlangıç; askeri QPL gerekiyorsa uygun değil.' },
    { kod: 'NiAl-VMQ', ad: 'Ni/Al dolgulu silikon (ör. CHO-SEAL 6502)', tmin: -55, tmax: 125, tKisa: 150, shore: [68], bul: 2, mal: 3, emi: true,
      mil: 'Ticari', ortam: U(3, 2, 1, 1, 0, 3, 1, 2, 1, 1),
      not: 'Tuz sisi/korozyon dayanımı yüksek; gümüşlüye göre ucuz. Al gövdeli dış ortam cihazları için iyi seçenek.' },
    { kod: 'AgCu-VMQ', ad: 'Ag/Cu dolgulu silikon (ör. CHO-SEAL 1215)', tmin: -55, tmax: 125, tKisa: 125, shore: [65, 85], bul: 2, mal: 4, emi: true,
      mil: 'MIL-DTL-83528 Type A (65) / Type K (85)', ortam: U(3, 2, 1, 1, 0, 3, 1, 2, 1, 1),
      not: 'En yüksek iletkenlik/ekranlama. Alüminyum gövdede nemli/tuzlu ortamda galvanik korozyon riski yüksektir – Al için Ag/Al veya Ni/Al tercih edin.' }
  ];

  // ---------------- ASTM D2000 tabloları ----------------
  const D2000_TIP = { A: 70, B: 100, C: 125, D: 150, E: 175, F: 200, G: 225, H: 250, J: 275, K: 300 };
  const D2000_SINIF = { A: 'şart yok', B: '%140', C: '%120', D: '%100', E: '%80', F: '%60', G: '%40', H: '%30', J: '%20', K: '%10' };

  // ---------------- Sıkıştırma aralıkları ----------------
  // bant: kabul edilebilir min–maks (en kötü tolerans dahil), seviyeler: 3 nominal öneri
  const SIKISTIRMA = {
    oring:       { ad: 'O-ring (statik yüz contası)', bant: [0.12, 0.35], sev: [0.18, 0.23, 0.28], dolHedef: 0.75, dolMaks: 0.85, ref: ['parker', 'arp1231', 'iso3601'] },
    oring_emi:   { ad: 'İletken (EMI) O-ring', bant: [0.10, 0.25], sev: [0.15, 0.18, 0.21], dolHedef: 0.85, dolMaks: 0.97, ref: ['chomDO', 'chomHb'] },
    yuvarlak:    { ad: 'Dolu yuvarlak profil (kanalda)', bant: [0.12, 0.35], sev: [0.18, 0.23, 0.28], dolHedef: 0.75, dolMaks: 0.85, ref: ['parker'] },
    yuvarlak_emi:{ ad: 'İletken dolu yuvarlak profil', bant: [0.10, 0.25], sev: [0.15, 0.18, 0.21], dolHedef: 0.85, dolMaks: 0.97, ref: ['chomDO', 'chomHb'] },
    D:           { ad: 'D-profil (dolu)', bant: [0.08, 0.25], sev: [0.10, 0.15, 0.20], dolHedef: 0.80, dolMaks: 0.90, ref: ['chomDO', 'kural'] },
    D_emi:       { ad: 'İletken D-profil (dolu)', bant: [0.08, 0.20], sev: [0.10, 0.14, 0.18], dolHedef: 0.85, dolMaks: 0.97, ref: ['chomDO'] },
    duz:         { ad: 'Düz conta (levhadan kesim, dolu)', bant: [0.10, 0.30], sev: [0.12, 0.20, 0.25], dolHedef: 0.80, dolMaks: 0.90, ref: ['kural'] },
    duz_emi:     { ad: 'İletken düz conta (levhadan kesim)', bant: [0.05, 0.15], sev: [0.07, 0.10, 0.13], dolHedef: 0.85, dolMaks: 0.97, ref: ['chomHb', 'kural'], yaklasik: true },
    tup:         { ad: 'Boşluklu tüp / P-profil', bant: [0.20, 0.50], sev: [0.25, 0.35, 0.45], dolHedef: 0.60, dolMaks: 0.85, ref: ['chomHb', 'kural'] },
    tup_emi:     { ad: 'İletken boşluklu tüp / P-profil', bant: [0.20, 0.50], sev: [0.25, 0.35, 0.45], dolHedef: 0.60, dolMaks: 0.90, ref: ['chomHb', 'kural'] },
    sunger:      { ad: 'Sünger / köpük (kapalı hücre)', bant: [0.25, 0.60], sev: [0.30, 0.40, 0.50], dolHedef: 0.70, dolMaks: 0.95, ref: ['kural'] }
  };
  const SEVIYE_AD = ['Düşük – düşük sıkma kuvveti (plastik/ince kapak)', 'Nominal – genel kullanım (önerilen)', 'Yüksek – gaz, vakum, düşük sıcaklık'];

  // Standart O-ring kesitleri (mm) ve ± tolerans (ISO 3601-1 / AS568)
  const CS_LISTE = [
    { d: 1.0, tol: 0.08, std: 'Metrik' }, { d: 1.5, tol: 0.08, std: 'Metrik' }, { d: 1.78, tol: 0.08, std: 'AS568 -0xx' },
    { d: 2.0, tol: 0.08, std: 'Metrik' }, { d: 2.5, tol: 0.09, std: 'Metrik' }, { d: 2.62, tol: 0.08, std: 'AS568 -1xx' },
    { d: 3.0, tol: 0.09, std: 'Metrik' }, { d: 3.53, tol: 0.10, std: 'AS568 -2xx' }, { d: 4.0, tol: 0.10, std: 'Metrik' },
    { d: 5.0, tol: 0.10, std: 'Metrik' }, { d: 5.33, tol: 0.13, std: 'AS568 -3xx' }, { d: 6.0, tol: 0.13, std: 'Metrik' },
    { d: 6.99, tol: 0.15, std: 'AS568 -4xx' }
  ];

  // ISO 273 orta seri cıvata geçiş delikleri (mm)
  const DELIK = { M3: 3.4, M4: 4.5, M5: 5.5, M6: 6.6, M8: 9.0, M10: 11.0, M12: 13.5, M16: 17.5 };

  // ---------------- Yapıştırıcılar ----------------
  // uyum: conta malzemesine göre 0–3, yuzey: alt malzemeye göre 0–3
  const YAPISTIRICILAR = [
    { id: 'ca406', ad: 'Loctite 406 (+ SF 770 astar)', tip: 'Siyanoakrilat (düşük viskozite)', tmin: -40, tmax: 80, iletken: false, bul: 5,
      uyum: { NBR: 3, EPDM: 3, FKM: 2, VMQ: 3, HNBR: 3, CR: 3, FVMQ: 2, ACM: 2, FFKM: 1, EMI: 1 },
      yuzey: { al: 3, paslanmaz: 3, celik: 3, plastik: 3, conta: 3 },
      not: 'Kauçuk-metal ve O-ring kordon uç birleştirmede en yaygın çözüm. Silikon (VMQ/FVMQ), EPDM ve poliolefinlerde SF 770 astar şart. Saniyeler içinde tutar, boşluk doldurmaz (≤0,1 mm). Sert ve kırılgan bağ; sürekli suya/sıcağa uzun süre maruz kalmada zayıflar. PC/ABS’de gerilme çatlağı yapabilir – önce deneyin.' },
    { id: 'ca480', ad: 'Loctite 480', tip: 'Kauçuk takviyeli siyah siyanoakrilat', tmin: -40, tmax: 100, iletken: false, bul: 4,
      uyum: { NBR: 3, EPDM: 2, FKM: 2, VMQ: 1, HNBR: 3, CR: 3, FVMQ: 1, ACM: 2, FFKM: 1, EMI: 1 },
      yuzey: { al: 3, paslanmaz: 3, celik: 3, plastik: 2, conta: 2 },
      not: 'Darbe/titreşim ve soyulma dayanımı 406’ya göre daha iyi. Kauçuk–metal yapıştırmada tercih edilir. Silikonda zayıf.' },
    { id: 'rtv', ad: 'Nötr kürlenen silikon RTV (ör. DOWSIL 3145 / 732 tipi)', tip: 'Tek komponent silikon', tmin: -55, tmax: 180, iletken: false, bul: 4,
      uyum: { NBR: 1, EPDM: 1, FKM: 1, VMQ: 3, HNBR: 1, CR: 1, FVMQ: 2, ACM: 1, FFKM: 0, EMI: 2 },
      yuzey: { al: 3, paslanmaz: 3, celik: 3, plastik: 2, conta: 3 },
      not: 'Silikon contaları metale yapıştırmak için doğal çözüm; esnek ve yüksek sıcaklığa dayanıklı. Elektronik ve alüminyum/bakır yakınında ASETİK (sirke kokulu) tip değil, NÖTR kürlenen tip kullanın – asetik tip korozyon yapar. Kür 24 saat+ sürer.' },
    { id: 'kontakt', ad: 'Polikloropren kontakt yapıştırıcı (ör. 3M Scotch-Weld 1357)', tip: 'Solvent bazlı kontakt', tmin: -30, tmax: 90, iletken: false, bul: 5,
      uyum: { NBR: 3, EPDM: 2, FKM: 1, VMQ: 0, HNBR: 2, CR: 3, FVMQ: 0, ACM: 1, FFKM: 0, EMI: 0 },
      yuzey: { al: 3, paslanmaz: 3, celik: 3, plastik: 2, conta: 2 },
      not: 'Levhadan kesilmiş geniş NBR/CR/EPDM contaları kapak/flanşa sabitlemek için. İki yüzeye sürülür, kuruyunca birleştirilir. Silikona yapışmaz.' },
    { id: 'vhb', ad: 'Akrilik çift taraflı bant (ör. 3M VHB serisi)', tip: 'Akrilik PSA bant', tmin: -30, tmax: 90, iletken: false, bul: 5,
      uyum: { NBR: 1, EPDM: 2, FKM: 1, VMQ: 0, HNBR: 1, CR: 2, FVMQ: 0, ACM: 1, FFKM: 0, EMI: 0 },
      yuzey: { al: 3, paslanmaz: 3, celik: 3, plastik: 3, conta: 1 },
      not: 'Sünger/köpük ve ince levha contalarda montaj kolaylığı. Silikona yapışmaz – silikon contalarda tedarikçiden “silikon PSA’lı” ürün isteyin.' },
    { id: 'siPSA', ad: 'Fabrika uygulamalı silikon PSA (conta ile birlikte sipariş)', tip: 'Silikon PSA', tmin: -40, tmax: 150, iletken: false, bul: 3,
      uyum: { NBR: 1, EPDM: 1, FKM: 1, VMQ: 3, HNBR: 1, CR: 1, FVMQ: 2, ACM: 0, FFKM: 0, EMI: 2 },
      yuzey: { al: 3, paslanmaz: 3, celik: 3, plastik: 3, conta: 1 },
      not: 'Conta üreticisinden yapışkan bantlı olarak istenir. Seri üretimde hızlı montaj; konumlandırma amaçlıdır, sızdırmazlık kuvveti sağlamaz.' },
    { id: 'cb1030', ad: 'CHO-BOND 1030 (+1086 astar)', tip: 'İletken silikon RTV (Ag/Cu dolgulu)', tmin: -55, tmax: 200, iletken: true, bul: 2,
      uyum: { NBR: 0, EPDM: 0, FKM: 0, VMQ: 2, HNBR: 0, CR: 0, FVMQ: 2, ACM: 0, FFKM: 0, EMI: 3 },
      yuzey: { al: 3, paslanmaz: 3, celik: 3, plastik: 1, conta: 3 },
      not: 'İletken silikon EMI contalarını metal gövdeye yapıştırmak için özel olarak geliştirilmiş tek komponent iletken RTV. CHO-BOND 1086 astar ile kullanılır. Esnek bağ.' },
    { id: 'cb1035', ad: 'CHO-BOND 1035 (+1086 astar)', tip: 'İletken silikon RTV (Ag/cam dolgulu)', tmin: -55, tmax: 200, iletken: true, bul: 2,
      uyum: { NBR: 0, EPDM: 0, FKM: 0, VMQ: 2, HNBR: 0, CR: 0, FVMQ: 1, ACM: 0, FFKM: 0, EMI: 2 },
      yuzey: { al: 3, paslanmaz: 3, celik: 3, plastik: 1, conta: 2 },
      not: 'Hafif ve daha ekonomik iletken silikon; asıl kullanım alanı muhafaza ek yerlerinin iletken sızdırmazlığı. Min. yapıştırma kalınlığı ~0,18 mm.' },
    { id: 'cb36020', ad: 'CHO-BOND 360-20', tip: 'İletken epoksi (Ag/Cu, 2 komponent)', tmin: -62, tmax: 100, iletken: true, bul: 2,
      uyum: { NBR: 0, EPDM: 0, FKM: 0, VMQ: 1, HNBR: 0, CR: 0, FVMQ: 1, ACM: 0, FFKM: 0, EMI: 2 },
      yuzey: { al: 3, paslanmaz: 3, celik: 3, plastik: 1, conta: 1 },
      not: 'EMI conta tutturma ve gövde birleştirme için koyu macun kıvamında iletken epoksi. Sert bağ; min. bağ kalınlığı ~0,25 mm.' },
    { id: 'cPSA', ad: 'İletken PSA (conta üreticisi tarafından uygulanır)', tip: 'İletken akrilik PSA', tmin: -40, tmax: 125, iletken: true, bul: 2,
      uyum: { NBR: 0, EPDM: 0, FKM: 0, VMQ: 1, HNBR: 0, CR: 0, FVMQ: 1, ACM: 0, FFKM: 0, EMI: 3 },
      yuzey: { al: 3, paslanmaz: 3, celik: 3, plastik: 2, conta: 0 },
      not: 'CHO-SEAL levha/ekstrüzyonlar ince iletken PSA bantlı tedarik edilebilir. Montaj kolaylığı içindir; yapışma kuvveti sınırlıdır.' }
  ];

  const YUZEYLER = [
    { k: 'al', ad: 'Alüminyum (kromat/Alodine kaplı veya çıplak)' },
    { k: 'paslanmaz', ad: 'Paslanmaz çelik' },
    { k: 'celik', ad: 'Karbon çelik (boyalı/kaplamalı)' },
    { k: 'plastik', ad: 'Plastik (PA, PC, ABS, PBT…)' },
    { k: 'conta', ad: 'Conta–conta (uç birleştirme / kordon ekleme)' }
  ];

  // ---------------- Ankara tedarikçileri ----------------
  // Kaynak: OSTİM OSB firma rehberi ve distribütör sayfaları (Kasım 2026). Aramadan önce güncelliğini teyit edin.
  const TEDARIKCILER = [
    { ad: 'Eray Sızdırmazlık San. Tic. Ltd.', bolge: 'OSTİM', odak: 'Hidrolik/pnömatik sızdırmazlık elemanları, O-ring, keçe, conta setleri (ithal, OEM ve yerli)', tags: ['O-ring', 'Hidrolik', 'Stok'],
      adres: 'Uzayçağı Cad. 1271. Cadde (eski 906) No:66 1-E, OSTİM / Yenimahalle / Ankara', tel: ['+90 312 354 85 98', '+90 312 385 97 82', '+90 535 392 92 49'], eposta: 'info@eraykece.com', web: 'http://www.eraykece.com',
      kaynak: 'https://ostim.org.tr/companies/eray-sizdirmazlik-san-tic-ltd-1' },
    { ad: 'Ada Sızdırmazlık Kauçuk San. ve Tic. A.Ş.', bolge: 'OSTİM', odak: 'Kauçuk sızdırmazlık ürünleri, iş makinesi yedek parça contaları (1996’dan beri)', tags: ['Kauçuk', 'Conta', 'Stok'],
      adres: '100. Yıl Bulvarı Kosova İş Merkezi No:137/L, OSTİM / Ankara', tel: ['+90 312 354 72 73', '+90 312 385 61 11', '+90 312 385 80 81'], eposta: 'adakaucuk@adakaucuk.com.tr', web: 'http://adakaucuk.com.tr',
      kaynak: 'https://ostim.org.tr/companies/ada-sizdirmazlik-kaucuk-sanve-ticas-1' },
    { ad: 'Babacan Endüstri Kauçuk Ürünleri İmalatı San. Tic. Ltd. Şti.', bolge: 'OSTİM', odak: 'Kauçuk ürün imalatı, hidrolik silindir/pnömatik sistem kauçuk parçaları; ARUS (raylı sistemler) küme üyesi, ISO 9001', tags: ['İmalat', 'Özel kalıp', 'ISO 9001'],
      adres: '100. Yıl Bulvarı No:44, OSTİM / Yenimahalle / Ankara', tel: ['+90 312 385 49 10', '+90 533 259 45 72'], eposta: 'info@babacankaucuk.com', web: '',
      kaynak: 'https://www.ostim.org.tr/companies/babacan-endustri-kaucuk-urunleri-imalati-san-tic-ltdsti-1' },
    { ad: 'Gülhan Yedek Parça İml. San. ve Tic. Ltd. Şti.', bolge: 'OSTİM', odak: 'Kauçuk ürün imalatı ve satışı; OSTİM Kauçuk Teknolojileri ve Savunma Sanayi kümelenmesi üyesi, ISO 9001 / TS EN 9100', tags: ['İmalat', 'Savunma', 'EN 9100'],
      adres: '100. Yıl Bulvarı Prestij İş Merkezi No:55-D7, OSTİM / Ankara', tel: ['+90 312 385 53 22', '+90 312 385 81 18'], eposta: 'info@gulhan.com', web: 'http://www.gulhan.com',
      kaynak: 'https://ostim.org.tr/companies/gulhan-yedek-parca-iml-san-ve-tic-ltd-sti-1' },
    { ad: 'Akmepol Poliüretan Plastik Kauçuk Mak. İml. Ltd. Şti.', bolge: 'OSTİM', odak: 'Poliüretan ve kauçuk parça imalatı (özel ölçü/kalıp)', tags: ['Poliüretan', 'Kauçuk', 'Özel parça'],
      adres: '1173. Cadde (eski 5) No:19, OSTİM / Ankara', tel: ['+90 312 386 16 12', '+90 532 521 85 99'], eposta: 'fatihakmepol@hotmail.com', web: '',
      kaynak: 'https://www.ostim.org.tr/companies/akmepol-poliuretan-pls-kaucuk-mak-iml-ith-ihr-ltd-sti-1' },
    { ad: 'AC Tasarım (Holland Shielding Türkiye distribütörü)', bolge: 'Kahramankazan – Uzay ve Havacılık OSB', odak: 'EMI/RFI ekranlama: iletken contalar, parmak yaylar (fingerstrip), iletken bantlar, petek havalandırma pencereleri', tags: ['EMI', 'Ekranlama', 'Distribütör'],
      adres: 'Saray OSB Mah., Ankara Uzay ve Havacılık OSB, G2 Cad. No:7, 06980 Kahramankazan / Ankara', tel: ['+90 312 468 93 13'], eposta: '', web: 'http://www.actasarim.com.tr',
      kaynak: 'https://hollandshielding.com/en/distributors' },
    { ad: 'OSTİM Kauçuk Teknolojileri Kümelenmesi (OSTİM OSB üzerinden)', bolge: 'OSTİM', odak: 'Ankara’daki kauçuk üreticilerine toplu erişim; özel conta/profil imalatçısı arıyorsanız ilk durak', tags: ['Küme', 'Yönlendirme'],
      adres: '100. Yıl Bulvarı No:101/A, 06374 OSTİM / Ankara', tel: ['+90 312 385 50 90'], eposta: 'ostim@ostim.org.tr', web: 'https://ostim.org.tr',
      kaynak: 'https://ostim.org.tr/news' }
  ];

  const out = { REF, ORTAMLAR, MALZEMELER, D2000_TIP, D2000_SINIF, SIKISTIRMA, SEVIYE_AD, CS_LISTE, DELIK, YAPISTIRICILAR, YUZEYLER, TEDARIKCILER };
  g.DATA = out;
  if (typeof module !== 'undefined') module.exports = out;
})(typeof window !== 'undefined' ? window : globalThis);
