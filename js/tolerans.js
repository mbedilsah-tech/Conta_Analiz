// Mühendislik Tasarım Yardımcısı – Toleranslandırma modülü (ISO 286, ISO 2768)
(function (g) {
  const U = () => g.UI;

  // ---------- ISO 286-1 verisi ----------
  // Ana ölçü aralıkları (mm): "üstü … dahil"
  const ARALIK = [3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500];
  const ARALIK_AD = ['≤ 3', '3–6', '6–10', '10–18', '18–30', '30–50', '50–80', '80–120', '120–180', '180–250', '250–315', '315–400', '400–500'];
  // Standart tolerans değerleri IT (µm)
  const IT = {
    5: [4, 5, 6, 8, 9, 11, 13, 15, 18, 20, 23, 25, 27],
    6: [6, 8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40],
    7: [10, 12, 15, 18, 21, 25, 30, 35, 40, 46, 52, 57, 63],
    8: [14, 18, 22, 27, 33, 39, 46, 54, 63, 72, 81, 89, 97],
    9: [25, 30, 36, 43, 52, 62, 74, 87, 100, 115, 130, 140, 155],
    10: [40, 48, 58, 70, 84, 100, 120, 140, 160, 185, 210, 230, 250],
    11: [60, 75, 90, 110, 130, 160, 190, 220, 250, 290, 320, 360, 400],
    12: [100, 120, 150, 180, 210, 250, 300, 350, 400, 460, 520, 570, 630]
  };
  // Mil temel sapmaları (µm). d–g: üst sapma es (negatif). k–p: alt sapma ei.
  const MIL = {
    d: [-20, -30, -40, -50, -65, -80, -100, -120, -145, -170, -190, -210, -230],
    e: [-14, -20, -25, -32, -40, -50, -60, -72, -85, -100, -110, -125, -135],
    f: [-6, -10, -13, -16, -20, -25, -30, -36, -43, -50, -56, -62, -68],
    g: [-2, -4, -5, -6, -7, -9, -10, -12, -14, -15, -17, -18, -20],
    h: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    k: [0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5],     // IT4–IT7 için
    m: [2, 4, 6, 7, 8, 9, 11, 13, 15, 17, 20, 21, 23],
    n: [4, 8, 10, 12, 15, 17, 20, 23, 27, 31, 34, 37, 40],
    p: [6, 12, 15, 18, 22, 26, 32, 37, 43, 50, 56, 62, 68]
  };
  // r ve s için ince aralıklar (üst sınırlar) ve ei değerleri
  const INCE = [3, 6, 10, 18, 30, 50, 65, 80, 100, 120, 140, 160, 180, 200, 225, 250, 280, 315, 355, 400, 450, 500];
  const MIL_INCE = {
    r: [10, 15, 19, 23, 28, 34, 41, 43, 51, 54, 63, 65, 68, 77, 80, 84, 94, 98, 108, 114, 126, 132],
    s: [14, 19, 23, 28, 35, 43, 53, 59, 71, 79, 92, 100, 108, 122, 130, 140, 158, 170, 190, 208, 232, 252]
  };
  const DELIK_HARF = ['D', 'E', 'F', 'G', 'H', 'JS', 'K', 'M', 'N', 'P', 'R', 'S'];
  const MIL_HARF = ['d', 'e', 'f', 'g', 'h', 'js', 'k', 'm', 'n', 'p', 'r', 's'];
  const KALITE = [5, 6, 7, 8, 9, 10, 11, 12];

  const ind = d => ARALIK.findIndex(u => d <= u);
  const indInce = d => INCE.findIndex(u => d <= u);

  // Tolerans sınıfı → { ust, alt } (µm) veya { hata }
  function sapma(cap, harf, kalite) {
    const i = ind(cap);
    if (!(cap > 0) || i < 0) return { hata: 'Çap 0–500 mm aralığında olmalı.' };
    const it = IT[kalite] && IT[kalite][i];
    if (!it) return { hata: 'Bu kalite desteklenmiyor.' };
    const delik = harf === harf.toUpperCase();
    const h = harf.toLowerCase();
    const eiMil = () => (h === 'r' || h === 's') ? MIL_INCE[h][indInce(cap)] : MIL[h][i];
    if (!delik) {
      if (h === 'js') return { ust: it / 2, alt: -it / 2, it };
      if (['d', 'e', 'f', 'g', 'h'].includes(h)) { const es = MIL[h][i]; return { ust: es, alt: es - it, it }; }
      if (h === 'k') { const ei = (kalite >= 4 && kalite <= 7) ? MIL.k[i] : 0; return { ust: ei + it, alt: ei, it }; }
      const ei = eiMil(); return { ust: ei + it, alt: ei, it };
    }
    // Delikler
    if (h === 'js') return { ust: it / 2, alt: -it / 2, it };
    if (['d', 'e', 'f', 'g', 'h'].includes(h)) { const EI = -MIL[h][i]; return { ust: EI + it, alt: EI, it }; }
    // K, M, N (≤ IT8) ve P, R, S (≤ IT7): ES = −ei + Δ ; Δ = IT(n) − IT(n−1), ≤ 3 mm’de Δ = 0
    const delta = i === 0 ? 0 : it - ((IT[kalite - 1] || [])[i] ?? it);
    if (['k', 'm', 'n'].includes(h)) {
      if (kalite > 8 || kalite < 6) return { hata: `${harf} sınıfı burada yalnız 6–8 kaliteleri için hesaplanır.` };
      const ei = h === 'k' ? MIL.k[i] : MIL[h][i];
      const ES = -ei + delta; return { ust: ES, alt: ES - it, it };
    }
    if (['p', 'r', 's'].includes(h)) {
      if (kalite < 6) return { hata: `${harf} sınıfı burada 6 ve üstü kaliteler için hesaplanır.` };
      const ES = -eiMil() + (kalite <= 7 ? delta : 0); return { ust: ES, alt: ES - it, it };
    }
    return { hata: 'Desteklenmeyen sınıf.' };
  }

  // İşleme yöntemi ↔ IT (tipik, yaklaşık)
  const ISLEM = [
    { ad: 'Honlama, lepleme', a: 4, b: 6, sinif: 'Çok hassas' },
    { ad: 'Taşlama', a: 5, b: 7, sinif: 'İnce işleme' },
    { ad: 'Raybalama, hassas tornalama/delik işleme', a: 6, b: 8, sinif: 'İnce işleme' },
    { ad: 'Tornalama, frezeleme (normal)', a: 8, b: 11, sinif: 'Orta işleme' },
    { ad: 'Delme (matkap)', a: 10, b: 13, sinif: 'Kaba işleme' },
    { ad: 'Sac kesme, büküm, zımbalama', a: 11, b: 13, sinif: 'Kaba işleme' },
    { ad: 'Lazer / plazma kesim', a: 12, b: 14, sinif: 'Kaba' },
    { ad: 'Kum döküm, dövme', a: 14, b: 16, sinif: 'Çok kaba' }
  ];
  const islemIcin = k => ISLEM.filter(x => k >= x.a && k <= x.b).map(x => x.ad);

  // Yaygın geçmeler (delik esası)
  const GECME = [
    { d: 'H11', m: 'c11', tip: 'Boşluklu', ad: 'Çok serbest', ne: 'Kaba mafsallar, menteşeler, büyük boşluk kabul eden parçalar' },
    { d: 'H9', m: 'd9', tip: 'Boşluklu', ad: 'Serbest dönen', ne: 'Genel makine, yüksek hız/sıcaklık farkı olan yataklar' },
    { d: 'H8', m: 'f7', tip: 'Boşluklu', ad: 'Rahat dönen', ne: 'Kaymalı yataklar, millerin rahat dönmesi' },
    { d: 'H7', m: 'g6', tip: 'Boşluklu', ad: 'Hassas kayar', ne: 'Kılavuz, piston, elle takılıp hassas konumlanan parçalar' },
    { d: 'H7', m: 'h6', tip: 'Boşluklu', ad: 'Konumlama (en az boşluk)', ne: 'Merkezleme, elle takılan hassas konum parçaları' },
    { d: 'H7', m: 'k6', tip: 'Geçiş', ad: 'Hafif geçiş', ne: 'Rulman iç bileziği, kasnak/dişli göbeği, hafif tokmakla takma' },
    { d: 'H7', m: 'n6', tip: 'Geçiş / sıkı', ad: 'Sıkı geçiş', ne: 'Daha sıkı merkezleme; pres ile takma' },
    { d: 'H7', m: 'p6', tip: 'Sıkı', ad: 'Hafif pres', ne: 'Pimler, burçlar; preste takılır, sökülebilir' },
    { d: 'H7', m: 's6', tip: 'Sıkı', ad: 'Pres / sıcak geçirme', ne: 'Kalıcı tork aktarımı; ısıtarak veya presle takma' }
  ];

  // ---------- ISO 2768 ----------
  const G1_ARALIK = [[0.5, 3], [3, 6], [6, 30], [30, 120], [120, 400], [400, 1000], [1000, 2000], [2000, 4000]];
  const G1 = { f: [0.05, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5, null], m: [0.1, 0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 2], c: [0.2, 0.3, 0.5, 0.8, 1.2, 2, 3, 4], v: [null, 0.5, 1, 1.5, 2.5, 4, 6, 8] };
  const G1_RADYUS = { aralik: ['0,5–3', '3–6', '> 6'], fm: [0.2, 0.5, 1], cv: [0.4, 1, 2] };
  const G1_ACI = { aralik: ['≤ 10', '10–50', '50–120', '120–400', '> 400'], f: ['±1°', '±0°30′', '±0°20′', '±0°10′', '±0°5′'], m: ['±1°', '±0°30′', '±0°20′', '±0°10′', '±0°5′'], c: ['±1°30′', '±1°', '±0°30′', '±0°15′', '±0°10′'], v: ['±3°', '±2°', '±1°', '±0°30′', '±0°20′'] };
  const G2_DUZ = { aralik: ['≤ 10', '10–30', '30–100', '100–300', '300–1000', '1000–3000'], H: [0.02, 0.05, 0.1, 0.2, 0.3, 0.4], K: [0.05, 0.1, 0.2, 0.4, 0.6, 0.8], L: [0.1, 0.2, 0.4, 0.8, 1.2, 1.6] };
  const G2_DIK = { aralik: ['≤ 100', '100–300', '300–1000', '1000–3000'], H: [0.2, 0.3, 0.4, 0.5], K: [0.4, 0.6, 0.8, 1], L: [0.6, 1, 1.5, 2] };
  const G2_SIM = { H: [0.5, 0.5, 0.5, 0.5], K: [0.6, 0.6, 0.8, 1], L: [0.6, 1, 1.5, 2] };
  const G2_SALGI = { H: 0.1, K: 0.2, L: 0.5 };
  const SINIF_AD = { f: 'f – ince', m: 'm – orta', c: 'c – kaba', v: 'v – çok kaba' };
  const SINIF_NE = { f: 'Hassas talaşlı işleme, taşlama; hassas mekanizma parçaları.', m: 'Genel talaşlı işleme (tornalama, frezeleme) – en yaygın seçim.', c: 'Kaba işleme, kaynaklı konstrüksiyon, sac parçalar.', v: 'Döküm, dövme, oksijen/plazma kesim gibi çok kaba yöntemler.' };

  // ---------- GD&T sembolleri (ISO 1101) ----------
  const SEMBOL = [
    ['⏤', 'Doğrusallık', 'Form', 'Bir çizginin ne kadar düz olduğu'], ['⏥', 'Düzlemsellik', 'Form', 'Bir yüzeyin iki paralel düzlem arasında kalması'],
    ['○', 'Dairesellik', 'Form', 'Kesitin iki eş merkezli daire arasında kalması'], ['⌭', 'Silindiriklik', 'Form', 'Yüzeyin iki eş eksenli silindir arasında kalması'],
    ['⌒', 'Çizgi profili', 'Profil', 'Bir eğri çizginin teorik profilden sapması'], ['⌓', 'Yüzey profili', 'Profil', 'Bir yüzeyin teorik profilden sapması'],
    ['∥', 'Paralellik', 'Yönelim', 'Referansa paralel iki düzlem/çizgi arasında kalma'], ['⟂', 'Diklik', 'Yönelim', 'Referansa dik olma toleransı'],
    ['∠', 'Açısallık', 'Yönelim', 'Referansa belirli açıda olma'], ['⌖', 'Konum', 'Konum', 'Delik/eksenin teorik konumdan sapması (en çok kullanılan)'],
    ['◎', 'Eş eksenlilik', 'Konum', 'Eksenin referans eksenle çakışması'], ['⌯', 'Simetri', 'Konum', 'Orta düzlemin referansa göre simetrisi'],
    ['↗', 'Dairesel salgı', 'Salgı', 'Döndürülen parçada tek kesitteki salgı'], ['⌰', 'Toplam salgı', 'Salgı', 'Döndürülen parçada tüm yüzey boyunca salgı']
  ];

  // ---------- Görseller ----------
  function zonSvg(zonlar, baslik) {
    // zonlar: [{ad, ust, alt, renk}] µm
    const W = 560, H = 230, y0 = 120;
    const maks = Math.max(5, ...zonlar.flatMap(z => [Math.abs(z.ust), Math.abs(z.alt)]));
    const k = 80 / maks;
    const Y = v => y0 - v * k;
    const g2 = zonlar.map((z, i) => {
      const x = 170 + i * 150;
      return `<rect x="${x}" y="${Y(z.ust)}" width="110" height="${Math.max(2, (z.ust - z.alt) * k)}" fill="${z.renk}" opacity=".85" stroke="#1d2326"/>
        <text x="${x + 55}" y="${Y(z.ust) - 8}" font-size="12" text-anchor="middle" fill="#1d2326" font-weight="700">${z.ad}</text>
        <text x="${x + 118}" y="${Y(z.ust) + 4}" font-size="11" fill="#1f5f99">${z.ust > 0 ? '+' : ''}${z.ust} µm</text>
        <text x="${x + 118}" y="${Y(z.alt) + (z.alt === 0 ? 14 : 4)}" font-size="11" fill="#1f5f99">${z.alt > 0 ? '+' : ''}${z.alt} µm</text>`;
    }).join('');
    return `<svg class="cizim" viewBox="0 0 ${W} ${H}" role="img" aria-label="${baslik}">
      <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="#fff" stroke="#c9cec7"/>
      <line x1="20" y1="${y0}" x2="${W - 20}" y2="${y0}" stroke="#1d2326" stroke-width="1.5" stroke-dasharray="8 4"/>
      <text x="24" y="${y0 - 6}" font-size="11" fill="#5d676c">Sıfır çizgisi (nominal ölçü)</text>
      <text x="24" y="28" font-size="11" fill="#5d676c">+ büyük</text><text x="24" y="${H - 14}" font-size="11" fill="#5d676c">− küçük</text>
      ${g2}
    </svg>`;
  }
  function parcaSvg(cap, sinif, ust, alt, delik) {
    const W = 560, H = 180;
    const t = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + U().f(Math.abs(v) / 1000, 3);
    const etiket = `Ø${U().f(cap, cap % 1 ? 2 : 0)} ${sinif}`;
    const govde = delik
      ? `<rect x="120" y="40" width="320" height="100" fill="#eef1ee" stroke="#1d2326"/><rect x="220" y="40" width="120" height="100" fill="#fff" stroke="#1d2326"/><line x1="280" y1="30" x2="280" y2="150" stroke="#5d676c" stroke-dasharray="10 3 2 3"/>`
      : `<rect x="120" y="60" width="320" height="60" fill="#e7ebe9" stroke="#1d2326"/><line x1="110" y1="90" x2="450" y2="90" stroke="#5d676c" stroke-dasharray="10 3 2 3"/>`;
    const y1 = delik ? 40 : 60, y2 = delik ? 140 : 120, xd = delik ? 300 : 470;
    return `<svg class="cizim" viewBox="0 0 ${W} ${H}" role="img" aria-label="Ölçülendirme">
      <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="#fff" stroke="#c9cec7"/>
      ${govde}
      <line x1="${xd}" y1="${y1}" x2="${xd}" y2="${y2}" stroke="#1f5f99" marker-start="url(#tl-a)" marker-end="url(#tl-a)"/>
      <defs><marker id="tl-a" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L10 5 L0 9 z" fill="#1f5f99"/></marker></defs>
      <text x="${xd + 8}" y="${(y1 + y2) / 2}" font-size="14" fill="#1f5f99" font-weight="700">${etiket}</text>
      <text x="${xd + 8 + etiket.length * 8.2}" y="${(y1 + y2) / 2 - 8}" font-size="10.5" fill="#1f5f99">${t(ust)}</text>
      <text x="${xd + 8 + etiket.length * 8.2}" y="${(y1 + y2) / 2 + 6}" font-size="10.5" fill="#1f5f99">${t(alt)}</text>
      <text x="20" y="${H - 12}" font-size="10.5" fill="#5d676c">${delik ? 'Delik (iç çap)' : 'Mil (dış çap)'} – teknik resimde gösterim</text>
    </svg>`;
  }

  // ---------- Arayüz ----------
  const mm = v => U().f(v / 1000, 3);
  const sg = v => (v > 0 ? '+' : v < 0 ? '−' : '') + U().f(Math.abs(v) / 1000, 3);
  // İşleme seviyesine göre tıklanabilir tolerans sınıfları
  const SEVIYE = [
    { ad: 'İnce işleme', it: 'IT5–IT7', yontem: 'taşlama, raybalama, hassas tornalama',
      delik: [['H6', 'çok hassas yuva'], ['H7', 'en yaygın delik'], ['G7', 'hassas kayar'], ['F7', 'yağlı yatak'], ['JS7', 'simetrik'], ['K7', 'ara geçme'], ['M7', 'sıkıca ara'], ['N7', 'hafif sıkı'], ['P7', 'pres'], ['R7', 'sıkı pres'], ['S7', 'çok sıkı pres']],
      mil: [['h6', 'hassas mil'], ['g6', 'kayar'], ['f6', 'hassas dönen'], ['js6', 'simetrik'], ['k6', 'rulman iç bilezik'], ['m6', 'sıkıca ara'], ['n6', 'hafif sıkı'], ['p6', 'pres'], ['r6', 'sıkı pres'], ['s6', 'çok sıkı pres'], ['h5', 'çok hassas']] },
    { ad: 'Orta işleme', it: 'IT8–IT10', yontem: 'normal tornalama, frezeleme',
      delik: [['H8', 'genel yatak'], ['H9', 'serbest yuva'], ['H10', 'genel'], ['F8', 'boşluklu yatak'], ['E8', 'geniş boşluk'], ['E9', 'geniş boşluk'], ['D9', 'çok boşluklu'], ['D10', 'çok boşluklu']],
      mil: [['h7', 'genel mil'], ['h8', 'genel'], ['h9', 'serbest mil'], ['f7', 'dönen mil'], ['f8', 'dönen mil'], ['e8', 'geniş boşluk'], ['e9', 'geniş boşluk'], ['d9', 'çok boşluklu']] },
    { ad: 'Kaba işleme', it: 'IT11–IT12', yontem: 'delme, kaba tornalama, sac',
      delik: [['H11', 'serbest delik'], ['H12', 'kaba delik'], ['D11', 'çok gevşek']],
      mil: [['h11', 'kaba mil'], ['h12', 'çekme çubuk'], ['d11', 'çok gevşek']] }
  ];
  function delikMilGirdi(s) {
    const { esc } = U();
    const delik = s.tTip === 'delik';
    const harfler = delik ? DELIK_HARF : MIL_HARF;
    const secili = (delik ? s.tHarf.toUpperCase() : s.tHarf.toLowerCase()) + s.tKalite;
    return `<div class="card"><h3>1 · Delik mi, mil mi?</h3>
      <div class="row-inline">
        <div class="seg" data-bind="tTip"><button data-v="delik">Delik (iç çap) – BÜYÜK harf</button><button data-v="mil">Mil (dış çap) – küçük harf</button></div>
        <label class="buyuk" style="max-width:220px">Nominal çap (mm)<input type="number" step="0.1" data-num="tCap"></label>
      </div>
      <h3 class="mt">2 · İşleme hassasiyetine göre toleransı seçin</h3>
      <div class="tsev">${SEVIYE.map((v, i) => `<div class="tsev-k s${i}">
        <div class="tsev-bas"><b>${v.ad}</b><span>${v.it} · ${esc(v.yontem)}</span></div>
        <div class="tsev-btn">${(delik ? v.delik : v.mil).map(([c, a]) => `<button class="${c === secili ? 'on' : ''}" data-tsinif="${c}" title="${esc(a)}"><b>${c}</b><small>${esc(a)}</small></button>`).join('')}</div>
      </div>`).join('')}</div>
      <details class="mt"><summary>Başka bir harf / kalite seç</summary>
        <div class="row4 mt">
          <label>Tolerans harfi<select data-sel="tHarf">${harfler.map(h => `<option value="${h}" ${h === s.tHarf ? 'selected' : ''}>${h}</option>`).join('')}</select></label>
          <label>Kalite (IT)<select data-sel="tKalite">${KALITE.map(k => `<option value="${k}" ${String(k) === String(s.tKalite) ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
          <div class="small" style="grid-column: span 2">Harf: tolerans bölgesinin <b>yeri</b>. Sayı: tolerans bölgesinin <b>genişliği</b>. ${delik ? 'H deliğin alt sınırı tam nominaldir.' : 'h milin üst sınırı tam nominaldir.'}</div>
        </div>
      </details>
    </div><div id="tolSonuc" class="sonuc"></div>`;
  }
  function delikMilSonuc(s) {
    const { esc, refs } = U();
    const delik = s.tTip === 'delik';
    const harf = delik ? s.tHarf.toUpperCase() : s.tHarf.toLowerCase();
    const k = +s.tKalite;
    const r = sapma(+s.tCap, harf, k);
    if (r.hata) return `<div class="card"><div class="warnbox">${esc(r.hata)}</div></div>`;
    const sinif = harf + k;
    const cap = +s.tCap;
    const isl = islemIcin(k);
    const tum = (delik ? ['H6', 'H7', 'H8', 'H9', 'H11', 'G7', 'F8', 'E9', 'JS7', 'K7', 'M7', 'N7', 'P7', 'S7'] : ['h6', 'h7', 'h9', 'h11', 'g6', 'f7', 'e8', 'd9', 'js6', 'k6', 'm6', 'n6', 'p6', 'r6', 's6'])
      .map(c => { const m = c.match(/^([A-Za-z]+)(\d+)$/); const x = sapma(cap, m[1], +m[2]); return { c, ...x }; }).filter(x => !x.hata);
    const not = `Ø${U().f(cap, cap % 1 ? 2 : 0)} ${sinif} (${sg(r.ust)} / ${sg(r.alt)})`;
    return `<div class="card">
      <div class="sonucbuyuk">Ø${U().f(cap, cap % 1 ? 2 : 0)} <b>${esc(sinif)}</b> → ${delik ? 'delik' : 'mil'} ölçüsü <b>${U().f(cap + r.alt / 1000, 3)}</b> ile <b>${U().f(cap + r.ust / 1000, 3)} mm</b> arasında olmalı.</div>
      <div class="kv">
        <div style="background:var(--accent-soft)"><b>${sg(r.ust)} mm</b><span>üst sapma (${delik ? 'ES' : 'es'})</span></div>
        <div style="background:var(--accent-soft)"><b>${sg(r.alt)} mm</b><span>alt sapma (${delik ? 'EI' : 'ei'})</span></div>
        <div><b>${mm(r.it)} mm</b><span>tolerans genişliği IT${k} (${r.it} µm)</span></div>
        <div><b>${U().f(cap + r.ust / 1000, 3)}</b><span>en büyük ölçü</span></div>
        <div><b>${U().f(cap + r.alt / 1000, 3)}</b><span>en küçük ölçü</span></div>
      </div>
      <div class="rule-govde mt" style="padding-left:0">
        <div>${parcaSvg(cap, sinif, r.ust, r.alt, delik)}${zonSvg([{ ad: sinif, ust: r.ust, alt: r.alt, renk: delik ? '#9fd3b0' : '#f0b48f' }], 'Tolerans bölgesi')}</div>
        <div>
          <p><b>Nasıl üretilir?</b> IT${k} tipik olarak: ${isl.length ? esc(isl.join(', ')) : 'özel yöntem'}.</p>
          <p class="small">Ölçü aralığı: ${ARALIK_AD[ind(cap)]} mm. Değerler ISO 286-1 temel sapma ve IT tablolarından hesaplanır.</p>
          <p class="small mt"><b>Teknik resimde yazılışı:</b></p>
          <pre class="notbox kisa" id="tolNot">${esc(not)}</pre>
          <button class="primary mt" data-kopya="tolNot">Kopyala</button>
          ${refs([['iso286', 'IT değerleri ve temel sapmalar.'], ['roymech286', 'Örnek hesap: Ø40 H7 = +25/0, g6 = −9/−25, 300 K7 = +16/−36.']])}
        </div>
      </div></div>
      <div class="card"><h3>Ø${U().f(cap, cap % 1 ? 2 : 0)} için sık kullanılan ${delik ? 'delik' : 'mil'} toleransları</h3>
        <table><thead><tr><th>Sınıf</th><th class="num">Üst</th><th class="num">Alt</th><th class="num">En büyük</th><th class="num">En küçük</th><th class="num">IT (mikron)</th></tr></thead><tbody>
        ${tum.map(x => `<tr class="${x.c === sinif ? 'best' : ''}"><td><b>${x.c}</b></td><td class="num">${sg(x.ust)}</td><td class="num">${sg(x.alt)}</td><td class="num">${U().f(cap + x.ust / 1000, 3)}</td><td class="num">${U().f(cap + x.alt / 1000, 3)}</td><td class="num">${x.it}</td></tr>`).join('')}
        </tbody></table></div>`;
  }

  function gecmeGirdi(s) {
    const { esc } = U();
    return `<div class="card"><h3>Geçme (delik + mil)</h3>
      <div class="row4">
        <label class="buyuk">Nominal çap (mm)<input type="number" step="0.1" data-num="gCap"></label>
        <label>Delik sınıfı<input type="text" data-txt="gDelik" value="${esc(s.gDelik)}"></label>
        <label>Mil sınıfı<input type="text" data-txt="gMil" value="${esc(s.gMil)}"></label>
        <div class="small">Sınıfı yazın (ör. H7, g6) veya aşağıdan hazır bir geçme seçin.</div>
      </div>
      <h3 class="mt">Yaygın geçmeler (delik esası)</h3>
      <div class="gecmeler">${GECME.map(x => `<button class="${x.d === s.gDelik && x.m === s.gMil ? 'on' : ''}" data-gecme="${x.d}/${x.m}"><b>${x.d}/${x.m}</b><span class="badge ${x.tip.startsWith('Boş') ? 'ok' : x.tip.startsWith('Sık') ? 'bad' : 'warn'}">${x.tip}</span><small>${esc(x.ad)}</small></button>`).join('')}</div>
    </div><div id="tolSonuc" class="sonuc"></div>`;
  }
  function gecmeSonuc(s) {
    const { esc, refs } = U();
    const ay = c => { const m = String(c).trim().match(/^([A-Za-z]{1,2})(\d{1,2})$/); return m ? { h: m[1], k: +m[2] } : null; };
    const D = ay(s.gDelik), M = ay(s.gMil);
    if (!D || !M) return `<div class="card"><div class="warnbox">Sınıfı harf + sayı olarak yazın (ör. H7 ve g6).</div></div>`;
    const dh = D.h.toUpperCase(), mh = M.h.toLowerCase();
    const rd = sapma(+s.gCap, dh, D.k), rm = sapma(+s.gCap, mh, M.k);
    if (rd.hata || rm.hata) return `<div class="card"><div class="warnbox">${esc(rd.hata || rm.hata)}</div></div>`;
    const bMax = rd.ust - rm.alt, bMin = rd.alt - rm.ust;
    const tip = bMin >= 0 ? ['Boşluklu geçme', 'ok', 'Her durumda boşluk kalır; parçalar elle veya kolay takılır.'] : bMax <= 0 ? ['Sıkı geçme (pres)', 'bad', 'Her durumda sıkılık vardır; pres veya ısıtma ile takılır.'] : ['Geçiş geçmesi', 'warn', 'Toleranslara göre hafif boşluk veya hafif sıkılık olabilir; tokmak/hafif pres.'];
    const bilinen = GECME.find(x => x.d === dh + D.k && x.m === mh + M.k);
    const fmt = v => v >= 0 ? `boşluk ${mm(v)} mm` : `sıkılık ${mm(-v)} mm`;
    return `<div class="card">
      <div class="karar ${tip[1] === 'ok' ? 'iyi' : tip[1] === 'bad' ? 'kotu' : 'dikkat'}"><span class="ikon">${tip[1] === 'ok' ? '↔' : tip[1] === 'bad' ? '⇥⇤' : '≈'}</span><div><b>Ø${U().f(+s.gCap, 0)} ${dh}${D.k}/${mh}${M.k} – ${tip[0]}</b>${tip[2]}</div></div>
      <div class="kv">
        ${bMin >= 0 ? `<div><b>${mm(bMin)} mm</b><span>en az boşluk (küçük delik + büyük mil)</span></div><div><b>${mm(bMax)} mm</b><span>en çok boşluk (büyük delik + küçük mil)</span></div>`
          : bMax <= 0 ? `<div><b>${mm(-bMax)} mm</b><span>en az sıkılık (büyük delik + küçük mil)</span></div><div><b>${mm(-bMin)} mm</b><span>en çok sıkılık (küçük delik + büyük mil)</span></div>`
          : `<div><b>${mm(bMax)} mm</b><span>en çok boşluk (büyük delik + küçük mil)</span></div><div><b>${mm(-bMin)} mm</b><span>en çok sıkılık (küçük delik + büyük mil)</span></div>`}
        <div><b>${sg(rd.ust)} / ${sg(rd.alt)}</b><span>delik ${dh}${D.k}</span></div>
        <div><b>${sg(rm.ust)} / ${sg(rm.alt)}</b><span>mil ${mh}${M.k}</span></div>
      </div>
      ${bilinen ? `<p class="mt"><b>${esc(bilinen.ad)}:</b> ${esc(bilinen.ne)}</p>` : ''}
      <div class="rule-govde mt" style="padding-left:0">${zonSvg([{ ad: 'Delik ' + dh + D.k, ust: rd.ust, alt: rd.alt, renk: '#9fd3b0' }, { ad: 'Mil ' + mh + M.k, ust: rm.ust, alt: rm.alt, renk: '#f0b48f' }], 'Geçme')}
        <div class="small"><p>Delik bölgesi mil bölgesinin tamamen üstündeyse <b>boşluklu</b>, tamamen altındaysa <b>sıkı</b>, örtüşüyorsa <b>geçiş</b> geçmesidir.</p>
          <p><b>Teknik resimde:</b> deliğe <code>Ø${U().f(+s.gCap, 0)} ${dh}${D.k}</code>, mile <code>Ø${U().f(+s.gCap, 0)} ${mh}${M.k}</code>; montaj resminde <code>Ø${U().f(+s.gCap, 0)} ${dh}${D.k}/${mh}${M.k}</code>.</p>
          ${refs([['iso286', 'Geçme sistemi ve tercih edilen geçmeler.'], ['roymech286', 'Geçme açıklamaları: kayar H7/g6, konumlama H7/h6, hafif geçiş H7/k6, pres H7/p6, s6.']])}</div></div>
    </div>`;
  }

  function genelGirdi(s) {
    return `<div class="card"><h3>Genel toleranslar – ISO 2768</h3>
      <p class="small">Teknik resimde ayrıca tolerans yazılmamış tüm ölçüler için antetteki tek bir notla geçerlidir (ör. <b>ISO 2768-mK</b>).</p>
      <div class="seg" data-bind="gelSinif">${['f', 'm', 'c', 'v'].map(k => `<button data-v="${k}">${SINIF_AD[k]}</button>`).join('')}</div>
      <p class="small mt" id="gelNe"></p>
      <div class="row4 mt"><label class="buyuk">Ölçü (mm)<input type="number" step="0.1" data-num="gelOlcu"></label>
        <label>Geometrik sınıf (ISO 2768-2)<select data-sel="gelGeo"><option value="H">H – hassas</option><option value="K">K – orta</option><option value="L">L – kaba</option></select></label></div>
    </div><div id="tolSonuc" class="sonuc"></div>`;
  }
  function genelSonuc(s) {
    const { f, esc, refs } = U();
    const k = s.gelSinif || 'm', o = +s.gelOlcu, gg = s.gelGeo || 'K';
    const i = G1_ARALIK.findIndex(([a, b]) => o >= a && o <= b);
    const tol = i >= 0 ? G1[k][i] : null;
    const ne = document.getElementById('gelNe'); if (ne) ne.textContent = SINIF_NE[k];
    const td = (v, sel) => `<td class="num ${sel ? 'hl' : ''}">${v == null ? '–' : '±' + f(v, v < 0.1 ? 2 : 1)}</td>`;
    return `<div class="card">
      <div class="sonucbuyuk">${o > 0 ? (tol != null ? `${f(o, o % 1 ? 1 : 0)} mm ölçü, ISO 2768-<b>${k}</b> ile <b>±${f(tol, tol < 0.1 ? 2 : 1)} mm</b> → ${f(o - tol, 2)} … ${f(o + tol, 2)} mm` : (i >= 0 ? 'Bu sınıfta bu ölçü aralığı için değer tanımlı değil.' : 'Ölçü 0,5–4000 mm aralığında olmalı.')) : ''}</div>
      <p class="small">Antet notu: <b>GENEL TOLERANSLAR ISO 2768-${k}${gg}</b></p>
      <h3 class="mt">Doğrusal ölçüler (± mm)</h3>
      <table><thead><tr><th>Sınıf</th>${G1_ARALIK.map(([a, b]) => `<th class="num">${f(a, a < 1 ? 1 : 0)}–${b}</th>`).join('')}</tr></thead><tbody>
      ${['f', 'm', 'c', 'v'].map(c => `<tr class="${c === k ? 'best' : ''}"><td><b>${SINIF_AD[c]}</b></td>${G1[c].map((v, j) => td(v, c === k && j === i)).join('')}</tr>`).join('')}</tbody></table>
      <div class="grid2 mt">
        <div><h3>Radyüs ve pah yüksekliği (± mm)</h3><table><thead><tr><th>Sınıf</th>${G1_RADYUS.aralik.map(a => `<th class="num">${a}</th>`).join('')}</tr></thead><tbody>
          <tr class="${k === 'f' || k === 'm' ? 'best' : ''}"><td>f, m</td>${G1_RADYUS.fm.map(v => `<td class="num">±${f(v, 1)}</td>`).join('')}</tr>
          <tr class="${k === 'c' || k === 'v' ? 'best' : ''}"><td>c, v</td>${G1_RADYUS.cv.map(v => `<td class="num">±${f(v, 1)}</td>`).join('')}</tr></tbody></table></div>
        <div><h3>Açılar (kısa kenar uzunluğuna göre, mm)</h3><table><thead><tr><th>Sınıf</th>${G1_ACI.aralik.map(a => `<th class="num">${a}</th>`).join('')}</tr></thead><tbody>
          ${['f', 'm', 'c', 'v'].map(c => `<tr class="${c === k ? 'best' : ''}"><td>${c}</td>${G1_ACI[c].map(v => `<td class="num">${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      </div>
      <h3 class="mt">ISO 2768-2 geometrik genel toleranslar (mm) – sınıf ${gg}</h3>
      <div class="grid2"><div><p class="small"><b>Doğrusallık ve düzlemsellik</b></p><table><thead><tr><th>Sınıf</th>${G2_DUZ.aralik.map(a => `<th class="num">${a}</th>`).join('')}</tr></thead><tbody>
        ${['H', 'K', 'L'].map(c => `<tr class="${c === gg ? 'best' : ''}"><td>${c}</td>${G2_DUZ[c].map(v => `<td class="num">${f(v, 2)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
        <div><p class="small"><b>Diklik</b> (kısa kenar) · <b>Simetri</b></p><table><thead><tr><th>Sınıf</th>${G2_DIK.aralik.map(a => `<th class="num">${a}</th>`).join('')}</tr></thead><tbody>
        ${['H', 'K', 'L'].map(c => `<tr class="${c === gg ? 'best' : ''}"><td>${c} diklik</td>${G2_DIK[c].map(v => `<td class="num">${f(v, 1)}</td>`).join('')}</tr><tr class="${c === gg ? 'best' : ''}"><td>${c} simetri</td>${G2_SIM[c].map(v => `<td class="num">${f(v, 1)}</td>`).join('')}</tr>`).join('')}</tbody></table>
        <p class="small mt">Dairesel salgı: H ${f(G2_SALGI.H, 1)} · K ${f(G2_SALGI.K, 1)} · L ${f(G2_SALGI.L, 1)} mm</p></div></div>
      <p class="small mt">ISO 2768-2 resmi olarak geri çekilmiştir (yerini ISO 22081 almıştır) ancak eski ve mevcut çizimlerde yaygın kullanılmaya devam etmektedir.</p>
      ${refs([['iso2768', 'Doğrusal, açı ve radyüs toleransları (ISO 2768-1).'], ['iso27682', 'H/K/L geometrik genel toleranslar.']])}
    </div>`;
  }

  function islemSekme() {
    const { esc, refs } = U();
    const W = 900, x0 = 300, w = (W - x0 - 20) / 13; // IT4..IT16
    const svg = `<svg class="cizim" style="max-width:900px" viewBox="0 0 ${W} ${ISLEM.length * 30 + 40}">
      ${Array.from({ length: 13 }, (_, i) => `<text x="${x0 + i * w + w / 2}" y="18" font-size="11" text-anchor="middle" fill="#5d676c">IT${i + 4}</text><line x1="${x0 + i * w}" y1="24" x2="${x0 + i * w}" y2="${ISLEM.length * 30 + 30}" stroke="#eef1ee"/>`).join('')}
      ${ISLEM.map((x, j) => `<text x="${x0 - 8}" y="${44 + j * 30}" font-size="12" text-anchor="end" fill="#1d2326">${esc(x.ad)}</text><rect x="${x0 + (x.a - 4) * w + 2}" y="${30 + j * 30}" width="${(x.b - x.a + 1) * w - 4}" height="20" rx="4" fill="${x.a <= 7 ? '#2f7d4f' : x.a <= 9 ? '#d9622b' : '#7d8b8f'}" opacity=".8"/>`).join('')}
    </svg>`;
    return `<div class="card"><h3>İşleme yöntemi ve ulaşılabilen tolerans kalitesi (IT)</h3>
      ${svg}
      <table class="mt"><thead><tr><th>Seviye</th><th>Tipik IT</th><th>Örnek</th></tr></thead><tbody>
        <tr><td><b>İnce işleme</b></td><td>IT5–IT7</td><td>Rulman yuvası, hassas mil (g6, h6, k6), H7 delik – taşlama, raybalama</td></tr>
        <tr><td><b>Orta işleme</b></td><td>IT8–IT10</td><td>Genel talaşlı işleme, H8/f7 yataklar, kaba konumlama</td></tr>
        <tr><td><b>Kaba işleme</b></td><td>IT11–IT13</td><td>Delme, serbest delikler, kaynaklı parçalar, sac</td></tr>
        <tr><td><b>Çok kaba</b></td><td>IT14 ve üstü</td><td>Döküm, dövme, oksijen kesim</td></tr></tbody></table>
      <p class="small mt">Kalite numarası 1 küçüldükçe tolerans yaklaşık 1,6 kat daralır ve maliyet belirgin şekilde artar: yalnızca fonksiyonun gerektirdiği yerde hassas tolerans verin.</p>
      ${refs([['roymech286', 'İşleme yöntemi ↔ IT kalitesi tablosu (yaklaşık).'], ['iso286', 'IT kaliteleri.']])}</div>`;
  }

  function sembolSekme() {
    const { esc, refs } = U();
    return `<div class="card"><h3>Geometrik tolerans sembolleri (ISO 1101) <span class="gelis">(geliştirme aşamasında)</span></h3>
      <table><thead><tr><th>Sembol</th><th>Adı</th><th>Grup</th><th>Ne kontrol eder?</th></tr></thead><tbody>
      ${SEMBOL.map(([sy, ad, gr, ne]) => `<tr><td class="sembol">${sy}</td><td><b>${esc(ad)}</b></td><td>${esc(gr)}</td><td class="small">${esc(ne)}</td></tr>`).join('')}</tbody></table>
      <p class="small mt">Form toleransları (doğrusallık, düzlemsellik, dairesellik, silindiriklik) referans istemez; yönelim, konum ve salgı toleransları bir referansa (A, B, C…) göre verilir.</p>
      ${refs([['iso1101', 'Geometrik tolerans sembolleri ve tolerans çerçevesi.']])}</div>`;
  }

  function render(yap) {
    const { $, S, syncControls } = U(); const s = S();
    const sek = s.tSekme || 'delikmil';
    const sonuc = () => sek === 'resim' ? g.TRESIM.sonuc(s) : sek === 'delikmil' ? delikMilSonuc(s) : sek === 'gecme' ? gecmeSonuc(s) : sek === 'genel' ? genelSonuc(s) : '';
    if (!yap && $('#modulAlan .tmodul') && $('#tolSonuc')) { $('#tolSonuc').innerHTML = sonuc(); return; }
    $('#modulAlan').innerHTML = `<div class="tmodul">
      <div class="modbaslik"><button class="ghost" data-modul-git="ana">← Ana menü</button><h2>Geometrik toleranslandırma <span class="gelis">(geliştirme aşamasında)</span></h2></div>
      <div class="seg wrap" data-bind="tSekme"><button data-v="delikmil">Delik / mil toleransı</button><button data-v="gecme">Geçme hesabı</button><button data-v="resim">Örnek teknik resim (GD&amp;T)</button><button data-v="genel">Genel toleranslar (ince / orta / kaba)</button><button data-v="islem">İşleme yöntemi ve IT</button><button data-v="sembol">GD&amp;T sembolleri</button><button data-v="egitim">📘 Eğitim</button></div>
      <div class="mt">${sek === 'egitim' ? g.EGITIM.html('tolerans') : sek === 'resim' ? g.TRESIM.girdi(s) : sek === 'delikmil' ? delikMilGirdi(s) : sek === 'gecme' ? gecmeGirdi(s) : sek === 'genel' ? genelGirdi(s) : sek === 'islem' ? islemSekme() : sembolSekme()}</div>
    </div>`;
    syncControls();
    const el = $('#tolSonuc'); if (el) el.innerHTML = sonuc();
  }

  // Etkileşimler
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-tsinif]');
    if (b) { const S = U().S(); const m = b.dataset.tsinif.match(/^([A-Za-z]+)(\d+)$/); S.tHarf = m[1]; S.tKalite = m[2]; U().changed(true); }
    const gb = e.target.closest('[data-gecme]');
    if (gb) { const S = U().S(); const [d, m] = gb.dataset.gecme.split('/'); S.gDelik = d; S.gMil = m; U().changed(true); }
  });
  document.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset && el.dataset.txt) { U().S()[el.dataset.txt] = el.value; U().changed(false); }
  });

  const itDeger = (cap, k) => { const i = ind(cap); return (IT[k] || [])[i < 0 ? ARALIK.length - 1 : i]; };
  g.TOL = { render, sapma, itDeger };
})(window);
