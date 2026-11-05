// Conta Analiz – Ana ekran, Malzeme & kaplama ve Cıvata modülleri
(function (g) {
  const V = g.MVERI;
  const U = () => g.UI;
  const SVGNS = '';

  // ---------- Yardımcı görseller ----------
  function puan(n, max = 5) {
    return `<span class="puan">${Array.from({ length: max }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;
  }
  // Yatay çubuk grafik
  function cubuk(liste, birim, ondalik = 0) {
    const { f, esc } = U();
    const maks = Math.max(...liste.map(x => x.v)) * 1.08 || 1;
    const H = 26 * liste.length + 16, W = 640, x0 = 150, x1 = W - 70;
    return `<svg class="cizim cubukg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Karşılaştırma">
      ${liste.map((x, i) => {
        const y = 8 + i * 26, w = (x1 - x0) * x.v / maks;
        return `<text x="${x0 - 8}" y="${y + 15}" font-size="12" text-anchor="end" fill="#1d2326" ${x.sel ? 'font-weight="700"' : ''}>${esc(x.ad)}</text>
          <rect x="${x0}" y="${y + 3}" width="${Math.max(2, w)}" height="16" rx="3" fill="${x.sel ? '#d9622b' : '#b9c4c1'}"/>
          <text x="${x0 + w + 6}" y="${y + 15}" font-size="12" fill="#1d2326" ${x.sel ? 'font-weight="700"' : ''}>${f(x.v, ondalik)}${birim}</text>`;
      }).join('')}
    </svg>`;
  }
  const kopyaBtn = id => `<button class="primary" data-kopya="${id}">Kopyala</button>`;
  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-kopya]');
    if (!b) return;
    const el = document.getElementById(b.dataset.kopya);
    try { await navigator.clipboard.writeText(el.textContent); U().toast('Panoya kopyalandı'); }
    catch (err) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); U().toast('Metni seçtim – Ctrl+C ile kopyalayın'); }
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-modul-git]');
    if (!b) return;
    const S = U().S(); S.modul = b.dataset.modulGit; U().changed(true); window.scrollTo({ top: 0 });
  });

  // ---------- Ana ekran ----------
  const IKON = {
    conta: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="22" fill="none" stroke="#d9622b" stroke-width="9"/><circle cx="32" cy="32" r="9" fill="none" stroke="#1d2326" stroke-width="2" stroke-dasharray="3 3"/></svg>`,
    malzeme: `<svg viewBox="0 0 64 64" width="56" height="56"><rect x="8" y="34" width="48" height="16" rx="2" fill="#b9c4c1"/><rect x="14" y="20" width="36" height="14" rx="2" fill="#7d8b8f"/><rect x="20" y="8" width="24" height="12" rx="2" fill="#d9622b"/></svg>`,
    civata: `<svg viewBox="0 0 64 64" width="56" height="56"><path d="M20 8 h24 l6 10 -6 10 h-24 l-6 -10z" fill="#7d8b8f"/><rect x="26" y="28" width="12" height="30" fill="#b9c4c1"/>${[0, 1, 2, 3, 4].map(i => `<line x1="26" y1="${32 + i * 5}" x2="38" y2="${35 + i * 5}" stroke="#1d2326" stroke-width="1.5"/>`).join('')}<path d="M50 14 a16 16 0 0 1 4 18" fill="none" stroke="#d9622b" stroke-width="3"/><path d="M52 34 l2 -4 3 3z" fill="#d9622b"/></svg>`
  };
  function ana() {
    const { $ } = U();
    $('#modulAlan').innerHTML = `<div class="ana">
      <h2>Ne yapmak istiyorsunuz?</h2>
      <p class="lead">Bir modül seçin. Her modülde değerler kaynaklarıyla birlikte verilir ve teknik resim notu oluşturulabilir.</p>
      <div class="ana-kart">
        <button data-modul-git="conta">${IKON.conta}<b>Conta</b><span>O-ring ve gasket: kanal ölçüsü, sıkıştırma ve doluluk, malzeme ve Shore A, cıvata aralığı, yapıştırıcı, teknik resim notu, tedarikçiler.</span><em class="hazir">Hazır · Kolay ve Uzman mod</em></button>
        <button data-modul-git="malzeme">${IKON.malzeme}<b>Malzeme seçimi ve kaplama/boya</b><span>Alüminyum (6061, 6082, 7075…) ve çelik kodlarının farkları, yoğunluk ve ağırlık, işlenebilirlik ve sıcaklık; eloksal, alodin, boya seçimi ve teknik resim notları.</span><em>(geliştirme aşamasında)</em></button>
        <button data-modul-git="civata">${IKON.civata}<b>Cıvatalar ve tork değerleri</b><span>M boyutu, mukavemet sınıfı ve sürtünmeye göre sıkma torku ve ön yük, diş boyu, sıvı kilit, teknik resim notu.</span><em>(geliştirme aşamasında)</em></button>
      </div>
    </div>`;
  }

  // ---------- Malzeme modülü ----------
  const AL_OZ = { Rp: ['Akma dayanımı Rp0,2', ' MPa', 0], Rm: ['Çekme dayanımı Rm', ' MPa', 0], rho: ['Yoğunluk', ' g/cm³', 2], ozgul: ['Özgül dayanım (Rp/ρ)', ' kN·m/kg', 0], k: ['Isıl iletkenlik', ' W/m·K', 0], tMax: ['Yaklaşık en yüksek kullanım sıcaklığı', ' °C', 0], isl: ['İşlenebilirlik (puan)', '/5', 0], kay: ['Kaynak kabiliyeti (puan)', '/5', 0], kor: ['Korozyon dayanımı (puan)', '/5', 0], elk: ['Eloksal uygunluğu (puan)', '/5', 0] };
  const CE_OZ = { Rp: AL_OZ.Rp, Rm: AL_OZ.Rm, rho: AL_OZ.rho, ozgul: AL_OZ.ozgul, k: AL_OZ.k, tMax: ['Yaklaşık en yüksek kullanım sıcaklığı', ' °C', 0], isl: AL_OZ.isl, kay: AL_OZ.kay, kor: AL_OZ.kor, ist: ['Isıl işlemle sertleşme (puan)', '/5', 0] };
  const deger = (m, k) => k === 'ozgul' ? m.Rp / m.rho : (m.p && m.p[k] != null ? m.p[k] : m[k]);

  function malzemeNot(m, al, urun, dil) {
    const en = dil === 'en';
    if (al) {
      const tmp = m.temper.split(' ')[0];
      const urunStd = urun === 'levha' ? (en ? 'SHEET/PLATE EN 485-2' : 'LEVHA/PLAKA EN 485-2') : urun === 'profil' ? (en ? 'EXTRUDED PROFILE EN 755-2' : 'PROFİL EN 755-2') : (en ? 'BAR EN 755-2' : 'ÇUBUK EN 755-2');
      return en ? `MATERIAL: ${m.en}-${tmp} [${m.sembol}] PER EN 573-3, ${urunStd} (EQUIV. AA ${m.kod}-${tmp}, ASTM B209/B221).`
        : `MALZEME: ${m.en}-${tmp} [${m.sembol}] – EN 573-3, ${urunStd} (EŞDEĞER AA ${m.kod}-${tmp}, ASTM B209/B221).`;
    }
    const paslanmaz = m.grup.startsWith('Paslanmaz');
    const ad = paslanmaz ? `${m.wnr} (${m.kod})` : `${m.kod} (${m.wnr})`;
    const durum = m.kod === '42CrMo4' ? '+QT' : m.kod === 'C45' ? '+N' : m.kod === '1.4542' ? '+P800' : '';
    return en ? `MATERIAL: ${ad}${durum ? ' ' + durum : ''} PER ${m.std}.` : `MALZEME: ${ad}${durum ? ' ' + durum : ''} – ${m.std}.`;
  }

  function malzemeSecimKart(m, al) {
    const { f, esc, refs } = U();
    const P = al ? [['isl', 'İşlenebilirlik'], ['kay', 'Kaynak'], ['kor', 'Korozyon'], ['elk', 'Eloksal'], ['sek', 'Şekillendirme']] : [['isl', 'İşlenebilirlik'], ['kay', 'Kaynak'], ['kor', 'Korozyon'], ['ist', 'Isıl işlem/sertleşme'], ['sek', 'Şekillendirme']];
    const baslik = al ? `${m.kod}-${m.temper} · ${m.en} [${m.sembol}] · W.Nr ${m.wnr}` : (m.grup.startsWith('Paslanmaz') ? `${m.kod} · ${m.wnr}` : `${m.kod} · ${m.wnr}`) + ` · ${m.grup}`;
    const notId = 'mNot1';
    return `<div class="card mkart">
      <h3>${esc(baslik)}</h3>
      <div class="mkart-ic">
        <div>
          <div class="kv" style="margin-top:0">
            <div><b>${f(m.rho, 2)} g/cm³</b><span>yoğunluk</span></div>
            <div><b>${m.Rp} MPa</b><span>akma Rp0,2 (tipik)</span></div>
            <div><b>${m.Rm} MPa</b><span>çekme Rm (tipik)</span></div>
            <div><b>%${m.A}</b><span>uzama</span></div>
            <div><b>${m.E} GPa</b><span>elastisite modülü</span></div>
            <div><b>${m.k} W/m·K</b><span>ısıl iletkenlik</span></div>
            <div><b>${f(m.cte, 1)} µm/m·K</b><span>ısıl genleşme</span></div>
            <div><b>≈ ${m.tMax} °C</b><span>yaklaşık en yüksek kullanım</span></div>
          </div>
          <p class="mt"><b>Nerede kullanılır?</b> ${esc(m.kullanim)}</p>
          <p><b>Bilinmesi gereken:</b> ${esc(m.not)}</p>
          ${m.sicak ? `<p><b>Sıcaklık:</b> ${esc(m.sicak)}</p>` : ''}
          ${al ? '' : `<p><b>Manyetik:</b> ${m.manyetik ? 'Evet' : 'Hayır (ostenitik)'}</p>`}
        </div>
        <div>
          <table class="puanlar">${P.map(([k, ad]) => `<tr><td>${ad}</td><td>${puan(m.p[k])}</td></tr>`).join('')}
            <tr><td>Türkiye’de bulunurluk</td><td>${puan(m.bul)}</td></tr>
            <tr><td>Maliyet</td><td><b>${'₺'.repeat(m.mal)}</b><span class="small"> / 5</span></td></tr>
            ${al ? `<tr><td>Ürün şekli</td><td class="small">${esc(m.urun)}</td></tr>` : ''}</table>
          <p class="small mt"><b>Teknik resim notu (örnek):</b></p>
          <pre class="notbox kisa" id="${notId}">${esc(malzemeNot(m, al, al ? (m.urun.startsWith('Ekstrüzyon') ? 'profil' : m.urun.startsWith('Levha') ? 'levha' : 'cubuk') : '', 'tr'))}</pre>
          <div class="mt">${kopyaBtn(notId)}</div>
        </div>
      </div>
      ${refs(al ? [['alProp', 'Tipik mekanik değerler.'], ['alSec', 'İşlenebilirlik, kaynak, korozyon ve eloksal karşılaştırması.'], ['en573', 'EN AW gösterimi ve kimyasal sembol.'], ['astmB209', 'ABD eşdeğer standartları.']] : [[m.ref, 'Malzeme standardı ve mekanik değerler.']])}
    </div>`;
  }

  function malzemeSekme(al) {
    const { esc, S } = U();
    const s = S();
    const L = al ? V.ALUMINYUM : V.CELIK;
    const secKey = al ? 'alSec' : 'celikSec', ozKey = al ? 'alOzellik' : 'celikOzellik';
    const m = L.find(x => x.kod === s[secKey]) || L[0];
    const OZ = al ? AL_OZ : CE_OZ;
    const oz = OZ[s[ozKey]] ? s[ozKey] : 'Rp';
    const rehber = al
      ? `<div class="seri">${V.AL_SERI.map(x => `<div class="seri-k ${String(m.seri) === x.s[0] ? 'on' : ''}"><b>${x.s}</b><span class="el">${esc(x.el)}</span><span class="small">${esc(x.ozet)}</span><span class="isil">${x.isil ? 'Isıl işlemle sertleşir' : 'Isıl işlem yok'}</span><span class="small">ör. ${esc(x.ornek)}</span></div>`).join('')}</div>`
      : `<div class="seri">${V.CELIK_GRUP.map(x => `<div class="seri-k ${m.grup.startsWith(x.g.split(' ')[0]) || (x.g.startsWith('Ostenitik') && m.grup === 'Paslanmaz (ostenitik)') || (x.g.startsWith('Kolay') && m.grup.includes('kolay')) || (x.g.startsWith('Çökelme') && m.grup.includes('çökelme')) ? 'on' : ''}"><b>${esc(x.g)}</b><span class="small">${esc(x.ozet)}</span><span class="small">ör. ${esc(x.ornek)}</span></div>`).join('')}</div>`;
    return `<div class="card"><h3>${al ? 'Alüminyum serileri – ilk rakam ana alaşım elementini gösterir' : 'Çelik grupları'}</h3>${rehber}</div>
      <div class="card"><h3>${al ? 'Alaşım seçin' : 'Çelik seçin'}</h3>
        <div class="seg wrap" data-bind="${secKey}">${L.map(x => `<button data-v="${x.kod}">${esc(x.kod)}</button>`).join('')}</div>
      </div>
      ${malzemeSecimKart(m, al)}
      <div class="card"><h3>Karşılaştır</h3>
        <label>Özellik<select data-sel="${ozKey}">${Object.entries(OZ).map(([k, v]) => `<option value="${k}" ${k === oz ? 'selected' : ''}>${v[0]}</option>`).join('')}</select></label>
        <div class="mt">${cubuk(L.map(x => ({ ad: x.kod + (al ? '-' + x.temper.split(' ')[0] : ''), v: deger(x, oz), sel: x === m })), OZ[oz][1], OZ[oz][2])}</div>
        ${oz === 'tMax' ? '<p class="small">Sıcaklık değerleri yaklaşık ve temkinlidir; uzun süreli yükte dayanım kaybı başlar.</p>' : ''}
      </div>
      ${al ? `<div class="card"><h3>Temper (ısıl işlem durumu) kodları</h3><table>${V.TEMPER.map(([k, a]) => `<tr><td><b>${k}</b></td><td>${esc(a)}</td></tr>`).join('')}</table></div>` : ''}
      <div class="card"><h3>Ağırlık hesabı – ${esc(m.kod)} (ρ = ${m.rho} g/cm³)</h3>
        <div class="seg" data-bind="agSekil"><button data-v="levha">Levha / blok</button><button data-v="cubuk">Yuvarlak çubuk</button><button data-v="boru">Boru</button><button data-v="altigen">Altıköşe</button></div>
        <div class="row4 mt">${agGirdi(s.agSekil)}</div>
        <div id="agSonuc" class="sonuc mt"></div>
      </div>`;
  }
  function agGirdi(sk) {
    const { S } = U(); const s = S();
    const n = (k, l) => `<label>${l}<input type="number" step="0.1" data-num="${k}" value="${s[k] ?? ''}"></label>`;
    if (sk === 'cubuk') return n('agD', 'Çap D (mm)') + n('agL', 'Boy L (mm)');
    if (sk === 'boru') return n('agD', 'Dış çap D (mm)') + n('agEt', 'Et kalınlığı (mm)') + n('agL', 'Boy L (mm)');
    if (sk === 'altigen') return n('agD', 'Anahtar ağzı s (mm)') + n('agL', 'Boy L (mm)');
    return n('agA', 'En a (mm)') + n('agB', 'Boy b (mm)') + n('agT', 'Kalınlık t (mm)');
  }
  function agSonuc() {
    const { $, f, S } = U(); const s = S();
    const el = $('#agSonuc'); if (!el) return;
    const al = s.mSekme === 'al';
    const L = al ? V.ALUMINYUM : V.CELIK;
    const m = L.find(x => x.kod === (al ? s.alSec : s.celikSec)) || L[0];
    let hacim = 0; // mm³
    const sk = s.agSekil;
    if (sk === 'cubuk') hacim = Math.PI / 4 * s.agD ** 2 * s.agL;
    else if (sk === 'boru') hacim = Math.PI / 4 * (s.agD ** 2 - Math.max(0, s.agD - 2 * s.agEt) ** 2) * s.agL;
    else if (sk === 'altigen') hacim = (Math.sqrt(3) / 2) * s.agD ** 2 * s.agL;
    else hacim = s.agA * s.agB * s.agT;
    if (!(hacim > 0)) { el.innerHTML = ''; return; }
    const kg = r => hacim * r / 1e6;
    const kars = al ? [['Çelik (7,85)', 7.85], ['Paslanmaz (7,9)', 7.9]] : [['Alüminyum 6082 (2,70)', 2.70], ['Paslanmaz (7,9)', 7.9]];
    el.innerHTML = `<div class="kv">
      <div style="background:var(--accent-soft)"><b>${f(kg(m.rho), kg(m.rho) < 1 ? 3 : 2)} kg</b><span>${m.kod} ağırlığı</span></div>
      <div><b>${f(hacim / 1000, 1)} cm³</b><span>hacim</span></div>
      ${kars.map(([a, r]) => `<div><b>${f(kg(r), kg(r) < 1 ? 3 : 2)} kg</b><span>aynı parça ${a}</span></div>`).join('')}
    </div><p class="small">Kütle = hacim × yoğunluk. Talaşlı işlemde ham malzeme ölçüsüne işleme payı ekleyin.</p>`;
  }

  // Kaplama sekmesi
  function kaplamaSekme() {
    const { esc, S, refs } = U(); const s = S();
    const taban = s.kTaban || 'al';
    const L = V.KAPLAMA.filter(k => k.taban.includes(taban));
    const istek = V.ISTEK.filter(x => s['ist_' + x.k]);
    const skor = k => {
      let p = 0; const neden = [], sorun = [];
      for (const x of istek) {
        if (x.k === 'iletken') { if (k.iletken) { p += 3; neden.push('iletken'); } else { p -= 6; sorun.push('yalıtkan'); } }
        if (x.k === 'asinma') { p += k.asi - 3; (k.asi >= 4 ? neden : k.asi <= 2 ? sorun : []).push('aşınma ' + k.asi + '/5'); }
        if (x.k === 'disOrtam') { p += k.kor - 3; (k.kor >= 4 ? neden : k.kor <= 2 ? sorun : []).push('korozyon ' + k.kor + '/5'); }
        if (x.k === 'renk') { if (/renk|RAL|siyah/i.test(k.renk)) { p += 2; neden.push('renk seçeneği'); } else p -= 2; }
        if (x.k === 'boyut') { if (k.kalUm <= 1) { p += 3; neden.push('ölçü değiştirmez'); } else if (k.kalUm >= 40) { p -= 3; sorun.push('kalın (' + k.kal + ')'); } }
        if (x.k === 'ucuz') { p += 3 - k.mal; (k.mal <= 1 ? neden : k.mal >= 4 ? sorun : []).push('maliyet ' + '₺'.repeat(k.mal)); }
      }
      return { p, neden, sorun };
    };
    const sirali = L.map(k => ({ k, ...skor(k) })).sort((a, b) => b.p - a.p || a.k.mal - b.k.mal);
    const notId = 'kNot';
    return `<div class="card"><h3>Hangi malzemenin yüzeyi?</h3>
        <div class="seg" data-bind="kTaban"><button data-v="al">Alüminyum</button><button data-v="celik">Karbon / alaşımlı çelik</button><button data-v="paslanmaz">Paslanmaz çelik</button></div>
        <h3 class="mt">Ne istiyorsunuz?</h3>
        <div class="checks">${V.ISTEK.map(x => `<label class="chk"><input type="checkbox" data-chk="ist_${x.k}" ${s['ist_' + x.k] ? 'checked' : ''}> ${esc(x.ad)}</label>`).join('')}</div>
      </div>
      <div class="card"><h3>Karşılaştırma</h3>
        <table class="kmatris"><thead><tr><th>Kaplama</th><th>Kalınlık</th><th>İletken</th><th>Korozyon</th><th>Aşınma</th><th>Ölçüye etkisi</th><th>Maliyet</th></tr></thead><tbody>
        ${L.map(k => `<tr><td><b>${esc(k.ad)}</b><div class="small">${esc(k.std)}</div></td><td class="small">${esc(k.kal)}</td><td>${k.iletken ? '<span class="badge ok">Evet</span>' : '<span class="badge bad">Hayır</span>'}</td><td>${puan(k.kor)}</td><td>${puan(k.asi)}</td><td class="small">${esc(k.boyut)}</td><td><b>${'₺'.repeat(k.mal)}</b></td></tr>`).join('')}
        </tbody></table>
      </div>
      <h3>${istek.length ? 'İsteklerinize göre sıralı öneriler' : 'Kaplamalar (yukarıdan istek seçerseniz sıralanır)'}</h3>
      ${sirali.map((x, i) => `<div class="card mat ${istek.length && x.p < 0 ? 'dim' : ''}"><div>
        <div class="name">${istek.length && i < 2 && x.p >= 0 ? `<span class="badge ok">Öneri ${i + 1}</span> ` : ''}${esc(x.k.ad)} <span class="small">· ${esc(x.k.std)}</span></div>
        <div class="pill-row small"><span class="chip">${esc(x.k.kal)}</span><span class="chip">${x.k.iletken ? 'İletken' : 'Yalıtkan'}</span><span class="chip">${esc(x.k.renk)}</span></div>
        ${x.neden.length ? `<div class="okbox">✔ ${esc(x.neden.join(' · '))}</div>` : ''}${x.sorun.length ? `<div class="warnbox">⚠ ${esc(x.sorun.join(' · '))}</div>` : ''}
        <p class="small"><b>Ne zaman:</b> ${esc(x.k.ne)}</p>
        <p class="small"><b>Dikkat:</b> ${esc(x.k.dikkat)}</p>
        <pre class="notbox kisa" id="kn_${x.k.id}">${esc(x.k.notTR)}</pre>
        ${refs(x.k.ref)}
      </div><div class="mat-actions"><button class="mini" data-kopya="kn_${x.k.id}">Notu kopyala</button></div></div>`).join('')}
      ${taban === 'al' ? `<div class="card info"><h3>Kısaca: alüminyumda hangisi?</h3><ul>
        <li><b>Alodin (kromat, Class 3):</b> yüzey iletken kalmalıysa (EMI conta teması, topraklama). İnce, ölçü değiştirmez, ucuz; çizilmeye dayanıksız.</li>
        <li><b>Eloksal (Tip II):</b> görünen, dokunulan parçalar ve renk istendiğinde. Yalıtkandır, temas yüzeyleri maskelenir.</li>
        <li><b>Sert eloksal (Tip III):</b> aşınan/kayan yüzeyler. Kalındır (~50 µm), ölçüye pay bırakılır.</li>
        <li><b>Boya (alodin Class 1A + astar + son kat):</b> dış ortam, askeri renk, en iyi atmosfer koruması.</li>
        <li>Aynı parçada karma da olabilir: tamamı eloksal, conta ve topraklama yüzeyleri maskeli + alodin Class 3.</li></ul>
        ${refs([['mil8625', 'Eloksal tip/class.'], ['mil5541b', 'Dönüşüm kaplaması tip/class.']])}</div>` : ''}`;
  }

  // Teknik resim notu sekmesi
  function notSekme() {
    const { esc, S } = U(); const s = S();
    const tum = [...V.ALUMINYUM.map(m => ({ m, al: true })), ...V.CELIK.map(m => ({ m, al: false }))];
    const sec = tum.find(x => x.m.kod === s.notMalz) || tum[5];
    const taban = sec.al ? 'al' : sec.m.grup.startsWith('Paslanmaz') ? 'paslanmaz' : 'celik';
    const kaps = V.KAPLAMA.filter(k => k.taban.includes(taban));
    const kap = kaps.find(k => k.id === s.notKap) || null;
    return `<div class="grid2"><div class="card"><h3>Seçimler</h3>
        <label>Malzeme<select data-sel="notMalz">${tum.map(x => `<option value="${x.m.kod}" ${x === sec ? 'selected' : ''}>${x.al ? 'Al ' + x.m.kod + '-' + x.m.temper.split(' ')[0] : x.m.kod + ' (' + x.m.wnr + ')'}</option>`).join('')}</select></label>
        ${sec.al ? `<label class="mt">Ürün şekli<select data-sel="notUrun"><option value="cubuk" ${s.notUrun === 'cubuk' ? 'selected' : ''}>Çubuk (EN 755-2)</option><option value="levha" ${s.notUrun === 'levha' ? 'selected' : ''}>Levha / plaka (EN 485-2)</option><option value="profil" ${s.notUrun === 'profil' ? 'selected' : ''}>Profil (EN 755-2)</option></select></label>` : ''}
        <label class="mt">Yüzey işlemi<select data-sel="notKap"><option value="">Yok</option>${kaps.map(k => `<option value="${k.id}" ${kap && k.id === kap.id ? 'selected' : ''}>${esc(k.ad)}</option>`).join('')}</select></label>
        <label class="chk mt"><input type="checkbox" data-chk="notMaske" ${s.notMaske ? 'checked' : ''}> İşaretli temas/topraklama yüzeyleri maskelensin</label>
        <label class="chk"><input type="checkbox" data-chk="notSonra" ${s.notSonra ? 'checked' : ''}> Ölçüler kaplama sonrası için geçerli</label>
        <label class="chk"><input type="checkbox" data-chk="notTol" ${s.notTol ? 'checked' : ''}> Genel tolerans ISO 2768-mK</label>
        <label class="chk"><input type="checkbox" data-chk="notKenar" ${s.notKenar ? 'checked' : ''}> Keskin kenarlar kırılsın / çapaksız</label>
        <label class="chk"><input type="checkbox" data-chk="notRohs" ${s.notRohs ? 'checked' : ''}> RoHS / REACH uyumlu</label>
      </div>
      <div class="card"><div class="row-inline space"><h3>Not metni</h3><div><div class="seg small" data-bind="notDil2"><button data-v="tr">Türkçe</button><button data-v="en">English</button></div> ${kopyaBtn('mNotCikti')}</div></div>
        <pre class="notbox kisa" id="mNotCikti">${esc(malzemeNotMetni(sec, kap, s))}</pre>
        <p class="small">Mekanik değerler için standart minimumları esas alınır; tipik değerler karşılaştırma içindir.</p></div></div>`;
  }
  function malzemeNotMetni(sec, kap, s) {
    const en = s.notDil2 === 'en';
    const L = [malzemeNot(sec.m, sec.al, s.notUrun || 'cubuk', s.notDil2)];
    if (kap) L.push(en ? kap.notEN : kap.notTR);
    if (kap && s.notMaske) L.push(en ? 'MASK SURFACES MARKED ▽M FROM COATING' + (sec.al && !kap.iletken ? '; APPLY MIL-DTL-5541 TYPE II CLASS 3 ON MASKED AREAS.' : '.') : 'İŞARETLİ (▽M) YÜZEYLER KAPLAMADAN MASKELENECEK' + (sec.al && !kap.iletken ? '; MASKELİ BÖLGELERE MIL-DTL-5541 TİP II CLASS 3 UYGULANACAKTIR.' : '.'));
    if (kap && s.notSonra) L.push(en ? 'ALL DIMENSIONS APPLY AFTER SURFACE TREATMENT.' : 'TÜM ÖLÇÜLER YÜZEY İŞLEMİ SONRASI İÇİNDİR.');
    if (s.notTol) L.push(en ? 'GENERAL TOLERANCES PER ISO 2768-mK.' : 'GENEL TOLERANSLAR ISO 2768-mK.');
    if (s.notKenar) L.push(en ? 'BREAK ALL SHARP EDGES 0.2–0.5 mm; PART TO BE FREE OF BURRS.' : 'TÜM KESKİN KENARLAR 0,2–0,5 mm KIRILACAK; PARÇA ÇAPAKSIZ OLACAKTIR.');
    if (s.notRohs) L.push(en ? 'MATERIAL AND FINISH SHALL COMPLY WITH RoHS (EU 2011/65) AND REACH.' : 'MALZEME VE YÜZEY İŞLEMİ RoHS (AB 2011/65) VE REACH UYUMLU OLACAKTIR.');
    return (en ? 'NOTES:\n' : 'NOTLAR:\n') + L.map((l, i) => `${i + 1}. ${l}`).join('\n');
  }

  function malzeme(yap) {
    const { $, S, syncControls } = U(); const s = S();
    if (!yap && $('#modulAlan .mmodul')) { agSonuc(); return; }
    const sekme = s.mSekme || 'al';
    $('#modulAlan').innerHTML = `<div class="mmodul">
      <div class="modbaslik"><button class="ghost" data-modul-git="ana">← Ana menü</button><h2>Malzeme seçimi ve kaplama/boya <span class="gelis">(geliştirme aşamasında)</span></h2></div>
      <div class="seg" data-bind="mSekme"><button data-v="al">Alüminyum</button><button data-v="celik">Çelik</button><button data-v="kaplama">Kaplama ve boya</button><button data-v="not">Teknik resim notu</button></div>
      <div class="mt">${sekme === 'al' ? malzemeSekme(true) : sekme === 'celik' ? malzemeSekme(false) : sekme === 'kaplama' ? kaplamaSekme() : notSekme()}</div>
    </div>`;
    syncControls();
    agSonuc();
  }

  // ---------- Cıvata modülü ----------
  function civataHesap(s) {
    const sn = V.SINIF.find(x => x.k === s.civSinif) || V.SINIF[0];
    const t = (V.TORK[s.civM] || V.TORK.M5)[s.civMu] || V.TORK.M5['0.12'];
    let FM = t[sn.i], MA = t[sn.i + 3], tahmini = false;
    if (sn.paslanmaz) { FM = t[0] * sn.Rp / 640; MA = t[3] * sn.Rp / 640; tahmini = true; }
    const db = parseInt(s.civM.slice(1), 10);
    const dis = { celik: 1, dokme: 1.25, al: 2, plastik: 2.5 }[s.civKarsi] * db;
    return { sn, FM, MA, tahmini, db, dis };
  }
  function civataNot(s, h, en) {
    const kap = { cinko: en ? 'ELECTROPLATED ZINC PER ISO 4042' : 'ISO 4042’YE GÖRE ELEKTROLİTİK ÇİNKO KAPLAMALI', lamel: en ? 'ZINC FLAKE COATED PER ISO 10683' : 'ISO 10683’E GÖRE ÇİNKO LAMEL KAPLAMALI', siyah: en ? 'BLACK OXIDE' : 'SİYAH OKSİT (BRÜNÜR)', yok: en ? 'PLAIN' : 'KAPLAMASIZ' }[s.civKap] || '';
    const pas = h.sn.paslanmaz;
    const L = [];
    L.push(en ? `FASTENERS: ${s.civTip} ${s.civM}×${s.civL || '__'}, PROPERTY CLASS ${s.civSinif}${pas ? ' (ISO 3506-1)' : ' (ISO 898-1)'}${pas ? '' : ', ' + kap}.`
      : `CIVATALAR: ${s.civTip} ${s.civM}×${s.civL || '__'}, MUKAVEMET SINIFI ${s.civSinif}${pas ? ' (ISO 3506-1)' : ' (ISO 898-1)'}${pas ? '' : ', ' + kap}.`);
    const lo = Math.round(h.MA * 0.9 * 10) / 10, hi = Math.round(h.MA * 1.1 * 10) / 10;
    L.push(en ? `TIGHTEN TO ${U().f(h.MA, 1)} Nm (${U().f(lo, 1)}–${U().f(hi, 1)} Nm) IN A CROSS PATTERN IN 3 STEPS.`
      : `CIVATALAR ${U().f(h.MA, 1)} Nm (${U().f(lo, 1)}–${U().f(hi, 1)} Nm) TORK İLE ÇAPRAZ SIRAYLA, 3 ADIMDA SIKILACAKTIR.`);
    if (s.civKilit) L.push(en ? `APPLY ${s.civKilit} (OR EQUIVALENT) TO THREADS.` : `DİŞLERE ${s.civKilit} (VEYA EŞDEĞERİ) UYGULANACAKTIR.`);
    if (pas) L.push(en ? 'APPLY ANTI-SEIZE TO PREVENT GALLING.' : 'DİŞ SIVAMASINI (GALLING) ÖNLEMEK İÇİN ANTİ-SEIZE UYGULANACAKTIR.');
    if (s.civKarsi === 'al') L.push(en ? `MIN. THREAD ENGAGEMENT IN ALUMINIUM ${h.dis} mm; USE HELICOIL INSERTS WHERE FREQUENTLY DISASSEMBLED.` : `ALÜMİNYUMDA EN AZ DİŞ BOYU ${h.dis} mm; SIK SÖKÜLEN YERLERDE HELICOIL KULLANILACAKTIR.`);
    if (s.civKarsi === 'plastik') L.push(en ? 'USE BRASS THREADED INSERTS AND METAL COMPRESSION LIMITERS; TORQUE PER INSERT SUPPLIER.' : 'PLASTİKTE PİRİNÇ DİŞLİ İNSERT VE METAL BURÇ KULLANILACAK; TORK İNSERT ÜRETİCİSİNE GÖRE.');
    return (en ? 'NOTES:\n' : 'NOTLAR:\n') + L.map((l, i) => `${i + 1}. ${l}`).join('\n');
  }
  function civata(yap) {
    const { $, f, esc, S, refs, syncControls } = U(); const s = S();
    const h = civataHesap(s);
    if (!yap && $('#modulAlan .cmodul')) { const n = $('#cNot'); if (n) n.textContent = civataNot(s, h, s.civDil === 'en'); return; }
    const t = V.TORK[s.civM];
    const sinifSec = h.sn;
    const govdeAd = { celik: 'çelik', dokme: 'dökme demir', al: 'alüminyum', plastik: 'plastik' }[s.civKarsi];
    const uyar = [];
    if ((s.civSinif === '10.9' || s.civSinif === '12.9') && s.civKap === 'cinko') uyar.push('10.9 / 12.9 cıvatada elektrolitik çinko hidrojen gevrekliği riski taşır: kaplama sonrası fırınlama (ISO 4042) isteyin veya çinko lamel (ISO 10683) seçin.');
    if (h.tahmini) uyar.push('Paslanmaz cıvata torku, 8.8 tablosunun akma oranıyla (Rp ' + sinifSec.Rp + ' / 640) ölçeklenmiş tahmindir. Paslanmazda sürtünme dağınık ve sıvama riski var; üretici tablosu ve anti-seize kullanın.');
    if (s.civKarsi === 'plastik') uyar.push('Plastik parçaya doğrudan cıvata sıkmayın: insert ve metal burç kullanın; tork insert üreticisine göre belirlenir.');
    const MAlist = Object.keys(V.TORK).map(k => ({ ad: k, v: V.TORK[k][s.civMu][sinifSec.paslanmaz ? 3 : sinifSec.i + 3] * (sinifSec.paslanmaz ? sinifSec.Rp / 640 : 1), sel: k === s.civM }));
    $('#modulAlan').innerHTML = `<div class="cmodul">
      <div class="modbaslik"><button class="ghost" data-modul-git="ana">← Ana menü</button><h2>Cıvatalar ve tork değerleri <span class="gelis">(geliştirme aşamasında)</span></h2></div>
      <div class="card"><h3>Cıvatanızı seçin</h3>
        <div class="row4">
          <label>Boyut<select data-sel="civM">${Object.keys(V.TORK).map(k => `<option ${k === s.civM ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
          <label>Mukavemet sınıfı<select data-sel="civSinif">${V.SINIF.map(x => `<option value="${x.k}" ${x.k === s.civSinif ? 'selected' : ''}>${esc(x.ad)}</option>`).join('')}</select></label>
          <label>Sürtünme / yağlama<select data-sel="civMu">${V.SURTUNME.map(x => `<option value="${x.k}" ${x.k === s.civMu ? 'selected' : ''}>${esc(x.ad)}</option>`).join('')}</select></label>
          <label>Vidalandığı malzeme<select data-sel="civKarsi"><option value="celik">Çelik / somun</option><option value="dokme">Dökme demir</option><option value="al">Alüminyum</option><option value="plastik">Plastik</option></select></label>
        </div>
      </div>
      <div class="card"><div class="sonucbuyuk">${esc(s.civM)} – ${esc(s.civSinif)} cıvata, µ = ${s.civMu.replace('.', ',')} için <b>${f(h.MA, 1)} Nm</b> ile sıkılmalıdır.</div>
        <div class="kv">
          <div style="background:var(--accent-soft)"><b>${f(h.MA, 1)} Nm</b><span>sıkma torku MA${h.tahmini ? ' (tahmini)' : ''}</span></div>
          <div><b>${f(h.MA * 0.9, 1)} – ${f(h.MA * 1.1, 1)} Nm</b><span>tork anahtarı aralığı (±%10)</span></div>
          <div><b>${f(h.FM, 2)} kN</b><span>montaj ön yükü FM</span></div>
          <div><b>≥ ${f(h.dis, 0)} mm</b><span>en az diş boyu (${govdeAd})</span></div>
        </div>
        ${uyar.map(u => `<div class="warnbox">${esc(u)}</div>`).join('')}
        <div class="rule-govde mt" style="padding-left:0">
          ${g.CIZIM.tork({ Lk: Math.min(90, h.dis * 5), MA: h.MA, FM: h.FM, dis: h.dis, M: s.civM, govdeAd, sinif: s.civSinif, mu: s.civMu.replace('.', ',') })}
          <div class="small"><ul>
            <li>Çapraz sırayla, 3 adımda (≈ %30 → %70 → %100) son torka getirin.</li>
            <li>Tork değeri sürtünmeye çok duyarlıdır: aynı torkta yağlı cıvata kuru cıvataya göre %20–30 daha fazla ön yük alır.</li>
            <li>Tablo değerleri akma sınırının %90’ını kullanır; titreşimli bağlantıda sıvı kilit veya kilitli rondela ekleyin.</li>
            <li>Diş boyu: çelik 1d, dökme demir 1,25d, alüminyum 2d (sık sökülürse Helicoil), plastikte insert.</li></ul>
            ${refs([['vdiTablo', `${s.civM} ${s.civSinif === '8.8' || s.civSinif === '10.9' || s.civSinif === '12.9' ? s.civSinif : '8.8'} µ=${s.civMu}: tablo değeri.`], ['amorim', 'Çapraz sıkma, 3 adım.'], ['kural', 'Diş boyu kuralları.'], ['iso2081', 'Kaplama ve hidrojen gevrekliği.']])}</div>
        </div>
      </div>
      <div class="card"><h3>${esc(s.civM)} için tüm değerler (VDI 2230 tablosu)</h3>
        <table><thead><tr><th>µ</th><th class="num">8.8 FM (kN)</th><th class="num">8.8 MA (Nm)</th><th class="num">10.9 FM</th><th class="num">10.9 MA</th><th class="num">12.9 FM</th><th class="num">12.9 MA</th></tr></thead><tbody>
        ${Object.entries(t).map(([mu, r]) => `<tr class="${mu === s.civMu ? 'best' : ''}"><td>${mu.replace('.', ',')}</td>${[0, 3, 1, 4, 2, 5].map(i => `<td class="num ${mu === s.civMu && ((i === sinifSec.i) || (i === sinifSec.i + 3)) && !sinifSec.paslanmaz ? 'hl' : ''}">${f(r[i], i < 3 ? 2 : 1)}</td>`).join('')}</tr>`).join('')}
        </tbody></table></div>
      <div class="card"><h3>Boyuta göre sıkma torku – ${esc(s.civSinif)}, µ = ${s.civMu.replace('.', ',')}</h3>${cubuk(MAlist, ' Nm', 1)}</div>
      <div class="card"><h3>Teknik resim notu</h3>
        <div class="row4">
          <label>Cıvata tipi<select data-sel="civTip">${V.VIDA_TIP.map(x => `<option value="${x.k}" ${x.k === s.civTip ? 'selected' : ''}>${esc(x.ad)}</option>`).join('')}</select></label>
          <label>Boy L (mm)<input type="number" data-num="civL" value="${s.civL ?? ''}"></label>
          <label>Kaplama<select data-sel="civKap"><option value="cinko">Elektrolitik çinko (ISO 4042)</option><option value="lamel">Çinko lamel (ISO 10683)</option><option value="siyah">Siyah oksit</option><option value="yok">Kaplamasız</option></select></label>
          <label>Sıvı kilit<select data-sel="civKilit">${V.KILIT.map(x => `<option value="${x.k}" ${x.k === s.civKilit ? 'selected' : ''}>${esc(x.ad)}</option>`).join('')}</select></label>
        </div>
        <div class="row-inline space mt"><div class="seg small" data-bind="civDil"><button data-v="tr">Türkçe</button><button data-v="en">English</button></div>${kopyaBtn('cNot')}</div>
        <pre class="notbox mt" id="cNot">${esc(civataNot(s, h, s.civDil === 'en'))}</pre>
        ${refs([['loctiteTL', 'Sıvı kilit seçimi.'], ['iso2081', 'Kaplama standartları.']])}
      </div>
    </div>`;
    syncControls();
  }

  function render(md, yap) {
    if (md === 'ana') ana();
    else if (md === 'malzeme') malzeme(yap);
    else if (md === 'civata') civata(yap);
  }
  g.MODUL = { render };
})(window);
