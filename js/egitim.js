/* Eğitim sekmeleri: her modül için temel kavramlar, şematik görseller ve kaynaklar.
   Sayısal örnekler uygulamanın kendi veri tablolarından ve hesaplarından üretilir. */
(function (g) {
  'use strict';
  const U = () => g.UI;
  const INK = '#1d2326', GRI = '#7d8b8f', MAVI = '#1f5f99', TUR = '#d9622b', YESIL = '#2f7d4f', KIR = '#b23a3a', ACIK = '#f4f6f4';
  const nf = (v, d = 1) => Number(v).toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 12}" text-anchor="${o.a || 'middle'}" fill="${o.c || INK}" ${o.b ? 'font-weight="700"' : ''}>${s}</text>`;
  const svg = (w, h, body) => `<svg class="cizim egit-svg" viewBox="0 0 ${w} ${h}" role="img"><defs>
    <marker id="eg-a" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L10 5 L0 9 z" fill="${MAVI}"/></marker>
    <marker id="eg-k" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L10 5 L0 9 z" fill="${KIR}"/></marker>
    <pattern id="eg-h" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#aab3b0" stroke-width="1"/></pattern></defs>${body}</svg>`;
  const ok = (x1, y1, x2, y2, c = MAVI, iki = true) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="1.3" ${iki ? `marker-start="url(#${c === KIR ? 'eg-k' : 'eg-a'})"` : ''} marker-end="url(#${c === KIR ? 'eg-k' : 'eg-a'})"/>`;
  const kutu = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 0}" fill="${o.f || 'url(#eg-h)'}" stroke="${o.c || INK}" stroke-width="${o.w || 1.5}"/>`;

  // ---------------- CONTA ----------------
  function conta() {
    const D = g.DATA;
    const bO = D.SIKISTIRMA.oring, bE = D.SIKISTIRMA.oring_emi;
    const ornek = { d: 2.62, h: 2.0 };
    const c = (ornek.d - ornek.h) / ornek.d * 100;
    const kanal = (x, y, b, h) => `<path d="M${x} ${y} V${y + h} H${x + b} V${y}" fill="none" stroke="${INK}" stroke-width="2"/>`;
    return [
      { id: 'c1', t: 'O-ring nasıl sızdırmazlık yapar?',
        g: svg(520, 170, `
          ${[0, 1, 2].map(i => { const x = 30 + i * 170; return kutu(x, 120, 130, 22) + `<rect x="${x + 35}" y="${i ? 72 : 60}" width="60" height="${i ? 48 : 60}" fill="#fff" stroke="none"/>` + `<path d="M${x + 35} 120 V${i ? 72 : 60} H${x + 95} V120" fill="none" stroke="${INK}" stroke-width="1.5"/>` + (i ? kutu(x, 50, 130, 22) : ''); }).join('')}
          <circle cx="95" cy="95" r="24" fill="${TUR}"/>
          <ellipse cx="265" cy="96" rx="27" ry="21" fill="${TUR}"/>
          <ellipse cx="445" cy="96" rx="22" ry="22" fill="${TUR}"/><path d="M420 96 l-18 0" stroke="${MAVI}" stroke-width="3" marker-end="url(#eg-a)"/>
          ${T(95, 30, '1 · Serbest', { b: 1 })}${T(265, 30, '2 · Kapak kapandı: sıkıştı', { b: 1 })}${T(435, 30, '3 · Basınç geldi', { b: 1 })}
          ${T(265, 162, 'Temas basıncı oluşur', { s: 11, c: GRI })}${T(435, 162, 'Karşı duvara itilir', { s: 11, c: GRI })}
          ${T(392, 86, 'P', { c: MAVI, b: 1 })}`),
        x: `<p>O-ring, iki yüzey arasına <b>sıkıştırılarak</b> çalışır. Sıkışan kauçuk geri itmeye çalışır ve yüzeylere temas basıncı uygular; akışkan bu basıncı aşamadığı için geçemez.</p>
          <p>Akışkan basıncı geldiğinde halkayı kanalın karşı duvarına iter. Kauçuk sıvı gibi davrandığı için bu, temas basıncını <b>daha da artırır</b>: O-ring basınç arttıkça kendini daha sıkı kapatır. Bu yüzden basıncın geldiği yön, halkanın kanalda nereye yaslanacağını belirler.</p>`,
        r: [['parker', 'O-ring çalışma prensibi.']] },
      { id: 'c2', t: 'Sıkıştırma oranı (compression) nedir?',
        g: svg(520, 190, `
          ${kanal(60, 40, 110, 100)}<line x1="40" y1="40" x2="190" y2="40" stroke="${INK}" stroke-width="2"/>
          <circle cx="115" cy="90" r="50" fill="none" stroke="${GRI}" stroke-dasharray="5 4"/>
          <ellipse cx="115" cy="90" rx="56" ry="49" fill="${TUR}" opacity=".85"/>
          ${ok(205, 40, 205, 140)}${T(214, 94, 'h', { a: 'start', c: MAVI, b: 1 })}
          ${ok(40, 40, 40, 140, GRI)}${T(30, 30, 'd = kesit', { c: GRI, a: 'start' })}
          ${T(380, 60, 'Sıkıştırma = (d − h) / d', { b: 1, s: 15 })}
          ${T(380, 92, `Örnek: d = ${nf(ornek.d, 2)} mm, h = ${nf(ornek.h, 2)} mm`, { s: 12 })}
          ${T(380, 116, `(${nf(ornek.d, 2)} − ${nf(ornek.h, 2)}) / ${nf(ornek.d, 2)} = %${nf(c, 1)}`, { s: 13, c: TUR, b: 1 })}
          ${T(380, 150, 'Kesit, kanal derinliğine kadar ezilir', { s: 11, c: GRI })}`) +
          g.CIZIM.gosterge({ baslik: 'Statik O-ring', deger: c, maks: 45, birim: '%', cizgiler: [0, 10, 20, 30, 40],
            bolgeler: [[0, bO.bant[0] * 100, 'k', 'sızdırır'], [bO.bant[0] * 100, bO.sev[0] * 100, 's', ''], [bO.sev[0] * 100, bO.sev[2] * 100, 'y', 'ideal'], [bO.sev[2] * 100, bO.bant[1] * 100, 's', ''], [bO.bant[1] * 100, 45, 'k', 'aşırı ezilir']] }),
        x: `<p>Sıkıştırma oranı, O-ring kesitinin <b>yüzde kaçının ezildiğini</b> gösterir: (d − h) / d. Statik yüz contasında uygulama %${nf(bO.sev[0] * 100, 0)}–${nf(bO.sev[2] * 100, 0)} aralığını hedefler; %${nf(bO.bant[0] * 100, 0)} altı ve %${nf(bO.bant[1] * 100, 0)} üstü sınır dışıdır.</p>
          <ul><li><b>Az sıkıştırma:</b> soğukta kauçuk büzülür, toleranslar üst üste binince temas kalmaz → sızdırır.</li>
          <li><b>Fazla sıkıştırma:</b> kalıcı ezilme (compression set), yüksek kapama kuvveti, çatlama; kanal taşar.</li>
          <li><b>İletken (EMI) O-ring</b> daha serttir: %${nf(bE.bant[0] * 100, 0)}–${nf(bE.bant[1] * 100, 0)} sapma kullanılır.</li></ul>
          <p class="small">Hesabı tolerans uçlarında da yapın: en küçük halka + en derin kanal ve en büyük halka + en sığ kanal ikisi de bandın içinde kalmalı.</p>`,
        r: [['parker', 'Statik yüz contası sıkıştırma aralıkları.'], ['chomDO', 'İletken O-ring %10–25 sapma.']] },
      { id: 'c3', t: 'Kanal doluluğu – kanal ne kadar geniş olmalı?',
        g: svg(520, 170, `
          ${kutu(40, 50, 160, 90, { f: '#fff' })}<rect x="40" y="50" width="160" height="90" fill="#fff" stroke="${INK}" stroke-width="2"/>
          <ellipse cx="110" cy="95" rx="58" ry="44" fill="${TUR}" opacity=".85"/>
          ${T(120, 38, 'Kanal alanı = b × h', { s: 12 })}${T(110, 99, 'O-ring alanı', { c: '#fff', b: 1, s: 11 })}
          ${T(184, 128, 'boşluk', { s: 10, c: GRI })}
          ${T(370, 60, 'Doluluk = (π·d²/4) / (b·h)', { b: 1, s: 15 })}
          ${T(370, 92, `Hedef ≈ %${nf(bO.dolHedef * 100, 0)}, en fazla %${nf(bO.dolMaks * 100, 0)}`, { s: 13, c: TUR, b: 1 })}
          ${T(370, 118, `İletken contada en fazla %${nf(bE.dolMaks * 100, 0)}`, { s: 12 })}
          ${T(370, 146, 'Boşluk: ısıl genleşme ve şişme payı', { s: 11, c: GRI })}`),
        x: `<p>Kauçuk sıkışınca hacmi değişmez, yana doğru genişler. Kanalda bu genişlemeye ve sıcaklıkla genleşmeye / akışkanla şişmeye <b>yer kalmalıdır</b>. Kanal tamamen dolarsa kauçuk taşar, kapak kapanmaz veya halka kesilir.</p>
          <p>Kanal çok geniş olursa da halka kanalda kayar, montajda yerinden çıkar. Bu yüzden genişlik, dolulukla birlikte seçilir.</p>`,
        r: [['parker', 'Kanal genişliği ve doluluk.'], ['chomDO', 'İletken elastomerde en kötü durumda ≤ %97 doluluk.'], ['fstAs568', 'Doluluk hedefi %75, en az %65 / en fazla %85.']] },
      { id: 'c4', t: 'Gerilme (stretch) – halkayı ne kadar germek olur?',
        g: svg(520, 170, `
          <circle cx="110" cy="88" r="52" fill="none" stroke="${TUR}" stroke-width="12"/>
          <circle cx="110" cy="88" r="30" fill="none" stroke="${GRI}" stroke-width="2" stroke-dasharray="5 4"/>
          ${ok(110, 88, 156, 88, MAVI, false)}${T(110, 162, 'Halka gerilerek takılır', { s: 11, c: GRI })}
          ${T(370, 50, 'Gerilme = (kanal Ø − halka iç Ø) / halka iç Ø', { b: 1, s: 13 })}
          ${T(370, 82, 'Gerilince kesit incelir:', { s: 12 })}
          ${T(370, 106, '2,62 mm → %3’te 2,56 · %5’te 2,53 mm', { s: 13, c: TUR, b: 1 })}
          ${T(370, 136, 'Piston tipi kanalda en fazla %5', { s: 12 })}`),
        x: `<p>Halkanın iç çapı kanaldan küçükse, takarken gerilir. Gerilen halkanın <b>kesiti incelir</b>, dolayısıyla sıkıştırma oranı düşer. Hesapta bu inceltilmiş kesit kullanılmalıdır.</p>
          <p>Gerilme ayrıca yaşlanmayı hızlandırır. Genel kural %5’i geçmemektir; yüz contasında halkayı kanalın basınç tarafındaki duvarına hafifçe yaslayacak kadar seçmek yeterlidir.</p>`,
        r: [['fstAs568', 'Gerilmede kesit incelme tablosu ve %5 sınırı.']] },
      { id: 'c5', t: 'Ekstrüzyon ve destek halkası',
        g: svg(520, 180, `
          ${kutu(40, 30, 200, 50)}${kutu(40, 98, 200, 50)}
          <rect x="40" y="80" width="200" height="18" fill="#fff"/>
          <circle cx="110" cy="89" r="22" fill="${TUR}"/><path d="M128 82 Q150 89 175 89 Q150 94 128 98 Z" fill="${TUR}"/>
          ${ok(30, 89, 80, 89, MAVI, false)}${T(40, 70, 'P', { c: MAVI, b: 1 })}
          ${T(205, 120, 'boşluk', { s: 10, c: GRI })}${T(150, 172, 'Basınç halkayı boşluğa sıkıştırır', { s: 11, c: GRI })}
          <g font-size="11">${T(400, 34, 'İzin verilen en büyük boşluk (çapta, mm)', { b: 1, s: 12 })}
          ${T(320, 56, 'Basınç', { b: 1, s: 11 })}${T(385, 56, '70 ShA', { b: 1, s: 11 })}${T(440, 56, '80', { b: 1, s: 11 })}${T(490, 56, '90', { b: 1, s: 11 })}
          ${[[35, 0.38, 0.51, 0.64], [69, 0.20, 0.30, 0.46], [103, 0.05, 0.18, 0.30]].map((r, i) => T(320, 80 + i * 22, r[0] + ' bar', { s: 11 }) + T(385, 80 + i * 22, nf(r[1], 2), { s: 11 }) + T(440, 80 + i * 22, nf(r[2], 2), { s: 11 }) + T(490, 80 + i * 22, nf(r[3], 2), { s: 11 })).join('')}
          ${T(400, 152, '> 103 bar: destek halkası şart', { s: 12, c: KIR, b: 1 })}</g>`),
        x: `<p>Parçalar arasında boşluk varsa yüksek basınç kauçuğu bu boşluğa doğru <b>sıkıştırır (ekstrüzyon)</b>; halkanın kenarı kemirilir, sonunda sızdırır. Boşluk ne kadar büyük, basınç ne kadar yüksek ve kauçuk ne kadar yumuşaksa risk o kadar büyüktür.</p>
          <p>Çözümler: boşluğu küçültmek, daha sert halka (80–90 Shore A) veya basıncın ters tarafına <b>destek halkası</b> (back-up ring). Metal metale oturan statik yüz contasında boşluk ≈ 0 olduğu için ekstrüzyon genelde sorun olmaz.</p>`,
        r: [['fstAs568', 'Basınç × sertlik ekstrüzyon boşluğu tablosu.'], ['parkerDin', 'Destek halkalı kanal genişlikleri.']] },
      { id: 'c6', t: 'Shore A sertliği nasıl seçilir?',
        g: svg(520, 140, `
          <defs><linearGradient id="eg-sh" x1="0" x2="1"><stop offset="0" stop-color="#cfe8d6"/><stop offset="1" stop-color="#6d7f84"/></linearGradient></defs>
          <rect x="40" y="50" width="440" height="26" rx="6" fill="url(#eg-sh)"/>
          ${[40, 50, 60, 70, 80, 90].map((v, i) => `<line x1="${40 + i * 88}" y1="76" x2="${40 + i * 88}" y2="84" stroke="${INK}"/>${T(40 + i * 88, 98, v, { s: 11 })}`).join('')}
          <path d="M304 46 l-8 -12 h16 z" fill="${TUR}"/>${T(304, 28, '70 – standart', { b: 1, c: TUR })}
          ${T(110, 122, 'Yumuşak: az kuvvet, pürüzlü yüzey', { s: 11, c: GRI })}${T(420, 122, 'Sert: yüksek basınç, ekstrüzyon', { s: 11, c: GRI })}`),
        x: `<p>Shore A, kauçuğun <b>batmaya karşı direncidir</b>. 70 Shore A çoğu statik uygulamada varsayılan seçimdir.</p>
          <ul><li><b>Daha yumuşak (50–60):</b> ince veya plastik kapak gibi düşük sıkma kuvveti olan yerlerde, pürüzlü yüzeylerde.</li>
          <li><b>Daha sert (80–90):</b> yüksek basınç, boşluk varsa ekstrüzyon riski, aşınma.</li></ul>
          <p class="small">Sertlik arttıkça aynı sıkıştırma için gereken cıvata kuvveti de artar.</p>`,
        r: [['parker', 'Sertlik seçimi.'], ['fstAs568', 'Sertliğe göre ekstrüzyon sınırı.']] },
      { id: 'c7', t: 'Statik ve dinamik conta farkı',
        g: svg(520, 160, `
          ${T(260, 22, '1,78 mm kesit için önerilen sıkıştırma (Parker)', { b: 1 })}
          ${[['Statik', 22, 32, YESIL], ['Öteleme (ileri-geri)', 15, 25, '#c98a2b'], ['Döner mil', 1, 11, KIR]].map(([ad, a, b, cc], i) => {
            const X = v => 170 + v * 9; const y = 42 + i * 36;
            return T(160, y + 15, ad, { a: 'end', s: 12 }) + `<rect x="${X(a)}" y="${y}" width="${X(b) - X(a)}" height="20" rx="4" fill="${cc}" opacity=".8"/>` + T((X(a) + X(b)) / 2, y + 14, `%${a}–${b}`, { s: 11, c: '#fff', b: 1 });
          }).join('')}
          ${[0, 10, 20, 30].map(v => `<line x1="${170 + v * 9}" y1="148" x2="${170 + v * 9}" y2="152" stroke="${GRI}"/>${T(170 + v * 9, 160, '%' + v, { s: 9.5, c: GRI })}`).join('')}`),
        x: `<p><b>Statik</b> contada yüzeyler birbirine göre hareket etmez (kapak, flanş). <b>Dinamik</b> contada mil veya piston halkanın üzerinden kayar.</p>
          <p>Hareket varsa sürtünme ısı ve aşınma üretir; bu yüzden sıkıştırma azaltılır. Döner milde en az sıkıştırma kullanılır ve halka mil üzerinde gerilmemelidir (gerilmiş kauçuk ısınınca büzülür, mili daha çok sıkar).</p>`,
        r: [['parkerRot', 'Statik / öteleme / döner sıkıştırma oranları.'], ['parkerDin', 'Dinamik kanal tablosu.']] },
      { id: 'c8', t: 'Cıvata aralığı ve kapak eğilmesi',
        g: svg(520, 170, `
          ${kutu(30, 110, 460, 26)}
          <path d="M30 70 Q145 96 260 70 Q375 96 490 70 L490 92 Q375 118 260 92 Q145 118 30 92 Z" fill="#dfe4e1" stroke="${INK}" stroke-width="1.5"/>
          ${[30, 260, 490].map(x => `<rect x="${x - 7}" y="48" width="14" height="88" fill="#9aa5a2" stroke="${INK}"/>`).join('')}
          <rect x="40" y="100" width="440" height="10" fill="${TUR}" opacity=".85"/>
          ${ok(30, 32, 260, 32)}${T(145, 26, 'C = cıvata aralığı', { c: MAVI, s: 12 })}
          ${T(145, 160, 'Ortada conta basıncı en düşük', { s: 11, c: KIR })}${T(260, 160, 'cıvata', { s: 11, c: GRI })}`),
        x: `<p>Cıvata, kapağı yalnızca bulunduğu noktada sıkar; iki cıvata arasında kapak <b>esner</b> ve conta basıncı ortada en düşük değerine iner. Aralık çok büyükse ortada conta yeterince sıkışmaz ve sızdırır.</p>
          <p>İzin verilen aralık kapağın rijitliğine bağlıdır: <b>C ∝ (E · t³)<sup>¼</sup></b>. Kapak kalınlığını 2 katına çıkarmak aralığı yaklaşık 1,7 katına çıkarır; aynı kalınlıkta çelik kapak alüminyumdan daha seyrek cıvata ister.</p>`,
        r: [['ee', 'Kapak kiriş modeli ve cıvata aralığı denklemi.'], ['asme', 'En büyük cıvata aralığı (ASME).']] },
      { id: 'c9', t: 'EMI conta – neden iletken olmalı?',
        g: svg(520, 160, `
          ${kutu(40, 30, 200, 36)}${kutu(40, 96, 200, 36)}
          <rect x="40" y="66" width="200" height="30" fill="#fff"/><rect x="90" y="62" width="70" height="38" rx="10" fill="#555f63"/>
          ${T(125, 85, 'iletken conta', { c: '#fff', s: 10, b: 1 })}
          <rect x="40" y="62" width="200" height="4" fill="#e7c85a"/><rect x="40" y="96" width="200" height="4" fill="#e7c85a"/>
          ${T(250, 60, 'iletken kaplama (Alodine Class 3)', { a: 'start', s: 11 })}
          ${T(370, 112, 'Eloksal yalıtkandır → maskele', { s: 12, c: KIR, b: 1 })}
          ${T(370, 138, 'Elektromanyetik dalga boşluktan kaçamaz', { s: 11, c: GRI })}`),
        x: `<p>EMI (elektromanyetik girişim) contası, gümüş, nikel-grafit gibi <b>iletken dolgulu</b> kauçuktur. Kapakla gövde arasındaki boşluğu hem sızdırmazlık hem elektriksel süreklilik için kapatır; cihaz bir “Faraday kafesi” gibi çalışır.</p>
          <p>Temas yüzeyleri de iletken olmalıdır: alüminyumda <b>MIL-DTL-5541 Class 3</b> (iletken kimyasal dönüşüm) kullanılır. Eloksal ve boya yalıtkandır, conta temas bölgesinde maskelenir.</p>`,
        r: [['chomDO', 'İletken elastomer O / D-ring tasarımı.'], ['mil5541b', 'İletken dönüşüm kaplaması Class 3.']] }
    ];
  }

  // ---------------- MALZEME ----------------
  function malzeme() {
    const V = g.MVERI;
    const al = V.ALUMINYUM.find(x => x.kod === '6082'), st = V.CELIK.find(x => x.kod === 'S355J2');
    const hacim = 100 * 50 * 10 / 1000; // cm³
    return [
      { id: 'm1', t: 'Alüminyum alaşım kodu nasıl okunur?',
        g: svg(520, 150, `
          ${T(260, 60, '6 0 8 2 - T 6', { s: 38, b: 1 })}
          ${ok(170, 70, 120, 110, MAVI, false)}${T(110, 128, 'Seri: ana alaşım elementi', { s: 12, c: MAVI })}${T(110, 144, '(6 = Mg + Si)', { s: 11, c: GRI })}
          ${ok(255, 72, 255, 110, GRI, false)}${T(255, 128, 'Alaşım numarası', { s: 12, c: GRI })}
          ${ok(345, 70, 410, 110, TUR, false)}${T(420, 128, 'Temper: ısıl işlem durumu', { s: 12, c: TUR })}${T(420, 144, '(T6 = tam sertleştirilmiş)', { s: 11, c: GRI })}`),
        x: `<p>Dört rakamlı kodun <b>ilk rakamı seriyi</b>, yani ana alaşım elementini gösterir: 1 saf Al, 2 bakır, 3 mangan, 4 silisyum, 5 magnezyum, 6 magnezyum + silisyum, 7 çinko. Tireden sonraki harf ve rakamlar <b>temper</b> (ısıl işlem / soğuk işlem durumu) kodudur.</p>
          <ul>${V.TEMPER.slice(0, 5).map(([k, a]) => `<li><b>${k}:</b> ${a}</li>`).join('')}</ul>
          <p class="small">2, 6 ve 7 serileri ısıl işlemle sertleşir; 1, 3 ve 5 serileri yalnızca soğuk işlemle (H temperleri) sertleşir.</p>`,
        r: [['en573', 'EN AW gösterimi.'], ['alSec', 'Seri karşılaştırması.']] },
      { id: 'm2', t: 'Akma ve çekme dayanımı nedir?',
        g: svg(520, 200, `
          <path d="M60 170 H480 M60 170 V30" stroke="${INK}" stroke-width="1.5" fill="none"/>
          ${T(470, 188, 'uzama (%)', { s: 11, c: GRI })}${T(64, 24, 'gerilme (MPa)', { s: 11, c: GRI, a: 'start' })}
          <path d="M60 170 L130 70 Q150 58 190 52 Q300 40 360 44 Q410 50 440 80" fill="none" stroke="${TUR}" stroke-width="3"/>
          <line x1="60" y1="66" x2="140" y2="66" stroke="${MAVI}" stroke-dasharray="4 3"/>${T(66, 60, 'Rp0,2 – akma', { a: 'start', s: 12, c: MAVI, b: 1 })}
          <line x1="60" y1="41" x2="330" y2="41" stroke="${KIR}" stroke-dasharray="4 3"/>${T(250, 34, 'Rm – çekme (en yüksek)', { s: 12, c: KIR, b: 1 })}
          ${T(440, 100, 'kopma', { s: 11, c: GRI })}${T(100, 140, 'elastik', { s: 11, c: GRI })}${T(300, 80, 'plastik (kalıcı) şekil değişimi', { s: 11, c: GRI })}`),
        x: `<p>Malzemeyi çektiğinizde önce <b>elastik</b> uzar: yük kalkınca eski haline döner. <b>Akma dayanımı (Rp0,2)</b>, kalıcı %0,2 uzamanın başladığı gerilmedir; tasarımda esas alınan değer budur. <b>Çekme dayanımı (Rm)</b> malzemenin taşıyabildiği en yüksek gerilmedir.</p>
          <p>Örnekler: ${al.kod}-${al.temper.split(' ')[0]} → Rp ${al.Rp} / Rm ${al.Rm} MPa; ${st.kod} → Rp ${st.Rp} / Rm ${st.Rm} MPa. Uzama (%A) ise malzemenin kopmadan ne kadar şekil değiştirebildiğini (sünekliğini) gösterir.</p>`,
        r: [['alProp', 'Al tipik mekanik değerler.'], ['en10025', 'Yapı çeliği değerleri.']] },
      { id: 'm3', t: 'Ağırlık nasıl hesaplanır?',
        g: svg(520, 170, `
          <path d="M60 110 L150 80 L260 80 L170 110 Z" fill="#dfe4e1" stroke="${INK}"/><path d="M60 110 V130 L170 130 V110" fill="#c9d0cc" stroke="${INK}"/><path d="M170 130 L260 100 V80" fill="#b9c2be" stroke="${INK}"/>
          ${T(115, 150, '100 × 50 × 10 mm', { s: 12 })}${T(115, 166, `V = ${nf(hacim, 0)} cm³`, { s: 12, c: MAVI, b: 1 })}
          ${T(390, 46, 'm = ρ × V', { s: 20, b: 1 })}
          ${[['Alüminyum', 2.70], ['Çelik', 7.85], ['Paslanmaz', 7.90]].map(([ad, r], i) => { const w = r * 14; return T(330, 82 + i * 30, ad, { a: 'end', s: 12 }) + `<rect x="340" y="${70 + i * 30}" width="${w}" height="16" rx="3" fill="${i ? '#7d8b8f' : TUR}"/>` + T(346 + w, 83 + i * 30, `${nf(r * hacim, 0)} g`, { a: 'start', s: 12, b: 1 }); }).join('')}`),
        x: `<p>Kütle = <b>yoğunluk × hacim</b>. Yoğunluğu g/cm³ olarak alırsanız, hacmi mm³’ten cm³’e çevirmek için 1000’e bölün.</p>
          <p>Alüminyum (≈ 2,70 g/cm³) çeliğin (7,85 g/cm³) yaklaşık <b>üçte biri</b> kadar ağırdır. Aynı parça çelikten yaklaşık 2,9 kat ağır olur; ama alüminyumun elastisite modülü de üçte bir olduğu için aynı rijitlik için daha kalın kesit gerekir.</p>
          <p class="small">Malzeme sekmesindeki ağırlık hesabı bunu levha, çubuk, boru ve altıköşe için otomatik yapar.</p>`,
        r: [['alProp', 'Yoğunluk değerleri.']] },
      { id: 'm4', t: 'Eloksal mı, alodin mi?',
        g: svg(520, 180, `
          ${T(130, 22, 'Eloksal (anodik oksit)', { b: 1 })}${T(390, 22, 'Alodin (kimyasal dönüşüm)', { b: 1 })}
          <rect x="40" y="90" width="180" height="60" fill="#c9d0cc" stroke="${INK}"/>${T(130, 128, 'alüminyum', { s: 11 })}
          <rect x="40" y="70" width="180" height="40" fill="#5b6f8a" opacity=".85"/><line x1="40" y1="90" x2="220" y2="90" stroke="#fff" stroke-dasharray="4 3"/>
          ${T(130, 84, '≈ ½ dışa büyür', { s: 10, c: '#fff' })}${T(130, 104, '≈ ½ içe işler', { s: 10, c: '#fff' })}
          ${T(130, 168, '10–25 µm · sert · YALITKAN', { s: 11, c: KIR, b: 1 })}
          <rect x="300" y="90" width="180" height="60" fill="#c9d0cc" stroke="${INK}"/>${T(390, 128, 'alüminyum', { s: 11 })}
          <rect x="300" y="86" width="180" height="4" fill="#e7c85a"/>
          ${T(390, 78, '< 1 µm', { s: 11 })}${T(390, 168, 'çok ince · İLETKEN (Class 3)', { s: 11, c: YESIL, b: 1 })}`),
        x: `<p><b>Eloksal</b>, alüminyum yüzeyini elektrolizle sert bir oksit tabakasına çevirir: korozyon ve aşınma dayanımı iyidir, boyanabilir (renkli/siyah) ama <b>elektriği iletmez</b>. Tabakanın yaklaşık yarısı dışarı büyüdüğü için hassas geçmelerde ölçüyü değiştirir.</p>
          <p><b>Alodin</b> (kromat dönüşüm kaplaması) çok incedir, ölçüyü değiştirmez ve Class 3 tipi <b>iletken kalır</b>. Topraklama ve EMI conta yüzeyleri için seçilir; boya altı ön işlem olarak da kullanılır (Class 1A).</p>`,
        r: [['mil8625', 'Eloksal Tip II / III.'], ['mil5541b', 'Kimyasal dönüşüm Class 1A / 3.']] },
      { id: 'm5', t: 'Paslanmaz çelik türleri',
        g: svg(520, 150, `
          ${[['Ostenitik', '304 / 316L', 'manyetik değil', 'kaynaklanır', YESIL], ['Martenzitik', '420', 'manyetik', 'sertleşir', '#c98a2b'], ['Dubleks', '2205', 'manyetik', '2× akma', MAVI], ['Çökelme sertl.', '17-4PH', 'manyetik', 'yaşlandırma', TUR]].map(([a, b, c, d, cc], i) => {
            const x = 20 + i * 125; return `<rect x="${x}" y="20" width="115" height="110" rx="10" fill="${ACIK}" stroke="${cc}" stroke-width="2"/>` + T(x + 57, 46, a, { b: 1, s: 12 }) + T(x + 57, 70, b, { s: 13, c: cc, b: 1 }) + T(x + 57, 94, c, { s: 11 }) + T(x + 57, 114, d, { s: 11, c: GRI });
          }).join('')}`),
        x: `<p>Paslanmazlık, yüzeyde kendiliğinden oluşan ince krom oksit tabakasından gelir (en az ~%10,5 Cr). İç yapıya göre aileler ayrılır:</p>
          <ul><li><b>Ostenitik (1.4301 / 304, 1.4404 / 316L):</b> en yaygın; manyetik değil, kaynaklanır, ısıl işlemle sertleşmez. 316L molibden sayesinde klorüre (deniz suyu) daha dayanıklıdır.</li>
          <li><b>Martenzitik (1.4021 / 420):</b> sertleştirilebilir, aşınmaya dayanıklı; korozyon dayanımı daha düşük.</li>
          <li><b>Dubleks (1.4462):</b> 316L’nin yaklaşık iki katı akma dayanımı, çok iyi klorür dayanımı.</li>
          <li><b>Çökelme sertleşmeli (1.4542 / 17-4PH):</b> yaşlandırma ile 800–1000 MPa akma.</li></ul>`,
        r: [['en10088', 'Paslanmaz çelik standartları ve değerleri.']] },
      { id: 'm6', t: 'Kaplamalı cıvata ve hidrojen gevrekliği',
        g: svg(520, 140, `
          <rect x="60" y="56" width="260" height="28" rx="4" fill="#9aa5a2" stroke="${INK}"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="${120 + i * 25}" y1="56" x2="${132 + i * 25}" y2="84" stroke="${INK}"/>`).join('')}
          <rect x="30" y="44" width="34" height="52" rx="4" fill="#7d8b8f" stroke="${INK}"/>
          ${[0, 1, 2, 3, 4].map(i => `<circle cx="${150 + i * 30}" cy="${70 + (i % 2 ? 4 : -4)}" r="3" fill="${KIR}"/>`).join('')}
          ${T(190, 118, 'H atomları çeliğe girer → gecikmeli kırılma', { s: 11, c: KIR })}
          ${T(430, 52, '10.9 / 12.9 + elektrolitik', { s: 12, b: 1 })}${T(430, 72, 'kaplama = risk', { s: 12, b: 1, c: KIR })}
          ${T(430, 102, 'Çözüm: fırınlama veya', { s: 11 })}${T(430, 120, 'çinko lamel (ISO 10683)', { s: 11, c: YESIL, b: 1 })}`),
        x: `<p>Elektrolitik kaplama (çinko, nikel) sırasında oluşan hidrojen, <b>yüksek dayanımlı</b> çeliğin içine girebilir. Cıvata sıkıldıktan saatler veya günler sonra, uyarı vermeden kırılabilir.</p>
          <p>10.9 ve 12.9 sınıfı cıvatalarda kaplama sonrası <b>fırınlama</b> istenir ya da elektrolitik olmayan <b>çinko lamel</b> kaplama seçilir. 8.8 ve altında risk düşüktür.</p>`,
        r: [['iso2081', 'Elektrolitik çinko ve ISO 4042 hidrojen gevrekliği uyarısı.']] }
    ];
  }

  // ---------------- CIVATA ----------------
  function civata() {
    const V = g.MVERI;
    // VDI 2230: MA = FM · (0,16·P + 0,58·d2·µG + Dkm/2·µK), M8 örneği
    const P = 1.25, d2 = 7.188, Dkm = (13 + 8.4) / 2, mu = 0.12, FM = V.TORK.M8['0.12'][0];
    const a = 0.16 * P, b = 0.58 * d2 * mu, c = Dkm / 2 * mu, top = a + b + c;
    const MA = FM * top;
    const pay = [a / top, b / top, c / top];
    const tork = V.TORK.M8;
    const MAkuru = tork['0.14'][3];
    const muList = ['0.08', '0.10', '0.12', '0.14'];
    // Kuru (µ 0,14) tabloya göre verilen tork yağlı cıvataya uygulanırsa oluşan ön yük
    const FMgercek = muList.map(k => tork[k][0] * MAkuru / tork[k][3]);
    return [
      { id: 'v1', t: 'Tork nereye gider?',
        g: svg(520, 170, `
          ${T(260, 24, `M8 cıvata, µ = 0,12: sıkma torkunun dağılımı`, { b: 1 })}
          ${(() => { let x = 40; return [[pay[0], 'Ön yük (germe)', YESIL], [pay[1], 'Diş sürtünmesi', '#c98a2b'], [pay[2], 'Baş altı sürtünmesi', KIR]].map(([p, ad, cc]) => { const w = p * 440; const s = `<rect x="${x}" y="44" width="${w}" height="40" fill="${cc}" opacity=".85"/>` + T(x + w / 2, 70, '%' + nf(p * 100, 0), { c: '#fff', b: 1, s: 14 }) + T(x + w / 2, 104, ad, { s: 11 }); x += w; return s; }).join(''); })()}
          ${T(260, 146, 'Torkun yaklaşık %85’i sürtünmeye harcanır', { s: 12, c: KIR, b: 1 })}`),
        x: `<p>Anahtarla verdiğiniz torkun yalnızca küçük bir kısmı cıvatayı <b>germeye</b> (ön yük oluşturmaya) gider. Geri kalanı dişlerdeki ve baş altındaki <b>sürtünmeyi</b> yenmeye harcanır.</p>
          <p>Bu yüzden aynı torkla elde edilen ön yük, sürtünme koşullarına (yağ, kaplama, yüzey) çok bağlıdır. Tork aslında ön yükü dolaylı olarak ölçmenin pratik bir yoludur.</p>`,
        r: [['vdi2230', 'VDI 2230 yöntemi ve tablo değerleri.']] },
      { id: 'v2', t: 'Sıkma torku nasıl hesaplanır?',
        g: svg(520, 190, `
          ${T(260, 34, 'MA = FM · (0,16·P + 0,58·d₂·µG + Dkm/2·µK)', { b: 1, s: 15 })}
          ${T(260, 64, 'M8 · 8.8 · µG = µK = 0,12', { s: 12, c: GRI })}
          ${T(40, 94, `FM = ${nf(FM, 1)} kN (akmanın %90’ı)`, { a: 'start', s: 12 })}
          ${T(40, 116, `P = ${nf(P, 2)} mm (diş adımı) → 0,16·P = ${nf(a, 3)}`, { a: 'start', s: 12 })}
          ${T(40, 138, `d₂ = ${nf(d2, 3)} mm (böğür çapı) → 0,58·d₂·µG = ${nf(b, 3)}`, { a: 'start', s: 12 })}
          ${T(40, 160, `Dkm ≈ ${nf(Dkm, 1)} mm (baş altı ortalama çap) → Dkm/2·µK = ${nf(c, 3)}`, { a: 'start', s: 12 })}
          ${T(260, 184, `MA = ${nf(FM, 1)} × ${nf(top, 3)} ≈ ${nf(MA, 1)} Nm  (tablo: ${nf(tork['0.12'][3], 1)} Nm)`, { b: 1, s: 13, c: TUR })}`),
        x: `<p>VDI 2230’a göre sıkma torku üç parçadan oluşur: <b>diş eğimi</b> (cıvatayı germeye giden kısım), <b>diş sürtünmesi</b> ve <b>baş altı sürtünmesi</b>.</p>
          <p>Önce cıvatada istenen ön yük <b>FM</b> seçilir. Tablolar genelde cıvatanın akma sınırının %90’ına kadar zorlanmasına izin veren değeri kullanır. Sonra bu formülle o ön yükü verecek tork bulunur. Uygulamadaki tork tablosu bu şekilde hesaplanmış değerlerdir.</p>`,
        r: [['vdi2230', 'Tork tablosu (µ = 0,12, %90 akma).']] },
      { id: 'v3', t: 'Yağlama (sürtünme) neden bu kadar önemli?',
        g: svg(520, 200, `
          ${T(260, 22, `Kuru tabloya göre ${nf(MAkuru, 1)} Nm uygulanırsa M8 8.8’de oluşan ön yük`, { b: 1, s: 12 })}
          ${muList.map((k, i) => { const v = FMgercek[i]; const lim = tork[k][0]; const w = v * 10; const y = 40 + i * 36; const asim = v > lim * 1.001;
            return T(120, y + 15, `µ ${k.replace('.', ',')}`, { a: 'end', s: 12 }) + `<rect x="130" y="${y}" width="${w}" height="22" rx="3" fill="${asim ? KIR : YESIL}" opacity=".85"/>` + T(136 + w, y + 16, `${nf(v, 1)} kN${asim ? ' – sınır aşıldı!' : ''}`, { a: 'start', s: 12, b: 1, c: asim ? KIR : INK });
          }).join('')}
          <line x1="${130 + tork['0.12'][0] * 10}" y1="34" x2="${130 + tork['0.12'][0] * 10}" y2="186" stroke="${GRI}" stroke-dasharray="4 3"/>
          ${T(130 + tork['0.12'][0] * 10, 196, '≈ akmanın %90’ı', { s: 10, c: GRI })}`),
        x: `<p>Aynı torku kuru bir cıvataya ve yağlı bir cıvataya uygularsanız, yağlıda sürtünme az olduğu için torkun çok daha büyük kısmı germeye gider. Kuru (µ 0,14) için hesaplanmış torku yağlı (µ 0,08) cıvataya uygulamak, cıvatayı <b>akma sınırının üzerine</b> çıkarır: cıvata uzar ve gevşer veya kopar.</p>
          <p>Tersi de geçerli: yağlı için hesaplanan torku kuru cıvataya uygularsanız ön yük yetersiz kalır, bağlantı gevşer ve conta sıkışmaz. <b>Torku, gerçek sürtünme koşuluna uygun tablodan alın</b>; resimde yağlama durumunu belirtin.</p>`,
        r: [['vdi2230', 'Sürtünmeye göre tork ve ön yük.']] },
      { id: 'v4', t: '8.8, 10.9 ne demek?',
        g: svg(520, 160, `
          <path d="M70 40 h80 l20 30 -20 30 h-80 l-20 -30z" fill="#9aa5a2" stroke="${INK}" stroke-width="1.5"/>${T(110, 78, '8.8', { s: 24, b: 1 })}
          ${T(330, 46, '8 × 100 = 800 MPa', { s: 16, b: 1, c: TUR })}${T(330, 66, 'çekme dayanımı (Rm)', { s: 11, c: GRI })}
          ${T(330, 104, '0,8 × 800 = 640 MPa', { s: 16, b: 1, c: MAVI })}${T(330, 124, 'akma dayanımı (Rp0,2)', { s: 11, c: GRI })}
          ${T(110, 136, 'Cıvata başında yazar', { s: 11, c: GRI })}`),
        x: `<p>Mukavemet sınıfındaki <b>ilk sayı × 100</b> çekme dayanımını (MPa), <b>ikinci sayı / 10</b> akma oranını verir.</p>
          <ul><li><b>8.8:</b> Rm 800 MPa, Rp 640 MPa – genel makine cıvatası.</li>
          <li><b>10.9:</b> Rm 1000 MPa, Rp 900 MPa – yüksek yük.</li>
          <li><b>12.9:</b> Rm 1200 MPa, Rp 1080 MPa – en yüksek; hidrojen gevrekliğine en hassas.</li>
          <li><b>A2-70 / A4-70:</b> paslanmaz (A2 = 304, A4 = 316), Rm 700 MPa.</li></ul>`,
        r: [['vdi2230', 'Sınıflara göre tork değerleri.']] },
      { id: 'v5', t: 'Sıkma sırası: çapraz ve adım adım',
        g: svg(520, 190, `
          <circle cx="140" cy="95" r="75" fill="${ACIK}" stroke="${INK}" stroke-width="1.5"/><circle cx="140" cy="95" r="30" fill="#fff" stroke="${INK}"/>
          ${[1, 5, 3, 7, 2, 6, 4, 8].map((n, i) => { const a = -Math.PI / 2 + i * Math.PI / 4; const x = 140 + 55 * Math.cos(a), y = 95 + 55 * Math.sin(a); return `<circle cx="${x}" cy="${y}" r="11" fill="#fff" stroke="${INK}"/>` + T(x, y + 4, n, { s: 11, b: 1, c: TUR }); }).join('')}
          ${T(140, 186, 'Karşılıklı (yıldız) sıra', { s: 11, c: GRI })}
          ${['1. tur: torkun ≈ %30’u', '2. tur: ≈ %70', '3. tur: %100', '4. tur: kontrol'].map((s, i) => T(300, 60 + i * 28, s, { a: 'start', s: 13, b: i === 2 })).join('')}`),
        x: `<p>Cıvataları tek tek sonuna kadar sıkmak kapağı bir tarafa yatırır; conta bir yerde aşırı, diğer yerde az sıkışır. Bunun yerine <b>karşılıklı (yıldız) sırayla</b> ve <b>birkaç turda</b> artırarak sıkın.</p>
          <p>Uygulamadaki teknik resim notu bu yüzden “çapraz sırayla, 3 adımda” ifadesini kullanır. Tur oranları (≈ %30 / %70 / %100) yaygın bir uygulamadır; kritik bağlantılarda montaj talimatında yazılı değer esas alınır.</p>`,
        r: [['vdi2230', 'Montaj ön yükü.']] },
      { id: 'v6', t: 'Vida sabitleyici ne zaman kullanılır?',
        g: svg(520, 130, `
          ${[['222', 'düşük', 'küçük vidalar, ayar vidası', '#a25ab3'], ['243', 'orta', 'genel; elle sökülür', MAVI], ['270', 'yüksek', 'kalıcı; ısıtarak sökülür', KIR]].map(([k, m, n, cc], i) => { const x = 20 + i * 165; return `<rect x="${x}" y="20" width="155" height="90" rx="10" fill="${ACIK}" stroke="${cc}" stroke-width="2"/>` + T(x + 77, 48, 'Loctite ' + k, { b: 1, c: cc, s: 14 }) + T(x + 77, 72, m + ' mukavemet', { s: 12 }) + T(x + 77, 94, n, { s: 10.5, c: GRI }); }).join('')}`),
        x: `<p>Titreşim, cıvatayı zamanla gevşetebilir. Sıvı vida sabitleyici diş boşluklarını doldurup sertleşir ve dönmeyi engeller. Sabitleyici sürtünmeyi de değiştirdiği için tork değerini buna göre seçin.</p>
          <p>Mukavemet seçimi: sık sökülecek bağlantıda orta (243), kalıcı bağlantıda yüksek (270), küçük vidalarda düşük (222).</p>`,
        r: [['loctiteTL', 'Loctite vida sabitleyici sınıfları.']] }
    ];
  }

  // ---------------- TOLERANS ----------------
  function tolerans() {
    const S = g.TOL.sapma;
    const g6 = S(20, 'g', 6), H7 = S(30, 'H', 7), gg = S(30, 'g', 6), kk = S(30, 'k', 6), ss = S(30, 's', 6);
    const zon = (x, ust, alt, renk, ad, k = 1.6) => `<rect x="${x}" y="${110 - ust * k}" width="46" height="${(ust - alt) * k}" fill="${renk}" stroke="${INK}"/>` + T(x + 23, 110 - ust * k - 6, ad, { s: 11, b: 1 });
    return [
      { id: 't1', t: 'Ölçü, sapma ve tolerans',
        g: svg(520, 190, `
          <line x1="40" y1="110" x2="480" y2="110" stroke="${INK}" stroke-width="1.5"/>${T(44, 104, 'sıfır çizgisi = nominal Ø20', { a: 'start', s: 11, c: GRI })}
          <rect x="230" y="${110 - g6.ust * 4}" width="70" height="${(g6.ust - g6.alt) * 4}" fill="#f0b48f" stroke="${INK}"/>
          ${ok(320, 110, 320, 110 - g6.ust * 4)}${T(328, 120, `üst sapma ${nf(g6.ust / 1000, 3)}`, { a: 'start', s: 11, c: MAVI })}
          ${ok(360, 110, 360, 110 - g6.alt * 4)}${T(368, 160, `alt sapma ${nf(g6.alt / 1000, 3)}`, { a: 'start', s: 11, c: MAVI })}
          ${T(150, 186, `tolerans = ${nf((g6.ust - g6.alt) / 1000, 3)} mm`, { s: 12, b: 1, c: TUR })}
          ${T(140, 60, `Ø20 g6 → ${nf(20 + g6.alt / 1000, 3)} … ${nf(20 + g6.ust / 1000, 3)}`, { s: 12, b: 1 })}`),
        x: `<p>Hiçbir parça tam nominal ölçüde üretilemez. <b>Tolerans</b>, ölçünün bulunabileceği izinli aralıktır. Bu aralık nominale göre <b>üst sapma</b> ve <b>alt sapma</b> ile tanımlanır.</p>
          <p>Örnek: Ø20 g6 milin ölçüsü ${nf(20 + g6.alt / 1000, 3)} ile ${nf(20 + g6.ust / 1000, 3)} mm arasında olmalıdır. Tolerans genişliği ${nf((g6.ust - g6.alt) / 1000, 3)} mm’dir.</p>`,
        r: [['iso286', 'Sapma ve tolerans tanımları.']] },
      { id: 't2', t: 'Harf ve sayı ne anlatır? (H7, g6 …)',
        g: svg(520, 200, `
          <line x1="30" y1="100" x2="490" y2="100" stroke="${INK}" stroke-width="1.5"/>${T(36, 94, '0', { a: 'start', s: 11, c: GRI })}
          ${[['e', -40, -53], ['f', -20, -33], ['g', -7, -20], ['h', 0, -13], ['js', 6.5, -6.5], ['k', 15, 2], ['n', 28, 15], ['p', 35, 22], ['s', 48, 35]].map(([h, u, a], i) => `<rect x="${60 + i * 48}" y="${100 - u * 1.3}" width="34" height="${(u - a) * 1.3}" fill="${u <= 0 ? '#9fd3b0' : u > 15 ? '#f0a3a3' : '#f3d38b'}" stroke="${INK}"/>${T(77 + i * 48, u > 0 ? 100 - u * 1.3 - 6 : 100 - a * 1.3 + 14, h, { b: 1, s: 12 })}`).join('')}
          ${T(110, 196, '← boşluk', { s: 11, c: YESIL, b: 1 })}${T(300, 196, 'ara', { s: 11, c: '#a37311', b: 1 })}${T(450, 196, 'sıkılık →', { s: 11, c: KIR, b: 1 })}
          ${T(260, 22, 'Ø25 mil, kalite 6: harf bölgenin YERİNİ değiştirir', { b: 1, s: 12 })}`),
        x: `<p><b>Harf</b>, tolerans bölgesinin nominale göre <b>nerede</b> olduğunu söyler: delikte BÜYÜK, milde küçük harf. H deliğin alt sınırı ve h milin üst sınırı tam nominaldir.</p>
          <p><b>Sayı</b> (IT kalitesi), bölgenin <b>ne kadar geniş</b> olduğunu söyler: sayı küçüldükçe tolerans daralır ve üretim zorlaşır. Her bir kalite yaklaşık 1,6 kat fark eder.</p>`,
        r: [['iso286', 'Temel sapmalar ve IT kaliteleri.']] },
      { id: 't3', t: 'Geçme türleri: boşluk, ara, sıkı',
        g: svg(520, 200, `
          <line x1="30" y1="110" x2="490" y2="110" stroke="${INK}" stroke-width="1.5"/>${T(34, 104, 'Ø30', { a: 'start', s: 11, c: GRI })}
          ${zon(70, H7.ust, H7.alt, '#9fd3b0', 'H7')}${zon(120, gg.ust, gg.alt, '#f0b48f', 'g6')}${T(118, 186, 'Boşluklu', { s: 12, b: 1, c: YESIL })}
          ${zon(220, H7.ust, H7.alt, '#9fd3b0', 'H7')}${zon(270, kk.ust, kk.alt, '#f0b48f', 'k6')}${T(268, 186, 'Ara', { s: 12, b: 1, c: '#a37311' })}
          ${zon(370, H7.ust, H7.alt, '#9fd3b0', 'H7')}${zon(420, ss.ust, ss.alt, '#f0b48f', 's6')}${T(418, 186, 'Sıkı (pres)', { s: 12, b: 1, c: KIR })}`),
        x: `<p>Delik ve mil birlikte seçilir. Genelde <b>delik esaslı sistem</b> kullanılır: delik H (alt sınır nominal), milin harfi geçmeyi belirler.</p>
          <ul><li><b>Boşluklu (H7/g6):</b> mil her zaman delikten küçük; döner veya kayar parçalar. Ø30’da ${nf((H7.alt - gg.ust) / 1000, 3)}–${nf((H7.ust - gg.alt) / 1000, 3)} mm boşluk.</li>
          <li><b>Ara (H7/k6):</b> hafif boşluk veya hafif sıkılık; rulman, merkezleme.</li>
          <li><b>Sıkı (H7/s6):</b> mil her zaman büyük; preslenir, tork iletir. Ø30’da ${nf((ss.alt - H7.ust) / 1000, 3)}–${nf((ss.ust - H7.alt) / 1000, 3)} mm sıkılık.</li></ul>`,
        r: [['iso286', 'Tercih edilen geçmeler.'], ['roymech286', 'Geçme örnekleri.']] },
      { id: 't4', t: 'Genel toleranslar – antetteki ISO 2768',
        g: svg(520, 150, `
          <rect x="250" y="30" width="250" height="90" fill="#fff" stroke="${INK}" stroke-width="1.5"/><line x1="250" y1="58" x2="500" y2="58" stroke="${INK}"/>
          ${T(262, 50, 'ANTET', { a: 'start', s: 11, b: 1, c: GRI })}${T(262, 82, 'GENEL TOLERANSLAR:', { a: 'start', s: 12 })}${T(262, 104, 'ISO 2768-mK', { a: 'start', s: 16, b: 1, c: TUR })}
          ${T(120, 50, 'm = orta (doğrusal ölçüler)', { s: 12, c: MAVI })}${T(120, 74, 'K = geometrik (düzlemsellik, diklik…)', { s: 12, c: MAVI })}
          ${T(120, 108, '50 mm → ±0,3 mm', { s: 13, b: 1 })}${T(120, 128, '(30–120 mm, sınıf m)', { s: 11, c: GRI })}`),
        x: `<p>Resimdeki her ölçüye tek tek tolerans yazmak gerekmez. Antetteki <b>genel tolerans notu</b>, ayrıca tolerans yazılmamış tüm ölçülere uygulanır.</p>
          <ul><li><b>ISO 2768-1 (f, m, c, v):</b> doğrusal ölçüler, açılar, radyüs ve pahlar. Örnek: sınıf m’de 50 mm → ±0,3 mm.</li>
          <li><b>ISO 2768-2 (H, K, L):</b> düzlemsellik, diklik, simetri, salgı.</li></ul>
          <p>Fonksiyonel olarak daha sıkı olması gereken ölçüler resimde ayrıca toleranslandırılır. Genel tolerans yalnızca yazılmayanlara uygulanır.</p>`,
        r: [['iso2768', 'Genel doğrusal toleranslar.'], ['iso27682', 'Genel geometrik toleranslar.']] },
      { id: 't5', t: 'Datum sistemi: A, B, C (3-2-1)',
        g: svg(520, 200, `
          <path d="M120 140 L300 140 L380 90 L200 90 Z" fill="#dfe4e1" stroke="${INK}" stroke-width="1.5"/>
          <path d="M120 140 V70 L200 20 V90" fill="#eef1ee" stroke="${INK}" stroke-width="1.2"/><path d="M200 20 L380 20 V90" fill="none" stroke="${GRI}" stroke-dasharray="4 3"/>
          <path d="M120 70 L300 70 V140" fill="none" stroke="${GRI}" stroke-dasharray="4 3"/>
          ${[[170, 128], [270, 128], [250, 100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${TUR}"/>`).join('')}
          ${[[150, 110], [185, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${MAVI}"/>`).join('')}
          <circle cx="330" cy="80" r="6" fill="${YESIL}"/>
          ${T(250, 168, 'A: 3 nokta – birincil (alt yüz)', { s: 12, c: TUR, b: 1 })}${T(70, 80, 'B: 2 nokta', { s: 12, c: MAVI, b: 1 })}${T(440, 70, 'C: 1 nokta', { s: 12, c: YESIL, b: 1 })}`),
        x: `<p>Geometrik toleranslar, ölçümün <b>neye göre</b> yapılacağını tanımlayan datumlara bağlanır. Parça önce en büyük yüzeyiyle <b>A</b>’ya oturur (3 temas noktası), sonra <b>B</b>’ye yaslanır (2 nokta), en son <b>C</b>’ye dayanır (1 nokta). Böylece parça uzayda tek bir konuma kilitlenir.</p>
          <p>Datum sırası önemlidir: aynı delik, A-B-C ile A-C-B sırasına göre farklı ölçülür. Datumlar parçanın montajda nasıl oturduğuna göre seçilir.</p>`,
        r: [['iso5459', 'Datum ve datum sistemleri.']] },
      { id: 't6', t: 'Tolerans çerçevesi nasıl okunur?',
        g: svg(520, 160, `
          <rect x="90" y="50" width="340" height="40" fill="#fff" stroke="${INK}" stroke-width="1.8"/>
          ${[140, 290, 336, 383].map(x => `<line x1="${x}" y1="50" x2="${x}" y2="90" stroke="${INK}" stroke-width="1.5"/>`).join('')}
          <circle cx="115" cy="70" r="8" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M101 70 H129 M115 56 V84" stroke="${INK}" stroke-width="1.6"/>
          ${T(205, 77, 'Ø0,4', { s: 18 })}<circle cx="262" cy="70" r="10" fill="none" stroke="${INK}"/>${T(262, 75, 'M', { s: 12 })}
          ${T(313, 77, 'A', { s: 18, b: 1 })}${T(360, 77, 'B', { s: 18, b: 1 })}${T(406, 77, 'C', { s: 18, b: 1 })}
          ${T(115, 118, 'özellik', { s: 11, c: MAVI })}${T(115, 132, '(konum)', { s: 10, c: GRI })}
          ${T(215, 118, 'tolerans bölgesi', { s: 11, c: MAVI })}${T(215, 132, 'Ø = silindirik bölge', { s: 10, c: GRI })}
          ${T(262, 40, 'MMC', { s: 10, c: GRI })}${T(360, 118, 'datumlar (öncelik sırasıyla)', { s: 11, c: MAVI })}`),
        x: `<p>Çerçeve soldan sağa okunur: <b>“Bu deliğin ekseni, A-B-C datumlarına göre temel ölçülerle tanımlı teorik konumun etrafındaki Ø0,4 mm çaplı bir silindirin içinde olmalıdır.”</b></p>
          <p>Kutulu (temel) ölçüler toleranssızdır; sapmayı sadece çerçevedeki değer sınırlar. Ⓜ işareti, delik büyüdükçe ek (bonus) tolerans verildiğini gösterir.</p>`,
        r: [['iso1101', 'Tolerans çerçevesi ve semboller.']] },
      { id: 't7', t: 'Ⓜ (MMC) ve bonus tolerans',
        g: svg(520, 170, `
          ${[[6.4, 0.4], [6.47, 0.47], [6.55, 0.55]].map(([d, t], i) => { const x = 80 + i * 150; return `<circle cx="${x}" cy="80" r="${d * 6}" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="${x}" cy="80" r="${t * 30}" fill="${TUR}" opacity=".5"/>` + T(x, 140, `delik Ø${nf(d, 2)}`, { s: 12, b: 1 }) + T(x, 158, `konum Ø${nf(t, 2)}`, { s: 12, c: TUR }); }).join('')}
          ${T(80, 26, 'MMC (en küçük delik)', { s: 11, c: GRI })}${T(380, 26, 'LMC (en büyük delik)', { s: 11, c: GRI })}`),
        x: `<p>Geçiş deliği için en kötü durum, deliğin <b>en küçük</b> (malzemenin en fazla) olduğu haldir: MMC. Tolerans bu duruma göre verilir. Delik büyüdükçe cıvata daha rahat geçeceği için, aradaki fark konum toleransına <b>bonus</b> olarak eklenir.</p>
          <p>Örnek: Ø6,4 H12 delik (6,40–6,55), konum Ø0,4 Ⓜ. Delik 6,55 çıkarsa izin verilen konum sapması Ø0,55’e çıkar. Bu, işlevi bozmadan üretimde ıskartayı azaltır.</p>
          <p class="small">Konum toleransının kendisi cıvata formülüyle bulunur: iki parçada geçiş deliği varsa T = H − F (6,4 − 6 = 0,4).</p>`,
        r: [['asmeY145', 'Yüzen / sabit bağlantı formülleri.'], ['iso273', 'Geçiş deliği serileri.']] },
      { id: 't8', t: 'Hangi tolerans hangisinden küçük olmalı?',
        g: svg(520, 170, `
          ${[['Form (düzlemsellik)', 0.012, YESIL], ['Yönelim (paralellik, diklik)', 0.02, '#c98a2b'], ['Konum', 0.05, MAVI], ['Boyut toleransı', 0.1, GRI]].map(([ad, v, cc], i) => { const w = v * 2600; const y = 26 + i * 34; return T(200, y + 15, ad, { a: 'end', s: 12 }) + `<rect x="210" y="${y}" width="${w}" height="22" rx="4" fill="${cc}" opacity=".85"/>`; }).join('')}
          ${T(330, 165, 'aynı yüzey için: form ≤ yönelim ≤ konum', { s: 12, b: 1 })}`),
        x: `<p>Aynı yüzeye birden çok tolerans verildiğinde bunların sıralı olması gerekir. Örneğin bir yüzeyin datuma göre paralelliği, o yüzeyin düzlemselliğini de sınırlar; bu yüzden <b>düzlemsellik paralellikten küçük</b> verilmelidir, aksi halde anlamsızdır.</p>
          <p>Aynı şekilde datum yüzeyinin formu, ona bağlanan toleranslardan küçük olmalıdır. Uygulamadaki örnek teknik resim bu kuralları otomatik kontrol eder ve değerleri GB/T 1184 kalite tablolarından okur.</p>`,
        r: [['gb1184', 'Kalite tabloları.'], ['gb1184genel', 'Genel tolerans kuralları.']] }
    ];
  }

  const KAYNAK = { conta, malzeme, civata, tolerans };
  const BASLIK = { conta: 'Conta eğitimi', malzeme: 'Malzeme ve kaplama eğitimi', civata: 'Cıvata ve tork eğitimi', tolerans: 'Tolerans ve GD&T eğitimi' };

  function html(modul) {
    const { esc, refs } = U();
    const L = KAYNAK[modul] ? KAYNAK[modul]() : [];
    return `<div class="egitim">
      <div class="card"><h3>📘 ${BASLIK[modul]}</h3>
        <p class="hint">Temel kavramlar, şematik görseller ve kaynaklar. Konuya atlamak için tıklayın.</p>
        <div class="egit-icerik">${L.map((d, i) => `<a href="#eg-${d.id}" data-egit="${d.id}"><span>${i + 1}</span>${esc(d.t)}</a>`).join('')}</div></div>
      ${L.map((d, i) => `<div class="card egit-ders" id="eg-${d.id}">
        <h3><span class="egit-no">${i + 1}</span>${esc(d.t)}</h3>
        <div class="egit-govde"><div class="egit-gorsel">${d.g}</div><div class="egit-metin">${d.x}${refs(d.r)}</div></div>
      </div>`).join('')}
      <p class="small">Görseller şematiktir ve ölçeksizdir. Sayısal örnekler uygulamanın veri tablolarından hesaplanır.</p>
    </div>`;
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-egit]');
    if (!a) return;
    e.preventDefault();
    const el = document.getElementById('eg-' + a.dataset.egit);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  g.EGITIM = { html };
})(window);
