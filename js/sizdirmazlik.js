/* Genel sızdırmazlık modülü: tasarım kuralları, ürün seçimi (silikon, sıvı conta,
   diş sızdırmazlık, konformal kaplama, dolgu, havalandırma membranı, boya), IP sınıfı,
   desikant (harici hesaplayıcıya yönlendirme), tedarikçiler ve eğitim. */
(function (g) {
  'use strict';
  const U = () => g.UI;
  const DESIC = 'https://utkubayram.com/desic/';

  const REF = {
    iec60529: { kisa: 'IEC 60529 (IP kodu)', ad: 'IEC 60529 – Muhafazaların sağladığı koruma dereceleri (IP kodu). Özet tablo: Wikipedia “IP code”; ISO 20653 IPX9K', url: 'https://en.wikipedia.org/wiki/IP_code' },
    ipRehber: { kisa: 'IP sınıfı rehberi', ad: 'indEx Enclosures – IP ratings guide: ikinci hane kümülatif değildir (IP67, IP65/66 jet testini kapsamaz); çift sınıflandırma (IP66/IP68)', url: 'https://indexenclosures.com/ip-ratings-guide/' },
    dow732: { kisa: 'DOWSIL 732', ad: 'DOWSIL 732 Multi-Purpose Sealant – tek bileşenli asetoksi RTV silikon, −60…+180 °C (kısa süreli +205 °C), MIL-A-46106 Type I', url: 'https://www.aerospheres.com/products/sealants/dowsil-732-aluminium-90ml-tube-sealant/' },
    dowSec: { kisa: 'Dow silikon seçim tablosu', ad: 'Dow silikon yapıştırıcı/sızdırmazlık seçim tablosu: 732 asetoksi, 736 yüksek sıcaklık (−65…+260, kısa +315 °C), 738 alkoksi elektrik sızdırmazlığı (−62…+180 °C)', url: 'https://products.robertmckeown.com/viewitems/silicone-adhesive-sealants/industrial-adhesives-sealants' },
    loc5699: { kisa: 'LOCTITE SI 5699', ad: 'LOCTITE SI 5699 – oksim silikon sıvı conta, esnek flanş, metal ve plastik, −60…+200 °C, nemle kürlenir', url: 'https://qas.bmgworld.net/bmg/en/ZAR/All-Categories/Sealants/Gasket/LOC-5699-70/p/LOC%205699-70' },
    loc518: { kisa: 'LOCTITE 518', ad: 'LOCTITE 518 – anaerobik flanş sızdırmazlığı (rijit metal flanşlar: Al, çelik, paslanmaz, dökme demir), −55…+150 °C, en fazla ≈ 0,25 mm boşluk', url: 'https://www.mcmaster.com/sealants/manufacturer-model-number~518' },
    loc577: { kisa: 'LOCTITE 577', ad: 'LOCTITE 577 – orta mukavemetli diş sızdırmazlığı, M80 / R3’e kadar, −55…+150 °C, kürlenmiş halde 200 bar üzeri', url: 'https://uk.rs-online.com/web/p/pipe-sealants/0514571' },
    hs1b31: { kisa: 'HumiSeal 1B31 TDS', ad: 'HumiSeal 1B31 akrilik konformal kaplama TDS – MIL-I-46058C, IPC-CC-830, −65…+125 °C, UV’de floresan, onarılabilir; önerilen kalınlık 25–75 µm', url: 'https://cdnresources.chasecorp.com/7RYJKHTS/as/gb8x8w8x7wkbrmfc83vkbk/1B31_HumiSeal_Technical_Data_Sheet' },
    syl184: { kisa: 'SYLGARD 184 TDS', ad: 'SYLGARD 184 silikon elastomer TDS – iki bileşen 10:1, şeffaf dolgu (potting), −45…+200 °C, kür ≈ 48 saat oda sıcaklığı / 45 dk 100 °C', url: 'https://www.cnfusers.cornell.edu/sites/default/files/Equipment-Resources/Sylgard_184_data_sheet.pdf' },
    goreVent: { kisa: 'GORE Protective Vents', ad: 'GORE Protective Vents – ePTFE membran; kapalı muhafazada basıncı dengeler, yoğuşmayı azaltır, sıvı ve partikülü dışarıda tutar; IP67/IP68 (vidalı seride IP69K)', url: 'https://www.gore.com/node/34066' },
    goreYap: { kisa: 'GORE yapışkanlı vent', ad: 'GORE VE7/VE8/VE9 yapışkanlı vent: IP64–IP68, −40…+85 °C; test öncesi 24–72 saat bekleme önerisi', url: 'https://rstech.co.il/en/companies/gore/products/vent-oe-adhesive' },
    mil23377: { kisa: 'MIL-PRF-23377 astar', ad: 'MIL-PRF-23377 epoksi astar: kromat dönüşüm (MIL-DTL-5541) veya eloksal üzerine, MIL-PRF-85285 poliüretan son kat altında', url: 'https://industrial.sherwin-williams.com/emeai/gb/en/aerospace/catalog/product/products-by-industry.18126004/mil-prf-23377k-class-c2-2k-epoxy-primer.9542107.html' },
    desic: { kisa: 'DESIC – Desikant Hesaplayıcı', ad: 'DESIC – Desikant Hesaplayıcı (utkubayram.com): ambalaj miktarı ve hedef neme göre canlı desikant hesabı, MIL-STD-2073 referanslı', url: DESIC }
  };
  if (g.DATA && g.DATA.REF) Object.assign(g.DATA.REF, REF);

  // ---------------- Ürünler ----------------
  const UYG = [
    ['hepsi', 'Hepsi'], ['flans', 'Kapak / flanş arası'], ['dis', 'Diş, rakor, tapa'], ['kart', 'Elektronik kart'],
    ['kablo', 'Kablo girişi, konnektör'], ['dolgu', 'Komple dolgu (potting)'], ['havalandirma', 'Basınç dengeleme'], ['boya', 'Boya / korozyon']
  ];
  const URUN = [
    { ad: 'DOWSIL 732', tip: 'RTV silikon (asetoksi)', uyg: ['flans', 'kablo'], T: [-60, 180], tepe: 205, ref: 'dow732',
      kur: 'Havadaki nemle; yüzey ≈ 7 dk’da kabuk bağlar', std: 'MIL-A-46106 Type I',
      not: 'Genel amaçlı yapıştırma ve sızdırmazlık. Kürlenirken asetik asit (sirke kokusu) çıkarır: bakır, elektronik ve hassas metal yüzeylere yakın kapalı hacimlerde nötr kürlü (alkoksi / oksim) bir silikon tercih edin.' },
    { ad: 'DOWSIL 738', tip: 'RTV silikon (alkoksi, nötr kür)', uyg: ['kablo', 'kart', 'flans'], T: [-62, 180], ref: 'dowSec',
      kur: 'Havadaki nemle', std: '–', not: 'Elektrik ve elektronik uygulamalar için sızdırmazlık silikonu; kürlenirken aşındırıcı yan ürün çıkarmaz. Konnektör çevresi, kablo girişi, kart kenarı.' },
    { ad: 'DOWSIL 736', tip: 'Yüksek sıcaklık RTV silikon', uyg: ['flans'], T: [-65, 260], tepe: 315, ref: 'dowSec',
      kur: 'Havadaki nemle', std: '–', not: 'Fırın, egzoz, ısıtıcı gibi sürekli yüksek sıcaklıktaki yüzeylerde.' },
    { ad: 'LOCTITE SI 5699', tip: 'Silikon sıvı conta (oksim)', uyg: ['flans'], T: [-60, 200], ref: 'loc5699',
      kur: 'Havadaki nemle', std: '–', not: 'Sac kapak dahil her tür flanşta, metal ve plastik yüzeylerde yerinde conta (FIPG). Esnek kalır; titreşimli ve hareketli flanşlara uygun.' },
    { ad: 'LOCTITE 518', tip: 'Anaerobik flanş sızdırmazlığı', uyg: ['flans'], T: [-55, 150], ref: 'loc518',
      kur: 'Havasız ortamda, metal temasıyla (anaerobik)', std: '–', not: 'İşlenmiş rijit metal flanşlar (Al, çelik, paslanmaz, dökme demir). En fazla ≈ 0,25 mm boşluk doldurur. Flanş dışında kalan kısım kürlenmez, silinir. Plastik ve esnek sac kapaklar için uygun değildir.' },
    { ad: 'LOCTITE 577', tip: 'Anaerobik diş sızdırmazlığı', uyg: ['dis'], T: [-55, 150], ref: 'loc577',
      kur: 'Havasız ortamda, metal temasıyla', std: '–', not: 'Boru dişleri, rakor, tapa ve kör deliğe açılan cıvatalar. M80 / R3’e kadar. Hem sızdırmaz hem kilitler; orta mukavemet (el aletiyle sökülür).' },
    { ad: 'HumiSeal 1B31', tip: 'Akrilik konformal kaplama (sprey / fırça / daldırma)', uyg: ['kart'], T: [-65, 125], ref: 'hs1b31',
      kur: 'Çözücü buharlaşarak; tam özellik 7 günde', std: 'MIL-I-46058C, IPC-CC-830', not: 'Elektronik kartı nem ve kirliliğe karşı 25–75 µm’lik ince bir filmle korur. UV ışıkta parlar (kontrol kolay), onarılabilir. Aerosol sprey ambalajı vardır. Konnektörler ve test noktaları maskelenir.' },
    { ad: 'SYLGARD 184', tip: 'Silikon dolgu / potting (iki bileşen)', uyg: ['dolgu', 'kablo'], T: [-45, 200], ref: 'syl184',
      kur: '10:1 karışım; ≈ 48 saat oda sıcaklığında veya 45 dk 100 °C', std: 'UL 94 V-0/V-1', not: 'Elektronik modülü, sensörü veya konnektör arkasını tamamen kauçukla doldurur; nem, titreşim ve darbeye karşı en güçlü koruma. Şeffaftır. Onarım zordur.' },
    { ad: 'GORE Protective Vent', tip: 'ePTFE havalandırma membranı', uyg: ['havalandirma'], T: [-40, 85], ref: 'goreVent',
      kur: 'Yapışkanlı, geçmeli veya vidalı montaj', std: 'IEC 60529 IP67 / IP68 (vidalı seride IP69K)', not: 'Kapalı kutuda ısınma–soğumayla oluşan basınç farkını dengeler, contayı zorlamaz; nemli havanın içeri “pompalanmasını” ve yoğuşmayı azaltır. Su ve tozu geçirmez. Sıcaklık aralığı yapışkanlı seri içindir.' },
    { ad: 'MIL-PRF-23377 + MIL-PRF-85285', tip: 'Epoksi astar + poliüretan son kat', uyg: ['boya'], T: null, ref: 'mil23377',
      kur: 'İki bileşenli, sprey', std: 'MIL-PRF-23377 / MIL-PRF-85285', not: 'Alüminyumda kromat dönüşüm kaplaması (MIL-DTL-5541) veya eloksal üzerine epoksi astar, üzerine poliüretan son kat: askeri / havacılık dış ortam korozyon sistemi. Conta temas yüzeylerini ve EMI yüzeylerini maskeleyin.' }
  ];

  // ---------------- IP ----------------
  const IP1 = [['0', 'Korumasız'], ['1', '> 50 mm katı cisim (el sırtı)'], ['2', '> 12,5 mm (parmak)'], ['3', '> 2,5 mm (alet)'], ['4', '> 1 mm (tel)'], ['5', 'Toza karşı korumalı (sınırlı giriş, zararsız)'], ['6', 'Toz geçirmez']];
  const IP2 = [['0', 'Korumasız'], ['1', 'Dikey damlayan su'], ['2', '15° eğik damlayan su'], ['3', 'Püskürtme su (60°’ye kadar)'], ['4', 'Her yönden sıçrayan su'], ['5', 'Su jeti (6,3 mm nozul)'], ['6', 'Güçlü su jeti (12,5 mm nozul)'], ['7', 'Geçici daldırma (15 cm – 1 m, 30 dk)'], ['8', 'Sürekli daldırma (1 m üzeri, üretici koşulu)'], ['9K', 'Yüksek basınçlı sıcak su jeti (ISO 20653)']];

  // ---------------- Görseller ----------------
  const INK = '#1d2326', GRI = '#7d8b8f', MAVI = '#1f5f99', TUR = '#d9622b', KIR = '#b23a3a', YES = '#2f7d4f';
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 12}" text-anchor="${o.a || 'middle'}" fill="${o.c || INK}" ${o.b ? 'font-weight="700"' : ''}>${s}</text>`;
  function kutuSvg() {
    // Sızıntı yolları: kapak, cıvata, kablo girişi, konnektör, buton, havalandırma
    const nok = [[150, 52, 'Kapak contası'], [70, 52, 'Cıvata deliği'], [40, 140, 'Kablo girişi'], [300, 120, 'Konnektör'], [215, 52, 'Buton / ekran'], [300, 180, 'Havalandırma'], [170, 205, 'Döküm gözeneği / kaynak']];
    return `<svg class="cizim egit-svg" viewBox="0 0 540 240" role="img" aria-label="Sızıntı yolları">
      <rect x="40" y="60" width="260" height="140" rx="8" fill="#eef1ee" stroke="${INK}" stroke-width="2"/>
      <rect x="34" y="46" width="272" height="16" rx="4" fill="#cfd6d2" stroke="${INK}" stroke-width="1.5"/>
      <rect x="44" y="60" width="252" height="4" fill="${TUR}"/>
      ${[70, 270].map(x => `<rect x="${x - 4}" y="38" width="8" height="30" fill="#7d8b8f" stroke="${INK}"/>`).join('')}
      <rect x="18" y="132" width="24" height="16" fill="#555f63"/><path d="M0 140 H18" stroke="#555f63" stroke-width="5"/>
      <rect x="298" y="110" width="18" height="26" fill="#555f63"/>
      <rect x="200" y="42" width="30" height="6" rx="3" fill="${MAVI}"/>
      <circle cx="300" cy="180" r="7" fill="#fff" stroke="${INK}"/>
      ${nok.map(([x, y, s], i) => `<circle cx="${x}" cy="${y}" r="9" fill="${KIR}"/>${T(x, y + 4, i + 1, { s: 10, c: '#fff', b: 1 })}`).join('')}
      ${nok.map(([, , s], i) => T(345, 34 + i * 28, `${i + 1}. ${s}`, { a: 'start', s: 12 })).join('')}
    </svg>`;
  }
  function pompaSvg() {
    return `<svg class="cizim egit-svg" viewBox="0 0 520 195" role="img" aria-label="Basınç pompalama etkisi">
      ${[['Gündüz: ısınır', 'iç basınç ↑', 'hava dışarı', 40, TUR], ['Gece: soğur', 'iç basınç ↓ (vakum)', 'nemli hava içeri', 290, MAVI]].map(([a, b, c, x, cc]) => `
        <rect x="${x}" y="40" width="190" height="90" rx="8" fill="#eef1ee" stroke="${INK}" stroke-width="1.8"/>
        ${T(x + 95, 28, a, { b: 1 })}${T(x + 95, 82, b, { c: cc, b: 1 })}${T(x + 95, 186, c, { s: 11, c: GRI })}
        <path d="M${x + 95} 130 V${cc === TUR ? 160 : 132}" stroke="${cc}" stroke-width="0"/>`).join('')}
      <path d="M135 128 V160" stroke="${TUR}" stroke-width="2.5" marker-end="url(#sz-a1)"/>
      <path d="M385 162 V132" stroke="${MAVI}" stroke-width="2.5" marker-end="url(#sz-a2)"/>
      <defs><marker id="sz-a1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1 L10 5 L0 9z" fill="${TUR}"/></marker>
      <marker id="sz-a2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1 L10 5 L0 9z" fill="${MAVI}"/></marker></defs>
    </svg>`;
  }

  // ---------------- Sekmeler ----------------
  function genel() {
    const { refs } = U();
    const K = [
      ['🎯', 'Önce hedef koruma sınıfını belirleyin', 'Kutunun nerede çalışacağına göre IP sınıfını seçin (ör. iç ortam IP54, dış ortam IP65/IP66, suya batabilecek ise IP67/IP68). Tüm diğer kararlar bu hedefe göre verilir. IP67, IP65/66 jet testini kendiliğinden kapsamaz; ikisi de gerekiyorsa IP66/IP67 gibi çift sınıf isteyin.', [['iec60529', ''], ['ipRehber', '']]],
      ['🕳️', 'Her açıklık bir sızıntı yoludur', 'Kapak birleşimi, cıvata delikleri, kablo girişleri, konnektörler, butonlar, ekran camı, havalandırma ve döküm gözenekleri tek tek listelenip her biri için bir çözüm seçilmelidir. Zincirin en zayıf halkası sınıfı belirler.', []],
      ['⭕', 'Kapak – gövde birleşimi', 'Sökülecek kapakta kanallı O-ring veya conta (Conta modülü), sökülmeyecek veya düz yüzeyli kapakta yerinde sıvı conta (FIPG) kullanın. Cıvata delikleri conta hattının dışında kalmalıdır; aksi halde her cıvata bir sızıntı yolu olur.', [['loc5699', ''], ['loc518', '']]],
      ['🔩', 'Diş ve kör delikler', 'Gövde içine açılan (boydan boya) dişli delikler sızdırır: mümkünse kör delik kullanın. Boydan boya ise diş sızdırmazlığı (anaerobik) veya contalı (O-ring’li) cıvata / pul kullanın.', [['loc577', '']]],
      ['🔌', 'Kablo ve konnektörler', 'Kablolar IP sınıfı belirtilmiş kablo rakoruyla girmeli; rakor ve kablo çapı uyumlu seçilmelidir. Panel konnektörleri arka somunlu ve panel contalı olmalı. Gerekirse arka taraf dolgu malzemesiyle doldurulur.', [['syl184', '']]],
      ['🌬️', 'Kutunun nefes alması (basınç dengeleme)', 'Tamamen kapalı bir kutu gündüz ısınıp gece soğudukça içi basınçlanır ve vakuma düşer. Bu fark contayı zorlar ve zamanla nemli havayı içeri çeker; içeride yoğuşma oluşur. Membranlı havalandırma (vent) basıncı dengeler, suyu ve tozu geçirmez.', [['goreVent', '']]],
      ['💧', 'Nem ve yoğuşma', 'Kapalı kutuda kalan nem soğuk yüzeylerde yoğuşur. Çözümler: montajı kuru ortamda yapmak, desikant (nem alıcı) koymak, elektronik kartı konformal kaplamak, gerekirse en alt noktaya drenaj / vent koymak.', [['desic', ''], ['hs1b31', '']]],
      ['🧪', 'Malzeme uyumu ve korozyon', 'Sızdırmazlık malzemesinin sıcaklık aralığı ve ortamla (yağ, yakıt, UV, tuzlu su) uyumu kontrol edilmelidir. Asetoksi silikonlar kürlenirken asit çıkarır; elektroniğe yakın kapalı hacimlerde nötr kürlü ürün seçin. Dış yüzeyler kaplama / boya ile korunur.', [['dowSec', ''], ['mil23377', '']]],
      ['🧽', 'Yüzey hazırlığı', 'Sıvı conta, silikon ve kaplamalar temiz, yağsız ve kuru yüzeye uygulanır (ör. izopropil alkol ile silme). Üretici gerektiriyorsa astar (primer) kullanılır. Yüzey hazırlığı atlanırsa yapışma ve sızdırmazlık zayıflar.', [['hs1b31', '']]],
      ['⏱️', 'Kür süresine uyun', 'Silikon ve dolgular tam kürlenmeden teste veya sahaya çıkarılmamalıdır. Kür süresi kalınlık ve sıcaklığa bağlıdır; üreticinin veri sayfasındaki süreyi esas alın.', [['syl184', ''], ['goreYap', '']]],
      ['✅', 'Doğrulama testi', 'Tasarımı hedef IP sınıfının testine göre (sprey, jet, daldırma) deneyin. Seri üretimde basınç veya vakum düşümü ile sızdırmazlık kontrolü yapılabilir.', [['iec60529', '']]]
    ];
    return `<div class="grid2">
        <div class="card"><h3>Tipik sızıntı yolları</h3>${kutuSvg()}<p class="small">Her numaralı nokta ayrı bir sızdırmazlık çözümü ister.</p></div>
        <div class="card"><h3>Kutunun “pompalama” etkisi</h3>${pompaSvg()}<p class="small">Kapalı kutu, sıcaklık değiştikçe nemli havayı içeri çeker. Membranlı havalandırma bu farkı dengeler.</p></div>
      </div>
      <div class="sz-kurallar">${K.map(([ik, b, m, r], i) => `<div class="card sz-kural"><div class="sz-ik">${ik}</div><div><h3>${i + 1}. ${b}</h3><p>${m}</p>${r.length ? refs(r) : ''}</div></div>`).join('')}</div>`;
  }

  function urunListe(s) {
    const { esc, refs } = U();
    const tmin = s.szTmin, tmax = s.szTmax;
    const L = URUN.map(u => {
      const uy = s.szUyg === 'hepsi' || u.uyg.includes(s.szUyg);
      const sic = !u.T || (tmin >= u.T[0] && tmax <= u.T[1]);
      return { ...u, uy, sic };
    }).filter(u => u.uy).sort((a, b) => (b.sic - a.sic));
    return `<div class="sz-urunler">${L.map(u => `<div class="card sz-urun ${u.sic ? '' : 'soluk'}">
        <div class="sz-urun-bas"><h3>${esc(u.ad)}</h3><span class="rozet">${esc(u.tip)}</span></div>
        <div class="kv">
          <div><b>${u.T ? `${u.T[0]} … +${u.T[1]} °C` : '–'}</b><span>sürekli sıcaklık${u.tepe ? ` (kısa süreli +${u.tepe} °C)` : ''}</span></div>
          <div><b>${esc(u.std)}</b><span>standart / onay</span></div>
        </div>
        ${u.sic ? '' : `<div class="madde dikkat">⚠ Proje sıcaklığı (${tmin} … ${tmax} °C) bu ürünün aralığının dışında.</div>`}
        <p>${esc(u.not)}</p>
        <p class="small"><b>Kür:</b> ${esc(u.kur)}</p>
        ${refs([[u.ref, 'Ürün veri kaynağı.']])}
      </div>`).join('')}</div>`;
  }
  function urun(s) {
    const { esc } = U();
    return `<div class="card"><h3>Nereyi sızdırmaz yapacaksınız?</h3>
      <div class="seg wrap" data-bind="szUyg">${UYG.map(([k, a]) => `<button data-v="${k}">${esc(a)}</button>`).join('')}</div>
      <div class="row4 mt">
        <label>En düşük sıcaklık (°C)<input type="number" step="5" data-num="szTmin"></label>
        <label>En yüksek sıcaklık (°C)<input type="number" step="5" data-num="szTmax"></label>
        <div style="grid-column: span 2" class="small">Sıcaklık aralığına uymayan ürünler soluk gösterilir. Değerler üretici veri sayfalarından alınmıştır; seçmeden önce güncel veri sayfasını kontrol edin.</div>
      </div></div>
      <div id="szUrunList">${urunListe(s)}</div>
      <p class="small">Marka ve ürün adları örnek olarak verilmiştir; eşdeğer ürünler de kullanılabilir. Ürün seçiminden önce üreticinin güncel teknik veri sayfasını (TDS) inceleyin.</p>`;
  }

  function ip(s) {
    const { esc, refs } = U();
    const a = IP1.find(x => x[0] === s.ip1) || IP1[6], b = IP2.find(x => x[0] === s.ip2) || IP2[7];
    const ornek = { '54': 'İç ortam endüstriyel pano', '65': 'Dış ortam, yağmur', '66': 'Dış ortam, yıkama / dalga', '67': 'Geçici olarak suya batabilir', '68': 'Sürekli su altında' };
    return `<div class="card"><h3>IP kodu seçici</h3>
      <div class="ip-kod"><span>IP</span><b>${a[0]}</b><b>${b[0]}</b></div>
      <div class="grid2 mt">
        <div><div class="small"><b>1. hane – katı cisim ve toz</b></div><div class="ip-liste" data-bind="ip1">${IP1.map(([k, m]) => `<button data-v="${k}"><b>${k}</b> ${esc(m)}</button>`).join('')}</div></div>
        <div><div class="small"><b>2. hane – su</b></div><div class="ip-liste" data-bind="ip2">${IP2.map(([k, m]) => `<button data-v="${k}"><b>${k}</b> ${esc(m)}</button>`).join('')}</div></div>
      </div>
      <div class="karar iyi mt"><span class="ikon">🛡️</span><div><b>IP${a[0]}${b[0]}</b>${esc(a[1])} · ${esc(b[1])}${ornek[a[0] + b[0]] ? ` — örnek: ${esc(ornek[a[0] + b[0]])}` : ''}</div></div>
      <ul class="liste mt">
        <li>İkinci hane <b>6’ya kadar</b> birikimlidir (IPX6, IPX5’i de sağlar). <b>7 ve 8 daldırma</b> testidir ve jet testlerini kapsamaz: hem jet hem daldırma gerekiyorsa <b>IP66/IP67</b> gibi çift sınıf isteyin.</li>
        <li>IP sınıfı yalnızca tatlı su ve toz içindir; yağ, kimyasal, tuzlu su ve UV dayanımı ayrıca değerlendirilir.</li>
        <li>Muhafazanın IP sınıfı, en zayıf parçası kadardır: kablo rakoru, konnektör ve vent de aynı sınıfta olmalıdır.</li>
      </ul>
      ${refs([['iec60529', 'IP kodu tanımları.'], ['ipRehber', 'İkinci hanenin birikimli olmaması, çift sınıf.']])}
    </div>`;
  }

  function desikant() {
    const { refs } = U();
    return `<div class="card sz-desic">
      <div class="sz-desic-ic">
        <div class="sz-desic-ikon">🧂</div>
        <div><h3>Desikant (nem alıcı) hesabı</h3>
          <p>Kapalı kutu veya ambalaj içinde kalan nem, sıcaklık düştüğünde yoğuşur ve korozyon, kısa devre, buğulanma yapar. Desikant torbası bu nemi emer. Gereken miktar; kutu / ambalaj hacmine, ambalaj malzemesinin nem geçirgenliğine, hedef bağıl neme ve saklama süresine bağlıdır.</p>
          <p>Hesap için ayrı bir araç kullanıyoruz: <b>DESIC – Desikant Hesaplayıcı</b>. Ambalaj miktarı ve hedef neme göre canlı hesap yapar ve MIL-STD-2073’e dayanır.</p>
          <a class="sz-buton" href="${DESIC}" target="_blank" rel="noopener">DESIC hesaplayıcıyı aç ↗</a>
          <p class="small mt">Harici bir sitedir (utkubayram.com); hesap sonuçları o araca aittir.</p>
        </div>
      </div>
      <ul class="liste mt">
        <li>Desikantı kutuyu kapatmadan hemen önce, ambalajından çıkarıp koyun; açık havada beklerse nemi doldurur.</li>
        <li>Kutu tamamen sızdırmazsa desikant uzun süre dayanır; membranlı vent varsa nem alışverişi sürer, desikant daha çabuk dolar.</li>
        <li>Nem gösterge kartı ile desikantın doyup doymadığını kontrol edebilirsiniz.</li>
      </ul>
      ${refs([['desic', 'Desikant hesaplayıcı.']])}
    </div>`;
  }

  const TEDARIK = {
    turkiye: [
      { ad: 'Türk Henkel (LOCTITE, TEROSON, BONDERITE)', bolge: 'İstanbul (Tuzla, Gebze)', odak: 'Loctite sıvı conta, diş sızdırmazlık, yapıştırıcılar Türkiye’de üretiliyor; satış yetkili bayiler üzerinden.', web: 'https://www.henkel-adhesives.com', kaynak: 'https://turkchem.net/en/sektorden/yapistirici-ve-mastik/turk-henkel-65-milyon-avro-tutarinda-yatirim-gerceklestirdi', tags: ['Loctite', 'Üretici'] },
      { ad: 'Farnell Türkiye', bolge: 'Çevrim içi', odak: 'DOWSIL / SYLGARD silikonlar, elektronik kimyasalları; Türkiye’ye gönderim.', web: 'https://tr.farnell.com/b/dow', kaynak: 'https://tr.farnell.com/b/dow', tags: ['Dow', 'Distribütör'] },
      { ad: 'Conro Electronics (Türkçe site)', bolge: 'Çevrim içi (İngiltere çıkışlı)', odak: 'HumiSeal konformal kaplamalar, DOWSIL dolgular; dünya geneline gönderim.', web: 'https://www.conro.com/tr/brands/humiseal/humiseal-1b31s-acrylic-conformal-coating', kaynak: 'https://www.conro.com/tr/brands/humiseal/humiseal-1b31s-acrylic-conformal-coating', tags: ['HumiSeal', 'Dow', 'Distribütör'] }
    ],
    dunya: [
      { ad: 'Henkel Adhesive Technologies – distribütör bulucu', bolge: 'Dünya', odak: 'LOCTITE yetkili distribütörlerini ülkeye göre bulma.', web: 'https://next.henkel-adhesives.com/tw/en/support/find-a-distributor.html', kaynak: 'https://next.henkel-adhesives.com/tw/en/support/find-a-distributor.html', tags: ['Loctite'] },
      { ad: 'Dow (DOWSIL, SYLGARD)', bolge: 'Dünya', odak: 'Silikon sızdırmazlık, dolgu, konformal kaplama üreticisi.', web: 'https://www.dow.com/electronics', kaynak: 'https://www.newark.com/b/dow', tags: ['Üretici', 'Silikon'] },
      { ad: 'HumiSeal (Chase Corp.)', bolge: 'Dünya', odak: 'Konformal kaplama üreticisi; akrilik, poliüretan, silikon, UV kürlü.', web: 'https://chasecorp.com/HumiSeal/', kaynak: 'https://cdnresources.chasecorp.com/7RYJKHTS/as/gb8x8w8x7wkbrmfc83vkbk/1B31_HumiSeal_Technical_Data_Sheet', tags: ['Üretici', 'Kaplama'] },
      { ad: 'W. L. Gore & Associates', bolge: 'Dünya', odak: 'Protective Vents – basınç dengeleme membranları.', web: 'https://www.gore.com/node/34066', kaynak: 'https://www.gore.com/node/34066', tags: ['Üretici', 'Vent'] },
      { ad: 'Silmid', bolge: 'İngiltere', odak: 'Havacılık / savunma sızdırmazlık ürünleri, MIL onaylı silikonlar (ör. DOWSIL 732 MIL-A-46106).', web: 'https://www.silmid.com', kaynak: 'https://www.silmid.com/es/silicones/silicone-rtv/dow-corning-732-rtv-black-90ml-tube-mil-a-46106b-type-1/', tags: ['Distribütör', 'MIL'] },
      { ad: 'Sherwin-Williams Aerospace', bolge: 'Dünya', odak: 'MIL-PRF-23377 astar, MIL-PRF-85285 son kat boyaları.', web: 'https://industrial.sherwin-williams.com', kaynak: 'https://industrial.sherwin-williams.com/emeai/gb/en/aerospace/catalog/product/products-by-industry.18126004/mil-prf-23377k-epoxy-primer.10663142.html', tags: ['Üretici', 'Boya'] }
    ]
  };
  function tedarik() {
    const { esc } = U();
    const benim = g.TOP ? g.TOP.tedarikciler().filter(t => String(t.grup).startsWith('sz_')) : [];
    const kart = (t, sira) => `<div class="card sup ${t.kullanici ? 'benim' : ''}">
      <h3><span class="sira">${t.kullanici ? '＋' : sira}</span>${esc(t.ad)}</h3><div class="where">${esc(t.bolge || '')}${t.kullanici ? ' <span class="rozet">Eklediğiniz</span>' : ''}</div>
      <div class="tags">${(t.tags || []).map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>
      <p>${esc(t.odak || '')}</p>${t.not ? `<p class="small">📝 ${esc(t.not)}</p>` : ''}
      <div class="contact">${t.web ? `<a href="${esc(t.web)}" target="_blank" rel="noopener">🌐 Web</a>` : ''}${(t.tel || []).map(x => `<span>📞 ${esc(x)}</span>`).join('')}${t.eposta ? `<a href="mailto:${esc(t.eposta)}">✉️ ${esc(t.eposta)}</a>` : ''}
        ${t.kullanici ? `<button class="mini" data-szsil="${t.id}">Sil</button>` : `<a class="ref" href="${esc(t.kaynak)}" target="_blank" rel="noopener">Bilgi kaynağı ↗</a>`}</div>
    </div>`;
    return `<div class="card"><h3>Sızdırmazlık malzemesi tedarikçileri</h3>
        <p class="hint">Silikon, sıvı conta, kaplama, dolgu ve vent ürünleri. O-ring ve conta üreticileri için Conta modülündeki Tedarikçiler sayfasına bakın. Ankara’daki yerel bayileri doğrulayamadım; bildiğiniz firmaları aşağıdan ekleyebilirsiniz.</p>
        <div class="ted-ekle-bar"><button class="primary" id="szEkleAc">＋ Tedarikçi ekle</button></div><div id="szForm"></div></div>
      ${benim.length ? `<h3 class="mt">Eklediğiniz firmalar</h3><div class="grid2">${benim.map(t => kart(t)).join('')}</div>` : ''}
      <h3 class="mt">Türkiye’den erişilebilenler</h3><div class="grid2">${TEDARIK.turkiye.map((t, i) => kart(t, i + 1)).join('')}</div>
      <h3 class="mt">Dünya (üretici ve büyük distribütörler)</h3><div class="grid2">${TEDARIK.dunya.map((t, i) => kart(t, i + 1)).join('')}</div>`;
  }

  // ---------------- Render ----------------
  function render(yap) {
    const { $, S, syncControls } = U(); const s = S();
    if (!yap && $('#modulAlan .szmodul')) {
      if (s.szSekme === 'urun') { const el = $('#szUrunList'); if (el) { el.innerHTML = urunListe(s); syncControls(); } }
      if (s.szSekme === 'ip') { const el = $('#szIcerik'); if (el) { el.innerHTML = ip(s); syncControls(); } }
      return;
    }
    const sek = s.szSekme || 'genel';
    const icerik = sek === 'urun' ? urun(s) : sek === 'ip' ? ip(s) : sek === 'desikant' ? desikant() : sek === 'tedarik' ? tedarik() : sek === 'egitim' ? g.EGITIM.html('sizdirmazlik') : genel();
    $('#modulAlan').innerHTML = `<div class="szmodul">
      <div class="modbaslik"><button class="ghost" data-modul-git="ana">← Ana menü</button><h2>Sızdırmazlık <span class="gelis">(geliştirme aşamasında)</span></h2></div>
      <div class="seg wrap" data-bind="szSekme"><button data-v="genel">Genel kurallar</button><button data-v="urun">Silikon, sıvı conta, kaplama</button><button data-v="ip">IP koruma sınıfı</button><button data-v="desikant">Desikant hesabı</button><button data-v="tedarik">Tedarikçiler</button><button data-v="egitim">📘 Eğitim</button></div>
      <div id="szIcerik" class="mt">${icerik}</div>
    </div>`;
    syncControls();
    const ac = $('#szEkleAc');
    if (ac) ac.addEventListener('click', () => {
      const el = $('#szForm');
      el.innerHTML = g.TOP.tedarikciFormu({ grup: 'turkiye' });
      ac.style.display = 'none';
      const kapat = () => { el.innerHTML = ''; ac.style.display = ''; };
      el.querySelector('[data-tedvazgec]').addEventListener('click', kapat);
      el.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();
        const v = Object.fromEntries(new FormData(e.target));
        v.grup = 'sz_' + v.grup;
        const h = g.TOP.tedarikciKaydet(v);
        if (h) { U().toast(h); return; }
        U().toast('Tedarikçi eklendi'); render(true);
      });
    });
    document.querySelectorAll('[data-szsil]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.onay) { g.TOP.tedarikciSil(b.dataset.szsil); U().toast('Silindi'); render(true); }
      else { b.dataset.onay = '1'; b.textContent = 'Emin misiniz?'; }
    }));
  }

  g.SZ = { render, URUN };
})(window);
