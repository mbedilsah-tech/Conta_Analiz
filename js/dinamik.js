/* Dinamik O-ring sızdırmazlığı (yalnız uzman mod): öteleme (piston/mil) ve döner mil.
   Kaynaklar: Parker ORD 5700 Design Chart 5-2 (endüstriyel öteleme kanalları),
   Parker dinamik O-ring rehberi (döner hız sınırları), Freudenberg FST AS568 kılavuzu
   (ekstrüzyon boşluğu, montaj pahı, gerilme sınırları), Apple Rubber (döner conta). */
(function (g) {
  'use strict';
  const IN = 25.4;
  const mm = v => +(v * IN).toFixed(3);

  // Parker ORD 5700 Design Chart 5-2 (inch) → mm
  const TABLO = [
    { cs: 1.78, seri: '-0xx (006–012)', L: [0.055, 0.057], sq: [15, 25], E: [0.002, 0.005], G: [[0.093, 0.098], [0.138, 0.143], [0.205, 0.210]], R: [0.005, 0.015], ecc: 0.002 },
    { cs: 2.62, seri: '-1xx (104–116)', L: [0.088, 0.090], sq: [10, 17], E: [0.002, 0.005], G: [[0.140, 0.145], [0.171, 0.176], [0.238, 0.243]], R: [0.005, 0.015], ecc: 0.002 },
    { cs: 3.53, seri: '-2xx (201–222)', L: [0.121, 0.123], sq: [9, 16], E: [0.003, 0.006], G: [[0.187, 0.192], [0.208, 0.213], [0.275, 0.280]], R: [0.010, 0.025], ecc: 0.003 },
    { cs: 5.33, seri: '-3xx (309–349)', L: [0.185, 0.188], sq: [8, 14], E: [0.003, 0.006], G: [[0.281, 0.286], [0.311, 0.316], [0.410, 0.415]], R: [0.020, 0.035], ecc: 0.004 },
    { cs: 6.99, seri: '-4xx (425–460)', L: [0.237, 0.240], sq: [11, 16], E: [0.004, 0.007], G: [[0.375, 0.380], [0.408, 0.413], [0.538, 0.543]], R: [0.020, 0.035], ecc: 0.005 }
  ].map(t => ({ ...t, L: t.L.map(mm), E: t.E.map(mm), G: t.G.map(r => r.map(mm)), R: t.R.map(mm), ecc: mm(t.ecc) }));

  // FST: montaj pahı uzunluğu (mm)
  const PAH = { 1.78: 2.1, 2.62: 3.1, 3.53: 4.0, 5.33: 6.0, 6.99: 7.2 };

  // FST: izin verilen en büyük ekstrüzyon boşluğu (çapta, mm) – basınç (bar) × sertlik
  const EKS = [
    { P: 34.5, s: { 70: 0.38, 80: 0.51, 90: 0.64 } },
    { P: 51.7, s: { 70: 0.28, 80: 0.41, 90: 0.58 } },
    { P: 68.9, s: { 70: 0.20, 80: 0.30, 90: 0.46 } },
    { P: 86.2, s: { 70: 0.10, 80: 0.23, 90: 0.38 } },
    { P: 103.4, s: { 70: 0.05, 80: 0.18, 90: 0.30 } }
  ];
  function eksSinir(P, shore) {
    if (!(P >= 0)) return null;
    if (P > EKS[EKS.length - 1].P) return null; // destek halkası şart
    if (P <= EKS[0].P) return EKS[0].s[shore];
    for (let i = 1; i < EKS.length; i++) {
      if (P <= EKS[i].P) {
        const a = EKS[i - 1], b = EKS[i], k = (P - a.P) / (b.P - a.P);
        return a.s[shore] + k * (b.s[shore] - a.s[shore]);
      }
    }
    return null;
  }

  // Parker: döner contada çevresel hıza göre en büyük kesit
  const DONER_HIZ = [
    { v: 1.02, cs: 99, ad: '≤ 1 m/s: kesit genelde kritik değil' },
    { v: 2.03, cs: 3.53, ad: '1–2 m/s: en fazla 3,53 mm kesit' },
    { v: 3.05, cs: 2.62, ad: '2–3 m/s: en fazla 2,62 mm kesit' },
    { v: 7.62, cs: 1.78, ad: '3–7,6 m/s: en fazla 1,78 mm kesit' }
  ];

  const MALZ = [
    { kod: 'NBR', ad: 'Nitril (NBR)', T: [-30, 100], ak: ['hidrolik', 'pnomatik', 'su'], shore: '70 / 80 / 90', not: 'Hidrolik yağda standart seçim. Aşınma iyi, fiyat düşük. Kendinden yağlamalı (iç yağlamalı) NBR sürtünmeyi düşürür.', dinamik: 5 },
    { kod: 'HNBR', ad: 'Hidrojenize nitril (HNBR)', T: [-25, 150], ak: ['hidrolik', 'pnomatik', 'su'], shore: '70 / 80 / 90', not: 'NBR’den daha yüksek sıcaklık ve aşınma dayanımı. Ağır hizmet hidrolik ve döner uygulamalarda tercih edilir.', dinamik: 5 },
    { kod: 'AU/EU', ad: 'Poliüretan (AU/EU)', T: [-30, 80], ak: ['hidrolik', 'pnomatik'], shore: '90 – 95', not: 'En yüksek aşınma ve ekstrüzyon dayanımı. Sıcak suya ve buhara karşı zayıf (hidroliz).', dinamik: 5 },
    { kod: 'FKM', ad: 'Florokarbon (FKM / Viton)', T: [-20, 200], ak: ['hidrolik', 'pnomatik', 'su'], shore: '75 / 90', not: 'Yüksek sıcaklık, yakıt ve kimyasallar için. Soğukta sertleşir; düşük sıcaklıkta dinamik sızdırmazlık zayıflar.', dinamik: 4 },
    { kod: 'EPDM', ad: 'Etilen propilen (EPDM)', T: [-45, 150], ak: ['su'], shore: '70 / 80', not: 'Su, buhar, glikol ve fren hidroliği (DOT) için. Mineral yağ ve gresle kesinlikle kullanılmaz.', dinamik: 3 },
    { kod: 'FFKM', ad: 'Perfloroelastomer (FFKM)', T: [-15, 300], ak: ['hidrolik', 'pnomatik', 'su'], shore: '75 / 90', not: 'Agresif kimyasal ve çok yüksek sıcaklık. Çok pahalı; yalnızca gerektiğinde.', dinamik: 3 },
    { kod: 'VMQ', ad: 'Silikon (VMQ)', T: [-55, 200], ak: ['pnomatik', 'su'], shore: '70', not: 'Yırtılma ve aşınma dayanımı düşük: dinamik uygulamada önerilmez. Yalnızca çok hafif, yavaş hareketlerde.', dinamik: 1 }
  ];

  const REF = {
    parkerDin: { kisa: 'Parker ORD 5700 – Design Chart 5-2', ad: 'Parker O-Ring Handbook ORD 5700, Bölüm 5: Dinamik O-ring sızdırmazlığı – Design Chart 5-2 endüstriyel öteleme kanalları (kanal derinliği, sıkışma, genişlik, radyüs, eksen kaçıklığı, yüzey kalitesi)', url: 'https://allsealsinc.com/pdfs/Dynamic-oring-glands.pdf' },
    parkerRot: { kisa: 'Parker – Dinamik O-ring', ad: 'Parker O-Ring & Engineered Seals: dinamik sızdırmazlıkta O-ring – öteleme/döner sıkışma oranları ve döner hız–kesit tablosu', url: 'https://www.parker.com/us/en/divisions/o-ring-and-engineered-seals-division/resources/seal-solutions-guide/dynamic-sealing/o-ring.html' },
    fstAs568: { kisa: 'FST AS568 kılavuzu', ad: 'Freudenberg Sealing Technologies – O-Ring AS568 Size Guide: en büyük ekstrüzyon boşluğu tablosu, montaj pahı uzunluğu, gerilme/sıkışma sınırları', url: 'https://www.fst.com/-/media/files/brochures/en/fst-o-ring-as568-size-guide_a4-online.pdf' },
    appleRot: { kisa: 'Apple Rubber – Döner conta', ad: 'Apple Rubber Seal Design Guide – Rotary seals: sıcaklık sınırları, sürtünme ısısı, iç çapta gerilme olmaması, çevresel sıkıştırma', url: 'https://www.applerubber.com/seal-design-guide/seal-types-and-gland-design/rotary-seals/' }
  };
  if (g.DATA && g.DATA.REF) Object.assign(g.DATA.REF, REF);

  const U = () => g.UI;
  const f = (v, d = 2) => U().f(v, d);
  const r2 = v => Math.round(v * 100) / 100;

  function satir(cs) { return TABLO.find(t => Math.abs(t.cs - cs) < 0.01) || TABLO[1]; }

  // AS568 içinden halka seç
  function halkaSec(cs, kosul, hedef) {
    const AS = g.AS568 || [];
    const aday = AS.filter(x => Math.abs(x.cs - cs) < 0.03 && kosul(x));
    if (!aday.length) return null;
    return aday.reduce((a, b) => (Math.abs(hedef(a)) <= Math.abs(hedef(b)) ? a : b));
  }

  function hesapla(S) {
    const t = satir(S.dCs);
    const d = S.dCap;
    const doner = S.dHareket === 'doner';
    const konum = doner ? 'mil' : S.dKonum;
    const bu = S.dP > 103.4 || S.dBU === 'var' ? (S.dYon === 'cift' ? 2 : 1) : 0;
    const M = []; // [seviye 0/1/2, metin]
    const ekle = (s, m) => M.push([s, m]);
    const out = { t, d, doner, konum, bu, M };
    if (!(d > 0)) return out;

    // Kanal derinliği ve sıkışma
    let L = t.L.slice(), sq = t.sq.slice();
    if (doner) {
      sq = [3, 10];
      L = [r2(t.cs * (1 - sq[1] / 100)), r2(t.cs * (1 - sq[0] / 100))];
    } else if (S.dAkiskan === 'pnomatik') {
      // Pnömatikte sürtünmeyi azaltmak için sıkışmayı bandın alt yarısında tut
      const ust = (sq[0] + sq[1]) / 2;
      sq = [Math.max(6, sq[0] - 2), ust];
      L = [r2(t.cs * (1 - ust / 100)), r2(t.cs * (1 - sq[0] / 100))];
    }
    out.L = L; out.sq = sq;
    const Lort = (L[0] + L[1]) / 2;

    // Kanal çapı
    if (konum === 'mil') {
      out.kanalCap = [d + 2 * L[0], d + 2 * L[1]];
      out.karsiCap = [d + t.E[0], d + t.E[1]];
      out.kanalAd = doner ? 'Gövdedeki kanal dip çapı' : 'Gövdedeki kanal dip çapı (A-1)';
      out.karsiAd = 'Gövde deliği (mil geçişi) çapı';
    } else {
      out.kanalCap = [d - 2 * L[1], d - 2 * L[0]];
      out.karsiCap = [d - t.E[1], d - t.E[0]];
      out.kanalAd = 'Piston kanal dip çapı (B-1)';
      out.karsiAd = 'Piston dış çapı (C)';
    }
    out.G = t.G[bu];

    // O-ring seçimi
    const kc = (out.kanalCap[0] + out.kanalCap[1]) / 2;
    if (doner) {
      // İç çap mile eşit veya biraz büyük (gerilme yok), dış çap kanaldan %2–5 büyük
      out.halka = halkaSec(t.cs, x => x.id >= d * 0.999 && x.id <= d * 1.06, x => x.id - d * 1.01);
      if (out.halka) { out.gerilme = (d - out.halka.id) / out.halka.id * 100; out.disSik = ((out.halka.id + 2 * out.halka.cs) - kc) / kc * 100; }
    } else if (konum === 'piston') {
      out.halka = halkaSec(t.cs, x => x.id <= kc && x.id >= kc / 1.06, x => kc / x.id - 1.02);
      if (out.halka) out.gerilme = (kc - out.halka.id) / out.halka.id * 100;
    } else {
      out.halka = halkaSec(t.cs, x => { const od = x.id + 2 * x.cs; return od >= kc && od <= kc * 1.06; }, x => (x.id + 2 * x.cs) / kc - 1.02);
      if (out.halka) { out.disSik = ((out.halka.id + 2 * out.halka.cs) - kc) / kc * 100; out.gerilme = (d - out.halka.id) / out.halka.id * 100; }
    }

    // Değerlendirme
    const Eg = S.dE > 0 ? S.dE : t.E[1];
    out.Eg = Eg;
    const sinir = eksSinir(S.dP, +S.dShore);
    out.eksSinir = sinir;
    if (S.dP > 103.4) ekle(bu ? 1 : 2, `Basınç ${f(S.dP, 0)} bar: 103 bar (1500 psi) üzerinde destek halkası (back-up ring) şarttır. ${bu ? `${bu} destek halkasına göre kanal genişliği verildi.` : ''} Mümkünse boşluğu en aza indirin ve 90 Shore A kullanın.`);
    else if (sinir != null) {
      if (Eg > sinir) ekle(2, `Ekstrüzyon riski: çaptaki boşluk ${f(Eg, 2)} mm, ${S.dShore} Shore A için ${f(S.dP, 0)} bar’da izin verilen en fazla ${f(sinir, 2)} mm. Daha sert O-ring, destek halkası veya daha dar boşluk gerekir.`);
      else if (Eg > sinir * 0.75) ekle(1, `Ekstrüzyon sınıra yakın: boşluk ${f(Eg, 2)} mm, sınır ${f(sinir, 2)} mm (${S.dShore} Shore A, ${f(S.dP, 0)} bar).`);
      else ekle(0, `Ekstrüzyon güvenli: boşluk ${f(Eg, 2)} mm ≤ ${f(sinir, 2)} mm (${S.dShore} Shore A, ${f(S.dP, 0)} bar).`);
    }
    if (S.dP > 103.4 && +S.dShore < 90) ekle(1, `${f(S.dP, 0)} bar için ${S.dShore} Shore A yumuşak kalır; destek halkasıyla birlikte 90 Shore A önerilir.`);
    else if (S.dP > 70 && +S.dShore < 80) ekle(1, `${f(S.dP, 0)} bar için 80 Shore A daha güvenli (ekstrüzyon ve aşınma).`);
    if (Eg > t.E[1] + 1e-6) ekle(1, `Girilen boşluk (${f(Eg, 2)} mm) Parker tablosundaki en büyük değerin (${f(t.E[1], 2)} mm) üzerinde; O-ring eksen kaçıklığında sıkışmayı kaybedebilir.`);
    if (S.dHareket !== 'doner' && S.dP > 0 && S.dP <= 103.4 && bu === 0 && S.dYon === 'cift' && S.dP > 50) ekle(1, 'Çift yönlü basınçta O-ring kanalda ileri-geri yuvarlanır; spiral hasarına karşı 80 Shore A ve iyi yağlama önerilir.');

    // Hız
    if (doner) {
      const v = Math.PI * d * (S.dRpm || 0) / 60000;
      out.v = v;
      const k = DONER_HIZ.find(x => v <= x.v);
      if (!k) ekle(2, `Çevresel hız ${f(v, 2)} m/s: 7,6 m/s üzerinde O-ring döner conta olarak kullanılmaz. Radyal mil keçesi (ISO 6194 / DIN 3760) veya mekanik salmastra kullanın.`);
      else if (t.cs > k.cs + 0.01) ekle(2, `Çevresel hız ${f(v, 2)} m/s için kesit çok büyük (${f(t.cs)} mm). ${k.ad}. Sürtünme ısısı O-ring’i sertleştirir (Gow-Joule etkisi).`);
      else ekle(0, `Çevresel hız ${f(v, 2)} m/s – kesit uygun (${k.ad}).`);
      if (t.cs > 3.6) ekle(2, '3,53 mm üzerindeki kesitler döner contada önerilmez (Parker).');
      if (S.dP > 60) ekle(2, `Basınç ${f(S.dP, 0)} bar: O-ring döner conta düşük basınç içindir (yaklaşık 60 bar altı). Basınçlı döner uygulama için PTFE döner keçe kullanın.`);
      const Tm = U().S();
      if (Tm.Tmax > 121 || Tm.Tmin < -40) ekle(1, `Proje sıcaklığı (${Tm.Tmin} … ${Tm.Tmax} °C) döner O-ring için önerilen −40 … +121 °C aralığının dışında; sürtünme ısısı da eklenir.`);
    } else {
      const v = S.dHiz;
      out.v = v;
      if (v > 0.5) ekle(1, `Öteleme hızı ${f(v, 2)} m/s: 0,5 m/s üzerinde O-ring hızla aşınır. U-keçe, PTFE kayar keçe veya poliüretan keçe düşünün.`);
      else if (v > 0 && v < 0.02) ekle(1, `Çok düşük hız (${f(v, 3)} m/s): O-ring takılıp kayabilir (stick-slip). Düşük sürtünmeli malzeme ve yağlama önerilir.`);
      else if (v > 0) ekle(0, `Öteleme hızı ${f(v, 2)} m/s – O-ring için uygun aralıkta.`);
      if (S.dAkiskan === 'pnomatik') ekle(0, 'Pnömatik: sürtünmeyi azaltmak için sıkışma bandın alt yarısında tutuldu. Kuru hava O-ring’i aşındırır; yağlı hava veya gresli montaj önerilir.');
    }
    // Halka
    if (!out.halka) ekle(1, `Bu çap ve ${f(t.cs)} mm kesit için uygun standart AS568 halka bulunamadı; metrik (ISO 3601) veya özel ölçü halka gerekir.`);
    else if (out.gerilme > 5) ekle(1, `Seçilen halkada iç çap gerilmesi %${f(out.gerilme, 1)}: %5 üzeri kesiti inceltir ve ömrü kısaltır.`);
    if (doner && out.halka && out.gerilme > 0.1) ekle(2, 'Döner contada O-ring mil üzerinde gerilmemeli; iç çap mil çapından küçük olamaz.');

    // Malzeme
    const P = U().S();
    out.malz = MALZ.map(m => {
      const T = P.Tmin >= m.T[0] && P.Tmax <= m.T[1];
      const A = m.ak.includes(S.dAkiskan);
      return { ...m, uygun: T && A, nedeni: !A ? 'Akışkana uygun değil' : !T ? `Sıcaklık aralığı ${m.T[0]} … ${m.T[1]} °C` : '' };
    }).sort((a, b) => (b.uygun - a.uygun) || (b.dinamik - a.dinamik));

    out.seviye = Math.max(0, ...M.map(x => x[0]));
    return out;
  }

  // ---------------- Çizim ----------------
  function kesitSvg(r) {
    const { t } = r;
    const W = 520, H = 250, k = 150 / (t.G[0][1] * 2.2);
    const G = (r.G[0] + r.G[1]) / 2 * k, Lp = (r.L[0] + r.L[1]) / 2 * k, e = Math.max(4, r.Eg / 2 * k), cs = t.cs * k;
    const x0 = 150, yS = 150; // sızdırmazlık yüzeyi (karşı parça yüzeyi)
    const kanalUst = r.konum === 'mil'; // mil contası: kanal gövdede (üstte), piston: kanal pistonda (altta)
    const ink = '#1d2326', blue = '#1f5f99', metal = '#e9ecea', ring = '#d9622b';
    let s = `<svg class="cizim" viewBox="0 0 ${W} ${H}" role="img" aria-label="Dinamik kanal kesiti">
      <defs><marker id="dn-a" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L10 5 L0 9 z" fill="${blue}"/></marker>
      <pattern id="dn-h" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#b8bfbb" stroke-width="1"/></pattern></defs>`;
    if (kanalUst) {
      // Üstte gövde (kanal), altta hareketli mil
      const yG = yS - e; // gövde alt yüzü
      s += `<path d="M20 20 H${W - 20} V${yG} H${x0 + G} V${yS - Lp} H${x0} V${yG} H20 Z" fill="url(#dn-h)" stroke="${ink}" stroke-width="1.5"/>`;
      s += `<rect x="20" y="${yS}" width="${W - 40}" height="70" fill="${metal}" stroke="${ink}" stroke-width="1.5"/>`;
      s += `<text x="${W - 30}" y="${yS + 40}" font-size="13" text-anchor="end" fill="${ink}">${r.doner ? 'Döner mil' : 'Hareketli mil (rod)'}</text><text x="30" y="40" font-size="13" fill="${ink}">Gövde</text>`;
      const cy = yS - Lp / 2, ry = Lp / 2, rx = Math.min(G / 2 - 1, cs / 2 * (cs / Lp) ** 0.5);
      s += `<ellipse cx="${x0 + G / 2}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${ring}" opacity=".9"/>`;
      s += `<line x1="${x0 - 30}" y1="${yS - Lp}" x2="${x0 - 30}" y2="${yS}" stroke="${blue}" marker-start="url(#dn-a)" marker-end="url(#dn-a)"/><text x="${x0 - 36}" y="${yS - Lp / 2 + 4}" font-size="12" text-anchor="end" fill="${blue}">L = ${f((r.L[0] + r.L[1]) / 2)}</text>`;
      s += `<line x1="${x0}" y1="${yS - Lp - 22}" x2="${x0 + G}" y2="${yS - Lp - 22}" stroke="${blue}" marker-start="url(#dn-a)" marker-end="url(#dn-a)"/><text x="${x0 + G / 2}" y="${yS - Lp - 28}" font-size="12" text-anchor="middle" fill="${blue}">G = ${f((r.G[0] + r.G[1]) / 2)}</text>`;
      s += `<text x="${x0 + G + 18}" y="${yS - e / 2 + 4}" font-size="11" fill="${blue}">boşluk E/2</text>`;
    } else {
      const yB = yS; // silindir iç yüzeyi (üstte)
      const yP = yS + e; // piston üst yüzü
      s += `<rect x="20" y="20" width="${W - 40}" height="${yB - 20}" fill="${metal}" stroke="${ink}" stroke-width="1.5"/>`;
      s += `<path d="M20 ${yP} H${x0} V${yB + Lp} H${x0 + G} V${yP} H${W - 20} V${H - 15} H20 Z" fill="url(#dn-h)" stroke="${ink}" stroke-width="1.5"/>`;
      s += `<text x="30" y="45" font-size="13" fill="${ink}">Silindir (sabit)</text><text x="${W - 30}" y="${H - 28}" font-size="13" text-anchor="end" fill="${ink}">Hareketli piston</text>`;
      const cy = yB + Lp / 2, ry = Lp / 2, rx = Math.min(G / 2 - 1, cs / 2 * (cs / Lp) ** 0.5);
      s += `<ellipse cx="${x0 + G / 2}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${ring}" opacity=".9"/>`;
      s += `<line x1="${x0 - 30}" y1="${yB}" x2="${x0 - 30}" y2="${yB + Lp}" stroke="${blue}" marker-start="url(#dn-a)" marker-end="url(#dn-a)"/><text x="${x0 - 36}" y="${yB + Lp / 2 + 4}" font-size="12" text-anchor="end" fill="${blue}">L = ${f((r.L[0] + r.L[1]) / 2)}</text>`;
      s += `<line x1="${x0}" y1="${yB + Lp + 22}" x2="${x0 + G}" y2="${yB + Lp + 22}" stroke="${blue}" marker-start="url(#dn-a)" marker-end="url(#dn-a)"/><text x="${x0 + G / 2}" y="${yB + Lp + 38}" font-size="12" text-anchor="middle" fill="${blue}">G = ${f((r.G[0] + r.G[1]) / 2)}</text>`;
      s += `<text x="${x0 + G + 18}" y="${yB + e / 2 + 4}" font-size="11" fill="${blue}">boşluk E/2</text>`;
    }
    s += `<line x1="${x0 + G + 60}" y1="${yS + (kanalUst ? 35 : -35)}" x2="${x0 + G + 140}" y2="${yS + (kanalUst ? 35 : -35)}" stroke="${ink}" marker-start="url(#dn-a)" marker-end="url(#dn-a)"/>
      <text x="${x0 + G + 100}" y="${yS + (kanalUst ? 55 : -43)}" font-size="11" text-anchor="middle" fill="${ink}">${r.doner ? 'dönme' : 'hareket'}</text>`;
    s += `<text x="${x0 + G / 2}" y="${H - 4}" font-size="11" text-anchor="middle" fill="#5d676c">Sızdırmazlık yüzeyi Ra 0,1–0,4 µm · kanal yüzeyleri Ra ≤ ${r.bu ? '1,6' : '0,8'} µm</text>`;
    return s + '</svg>';
  }

  // ---------------- Arayüz ----------------
  function girdi(S) {
    const { esc } = U();
    const num = (key, label, step = 0.01) => `<label>${label}<input type="number" step="${step}" data-num="${key}" value="${S[key] ?? ''}"></label>`;
    const doner = S.dHareket === 'doner';
    return `<h3>Dinamik conta girdileri</h3>
      <div class="row-inline">
        <div><div class="small">Hareket tipi</div><div class="seg" data-bind="dHareket"><button data-v="oteleme">Öteleme (ileri-geri)</button><button data-v="doner">Döner mil</button></div></div>
        ${doner ? '' : `<div><div class="small">Conta nerede?</div><div class="seg" data-bind="dKonum"><button data-v="mil">Mil contası (kanal gövdede)</button><button data-v="piston">Piston contası (kanal pistonda)</button></div></div>`}
      </div>
      <div class="row-inline mt">
        <div><div class="small">Akışkan</div><div class="seg" data-bind="dAkiskan"><button data-v="hidrolik">Hidrolik yağ</button><button data-v="pnomatik">Hava (pnömatik)</button><button data-v="su">Su / glikol</button></div></div>
        <div><div class="small">Basınç yönü</div><div class="seg" data-bind="dYon"><button data-v="tek">Tek taraf</button><button data-v="cift">İki taraf</button></div></div>
        <div><div class="small">O-ring sertliği</div><div class="seg" data-bind="dShore"><button data-v="70">70 Shore A</button><button data-v="80">80</button><button data-v="90">90</button></div></div>
      </div>
      <div class="row4 mt">
        <label>O-ring kesiti (AS568)<select data-sel="dCs">${TABLO.map(t => `<option value="${t.cs}">${f(t.cs)} mm  ${esc(t.seri)}</option>`).join('')}</select></label>
        ${num('dCap', doner || S.dKonum === 'mil' ? 'Mil çapı d (mm)' : 'Silindir iç çapı D (mm)', 0.1)}
        ${num('dP', 'Basınç (bar)', 1)}
        ${doner ? num('dRpm', 'Devir (d/dk)', 10) : num('dHiz', 'Hız (m/s)', 0.01)}
      </div>
      <div class="row4 mt">
        ${num('dE', 'Çapta boşluk E (mm, boş = tablo)', 0.01)}
        <label>Destek halkası<select data-sel="dBU"><option value="auto">Otomatik (basınca göre)</option><option value="var">Kullanılacak</option></select></label>
        <div></div><div></div>
      </div>
      <p class="hint">Çaptaki boşluk E: ${doner || S.dKonum === 'mil' ? 'gövde deliği − mil çapı' : 'silindir çapı − piston dış çapı'}. Eksen kaçıklığında boşluğun tamamı bir tarafa toplanabilir, bu yüzden ekstrüzyon kontrolünde E’nin tamamı kullanılır. Sıcaklık ve ortam 1. sayfadaki proje girdilerinden alınır.</p>`;
  }

  function sonuc(S) {
    const { esc, refs } = U();
    const r = hesapla(S);
    if (!(r.d > 0)) return '<div class="card">Çap girin.</div>';
    const rng = (a, d = 2) => `${f(a[0], d)} … ${f(a[1], d)}`;
    const karar = [['iyi', '✔', 'Uygun', 'Girdiler O-ring ile dinamik sızdırmazlık için uygun.'], ['dikkat', '⚠', 'Dikkat', 'Çalışır ama sınırda olan değerler var.'], ['kotu', '✖', 'Uygun değil', 'Bu koşullarda O-ring kısa sürede sızdırır veya hasar görür.']][r.seviye];
    const buAd = ['Destek halkasız', '1 destek halkası', '2 destek halkası'];
    const h = r.halka;
    return `<div class="card">
      <div class="karar ${karar[0]}"><span class="ikon">${karar[1]}</span><div><b>${karar[2]}</b>${karar[3]}</div></div>
      <div class="rule-govde" style="padding-left:0; grid-template-columns: minmax(320px, 540px) 1fr">
        ${kesitSvg(r)}
        <div>${r.M.map(([sv, m]) => `<div class="madde ${['iyi', 'dikkat', 'kotu'][sv]}">${['✔', '⚠', '✖'][sv]} ${esc(m)}</div>`).join('')}</div>
      </div>
    </div>
    <div class="card">
      <h3>Kanal ölçüleri – ${f(r.t.cs)} mm kesit, ${r.doner ? 'döner mil' : r.konum === 'mil' ? 'mil (rod) contası' : 'piston contası'}</h3>
      <table><tbody>
        <tr><td>Kanal derinliği L (sızdırmazlık yüzeyinden kanal dibine, boşluk dahil)</td><td class="num"><b>${rng(r.L)} mm</b></td></tr>
        <tr><td>Sıkışma oranı</td><td class="num"><b>%${f(r.sq[0], 0)} … %${f(r.sq[1], 0)}</b></td></tr>
        <tr><td>${esc(r.kanalAd)}</td><td class="num"><b>Ø ${rng(r.kanalCap)} mm</b></td></tr>
        <tr><td>${esc(r.karsiAd)} (çapta boşluk ${rng(r.t.E)} mm)</td><td class="num">Ø ${rng(r.karsiCap)} mm</td></tr>
        ${[0, 1, 2].map(i => `<tr class="${i === r.bu ? 'best' : ''}"><td>Kanal genişliği G – ${buAd[i]}</td><td class="num">${rng(r.t.G[i])} mm</td></tr>`).join('')}
        <tr><td>Kanal dip radyüsü R</td><td class="num">${rng(r.t.R)} mm</td></tr>
        <tr><td>Kenarlar</td><td class="num">≈ 0,13 mm kırılır · yan duvar 0–5°</td></tr>
        <tr><td>En fazla eksen kaçıklığı (TIR)</td><td class="num">${f(r.t.ecc, 3)} mm</td></tr>
        <tr><td>Montaj pahı (15–20°) uzunluğu</td><td class="num">≥ ${f(PAH[r.t.cs], 1)} mm</td></tr>
      </tbody></table>
      ${refs([['parkerDin', 'Kanal derinliği, sıkışma, genişlik, radyüs, eksen kaçıklığı.'], ['fstAs568', 'Montaj pahı uzunluğu ve ekstrüzyon boşluğu.']].concat(r.doner ? [['parkerRot', 'Döner contada düşük sıkışma ve hız–kesit sınırı.'], ['appleRot', 'Döner contada gerilmesiz montaj ve çevresel sıkıştırma.']] : []))}
    </div>
    <div class="grid2">
      <div class="card">
        <h3>Önerilen O-ring</h3>
        ${h ? `<p class="buyuk-deger">AS568${h.dash} &nbsp; Ø${f(h.id)} × ${f(h.cs)} mm</p>
          <div class="kv">
            ${r.gerilme != null ? `<div><b>%${f(Math.max(0, r.gerilme), 1)}</b><span>iç çap gerilmesi ${r.doner ? '(0 olmalı)' : '(≤ %5)'}</span></div>` : ''}
            ${r.disSik != null ? `<div><b>%${f(r.disSik, 1)}</b><span>dış çapta çevresel sıkışma ${r.doner ? '(hafif sıkışma: halka kanalda dönmemeli)' : '(≤ %5)'}</span></div>` : ''}
          </div>` : '<p>Standart AS568 halka bulunamadı.</p>'}
        <p class="small mt">${r.doner ? 'Döner contada halka gövdedeki kanalda durur; iç çap mile gerilmeden oturur, dış çap kanala hafifçe sıkışır. Böylece O-ring mille birlikte dönmez.' : r.konum === 'piston' ? 'Piston contasında halka kanala %1–5 gerilerek takılır.' : 'Mil contasında halkanın dış çapı gövde kanalına sıkışır; iç çap mile yakın olmalıdır.'}</p>
      </div>
      <div class="card">
        <h3>Ekstrüzyon kontrolü</h3>
        <table class="kmatris"><thead><tr><th>Basınç</th><th class="num">70 ShA</th><th class="num">80 ShA</th><th class="num">90 ShA</th></tr></thead><tbody>
          ${EKS.map(x => `<tr class="${S.dP <= x.P && (EKS.indexOf(x) === 0 || S.dP > EKS[EKS.indexOf(x) - 1].P) ? 'best' : ''}"><td>${f(x.P, 0)} bar</td>${[70, 80, 90].map(s => `<td class="num">${f(x.s[s], 2)}</td>`).join('')}</tr>`).join('')}
          <tr class="${S.dP > 103.4 ? 'best' : ''}"><td>&gt; 103 bar</td><td class="num" colspan="3">destek halkası şart</td></tr>
        </tbody></table>
        <p class="small mt">Değerler izin verilen en büyük çaptaki boşluktur (mm). Sizin boşluğunuz: <b>${f(r.Eg, 2)} mm</b>${r.eksSinir != null ? `, sınır <b>${f(r.eksSinir, 2)} mm</b>` : ''}.</p>
        ${refs([['fstAs568', 'En büyük ekstrüzyon boşluğu tablosu (basınç × sertlik).']])}
      </div>
    </div>
    ${r.doner ? `<div class="card"><h3>Döner mil – hız ve kesit</h3>
      <p>Çevresel hız: <b>${f(r.v, 2)} m/s</b> (v = π · d · n / 60 000)</p>
      <table><tbody>${DONER_HIZ.map(x => `<tr class="${r.v <= x.v && (DONER_HIZ.indexOf(x) === 0 || r.v > DONER_HIZ[DONER_HIZ.indexOf(x) - 1].v) ? 'best' : ''}"><td>${esc(x.ad)}</td></tr>`).join('')}<tr class="${r.v > 7.62 ? 'best' : ''}"><td>&gt; 7,6 m/s: O-ring kullanılmaz (radyal mil keçesi / mekanik salmastra)</td></tr></tbody></table>
      <p class="small mt">Gerilmiş kauçuk ısınınca büzülür (Gow-Joule etkisi): mil üzerinde gerilen O-ring sürtünmeyle ısınıp mili daha çok sıkar ve hızla yanar. Bu yüzden döner contada gerilme sıfır olmalı.</p>
      ${refs([['parkerRot', 'Döner hız – kesit tablosu.'], ['appleRot', 'Sıcaklık sınırı −40 … +121 °C, sürtünme ısısı, gerilmesiz montaj.']])}</div>` : ''}
    <div class="card">
      <h3>Malzeme önerisi (dinamik)</h3>
      <table><thead><tr><th>Malzeme</th><th>Sertlik</th><th class="num">Sıcaklık (°C)</th><th>Dinamik uygunluk</th><th>Not</th></tr></thead><tbody>
        ${r.malz.map((m, i) => `<tr class="${m.uygun && i === 0 ? 'best' : ''} ${m.uygun ? '' : 'soluk'}"><td><b>${esc(m.ad)}</b>${m.uygun ? '' : `<div class="small">✖ ${esc(m.nedeni)}</div>`}</td><td>${esc(m.shore)}</td><td class="num">${m.T[0]} … +${m.T[1]}</td><td>${'●'.repeat(m.dinamik)}${'○'.repeat(5 - m.dinamik)}</td><td class="small">${esc(m.not)}</td></tr>`).join('')}
      </tbody></table>
      <p class="small mt">Sıcaklık aralıkları tipik değerlerdir; kesin değer için tedarikçi veri sayfasına bakın. Sıralama proje sıcaklığı (${U().S().Tmin} … ${U().S().Tmax} °C) ve seçilen akışkana göredir.</p>
    </div>
    <div class="card">
      <h3>Dinamik conta çizim ve montaj kuralları</h3>
      <ul class="liste">
        <li><b>Sızdırmazlık yüzeyi</b> (${r.konum === 'mil' ? 'mil' : 'silindir iç yüzeyi'}): Ra 0,1–0,4 µm, taşlanmış veya honlanmış; sertleştirilmiş ya da sert krom kaplı yüzey aşınmayı azaltır. Çok parlak (Ra &lt; 0,05 µm) yüzey yağ filmini tutmaz.</li>
        <li><b>Kanal yan ve dip yüzeyleri:</b> destek halkasız 32 RMS (≈ Ra 0,8 µm), destek halkalı 63 RMS (≈ Ra 1,6 µm).</li>
        <li><b>Montaj pahı:</b> O-ring’in geçeceği tüm kenarlarda 15–20° pah, en az ${f(PAH[r.t.cs], 1)} mm uzunluk; çapak ve keskin kenar olmamalı.</li>
        <li><b>Port ve delikler:</b> O-ring’in üzerinden geçtiği delik ağızlarına pah verin; aksi halde O-ring kesilir.</li>
        <li><b>Yağlama:</b> montajda akışkanla uyumlu gres kullanın (EPDM’de mineral yağlı gres kullanmayın).</li>
        <li><b>Destek halkası:</b> tek yönlü basınçta basıncın tersi tarafa 1 adet, iki yönlü basınçta her iki tarafa birer adet. Kanal genişliği buna göre seçilir.</li>
        <li><b>Spiral hasar:</b> uzun stroklu, yavaş ve yağlamasız hareketlerde O-ring burularak kesilir. Önlem: doğru sıkışma, iyi yüzey, yağlama, eksen kaçıklığını sınırlamak.</li>
        ${r.doner ? '<li><b>Döner contada</b> halka mutlaka gövde kanalında (dişi kanal) olmalı, mil üzerinde gerilmemeli; kesit 3,53 mm’yi aşmamalı.</li>' : ''}
      </ul>
      ${refs([['parkerDin', 'Yüzey kalitesi, destek halkası ve kanal detayları.'], ['fstAs568', 'Montaj pahı uzunluğu.']])}
    </div>`;
  }

  g.DIN = { girdi, sonuc, hesapla, TABLO, eksSinir };
})(window);
