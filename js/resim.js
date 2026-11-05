/* Örnek teknik resim (GD&T): prizmatik blok veya silindirik parça için
   4 işleme seviyesinde (çok hassas / hassas / standart / kaba) datumlu örnek resim.
   Boyut toleransı ISO 286 (IT), form/yönelim değerleri IT tabanlı (ISO 2768-2 H/K/L ile uyumlu),
   konum toleransı ASME Y14.5 yüzen/sabit bağlantı formülleri + ISO 273 delik serileri. */
(function (g) {
  'use strict';
  const U = () => g.UI;
  const INK = '#1d2326', MAVI = '#1f5f99', GRI = '#7d8b8f', TURUNCU = '#d9622b';

  // gr: GB/T 1184 Ek B geometrik tolerans kalitesi; it: ISO 286 boyut kalitesi; seri: ISO 273 geçiş deliği serisi
  const SEVIYE = [
    { ad: 'Çok hassas', gr: 5, it: 6, seri: 0, ra: '0,4', genel: 'ISO 2768-fH', yontem: 'Taşlama, honlama, hassas CNC', mal: 5 },
    { ad: 'Hassas', gr: 7, it: 7, seri: 0, ra: '0,8', genel: 'ISO 2768-fH', yontem: 'Hassas CNC frezeleme / tornalama, raybalama', mal: 3 },
    { ad: 'Standart', gr: 9, it: 9, seri: 1, ra: '1,6', genel: 'ISO 2768-mK', yontem: 'CNC frezeleme / tornalama', mal: 2 },
    { ad: 'Kaba', gr: 11, it: 11, seri: 2, ra: '3,2', genel: 'ISO 2768-cL', yontem: 'Konvansiyonel tezgâh, delme, kesim', mal: 1 }
  ];
  const SERI_AD = ['ince', 'orta', 'kaba'];
  // GB/T 1184-1996 Ek B kalite tabloları (µm). Ana parametre L (mm) aralıkları:
  const GB_ARALIK = [10, 16, 25, 40, 63, 100, 160, 250, 400, 630, 1000, 1600, 2500, 4000, 6300, 10000];
  // Doğrusallık ve düzlemsellik
  const GB_DUZ = {
    1: [0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6],
    2: [0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12],
    3: [0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25],
    4: [1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40],
    5: [2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60],
    6: [3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100],
    7: [5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150],
    8: [8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250],
    9: [12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400],
    10: [20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600],
    11: [30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800, 1000],
    12: [60, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000]
  };
  // Paralellik, diklik ve eğiklik
  const GB_YON = {
    1: [0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12],
    2: [0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25],
    3: [1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50],
    4: [3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100],
    5: [5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150],
    6: [8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250],
    7: [12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400],
    8: [20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600],
    9: [30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800, 1000],
    10: [50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500],
    11: [80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500],
    12: [120, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000]
  };
  const gbAralik = L => { const k = GB_ARALIK.findIndex(u => L <= u); return k < 0 ? GB_ARALIK.length - 1 : k; };
  const gbAd = L => { const k = gbAralik(L); return k === 0 ? '≤ 10' : `${GB_ARALIK[k - 1]}–${GB_ARALIK[k]}`; };
  const duz = (gr, L) => GB_DUZ[Math.max(1, Math.min(12, gr))][gbAralik(L)] / 1000;
  const yon = (gr, L) => GB_YON[Math.max(1, Math.min(12, gr))][gbAralik(L)] / 1000;
  const TERCIH = [0.002, 0.003, 0.004, 0.005, 0.006, 0.008, 0.01, 0.012, 0.015, 0.02, 0.025, 0.03, 0.04, 0.05, 0.06, 0.08, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2];
  const pref = v => TERCIH.reduce((a, b) => Math.abs(Math.log(b / v)) < Math.abs(Math.log(a / v)) ? b : a);
  const IT = (cap, k) => g.TOL.itDeger(Math.max(1, cap), k) / 1000; // mm
  const tf = v => String(+v.toFixed(3)).replace('.', ',');
  const nf = (v, d = 1) => String(+(+v).toFixed(d)).replace('.', ',');

  // ISO 2768-1 doğrusal genel tolerans (± mm) – f, m, c
  const G1S = [3, 6, 30, 120, 400, 1000, 2000, 4000];
  const G1 = { f: [0.05, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5, 0.5], m: [0.1, 0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 2], c: [0.2, 0.3, 0.5, 0.8, 1.2, 2, 3, 4] };
  // ISO 2768-2 (= GB/T 1184) genel geometrik toleranslar – resimdeki değerlerin bunlardan sıkı olduğunu kontrol için
  const G2D = { s: [10, 30, 100, 300, 1000, 3000], H: [0.02, 0.05, 0.1, 0.2, 0.3, 0.4], K: [0.05, 0.1, 0.2, 0.4, 0.6, 0.8], L: [0.1, 0.2, 0.4, 0.8, 1.2, 1.6] };
  const G2P = { s: [100, 300, 1000, 3000], H: [0.2, 0.3, 0.4, 0.5], K: [0.4, 0.6, 0.8, 1], L: [0.6, 1, 1.5, 2] };
  const g2 = (T, sinif, L) => { const k = T.s.findIndex(u => L <= u); return T[sinif][k < 0 ? T.s.length - 1 : k]; };
  const genelTol = (olcu, sinif) => G1[sinif][Math.max(0, G1S.findIndex(u => olcu <= u))];

  const DELIK = { M3: [3.2, 3.4, 3.6], M4: [4.3, 4.5, 4.8], M5: [5.3, 5.5, 5.8], M6: [6.4, 6.6, 7.0], M8: [8.4, 9.0, 10.0], M10: [10.5, 11.0, 12.0], M12: [13.0, 13.5, 14.5] }; // ISO 273 ince / orta / kaba
  const MBOY = ['M3', 'M4', 'M5', 'M6', 'M8', 'M10', 'M12'];

  const REF = {
    asmeY145: { kisa: 'ASME Y14.5 – Ek B', ad: 'ASME Y14.5 Ek B: yüzen bağlantı T = H − F, sabit bağlantı T1 + T2 = H − F (eşit paylaşımda T = (H − F)/2); H ve F en büyük malzeme durumundaki (MMC) çaplar', url: 'https://open-exam-prep.com/study-guides/asme-gdtp-senior/location-2/fixed-floating-fasteners' },
    iso273: { kisa: 'ISO 273', ad: 'ISO 273 – Bağlantı elemanları için geçiş delikleri: ince, orta, kaba seri (ör. M6: 6,4 / 6,6 / 7,0 mm)', url: '' },
    iso5459: { kisa: 'ISO 5459', ad: 'ISO 5459 – Geometrik ürün spesifikasyonu: datumlar ve datum sistemleri (A birincil, B ikincil, C üçüncül)', url: '' },
    gb1184: { kisa: 'GB/T 1184 Ek B', ad: 'GB/T 1184-1996 (ISO 2768-2 eşdeğeri) Ek B – resme yazılan geometrik toleranslar için 1–12 kalite tabloları: doğrusallık/düzlemsellik ve paralellik/diklik/eğiklik (mechtool.cn ve JLC FA el kitabı üzerinden doğrulandı)', url: 'https://www.mechtool.cn/drawingandaccuracy/drawingandaccuracy_parallelismperpendicularityandinclinationtolerancevalues.html' },
    gb1184genel: { kisa: 'GB/T 1184 genel kurallar', ad: 'GB/T 1184-1996 / ISO 2768-2 genel tolerans kuralları: H/K/L tabloları; paralellik genel toleransı = boyut toleransı ile düzlemsellik toleransının büyüğü; dairesellik = çap toleransı', url: 'https://big5.164580.com/info_415480.html' },
    iso8015: { kisa: 'ISO 8015', ad: 'ISO 8015 – Bağımsızlık ilkesi: boyut ve geometrik toleranslar birbirinden bağımsız uygulanır', url: '' }
  };
  if (g.DATA && g.DATA.REF) Object.assign(g.DATA.REF, REF);

  // Tohumlu rastgele sayı
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  // ---------------- Geometri (delik yerleşimi) ----------------
  function prizmaDelikler(s) {
    const L = s.grL, W = s.grW;
    const kisa = Math.min(L, W);
    const M = kisa < 30 ? 'M3' : kisa < 50 ? 'M4' : kisa < 80 ? 'M5' : kisa < 150 ? 'M6' : kisa < 300 ? 'M8' : 'M10';
    const d = DELIK[M][2];
    const R = rng(s.grSeed * 7919 + 13);
    const n = 3 + Math.floor(R() * 4);
    const kenar = Math.max(2 * d, 0.08 * kisa), ara = 3 * d;
    const yuvar = v => Math.round(v * (kisa < 60 ? 2 : 1)) / (kisa < 60 ? 2 : 1);
    const P = [];
    for (let i = 0; i < 600 && P.length < n; i++) {
      const x = yuvar(kenar + R() * (L - 2 * kenar)), y = yuvar(kenar + R() * (W - 2 * kenar));
      if (P.every(p => Math.hypot(p.x - x, p.y - y) >= ara)) P.push({ x, y });
    }
    P.sort((a, b) => a.x - b.x || a.y - b.y);
    return { M, Mnom: +M.slice(1), holes: P };
  }
  function silindirDelikler(s) {
    const D = s.grOD, d = s.grID > 0 ? s.grID : 0;
    const et = d ? (D - d) / 2 : D / 2;
    const PCD = d ? (D + d) / 2 : 0.6 * D;
    const sinir = d ? et / 3 : D * 0.1;
    let M = null;
    for (const m of MBOY) if (DELIK[m][2] <= sinir) M = m;
    if (!M) return { M: null, holes: [], PCD };
    const dh = DELIK[M][2];
    const R = rng(s.grSeed * 104729 + 7);
    const nMax = Math.max(3, Math.floor(Math.PI * PCD / (4 * dh)));
    const n = Math.min(nMax, 3 + Math.floor(R() * 6));
    const bas = Math.round(R() * 8) * 15; // ilk delik açısı (derece)
    const holes = Array.from({ length: n }, (_, i) => ({ aci: bas + i * 360 / n }));
    const pinAci = bas + 180 / n;
    const pinD = M === 'M3' || M === 'M4' ? 3 : M === 'M5' || M === 'M6' ? 4 : 6;
    return { M, Mnom: +M.slice(1), holes, PCD, pinAci, pinD, n };
  }

  // ---------------- Tolerans değerleri ----------------
  // Kural: datum A düzlemselliği, A'ya bağlanan yönelim toleranslarının en küçüğünden küçük olmalı
  function datumKurali(out, Lduz, refs) {
    out.flatGr = out.v.gr;
    const enKucuk = Math.min(...refs.filter(x => x > 0));
    while (out.flatA >= enKucuk && out.flatGr > 1) { out.flatGr--; out.flatA = duz(out.flatGr, Lduz); }
    out.flatAyar = out.flatGr !== out.v.gr;
  }
  function degerler(s, i) {
    const v = SEVIYE[i], k = v.it, gr = v.gr;
    const sil = s.grSekil === 'silindir';
    const dis = s.grDelik === 'dis';
    const out = { v, i };
    const posDelik = (Mnom, proj) => {
      const H = DELIK['M' + Mnom][v.seri];
      if (dis) return { ad: `M${Mnom} – 6H`, T: (H - Mnom) / 2, mmc: false, proj, H, formul: `(${nf(H)} − ${Mnom}) / 2`, seriAd: SERI_AD[v.seri] };
      return { ad: `Ø${nf(H)} H12`, T: H - Mnom, mmc: true, H, formul: `${nf(H)} − ${Mnom}`, seriAd: SERI_AD[v.seri] };
    };
    const kalinlik = (olcu) => {
      const acik = k <= 7;
      const tol = acik ? IT(olcu, k) / 2 : genelTol(olcu, v.genel.includes('-c') ? 'c' : 'm');
      return { tol, acik, toplam: 2 * tol };
    };
    // Paralellik: tablo değeri; açık kalınlık toleransı daha küçükse onunla sınırlanır
    const paralel = (tablo, kt) => {
      if (!kt.acik) return { par: tablo, sinirli: false };
      const sinir = [...TERCIH].reverse().find(x => x <= kt.toplam + 1e-9) || kt.toplam;
      return sinir < tablo ? { par: sinir, sinirli: true } : { par: tablo, sinirli: false };
    };
    if (!sil) {
      const L = s.grL, W = s.grW, H = s.grH, Lm = Math.max(L, W);
      const kt = kalinlik(H);
      out.HTol = kt.tol; out.HTolAcik = kt.acik;
      out.perpB = yon(gr, Math.max(L, H)); out.perpBL = Math.max(L, H);
      out.perpC = yon(gr, Math.max(W, H)); out.perpCL = Math.max(W, H);
      out.flatA = duz(gr, Lm); out.flatL = Lm;
      out.parL = Lm;
      Object.assign(out, paralel(yon(gr, Lm), kt));
      datumKurali(out, Lm, [out.perpB, out.perpC, out.par]);
      const dl = prizmaDelikler(s);
      out.del = dl; out.pos = posDelik(dl.Mnom, H);
    } else {
      const D = s.grOD, d = s.grID > 0 ? s.grID : 0, T = s.grT;
      out.od = g.TOL.sapma(D, 'h', k);
      out.id = d ? g.TOL.sapma(d, 'H', k) : null;
      const kt = kalinlik(T);
      out.TTol = kt.tol; out.TTolAcik = kt.acik;
      out.flatA = duz(gr, D); out.flatL = D;
      out.perpBore = d ? yon(gr, T) : null; out.perpBoreL = T;
      out.parL = D;
      Object.assign(out, paralel(yon(gr, D), kt));
      datumKurali(out, D, [out.par, out.perpBore || Infinity]);
      const dl = silindirDelikler(s);
      out.del = dl;
      if (dl.M) {
        out.pos = posDelik(dl.Mnom, T);
        out.pinPos = [...TERCIH].reverse().find(x => x <= out.pos.T / 2 + 1e-9) || 0.01;
      }
    }
    return out;
  }

  // ---------------- SVG yardımcıları ----------------
  const ok = id => `marker-start="url(#${id})" marker-end="url(#${id})"`;
  function defs(id) {
    return `<defs><marker id="${id}" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L10 5 L0 9 z" fill="${MAVI}"/></marker>
      <marker id="${id}k" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L10 5 L0 9 z" fill="${INK}"/></marker>
      <pattern id="${id}h" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="${GRI}" stroke-width="1"/></pattern></defs>`;
  }
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 12}" text-anchor="${o.a || 'middle'}" fill="${o.c || INK}" ${o.w ? 'font-weight="700"' : ''} ${o.r ? `transform="rotate(${o.r} ${x} ${y})"` : ''}>${s}</text>`;
  function sembol(tip, cx, cy) {
    const st = `stroke="${INK}" stroke-width="1.4" fill="none"`;
    switch (tip) {
      case 'duz': return `<path d="M${cx - 8} ${cy + 4} L${cx - 3} ${cy - 4} L${cx + 8} ${cy - 4} L${cx + 3} ${cy + 4} Z" ${st}/>`;
      case 'dik': return `<path d="M${cx - 7} ${cy + 6} H${cx + 7} M${cx} ${cy + 6} V${cy - 7}" ${st}/>`;
      case 'par': return `<path d="M${cx - 6} ${cy + 6} L${cx - 1} ${cy - 6} M${cx + 1} ${cy + 6} L${cx + 6} ${cy - 6}" ${st}/>`;
      case 'kon': return `<circle cx="${cx}" cy="${cy}" r="4.5" ${st}/><path d="M${cx - 8} ${cy} H${cx + 8} M${cx} ${cy - 8} V${cy + 8}" ${st}/>`;
      case 'salgi': return `<path d="M${cx - 6} ${cy + 6} L${cx + 5} ${cy - 5}" ${st}/><path d="M${cx + 6} ${cy - 6} L${cx + 0.5} ${cy - 4.5} L${cx + 4.5} ${cy - 0.5} Z" fill="${INK}"/>`;
      case 'sil': return `<circle cx="${cx}" cy="${cy}" r="4.5" ${st}/><path d="M${cx - 7} ${cy + 6} L${cx - 1} ${cy - 7} M${cx + 1} ${cy + 7} L${cx + 7} ${cy - 6}" ${st}/>`;
      default: return '';
    }
  }
  // Tolerans çerçevesi: [sembol, değer, mmc, datumlar…] → { svg, w }
  function cerceve(x, y, tip, deger, opt = {}) {
    const h = 22, sw = 26;
    const metin = (opt.cap ? 'Ø' : '') + tf(deger);
    const ek = opt.mmc ? 16 : opt.proj ? 22 + String(opt.proj).length * 7.4 : 0;
    const tw = metin.length * 7.4 + 14 + ek;
    const dat = opt.datum || [];
    const w = sw + tw + dat.length * 22;
    let s = `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`;
    s += `<line x1="${x + sw}" y1="${y}" x2="${x + sw}" y2="${y + h}" stroke="${INK}"/>${sembol(tip, x + sw / 2, y + h / 2)}`;
    s += t(x + sw + (tw - ek) / 2, y + 15.5, metin, { s: 12.5 });
    if (opt.proj) { const px = x + sw + tw - ek + 6; s += `<circle cx="${px}" cy="${y + h / 2}" r="6.5" fill="none" stroke="${INK}"/>${t(px, y + 15, 'P', { s: 9 })}${t(px + 10, y + 15.5, nf(opt.proj), { s: 12.5, a: 'start' })}`; }
    if (opt.mmc) s += `<circle cx="${x + sw + tw - 13}" cy="${y + h / 2}" r="6.5" fill="none" stroke="${INK}"/>${t(x + sw + tw - 13, y + 15, 'M', { s: 9 })}`;
    let xx = x + sw + tw;
    dat.forEach(dl => { s += `<line x1="${xx}" y1="${y}" x2="${xx}" y2="${y + h}" stroke="${INK}"/>${t(xx + 11, y + 15.5, dl, { s: 12.5, w: true })}`; xx += 22; });
    return { svg: s + '</g>', w, h };
  }
  // Datum sembolü: üçgen (x,y) yüzeyde, kutu yön doğrultusunda
  function datum(x, y, harf, yon) {
    const L = 22, b = 20;
    const d = { asagi: [0, 1], yukari: [0, -1], sol: [-1, 0], sag: [1, 0] }[yon];
    const bx = x + d[0] * L, by = y + d[1] * L;
    const tri = d[1] !== 0 ? `M${x - 6} ${y} L${x + 6} ${y} L${x} ${y + d[1] * 9} Z` : `M${x} ${y - 6} L${x} ${y + 6} L${x + d[0] * 9} ${y} Z`;
    const kx = bx - b / 2 + d[0] * b / 2, ky = by - b / 2 + d[1] * b / 2;
    return `<path d="${tri}" fill="${INK}"/><line x1="${x}" y1="${y}" x2="${bx}" y2="${by}" stroke="${INK}"/>
      <rect x="${kx}" y="${ky}" width="${b}" height="${b}" fill="#fff" stroke="${INK}" stroke-width="1.3"/>${t(kx + b / 2, ky + 14.5, harf, { s: 13, w: true })}`;
  }
  const lider = (x1, y1, x2, y2, id) => `<path d="M${x2} ${y2} L${x1} ${y1}" stroke="${INK}" fill="none" marker-end="url(#${id}k)"/>`;
  const temel = (x, y, s, o = {}) => { const w = String(s).length * 7 + 10; return `<rect x="${x - w / 2}" y="${y - 12}" width="${w}" height="17" fill="#fff" stroke="${MAVI}"/>${t(x, y + 1, s, { c: MAVI, ...o })}`; };

  function antet(x, y, v, s, ek) {
    const w = 430, h = 92;
    return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
      <line x1="${x}" y1="${y + 26}" x2="${x + w}" y2="${y + 26}" stroke="${INK}"/>
      ${t(x + 10, y + 18, `ÖRNEK PARÇA – ${v.ad.toLocaleUpperCase('tr-TR')} İŞLEME`, { a: 'start', s: 12.5, w: true })}
      ${t(x + 10, y + 43, `GENEL TOLERANSLAR: ${v.genel}`, { a: 'start', s: 11 })}
      ${t(x + 10, y + 59, `TOLERANSLANDIRMA ISO 8015 · DATUMLAR ISO 5459`, { a: 'start', s: 11 })}
      ${t(x + 10, y + 75, `YÜZEY PÜRÜZLÜLÜĞÜ Ra ${v.ra} µm (AKSİ BELİRTİLMEDİKÇE) · ÖLÇÜLER mm`, { a: 'start', s: 11 })}
      ${t(x + 10, y + 88, ek || 'ÖLÇEKSİZ – ÖRNEK RESİM', { a: 'start', s: 9.5, c: GRI })}</g>`;
  }

  // ---------------- Prizmatik blok ----------------
  function prizmaSvg(s, r) {
    const id = 'gr' + r.i;
    const L = s.grL, W = s.grW, H = s.grH;
    const VW = 980, VH = 760;
    const sc = Math.min(470 / L, 330 / (W + H));
    const x0 = 190, yT = 170;
    const Lp = L * sc, Wp = W * sc, Hp = Math.max(H * sc, 16);
    const yF = yT + Wp + 110;
    const X = x => x0 + x * sc, Y = y => yT + Wp - y * sc;
    const { holes, Mnom } = r.del;
    const dh = (r.pos.proj ? r.del.Mnom : r.pos.H) * sc;
    let o = `<svg class="cizim gdt" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Örnek teknik resim – ${r.v.ad}">${defs(id)}`;
    o += `<rect x="4" y="4" width="${VW - 8}" height="${VH - 8}" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`;
    // Görünüşler
    o += `<rect x="${x0}" y="${yT}" width="${Lp}" height="${Wp}" fill="#fbfcfb" stroke="${INK}" stroke-width="2"/>`;
    o += `<rect x="${x0}" y="${yF}" width="${Lp}" height="${Hp}" fill="#fbfcfb" stroke="${INK}" stroke-width="2"/>`;
    o += t(x0 + Lp / 2, yT - 112, 'ÜST GÖRÜNÜŞ', { s: 10.5, c: GRI }) + t(x0 + Lp / 2, yF + Hp + 70, 'ÖN GÖRÜNÜŞ', { s: 10.5, c: GRI });
    // Delikler
    holes.forEach((p, i) => {
      const cx = X(p.x), cy = Y(p.y), rr = Math.max(dh / 2, 3);
      o += `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="#fff" stroke="${INK}" stroke-width="1.6"/>
        <path d="M${cx - rr - 5} ${cy} H${cx + rr + 5} M${cx} ${cy - rr - 5} V${cy + rr + 5}" stroke="${GRI}" stroke-width=".8" stroke-dasharray="6 2 1 2"/>
        ${t(cx + rr + 4, cy - rr - 2, 'D' + (i + 1), { a: 'start', s: 10, c: MAVI })}`;
      o += `<path d="M${cx - rr} ${yF} V${yF + Hp} M${cx + rr} ${yF} V${yF + Hp}" stroke="${INK}" stroke-width=".9" stroke-dasharray="4 3"/>`;
    });
    // Orijin
    o += `<circle cx="${x0}" cy="${yT + Wp}" r="4" fill="${TURUNCU}"/>${t(x0 + 8, yT + Wp - 6, '0,0', { a: 'start', s: 9.5, c: TURUNCU })}`;
    // Ölçüler: L (üstte), W (sağda), H (ön görünüş solunda)
    o += `<path d="M${x0} ${yT - 4} V${yT - 36} M${x0 + Lp} ${yT - 4} V${yT - 36}" stroke="${MAVI}" stroke-width=".8"/>
      <line x1="${x0}" y1="${yT - 30}" x2="${x0 + Lp}" y2="${yT - 30}" stroke="${MAVI}" ${ok(id)}/>${t(x0 + Lp / 2, yT - 35, nf(L), { c: MAVI, s: 13 })}`;
    o += `<path d="M${x0 + Lp + 4} ${yT} H${x0 + Lp + 36} M${x0 + Lp + 4} ${yT + Wp} H${x0 + Lp + 36}" stroke="${MAVI}" stroke-width=".8"/>
      <line x1="${x0 + Lp + 30}" y1="${yT}" x2="${x0 + Lp + 30}" y2="${yT + Wp}" stroke="${MAVI}" ${ok(id)}/>${t(x0 + Lp + 25, yT + Wp / 2, nf(W), { c: MAVI, s: 13, r: -90 })}`;
    const Hmetin = r.HTolAcik ? `${nf(H)} ±${tf(Math.round(r.HTol * 1000) / 1000)}` : nf(H);
    o += `<path d="M${x0 - 4} ${yF} H${x0 - 40} M${x0 - 4} ${yF + Hp} H${x0 - 40}" stroke="${MAVI}" stroke-width=".8"/>
      <line x1="${x0 - 34}" y1="${yF}" x2="${x0 - 34}" y2="${yF + Hp}" stroke="${MAVI}" ${ok(id)}/>${t(x0 - 40, yF + Hp / 2 + 4, Hmetin, { c: MAVI, s: 13, a: 'end' })}`;
    // Datum A (alt yüz) + düzlemsellik
    o += datum(x0 + Lp * 0.22, yF + Hp, 'A', 'asagi');
    const fA = cerceve(x0 + Lp * 0.45, yF + Hp + 26, 'duz', r.flatA);
    o += lider(x0 + Lp * 0.45 + 10, yF + Hp, x0 + Lp * 0.45 + 10, yF + Hp + 26, id) + fA.svg;
    // Paralellik (üst yüz)
    const fP = cerceve(x0 + Lp + 26, yF - 36, 'par', r.par, { datum: ['A'] });
    o += `<path d="M${x0 + Lp * 0.85} ${yF} V${yF - 25} H${x0 + Lp + 26}" fill="none" stroke="${INK}"/><path d="M${x0 + Lp * 0.85 - 4} ${yF - 8} L${x0 + Lp * 0.85} ${yF} L${x0 + Lp * 0.85 + 4} ${yF - 8} Z" fill="${INK}"/>` + fP.svg;
    // Datum B (ön yüz – üst görünüşte alt kenar) + diklik
    const bx = x0 + Lp * 0.62;
    o += datum(bx, yT + Wp, 'B', 'asagi');
    o += cerceve(bx + 16, yT + Wp + 22, 'dik', r.perpB, { datum: ['A'] }).svg;
    // Datum C (sol yüz) + diklik
    o += datum(x0, yT + Wp * 0.4, 'C', 'sol');
    const fC = cerceve(0, 0, 'dik', r.perpC, { datum: ['A', 'B'] });
    o += cerceve(x0 - 12 - fC.w, yT + Wp * 0.4 + 18, 'dik', r.perpC, { datum: ['A', 'B'] }).svg;
    // Delik bildirimi
    const h0 = holes.reduce((a, b) => (b.y > a.y ? b : a), holes[0]);
    if (h0) {
      const cx = X(h0.x), cy = Y(h0.y), rr = Math.max(dh / 2, 3);
      const tx = x0, ty = yT - 100;
      const yazi = `${holes.length}× ${r.pos.ad}${r.pos.proj ? '' : ' GEÇER'}`;
      o += `<path d="M${cx + rr * 0.7} ${cy - rr * 0.7} L${cx + 26} ${ty + 20} H${tx + 4}" fill="none" stroke="${INK}"/>`;
      o += lider(cx + rr * 0.7, cy - rr * 0.7, cx + rr * 0.7 + 8, cy - rr * 0.7 - 8, id);
      o += t(tx, ty + 14, yazi, { a: 'start', s: 13, w: true });
      o += cerceve(tx, ty + 22, 'kon', r.pos.T, { cap: true, mmc: r.pos.mmc, proj: r.pos.proj, datum: ['A', 'B', 'C'] }).svg;
    }
    // Delik tablosu (temel ölçüler)
    const tx = VW - 250, ty = 110;
    o += `<g>${t(tx, ty - 10, 'DELİK TABLOSU – TEMEL ÖLÇÜLER', { a: 'start', s: 11, w: true })}
      <rect x="${tx}" y="${ty}" width="230" height="${22 + holes.length * 20}" fill="#fff" stroke="${INK}"/>
      ${t(tx + 30, ty + 15, 'DELİK', { s: 10.5, w: true })}${t(tx + 110, ty + 15, 'X (C’den)', { s: 10.5, w: true })}${t(tx + 190, ty + 15, 'Y (B’den)', { s: 10.5, w: true })}
      <line x1="${tx}" y1="${ty + 21}" x2="${tx + 230}" y2="${ty + 21}" stroke="${INK}"/>
      ${holes.map((p, i) => t(tx + 30, ty + 37 + i * 20, 'D' + (i + 1), { s: 11 }) + temel(tx + 110, ty + 37 + i * 20, nf(p.x)) + temel(tx + 190, ty + 37 + i * 20, nf(p.y))).join('')}</g>`;
    o += t(tx, ty + 42 + holes.length * 20, 'Kutulu ölçüler teorik olarak tam', { a: 'start', s: 10, c: GRI });
    o += t(tx, ty + 56 + holes.length * 20, '(temel) ölçülerdir.', { a: 'start', s: 10, c: GRI });
    // Yüzey sembolü (genel)
    o += `<path d="M${tx} ${ty + 100 + holes.length * 20} l8 12 l16 -26 h30" fill="none" stroke="${INK}" stroke-width="1.2"/>${t(tx + 40, ty + 82 + holes.length * 20, 'Ra ' + r.v.ra, { s: 11 })}`;
    o += antet(VW - 445, VH - 104, r.v, s);
    return o + '</svg>';
  }

  // ---------------- Silindirik parça ----------------
  function silindirSvg(s, r) {
    const id = 'gs' + r.i;
    const D = s.grOD, d = s.grID > 0 ? s.grID : 0, T = s.grT;
    const VW = 980, VH = 760;
    const R = 190, sc = 2 * R / D, rr = d * sc / 2;
    const cx = 260, cy = 330;
    const Tp = Math.max(T * sc, 18);
    const xs = 660, xr = xs + Tp;
    let o = `<svg class="cizim gdt" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Örnek teknik resim – ${r.v.ad}">${defs(id)}`;
    o += `<rect x="4" y="4" width="${VW - 8}" height="${VH - 8}" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`;
    // Ön görünüş
    o += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fbfcfb" stroke="${INK}" stroke-width="2"/>`;
    if (d) o += `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
    o += `<path d="M${cx - R - 14} ${cy} H${cx + R + 14} M${cx} ${cy - R - 14} V${cy + R + 14}" stroke="${GRI}" stroke-width=".8" stroke-dasharray="10 3 2 3"/>`;
    const dl = r.del;
    if (dl.M) {
      const rp = dl.PCD * sc / 2, rh = Math.max((r.pos.proj ? dl.Mnom : r.pos.H) * sc / 2, 3), rpin = Math.max(dl.pinD * sc / 2, 2.5);
      const P = a => [cx + rp * Math.cos(a * Math.PI / 180), cy - rp * Math.sin(a * Math.PI / 180)];
      o += `<circle cx="${cx}" cy="${cy}" r="${rp}" fill="none" stroke="${GRI}" stroke-width=".8" stroke-dasharray="10 3 2 3"/>`;
      dl.holes.forEach(h => { const [x, y] = P(h.aci); o += `<circle cx="${x}" cy="${y}" r="${rh}" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`; });
      const [px, py] = P(dl.pinAci);
      o += `<circle cx="${px}" cy="${py}" r="${rpin}" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`;
      // Datum C (pim deliği)
      const dx = Math.cos(dl.pinAci * Math.PI / 180), dy = -Math.sin(dl.pinAci * Math.PI / 180);
      const cxx = px + dx * (rpin + 2), cyy = py + dy * (rpin + 2);
      o += `<line x1="${cxx}" y1="${cyy}" x2="${cxx + dx * 24}" y2="${cyy + dy * 24}" stroke="${INK}"/><path d="M${cxx} ${cyy} l${-dy * 6 + dx * 9} ${dx * 6 + dy * 9} l${2 * dy * 6} ${-2 * dx * 6} Z" fill="${INK}"/>
        <rect x="${cxx + dx * 24 - 10}" y="${cyy + dy * 24 - 10}" width="20" height="20" fill="#fff" stroke="${INK}" stroke-width="1.3"/>${t(cxx + dx * 24, cyy + dy * 24 + 4.5, 'C', { s: 13, w: true })}`;
      // PCD temel ölçü
      const a45 = -50 * Math.PI / 180;
      const [lx, ly] = [cx + rp * Math.cos(a45), cy - rp * Math.sin(a45)];
      o += `<path d="M${lx} ${ly} L${cx + R + 30} ${cy + R * 0.82}" stroke="${MAVI}" fill="none" marker-start="url(#${id})"/>` + temel(cx + R + 62, cy + R * 0.82 + 4, 'Ø' + nf(dl.PCD));
      // Açı (pim ile 1. delik arası) temel
      const aA = dl.holes[0].aci, aP = dl.pinAci, ra = rp + 26;
      const q = a => [cx + ra * Math.cos(a * Math.PI / 180), cy - ra * Math.sin(a * Math.PI / 180)];
      const [ax1, ay1] = q(aA), [ax2, ay2] = q(aP), [am, bm] = q((aA + aP) / 2);
      o += `<path d="M${ax1} ${ay1} A${ra} ${ra} 0 0 0 ${ax2} ${ay2}" fill="none" stroke="${MAVI}" ${ok(id)}/>` + temel(am + (am - cx) * 0.12, bm + (bm - cy) * 0.12 + 4, nf(aP - aA, 1) + '°');
      // Bildirimler
      const hc = dl.holes.map(h => P(h.aci)).reduce((a, b) => (Math.hypot(b[0] - 40, b[1] - cy - R) < Math.hypot(a[0] - 40, a[1] - cy - R) ? b : a));
      const ang = Math.atan2(cy + R + 40 - hc[1], 40 - hc[0]);
      o += `<path d="M${hc[0] + Math.cos(ang) * rh} ${hc[1] + Math.sin(ang) * rh} L80 ${cy + R + 40} H40" stroke="${INK}" fill="none" marker-start="url(#${id}k)"/>`;
      o += t(40, cy + R + 58, `${dl.n}× ${r.pos.ad}${r.pos.proj ? '' : ' GEÇER'} · EŞİT ARALIKLI`, { a: 'start', s: 12.5, w: true });
      o += cerceve(40, cy + R + 66, 'kon', r.pos.T, { cap: true, mmc: r.pos.mmc, proj: r.pos.proj, datum: ['A', 'B', 'C'] }).svg;
      o += t(330, cy + R + 58, `Ø${dl.pinD} H7 (pim deliği)`, { a: 'start', s: 12.5, w: true });
      o += cerceve(330, cy + R + 66, 'kon', r.pinPos, { cap: true, datum: ['A', 'B'] }).svg;
      const ap = Math.atan2(cy + R + 40 - py, 360 - px);
      o += `<path d="M${px + Math.cos(ap) * rpin} ${py + Math.sin(ap) * rpin} L360 ${cy + R + 40} H330" stroke="${INK}" fill="none" marker-start="url(#${id}k)"/>`;
    } else {
      o += t(cx, cy + R + 50, 'Et kalınlığı delik için yetersiz – delik eklenmedi', { s: 11, c: GRI });
    }
    // Dış çap ölçüsü + salgı (ön görünüş üstü)
    const odMetin = `Ø${nf(D)} h${r.v.it} (${tf(r.od.ust / 1000) === '0' ? '0' : tf(r.od.ust / 1000)} / −${tf(Math.abs(r.od.alt) / 1000)})`;
    o += `<path d="M${cx - R} ${cy - 4} V${cy - R - 40} M${cx + R} ${cy - 4} V${cy - R - 40}" stroke="${MAVI}" stroke-width=".8"/>
      <line x1="${cx - R}" y1="${cy - R - 34}" x2="${cx + R}" y2="${cy - R - 34}" stroke="${MAVI}" ${ok(id)}/>${t(cx, cy - R - 40, odMetin, { c: MAVI, s: 13 })}`;
    // Yan görünüş (kesit)
    o += t(xs + Tp / 2, cy - R - 60, 'YAN GÖRÜNÜŞ (KESİT)', { s: 10.5, c: GRI });
    if (d) {
      o += `<rect x="${xs}" y="${cy - R}" width="${Tp}" height="${R - rr}" fill="url(#${id}h)" stroke="${INK}" stroke-width="2"/>
        <rect x="${xs}" y="${cy + rr}" width="${Tp}" height="${R - rr}" fill="url(#${id}h)" stroke="${INK}" stroke-width="2"/>
        <path d="M${xs} ${cy - rr} H${xr} M${xs} ${cy + rr} H${xr}" stroke="${INK}" stroke-width="1.5"/>`;
    } else o += `<rect x="${xs}" y="${cy - R}" width="${Tp}" height="${2 * R}" fill="url(#${id}h)" stroke="${INK}" stroke-width="2"/>`;
    o += `<path d="M${xs - 14} ${cy} H${xr + 14}" stroke="${GRI}" stroke-width=".8" stroke-dasharray="10 3 2 3"/>`;
    // Kalınlık
    const Tmetin = r.TTolAcik ? `${nf(T)} ±${tf(Math.round(r.TTol * 1000) / 1000)}` : nf(T);
    o += `<path d="M${xs} ${cy + R + 4} V${cy + R + 40} M${xr} ${cy + R + 4} V${cy + R + 40}" stroke="${MAVI}" stroke-width=".8"/>
      <line x1="${xs - 30}" y1="${cy + R + 34}" x2="${xs}" y2="${cy + R + 34}" stroke="${MAVI}" marker-end="url(#${id})"/><line x1="${xr + 30}" y1="${cy + R + 34}" x2="${xr}" y2="${cy + R + 34}" stroke="${MAVI}" marker-end="url(#${id})"/>
      ${t(xr + 36, cy + R + 38, Tmetin, { c: MAVI, s: 13, a: 'start' })}`;
    // Datum A (sol yüz) + düzlemsellik
    const ya = d ? cy - (R + rr) / 2 : cy - R * 0.5;
    o += datum(xs, ya, 'A', 'sol');
    const fA = cerceve(0, 0, 'duz', r.flatA);
    const yh = Math.max(cy - R + 5, ya - 16);
    o += cerceve(xs - 20 - fA.w, ya - 58, 'duz', r.flatA).svg + `<path d="M${xs - 20} ${ya - 47} H${xs - 14}" fill="none" stroke="${INK}"/>` + lider(xs, yh, xs - 14, ya - 47, id);
    // Paralellik (sağ yüz)
    o += `<path d="M${xr} ${cy - R + 12} H${xr + 30} V${cy - R - 8}" fill="none" stroke="${INK}"/><path d="M${xr + 8} ${cy - R + 8} L${xr} ${cy - R + 12} L${xr + 8} ${cy - R + 16} Z" fill="${INK}"/>`;
    o += cerceve(xr + 20, cy - R - 30, 'par', r.par, { datum: ['A'] }).svg;
    // İç çap + datum B + diklik + silindiriklik
    if (d) {
      const xd = xr + 34;
      o += `<path d="M${xr + 4} ${cy - rr} H${xd + 6} M${xr + 4} ${cy + rr} H${xd + 6}" stroke="${MAVI}" stroke-width=".8"/>
        <line x1="${xd}" y1="${cy - rr}" x2="${xd}" y2="${cy + rr}" stroke="${MAVI}" ${ok(id)}/>
        ${t(xd - 6, cy - rr * 0.35, `Ø${nf(d)} H${r.v.it} (+${tf(r.id.ust / 1000)} / ${tf(r.id.alt / 1000)})`, { c: MAVI, s: 12.5, r: -90 })}`;
      o += `<path d="M${xd} ${cy + rr * 0.45} H${xd + 26}" stroke="${INK}"/><path d="M${xd} ${cy + rr * 0.45 - 6} L${xd} ${cy + rr * 0.45 + 6} L${xd + 9} ${cy + rr * 0.45} Z" fill="${INK}"/>
        <rect x="${xd + 26}" y="${cy + rr * 0.45 - 10}" width="20" height="20" fill="#fff" stroke="${INK}" stroke-width="1.3"/>${t(xd + 36, cy + rr * 0.45 + 4.5, 'B', { s: 13, w: true })}`;
      const fy = cy + rr * 0.45 + 18;
      o += cerceve(xd + 12, fy, 'dik', r.perpBore, { cap: true, datum: ['A'] }).svg;
    } else {
      o += datum(cx + R - 40, cy - R - 34, 'B', 'yukari');
      o += t(xr + 40, cy + 4, 'B = dış çap ekseni', { a: 'start', s: 11, c: GRI });
    }
    o += antet(VW - 445, VH - 104, r.v, s);
    return o + '</svg>';
  }

  // ---------------- Arayüz ----------------
  function girdi(s) {
    const sil = s.grSekil === 'silindir';
    const n = (k, l, st = 1) => `<label class="buyuk">${l}<input type="number" step="${st}" data-num="${k}" value="${s[k] ?? ''}"></label>`;
    return `<div class="card"><h3>1 · Parça şekli ve ölçüleri</h3>
      <div class="seg" data-bind="grSekil"><button data-v="prizma">▭ Prizmatik (blok, plaka)</button><button data-v="silindir">◯ Silindirik (flanş, disk, burç)</button></div>
      <div class="row4 mt">${sil ? n('grOD', 'Dış çap (mm)') + n('grID', 'İç çap (mm, dolu = 0)') + n('grT', 'Kalınlık / boy (mm)') : n('grL', 'Uzunluk (mm)') + n('grW', 'Genişlik (mm)') + n('grH', 'Yükseklik / kalınlık (mm)')}
        <div><div class="small">Delik yerleşimi</div><button class="gear" id="grYeni" type="button">🎲 Yeni delik düzeni</button></div></div>
      <div class="row-inline mt"><div><div class="small">Deliklerin işlevi</div>
        <div class="seg" data-bind="grDelik"><button data-v="gecis">Geçiş deliği (cıvata + somun)</button><button data-v="dis">Dişli delik (cıvata buraya vidalanır)</button></div></div></div>
      <h3 class="mt">2 · İşleme seviyesi</h3>
      <div class="seg" data-bind="grSeviye">${SEVIYE.map((v, i) => `<button data-v="${i}">${v.ad}</button>`).join('')}</div>
      <p class="hint">Aynı parça ve aynı delik düzeni dört seviyede çizilir. Datumlar: <b>A</b> ${sil ? 'oturma yüzü' : 'alt yüz'} (birincil), <b>B</b> ${sil ? (s.grID > 0 ? 'iç çap ekseni' : 'dış çap ekseni') : 'ön yan yüz'} (ikincil), <b>C</b> ${sil ? 'pim deliği (açısal konum)' : 'sol yan yüz'} (üçüncül).</p>
    </div><div id="tolSonuc" class="sonuc"></div>`;
  }

  function sonuc(s) {
    const { esc, refs } = U();
    const sil = s.grSekil === 'silindir';
    const olc = sil ? [s.grOD, s.grT] : [s.grL, s.grW, s.grH];
    if (olc.some(x => !(x > 0)) || (sil && s.grID > 0 && s.grID >= s.grOD)) return '<div class="card"><div class="warnbox">Ölçüleri kontrol edin (tüm ölçüler pozitif, iç çap dış çaptan küçük olmalı).</div></div>';
    const buyuk = Math.max(...olc) > 500;
    const i = Math.min(3, Math.max(0, +s.grSeviye || 0));
    const R = [0, 1, 2, 3].map(k => degerler(s, k));
    const r = R[i];
    const svg = sil ? silindirSvg(s, r) : prizmaSvg(s, r);
    const sat = (ad, fn) => `<tr><td>${ad}</td>${R.map(x => `<td class="num ${x.i === i ? 'sec' : ''}">${fn(x)}</td>`).join('')}</tr>`;
    const ust = v => v === 0 ? '0' : (v > 0 ? '+' : '−') + tf(Math.abs(v) / 1000);
    const kal = x => (sil ? x.TTolAcik : x.HTolAcik) ? `±${tf(Math.round((sil ? x.TTol : x.HTol) * 1000) / 1000)}` : `±${tf(sil ? x.TTol : x.HTol)} (genel)`;
    const yildiz = (x, f) => f ? `${x}<sup>*</sup>` : x;
    const tablo = `<table class="karsi"><thead><tr><th></th>${R.map(x => `<th class="num ${x.i === i ? 'sec' : ''}">${x.v.ad}</th>`).join('')}</tr></thead><tbody>
      ${sat('Geometrik tolerans kalitesi (GB/T 1184 Ek B)', x => x.v.gr)}
      ${sat('Boyut kalitesi (ISO 286)', x => 'IT' + x.v.it)}
      ${sil ? sat('Dış çap', x => `h${x.v.it} (${ust(x.od.ust)}/${ust(x.od.alt)})`) + (s.grID > 0 ? sat('İç çap (datum B)', x => `H${x.v.it} (${ust(x.id.ust)}/${ust(x.id.alt)})`) : '') : ''}
      ${sat('Kalınlık', kal)}
      ${sat(`Düzlemsellik – datum A (L = ${nf(r.flatL, 0)})`, x => yildiz(tf(x.flatA), x.flatAyar))}
      ${sil ? (s.grID > 0 ? sat(`Delik ekseni diklik ⊥ A (L = ${nf(r.perpBoreL, 0)})`, x => 'Ø' + tf(x.perpBore)) : '')
        : sat(`Diklik B ⊥ A (L = ${nf(r.perpBL, 0)})`, x => tf(x.perpB)) + sat(`Diklik C ⊥ A, B (L = ${nf(r.perpCL, 0)})`, x => tf(x.perpC))}
      ${sat(`Paralellik ∥ A (L = ${nf(r.parL, 0)})`, x => x.sinirli ? `${tf(x.par)}<sup>†</sup>` : tf(x.par))}
      ${r.pos ? sat('Delik', x => `${esc(x.pos.ad)}${x.pos.proj ? '' : ` (${x.pos.seriAd} seri)`}`) + sat('Konum toleransı', x => `Ø${tf(x.pos.T)}${x.pos.mmc ? ' Ⓜ' : ''}${x.pos.proj ? ' Ⓟ' : ''}`) : ''}
      ${sat('Yüzey pürüzlülüğü', x => 'Ra ' + x.v.ra)}
      ${sat('Genel tolerans (antet)', x => x.v.genel)}
      ${sat('Göreli maliyet', x => '₺'.repeat(x.v.mal))}
    </tbody></table>
    <p class="small mt">${R.some(x => x.flatAyar) ? '<sup>*</sup> Datum A düzlemselliği, A’ya bağlanan yönelim toleranslarından küçük olsun diye bir veya daha fazla kalite sıkılaştırıldı. ' : ''}${R.some(x => x.sinirli) ? '<sup>†</sup> Paralellik, kalınlık toleransını aşmayacak şekilde sınırlandı. ' : ''}L: tablonun okunduğu ana parametre (mm).</p>`;
    const kontrol = [
      [r.flatA < Math.min(...[r.perpB, r.perpC, r.perpBore, r.par].filter(x => x > 0)), `Datum A düzlemselliği (${tf(r.flatA)}) A’ya bağlanan yönelim toleranslarının hepsinden küçük.`],
      [r.par <= (sil ? 2 * r.TTol : 2 * r.HTol) + 1e-9 || !(sil ? r.TTolAcik : r.HTolAcik), `Paralellik (${tf(r.par)}) kalınlık toleransı içinde.`],
      (() => { const sn = r.v.genel.slice(-1); const okk = r.flatA <= g2(G2D, sn, r.flatL) && [[r.perpB, r.perpBL], [r.perpC, r.perpCL], [r.perpBore, r.perpBoreL]].every(([v, L]) => !(v > 0) || v <= g2(G2P, sn, L));
        return [okk, `Resimdeki düzlemsellik ve diklik değerleri antetteki genel sınıfın (${r.v.genel}: düzlemsellik ${tf(g2(G2D, sn, r.flatL))}) değerlerinden sıkı; genel tolerans yalnızca yazılmayan özelliklere uygulanır.`]; })()
    ];
    return `<div class="card">
      <h3>${esc(r.v.ad)} işleme – örnek teknik resim</h3>
      ${buyuk ? '<div class="warnbox">500 mm üzerindeki ölçülerde ISO 286 tablosunun son aralığı kullanıldı.</div>' : ''}
      <div class="gdt-kap">${svg}</div>
      <div class="mt">${kontrol.map(([okm, m]) => `<div class="madde ${okm ? 'iyi' : 'kotu'}">${okm ? '✔' : '✖'} ${esc(m)}</div>`).join('')}</div>
      <p class="small mt"><b>Tipik üretim:</b> ${esc(r.v.yontem)}.${r.pos ? ` <b>Konum toleransı:</b> ${r.pos.proj ? 'sabit bağlantı' : 'yüzen bağlantı'}, ${r.pos.formul} = ${tf(r.pos.T)} mm (karşı parçada ISO 273 ${r.pos.seriAd} seri geçiş deliği).${r.pos.proj ? ` Dişli delikte tolerans bölgesi, karşı parça kalınlığı kadar dışarı izdüşürülür (Ⓟ ${nf(r.pos.proj)}; örnekte bu parçanın kalınlığı kullanıldı).` : ''}` : ''}</p>
    </div>
    <div class="card"><h3>Dört seviyenin karşılaştırması</h3>${tablo}</div>
    <div class="card"><h3>Değerler nereden geliyor?</h3>
      <ul class="liste">
        <li><b>Geometrik toleranslar:</b> GB/T 1184-1996 Ek B kalite tabloları (ISO 2768-2 ile eşdeğer standardın, resme yazılacak toleranslar için verdiği 1–12 kaliteleri). Düzlemsellik “doğrusallık–düzlemsellik” tablosundan, diklik ve paralellik “paralellik–diklik–eğiklik” tablosundan okunur. Seviyeler: çok hassas kalite 5, hassas 7, standart 9, kaba 11.</li>
        <li><b>Ana parametre:</b> düzlemselliğe yüzeyin uzun kenarı (dairesel yüzeyde çap), diklik ve paralelliğe ölçülen yüzeyin uzun kenarı, delik ekseni dikliğine delik boyu.</li>
        <li><b>Uygulanan kurallar:</b> datum yüzeyinin formu, kendisine bağlanan yönelim toleranslarından küçük olmalı; aynı yüzeyde düzlemsellik paralellikten küçük olmalı; paralellik kalınlık toleransını aşmamalı. Gerekirse değerler otomatik sıkılaştırılır ve tabloda işaretlenir.</li>
        <li><b>Genel toleranslar:</b> antetteki ISO 2768 sınıfı yalnızca resimde ayrıca yazılmayan özelliklere uygulanır (ör. 100–300 mm düzlemsellik H 0,2 · K 0,4 · L 0,8; salgı H 0,1 · K 0,2 · L 0,5).</li>
        <li><b>Boyut toleransları:</b> ISO 286 – çok hassas IT6, hassas IT7, standart IT9, kaba IT11. Standart ve kaba seviyede kalınlık ayrıca yazılmaz.</li>
        <li><b>Konum toleransı:</b> ASME Y14.5 bağlantı formülleri. Yüzen bağlantı (iki parçada geçiş deliği) T = H − F; sabit bağlantı (bir parçada diş) T = (H − F)/2 ve Ⓟ. H: ISO 273 geçiş deliği (çok hassas ve hassas ince seri, standart orta, kaba kaba seri), F: cıvata anma çapı. Konum toleransını işleme seviyesi değil deliğin işlevi belirler; seviye yalnızca geçiş deliği serisini değiştirir.</li>
        <li><b>Silindirikte C pim deliği:</b> açısal konumu tanımlar; konum toleransı delik grubununkinin yarısı alındı. Bu bir öneridir, standart tablo değeri değildir.</li>
        <li>Salgı ve silindiriklik için kalite tablolarını iki kaynaktan doğrulayamadığım için resme yazılmadı; bu özellikler antetteki genel toleransla sınırlıdır.</li>
      </ul>
      ${refs([['gb1184', 'Ek B kalite tabloları: düzlemsellik ve paralellik/diklik.'], ['gb1184genel', 'Genel tolerans kuralları (paralellik = boyut toleransı veya düzlemselliğin büyüğü).'], ['iso286', 'IT kaliteleri ve h/H sapmaları.'], ['iso2768', 'Genel doğrusal toleranslar.'], ['iso27682', 'Genel geometrik toleranslar H, K, L.'], ['asmeY145', 'Yüzen/sabit bağlantı formülleri.'], ['iso273', 'Geçiş deliği serileri.'], ['iso5459', 'Datum sistemi A-B-C.'], ['iso8015', 'Bağımsızlık ilkesi.']])}
    </div>`;
  }

  document.addEventListener('click', e => {
    if (e.target.closest('#grYeni')) { const S = U().S(); S.grSeed = (S.grSeed || 1) + 1; U().changed(false); }
  });

  g.TRESIM = { girdi, sonuc, degerler, SEVIYE };
})(window);
