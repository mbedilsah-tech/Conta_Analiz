// Conta Analiz – hesap motoru (DOM'dan bağımsız; Node ile test edilebilir)
(function (g) {
  const D = g.DATA || (typeof require !== 'undefined' ? require('./data.js') : null);
  const AS = g.AS568 || (typeof require !== 'undefined' ? require('./as568.js').AS568 : []);

  const PI = Math.PI;
  const r2 = x => Math.round(x * 100) / 100;
  const r05 = x => Math.round(x * 20) / 20;           // 0,05 mm'ye yuvarla
  const r05up = x => Math.ceil(x * 20 - 1e-9) / 20;   // 0,05 mm'ye yukarı yuvarla
  const pct = x => (x * 100).toFixed(1).replace('.', ',') + ' %';

  // ---- Kesit alanı ----
  function kesitAlan(sekil, t, w, s) {
    switch (sekil) {
      case 'oring':
      case 'yuvarlak': return PI * t * t / 4;
      case 'D': { // düz taban + yuvarlatılmış üst; t = yükseklik, w = genişlik
        const r = Math.min(w / 2, t);
        return w * t - (2 - PI / 2) * r * r;
      }
      case 'tup': { // t = dış çap, s = et kalınlığı
        const di = Math.max(0, t - 2 * s);
        return PI / 4 * (t * t - di * di);
      }
      default: return t * w; // duz, sunger
    }
  }

  function bantAnahtari(sekil, emi) {
    if (sekil === 'oring') return emi ? 'oring_emi' : 'oring';
    if (sekil === 'sunger') return 'sunger';
    const k = sekil + (emi ? '_emi' : '');
    return D.SIKISTIRMA[k] ? k : sekil;
  }

  // ---- Conta ölçüsünden kanal ölçüsü ----
  // p: {sekil, t, w, s, tTol, wTol, g, hTol, bTol, emi, kanalda, seviyeler}
  function contadanKanal(p) {
    const key = bantAnahtari(p.sekil, p.emi);
    const B = D.SIKISTIRMA[key];
    const sev = p.seviyeler && p.seviyeler.length === 3 ? p.seviyeler : B.sev;
    const g0 = p.g || 0, hTol = p.hTol ?? 0.05, bTol = p.bTol ?? 0.10, tTol = p.tTol ?? 0.08;
    const w = (p.sekil === 'oring' || p.sekil === 'yuvarlak' || p.sekil === 'tup') ? p.t : (p.w || p.t);
    const wTol = p.wTol ?? tTol;
    const A = kesitAlan(p.sekil, p.t, w, p.s);
    const Amax = kesitAlan(p.sekil, p.t + tTol, w + wTol, p.s);
    const kanalda = p.kanalda !== false;

    const satirlar = sev.map((c, i) => {
      const H = p.t * (1 - c);                // sıkışmış yükseklik = kanal derinliği + flanş boşluğu
      let h = r05(H - g0);                    // tezgâh ölçüsü (0,05 mm)
      const Hn = h + g0;
      let b = null, dolNom = null, dolMaks = null;
      const u = [];
      if (kanalda) {
        let bReq = A / (B.dolHedef * Hn);
        // Yanal genişleme payı: sıkışınca genişleyen kesit kanal duvarına basmamalı
        const yanal = (p.sekil === 'duz' || p.sekil === 'D') ? w / (1 - c) * 1.05 : w * 1.05;
        bReq = Math.max(bReq, yanal);
        b = r05up(bReq);
        dolNom = A / (Hn * b);
        dolMaks = Amax / ((Hn - hTol) * b);   // en kötü: büyük conta, sığ ve dar kanal
        if (dolMaks > B.dolMaks) u.push(`En kötü tolerans durumunda kanal doluluğu ${pct(dolMaks)} > ${pct(B.dolMaks)} sınırı – kanalı genişletin.`);
      }
      const cMax = ((p.t + tTol) - (Hn - hTol)) / (p.t + tTol);
      const cMin = ((p.t - tTol) - (Hn + hTol)) / (p.t - tTol);
      if (cMin < B.bant[0]) u.push(`En kötü durumda sıkıştırma ${pct(cMin)} – alt sınır ${pct(B.bant[0])} altında; sızdırma riski.`);
      if (cMax > B.bant[1]) u.push(`En kötü durumda sıkıştırma ${pct(cMax)} – üst sınır ${pct(B.bant[1])} üstünde; kalıcı deformasyon/çatlama riski.`);
      if (h <= 0) u.push('Hesaplanan kanal derinliği ≤ 0: flanş boşluğu (g) çok büyük.');
      if (i === 1 && (cMax - cMin) > (B.bant[1] - B.bant[0])) u.push(`Tolerans zinciri (${pct(cMax - cMin)}) izin verilen sıkıştırma penceresinden (${pct(B.bant[1] - B.bant[0])}) geniş: daha büyük kesit veya daha dar conta/kanal toleransı seçin.`);
      return { seviye: D.SEVIYE_AD[i], c, H: r2(Hn), h: r2(h), b: b && r2(b), dolNom, dolMaks, cMin, cMax, uyarilar: u };
    });
    return { anahtar: key, bant: B, alan: A, satirlar, kanalda };
  }

  // ---- Kanal ölçüsünden O-ring kesiti ----
  // p: {h, b, g, hTol, emi}
  function kanaldanOring(p) {
    const B = D.SIKISTIRMA[p.emi ? 'oring_emi' : 'oring'];
    const H = p.h + (p.g || 0), hTol = p.hTol ?? 0.05;
    const hedef = B.sev[1];
    const list = D.CS_LISTE.map(cs => {
      const c = (cs.d - H) / cs.d;
      const dol = (PI * cs.d * cs.d / 4) / (H * p.b);
      const dolMaks = (PI * (cs.d + cs.tol) ** 2 / 4) / ((H - hTol) * p.b);
      const cMax = ((cs.d + cs.tol) - (H - hTol)) / (cs.d + cs.tol);
      const cMin = ((cs.d - cs.tol) - (H + hTol)) / (cs.d - cs.tol);
      const uygun = cMin >= B.bant[0] && cMax <= B.bant[1] && dolMaks <= B.dolMaks;
      const skor = Math.abs(c - hedef) + (uygun ? 0 : 1) + Math.max(0, dolMaks - B.dolMaks) * 2;
      return { ...cs, c, dol, dolMaks, cMin, cMax, uygun, skor };
    }).filter(x => x.c > 0 && x.c < 0.5).sort((a, b) => a.skor - b.skor);
    return { bant: B, H, list };
  }

  // ---- Kanal ölçüsünden gasket kalınlığı ----
  // p: {sekil, h, b, g, w, s, emi, kanalda}
  function kanaldanConta(p) {
    const key = bantAnahtari(p.sekil, p.emi);
    const B = D.SIKISTIRMA[key];
    const H = p.h + (p.g || 0);
    const kanalda = p.kanalda !== false;
    const satirlar = B.sev.map((c, i) => {
      const t = H / (1 - c);
      const w = (p.sekil === 'yuvarlak' || p.sekil === 'tup') ? t : (p.w || (kanalda ? p.b * 0.6 : t * 3));
      const A = kesitAlan(p.sekil, t, w, p.s || Math.max(0.5, t * 0.2));
      const dol = kanalda && p.b ? A / (H * p.b) : null;
      const u = [];
      if (dol != null && dol > B.dolMaks) u.push(`Kanal doluluğu ${pct(dol)} > ${pct(B.dolMaks)} – daha dar conta veya daha geniş kanal gerekir.`);
      if (kanalda && (p.sekil === 'duz' || p.sekil === 'D') && w / (1 - c) > p.b) u.push('Sıkışınca yanal genişleyen conta kanal duvarına dayanır – conta genişliğini azaltın.');
      return { seviye: D.SEVIYE_AD[i], c, t: r2(t), tStok: stokKalinlik(t, p.sekil), w: r2(w), dol, uyarilar: u };
    });
    return { anahtar: key, bant: B, H, satirlar, kanalda };
  }

  // Levha/profil için piyasada yaygın kalınlıklar
  function stokKalinlik(t, sekil) {
    const stok = sekil === 'sunger' ? [1.5, 2, 3, 4, 5, 6, 8, 10] : [0.5, 0.8, 1, 1.5, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10];
    let best = stok[0];
    for (const s of stok) if (Math.abs(s - t) < Math.abs(best - t)) best = s;
    return best;
  }

  // ---- O-ring çapı / kanal çapı ----
  // yon: 'ic' = iç basınç (O-ring kanal dış çapına yaslanır), 'dis' = dış basınç / vakum (kanal iç çapına yaslanır)
  function oringdenKanalCap(ID, d, b, yon) {
    const OD = ID + 2 * d;
    if (yon === 'dis') {
      const gID = r05(ID * 1.02);
      return { yon, OD: r2(OD), kanalIc: r2(gID), kanalDis: r2(gID + 2 * b), gerilme: (gID - ID) / ID, aciklama: 'O-ring iç çapı kanal iç çapına ~%2 gerdirilerek oturur (öneri %1–5).' };
    }
    const gOD = r05(OD / 1.02);
    return { yon, OD: r2(OD), kanalDis: r2(gOD), kanalIc: r2(gOD - 2 * b), cevreSikisma: (OD - gOD) / gOD, aciklama: 'O-ring dış çapı kanal dış çapından ~%2 büyük seçilir, montajda dış duvara yaslanır (öneri %1–3).' };
  }

  function kanalCapindanOring(kanalCap, d, yon) {
    const hedefID = yon === 'dis' ? kanalCap / 1.02 : kanalCap * 1.02 - 2 * d;
    const ayni = AS.filter(x => Math.abs(x.cs - d) < 0.03);
    let enIyi = null;
    for (const x of ayni) {
      let oran, ok;
      if (yon === 'dis') { oran = (kanalCap - x.id) / x.id; ok = oran >= 0.005 && oran <= 0.05; }
      else { oran = (x.id + 2 * x.cs - kanalCap) / kanalCap; ok = oran >= 0.005 && oran <= 0.035; }
      const skor = Math.abs(oran - 0.02) + (ok ? 0 : 1);
      if (!enIyi || skor < enIyi.skor) enIyi = { ...x, oran, ok, skor };
    }
    return { hedefID: r2(hedefID), as568: enIyi };
  }

  function as568Bul(dash) {
    const norm = '-' + String(dash).replace(/\D/g, '').padStart(3, '0');
    return AS.find(x => x.dash === norm) || null;
  }

  // ---- Shore A önerisi ----
  // P: bar, kapakZayif: düşük sıkma kuvveti (plastik/ince kapak), bosluk: metal-metal temas yoksa ekstrüzyon boşluğu (mm)
  function shoreOneri(mat, P, kapakZayif, bosluk) {
    const sec = [];
    const var_ = s => !mat || mat.shore.includes(s) || mat.emi;
    if (mat && mat.emi) {
      sec.push({ shore: mat.shore[0], neden: 'İletken elastomerler belirli sertlikte üretilir; malzeme veri sayfasındaki değer kullanılır.' });
      if (mat.shore[1]) sec.push({ shore: mat.shore[1], neden: 'Alternatif sertlik (daha yüksek basınç/aşınma için).' });
      return sec;
    }
    const gap = bosluk ?? 0;
    if (kapakZayif) {
      if (var_(50)) sec.push({ shore: 50, neden: 'Düşük sıkma kuvveti – ince/plastik kapakta eğilmeyi azaltır.' });
      if (var_(60)) sec.push({ shore: 60, neden: 'Düşük kuvvet ile makul ekstrüzyon dayanımının dengesi.' });
      sec.push({ shore: 70, neden: 'Standart; kapak yeterince rijitse tercih edin (stok bulunurluğu en yüksek).' });
    } else if (P <= 50) {
      sec.push({ shore: 70, neden: 'Statik uygulamaların büyük çoğunluğu için standart; en kolay bulunan sertlik.' });
      if (var_(80) || var_(75)) sec.push({ shore: mat && mat.shore.includes(75) ? 75 : 80, neden: 'Biraz daha yüksek ekstrüzyon ve basınç dayanımı.' });
      if (var_(60)) sec.push({ shore: 60, neden: 'Düşük sıkma kuvveti veya pürüzlü yüzey gerekiyorsa.' });
    } else if (P <= 100) {
      sec.push({ shore: 80, neden: '50–100 bar aralığında ekstrüzyona karşı daha güvenli.' });
      sec.push({ shore: 90, neden: 'Boşluk ' + (gap > 0.1 ? 'büyükse' : 'kontrol edilemiyorsa') + ' ek güvenlik.' });
      sec.push({ shore: 70, neden: 'Metal-metal temas (boşluk ≈ 0) sağlanıyorsa yeterli olabilir.' });
    } else {
      sec.push({ shore: 90, neden: '> 100 bar: yüksek sertlik ve/veya PTFE destek halkası.' });
      sec.push({ shore: 70, neden: '70 Shore + PTFE destek halkası (back-up ring) alternatifi.' });
      sec.push({ shore: 80, neden: 'Ara çözüm; boşluğu ≤ 0,05 mm tutun.' });
    }
    return sec;
  }

  // ---- Malzeme sıralama ----
  // siralama: 'bul' (piyasada bulunurluk), 'uyum' (ortam uyumu), 'maliyet'
  function malzemeSirala(Tmin, Tmax, ortamlar, emi, siralama) {
    return D.MALZEMELER.filter(m => !!m.emi === !!emi).map(m => {
      const sebep = [];
      if (Tmin < m.tmin) sebep.push(`Min. sıcaklık ${Tmin} °C < malzeme alt sınırı ${m.tmin} °C`);
      if (Tmax > m.tKisa) sebep.push(`Maks. sıcaklık ${Tmax} °C > malzeme kısa süreli sınırı ${m.tKisa} °C`);
      let uyum = 3; const zayif = [];
      for (const o of ortamlar) {
        const v = m.ortam[o];
        uyum = Math.min(uyum, v);
        const ad = (D.ORTAMLAR.find(x => x.k === o) || {}).ad;
        if (v === 0) sebep.push(`${ad}: uygun değil`);
        else if (v === 1) zayif.push(`${ad}: sınırlı – test edin`);
      }
      const sicaklikSinir = Tmax > m.tmax && Tmax <= m.tKisa;
      if (sicaklikSinir) zayif.push(`${Tmax} °C sürekli sınırın (${m.tmax} °C) üstünde, yalnızca kısa süreli`);
      const uygun = sebep.length === 0;
      // Sıralama: önce uygunluk, sonra piyasada bulunurluk, sonra uyum, sonra maliyet
      const w = siralama === 'uyum' ? [100, 10, 2] : siralama === 'maliyet' ? [10, 10, 100] : [60, 50, 5];
      const skor = (uygun ? 10000 : 0) + uyum * w[0] + m.bul * w[1] - m.mal * w[2] - (sicaklikSinir ? 40 : 0);
      return { m, uygun, uyum, sebep, zayif, skor };
    }).sort((a, b) => b.skor - a.skor);
  }

  // ---- Yapıştırıcı sıralama ----
  function yapistiriciSirala(contaKod, emiMi, yuzey, iletkenGerekli, Tmax) {
    const anahtar = emiMi ? 'EMI' : contaKod;
    return D.YAPISTIRICILAR.map(a => {
      const u = a.uyum[anahtar] ?? 0, y = a.yuzey[yuzey] ?? 0;
      const sebep = [];
      if (u === 0) sebep.push('Bu conta malzemesine yapışmaz');
      if (y === 0) sebep.push('Bu yüzeye uygun değil');
      if (Tmax > a.tmax) sebep.push(`Sıcaklık sınırı ${a.tmax} °C`);
      if (iletkenGerekli && !a.iletken) sebep.push('Elektriksel iletkenlik sağlamaz');
      const uygun = sebep.length === 0;
      const skor = (uygun ? 1000 : 0) + Math.min(u, y) * 100 + a.bul * 10 + (iletkenGerekli && a.iletken ? 50 : 0);
      return { a, u, y, uygun, sebep, skor };
    }).sort((x, z) => z.skor - x.skor);
  }

  // ---- Cıvata / kanal yerleşimi ----
  // p: {M, d (conta kesiti), b (kanal genişliği), kanalli, metalTemas, plastik, emi, fGHz, cevre}
  function civataKurallari(p) {
    const db = parseInt(String(p.M).replace(/\D/g, ''), 10);
    const delik = D.DELIK[p.M] || db * 1.1;
    const eMin = p.plastik ? Math.max(3.0, 1.5 * p.d) : Math.max(2.0, p.d);
    const eksen = delik / 2 + eMin + (p.b || p.d * 1.4) / 2;
    const rondela = 2 * db;
    let pMin, pMax, aciklama;
    if (p.kanalli && p.metalTemas) { pMin = 6 * db; pMax = 10 * db; aciklama = 'Kanallı conta + metal-metal temas: cıvatalar flanşı temasta tutmak için; conta sıkışması kanal derinliğiyle sınırlı.'; }
    else if (p.kanalli) { pMin = 5 * db; pMax = 8 * db; aciklama = 'Kanallı conta, temas yok: flanş eğilmesi sıkıştırmayı değiştirir, aralığı sıklaştırın.'; }
    else { pMin = 4 * db; pMax = 6 * db; aciklama = 'Kanalsız düz/sünger conta: sıkıştırma tamamen cıvata kuvvetine bağlı; düzgün baskı için sık cıvata.'; }
    if (p.plastik) { pMin *= 0.7; pMax *= 0.7; aciklama += ' Plastik kapak: aralık ~%30 azaltıldı; cıvata deliklerine metal burç (compression limiter) koyun.'; }
    let pEmi = null;
    if (p.emi) { pMin *= 0.75; pMax *= 0.75; aciklama += ' EMI: cıvatalar arası kapak eğilmesi iletken temasın kopmaması için sınırlı olmalı; aralık ~%25 sıklaştırıldı.'; }
    if (p.emi && p.fGHz > 0) pEmi = (300 / p.fGHz) / 20; // λ/20, mm – contasız açıklık için temkinli sınır
    const pOneri = pMax;
    const adet = p.cevre ? Math.ceil(p.cevre / pOneri) : null;
    return {
      db, delik, eMin: r2(eMin), eksen: r2(eksen), rondela,
      kenarMin: r2(1.5 * db), kenarTercih: r2(2 * db),
      pMin: r2(pMin), pMax: r2(pMax), pEmi: pEmi && r2(pEmi), pOneri: r2(pOneri), adet, aciklama,
      kose: p.d ? { min: r2(3 * p.d), tercih: r2(6 * p.d) } : null
    };
  }

  // ---- ASTM D2000 kodu ----
  function d2000Kod(o) {
    if (!o) return '';
    const s = `M${o.grade}${o.type}${o.cls}${o.sert}${String(o.ceki).padStart(2, '0')}`;
    return ('ASTM D2000 ' + s + (o.ek ? ' ' + o.ek.trim() : '')).trim();
  }
  function d2000Acikla(o) {
    if (!o) return '';
    return `M = metrik birim, Grade ${o.grade}; Tip ${o.type} = ${D.D2000_TIP[o.type]} °C ısıl yaşlandırma; Sınıf ${o.cls} = IRM 903 yağında hacimsel şişme ${D.D2000_SINIF[o.cls]}; sertlik ${o.sert * 10} ± 5 Shore A; min. çekme dayanımı ${parseInt(o.ceki, 10)} MPa.`;
  }

  const out = { kesitAlan, contadanKanal, kanaldanOring, kanaldanConta, oringdenKanalCap, kanalCapindanOring, as568Bul, shoreOneri, malzemeSirala, yapistiriciSirala, civataKurallari, d2000Kod, d2000Acikla, pct, r2 };
  g.CALC = out;
  if (typeof module !== 'undefined') module.exports = out;
})(typeof window !== 'undefined' ? window : globalThis);
