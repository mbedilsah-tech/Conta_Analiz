/* Örnek teknik resim (GD&T): prizmatik blok veya silindirik parça için
   4 işleme seviyesinde (çok hassas / hassas / standart / kaba) datumlu örnek resim.
   Boyut toleransı ISO 286 (IT), form/yönelim değerleri IT tabanlı (ISO 2768-2 H/K/L ile uyumlu),
   konum toleransı ASME Y14.5 yüzen/sabit bağlantı formülleri + ISO 273 delik serileri. */
(function (g) {
  'use strict';
  const U = () => g.UI;
  const INK = '#1d2326', MAVI = '#1f5f99', GRI = '#7d8b8f', TURUNCU = '#d9622b';

  const SEVIYE = [
    { ad: 'Çok hassas', it: 6, ra: '0,4', genel: 'ISO 2768-fH', yontem: 'Taşlama, honlama, koordinat taşlama / hassas CNC', mal: 5,
      delikTip: 'pim', delikAd: 'Pim / burç deliği (H7)', posNot: 'Pim ve burç delikleri için hassas CNC ile ulaşılabilen tipik değer.' },
    { ad: 'Hassas', it: 7, ra: '0,8', genel: 'ISO 2768-fH', yontem: 'Hassas CNC frezeleme / tornalama, raybalama', mal: 3,
      delikTip: 'dis', delikAd: 'Dişli delik (sabit bağlantı)', posNot: 'Sabit bağlantı: T = (H − F) / 2, ISO 273 ince seri geçiş deliğine göre.' },
    { ad: 'Standart', it: 9, ra: '1,6', genel: 'ISO 2768-mK', yontem: 'CNC frezeleme / tornalama', mal: 2,
      delikTip: 'ince', delikAd: 'Geçiş deliği – ISO 273 ince seri', posNot: 'Yüzen bağlantı: T = H − F, ISO 273 ince seri (MMC).' },
    { ad: 'Kaba', it: 11, ra: '3,2', genel: 'ISO 2768-cL', yontem: 'Konvansiyonel tezgâh, delme, kesim', mal: 1,
      delikTip: 'orta', delikAd: 'Geçiş deliği – ISO 273 orta seri', posNot: 'Yüzen bağlantı: T = H − F, ISO 273 orta seri (MMC).' }
  ];
  const TERCIH = [0.002, 0.003, 0.004, 0.005, 0.006, 0.008, 0.01, 0.012, 0.015, 0.02, 0.025, 0.03, 0.04, 0.05, 0.06, 0.08, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2];
  const pref = v => TERCIH.reduce((a, b) => Math.abs(Math.log(b / v)) < Math.abs(Math.log(a / v)) ? b : a);
  const IT = (cap, k) => g.TOL.itDeger(Math.max(1, cap), k) / 1000; // mm
  const tf = v => String(+v.toFixed(3)).replace('.', ',');
  const nf = (v, d = 1) => String(+(+v).toFixed(d)).replace('.', ',');

  // ISO 2768-1 doğrusal genel tolerans (± mm) – f, m, c
  const G1S = [3, 6, 30, 120, 400, 1000, 2000, 4000];
  const G1 = { f: [0.05, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5, 0.5], m: [0.1, 0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 2], c: [0.2, 0.3, 0.5, 0.8, 1.2, 2, 3, 4] };
  const genelTol = (olcu, sinif) => G1[sinif][Math.max(0, G1S.findIndex(u => olcu <= u))];

  const DELIK = { M3: [3.2, 3.4], M4: [4.3, 4.5], M5: [5.3, 5.5], M6: [6.4, 6.6], M8: [8.4, 9.0], M10: [10.5, 11.0], M12: [13.0, 13.5] };
  const MBOY = ['M3', 'M4', 'M5', 'M6', 'M8', 'M10', 'M12'];

  const REF = {
    asmeY145: { kisa: 'ASME Y14.5 – Ek B', ad: 'ASME Y14.5 Ek B: yüzen bağlantı T = H − F, sabit bağlantı T1 + T2 = H − F (eşit paylaşımda T = (H − F)/2); H ve F en büyük malzeme durumundaki (MMC) çaplar', url: 'https://open-exam-prep.com/study-guides/asme-gdtp-senior/location-2/fixed-floating-fasteners' },
    iso273: { kisa: 'ISO 273', ad: 'ISO 273 – Bağlantı elemanları için geçiş delikleri: ince, orta, kaba seri (ör. M6: 6,4 / 6,6 / 7,0 mm)', url: '' },
    iso5459: { kisa: 'ISO 5459', ad: 'ISO 5459 – Geometrik ürün spesifikasyonu: datumlar ve datum sistemleri (A birincil, B ikincil, C üçüncül)', url: '' },
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
    const d = DELIK[M][1];
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
    for (const m of MBOY) if (DELIK[m][1] <= sinir) M = m;
    if (!M) return { M: null, holes: [], PCD };
    const dh = DELIK[M][1];
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
  function degerler(s, i) {
    const v = SEVIYE[i], k = v.it;
    const sil = s.grSekil === 'silindir';
    const out = { v, i };
    const posDelik = (Mnom) => {
      const [hi, ho] = DELIK['M' + Mnom];
      if (v.delikTip === 'pim') return { ad: `Ø${Mnom} H7`, T: pref(Math.max(0.01, IT(sil ? s.grOD : Math.max(s.grL, s.grW), 5))), mmc: false, H: Mnom };
      if (v.delikTip === 'dis') return { ad: `M${Mnom} – 6H`, T: pref((hi - Mnom) / 2), mmc: false, H: hi, formul: `(${nf(hi)} − ${Mnom}) / 2` };
      const H = v.delikTip === 'ince' ? hi : ho;
      return { ad: `Ø${nf(H)} H12`, T: pref(H - Mnom), mmc: true, H, formul: `${nf(H)} − ${Mnom}` };
    };
    if (!sil) {
      const L = s.grL, W = s.grW, H = s.grH, Lm = Math.max(L, W);
      out.flatA = pref(IT(Lm, k - 1));
      out.perpB = pref(IT(Math.max(H, 3), k));
      out.perpC = out.perpB;
      out.HTol = k <= 7 ? IT(H, k) / 2 : genelTol(H, v.genel.includes('-c') ? 'c' : 'm');
      out.HTolAcik = k <= 7;
      out.par = pref(Math.min(IT(Lm, k), out.HTol * 2));
      if (out.par < out.flatA && k > 6) out.par = out.flatA;
      const dl = prizmaDelikler(s);
      out.del = dl; out.pos = posDelik(dl.Mnom);
    } else {
      const D = s.grOD, d = s.grID > 0 ? s.grID : 0, T = s.grT;
      out.flatA = pref(IT(D, k - 1));
      out.od = g.TOL.sapma(D, 'h', k);
      out.id = d ? g.TOL.sapma(d, 'H', k) : null;
      out.TTol = k <= 7 ? IT(T, k) / 2 : genelTol(T, v.genel.includes('-c') ? 'c' : 'm');
      out.TTolAcik = k <= 7;
      out.par = pref(Math.min(IT(D, k), out.TTol * 2));
      out.perpBore = d ? pref(IT(Math.max(T, 3), k)) : null;
      out.runout = pref(IT(D, k - 1));
      out.cyl = d && k <= 7 ? pref(IT(d, k - 1) / 2) : null;
      const dl = silindirDelikler(s);
      out.del = dl;
      if (dl.M) { out.pos = posDelik(dl.Mnom); out.pinPos = [0.01, 0.02, 0.05, 0.1][i]; }
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
    const tw = metin.length * 7.4 + 14 + (opt.mmc ? 16 : 0);
    const dat = opt.datum || [];
    const w = sw + tw + dat.length * 22;
    let s = `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`;
    s += `<line x1="${x + sw}" y1="${y}" x2="${x + sw}" y2="${y + h}" stroke="${INK}"/>${sembol(tip, x + sw / 2, y + h / 2)}`;
    s += t(x + sw + (tw - (opt.mmc ? 16 : 0)) / 2, y + 15.5, metin, { s: 12.5 });
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
    const dh = r.pos.H * sc;
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
      const yazi = `${holes.length}× ${r.pos.ad}${r.v.delikTip === 'pim' || r.v.delikTip === 'dis' ? '' : ' GEÇER'}`;
      o += `<path d="M${cx + rr * 0.7} ${cy - rr * 0.7} L${cx + 26} ${ty + 20} H${tx + 4}" fill="none" stroke="${INK}"/>`;
      o += lider(cx + rr * 0.7, cy - rr * 0.7, cx + rr * 0.7 + 8, cy - rr * 0.7 - 8, id);
      o += t(tx, ty + 14, yazi, { a: 'start', s: 13, w: true });
      o += cerceve(tx, ty + 22, 'kon', r.pos.T, { cap: true, mmc: r.pos.mmc, datum: ['A', 'B', 'C'] }).svg;
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
      const rp = dl.PCD * sc / 2, rh = Math.max(r.pos.H * sc / 2, 3), rpin = Math.max(dl.pinD * sc / 2, 2.5);
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
      o += t(40, cy + R + 58, `${dl.n}× ${r.pos.ad}${r.v.delikTip === 'pim' || r.v.delikTip === 'dis' ? '' : ' GEÇER'} · EŞİT ARALIKLI`, { a: 'start', s: 12.5, w: true });
      o += cerceve(40, cy + R + 66, 'kon', r.pos.T, { cap: true, mmc: r.pos.mmc, datum: d ? ['A', 'B', 'C'] : ['A', 'B', 'C'] }).svg;
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
    o += cerceve(cx + 30, cy - R - 82, 'salgi', r.runout, { datum: ['B'] }).svg + `<path d="M${cx + 40} ${cy - R - 60} V${cy - R - 34}" stroke="${INK}"/>`;
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
      if (r.cyl) o += cerceve(xd + 12, fy + 28, 'sil', r.cyl).svg + t(xd + 12, fy + 64, '(delik yüzeyi)', { a: 'start', s: 9.5, c: GRI });
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
      <h3 class="mt">2 · İşleme seviyesi</h3>
      <div class="seg" data-bind="grSeviye">${SEVIYE.map((v, i) => `<button data-v="${i}">${v.ad}</button>`).join('')}</div>
      <p class="hint">Aynı parça ve aynı delik düzeni dört seviyede çizilir; seviye değiştikçe tolerans değerleri, delik tipi ve genel tolerans sınıfı değişir. Datumlar: <b>A</b> ${sil ? 'oturma yüzü' : 'alt yüz'} (birincil), <b>B</b> ${sil ? (s.grID > 0 ? 'iç çap ekseni' : 'dış çap ekseni') : 'ön yan yüz'} (ikincil), <b>C</b> ${sil ? 'pim deliği (açısal konum)' : 'sol yan yüz'} (üçüncül).</p>
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
    const tablo = `<table class="karsi"><thead><tr><th></th>${R.map(x => `<th class="num ${x.i === i ? 'sec' : ''}">${x.v.ad}</th>`).join('')}</tr></thead><tbody>
      ${sil ? sat('Dış çap toleransı', x => `h${x.v.it} (${ust(x.od.ust)}/${ust(x.od.alt)})`) + (s.grID > 0 ? sat('İç çap toleransı (datum B)', x => `H${x.v.it} (${ust(x.id.ust)}/${ust(x.id.alt)})`) : '') + sat('Kalınlık', x => x.TTolAcik ? `±${tf(Math.round(x.TTol * 1000) / 1000)}` : `±${tf(x.TTol)} (genel)`)
        : sat('Kalınlık (yükseklik)', x => x.HTolAcik ? `±${tf(Math.round(x.HTol * 1000) / 1000)}` : `±${tf(x.HTol)} (genel)`)}
      ${sat('Düzlemsellik – datum A', x => tf(x.flatA))}
      ${sil ? (s.grID > 0 ? sat('Delik ekseni diklik ⊥ A', x => 'Ø' + tf(x.perpBore)) : '') + sat('Dairesel salgı (dış çap) → B', x => tf(x.runout)) + (s.grID > 0 ? sat('Silindiriklik (delik)', x => x.cyl ? tf(x.cyl) : '–') : '')
        : sat('Diklik B ⊥ A', x => tf(x.perpB)) + sat('Diklik C ⊥ A, B', x => tf(x.perpC))}
      ${sat('Paralellik (karşı yüz) ∥ A', x => tf(x.par))}
      ${r.pos ? sat('Delik tipi', x => esc(x.pos.ad)) + sat('Konum toleransı', x => `Ø${tf(x.pos.T)}${x.pos.mmc ? ' Ⓜ' : ''}`) : ''}
      ${sat('Yüzey pürüzlülüğü', x => 'Ra ' + x.v.ra)}
      ${sat('Genel tolerans', x => x.v.genel)}
      ${sat('Göreli maliyet', x => '₺'.repeat(x.v.mal))}
    </tbody></table>`;
    return `<div class="card">
      <h3>${esc(r.v.ad)} işleme – örnek teknik resim</h3>
      ${buyuk ? '<div class="warnbox">500 mm üzerindeki ölçülerde ISO 286 tablosunun son aralığı kullanıldı.</div>' : ''}
      <div class="gdt-kap">${svg}</div>
      <p class="small mt"><b>Tipik üretim:</b> ${esc(r.v.yontem)}. <b>Delik:</b> ${esc(r.v.delikAd)} – ${esc(r.v.posNot)}${r.pos && r.pos.formul ? ` (${r.pos.formul} = ${tf(r.pos.T)} mm)` : ''}</p>
    </div>
    <div class="card"><h3>Dört seviyenin karşılaştırması</h3>${tablo}
      <p class="small mt">Seçili seviye vurgulu. Satıra göre değerler aynı parça ölçülerine göre hesaplanır.</p></div>
    <div class="card"><h3>Değerler nereden geliyor?</h3>
      <ul class="liste">
        <li><b>Boyut toleransları:</b> ISO 286 kaliteleri – çok hassas IT6, hassas IT7, standart IT9, kaba IT11. Standart ve kaba seviyede kalınlık ayrıca yazılmaz, antetteki genel tolerans (ISO 2768-1 m / c) geçerlidir.</li>
        <li><b>Düzlemsellik ve salgı:</b> yüzeyin en büyük ölçüsüne göre bir kalite daha ince IT değeri (IT5 / IT6 / IT8 / IT10). Bu değerler hassas–standart–kaba seviyede ISO 2768-2’nin H–K–L değerleriyle aynı mertebededir (ör. 100 mm: 0,02 / 0,05 / 0,1).</li>
        <li><b>Diklik ve paralellik:</b> ilgili yüzey boyunun IT değeri; paralellik kalınlık toleransını aşmayacak şekilde sınırlandı.</li>
        <li><b>Konum toleransı:</b> ASME Y14.5 bağlantı formülleri. Yüzen bağlantı (iki parçada da geçiş deliği) T = H − F; sabit bağlantı (bir parçada diş) T = (H − F)/2. H: geçiş deliğinin en küçük çapı (ISO 273), F: cıvata anma çapı. Çok hassas seviyede delikler pim/burç deliği kabul edildi.</li>
        <li><b>Datum sırası:</b> A birincil (3 temas noktası), B ikincil (2 nokta), C üçüncül (1 nokta). Tolerans çerçevesinde datumlar bu öncelik sırasıyla yazılır.</li>
        <li>Bunlar <b>örnek ve başlangıç değerleridir</b>; gerçek parçada toleransı fonksiyon (geçme, montaj, sızdırmazlık) belirler. Gereksiz sıkı tolerans maliyeti hızla artırır.</li>
      </ul>
      ${refs([['iso286', 'IT kaliteleri ve h/H sapmaları.'], ['iso2768', 'Genel doğrusal toleranslar (f, m, c).'], ['iso27682', 'Genel geometrik toleranslar H, K, L.'], ['iso1101', 'Tolerans çerçevesi ve semboller.'], ['iso5459', 'Datum sistemi A-B-C.'], ['asmeY145', 'Yüzen/sabit bağlantı konum toleransı formülleri.'], ['iso273', 'Geçiş deliği serileri.'], ['iso8015', 'Bağımsızlık ilkesi.']])}
    </div>`;
  }

  document.addEventListener('click', e => {
    if (e.target.closest('#grYeni')) { const S = U().S(); S.grSeed = (S.grSeed || 1) + 1; U().changed(false); }
  });

  g.TRESIM = { girdi, sonuc, degerler, SEVIYE };
})(window);
