// Conta Analiz – Kaplama spesifikasyonu sınıflandırmaları (Tip / Class / Method / SC)
// ve ASTM / UNS / EN malzeme kod çözücü.
// Değerler ilgili standartların özetidir; kesin sipariş/çizim için güncel revizyonu doğrulayın.
(function (g) {
  const U = () => g.UI;

  // ---------- Referanslar ----------
  const REF3 = {
    ams2700: { kisa: 'AMS 2700', ad: 'SAE AMS 2700 – Korozyona dayanıklı çeliklerin pasivasyonu. Method 1: nitrik asit (Type 1–8); Method 2: sitrik asit (Type yok).', url: 'https://advancedplatingtech.com/?p=81' },
    a967: { kisa: 'ASTM A967', ad: 'ASTM A967/A967M – Paslanmaz çelik parçalar için kimyasal pasivasyon işlemleri: Nitric 1–5, Citric 1–5, elektrokimyasal.', url: 'https://advancedplatingtech.com/?p=4819' },
    b633: { kisa: 'ASTM B633', ad: 'ASTM B633 – Demir ve çelik üzerine elektrolitik çinko kaplama: SC1–SC4 (Fe/Zn 5, 8, 12, 25 µm), Type I–VI (son işlem).', url: 'https://www.boltport.com.ferrobend.com/specifications/astm' },
    b733: { kisa: 'ASTM B733', ad: 'ASTM B733 – Akımsız (otokatalitik) nikel-fosfor kaplama: Type I–V (P içeriği), SC0–SC4 (kalınlık), Class 1–6 (ısıl işlem).', url: 'https://advancedplatingtech.com/?p=69' },
    mil13924s: { kisa: 'MIL-DTL-13924', ad: 'MIL-DTL-13924 – Demir esaslı metallerde siyah oksit kaplama, Class 1–4 (Class 1: karbon / düşük alaşımlı çelik ve dökme demir; diğerleri paslanmaz çelikler için).', url: 'https://standards.globalspec.com/std/13052324/mil-dtl-13924' },
    astmListe: { kisa: 'ASTM paslanmaz listesi', ad: 'Total Materia – ASTM paslanmaz çelik standartları listesi (A240 levha, A276 çubuk, A479 basınçlı kap çubuğu, A564 çökelme sertleşmeli çubuk, A582 otomat çubuk…)', url: 'https://www.totalmateria.com/articles/astm-standard-list-stainless-steels/' },
    a645: { kisa: 'ASTM A645/A645M', ad: 'ASTM A645/A645M – Basınçlı kap levhaları, %5 ve %5½ nikelli alaşımlı çelikler, özel ısıl işlemli; düşük / kriyojenik sıcaklık kaynaklı basınçlı kaplar için, Grade A ve B. Güncel: A645/A645M-10(2022).', url: 'https://webstore.ansi.org/' },
    a681: { kisa: 'ASTM A681', ad: 'ASTM A681 – Alaşımlı takım çelikleri (D2 = UNS T30402, H13 = UNS T20813 …)', url: 'https://www.carpentertechnology.com/alloy-finder/D2' },
    dokmeEsd: { kisa: 'Dökme demir eşdeğerleri', ad: 'ASTM A48 ↔ EN 1561 (Class 30 ≈ EN-GJL-200) ve ASTM A536 ↔ EN 1563 eşdeğer tabloları; kaynaklar arasında küçük farklar vardır.', url: 'https://gfmco.com/wp-content/uploads/2021/07/Goldens-Guide-3-Ductile-Iron-Grades.pdf' },
    takimEsd: { kisa: 'Takım çeliği eşdeğerleri', ad: 'Takım çeliği karşılıkları: H13 = 1.2344 X40CrMoV5-1, P20 = 1.2311 40CrMnMo7, D2 = 1.2379', url: 'https://www.westyorkssteel.com/steel-specifications/international-standards/tool-steel/' }
  };

  // ---------- Kaplama spesifikasyonları ----------
  // op: [değer, etiket, açıklama]
  const SPEC = {
    mil5541: {
      ad: 'MIL-DTL-5541', ref: 'mil5541b',
      alan: [
        { k: 'tip', ad: 'Tip', op: [['I', 'Tip I', 'Altı değerlikli krom (Cr6) içerir; altın-sarı renk. RoHS/REACH kısıtlıdır, sivil ürünlerde kullanmayın.'], ['II', 'Tip II', 'Cr6 içermez (şeffaf / açık mavi-gri). Yeni tasarımlarda tercih edilen.']] },
        { k: 'cls', ad: 'Class', op: [['1A', 'Class 1A', 'En yüksek korozyon koruması; boyasız kullanım veya boya altı. Düşük elektrik direnci garanti edilmez.'], ['3', 'Class 3', 'Düşük elektrik temas direnci garanti edilir (EMI conta, topraklama yüzeyi). Korozyon koruması 1A’dan düşüktür.']] }
      ],
      not: (v, en) => en
        ? `FINISH: CHEMICAL CONVERSION COAT PER MIL-DTL-5541, TYPE ${v.tip}, CLASS ${v.cls}${v.tip === 'II' ? ' (NON-HEXAVALENT CHROMIUM)' : ''}.`
        : `YÜZEY İŞLEMİ: MIL-DTL-5541 TİP ${v.tip} CLASS ${v.cls} KİMYASAL DÖNÜŞÜM KAPLAMA${v.tip === 'II' ? ' (Cr6 İÇERMEZ)' : ''}.`,
      uyari: v => [v.tip === 'I' && 'Tip I altı değerlikli krom içerir: RoHS ve REACH kapsamında kısıtlıdır.']
    },
    mil8625: {
      ad: 'MIL-PRF-8625', ref: 'mil8625',
      alan: [
        { k: 'tip', ad: 'Tip', op: [
          ['I', 'Tip I', 'Kromik asit eloksal (ince, ~0,5–7,5 µm). Cr6 içerir. Yorulma açısından kritik parçalarda kullanılırdı.'],
          ['IB', 'Tip IB', 'Kromik asit eloksal, düşük voltaj prosesi. Cr6 içerir.'],
          ['IC', 'Tip IC', 'Kromik olmayan ince eloksal; Tip I/IB yerine (Cr6’sız alternatif).'],
          ['II', 'Tip II', 'Sülfürik asit eloksal (tipik 10–25 µm). Genel koruyucu / dekoratif eloksal.'],
          ['IIB', 'Tip IIB', 'İnce sülfürik asit eloksal; Tip I/IB yerine Cr6’sız alternatif.'],
          ['III', 'Tip III', 'Sert eloksal (tipik 50 µm). Aşınma direnci; kalınlığın ~yarısı dışa büyür.']] },
        { k: 'cls', ad: 'Class', op: [['1', 'Class 1', 'Boyasız (doğal renk).'], ['2', 'Class 2', 'Boyalı (renkli / siyah).']] },
        { k: 'renk', ad: 'Renk', kosul: v => v.cls === '2', op: [['siyah', 'Siyah', 'En yaygın boyalı eloksal rengi.'], ['diger', 'Diğer', 'Çizimde renk/numune belirtin (ör. FED-STD-595 veya RAL yaklaşığı).']] },
        { k: 'seal', ad: 'Sızdırmazlık (seal)', op: [['std', 'Standart gereği', 'Tip I, IB, IC, II, IIB: aksi belirtilmedikçe sızdırmazlık yapılır. Tip III: aksi belirtilmedikçe yapılmaz.'], ['evet', 'Seal yapılsın', 'Korozyon direnci artar; sert eloksalde aşınma direnci biraz düşer.'], ['hayir', 'Seal yapılmasın', 'Yapıştırma / boya altı için. Tip II’de çizimde açıkça yazılmalıdır.']] }
      ],
      not: (v, en) => {
        const sert = v.tip === 'III';
        const kal = v.tip === 'II' ? '10–15 µm' : sert ? '50 ±10 µm' : '';
        const renk = v.cls === '2' ? (v.renk === 'siyah' ? (en ? 'BLACK' : 'SİYAH') : (en ? 'COLOR ____' : 'RENK ____')) : '';
        const seal = v.seal === 'evet' || (v.seal === 'std' && !sert) ? (en ? 'SEALED' : 'SIZDIRMAZLIK (SEAL) UYGULANACAKTIR')
          : v.seal === 'hayir' ? (en ? 'DO NOT SEAL' : 'SIZDIRMAZLIK (SEAL) UYGULANMAYACAKTIR') : '';
        const p = [en ? `FINISH: ${sert ? 'HARD ' : ''}ANODIZE PER MIL-PRF-8625, TYPE ${v.tip}, CLASS ${v.cls}` : `YÜZEY İŞLEMİ: MIL-PRF-8625 TİP ${v.tip} CLASS ${v.cls} ${sert ? 'SERT ELOKSAL' : 'ELOKSAL'}`, renk, kal, seal].filter(Boolean);
        return p.join(', ') + '.' + (sert ? (en ? ' DIMENSIONS APPLY AFTER COATING.' : ' ÖLÇÜLER KAPLAMA SONRASI İÇİNDİR.') : '');
      },
      uyari: v => [
        (v.tip === 'I' || v.tip === 'IB') && 'Tip I / IB kromik asit kullanır (Cr6): RoHS / REACH kısıtlıdır; Cr6’sız alternatif Tip IC veya IIB.',
        (v.tip === 'I' || v.tip === 'IB') && 'Tip I, %5’ten fazla bakır veya %7’den fazla silisyum içeren alaşımlarda (ör. 2011, 2024, bazı döküm alaşımları) uygulanmaz.',
        v.tip === 'III' && v.cls === '2' && 'Sert eloksalde boyama sınırlıdır (çoğunlukla siyah); renk tonu tutarlı olmaz.',
        v.tip === 'III' && 'Sert eloksal yorulma dayanımını düşürür; dişleri ve hassas geçme yüzeylerini maskeleyin.',
        v.tip === 'II' && v.seal === 'hayir' && 'Tip II’de sızdırmazlık standart gereğidir; yapılmayacaksa çizimde açıkça belirtilmelidir (yapıldı).'
      ]
    },
    b733: {
      ad: 'ASTM B733', ref: 'b733',
      alan: [
        { k: 'tip', ad: 'Tip (fosfor oranı)', op: [['I', 'Tip I', 'Fosfor oranı şartı yok.'], ['II', 'Tip II', '%1–3 P (düşük fosfor): yüksek sertlik, lehimlenebilir.'], ['III', 'Tip III', '%2–4 P (düşük fosfor).'], ['IV', 'Tip IV', '%5–9 P (orta fosfor): genel amaçlı, en yaygın.'], ['V', 'Tip V', '≥ %10 P (yüksek fosfor): en iyi korozyon direnci, kaplanmış hâlde manyetik değil.']] },
        { k: 'sc', ad: 'Hizmet şartı (kalınlık)', op: [['SC0', 'SC0', 'En az 0,1 µm – yalnızca lehim / bağ için.'], ['SC1', 'SC1', 'Hafif hizmet, en az 5 µm.'], ['SC2', 'SC2', 'Ilımlı hizmet, en az 13 µm.'], ['SC3', 'SC3', 'Orta hizmet, en az 25 µm.'], ['SC4', 'SC4', 'Ağır hizmet, en az 75 µm.']] },
        { k: 'cls', ad: 'Class (ısıl işlem)', op: [['1', 'Class 1', 'Kaplanmış hâlde, ısıl işlem yok.'], ['2', 'Class 2', '260–400 °C: en az 850 HK100 sertlik.'], ['3', 'Class 3', '180–200 °C, 2–4 saat: çelikte yapışma + hidrojen gevrekliği giderme.'], ['4', 'Class 4', '120–130 °C, ≥ 1 saat: yaşlandırılmış Al (ör. 7075) ve sementasyonlu çelikte yapışma.'], ['5', 'Class 5', '140–150 °C, ≥ 1 saat: yaşlandırılmamış Al, bakır alaşımları, berilyum.'], ['6', 'Class 6', '300–320 °C, ≥ 1 saat: titanyum alaşımları.']] }
      ],
      not: (v, en) => en
        ? `FINISH: ELECTROLESS NICKEL PER ASTM B733, TYPE ${v.tip}, ${v.sc}, CLASS ${v.cls}.`
        : `YÜZEY İŞLEMİ: ASTM B733 AKIMSIZ NİKEL-FOSFOR KAPLAMA, TİP ${v.tip}, ${v.sc}, CLASS ${v.cls}.`,
      uyari: (v, t) => [
        t === 'al' && (v.cls === '2' || v.cls === '6') && 'Bu sınıfın sıcaklığı alüminyumun temperini bozar (T6 → aşırı yaşlanma). Alüminyumda Class 1, 4 veya 5 kullanın.',
        t === 'al' && v.cls === '3' && 'Class 3 çelik içindir; alüminyumda Class 4 (yaşlandırılmış) veya Class 5 seçin.',
        t === 'celik' && (v.cls === '4' || v.cls === '5' || v.cls === '6') && 'Bu sınıf çelik için tanımlı değil (Class 4 yalnız sementasyonlu çelikte). Çelikte genelde Class 1, 2 veya 3.',
        v.sc === 'SC0' && 'SC0 korozyon koruması sağlamaz.'
      ]
    },
    b633: {
      ad: 'ASTM B633', ref: 'b633',
      alan: [
        { k: 'sc', ad: 'Hizmet şartı (kalınlık)', op: [['SC1', 'SC1 · Fe/Zn 5', 'Hafif: kuru iç ortam, 5 µm.'], ['SC2', 'SC2 · Fe/Zn 8', 'Ilımlı: ara sıra yoğuşma, 8 µm.'], ['SC3', 'SC3 · Fe/Zn 12', 'Ağır: ıslak / dış ortam, 12 µm.'], ['SC4', 'SC4 · Fe/Zn 25', 'Çok ağır: sürekli ıslak, 25 µm.']] },
        { k: 'tip', ad: 'Tip (son işlem)', op: [['I', 'Tip I', 'Kaplanmış hâlde, son işlem yok.'], ['II', 'Tip II', 'Renkli kromat (Cr6), ~96 saat tuz püskürtme.'], ['III', 'Tip III', 'Renksiz kromat (Cr6), ~12 saat.'], ['IV', 'Tip IV', 'Fosfat son işlem (boya altı).'], ['V', 'Tip V', 'Renksiz pasivasyon (Cr6 içermez), ~72 saat.'], ['VI', 'Tip VI', 'Renkli pasivasyon (Cr6 içermez), ~120 saat.']] }
      ],
      not: (v, en) => {
        const zn = { SC1: 5, SC2: 8, SC3: 12, SC4: 25 }[v.sc];
        return en ? `FINISH: ZINC PLATE PER ASTM B633, Fe/Zn ${zn}, ${v.sc}, TYPE ${v.tip}.` : `YÜZEY İŞLEMİ: ASTM B633 ELEKTROLİTİK ÇİNKO KAPLAMA, Fe/Zn ${zn}, ${v.sc}, TİP ${v.tip}.`;
      },
      uyari: v => [
        (v.tip === 'II' || v.tip === 'III') && 'Tip II ve III altı değerlikli krom içerir: RoHS / REACH kısıtlıdır; Cr6’sız karşılıkları Tip VI (renkli) ve Tip V (renksiz).',
        v.sc === 'SC1' && 'SC1 yalnız kuru iç ortam içindir.',
        'Yüksek dayanımlı parçalarda (≈ 31 HRC üstü, 10.9 ve üstü cıvatalar) hidrojen gevrekliği giderme fırınlamasını çizimde belirtin.'
      ]
    },
    mil13924: {
      ad: 'MIL-DTL-13924', ref: 'mil13924s',
      alan: [{ k: 'cls', ad: 'Class', op: [['1', 'Class 1', 'Alkali oksitleme – dövme demir, dökme / temper dökme demir, karbon ve düşük alaşımlı çelik.'], ['2', 'Class 2', 'Paslanmaz çelikler için.'], ['3', 'Class 3', 'Paslanmaz çelikler için.'], ['4', 'Class 4', 'Paslanmaz çelikler için.']] }],
      not: (v, en) => en ? `FINISH: BLACK OXIDE PER MIL-DTL-13924, CLASS ${v.cls}, SUPPLEMENTARY OIL.` : `YÜZEY İŞLEMİ: MIL-DTL-13924 CLASS ${v.cls} SİYAH OKSİT (BRÜNÜR) + KOROZYON ÖNLEYİCİ YAĞ.`,
      uyari: (v, t) => [t === 'celik' && v.cls !== '1' && 'Karbon / alaşımlı çelikte Class 1 kullanılır; Class 2–4 paslanmaz çelikler içindir (paslanmazın türü ve ısıl işlemine göre standarttan seçilir).']
    },
    ams2700: {
      ad: 'AMS 2700', ref: 'ams2700',
      alan: [
        { k: 'met', ad: 'Method', op: [['1', 'Method 1', 'Nitrik asit esaslı (Type 1–8).'], ['2', 'Method 2', 'Sitrik asit esaslı (%4–10). Type yoktur.']] },
        { k: 'tip', ad: 'Type', kosul: v => v.met === '1', op: [
          ['1', 'Type 1', '%20–25 nitrik + %2–3 sodyum dikromat, 21–32 °C, 30 dk.'],
          ['2', 'Type 2', '%20–25 nitrik + %2–3 sodyum dikromat, 49–54 °C, 20 dk.'],
          ['3', 'Type 3', '%20–25 nitrik + %2–3 sodyum dikromat, 63–68 °C, 10 dk.'],
          ['4', 'Type 4', '%38–42 nitrik + dikromat, 21–49 °C, 30 dk – kolay işlenen (otomat) paslanmazlar (303, 416, 430F).'],
          ['5', 'Type 5', 'Anodik işlem (2 dk, 3–5 V) – yüksek karbonlu martenzitik paslanmazlar (440C).'],
          ['6', 'Type 6', '%25–45 nitrik, 21–32 °C, 30 dk.'],
          ['7', 'Type 7', '%20–25 nitrik, 49–60 °C, 20 dk.'],
          ['8', 'Type 8', '%45–55 nitrik, 49–54 °C, 30 dk.']] }
      ],
      not: (v, en) => v.met === '2'
        ? (en ? 'FINISH: PASSIVATE PER AMS 2700, METHOD 2 (CITRIC ACID).' : 'YÜZEY İŞLEMİ: AMS 2700 METHOD 2 (SİTRİK ASİT) PASİVASYON.')
        : (en ? `FINISH: PASSIVATE PER AMS 2700, METHOD 1, TYPE ${v.tip}.` : `YÜZEY İŞLEMİ: AMS 2700 METHOD 1 TYPE ${v.tip} PASİVASYON (NİTRİK ASİT).`),
      uyari: v => [
        v.met === '2' && 'Method 2’de Type alt sınıfı yoktur; çizimde “Method 2 Type 2” gibi bir çağrı yanlıştır.',
        v.met === '1' && ['1', '2', '3', '4'].includes(v.tip) && 'Type 1–4 sodyum dikromat (Cr6) içerir: atık ve RoHS açısından tedarikçiyle görüşün; Cr6’sız seçenek Type 6–8 veya Method 2.',
        v.met === '1' && v.tip === '5' && 'Type 5 anodik bir işlemdir; yalnız yüksek karbonlu martenzitik kaliteler için.'
      ]
    },
    a967: {
      ad: 'ASTM A967', ref: 'a967',
      alan: [{ k: 'yon', ad: 'İşlem', op: [
        ['serbest', 'Tedarikçi seçsin', 'Yalnız standart çağrılır; tedarikçi uygun işlemi seçer ve testlerle doğrular.'],
        ['Nitric 1', 'Nitric 1', '%20–25 nitrik + %2,5 sodyum dikromat, 49–54 °C, 20 dk.'],
        ['Nitric 2', 'Nitric 2', '%20–45 nitrik, 21–32 °C, 30 dk.'],
        ['Nitric 3', 'Nitric 3', '%20–25 nitrik, 49–60 °C, 20 dk.'],
        ['Nitric 4', 'Nitric 4', '%45–55 nitrik, 49–54 °C, 30 dk.'],
        ['Nitric 5', 'Nitric 5', 'Diğer nitrik kombinasyonları – testleri geçmek şartıyla.'],
        ['Citric 1', 'Citric 1', '%4–10 sitrik, 60–71 °C, 4 dk.'],
        ['Citric 2', 'Citric 2', '%4–10 sitrik, 49–60 °C, 10 dk.'],
        ['Citric 3', 'Citric 3', '%4–10 sitrik, 21–49 °C, 20 dk.'],
        ['Citric 4', 'Citric 4', 'Diğer sitrik konsantrasyonları (temizleyici kimyasallarla veya onlarsız).'],
        ['Citric 5', 'Citric 5', 'Diğer sitrik konsantrasyonları (başka kimyasallarla veya onlarsız).']] }],
      not: (v, en) => v.yon === 'serbest'
        ? (en ? 'FINISH: PASSIVATE PER ASTM A967.' : 'YÜZEY İŞLEMİ: ASTM A967’YE GÖRE PASİVASYON.')
        : (en ? `FINISH: PASSIVATE PER ASTM A967, ${v.yon.toUpperCase()}.` : `YÜZEY İŞLEMİ: ASTM A967 ${v.yon.toUpperCase()} PASİVASYON.`),
      uyari: v => [v.yon === 'Nitric 1' && 'Nitric 1 sodyum dikromat (Cr6) içerir.']
    }
  };

  // Kaplama → hangi spesifikasyonlar ve varsayılanlar
  const KAP_SPEC = {
    kromat3: { s: { mil5541: { tip: 'II', cls: '3' } } },
    kromat1a: { s: { mil5541: { tip: 'II', cls: '1A' } } },
    eloksal: { s: { mil8625: { tip: 'II', cls: '2', renk: 'siyah', seal: 'std' } } },
    serteloksal: { s: { mil8625: { tip: 'III', cls: '1', renk: 'siyah', seal: 'std' } } },
    enp: { s: { b733: { tip: 'IV', sc: 'SC2', cls: '1' } } },
    cinko: { s: { iso2081: null, b633: { sc: 'SC2', tip: 'V' } } },
    brunur: { s: { mil13924: { cls: '1' } } },
    pasivasyon: { s: { a967: { yon: 'Citric 2' }, ams2700: { met: '1', tip: '2' } } }
  };
  const SABIT_AD = { iso2081: 'ISO 2081' };

  function secim(kap) {
    const ks = KAP_SPEC[kap.id]; if (!ks) return null;
    const s = U().S();
    const ids = Object.keys(ks.s);
    const sid = ids.includes(s['sp_' + kap.id]) ? s['sp_' + kap.id] : ids[0];
    const sp = SPEC[sid];
    const v = {};
    if (sp) for (const a of sp.alan) {
      const deg = s[`sp_${kap.id}_${sid}_${a.k}`];
      v[a.k] = a.op.some(o => o[0] === deg) ? deg : ks.s[sid][a.k];
    }
    return { ids, sid, sp, v };
  }

  // Kart içi not metni (spesifikasyon seçimine göre)
  function not(kap, en) {
    const x = secim(kap);
    if (!x || !x.sp) return en ? kap.notEN : kap.notTR;
    return x.sp.not(x.v, en);
  }

  // Kaplama kartı içindeki seçim bloğu
  function blok(kap, taban) {
    const x = secim(kap); if (!x) return '';
    const { esc, refs } = U();
    let h = `<div class="spec-blok"><div class="spec-bas">📐 Spesifikasyon sınıflandırması <span class="small">(çizim notu seçime göre değişir)</span></div>`;
    if (x.ids.length > 1) h += `<div class="spec-satir"><span class="spec-et">Standart</span><div class="seg wrap small" data-bind="sp_${kap.id}">${x.ids.map(i => `<button data-v="${i}" class="${i === x.sid ? 'on' : ''}">${esc(SPEC[i] ? SPEC[i].ad : SABIT_AD[i])}</button>`).join('')}</div></div>`;
    if (!x.sp) return h + `<p class="small">Bu standartta seçilecek tip/sınıf yok; kalınlık ve pasivasyon çizim notunda yazılıdır.</p></div>`;
    for (const a of x.sp.alan) {
      if (a.kosul && !a.kosul(x.v)) continue;
      const key = `sp_${kap.id}_${x.sid}_${a.k}`;
      const sec = a.op.find(o => o[0] === x.v[a.k]);
      h += `<div class="spec-satir"><span class="spec-et">${esc(a.ad)}</span><div class="seg wrap small" data-bind="${key}">${a.op.map(o => `<button data-v="${esc(o[0])}" class="${o[0] === x.v[a.k] ? 'on' : ''}" title="${esc(o[2])}">${esc(o[1])}</button>`).join('')}</div></div>`;
      if (sec) h += `<div class="spec-acik small">${esc(sec[1])}: ${esc(sec[2])}</div>`;
    }
    const uy = x.sp.uyari(x.v, taban).filter(Boolean);
    if (uy.length) h += `<div class="warnbox small">${uy.map(u => '⚠ ' + esc(u)).join('<br>')}</div>`;
    h += refs([[x.sp.ref, 'Tip / class tanımları.']]) + '</div>';
    return h;
  }

  // ---------- ASTM standartları ----------
  // g: grup (filtre), u: ürün şekli, s: sınıflar [kod, açıklama, eşdeğer]
  const ASTM = [
    { k: 'A36', ad: 'Carbon Structural Steel', tr: 'Karbonlu yapı çeliği', g: 'Yapı', u: 'Profil, levha, çubuk', s: [['A36', 'Akma ≥ 250 MPa (36 ksi)', '≈ S235JR / S275JR (EN 10025-2)']], kart: 'S235JR' },
    { k: 'A572', ad: 'High-Strength Low-Alloy Columbium-Vanadium Structural Steel', tr: 'Yüksek dayanımlı düşük alaşımlı (Nb-V) yapı çeliği', g: 'Yapı', u: 'Profil, levha, çubuk', s: [['42', 'Akma ≥ 290 MPa', '≈ S275'], ['50', 'Akma ≥ 345 MPa – en yaygın', '≈ S355JR / J2'], ['60', 'Akma ≥ 415 MPa', '≈ S420'], ['65', 'Akma ≥ 450 MPa', '≈ S450']], kart: 'S355J2' },
    { k: 'A516', ad: 'Pressure Vessel Plates, Carbon Steel, for Moderate- and Lower-Temperature Service', tr: 'Basınçlı kap levhası, karbon çeliği (orta ve düşük sıcaklık)', g: 'Basınçlı kap', u: 'Levha', s: [['55', 'Rm 380–515 MPa', '≈ P235GH'], ['60', 'Rm 415–550 MPa', '≈ P265GH'], ['65', 'Rm 450–585 MPa', '≈ P295GH'], ['70', 'Rm 485–620 MPa – en yaygın', '≈ P355GH (EN 10028-2)']] },
    { k: 'A645', ad: 'Pressure Vessel Plates, 5 % and 5½ % Nickel Alloy Steels, Specially Heat Treated', tr: 'Basınçlı kap levhası, %5 ve %5½ nikelli alaşımlı çelik, özel ısıl işlemli – düşük / kriyojenik sıcaklıkta kaynaklı basınçlı kaplar (LNG/LPG tankı vb.)', g: 'Basınçlı kap', u: 'Levha', s: [['A', '%5 Ni', '≈ X12Ni5 (1.5680, EN 10028-4) – yaklaşık'], ['B', '%5½ Ni', 'Doğrudan EN karşılığı yok (X12Ni5 ile X7Ni9 arası)']], ref: 'a645' },
    { k: 'A353', ad: 'Pressure Vessel Plates, Alloy Steel, Double-Normalized and Tempered 9 % Nickel', tr: 'Basınçlı kap levhası, %9 nikelli, çift normalize + temperlenmiş (kriyojenik)', g: 'Basınçlı kap', u: 'Levha', s: [['A353', '%9 Ni', '≈ X8Ni9 (1.5662)']] },
    { k: 'A553', ad: 'Pressure Vessel Plates, Alloy Steel, Quenched and Tempered 7, 8, and 9 % Nickel', tr: 'Basınçlı kap levhası, %7–9 nikelli, su verilmiş + temperlenmiş', g: 'Basınçlı kap', u: 'Levha', s: [['I', '%9 Ni', '≈ X8Ni9 (1.5662)'], ['II', '%8 Ni', ''], ['III', '%7 Ni', '≈ X7Ni9 yaklaşık']] },
    { k: 'A105', ad: 'Carbon Steel Forgings for Piping Applications', tr: 'Boru donanımı için karbon çeliği dövme (flanş, fitting)', g: 'Boru/flanş', u: 'Dövme', s: [['A105', 'Rm ≥ 485 MPa', '≈ P250GH (EN 10222-2) / C22.8']] },
    { k: 'A350', ad: 'Carbon and Low-Alloy Steel Forgings, Requiring Notch Toughness Testing for Piping Components', tr: 'Düşük sıcaklık için çentik darbe testli dövme (flanş)', g: 'Boru/flanş', u: 'Dövme', s: [['LF2', '−46 °C darbe testli karbon çeliği – en yaygın', '≈ P285QH'], ['LF3', '%3,5 Ni, −101 °C', '≈ 13MnNi6-3 / 12Ni14']] },
    { k: 'A182', ad: 'Forged or Rolled Alloy and Stainless Steel Pipe Flanges, Forged Fittings, and Valves and Parts for High-Temperature Service', tr: 'Alaşımlı ve paslanmaz dövme flanş, fitting, valf parçaları', g: 'Boru/flanş', u: 'Dövme', s: [['F304', '304 paslanmaz', '1.4301'], ['F304L', '304L', '1.4307'], ['F316', '316', '1.4401'], ['F316L', '316L', '1.4404'], ['F51', 'Dubleks 2205 (S31803)', '1.4462'], ['F53', 'Süper dubleks 2507', '1.4410'], ['F11', '1¼Cr-½Mo', '≈ 13CrMo4-5'], ['F22', '2¼Cr-1Mo', '≈ 10CrMo9-10']] },
    { k: 'A312', ad: 'Seamless, Welded, and Heavily Cold Worked Austenitic Stainless Steel Pipes', tr: 'Ostenitik paslanmaz boru (dikişsiz / kaynaklı)', g: 'Boru/flanş', u: 'Boru', s: [['TP304', '304', '1.4301'], ['TP304L', '304L', '1.4307'], ['TP316', '316', '1.4401'], ['TP316L', '316L', '1.4404'], ['TP321', '321', '1.4541']] },
    { k: 'A269', ad: 'Seamless and Welded Austenitic Stainless Steel Tubing for General Service', tr: 'Genel amaçlı ostenitik paslanmaz tüp (enstrüman / hidrolik hat)', g: 'Boru/flanş', u: 'Tüp', s: [['TP304', '304', '1.4301'], ['TP316L', '316L', '1.4404']] },
    { k: 'A790', ad: 'Seamless and Welded Ferritic/Austenitic Stainless Steel Pipe', tr: 'Dubleks (ferritik-ostenitik) paslanmaz boru', g: 'Boru/flanş', u: 'Boru', s: [['S31803 / S32205', 'Dubleks 2205', '1.4462'], ['S32750', 'Süper dubleks 2507', '1.4410']] },
    { k: 'A53', ad: 'Pipe, Steel, Black and Hot-Dipped, Zinc-Coated, Welded and Seamless', tr: 'Siyah veya galvanizli karbon çeliği boru', g: 'Boru/flanş', u: 'Boru', s: [['A', 'Rm ≥ 330 MPa', ''], ['B', 'Rm ≥ 415 MPa – en yaygın', '≈ P235/P265 boru kaliteleri']] },
    { k: 'A106', ad: 'Seamless Carbon Steel Pipe for High-Temperature Service', tr: 'Yüksek sıcaklık için dikişsiz karbon çeliği boru', g: 'Boru/flanş', u: 'Boru', s: [['B', 'Rm ≥ 415 MPa – en yaygın', '≈ P265GH (EN 10216-2)'], ['C', 'Rm ≥ 485 MPa', '']] },
    { k: 'A240', ad: 'Chromium and Chromium-Nickel Stainless Steel Plate, Sheet, and Strip for Pressure Vessels and for General Applications', tr: 'Paslanmaz çelik levha, sac ve şerit (basınçlı kap ve genel amaçlı)', g: 'Paslanmaz', u: 'Levha, sac, şerit', s: [['304', '', '1.4301'], ['304L', '', '1.4307'], ['316L', '', '1.4404'], ['430', '', '1.4016'], ['2205', '', '1.4462']], ref: 'astmListe' },
    { k: 'A666', ad: 'Annealed or Cold-Worked Austenitic Stainless Steel Sheet, Strip, Plate, and Flat Bar', tr: 'Tavlı veya soğuk işlenmiş ostenitik paslanmaz sac, şerit, levha, lama (yapısal)', g: 'Paslanmaz', u: 'Sac, şerit, lama', s: [['301', '¼–tam sert temperler', '1.4310'], ['304', '', '1.4301']], ref: 'astmListe' },
    { k: 'A276', ad: 'Stainless Steel Bars and Shapes', tr: 'Paslanmaz çelik çubuk ve profiller (genel)', g: 'Paslanmaz', u: 'Çubuk, profil', s: [['304', '', '1.4301'], ['316', '', '1.4401'], ['316L', '', '1.4404'], ['410', '', '1.4006'], ['420', '', '1.4021'], ['440C', '', '1.4125']], ref: 'astmListe' },
    { k: 'A479', ad: 'Stainless Steel Bars and Shapes for Use in Boilers and Other Pressure Vessels', tr: 'Kazan ve basınçlı kaplar için paslanmaz çubuk ve profil', g: 'Paslanmaz', u: 'Çubuk, profil', s: [['304/304L', 'çift sertifika yaygın', '1.4301 / 1.4307'], ['316/316L', '', '1.4401 / 1.4404'], ['2205', '', '1.4462']], ref: 'astmListe' },
    { k: 'A564', ad: 'Hot-Rolled and Cold-Finished Age-Hardening Stainless Steel Bars and Shapes', tr: 'Yaşlandırma (çökelme) sertleşmeli paslanmaz çubuk', g: 'Paslanmaz', u: 'Çubuk, profil', s: [['630', '17-4PH; H900…H1150 yaşlandırma durumları', '1.4542'], ['XM-12', '15-5PH', '1.4545'], ['631', '17-7PH', '1.4568']], ref: 'astmListe' },
    { k: 'A693', ad: 'Precipitation-Hardening Stainless and Heat-Resisting Steel Plate, Sheet, and Strip', tr: 'Çökelme sertleşmeli paslanmaz levha, sac, şerit', g: 'Paslanmaz', u: 'Levha, sac', s: [['630', '17-4PH', '1.4542']], ref: 'astmListe' },
    { k: 'A582', ad: 'Free-Machining Stainless Steel Bars', tr: 'Kolay işlenen (otomat) paslanmaz çubuk', g: 'Paslanmaz', u: 'Çubuk', s: [['303', '', '1.4305'], ['416', '', '1.4005'], ['430F', '', '1.4104 (yaklaşık)']], ref: 'astmListe' },
    { k: 'A193', ad: 'Alloy-Steel and Stainless Steel Bolting for High Temperature or High Pressure Service and Other Special Purpose Applications', tr: 'Yüksek sıcaklık / basınç için alaşımlı ve paslanmaz cıvata, saplama', g: 'Bağlantı', u: 'Cıvata, saplama', s: [['B7', '4140 / 4142 ıslah, Rm ≥ 860 MPa (≤ 64 mm) – en yaygın saplama', '≈ 42CrMo4 (EN 10269)'], ['B7M', 'B7, sertlik sınırlı (≤ 235 HB) – H₂S ortamı', ''], ['B16', 'Cr-Mo-V, yüksek sıcaklık', '≈ 40CrMoV4-6'], ['B8', '304 paslanmaz (Class 1 çözeltiye alınmış)', '1.4301 · ≈ A2'], ['B8M', '316 paslanmaz', '1.4401 · ≈ A4']] },
    { k: 'A194', ad: 'Carbon Steel, Alloy Steel, and Stainless Steel Nuts for Bolts for High Pressure or High Temperature Service, or Both', tr: 'Yüksek basınç / sıcaklık cıvataları için somun', g: 'Bağlantı', u: 'Somun', s: [['2H', 'Su verilmiş karbon çeliği – B7 ile', ''], ['2HM', 'Sertlik sınırlı – B7M ile', ''], ['8', '304 – B8 ile', '1.4301'], ['8M', '316 – B8M ile', '1.4401']] },
    { k: 'A320', ad: 'Alloy-Steel and Stainless Steel Bolting for Low-Temperature Service', tr: 'Düşük sıcaklık için cıvata, saplama', g: 'Bağlantı', u: 'Cıvata, saplama', s: [['L7', '4140 benzeri, −101 °C darbe testli', '≈ 42CrMo4 (darbe testli)'], ['B8', '304', '1.4301']] },
    { k: 'F593', ad: 'Stainless Steel Bolts, Hex Cap Screws, and Studs', tr: 'Paslanmaz cıvata ve saplamalar (Group 1: 304, Group 2: 316 …)', g: 'Bağlantı', u: 'Cıvata', s: [['Group 1', '303/304/305 vb.', '≈ A2 (ISO 3506)'], ['Group 2', '316', '≈ A4']] },
    { k: 'A29', ad: 'General Requirements for Steel Bars, Carbon and Alloy, Hot-Wrought', tr: 'Sıcak haddelenmiş karbon ve alaşımlı çelik çubuk – genel şartlar (AISI/SAE kaliteleri: 1018, 1045, 4140 …)', g: 'Karbon/alaşımlı', u: 'Çubuk', s: [['1018', '', '≈ C15'], ['1045', '', '≈ C45 (1.0503)'], ['4140', '', '≈ 42CrMo4 (1.7225)'], ['4340', '', '≈ 34CrNiMo6 (1.6582)']] },
    { k: 'A108', ad: 'Steel Bar, Carbon and Alloy, Cold-Finished', tr: 'Soğuk çekilmiş / taşlanmış karbon ve alaşımlı çelik çubuk', g: 'Karbon/alaşımlı', u: 'Çubuk', s: [['1018', '', '≈ C15'], ['1045', '', '≈ C45'], ['12L14', 'kurşunlu otomat', '≈ 11SMnPb30 (1.0718)']] },
    { k: 'A322', ad: 'Steel Bars, Alloy, Standard Grades', tr: 'Alaşımlı çelik çubuk, standart kaliteler (4140, 4340, 8620 …)', g: 'Karbon/alaşımlı', u: 'Çubuk', s: [['4140', '', '≈ 42CrMo4'], ['4340', '', '≈ 34CrNiMo6'], ['8620', '', '≈ 20NiCrMo2-2 (1.6523)']] },
    { k: 'A519', ad: 'Seamless Carbon and Alloy Steel Mechanical Tubing', tr: 'Makine (mekanik) amaçlı dikişsiz karbon / alaşımlı çelik boru', g: 'Karbon/alaşımlı', u: 'Boru', s: [['1026', '', '≈ E355 (EN 10297-1) yaklaşık'], ['4130', '', '≈ 25CrMo4']] },
    { k: 'A681', ad: 'Tool Steels Alloy', tr: 'Alaşımlı takım çelikleri', g: 'Takım', u: 'Çubuk, blok', s: [['D2', 'Soğuk iş, yüksek C-Cr', '1.2379'], ['H13', 'Sıcak iş', '1.2344'], ['A2', 'Havada sertleşen soğuk iş', '1.2363'], ['O1', 'Yağda sertleşen', '1.2510'], ['P20', 'Plastik kalıp (ön sertleştirilmiş)', '1.2311 (A681 dışı da satılır)']], ref: 'a681' },
    { k: 'A48', ad: 'Gray Iron Castings', tr: 'Lamel grafitli (gri) dökme demir', g: 'Döküm', u: 'Döküm', s: [['20', 'Rm ≥ 138 MPa (20 ksi)', '≈ EN-GJL-100'], ['25', 'Rm ≥ 172 MPa', '≈ EN-GJL-150'], ['30', 'Rm ≥ 207 MPa', '≈ EN-GJL-200'], ['35', 'Rm ≥ 241 MPa', '≈ EN-GJL-250'], ['40', 'Rm ≥ 276 MPa', '≈ EN-GJL-300'], ['50', 'Rm ≥ 345 MPa', '≈ EN-GJL-350']], ref: 'dokmeEsd' },
    { k: 'A536', ad: 'Ductile Iron Castings', tr: 'Küresel grafitli (sünek) dökme demir; sınıf = Rm-Rp(ksi)-uzama(%)', g: 'Döküm', u: 'Döküm', s: [['60-40-18', 'Ferritik, tavlı', '≈ EN-GJS-400-18'], ['65-45-12', 'Çoğunlukla ferritik, döküm hâli', '≈ EN-GJS-450-10 (bazı tablolarda 400-15)'], ['80-55-06', 'Ferritik-perlitik', '≈ EN-GJS-500-7'], ['100-70-03', 'Perlitik', '≈ EN-GJS-700-2'], ['120-90-02', 'Martenzitik, su verilmiş + temperlenmiş', '≈ EN-GJS-800-2']], ref: 'dokmeEsd', kart: 'EN-GJS-400-15' },
    { k: 'B209', ad: 'Aluminum and Aluminum-Alloy Sheet and Plate', tr: 'Alüminyum sac ve levha', g: 'Alüminyum', u: 'Sac, levha', s: [['5083-H111', '', 'EN AW-5083'], ['6061-T6/T651', '', 'EN AW-6061']], ref: 'astmB209' },
    { k: 'B211', ad: 'Aluminum and Aluminum-Alloy Rolled or Cold-Finished Bar, Rod, and Wire', tr: 'Alüminyum haddelenmiş / soğuk çekilmiş çubuk ve tel', g: 'Alüminyum', u: 'Çubuk, tel', s: [['2011-T3', 'otomat', 'EN AW-2011'], ['6061-T6', '', 'EN AW-6061']], ref: 'astmB209' },
    { k: 'B221', ad: 'Aluminum and Aluminum-Alloy Extruded Bars, Rods, Wire, Profiles, and Tubes', tr: 'Alüminyum ekstrüzyon çubuk, profil, boru', g: 'Alüminyum', u: 'Ekstrüzyon', s: [['6061-T6', '', 'EN AW-6061'], ['6063-T5/T6', '', 'EN AW-6063'], ['6082-T6', '', 'EN AW-6082']], ref: 'astmB209' },
    { k: 'B241', ad: 'Aluminum and Aluminum-Alloy Seamless Pipe and Seamless Extruded Tube', tr: 'Alüminyum dikişsiz boru', g: 'Alüminyum', u: 'Boru', s: [['6061-T6', '', 'EN AW-6061']] },
    { k: 'A967', ad: 'Chemical Passivation Treatments for Stainless Steel Parts', tr: 'Paslanmaz parçalar için kimyasal pasivasyon (yüzey işlemi standardı – malzeme değil)', g: 'Yüzey işlemi', u: '—', s: [], ref: 'a967', kap: 'pasivasyon' },
    { k: 'A380', ad: 'Cleaning, Descaling, and Passivation of Stainless Steel Parts, Equipment, and Systems', tr: 'Paslanmaz parça ve sistemlerin temizliği, tufal giderme ve pasivasyonu (uygulama kılavuzu)', g: 'Yüzey işlemi', u: '—', s: [] },
    { k: 'B633', ad: 'Electrodeposited Coatings of Zinc on Iron and Steel', tr: 'Demir/çelik üzerine elektrolitik çinko (yüzey işlemi)', g: 'Yüzey işlemi', u: '—', s: [], ref: 'b633', kap: 'cinko' },
    { k: 'B733', ad: 'Autocatalytic (Electroless) Nickel-Phosphorus Coatings on Metal', tr: 'Akımsız nikel-fosfor kaplama (yüzey işlemi)', g: 'Yüzey işlemi', u: '—', s: [], ref: 'b733', kap: 'enp' }
  ];

  // ---------- Kalite (grade) eşdeğerleri ----------
  // a: aranacak takma adlar; kart: uygulamadaki malzeme kartı (CELIK kod)
  const KALITE = [
    { ad: '304', uns: 'S30400', wnr: '1.4301', en: 'X5CrNi18-10', tur: 'Ostenitik paslanmaz çelik (18Cr-8Ni) – en yaygın paslanmaz', astm: ['A240', 'A276', 'A479', 'A312', 'A182 F304', 'A193 B8'], kart: '1.4301', a: ['SUS304', 'V2A', '18/8'] },
    { ad: '304L', uns: 'S30403', wnr: '1.4307', en: 'X2CrNi18-9', tur: 'Ostenitik paslanmaz, düşük karbonlu (kaynak sonrası taneler arası korozyona dayanıklı)', astm: ['A240', 'A276', 'A479', 'A312', 'A182 F304L'], kart: '1.4307', a: ['1.4306', 'SUS304L'] },
    { ad: '316', uns: 'S31600', wnr: '1.4401', en: 'X5CrNiMo17-12-2', tur: 'Ostenitik paslanmaz, molibdenli (klorür / deniz ortamı)', astm: ['A240', 'A276', 'A479', 'A312', 'A182 F316', 'A193 B8M'], kart: '1.4404', a: ['SUS316', 'V4A'] },
    { ad: '316L', uns: 'S31603', wnr: '1.4404', en: 'X2CrNiMo17-12-2', tur: 'Ostenitik paslanmaz, molibdenli, düşük karbonlu', astm: ['A240', 'A276', 'A479', 'A312', 'A269', 'A182 F316L'], kart: '1.4404', a: ['SUS316L'] },
    { ad: '316Ti', uns: 'S31635', wnr: '1.4571', en: 'X6CrNiMoTi17-12-2', tur: 'Titanyum ile stabilize 316', astm: ['A240'], kart: '1.4404', a: [] },
    { ad: '321', uns: 'S32100', wnr: '1.4541', en: 'X6CrNiTi18-10', tur: 'Titanyum ile stabilize ostenitik paslanmaz (yüksek sıcaklık)', astm: ['A240', 'A276', 'A312'], kart: '1.4301', a: [] },
    { ad: '303', uns: 'S30300', wnr: '1.4305', en: 'X8CrNiS18-9', tur: 'Kolay işlenen (kükürtlü) ostenitik paslanmaz – kaynaklanmaz', astm: ['A582', 'A581 (tel)'], kart: '1.4305', a: ['SUS303'] },
    { ad: '301', uns: 'S30100', wnr: '1.4310', en: 'X10CrNi18-8', tur: 'Soğuk işlemle sertleşen ostenitik paslanmaz (yay, sac)', astm: ['A666', 'A240'], kart: '1.4301', a: [] },
    { ad: '310S', uns: 'S31008', wnr: '1.4845', en: 'X8CrNi25-21', tur: 'Isıya dayanıklı ostenitik paslanmaz (≈ 1100 °C’ye kadar oksidasyon)', astm: ['A240', 'A276'], kart: '1.4301', a: [] },
    { ad: '904L', uns: 'N08904', wnr: '1.4539', en: 'X1NiCrMoCu25-20-5', tur: 'Süper ostenitik paslanmaz (asit ortamı)', astm: ['B625', 'B649'], kart: '1.4404', a: [] },
    { ad: '410', uns: 'S41000', wnr: '1.4006', en: 'X12Cr13', tur: 'Martenzitik paslanmaz (sertleştirilebilir, manyetik)', astm: ['A276', 'A240'], kart: '1.4021', a: [] },
    { ad: '416', uns: 'S41600', wnr: '1.4005', en: 'X12CrS13', tur: 'Kolay işlenen martenzitik paslanmaz', astm: ['A582'], kart: '1.4021', a: [] },
    { ad: '420', uns: 'S42000', wnr: '1.4021', en: 'X20Cr13', tur: 'Martenzitik paslanmaz (bıçak, pompa mili, valf) – 420 aralığı 1.4021/1.4028’i kapsar', astm: ['A276', 'A240'], kart: '1.4021', a: ['1.4028', 'X30Cr13'] },
    { ad: '430', uns: 'S43000', wnr: '1.4016', en: 'X6Cr17', tur: 'Ferritik paslanmaz (manyetik, ucuz, sac)', astm: ['A240', 'A276'], kart: '1.4301', a: ['SUS430'] },
    { ad: '440C', uns: 'S44004', wnr: '1.4125', en: 'X105CrMo17', tur: 'Yüksek karbonlu martenzitik paslanmaz (rulman, ≈ 58–60 HRC)', astm: ['A276'], kart: '1.4021', a: [] },
    { ad: '17-4PH', uns: 'S17400', wnr: '1.4542', en: 'X5CrNiCuNb16-4', tur: 'Çökelme sertleşmeli paslanmaz (ASTM Type 630)', astm: ['A564 Type 630', 'A693', 'A705'], kart: '1.4542', a: ['630', '174PH', 'SUS630'] },
    { ad: '15-5PH', uns: 'S15500', wnr: '1.4545', en: 'X5CrNiCu15-5', tur: 'Çökelme sertleşmeli paslanmaz (ASTM XM-12)', astm: ['A564 XM-12'], kart: '1.4542', a: ['XM-12', '155PH'] },
    { ad: '2205', uns: 'S32205', wnr: '1.4462', en: 'X2CrNiMoN22-5-3', tur: 'Dubleks paslanmaz (ferritik-ostenitik); S31803 eski / geniş aralıklı karşılığıdır', astm: ['A240', 'A276', 'A479', 'A790', 'A182 F51 / F60'], kart: '1.4462', a: ['S31803', 'F51', 'F60'] },
    { ad: '2507', uns: 'S32750', wnr: '1.4410', en: 'X2CrNiMoN25-7-4', tur: 'Süper dubleks paslanmaz', astm: ['A240', 'A790', 'A182 F53'], kart: '1.4462', a: ['F53'] },
    { ad: '1018', uns: 'G10180', wnr: '1.0401 (≈)', en: '≈ C15', tur: 'Düşük karbonlu çelik (sementasyon, genel talaşlı imalat)', astm: ['A29', 'A108'], kart: 'S235JR', a: ['AISI1018', 'SAE1018'] },
    { ad: '1020', uns: 'G10200', wnr: '1.0402 (≈)', en: '≈ C22', tur: 'Düşük karbonlu çelik', astm: ['A29', 'A108'], kart: 'S235JR', a: [] },
    { ad: '1045', uns: 'G10450', wnr: '1.0503', en: '≈ C45', tur: 'Orta karbonlu ıslah çeliği (mil, pim)', astm: ['A29', 'A108'], kart: 'C45', a: ['AISI1045', 'SAE1045'] },
    { ad: '4140', uns: 'G41400', wnr: '1.7225', en: '≈ 42CrMo4', tur: 'Cr-Mo ıslah çeliği (mil, dişli, A193 B7 saplama)', astm: ['A29', 'A322', 'A193 B7'], kart: '42CrMo4', a: ['AISI4140', 'SCM440', '4142'] },
    { ad: '4340', uns: 'G43400', wnr: '1.6582 (≈)', en: '≈ 34CrNiMo6', tur: 'Ni-Cr-Mo yüksek dayanımlı ıslah çeliği', astm: ['A29', 'A322'], kart: '34CrNiMo6', a: ['AISI4340'] },
    { ad: '4130', uns: 'G41300', wnr: '1.7218 (≈)', en: '≈ 25CrMo4', tur: 'Cr-Mo çeliği (kaynaklı boru konstrüksiyon, havacılık)', astm: ['A29', 'A519'], kart: '42CrMo4', a: [] },
    { ad: '8620', uns: 'G86200', wnr: '1.6523', en: '≈ 20NiCrMo2-2', tur: 'Sementasyon çeliği (dişli)', astm: ['A29', 'A322'], kart: '16MnCr5', a: [] },
    { ad: '12L14', uns: 'G12144', wnr: '1.0718 (≈)', en: '≈ 11SMnPb30', tur: 'Kurşunlu otomat çeliği – kaynaklanmaz', astm: ['A108'], kart: '11SMnPb30', a: [] },
    { ad: 'D2', uns: 'T30402', wnr: '1.2379', en: 'X153CrMoV12', tur: 'Soğuk iş takım çeliği (yüksek C-Cr, aşınmaya çok dayanıklı) · JIS SKD11 yaklaşık', astm: ['A681'], kart: '1.2379', a: ['SKD11'] },
    { ad: 'H13', uns: 'T20813', wnr: '1.2344', en: 'X40CrMoV5-1', tur: 'Sıcak iş takım çeliği (basınçlı döküm, dövme kalıbı) · JIS SKD61', astm: ['A681'], kart: '1.2379', a: ['SKD61'] },
    { ad: 'A2', uns: 'T30102', wnr: '1.2363', en: 'X100CrMoV5', tur: 'Havada sertleşen soğuk iş takım çeliği', astm: ['A681'], kart: '1.2379', a: [] },
    { ad: 'O1', uns: 'T31501', wnr: '1.2510', en: '100MnCrW4', tur: 'Yağda sertleşen soğuk iş takım çeliği', astm: ['A681'], kart: '1.2379', a: [] },
    { ad: 'P20', uns: 'T51620', wnr: '1.2311', en: '40CrMnMo7', tur: 'Plastik kalıp çeliği (≈ 30 HRC ön sertleştirilmiş); kükürtlü türevi 1.2312', astm: ['A681'], kart: '1.2312', a: [] },
    { ad: 'A36', uns: 'K02600', wnr: '—', en: '≈ S235JR / S275JR', tur: 'Karbonlu yapı çeliği', astm: ['A36'], kart: 'S235JR', a: [] },
    { ad: 'B7', uns: '—', wnr: '≈ 1.7225', en: '≈ 42CrMo4', tur: 'ASTM A193 Grade B7: ıslah edilmiş Cr-Mo saplama / cıvata malzemesi (4140/4142)', astm: ['A193'], kart: '42CrMo4', a: [] }
  ];

  // ---------- Kod çözücü ----------
  const norm = t => String(t).toUpperCase().replace(/[\s\-\.\/_]/g, '');
  const stripOn = t => t.replace(/^(UNS|AISI|SAE|TYPE|TP|GRADE|GR|WNR|WN|DIN|ENAW|EN|AW)/, '');

  function coz(girdi) {
    const ham = String(girdi || '').trim();
    if (!ham) return null;
    const B = ham.toUpperCase();
    const asme = /\bSA\s*-?\s*\d/.test(B);
    const astmYazili = /ASTM|ASME|\bSA\s*-?\s*\d/.test(B);
    const specler = [];
    const re = /\b(S?A|B|F)\s*-?\s*(\d{1,4})(?:\s*\/\s*(?:S?A|B|F)?\s*-?\s*\d{1,4}\s*M)?(M)?(?:\s*[-–]\s*(\d{2})([A-Z])?(?:E(\d))?)?(?:\s*\((\d{4})\))?/g;
    let m;
    while ((m = re.exec(B))) {
      const harf = m[1].replace(/^SA/, 'A'), no = m[2];
      const kod = harf + no;
      const kayit = ASTM.find(x => x.k === kod);
      if (!kayit && !(astmYazili && /(ASTM|ASME)\s*$/.test(B.slice(Math.max(0, m.index - 6), m.index)) || /^SA/.test(m[1]))) continue;
      const metrik = /\/\s*(?:S?A|B|F)?\s*-?\s*\d{1,4}\s*M/.test(m[0]) || !!m[3];
      const yil = m[4] ? (parseInt(m[4], 10) > 50 ? 1900 : 2000) + parseInt(m[4], 10) : null;
      specler.push({ kod, kayit, metrik, yil, harfRev: m[5] || '', editor: m[6] || '', onay: m[7] || '', ham: m[0].trim(), bas: m.index, son: m.index + m[0].length });
    }
    // Spesifikasyon kısımlarını çıkarıp kalan kelimelerde kalite ara
    let kalan = B;
    for (const s of specler.slice().reverse()) kalan = kalan.slice(0, s.bas) + ' ' + kalan.slice(s.son);
    kalan = kalan.replace(/ASTM|ASME/g, ' ');
    const kelime = kalan.split(/[\s,;]+/).filter(Boolean);
    const aday = [];
    for (let i = 0; i < kelime.length; i++) { aday.push(kelime[i]); if (i + 1 < kelime.length) aday.push(kelime[i] + kelime[i + 1]); }
    const kaliteler = [], sinifEsl = [];
    const tumAl = (g.MVERI && g.MVERI.ALUMINYUM) || [];
    const alBul = [];
    for (const a0 of aday) {
      const a = stripOn(norm(a0)); if (!a) continue;
      const k = KALITE.find(q => [q.ad, q.uns, q.wnr, q.en, ...q.a].some(x => x && x !== '—' && norm(x).replace(/\(≈\)|≈/g, '') === a));
      if (k && !kaliteler.includes(k)) kaliteler.push(k);
      const al = tumAl.find(x => a === norm(x.kod) || a === 'A9' + norm(x.kod) || a === norm(x.wnr) || a.split('T')[0] === norm(x.kod) && /^\d{4}T\d/.test(a));
      if (al && !alBul.includes(al)) alBul.push(al);
      for (const s of specler) if (s.kayit) {
        const sn = s.kayit.s.find(z => norm(z[0]) === a || norm(z[0]) === 'GR' + a || stripOn(norm(z[0])) === a);
        if (sn && !sinifEsl.some(y => y.s === s && y.sn === sn)) sinifEsl.push({ s, sn });
      }
    }
    // Yalnız kalite yazıldıysa ilgili tek spesifikasyon kalitesi (ör. "B7") de bulunsun
    return { ham, specler, kaliteler, sinifEsl, alBul, asme };
  }

  function kartBtn(kod) {
    const C = (g.MVERI && g.MVERI.CELIK) || [];
    const c = C.find(x => x.kod === kod); if (!c) return '';
    return `<button class="mini" data-kart-git="${U().esc(kod)}">Malzeme kartını aç: ${U().esc(c.kod)} ›</button>`;
  }

  function sonucHtml(r) {
    const { esc, refs } = U();
    if (!r) return '<p class="small">Bir kod yazın veya örneklerden birine tıklayın.</p>';
    let h = '';
    for (const s of r.specler) {
      const k = s.kayit;
      const parcalar = [
        `<li><b>${s.kod.charAt(0)}</b> = ${s.kod[0] === 'A' ? 'demir esaslı (ferrous) malzeme' : s.kod[0] === 'B' ? 'demir dışı (non-ferrous) malzeme / kaplama' : 'F serisi: çeşitli (bağlantı elemanları vb.)'}; <b>${s.kod.slice(1)}</b> = sıra numarası (anlam taşımaz).</li>`,
        s.metrik ? '<li><b>…M</b> = aynı standardın SI (metrik) birimli sürümü; “A645/A645M” hem inç-pound hem SI sürümünü birlikte gösterir.</li>' : '',
        s.yil ? `<li><b>-${String(s.yil).slice(2)}${esc(s.harfRev)}</b> = ${s.yil} yılı revizyonu${s.harfRev ? ` (“${esc(s.harfRev.toLowerCase())}” = o yıl içindeki ${s.harfRev === 'A' ? 'ikinci' : 'sonraki'} revizyon)` : ''}.</li>` : '<li>Revizyon yılı yazılmamış: çizimde yazılmazsa genelde sipariş tarihindeki güncel revizyon kabul edilir.</li>',
        s.editor ? `<li><b>ε${esc(s.editor)}</b> = editoryal düzeltme (içerik değişmez).</li>` : '',
        s.onay ? `<li><b>(${esc(s.onay)})</b> = ${esc(s.onay)} yılında değişiklik yapılmadan yeniden onaylanmış.</li>` : '',
        r.asme ? '<li><b>SA-</b> öneki: ASME Kazan ve Basınçlı Kap Kodu (Section II) içindeki aynı ASTM standardı.</li>' : ''
      ].join('');
      if (!k) { h += `<div class="card kod-kart"><h3>ASTM ${esc(s.kod)}</h3><p>Bu numara listemizde yok. Kod yapısı:</p><ul class="small">${parcalar}</ul><p class="small">Başlığını <a href="https://store.astm.org/" target="_blank" rel="noopener">ASTM kataloğunda</a> arayın.</p></div>`; continue; }
      const es = r.sinifEsl.filter(y => y.s === s).map(y => y.sn);
      h += `<div class="card kod-kart"><h3>ASTM ${esc(s.kod)}${s.metrik ? '/' + esc(s.kod) + 'M' : ''}${s.yil ? '-' + String(s.yil).slice(2) + esc(s.harfRev.toLowerCase()) : ''} <span class="chip">${esc(k.g)}</span></h3>
        <p class="kod-ozet">👉 <b>${esc(k.tr)}</b></p>
        <p class="small"><i>${esc(k.ad)}</i> · Ürün şekli: ${esc(k.u)}</p>
        ${es.length ? `<div class="okbox">Yazdığınız sınıf: ${es.map(z => `<b>${esc(z[0])}</b>${z[1] ? ' – ' + esc(z[1]) : ''}${z[2] ? ' · EN/W.Nr: <b>' + esc(z[2]) + '</b>' : ''}`).join('<br>')}</div>` : ''}
        ${k.s.length ? `<table class="kod-tab"><thead><tr><th>Grade / Type / Class</th><th>Açıklama</th><th>Yaklaşık EN / W.Nr karşılığı</th></tr></thead><tbody>${k.s.map(z => `<tr class="${es.includes(z) ? 'sec' : ''}"><td><b>${esc(z[0])}</b></td><td class="small">${esc(z[1])}</td><td class="small">${esc(z[2])}</td></tr>`).join('')}</tbody></table>` : ''}
        <details class="mt"><summary class="small">Kodun okunuşu</summary><ul class="small">${parcalar}</ul></details>
        <div class="mt">${k.kart ? kartBtn(k.kart) : ''}${k.kap ? `<button class="mini" data-kap-git="${esc(k.kap)}">Kaplama kartına git ›</button>` : ''}</div>
        ${k.ref ? refs([[k.ref, 'Kapsam.']]) : ''}</div>`;
    }
    for (const q of r.kaliteler) {
      h += `<div class="card kod-kart"><h3>${esc(q.ad)}${q.uns !== '—' ? ` <span class="chip">UNS ${esc(q.uns)}</span>` : ''}</h3>
        <p class="kod-ozet">👉 Bu malzeme: <b>${esc(q.tur)}</b></p>
        <div class="kv"><div><b>${esc(q.wnr)}</b><span>W.Nr (EN 10027-2)</span></div><div><b>${esc(q.en)}</b><span>EN kısa adı</span></div><div><b>${esc(q.uns)}</b><span>UNS</span></div><div><b>${esc(q.astm.join(', '))}</b><span>Geçtiği ASTM standartları (ürün şekline göre)</span></div></div>
        <p class="small mt">ASTM’de kalite adı tek başına yetmez: <b>ürün şekline göre standart</b> seçilir (levha A240, çubuk A276/A479, boru A312, dövme A182 …). Çizimde ör. “ASTM A276 TYPE ${esc(q.ad)}” veya “ASTM A240 UNS ${esc(q.uns)}” yazın.</p>
        <div class="mt">${kartBtn(q.kart)}</div></div>`;
    }
    for (const a of r.alBul) {
      h += `<div class="card kod-kart"><h3>Alüminyum ${esc(a.kod)} <span class="chip">UNS A9${esc(a.kod)}</span></h3>
        <p class="kod-ozet">👉 Bu malzeme: <b>${esc(a.en)} [${esc(a.sembol)}]</b> – ${esc(a.kullanim)}</p>
        <div class="kv"><div><b>${esc(a.en)}</b><span>EN 573-3</span></div><div><b>${esc(a.wnr)}</b><span>W.Nr</span></div><div><b>B209 / B211 / B221</b><span>ASTM (levha / çubuk / ekstrüzyon)</span></div></div>
        <div class="mt"><button class="mini" data-al-git="${esc(a.kod)}">Alüminyum kartını aç ›</button></div></div>`;
    }
    if (!h) h = `<div class="warnbox">“${esc(r.ham)}” için eşleşme bulunamadı. Şunları deneyin: ASTM numarası (A240, A645/A645M-10), kalite (316L, 17-4PH, 4140, D2), UNS (S31603) veya W.Nr (1.4404).</div>`;
    return h;
  }

  const ORNEK = ['ASTM A645/A645M-10', 'A240 316L', 'S31603', '1.4404', 'A564 630', 'A193 B7', 'SA-516 Gr 70', 'A536 65-45-12', '4140', 'D2', '6061-T6'];
  const GRUPLAR = ['Hepsi', ...new Set(ASTM.map(x => x.g))];

  function listeHtml() {
    const { esc, S } = U(); const s = S();
    const gr = GRUPLAR.includes(s.astmGrup) ? s.astmGrup : 'Hepsi';
    const L = ASTM.filter(x => gr === 'Hepsi' || x.g === gr);
    return `<div class="seg wrap small" data-bind="astmGrup">${GRUPLAR.map(x => `<button data-v="${esc(x)}" class="${x === gr ? 'on' : ''}">${esc(x)}</button>`).join('')}</div>
      <table class="kod-tab mt"><thead><tr><th>ASTM</th><th>Kapsam</th><th>Ürün</th><th>Yaygın sınıflar</th></tr></thead><tbody>
      ${L.map(x => `<tr><td><button class="linkbtn" data-kod-ornek="ASTM ${esc(x.k)}"><b>${esc(x.k)}</b></button></td><td class="small">${esc(x.tr)}</td><td class="small">${esc(x.u)}</td><td class="small">${esc(x.s.map(z => z[0]).join(', '))}</td></tr>`).join('')}
      </tbody></table>`;
  }

  function kodSekme() {
    const { esc, S, refs } = U(); const s = S();
    return `<div class="card"><h3>🔎 Kod çözücü – ASTM / UNS / W.Nr</h3>
        <p class="small">Teknik resimde veya sertifikada gördüğünüz kodu yazın; ne olduğunu ve EN karşılığını gösterelim. Ör. paslanmaz için “A240 316L” yazarsanız: <i>levha standardı + ostenitik paslanmaz 1.4404</i>.</p>
        <input type="text" id="kodGir" class="kod-gir" placeholder="ör. ASTM A645/A645M-10, A276 304, S17400, 1.4542, B7" value="${esc(s.kodAra || '')}" autocomplete="off" spellcheck="false">
        <div class="pill-row mt">${ORNEK.map(o => `<button class="chip linkbtn" data-kod-ornek="${esc(o)}">${esc(o)}</button>`).join('')}</div>
      </div>
      <div id="kodSonuc">${sonucHtml(coz(s.kodAra))}</div>
      <div class="card"><h3>ASTM malzeme standartları (seçme liste)</h3>${listeHtml()}
        <p class="small mt">Eşdeğerler yaklaşıktır: kimyasal bileşim ve mekanik değer aralıkları birebir örtüşmeyebilir. Kritik parçada her iki standardın şartlarını karşılaştırın veya çift sertifikalı malzeme isteyin. Başlıklar özetlenmiştir; güncel revizyon için ASTM kataloğuna bakın.</p>
        ${refs([['astmListe', 'ASTM paslanmaz standart başlıkları.'], ['a645', 'A645/A645M kapsamı.'], ['a681', 'Takım çeliği UNS numaraları.'], ['takimEsd', 'Takım çeliği W.Nr karşılıkları.'], ['dokmeEsd', 'Dökme demir eşdeğerleri.']])}
      </div>`;
  }

  // Çelik kartında kısa ASTM/UNS satırı
  function celikSatir(c) {
    const t = x => norm(x).replace(/\(≈\)|≈/g, '');
    const L = KALITE.filter(q => [c.kod, c.wnr].some(k => t(q.wnr) === t(k)));
    if (!L.length) return '';
    const { esc } = U();
    return `<p><b>ASTM / UNS karşılığı:</b> ${L.map(q => `${esc(q.ad)} (UNS ${esc(q.uns)}) – ${esc(q.astm.slice(0, 4).join(', '))}`).join('; ')} <button class="linkbtn small" data-kod-git="${esc(L[0].ad)}">kod çözücüde aç ›</button></p>`;
  }

  // Olaylar
  if (typeof document !== 'undefined') {
    const guncelle = () => { const el = document.getElementById('kodSonuc'); if (el) el.innerHTML = sonucHtml(coz(U().S().kodAra)); };
    document.addEventListener('input', e => {
      if (e.target.id !== 'kodGir') return;
      U().S().kodAra = e.target.value; U().save(); guncelle();
    });
    document.addEventListener('click', e => {
      const o = e.target.closest('[data-kod-ornek]');
      if (o) { const s = U().S(); s.kodAra = o.dataset.kodOrnek; U().save(); const i = document.getElementById('kodGir'); if (i) { i.value = s.kodAra; i.scrollIntoView({ block: 'center', behavior: 'smooth' }); } guncelle(); return; }
      const kg = e.target.closest('[data-kod-git]');
      if (kg) { const s = U().S(); s.mSekme = 'kod'; s.kodAra = kg.dataset.kodGit; U().changed(true); window.scrollTo(0, 0); return; }
      const k = e.target.closest('[data-kart-git]');
      if (k) {
        const s = U().S(); const C = g.MVERI.CELIK; const c = C.find(x => x.kod === k.dataset.kartGit); if (!c) return;
        s.mSekme = 'celik'; s.celikGrup = c.gid; s.celikSec = c.kod; U().changed(true); window.scrollTo(0, 0); return;
      }
      const a = e.target.closest('[data-al-git]');
      if (a) {
        const s = U().S(); const m = g.MVERI.ALUMINYUM.find(x => x.kod === a.dataset.alGit); if (!m) return;
        s.mSekme = 'al'; s.alSeri = String(m.seri); s.alSec = m.kod; U().changed(true); window.scrollTo(0, 0); return;
      }
      const p = e.target.closest('[data-kap-git]');
      if (p) {
        const s = U().S(); const kap = g.MVERI.KAPLAMA.find(x => x.id === p.dataset.kapGit); if (!kap) return;
        s.mSekme = 'kaplama'; s.kTaban = kap.taban[0]; U().changed(true);
        setTimeout(() => { const el = document.getElementById('kc_' + kap.id); if (el) el.scrollIntoView({ block: 'start' }); }, 50);
      }
    });
  }

  const out = { REF3, SPEC, KAP_SPEC, ASTM, KALITE, coz, not, blok, kodSekme, celikSatir, secim };
  g.KSPEC = out;
  if (g.DATA) Object.assign(g.DATA.REF, REF3);
  if (typeof module !== 'undefined') module.exports = out;
})(typeof window !== 'undefined' ? window : globalThis);
