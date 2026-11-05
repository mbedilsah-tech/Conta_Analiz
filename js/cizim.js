// Conta Analiz – kurallar için sade teknik resim çizimleri (SVG)
(function (g) {
  const f = (x, n = 1) => Number(x).toLocaleString('tr-TR', { minimumFractionDigits: n, maximumFractionDigits: n });
  const INK = '#1d2326', THIN = '#5d676c', DIM = '#1f5f99', SEAL = '#d9622b', OK = '#2f7d4f', BAD = '#b23a3a';

  const defs = `<defs>
    <marker id="ok-a" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L10 5 L0 9 z" fill="${DIM}"/></marker>
    <marker id="ok-k" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L10 5 L0 9 z" fill="${INK}"/></marker>
    <pattern id="tr-hat" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#9aa5a2" stroke-width="1"/></pattern>
  </defs>`;
  const svg = (w, h, body, baslik) => `<svg class="cizim" viewBox="0 0 ${w} ${h}" role="img" aria-label="${baslik || 'Teknik resim'}">${defs}
    <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="#fff" stroke="#c9cec7"/>${body}
    <text x="${w - 8}" y="13" font-size="9" text-anchor="end" fill="${THIN}">mm · ölçeksiz şematik</text></svg>`;
  const txt = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 11}" text-anchor="${o.a || 'middle'}" fill="${o.c || INK}" ${o.b ? 'font-weight="700"' : ''}>${t}</text>`;
  const line = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.c || INK}" stroke-width="${o.w || 1.2}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''}/>`;
  const merkez = (x1, y1, x2, y2) => line(x1, y1, x2, y2, { c: THIN, w: 0.8, dash: '10 3 2 3' });
  // Ölçü çizgisi (ok uçlu) + yazı
  function olcuH(x1, x2, y, t, ust = true) {
    return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${DIM}" stroke-width="1" marker-start="url(#ok-a)" marker-end="url(#ok-a)"/>${txt((x1 + x2) / 2, ust ? y - 5 : y + 13, t, { c: DIM, s: 11 })}`;
  }
  function olcuV(x, y1, y2, t, sag = true) {
    return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${DIM}" stroke-width="1" marker-start="url(#ok-a)" marker-end="url(#ok-a)"/>${txt(sag ? x + 6 : x - 6, (y1 + y2) / 2 + 4, t, { c: DIM, a: sag ? 'start' : 'end', s: 11 })}`;
  }
  const uzatma = (x1, y1, x2, y2) => line(x1, y1, x2, y2, { c: DIM, w: 0.6 });
  function etiket(x1, y1, x2, y2, t, a = 'start') {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="0.8" marker-start="url(#ok-k)"/>${txt(x2 + (a === 'start' ? 4 : -4), y2 + 4, t, { a, s: 10.5 })}`;
  }
  const delik = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="1.2"/>${merkez(x - r - 5, y, x + r + 5, y)}${merkez(x, y - r - 5, x, y + r + 5)}`;
  const isaret = (x, y, ok) => ok ? `<circle cx="${x}" cy="${y}" r="9" fill="${OK}"/><path d="M${x - 4} ${y} l3 3 l5 -6" stroke="#fff" stroke-width="2" fill="none"/>` : `<circle cx="${x}" cy="${y}" r="9" fill="${BAD}"/><path d="M${x - 4} ${y - 4} l8 8 M${x + 4} ${y - 4} l-8 8" stroke="#fff" stroke-width="2"/>`;
  // Yüzey işareti (√ Ra)
  function ra(x, y, deger) { return `<path d="M${x - 6} ${y - 6} L${x} ${y} L${x + 12} ${y - 18} L${x + 34} ${y - 18}" fill="none" stroke="${INK}" stroke-width="1"/>${txt(x + 22, y - 21, 'Ra ' + deger, { s: 10 })}`; }

  // Kanal kesiti (dikdörtgen) – x0: sol, y0: üst yüzey
  function kanalKesit(x0, y0, b, h, opts = {}) {
    const W = opts.W || 360;
    return `<path d="M10 ${y0} H${x0} V${y0 + h} H${x0 + b} V${y0} H${W - 10} V${y0 + (opts.gH || 70)} H10 Z" fill="url(#tr-hat)" stroke="${INK}" stroke-width="1.2"/>`;
  }

  const C = {
    // 1. Conta basınç tarafında, cıvatalar dışarıda (üstten görünüş)
    yerlesim(p) {
      const x = 18, y = 30, w = 260, h = 140, gi = 30;
      const delikler = [[x + 14, y + 14], [x + w / 2, y + 12], [x + w - 14, y + 14], [x + w - 14, y + h - 14], [x + w / 2, y + h - 12], [x + 14, y + h - 14], [x + 12, y + h / 2], [x + w - 12, y + h / 2]];
      return svg(400, 210, `
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#f7f8f6" stroke="${INK}" stroke-width="1.4"/>
        <rect x="${x + gi}" y="${y + gi}" width="${w - 2 * gi}" height="${h - 2 * gi}" rx="16" fill="none" stroke="${SEAL}" stroke-width="5" opacity=".85"/>
        <rect x="${x + gi + 12}" y="${y + gi + 12}" width="${w - 2 * gi - 24}" height="${h - 2 * gi - 24}" rx="6" fill="#fbe9df" stroke="none"/>
        ${txt(x + w / 2, y + h / 2 + 4, 'BASINÇ TARAFI', { s: 11, c: SEAL, b: 1 })}
        ${delikler.map(([a, b]) => delik(a, b, 5)).join('')}
        ${etiket(x + w - 14, y + 14, 298, 34, 'Cıvata (dışta)')}
        ${etiket(x + w - gi, y + h / 2 + 20, 298, 120, 'Conta kanalı')}
        ${etiket(x + w / 2 + 60, y + h / 2 + 4, 298, 160, 'Sızdırmaz bölge')}
        ${txt(200, 200, 'Üstten görünüş – cıvatalar sızdırmaz bölgenin dışında', { s: 10.5, c: THIN })}`, 'Conta ve cıvata yerleşimi');
    },
    // 2. Kanal – delik et kalınlığı (kesit + üstten detay)
    etKalinlik(p) {
      const k = 10; const r = p.delik / 2 * k, bb = p.b * k, e = p.e * k;
      const cx = 70, cy = 95, gx = cx + r + e;
      return svg(400, 200, `
        <rect x="20" y="40" width="360" height="110" fill="#f7f8f6" stroke="${INK}"/>
        ${delik(cx, cy, Math.min(r, 40))}
        <rect x="${gx}" y="40" width="${Math.min(bb, 120)}" height="110" fill="#fbe9df" stroke="${SEAL}" stroke-width="1.4"/>
        ${merkez(gx + Math.min(bb, 120) / 2, 30, gx + Math.min(bb, 120) / 2, 160)}
        ${txt(gx + Math.min(bb, 120) / 2, 100, 'Kanal', { c: SEAL, s: 11 })}
        ${uzatma(cx + Math.min(r, 40), cy, cx + Math.min(r, 40), 172)}${uzatma(gx, 150, gx, 172)}
        ${olcuH(cx + Math.min(r, 40), gx, 168, 'e ≥ ' + f(p.e), false)}
        ${uzatma(cx, cy, cx, 28)}${olcuH(cx, gx + Math.min(bb, 120) / 2, 26, 'L ≥ ' + f(p.L))}
        ${txt(cx, cy + Math.min(r, 40) + 16, 'Ø' + f(p.delik) + ' (' + p.M + ')', { s: 10.5 })}
        ${txt(200, 192, 'Üstten detay – delik kenarı ile kanal kenarı arası et', { s: 10.5, c: THIN })}`, 'Et kalınlığı');
    },
    // 3. Köşe yarıçapı (üstten görünüş)
    kose(p) {
      const R = 70, x0 = 70, y0 = 40, bw = 22;
      return svg(400, 210, `
        <path d="M${x0} ${y0 + R + 100} V${y0 + R} A${R} ${R} 0 0 1 ${x0 + R} ${y0} H${x0 + 260}" fill="none" stroke="${SEAL}" stroke-width="${bw}" opacity=".35"/>
        <path d="M${x0} ${y0 + R + 100} V${y0 + R} A${R} ${R} 0 0 1 ${x0 + R} ${y0} H${x0 + 260}" fill="none" stroke="${THIN}" stroke-width="0.8" stroke-dasharray="10 3 2 3"/>
        ${merkez(x0 + R, y0 + R, x0 + R, y0 - 10)}${merkez(x0 + R, y0 + R, x0 - 10, y0 + R)}
        <line x1="${x0 + R}" y1="${y0 + R}" x2="${x0 + R - R * 0.707}" y2="${y0 + R - R * 0.707}" stroke="${DIM}" stroke-width="1" marker-end="url(#ok-a)"/>
        ${txt(x0 + R - 18, y0 + R - 20, 'R ≥ ' + f(p.Rmin), { c: DIM, a: 'start' })}
        ${txt(210, 110, 'Kanal ekseninde ölçülür', { s: 10.5, c: THIN, a: 'start' })}
        ${txt(210, 128, 'Alt sınır 3d = R' + f(p.Rmin), { s: 11, a: 'start' })}
        ${txt(210, 146, 'Öneri 6d = R' + f(p.Rtercih), { s: 11, a: 'start', b: 1 })}
        ${txt(200, 200, 'Üstten görünüş – kanal köşesi', { s: 10.5, c: THIN })}`, 'Köşe yarıçapı');
    },
    // 4. Kenar kırma ve taban radyüsü (kesit)
    kenar() {
      const x0 = 140, y0 = 70, b = 120, h = 70;
      return svg(400, 200, `
        <path d="M10 ${y0} H${x0 - 4} Q${x0} ${y0} ${x0} ${y0 + 4} V${y0 + h - 10} Q${x0} ${y0 + h} ${x0 + 10} ${y0 + h} H${x0 + b - 10} Q${x0 + b} ${y0 + h} ${x0 + b} ${y0 + h - 10} V${y0 + 4} Q${x0 + b} ${y0} ${x0 + b + 4} ${y0} H390 V180 H10 Z" fill="url(#tr-hat)" stroke="${INK}" stroke-width="1.2"/>
        ${etiket(x0 + 3, y0 + h - 3, 60, 160, 'R0,2–0,4 (taban)', 'start')}
        ${etiket(x0 + b + 2, y0 + 2, 300, 40, '0,1–0,2 kenar kırma, çapaksız')}
        ${etiket(x0 - 2, y0 + 2, 40, 40, 'Keskin kenar yok')}
        ${txt(200, 194, 'Kesit – kanal radyüsleri', { s: 10.5, c: THIN })}`, 'Kenar radyüsleri');
    },
    // 5. Yüzey pürüzlülüğü (kesit)
    yuzey(p) {
      const x0 = 150, y0 = 80, b = 100, h = 60;
      return svg(400, 210, `
        <rect x="10" y="30" width="380" height="40" fill="url(#tr-hat)" stroke="${INK}"/>
        ${txt(30, 25, 'Kapak', { s: 10, c: THIN, a: 'start' })}
        ${kanalKesit(x0, y0, b, h, { W: 400, gH: 110 })}
        ${ra(300, 78, p.gaz ? '0,4' : '0,8')}${etiket(300, 74, 330, 58, '', 'start')}
        ${ra(x0 + 30, y0 + h - 2, p.gaz ? '0,4' : '0,8')}
        ${ra(x0 + b + 4, y0 + 34, '1,6')}
        ${txt(200, 202, 'Taban ve karşı yüzey Ra ≤ ' + (p.gaz ? '0,4 (gaz/vakum)' : '0,8 (sıvı)') + ' · yan duvar Ra ≤ 1,6 · işleme izi çevresel', { s: 10, c: THIN })}`, 'Yüzey pürüzlülüğü');
    },
    // 6. Duvar açısı / dovetail
    dovetail() {
      return svg(400, 200, `
        <path d="M10 60 H70 L74 120 H136 L140 60 H190 V150 H10 Z" fill="url(#tr-hat)" stroke="${INK}" stroke-width="1.2"/>
        ${txt(105, 40, 'Dikdörtgen, 0–5°', { s: 11, b: 1 })}
        ${etiket(72, 85, 30, 172, 'Duvar açısı 0–5°')}
        <path d="M210 60 H262 L250 120 H330 L318 60 H390 V150 H210 Z" fill="url(#tr-hat)" stroke="${INK}" stroke-width="1.2"/>
        <circle cx="290" cy="97" r="22" fill="${SEAL}" opacity=".8"/>
        ${txt(300, 40, 'Kırlangıç kuyruğu (dovetail)', { s: 11, b: 1 })}
        ${etiket(258, 75, 340, 172, 'O-ring kanalda tutulur', 'end')}
        ${txt(200, 194, 'Kapak ters takılıyorsa (O-ring aşağı bakıyorsa) dovetail kullanın', { s: 10, c: THIN })}`, 'Duvar açısı');
    },
    // 7. Düzlemsellik
    duzlem() {
      return svg(400, 180, `
        <rect x="40" y="70" width="320" height="40" fill="url(#tr-hat)" stroke="${INK}"/>
        <path d="M40 70 Q200 62 360 70" fill="none" stroke="${BAD}" stroke-width="1" stroke-dasharray="4 3"/>
        <rect x="140" y="20" width="120" height="24" fill="#fff" stroke="${INK}"/>
        <line x1="170" y1="20" x2="170" y2="44" stroke="${INK}"/>
        <path d="M148 37 L152 27 L164 27 L160 37 Z" fill="none" stroke="${INK}"/>
        ${txt(215, 37, '0,05', { s: 12 })}
        ${line(200, 44, 200, 70, { w: 0.8 })}
        ${txt(200, 140, 'Conta temas yüzeyi düzlemselliği tipik ≤ 0,05 mm / 100 mm', { s: 11 })}
        ${txt(200, 158, 'Uzun ince kapakta nervür veya kalınlık artışı', { s: 10.5, c: THIN })}`, 'Düzlemsellik');
    },
    // 8. Basınç yönü
    basincYonu() {
      const blok = (x, ic) => `
        <rect x="${x}" y="40" width="160" height="30" fill="url(#tr-hat)" stroke="${INK}"/>
        <path d="M${x} 70 H${x + 50} V120 H${x + 110} V70 H${x + 160} V150 H${x} Z" fill="url(#tr-hat)" stroke="${INK}"/>
        <circle cx="${ic ? x + 90 : x + 70}" cy="95" r="21" fill="${SEAL}" opacity=".85"/>
        <line x1="${ic ? x + 20 : x + 140}" y1="95" x2="${ic ? x + 62 : x + 98}" y2="95" stroke="${DIM}" stroke-width="2.5" marker-end="url(#ok-a)"/>
        ${txt(x + 80, 30, ic ? 'İç basınç' : 'Dış basınç / vakum', { b: 1 })}
        ${txt(x + 80, 168, ic ? 'O-ring DIŞ duvara yaslı' : 'O-ring İÇ duvara yaslı', { s: 10.5 })}
        ${txt(ic ? x + 14 : x + 146, 88, 'P', { c: DIM, b: 1 })}`;
      return svg(400, 190, `${blok(25, true)}${blok(215, false)}`, 'Basınç yönü');
    },
    // 9. Tolerans zinciri
    tolerans(p) {
      const x0 = 150, y0 = 60, b = 100, h = 70;
      return svg(400, 200, `
        <rect x="10" y="${y0 - 30}" width="380" height="30" fill="url(#tr-hat)" stroke="${INK}"/>
        ${kanalKesit(x0, y0, b, h, { W: 400, gH: 110 })}
        ${line(x0 + b, y0 - 3, 390, y0 - 3, { c: '#7a9cc6', w: 3 })}${etiket(330, y0 - 3, 300, 22, '', 'end')}${txt(296, 24, 'Kaplama kalınlığı', { s: 10.5, a: 'end' })}
        ${uzatma(x0 + b, y0 + h, x0 + b + 40, y0 + h)}
        ${olcuV(x0 + b + 30, y0, y0 + h, 'h ' + f(p.h, 2) + ' ±' + f(p.tol, 2))}
        ${txt(200, 192, 'Kapak/gövde çarpılması ve kaplama kalınlığı derinliğe eklenir', { s: 10.5, c: THIN })}`, 'Tolerans zinciri');
    },
    // 10. Montaj ve servis
    servis() {
      return svg(400, 200, `
        <rect x="40" y="30" width="300" height="140" rx="8" fill="#f7f8f6" stroke="${INK}"/>
        <rect x="80" y="60" width="220" height="80" rx="14" fill="none" stroke="${SEAL}" stroke-width="5" opacity=".85"/>
        <path d="M190 55 h16 v10 h-16 z" fill="#fff" stroke="${INK}"/>
        ${etiket(198, 58, 250, 22, 'Sökme cebi')}
        <circle cx="60" cy="50" r="5" fill="${INK}"/><circle cx="320" cy="150" r="5" fill="${INK}"/>
        ${etiket(60, 50, 20, 190, 'Kılavuz pim', 'start')}
        ${etiket(320, 150, 370, 190, 'Kılavuz pim', 'end')}
        ${txt(200, 105, 'Kapak pimle konumlanır', { s: 10.5, c: THIN })}`, 'Montaj ve servis');
    },
    // 11. EMI temas yüzeyi
    emiYuzey() {
      return svg(400, 200, `
        <rect x="10" y="40" width="380" height="30" fill="url(#tr-hat)" stroke="${INK}"/>
        ${kanalKesit(150, 70, 100, 50, { W: 400, gH: 100 })}
        <ellipse cx="200" cy="95" rx="48" ry="25" fill="#7d8b8f"/>
        ${line(10, 72, 390, 72, { c: '#c9a227', w: 3 })}
        ${line(10, 38, 390, 38, { c: '#c9a227', w: 3 })}
        ${etiket(330, 72, 300, 150, 'Kromat (MIL-DTL-5541 Cl.3) – iletken', 'end')}
        ${etiket(60, 38, 30, 20, 'Eloksal/boya YOK – maskele', 'start')}
        ${txt(200, 192, 'İletken conta gövde ve kapakla doğrudan metal temasında', { s: 10.5, c: THIN })}`, 'EMI temas yüzeyi');
    },
    // 12. EMI süreklilik
    emiSureklilik() {
      return svg(400, 180, `
        <rect x="40" y="30" width="140" height="110" rx="10" fill="none" stroke="#7d8b8f" stroke-width="6"/>
        ${isaret(110, 85, true)}${txt(110, 160, 'Kesintisiz halka / vulkanize ek', { s: 10.5 })}
        <path d="M290 30 h-60 a10 10 0 0 0 -10 10 v90 a10 10 0 0 0 10 10 h120 a10 10 0 0 0 10 -10 v-90 a10 10 0 0 0 -10 -10 h-40" fill="none" stroke="#7d8b8f" stroke-width="6"/>
        ${isaret(290, 85, false)}${txt(290, 160, 'Boşluklu bindirme – sızıntı/EMI açıklığı', { s: 10.5 })}`, 'EMI süreklilik');
    },
    // Cıvata aralığı – kapak eğilmesi (yandan görünüş, abartılı)
    egilme(p) {
      const x1 = 60, x2 = 340, y = 80;
      const sag = 22;
      return svg(400, 210, `
        <rect x="20" y="${y + 26}" width="360" height="50" fill="url(#tr-hat)" stroke="${INK}"/>
        <rect x="24" y="${y + 34}" width="40" height="14" fill="#fff"/>${txt(28, y + 45, 'Gövde', { s: 10, c: THIN, a: 'start' })}
        <path d="M20 ${y} H${x1} Q${(x1 + x2) / 2} ${y - sag * 2} ${x2} ${y} H380 V${y + 20} H${x2} Q${(x1 + x2) / 2} ${y + 20 - sag * 2} ${x1} ${y + 20} H20 Z" fill="#eef1ee" stroke="${INK}" stroke-width="1.2"/>
        ${txt(24, y + 14, 'Kapak', { s: 9.5, a: 'start', c: THIN })}
        <rect x="${x1 - 7}" y="${y - 22}" width="14" height="22" fill="${INK}"/><rect x="${x2 - 7}" y="${y - 22}" width="14" height="22" fill="${INK}"/>
        ${line(x1, y, x1, y + 26, { w: 3 })}${line(x2, y, x2, y + 26, { w: 3 })}
        <path d="M${x1} ${y + 23} Q${(x1 + x2) / 2} ${y + 23 - sag * 2} ${x2} ${y + 23}" fill="none" stroke="${SEAL}" stroke-width="5" opacity=".85"/>
        ${uzatma(x1, y - 24, x1, y - 50)}${uzatma(x2, y - 24, x2, y - 50)}
        ${olcuH(x1, x2, y - 44, 'C = ' + (p.C ? f(p.C, 0) : '?') + ' mm (cıvata aralığı)')}
        <line x1="${(x1 + x2) / 2}" y1="${y + 23 - sag * 2 + 11}" x2="${(x1 + x2) / 2}" y2="${y + 23}" stroke="${DIM}" stroke-width="1" marker-start="url(#ok-a)" marker-end="url(#ok-a)"/>
        <rect x="${(x1 + x2) / 2 + 6}" y="${y + 34}" width="78" height="16" rx="3" fill="#fff" opacity=".92"/>${txt((x1 + x2) / 2 + 10, y + 46, 'ΔH ≤ ' + f(p.dH, 2), { c: DIM, a: 'start' })}
        ${line((x1 + x2) / 2, y + 23, (x1 + x2) / 2 + 8, y + 40, { c: DIM, w: 0.7 })}
        ${txt(200, 178, 'Kapak t = ' + f(p.t) + ' mm. Cıvatada conta en çok, iki cıvata ortasında en az sıkışır.', { s: 10.5 })}
        ${txt(200, 194, 'Ortadaki sıkışma alt sınırın altına düşmemeli (eğilme abartılı çizildi).', { s: 10.5, c: THIN })}`, 'Kapak eğilmesi');
    }
  };
  g.CIZIM = C;
})(typeof window !== 'undefined' ? window : globalThis);
