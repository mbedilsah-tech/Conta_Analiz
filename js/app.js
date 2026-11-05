// Conta Analiz – arayüz
(function () {
  const D = window.DATA, C = window.CALC;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const f = (x, n = 2) => (x == null || isNaN(x)) ? '–' : Number(x).toLocaleString('tr-TR', { minimumFractionDigits: n, maximumFractionDigits: n });
  const P = x => (x == null || isNaN(x)) ? '–' : '%' + f(x * 100, 1);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------------- Durum ----------------
  const VARSAYILAN = {
    hareket: 'statik', tip: 'oring', sekil: 'oring', emi: 'hayir', fGHz: 1, mod: 'conta',
    Tmin: -20, Tmax: 85, P: 1, yon: 'ic', ortam: ['hava', 'su'], govde: 'al', kapakZayif: false, metalTemas: true,
    siralama: 'bul', malz: null, shore: null,
    // O-ring → kanal
    cs: 2.62, csTol: 0.08, hTol: 0.05, bTol: 0.10, g: 0,
    // Kanal yolu: 'daire' (eksen çapı Dm) veya 'sekilli' (A×B, köşe R)
    oYol: 'daire', Dm: 52.9, A: 80, Bk: 50, Rk: null, ger: 1,
    // Detay: belirli bir O-ring (opsiyonel)
    ozelOring: false, as568: '', ID: null, detayAcik: false,
    // Ayarlar
    ayarAnim: true, ayarSure: '350', ayarDetay: false,
    // Gasket → kanal
    gt: 3.0, gw: 10, gs: 0.8, gtTol: 0.15, kanalda: true,
    // Kanal → conta
    kh: 2.0, kb: 3.6, kcap: 55, kw: 0,
    // Kurallar
    M: 'M5', cevre: null, kapakT: 5, kapakMalz: '', kirisA: null, qOzel: null, civK: 0.8,
    // Yapıştırma
    yuzey: 'al', iletkenYap: false, yapMalz: null,
    // Not
    notDil: 'tr', spec: 'd2000', tolSinif: 'B', yuzeyKalite: 'N', depolama: true, gres: true, yuzeyNot: true, yapNot: false, rohs: false, iso3302: 'M2',
    d2: null,
    // Arayüz
    kkTip: 'oring', kkd: 2.62, kkw: 6, kkh: 2.0, kkb: 3.6,
    arayuz: 'uzman', kolayMod: 'oring', kd: 2.62, kID: null, kh2: 2.0, kb2: 3.6, kolaySev: 1,
    tedSekme: 'ankara', kvAcik: null,
    // Modüller
    modul: 'ana',
    mSekme: 'al', alSec: '6082', celikSec: 'S355J2', alOzellik: 'Rp', celikOzellik: 'Rp',
    agSekil: 'levha', agA: 200, agB: 100, agT: 10, agD: 40, agL: 100, agEt: 3,
    kTaban: 'al', ist_iletken: false, ist_asinma: false, ist_disOrtam: false, ist_renk: false, ist_boyut: false, ist_ucuz: false,
    notMalz: '6082', notUrun: 'cubuk', notKap: 'eloksal', notMaske: true, notSonra: true, notTol: true, notKenar: true, notRohs: false, notDil2: 'tr',
    tSekme: 'delikmil', tTip: 'delik', tHarf: 'H', tKalite: '7', tCap: 5, gCap: 20, gDelik: 'H7', gMil: 'g6', gelSinif: 'm', gelOlcu: 50, gelGeo: 'K',
    civM: 'M5', civSinif: '8.8', civMu: '0.12', civKarsi: 'al', civTip: 'ISO 4762', civL: 16, civKap: 'cinko', civKilit: 'LOCTITE 243', civDil: 'tr'
  };
  const KEY = 'contaAnaliz.v1';
  let S = load();
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) return { ...VARSAYILAN, ...s }; } catch (e) { /* depolama yok */ }
    return { ...VARSAYILAN };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* yoksay */ } }
  const emi = () => S.emi === 'evet';
  const mat = () => D.MALZEMELER.find(m => m.kod === S.malz) || null;

  // ---------------- Yardımcılar ----------------
  // Kaynak etiketleri: tıklanınca kaynak penceresi açılır. keys: 'anahtar' veya ['anahtar', 'bu maddede neyi desteklediği']
  function refs(keys, ctx) {
    return `<div class="refs">${keys.map(k => Array.isArray(k) ? k : [k, ctx]).filter(([k]) => D.REF[k]).map(([k, c]) => `<button type="button" class="ref" data-ref="${k}" data-ctx="${esc(c || '')}">${esc(D.REF[k].kisa)}</button>`).join('')}</div>`;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('button.ref[data-ref]');
    if (b) {
      const r = D.REF[b.dataset.ref];
      $('#refBaslik').textContent = r.kisa;
      $('#refIcerik').innerHTML = `${b.dataset.ctx ? `<div class="refctx"><b>Bu maddede:</b> ${esc(b.dataset.ctx)}</div>` : ''}<p>${esc(r.ad)}</p>${r.url ? `<p><a href="${r.url}" target="_blank" rel="noopener">Kaynağa git ↗</a></p><p class="small">${esc(r.url)}</p>` : '<p class="small">Basılı kaynak / standart – çevrimiçi bağlantı yok.</p>'}`;
      $('#refModal').classList.add('acik');
    }
    if (e.target.closest('[data-rkapat]')) $('#refModal').classList.remove('acik');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#refModal').classList.remove('acik'); });
  function stars(n, max = 5) { return `<span class="stars">${'★'.repeat(n)}<span class="off">${'★'.repeat(max - n)}</span></span>`; }
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1600); }
  function num(key, label, step = 0.01, extra = '') { return `<label>${label}<input type="number" step="${step}" data-num="${key}" value="${S[key] ?? ''}" ${extra}></label>`; }

  // ---------------- Gezinme ----------------
  function go(page) {
    $$('#nav button').forEach(b => b.classList.toggle('active', b.dataset.page === page));
    $$('.page').forEach(p => p.classList.toggle('active', p.dataset.page === page));
    window.scrollTo({ top: 0 });
    renderAll(true);
  }
  $('#nav').addEventListener('click', e => { const b = e.target.closest('button[data-page]'); if (b) go(b.dataset.page); });
  document.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });

  // ---------------- Bağlama ----------------
  const YAPISAL = ['tip', 'sekil', 'emi', 'mod', 'hareket', 'yon', 'malz', 'kanalda', 'spec', 'notDil', 'oYol', 'ozelOring', 'ayarDetay', 'arayuz', 'kolayMod', 'tedSekme', 'kkTip',
    'modul', 'mSekme', 'alSec', 'celikSec', 'alOzellik', 'celikOzellik', 'agSekil', 'kTaban', 'ist_iletken', 'ist_asinma', 'ist_disOrtam', 'ist_renk', 'ist_boyut', 'ist_ucuz',
    'notMalz', 'notUrun', 'notKap', 'notMaske', 'notSonra', 'notTol', 'notKenar', 'notRohs', 'notDil2', 'civM', 'civSinif', 'civMu', 'civKarsi', 'civTip', 'civKap', 'civKilit', 'civDil', 'tSekme', 'tTip', 'tHarf', 'tKalite', 'gelSinif', 'gelGeo'];
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-bind] > button');
    if (!btn || btn.disabled) return;
    const key = btn.parentElement.dataset.bind;
    S[key] = btn.dataset.v;
    if (key === 'tTip') S.tHarf = S.tTip === 'delik' ? 'H' : 'h';
    if (key === 'kolayMod') S.kolaySev = S.kolayMod === 'oring' ? 1 : 0;
    if (key === 'tip') S.sekil = S.tip === 'oring' ? 'oring' : (S.sekil === 'oring' ? 'yuvarlak' : S.sekil);
    if (key === 'tip' || key === 'sekil') {
      if (S.sekil === 'D' && !(S.gw <= 2 * S.gt)) S.gw = S.gt;
      if ((S.sekil === 'duz' || S.sekil === 'sunger') && !(S.gw > S.gt)) S.gw = 10;
    }
    changed(YAPISAL.includes(key));
  });
  document.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.num) { const v = parseFloat(String(el.value).replace(',', '.')); S[el.dataset.num] = isNaN(v) ? null : v; changed(false); syncSame(el); }
  });
  document.addEventListener('change', e => {
    const el = e.target;
    if (el.dataset.sel) { S[el.dataset.sel] = el.value; changed(YAPISAL.includes(el.dataset.sel)); }
    if (el.dataset.chk) { S[el.dataset.chk] = el.checked; changed(YAPISAL.includes(el.dataset.chk)); }
    if (el.dataset.ortam) { const k = el.dataset.ortam; S.ortam = el.checked ? [...new Set([...S.ortam, k])] : S.ortam.filter(x => x !== k); changed(false); }
  });
  // Aynı değişkene bağlı diğer alanları güncelle (yazılan alan hariç)
  function syncSame(src) { $$(`[data-num="${src.dataset.num}"]`).forEach(el => { if (el !== src) el.value = S[src.dataset.num] ?? ''; }); }

  // Değişiklikte halka animasyonu (Ayarlar'dan kapatılabilir)
  let animZaman = null, bekleyenYapisal = false;
  function changed(yapisal) {
    save();
    if (!S.ayarAnim) { renderAll(yapisal); return; }
    syncControls(); renderOzet();
    if (yapisal) renderGirdiler();
    bekleyenYapisal = bekleyenYapisal || yapisal;
    $$(S.modul === 'conta' ? '.page.active .sonuc' : '#modulAlan .sonuc').forEach(e => { e.classList.remove('yeni'); e.classList.add('guncel'); });
    clearTimeout(animZaman);
    animZaman = setTimeout(() => {
      renderAll(false);
      bekleyenYapisal = false;
      $$(S.modul === 'conta' ? '.page.active .sonuc' : '#modulAlan .sonuc').forEach(e => { e.classList.remove('guncel'); void e.offsetWidth; e.classList.add('yeni'); });
    }, parseInt(S.ayarSure, 10) || 350);
  }
  function renderGirdiler() {
    if (S.modul !== 'conta') { window.MODUL.render(S.modul, true); return; }
    const p = aktifSayfa();
    if (p === 'kanal') renderKanalGirdi();
    if (p === 'not') renderNotGirdi();
    if (p === 'kolay') renderKolayGirdi();
  }
  // Detay bölümünün açık/kapalı durumunu hatırla
  document.addEventListener('toggle', e => { if (e.target.classList && e.target.classList.contains('detay')) { S.detayAcik = e.target.open; save(); } }, true);
  function detay(icerik, baslik = 'Detaylar (opsiyonel) – standart ölçü, toleranslar, boşluk') {
    return `<details class="detay" ${S.detayAcik || S.ayarDetay ? 'open' : ''}><summary>${baslik}</summary><div class="detay-ic">${icerik}</div></details>`;
  }

  function syncControls() {
    $$('[data-bind]').forEach(seg => {
      const v = S[seg.dataset.bind];
      $$('button', seg).forEach(b => b.classList.toggle('on', b.dataset.v === v));
    });
    $$('[data-num]').forEach(el => { if (el !== document.activeElement) el.value = S[el.dataset.num] ?? ''; });
    $$('[data-sel]').forEach(el => { if (S[el.dataset.sel] != null) el.value = S[el.dataset.sel]; });
    $$('[data-chk]').forEach(el => { el.checked = !!S[el.dataset.chk]; });
    document.body.dataset.modul = S.modul;
    document.body.classList.toggle('kolay', S.arayuz === 'kolay');
    $('#gasketSekil').style.display = S.tip === 'gasket' ? '' : 'none';
    $('#emiAlan').style.display = emi() ? '' : 'none';
  }

  // ---------------- Özet ----------------
  function renderOzet() {
    const m = mat();
    const sekilAd = { oring: 'O-ring', yuvarlak: 'Dolu kordon', D: 'D-profil', tup: 'Tüp/P-profil', duz: 'Düz conta', sunger: 'Sünger' }[S.sekil];
    $('#ozet').innerHTML = [
      `<span class="chip"><b>Statik</b></span>`,
      `<span class="chip"><b>${sekilAd}</b></span>`,
      `<span class="chip">EMI <b>${emi() ? 'var' : 'yok'}</b></span>`,
      `<span class="chip"><b>${S.mod === 'conta' ? 'Conta → kanal' : 'Kanal → conta'}</b></span>`,
      `<span class="chip"><b>${S.Tmin ?? '?'} … ${S.Tmax ?? '?'} °C</b></span>`,
      `<span class="chip"><b>${f(S.P, 1)} bar</b></span>`,
      `<span class="chip">Malzeme <b>${m ? m.kod + (S.shore ? ' ' + S.shore + 'A' : '') : 'seçilmedi'}</b></span>`
    ].join('');
  }

  // ---------------- 1. Proje ----------------
  function renderOrtamlar() {
    $('#ortamlar').innerHTML = D.ORTAMLAR.map(o => `<label class="chk"><input type="checkbox" data-ortam="${o.k}" ${S.ortam.includes(o.k) ? 'checked' : ''}> ${o.ad}</label>`).join('');
  }
  $('#sifirla').addEventListener('click', () => { S = { ...VARSAYILAN }; save(); renderOrtamlar(); renderAll(true); toast('Varsayılanlar yüklendi'); });

  // ---------------- 2. Kanal ----------------
  function nominalKanal() {
    // Diğer sayfalar için nominal conta/kanal ölçüleri
    if (S.tip === 'oring') {
      if (S.mod === 'conta') { const r = C.contadanKanal({ sekil: 'oring', t: S.cs, tTol: S.csTol, g: S.g, hTol: S.hTol, bTol: S.bTol, emi: emi() }); return { d: S.cs, b: r.satirlar[1].b, h: r.satirlar[1].h, kanalli: true }; }
      const k = C.kanaldanOring({ h: S.kh, b: S.kb, g: S.g, hTol: S.hTol, emi: emi() }); return { d: k.list[0] ? k.list[0].d : S.kh, b: S.kb, h: S.kh, kanalli: true };
    }
    if (S.mod === 'conta') { const r = C.contadanKanal(gasketParam()); return { d: S.gt, b: r.satirlar[1].b || S.gw, h: r.satirlar[1].h, kanalli: S.kanalda }; }
    return { d: S.kh / 0.8, b: S.kb, h: S.kh, kanalli: S.kanalda };
  }
  function gasketParam() {
    return { sekil: S.sekil, t: S.gt, w: S.gw, s: S.gs, tTol: S.gtTol, g: S.g, hTol: S.hTol, bTol: S.bTol, emi: emi(), kanalda: S.sekil === 'duz' || S.sekil === 'sunger' ? S.kanalda : true };
  }
  const yonAd = () => S.yon === 'ic' ? 'iç basınç' : 'dış basınç / vakum';

  const rAktif = d => S.Rk > 0 ? S.Rk : Math.round(6 * d * 2) / 2;
  // Conta modunda O-ring iç çapı: belirli O-ring (detay) > dairesel kanal > şekilli kanal
  function oringSecim(b) {
    if (S.ozelOring && S.ID > 0) {
      const as = S.as568 ? C.as568Bul(S.as568) : null;
      const ok = as && Math.abs(as.cs - S.cs) < 0.02 && Math.abs(as.id - S.ID) < 0.05;
      return { kaynak: 'ozel', ID: S.ID, as568: ok ? { ...as, ok: true } : null };
    }
    if (S.oYol === 'sekilli') {
      if (!(S.A > 0 && S.Bk > 0)) return null;
      const R = rAktif(S.cs), L = C.yolUzunlugu(S.A, S.Bk, R);
      const r = C.sekilliOring(L, S.cs, (S.ger ?? 1) / 100);
      return { kaynak: 'sekilli', L: r.L, R, ID: r.hedefID, as568: r.as568 };
    }
    if (S.Dm > 0 && b) { const r = C.daireselOring(S.Dm, S.cs, b, S.yon); return { kaynak: 'daire', ...r, ID: r.hedefID }; }
    return null;
  }

  function yolGirdi(d, kanalModu) {
    const seg = `<h3 class="mt">Kanal yolu</h3>
      <div class="seg" data-bind="oYol"><button data-v="daire">Dairesel kanal</button><button data-v="sekilli">Şekilli kanal (dikdörtgen, köşe radyüslü)</button></div>`;
    if (S.oYol === 'sekilli') {
      return seg + `<div class="row4 mt">${num('A', 'Eksen ölçüsü A (mm)', 0.5)}${num('Bk', 'Eksen ölçüsü B (mm)', 0.5)}${num('Rk', 'Köşe radyüsü R – eksende (mm)', 0.5, 'placeholder="boş = 6d"')}
        <div class="small">${d ? `Önerilen: R ≥ 3d = <b>${f(3 * d, 1)}</b> mm, tercihen 6d = <b>${f(6 * d, 1)}</b> mm.` : 'R kesite göre önerilir (≥ 3d).'}</div></div>
        <p class="hint">Ölçüler kanalın orta çizgisinden alınır. O-ring bu yola hafifçe gerdirilerek takılır; dar köşe yarıçapında O-ring katlanır veya kanaldan taşar.</p>`;
    }
    if (kanalModu) return seg + `<p class="hint">Dairesel kanalda O-ring iç çapı için yukarıdaki kanal ${S.yon === 'ic' ? 'dış' : 'iç'} çapını girin (opsiyonel).</p>`;
    return seg + `<div class="row4 mt">${num('Dm', 'Kanal eksen çapı Dm (mm)', 0.1, 'placeholder="opsiyonel"')}<div class="small" style="grid-column: span 3">Kanal orta çizgisinin çapı (çizimdeki kanal merkez çapı). Boş bırakırsanız yalnız kanal kesiti (derinlik/genişlik) hesaplanır. Girerseniz kanal iç/dış çapı ve gerekli O-ring iç çapı da verilir.</div></div>`;
  }

  function renderKanalGirdi() {
    const el = $('#kanalGirdi');
    const lead = $('#kanalLead');
    const tolSatir = `<div class="row4">${num('hTol', 'Derinlik toleransı ± (mm)')}${num('bTol', 'Genişlik toleransı + (mm)')}${num('g', 'Flanş boşluğu g (mm, temas=0)')}<div></div></div>`;
    if (S.tip === 'oring' && S.mod === 'conta') {
      lead.textContent = `O-ring kesitini seçin; 3 sıkıştırma oranı için yüz contası kanalı (${yonAd()}) hesaplanır.`;
      el.innerHTML = `<h3>O-ring kesiti</h3>
        <div class="row4">
          <label>Standart kesit<select id="csSel">${D.CS_LISTE.map(c => `<option value="${c.d}" ${Math.abs(c.d - S.cs) < 0.005 ? 'selected' : ''}>${f(c.d)} mm</option>`).join('')}<option value="ozel" ${D.CS_LISTE.some(c => Math.abs(c.d - S.cs) < 0.005) ? '' : 'selected'}>Özel…</option></select></label>
          ${num('cs', 'Kesit d (mm)')}
          <div class="small" style="grid-column: span 2">Kanal derinliği ve genişliği yalnız kesitten hesaplanır. İç çap ve standart ölçü opsiyoneldir.</div>
        </div>
        ${yolGirdi(S.cs, false)}
        ${detay(`
          <label class="chk"><input type="checkbox" data-chk="ozelOring" ${S.ozelOring ? 'checked' : ''}> Elimde belirli bir O-ring var – iç çap veya AS568 numarası ile gireceğim</label>
          ${S.ozelOring ? `<div class="row4 mt"><label>AS568 numarası<input type="text" id="as568In" value="${esc(S.as568 || '')}" placeholder="ör. 136"></label>${num('ID', 'O-ring iç çapı ID (mm)')}<div class="small" id="as568Bilgi" style="grid-column: span 2"></div></div>` : ''}
          <div class="row4 mt">${num('csTol', 'Kesit toleransı ± (mm)')}${S.oYol === 'sekilli' ? num('ger', 'Montaj gerilmesi (%)', 0.5) : '<div></div>'}<div></div><div></div></div>
          <div class="mt">${tolSatir}</div>`)}`;
      const a = $('#as568In');
      if (a) a.addEventListener('change', e => {
        const r = C.as568Bul(e.target.value);
        if (r) { S.as568 = r.dash; S.cs = r.cs; S.csTol = r.csTol; S.ID = r.id; save(); renderAll(true); toast(`AS568${r.dash}: Ø${f(r.id)} × ${f(r.cs)} mm`); }
        else { S.as568 = ''; save(); toast('AS568 numarası bulunamadı'); }
      });
    } else if (S.tip === 'oring') {
      lead.textContent = 'Kanal ölçülerini girin; uygun O-ring kesitleri ve gerekli iç çap önerilir.';
      el.innerHTML = `<h3>Kanal kesiti</h3>
        <div class="row4">${num('kh', 'Kanal derinliği h (mm)')}${num('kb', 'Kanal genişliği b (mm)')}${S.oYol === 'daire' ? num('kcap', S.yon === 'ic' ? 'Kanal DIŞ çapı (mm)' : 'Kanal İÇ çapı (mm)', 0.1, 'placeholder="opsiyonel"') : '<div></div>'}<div class="small">Basınç yönü: <b>${yonAd()}</b>. ${S.yon === 'ic' ? 'O-ring kanalın dış duvarına yaslanır.' : 'O-ring kanalın iç duvarına yaslanır.'}</div></div>
        ${yolGirdi(null, true)}
        ${detay(`${tolSatir}${S.oYol === 'sekilli' ? `<div class="row4 mt">${num('ger', 'Montaj gerilmesi (%)', 0.5)}</div>` : ''}`, 'Detaylar (opsiyonel) – toleranslar, boşluk')}`;
    } else if (S.mod === 'conta') {
      const sk = S.sekil;
      lead.textContent = 'Conta kesit ölçülerini girin; 3 sıkıştırma oranı için kanal / sıkıştırma limiti hesaplanır.';
      el.innerHTML = `<h3>Conta kesiti</h3>
        <div class="row4">
          ${num('gt', sk === 'tup' ? 'Dış çap (mm)' : sk === 'yuvarlak' ? 'Kordon çapı (mm)' : 'Yükseklik / kalınlık t (mm)')}
          ${sk === 'yuvarlak' || sk === 'tup' ? '' : num('gw', 'Genişlik w (mm)')}
          ${sk === 'tup' ? num('gs', 'Et kalınlığı (mm)') : ''}
        </div>
        ${sk === 'duz' || sk === 'sunger' ? `<label class="chk mt"><input type="checkbox" data-chk="kanalda" ${S.kanalda ? 'checked' : ''}> Conta bir kanal içinde (işaretsiz: iki düz flanş arasında, burç/stoperle sınırlı)</label>` : ''}
        ${detay(`<div class="row4">${num('gtTol', 'Conta yükseklik toleransı ± (mm)')}</div><div class="mt">${tolSatir}</div>`, 'Detaylar (opsiyonel) – toleranslar, boşluk')}`;
    } else {
      lead.textContent = 'Kanal (veya flanş arası) ölçülerini girin; 3 sıkıştırma oranı için conta kalınlığı önerilir.';
      el.innerHTML = `<h3>Kanal ölçüleri</h3>
        <div class="row4">${num('kh', S.kanalda || !(S.sekil === 'duz' || S.sekil === 'sunger') ? 'Kanal derinliği h (mm)' : 'Stoper/burç yüksekliği (mm)')}${num('kb', 'Kanal genişliği b (mm)')}${S.sekil === 'yuvarlak' || S.sekil === 'tup' ? '' : num('kw', 'Conta genişliği w (mm, boş=0,6·b)')}${S.sekil === 'tup' ? num('gs', 'Tüp et kalınlığı (mm)') : '<div></div>'}</div>
        ${S.sekil === 'duz' || S.sekil === 'sunger' ? `<label class="chk mt"><input type="checkbox" data-chk="kanalda" ${S.kanalda ? 'checked' : ''}> Conta bir kanal içinde</label>` : ''}
        ${detay(`<div class="row4">${num('g', 'Flanş boşluğu g (mm, temas=0)')}</div>`, 'Detaylar (opsiyonel) – boşluk')}`;
    }
    const cs = $('#csSel');
    if (cs) cs.addEventListener('change', e => { if (e.target.value !== 'ozel') { const c = D.CS_LISTE.find(x => String(x.d) === e.target.value); S.cs = c.d; S.csTol = c.tol; S.as568 = ''; changed(true); } });
    syncControls();
  }

  function svgKesit(b, h, g, d, Hc, yon, sekil, w) {
    // Kanal kesiti + sıkışmış conta + serbest conta (kesikli)
    const W = 320, Hh = 190, pad = 30;
    const span = Math.max(b * 1.9, d * 2.2, 6);
    const k = (W - 2 * pad) / span;
    const x0 = W / 2 - b * k / 2, yTop = 70, yBot = yTop + h * k;
    const yKapak = yTop - (g || 0) * k;
    const isRound = sekil === 'oring' || sekil === 'yuvarlak' || sekil === 'tup';
    const cw = isRound ? Math.min(b, d * d / Hc) : Math.min(b, (w || d));
    const cx = yon === 'dis' ? x0 + cw * k / 2 : x0 + b * k - cw * k / 2;
    const cy = yBot - Hc * k / 2;
    const serbest = isRound
      ? `<circle cx="${cx}" cy="${yBot - d * k / 2}" r="${d * k / 2}" fill="none" stroke="#d9622b" stroke-dasharray="4 3" stroke-width="1.2"/>`
      : `<rect x="${cx - (w || d) * k / 2}" y="${yBot - d * k}" width="${(w || d) * k}" height="${d * k}" fill="none" stroke="#d9622b" stroke-dasharray="4 3" stroke-width="1.2"/>`;
    const sikismis = isRound
      ? `<ellipse cx="${cx}" cy="${cy}" rx="${cw * k / 2}" ry="${Hc * k / 2}" fill="#d9622b" fill-opacity=".85"/>`
      : `<rect x="${cx - cw * k / 2}" y="${yBot - Hc * k}" width="${cw * k}" height="${Hc * k}" rx="${sekil === 'D' ? cw * k / 3 : 2}" fill="#d9622b" fill-opacity=".85"/>`;
    return `<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Kanal kesiti">
      <defs><pattern id="hat" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#9aa5a2" stroke-width="1"/></pattern></defs>
      <rect x="10" y="${yKapak - 34}" width="${W - 20}" height="34" fill="url(#hat)" stroke="#5d676c"/>
      <text x="16" y="${yKapak - 22}" font-size="10" fill="#5d676c">Kapak</text>
      <path d="M10 ${yTop} H${x0} V${yBot} H${x0 + b * k} V${yTop} H${W - 10} V${Hh - 10} H10 Z" fill="url(#hat)" stroke="#5d676c"/>
      <text x="16" y="${Hh - 16}" font-size="10" fill="#5d676c">Gövde</text>
      ${serbest}${sikismis}
      <line x1="${x0}" y1="${yBot + 14}" x2="${x0 + b * k}" y2="${yBot + 14}" stroke="#1d2326"/>
      <text x="${x0 + b * k / 2}" y="${yBot + 28}" font-size="11" text-anchor="middle" fill="#1d2326">b = ${f(b)}</text>
      <line x1="${x0 + b * k + 12}" y1="${yTop}" x2="${x0 + b * k + 12}" y2="${yBot}" stroke="#1d2326"/>
      <text x="${x0 + b * k + 16}" y="${(yTop + yBot) / 2 + 4}" font-size="11" fill="#1d2326">h = ${f(h)}</text>
      <text x="${W / 2}" y="16" font-size="10.5" text-anchor="middle" fill="#5d676c">Kesikli: serbest conta · Dolu: montaj sonrası</text>
    </svg>`;
  }

  function levelKart(s, i, ek) {
    const durum = s.uyarilar.length ? '<span class="badge warn">Kontrol et</span>' : '<span class="badge ok">Uygun</span>';
    return `<div class="level ${i === 1 ? 'nominal' : ''}">
      <div class="tag">${esc(s.seviye)}</div>
      <div class="big">${P(s.c)} <small class="small">sıkıştırma</small></div>
      <dl>${ek}</dl>
      <div class="mt">${durum}</div>
      ${s.uyarilar.map(u => `<div class="warnbox">${esc(u)}</div>`).join('')}
    </div>`;
  }

  function renderKanalSonuc() {
    const el = $('#kanalSonuc');
    if (S.tip === 'oring' && S.mod === 'conta') {
      if (!(S.cs > 0)) { el.innerHTML = ''; return; }
      const r = C.contadanKanal({ sekil: 'oring', t: S.cs, tTol: S.csTol, g: S.g, hTol: S.hTol, bTol: S.bTol, emi: emi() });
      const nom = r.satirlar[1];
      const sec = oringSecim(nom.b);
      const bilgi = $('#as568Bilgi');
      if (bilgi) bilgi.innerHTML = sec && sec.as568 ? `Standart karşılığı: <b>AS568${sec.as568.dash}</b> (Ø${f(sec.as568.id)} × ${f(sec.as568.cs)})` : 'Standart dışı / metrik ölçü';
      const kart = r.satirlar.map((s, i) => {
        let cap = '';
        if (sec && sec.kaynak === 'ozel') { const c = C.oringdenKanalCap(S.ID, S.cs, s.b, S.yon); cap = `<dt>Kanal dış çapı</dt><dd>Ø${f(c.kanalDis)}</dd><dt>Kanal iç çapı</dt><dd>Ø${f(c.kanalIc)}</dd>`; }
        else if (S.oYol === 'daire' && S.Dm > 0) cap = `<dt>Kanal dış çapı</dt><dd>Ø${f(S.Dm + s.b)}</dd><dt>Kanal iç çapı</dt><dd>Ø${f(S.Dm - s.b)}</dd>`;
        else if (sec && sec.kaynak === 'sekilli') cap = `<dt>Kanal eksen yolu</dt><dd>${f(sec.L, 1)} mm</dd>`;
        return levelKart(s, i, `
          <dt>Kanal derinliği h</dt><dd>${f(s.h)} ±${f(S.hTol)}</dd>
          <dt>Kanal genişliği b</dt><dd>${f(s.b)} +${f(S.bTol)}/0</dd>
          ${cap}
          <dt>Sıkıştırma aralığı</dt><dd>${P(s.cMin)} – ${P(s.cMax)}</dd>
          <dt>Doluluk nom / maks</dt><dd>${P(s.dolNom)} / ${P(s.dolMaks)}</dd>`);
      }).join('');
      el.innerHTML = `<div class="levels">${kart}</div>
        ${oringKart(sec, nom)}
        <div class="card"><h3>Nominal tasarım kesiti</h3>
          <div class="sketch">${svgKesit(nom.b, nom.h, S.g, S.cs, nom.H, S.yon, 'oring')}
          <div>
            <p><b>${r.bant.ad}</b> için kabul bandı (en kötü tolerans dahil): <b>${P(r.bant.bant[0])} – ${P(r.bant.bant[1])}</b> sıkıştırma, en fazla <b>${P(r.bant.dolMaks)}</b> kanal doluluğu.</p>
            <p class="small">Doluluk hesabı oda sıcaklığındadır. Ortamda %10’dan fazla şişme veya yüksek sıcaklıkta ısıl genleşme bekleniyorsa kanalı genişletin.</p>
          </div></div>
          ${refs(r.bant.ref)}
        </div>
        ${limitKart(S.cs, r.bant, true)}`;
    } else if (S.tip === 'oring') {
      if (!(S.kh > 0 && S.kb > 0)) { el.innerHTML = ''; return; }
      const k = C.kanaldanOring({ h: S.kh, b: S.kb, g: S.g, hTol: S.hTol, emi: emi() });
      const uygunlar = k.list.filter(x => x.uygun).slice(0, 3);
      const idBul = x => {
        if (S.oYol === 'sekilli' && S.A > 0 && S.Bk > 0) { const m = C.sekilliOring(C.yolUzunlugu(S.A, S.Bk, rAktif(x.d)), x.d, (S.ger ?? 1) / 100); return { ID: m.hedefID, as: m.as568 }; }
        if (S.oYol === 'daire' && S.kcap > 0) { const m = C.kanalCapindanOring(S.kcap, x.d, S.yon); return { ID: m.hedefID, as: m.as568 }; }
        return null;
      };
      const satir = k.list.slice(0, 6).map(x => {
        const best = uygunlar[0] === x;
        const m = idBul(x);
        const idHucre = m ? `ID ≈ <b>Ø${f(m.ID)}</b>${m.as && m.as.ok && x.std.startsWith('AS568') ? `<div class="small">standart karşılığı AS568${m.as.dash} (Ø${f(m.as.id)})</div>` : ''}` : '<span class="small">kanal yolu girilirse</span>';
        return `<tr class="${best ? 'best' : ''} ${x.uygun ? '' : 'dim'}">
          <td><b>${f(x.d)}</b> ±${f(x.tol)}</td>
          <td class="num">${P(x.c)}</td><td class="num">${P(x.cMin)} – ${P(x.cMax)}</td><td class="num">${P(x.dolMaks)}</td>
          <td>${x.uygun ? `<span class="badge ok">${best ? 'En iyi' : 'Uygun'}</span>` : '<span class="badge bad">Uygun değil</span>'}</td>
          <td>${idHucre}</td></tr>`;
      }).join('');
      const b0 = uygunlar[0];
      const rUyari = S.oYol === 'sekilli' && b0 && S.Rk > 0 && S.Rk < 3 * b0.d ? `<div class="warnbox">Köşe radyüsü R${f(S.Rk, 1)} &lt; 3d = ${f(3 * b0.d, 1)} mm: O-ring köşede katlanabilir.</div>` : '';
      el.innerHTML = `<div class="card"><h3>Uygun O-ring kesitleri</h3>
        <table><thead><tr><th>Kesit d (mm)</th><th class="num">Sıkıştırma</th><th class="num">Tolerans aralığı</th><th class="num">Maks. doluluk</th><th>Durum</th><th>Gerekli iç çap</th></tr></thead><tbody>${satir}</tbody></table>
        ${uygunlar.length ? '' : '<div class="warnbox">Bu kanal ölçüsü için standart kesitlerden hiçbiri bandın içinde değil. Kanal derinliği ≈ 0,77 × d, genişliği ≈ 1,35–1,45 × d olacak şekilde düzenleyin.</div>'}
        ${rUyari}
        ${refs(k.bant.ref)}</div>
        ${b0 ? `<div class="card"><h3>Seçilen kesitle montaj görünümü</h3><div class="sketch">${svgKesit(S.kb, S.kh, S.g, b0.d, k.H, S.yon, 'oring')}<div><p>Önerilen kesit <b>${f(b0.d)} mm</b>: nominal sıkıştırma ${P(b0.c)}, en kötü durumda doluluk ${P(b0.dolMaks)}.</p><p class="small">3 farklı sıkıştırma oranıyla kanalı yeniden boyutlandırmak için bu kesiti “conta → kanal” moduna aktarabilirsiniz.</p><button class="mini" id="aktar">Bu kesiti “conta → kanal” moduna aktar</button></div></div></div>` : ''}
        ${limitKart(b0 ? b0.d : S.kh / 0.77, k.bant, true)}`;
      const ak = $('#aktar');
      if (ak) ak.addEventListener('click', () => {
        S.cs = b0.d; S.csTol = b0.tol; S.mod = 'conta'; S.ozelOring = false;
        if (S.oYol === 'daire' && S.kcap > 0) S.Dm = S.yon === 'ic' ? S.kcap - S.kb : S.kcap + S.kb;
        save(); renderAll(true); toast('Kesit aktarıldı');
      });
    } else if (S.mod === 'conta') {
      if (!(S.gt > 0)) { el.innerHTML = ''; return; }
      const p = gasketParam();
      const r = C.contadanKanal(p);
      const kart = r.satirlar.map((s, i) => levelKart(s, i, r.kanalda ? `
          <dt>Kanal derinliği h</dt><dd>${f(s.h)} ±${f(S.hTol)}</dd>
          <dt>Kanal genişliği b</dt><dd>${f(s.b)} +${f(S.bTol)}/0</dd>
          <dt>Sıkışmış yükseklik</dt><dd>${f(s.H)}</dd>
          <dt>Sıkıştırma aralığı</dt><dd>${P(s.cMin)} – ${P(s.cMax)}</dd>
          <dt>Doluluk nom / maks</dt><dd>${P(s.dolNom)} / ${P(s.dolMaks)}</dd>` : `
          <dt>Flanş arası mesafe</dt><dd>${f(s.H)}</dd>
          <dt>Stoper / burç boyu</dt><dd>${f(s.H)} ±${f(S.hTol)}</dd>
          <dt>Sıkıştırma aralığı</dt><dd>${P(s.cMin)} – ${P(s.cMax)}</dd>`)).join('');
      const nom = r.satirlar[1];
      el.innerHTML = `<div class="levels">${kart}</div>
        <div class="card"><h3>Nominal tasarım kesiti</h3>
        <div class="sketch">${r.kanalda ? svgKesit(nom.b, nom.h, S.g, S.gt, nom.H, S.yon, S.sekil, S.gw) : '<div class="small">Kanalsız uygulama: conta iki düz yüzey arasında. Sıkıştırmayı cıvata torku yerine <b>stoper/burç</b> ile sınırlayın.</div>'}
        <div><p><b>${r.bant.ad}</b> kabul bandı: <b>${P(r.bant.bant[0])} – ${P(r.bant.bant[1])}</b>${r.kanalda ? `, maks. doluluk ${P(r.bant.dolMaks)}` : ''}.</p>
        ${r.bant.yaklasik ? '<div class="warnbox">Bu profil için değerler yaklaşıktır; üretici veri sayfasındaki sıkıştırma–kuvvet eğrisiyle teyit edin.</div>' : ''}
        ${S.sekil === 'tup' ? '<p class="small">Boşluklu profiller düşük kuvvetle yüksek sapma sağlar; tolerans ve yüzey dalgalanmasını iyi tolere eder. Kanal doluluğu dolu malzeme alanına göre hesaplanmıştır.</p>' : ''}
        ${S.sekil === 'duz' ? '<p class="small">Düz levha contalar yanlara doğru genişler (hacim korunur). Kanal genişliği bu genişlemeye pay bırakacak şekilde hesaplandı.</p>' : ''}
        </div></div>${refs(r.bant.ref)}</div>
        ${limitKart(S.gt, r.bant, r.kanalda)}`;
    } else {
      if (!(S.kh > 0)) { el.innerHTML = ''; return; }
      const kanalda = S.sekil === 'duz' || S.sekil === 'sunger' ? S.kanalda : true;
      const r = C.kanaldanConta({ sekil: S.sekil, h: S.kh, b: S.kb, g: S.g, w: S.kw || 0, s: S.gs, emi: emi(), kanalda });
      const kart = r.satirlar.map((s, i) => levelKart(s, i, `
          <dt>Gerekli ${S.sekil === 'yuvarlak' ? 'kordon çapı' : S.sekil === 'tup' ? 'tüp dış çapı' : 'conta kalınlığı'}</dt><dd>${f(s.t)}</dd>
          <dt>En yakın stok</dt><dd>${f(s.tStok, 1)}</dd>
          ${S.sekil === 'yuvarlak' || S.sekil === 'tup' ? '' : `<dt>Conta genişliği</dt><dd>${f(s.w)}</dd>`}
          ${s.dol != null ? `<dt>Kanal doluluğu</dt><dd>${P(s.dol)}</dd>` : ''}`)).join('');
      el.innerHTML = `<div class="levels">${kart}</div>
        <div class="card info"><p>Stok kalınlık seçildiğinde gerçek sıkıştırma değişir: <b>c = 1 − ${f(r.H)} / t<sub>stok</sub></b>. Seçtiğiniz stok kalınlığını “Contayı biliyorum” moduna girerek toleranslı kontrol yapın.</p>${refs(r.bant.ref)}</div>
        ${limitKart(r.satirlar[1].t, r.bant, kanalda)}`;
    }
  }

  function oringKart(sec, nom) {
    const neden = `<details class="detay"><summary>İç çap neden önemli?</summary><div class="detay-ic small">
      Kanal derinliği ve genişliği yalnız kesitten çıkar. İç çap ise O-ring’in kanalda <b>hangi duvara yaslanacağını</b> ve ne kadar <b>gerileceğini veya çevresel sıkışacağını</b> belirler.
      <ul><li>O-ring çok gerilirse (&gt; %5) kesiti incelir, sıkıştırma düşer ve sızdırma riski artar.</li>
      <li>Çevresel olarak çok sıkışırsa (&gt; %3) kanal içinde dalgalanır, montajda kanaldan taşar ve kapak arasına sıkışır.</li>
      <li>Basınç O-ring’i kanalın karşı duvarına iterse her basınç çevriminde hareket eder ve zamanla aşınır.</li></ul>
      Bu yüzden iç çabı doğrudan girmek yerine <b>kanal yolunu</b> (dairesel kanalda eksen çapını, şekilli kanalda A×B ve köşe R değerini) girmeniz yeterlidir; gerekli iç çapı uygulama hesaplar. Standart ölçü (AS568) yalnız bilgi amaçlı karşılık olarak gösterilir.</div></details>`;
    if (!sec) return `<div class="card info"><h3>O-ring iç çapı</h3><p class="small">Kanal yolu girilmedi: yalnız kesit hesaplandı. İç çap önerisi için yukarıda <b>kanal eksen çapı</b> veya <b>şekilli kanal ölçüleri</b> girin.</p>${neden}</div>`;
    const d = S.cs;
    const as = sec.as568;
    const etiket = sec.kaynak === 'sekilli' ? 'gerilme' : S.yon === 'ic' ? 'çevresel sıkışma' : 'gerilme';
    const rUyari = sec.kaynak === 'sekilli' && sec.R < 3 * d ? `<div class="warnbox">Köşe radyüsü R${f(sec.R, 1)} &lt; 3d = ${f(3 * d, 1)} mm: O-ring köşede katlanabilir. R ≥ ${f(3 * d, 1)} mm (tercihen ${f(6 * d, 1)}) yapın.</div>` : '';
    return `<div class="card"><h3>${sec.kaynak === 'ozel' ? 'Seçtiğiniz O-ring' : 'Önerilen O-ring'}</h3>
      <div class="kv">
        <div><b>Ø${f(sec.ID)}</b><span>iç çap ID ${sec.kaynak === 'ozel' ? '(girilen)' : '(hesaplanan)'}</span></div>
        <div><b>Ø${f(sec.ID + 2 * d)}</b><span>dış çap</span></div>
        <div><b>${f(d)} mm</b><span>kesit d</span></div>
        ${sec.kaynak === 'sekilli' ? `<div><b>${f(sec.L, 1)} mm</b><span>kanal eksen yolu (R = ${f(sec.R, 1)} mm${S.Rk > 0 ? '' : ', otomatik 6d'})</span></div>` : ''}
        ${sec.kaynak === 'daire' ? `<div><b>Ø${f(sec.kanalDis)} / Ø${f(sec.kanalIc)}</b><span>nominal kanal dış / iç çapı</span></div>` : ''}
      </div>
      ${as ? `<p class="small mt">Opsiyonel standart karşılığı: <b>AS568${as.dash}</b> – Ø${f(as.id)} × ${f(as.cs)} mm ${as.oran != null ? `<span class="badge ${as.ok ? 'ok' : 'warn'}">${etiket} ${P(as.oran)}</span>` : ''}${as.ok ? '' : ' – bu kesitte uygun standart iç çap yok, metrik/özel ölçü isteyin.'}</p>` : '<p class="small mt">Bu kesitte AS568 karşılığı yok; metrik (ISO 3601) veya özel ölçü olarak sipariş edilir.</p>'}
      ${rUyari}${neden}${refs(['parker', 'as568'])}</div>`;
  }

  function limitKart(t, bant, kanalda) {
    const Hmin = t * (1 - bant.bant[1]);
    const plastik = S.govde === 'plastik' || S.kapakZayif;
    return `<div class="card"><h3>Sıkıştırma limiti (compression limit)</h3>
      <div class="kv">
        <div><b>${P(bant.bant[1])}</b><span>izin verilen en yüksek sıkıştırma</span></div>
        <div><b>${f(Hmin)} mm</b><span>contanın inebileceği en düşük yükseklik</span></div>
        <div><b>${P(bant.bant[0])}</b><span>sızdırmazlık için en düşük sıkıştırma</span></div>
      </div>
      <ul class="mt">
        ${kanalda ? '<li><b>Metal-metal temas</b> önerilir: kanal derinliği sıkıştırmayı kendiliğinden sınırlar, cıvata torkundan bağımsız olur.</li>' : '<li>Kanalsız uygulamada cıvata deliklerine <b>stoper / burç</b> koyun; boyu yukarıdaki nominal “flanş arası mesafe” kadar olsun.</li>'}
        ${plastik ? '<li>Plastik gövdede cıvata deliklerine <b>metal compression limiter</b> (pirinç/çelik burç) kullanın; plastik sünerek zamanla sıkıştırmayı kaybettirir.</li>' : ''}
        <li>Conta, kapak eğilmesi nedeniyle cıvatalar arasında daha az sıkışır; en uzak noktada bile alt sınırın üstünde kalmalı (kapak rijitliği / cıvata aralığı → 4. sayfa).</li>
      </ul></div>`;
  }

  // ---------------- 3. Malzeme ----------------
  function renderMalzeme() {
    const liste = C.malzemeSirala(S.Tmin ?? 20, S.Tmax ?? 20, S.ortam, emi(), S.siralama);
    const goster = $('#uygunsuzGoster').checked;
    let sira = 0;
    if (!S.malz || !liste.find(x => x.m.kod === S.malz)) { const ilk = liste.find(x => x.uygun); if (ilk) { S.malz = ilk.m.kod; S.shore = C.shoreOneri(ilk.m, S.P, S.kapakZayif)[0].shore; save(); renderOzet(); } }
    $('#malzemeListe').innerHTML = liste.filter(x => x.uygun || goster).map(x => {
      const m = x.m; if (x.uygun) sira++;
      const kod = m.d2000 ? C.d2000Kod(m.d2000) : (m.mil || 'Üretici spesifikasyonu');
      return `<div class="card mat ${S.malz === m.kod ? 'sel' : ''} ${x.uygun ? '' : 'dim'}">
        <div>
          <div class="name">${x.uygun && sira <= 3 ? `<span class="badge ok">Öneri ${sira}</span> ` : ''}${!x.uygun ? '<span class="badge bad">Uygun değil</span> ' : ''}${esc(m.ad)}</div>
          <div class="pill-row small">
            <span class="chip">${m.tmin} … ${m.tmax} °C <span class="small">(kısa ${m.tKisa})</span></span>
            <span class="chip">Bulunurluk ${stars(m.bul)}</span>
            <span class="chip">Maliyet <b>${'₺'.repeat(m.mal)}</b></span>
            <span class="chip">Sertlik ${m.shore.map(s => s + 'A').join(' / ')}</span>
          </div>
          <p class="small">${esc(m.not)}</p>
          <div class="small"><b>Tipik çağrı:</b> <code>${esc(kod)}</code></div>
          ${x.sebep.map(s => `<div class="warnbox" style="background:var(--bad-soft);color:var(--bad)">${esc(s)}</div>`).join('')}
          ${x.zayif.map(s => `<div class="warnbox">${esc(s)}</div>`).join('')}
        </div>
        <div class="mat-actions"><button class="mini ${S.malz === m.kod ? 'on' : ''}" data-malz="${m.kod}">${S.malz === m.kod ? 'Seçili' : 'Seç'}</button></div>
      </div>`;
    }).join('') || '<div class="card">Bu koşullara uyan malzeme yok. Sıcaklık aralığını veya ortamları kontrol edin; “Uygun olmayanları da göster” ile nedenleri görebilirsiniz.</div>';
    $$('[data-malz]').forEach(b => b.addEventListener('click', () => {
      S.malz = b.dataset.malz; const m = mat(); S.shore = C.shoreOneri(m, S.P, S.kapakZayif)[0].shore; S.d2 = null; S.yapMalz = null; changed(true);
    }));

    const m = mat();
    if (!m) { $('#shoreKart').innerHTML = ''; return; }
    const sh = C.shoreOneri(m, S.P ?? 0, S.kapakZayif, S.metalTemas ? 0 : 0.15);
    $('#shoreKart').innerHTML = `<div class="card"><h3>Shore A önerisi – ${esc(m.kod)} (${f(S.P, 1)} bar${S.kapakZayif ? ', düşük sıkma kuvveti' : ''})</h3>
      <table><thead><tr><th>Seçenek</th><th>Sertlik</th><th>Neden</th><th></th></tr></thead><tbody>
      ${sh.map((s, i) => `<tr class="${S.shore === s.shore ? 'best' : ''}"><td>${i === 0 ? '<span class="badge ok">Birincil</span>' : 'Alternatif ' + i}</td><td><b>${s.shore} ± 5 Shore A</b></td><td>${esc(s.neden)}</td><td><button class="mini ${S.shore === s.shore ? 'on' : ''}" data-shore="${s.shore}">${S.shore === s.shore ? 'Seçili' : 'Seç'}</button></td></tr>`).join('')}
      </tbody></table>
      <p class="small">Statik yüz contasında metal-metal temas varsa ekstrüzyon boşluğu ≈ 0’dır ve 70 Shore A çoğu durumda 100 bar’a kadar yeterlidir. Temas yoksa Parker ekstrüzyon diyagramına (basınç–boşluk–sertlik) göre kontrol edin.</p>
      ${refs(['parker', 'd2240'])}</div>`;
    $$('[data-shore]').forEach(b => b.addEventListener('click', () => { S.shore = +b.dataset.shore; S.d2 = null; changed(true); }));
  }

  // ---------------- 4. Kurallar ----------------
  const E_MALZ = { al: 70000, paslanmaz: 193000, celik: 200000, plastik: 3000 };
  function sikistirmaBilgi() {
    if (S.tip === 'oring') {
      if (S.mod === 'conta') { const r = C.contadanKanal({ sekil: 'oring', t: S.cs, tTol: S.csTol, g: S.g, hTol: S.hTol, bTol: S.bTol, emi: emi() }); const n = r.satirlar[1]; return { sekil: 'oring', d: S.cs, w: S.cs, b: n.b, cNom: n.c, cMinWorst: n.cMin, bantAlt: r.bant.bant[0] }; }
      const k = C.kanaldanOring({ h: S.kh, b: S.kb, g: S.g, hTol: S.hTol, emi: emi() }); const x = k.list.find(y => y.uygun) || k.list[0];
      return { sekil: 'oring', d: x.d, w: x.d, b: S.kb, cNom: x.c, cMinWorst: x.cMin, bantAlt: k.bant.bant[0] };
    }
    if (S.mod === 'conta') { const r = C.contadanKanal(gasketParam()); const n = r.satirlar[1]; return { sekil: S.sekil, d: S.gt, w: S.gw, b: n.b || S.gw, cNom: n.c, cMinWorst: n.cMin, bantAlt: r.bant.bant[0], kanalli: r.kanalda }; }
    const r = C.kanaldanConta({ sekil: S.sekil, h: S.kh, b: S.kb, g: S.g, w: S.kw || 0, s: S.gs, emi: emi(), kanalda: S.kanalda }); const n = r.satirlar[1];
    return { sekil: S.sekil, d: n.t, w: n.w, b: S.kb, cNom: n.c, cMinWorst: n.c - (S.hTol + (S.gtTol || 0.1)) / n.t, bantAlt: r.bant.bant[0] };
  }
  function cevreOto(b) {
    if (S.tip === 'oring' && S.oYol === 'sekilli' && S.A > 0 && S.Bk > 0) return { L: C.yolUzunlugu(S.A, S.Bk, rAktif(S.cs)), ac: S.A * S.Bk / (2 * (S.A + S.Bk)), kaynak: 'şekilli kanal yolu' };
    if (S.tip === 'oring' && S.oYol === 'daire' && S.mod === 'conta' && S.Dm > 0) return { L: Math.PI * S.Dm, ac: S.Dm / 4, kaynak: 'kanal eksen çapı' };
    if (S.tip === 'oring' && S.mod === 'kanal' && S.kcap > 0) { const Dm = S.yon === 'ic' ? S.kcap - b : S.kcap + b; return { L: Math.PI * Dm, ac: Dm / 4, kaynak: 'kanal çapı' }; }
    return null;
  }

  // Tıklanabilir ölçü kutusu
  const kvb = (key, deger, etiket, ana) => `<button type="button" class="kvb ${ana ? 'ana' : ''} ${S.kvAcik === key ? 'on' : ''}" data-kv="${key}"><span class="ipucu">${S.kvAcik === key ? 'Kapat ▾' : 'Detay ▸'}</span><b>${deger}</b><span>${etiket}</span></button>`;
  function kvPanel(anahtarlar, detaylar) {
    if (!anahtarlar.includes(S.kvAcik) || !detaylar[S.kvAcik]) return '';
    const x = detaylar[S.kvAcik];
    return `<div class="kvdetay"><h4>${esc(x.baslik)}</h4><div class="rule-govde" style="padding-left:0">${x.ciz}<div class="small">${x.metin}${refs(x.refs)}</div></div></div>`;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('button.kvb[data-kv]');
    if (!b) return;
    S.kvAcik = S.kvAcik === b.dataset.kv ? null : b.dataset.kv; save(); renderKurallar();
  });

  function renderKurallar() {
    const sb = sikistirmaBilgi();
    const nk = nominalKanal();
    const kanalli = nk.kanalli !== false;
    const govdeK = S.kapakMalz || S.govde;
    const plastik = govdeK === 'plastik';
    const pr = C.civataKurallari({ M: S.M, d: sb.d, b: sb.b, kanalli, metalTemas: S.metalTemas, plastik: plastik || S.kapakZayif, emi: emi(), fGHz: S.fGHz, cevre: null });
    const oto = cevreOto(sb.b);
    const cevre = S.cevre > 0 ? S.cevre : (oto ? oto.L : 400);
    const alanCevre = oto && !(S.cevre > 0) ? oto.ac : cevre / 16;
    const Ek = E_MALZ[govdeK] || 70000;
    const a = S.kirisA > 0 ? S.kirisA : Math.max(15, 2 * pr.eksen);
    const shore = S.shore || (mat() ? mat().shore[0] : 70);
    const tk = S.kapakT || 5;
    const ca = C.civataAraligi({ sekil: sb.sekil, d: sb.d, w: sb.w, cNom: sb.cNom, cMinWorst: sb.cMinWorst, bantAlt: sb.bantAlt, shore, Ek, tk, a, Pbar: S.P, alanCevre, M: S.M, qOzel: S.qOzel });
    const k = S.civK > 0 ? S.civK : 0.8;
    const pEg = ca.C ? ca.C * k : null;
    const asme = C.asmeMaksAralik(pr.db, tk, sb.sekil, shore);
    const asmeEmi = emi() ? asme.Bmax * 0.75 : asme.Bmax;
    const pMinT = Math.max(2.3 * pr.db, 2 * pr.db + 2);
    let pOneri = Math.min(pEg ?? Infinity, asmeEmi);
    if (!isFinite(pOneri)) pOneri = asmeEmi;
    const minAltinda = pOneri < pMinT;
    pOneri = Math.max(pOneri, pMinT);
    const yoneten = minAltinda ? 'Hesap en küçük anahtar aralığının altında kaldı: daha kalın kapak veya daha rijit malzeme gerekir.' : (pEg && pEg <= asmeEmi) ? 'Belirleyici: kapak eğilmesi hesabı.' : 'Belirleyici: ASME VIII-1 Ek 2 / TEMA en büyük aralık sınırı' + (emi() ? ' (EMI için %25 sıklaştırıldı).' : '.');
    const adet = Math.max(4, Math.ceil(cevre / pOneri));
    const adet4 = Math.ceil(adet / 4) * 4;
    const cv = D.CIVATA[S.M] || { MA: 0, FM: 0 };
    const disBoy = govdeK === 'al' ? 2 * pr.db : govdeK === 'plastik' ? 2.5 * pr.db : pr.db;
    const govdeAd = { al: 'alüminyum', paslanmaz: 'paslanmaz', celik: 'çelik', plastik: 'plastik' }[govdeK];
    const seri = D.DELIK_SERI[S.M] || [pr.delik, pr.delik, pr.delik];
    const ctxEg = `Cıvata aralığı C, kapak şeridi sürekli kiriş kabul edilerek hesaplandı: iki cıvata ortasındaki ek açılma ΔH, contanın en kötü tolerans durumundaki sıkışmasından alt sınıra (${P(sb.bantAlt)}) kadar kalan payı aşmamalı.`;

    const DET = {
      delik: { baslik: `${S.M} geçiş deliği – ISO 273`, ciz: CIZIM.delikDetay({ D: pr.delik, d: pr.db, seri }),
        metin: `<p>ISO 273’te üç seri vardır: <b>ince Ø${f(seri[0], 1)}</b>, <b>orta Ø${f(seri[1], 1)}</b>, <b>kaba Ø${f(seri[2], 1)}</b>. Kapak bağlantılarında genelde <b>orta seri</b> kullanılır. Kapak kılavuz pimle konumlanıyorsa ince seri yeterlidir. Delik toleransı H13 yazılabilir.</p>`, refs: [['iso273', 'Geçiş deliği çapları (ince/orta/kaba seri).']] },
      et: { baslik: 'Kanal kenarı – delik kenarı arası et', ciz: CIZIM.etKalinlik({ delik: pr.delik, b: sb.b, e: pr.eMin, L: pr.eksen, M: S.M }),
        metin: `<p>Et kalınlığı e = maks(2 mm, d) = <b>${f(pr.eMin, 1)} mm</b> (plastikte maks(3 mm, 1,5·d)). Daha ince et, işlemede çapak/kırılmaya ve sıkmada kanal duvarının esnemesine yol açar. Havşa başlı cıvatada havşa çapını, rondelada rondela dış çapını (≈ 2d = ${f(pr.rondela, 0)} mm) ölçün.</p>`, refs: [['kural', 'Et kalınlığı için temkinli başlangıç değeri; işleme ve dayanım kontrolüyle doğrulanmalı.']] },
      eksen: { baslik: 'Kanal ekseni – cıvata ekseni mesafesi', ciz: CIZIM.etKalinlik({ delik: pr.delik, b: sb.b, e: pr.eMin, L: pr.eksen, M: S.M }),
        metin: `<p>L = Ø<sub>delik</sub>/2 + e + b/2 = ${f(pr.delik / 2, 2)} + ${f(pr.eMin, 2)} + ${f(sb.b / 2, 2)} = <b>${f(pr.eksen, 1)} mm</b>. Bu en küçük değerdir; L büyüdükçe kapak eğilmesi contayı daha çok etkiler. Bu nedenle kanalı cıvata hattına olabildiğince yakın tutun.</p>`, refs: [['kural', 'Geometrik toplam.'], ['iso273', 'Delik çapı.']] },
      kenar: { baslik: 'Delik merkezi – parça kenarı', ciz: CIZIM.kenarMesafe({ min: pr.kenarMin, ter: pr.kenarTercih, M: S.M }),
        metin: `<p>Kenar mesafesi en az <b>1,5·d = ${f(pr.kenarMin, 1)} mm</b>, tercihen <b>2·d = ${f(pr.kenarTercih, 1)} mm</b>. Daha kısa kenarda sıkma kuvveti eti dışa iter, ince saclarda yırtılma olur.</p>`, refs: [['kural', 'Yaygın tasarım kuralı (1,5d–2d).']] },
      tork: { baslik: `${S.M} sıkma torku ve diş boyu`, ciz: CIZIM.tork({ Lk: Math.min(90, disBoy * 6), MA: cv.MA, FM: cv.FM, dis: disBoy, M: S.M, govdeAd }),
        metin: `<table><tr><td>Sıkma torku MA</td><td class="num"><b>${f(cv.MA, 1)} Nm</b></td><td>8.8, µ = 0,12, kuru-hafif yağlı</td></tr><tr><td>Montaj ön yükü FM</td><td class="num">${f(cv.FM, 2)} kN</td><td>cıvata başına</td></tr><tr><td>Conta + basınç yükü</td><td class="num">${ca.Fciv ? f(ca.Fciv / 1000, 2) + ' kN' : '–'}</td><td>${ca.Fciv ? 'ön yükün %' + f(ca.Fciv / (cv.FM * 1000) * 100, 0) + '’i' : ''}</td></tr><tr><td>En az diş boyu</td><td class="num"><b>${f(disBoy, 0)} mm</b></td><td>${govdeAd} gövdede ${govdeK === 'al' ? '2·d' : govdeK === 'plastik' ? '2,5·d + metal insert' : '1·d'}</td></tr></table>
          <ul><li>Cıvatalar <b>çapraz sırayla, 3 adımda</b> (≈ %30 → %70 → %100) son torka getirilir.</li>
          <li>O-ring + metal-metal temaslı tasarımda tam tork uygulanır; sıkışmayı kanal derinliği sınırlar.</li>
          <li>Kanalsız düz/sünger contada sıkışma torka bağlıdır: stoper/burç kullanın, yoksa torku düşürün.</li>
          ${govdeK === 'al' ? '<li>Alüminyumda sık sökülen bağlantılarda Helicoil (tel diş) kullanın.</li>' : ''}${govdeK === 'plastik' ? '<li>Plastikte doğrudan diş açmayın: pirinç insert ve metal compression limiter kullanın; tork plastik üreticisinin değerine göre düşürülür.</li>' : ''}
          <li>Yağlı (µ ≈ 0,08) cıvatada aynı tork çok daha yüksek ön yük verir. Yağlıyorsanız torku yeniden hesaplayın.</li></ul>`,
        refs: [['vdi2230', `${S.M} 8.8 µ=0,12: MA ≈ ${f(cv.MA, 1)} Nm, FM ≈ ${f(cv.FM, 2)} kN.`], ['amorim', 'Çapraz sıkma, 3 adım, yağlama uyarısı.'], ['kural', 'Diş boyu: çelik 1d, alüminyum 2d, plastik insert – yaygın tasarım kuralı.']] },
      aralik: { baslik: 'Önerilen cıvata aralığı nasıl bulundu?', ciz: CIZIM.egilme({ t: tk, C: pOneri, dH: ca.dH }),
        metin: `<p>Üç sınır birlikte kontrol edilir ve en dar olanı seçilir:</p>
          <table><tr><td>1. Kapak eğilmesi (k = ${f(k, 2)})</td><td class="num">${pEg ? f(pEg, 0) + ' mm' : 'pay yok'}</td></tr>
          <tr><td>2. ASME VIII-1 Ek 2 / TEMA en büyük aralık${emi() ? ' × 0,75 (EMI)' : ''}</td><td class="num">${f(asmeEmi, 0)} mm</td></tr>
          <tr><td>3. En küçük aralık (anahtar boşluğu)</td><td class="num">≥ ${f(pMinT, 0)} mm</td></tr>
          <tr><td><b>Sonuç</b></td><td class="num"><b>${f(pOneri, 0)} mm</b></td></tr></table>
          <p>${yoneten}</p>`,
        refs: [['ee', ctxEg], ['asme', `B_maks = 2·${pr.db} + 6·${f(tk, 1)} / (${asme.m} + 0,5) = ${f(asme.Bmax, 0)} mm.`], ['tema', 'En küçük aralık için oran ≈ 2,3·d.']] },
      egilmeC: { baslik: 'Kapak eğilmesine göre en büyük aralık', ciz: CIZIM.egilme({ t: tk, C: ca.C || 0, dH: ca.dH }),
        metin: `<div class="formul">C = [ 480 · E · a · t³ · ΔH / (13·q<sub>min</sub> + 2·q<sub>max</sub>) ]<sup>¼</sup> = <b>${ca.C ? f(ca.C, 0) : '–'} mm</b></div>
          <table>
            <tr><td>E (kapak)</td><td class="num">${f(Ek / 1000, 0)} GPa</td><td>${govdeAd}</td></tr>
            <tr><td>a (kiriş genişliği)</td><td class="num">${f(a, 1)} mm</td><td>${S.kirisA > 0 ? 'girilen' : 'otomatik: 2 × kanal–cıvata eksen mesafesi'}</td></tr>
            <tr><td>t (kapak kalınlığı)</td><td class="num">${f(tk, 1)} mm</td><td></td></tr>
            <tr><td>ΔH (izin verilen açılma)</td><td class="num">${f(ca.dH, 3)} mm</td><td>d × (en kötü sıkıştırma − alt sınır)</td></tr>
            <tr><td>q<sub>max</sub> (cıvata hizası)</td><td class="num">${f(ca.qmax, 2)} N/mm</td><td>conta ${P(sb.cNom)}${ca.qp ? ' + basınç ' + f(ca.qp, 2) : ''}</td></tr>
            <tr><td>q<sub>min</sub> (cıvata ortası)</td><td class="num">${f(ca.qmin, 2)} N/mm</td><td>conta ${P(sb.bantAlt)}</td></tr>
            <tr><td>Conta E (Shore ${shore}A)</td><td class="num">${f(ca.E, 2)} MPa</td><td>Gent bağıntısı</td></tr>
            <tr><td>Conta kuvveti</td><td colspan="2">${esc(ca.yontem)}</td></tr>
          </table>
          <p>Basınç yükü, kapak alanı / conta çevresi oranıyla (${f(alanCevre, 1)} mm) çizgisel yüke çevrildi. Model kapak şeridini cıvatalar arasında sürekli kiriş kabul eder; köşe ve nervürler kapağı rijitleştirir, sonuç güvenli taraftadır.</p>`,
        refs: [['ee', ctxEg], ['krishnan', 'Denklemin dayandığı çalışma.'], ['oren', 'Rijit flanş – sürekli kiriş yaklaşımı.'], ['lindley', 'Conta birim uzunluk kuvveti q.'], ['parkerKuvvet', 'q değerini Parker eğrisiyle karşılaştırın.'], ['gent', 'Shore A → E.']] },
      asme: { baslik: 'ASME VIII-1 Ek 2 / TEMA en büyük cıvata aralığı', ciz: CIZIM.egilme({ t: tk, C: asme.Bmax, dH: ca.dH }),
        metin: `<div class="formul">B<sub>maks</sub> = 2·a + 6·t / (m + 0,5) = 2·${pr.db} + 6·${f(tk, 1)} / (${asme.m} + 0,5) = <b>${f(asme.Bmax, 0)} mm</b></div>
          <p>a: nominal cıvata çapı, t: flanş/kapak kalınlığı, m: conta faktörü. O-ring ve dolu/boşluklu kordon kendinden enerjili sayılır (m = 0). Elastomer düz contada 75 Shore A altında m = 0,5, üstünde m = 1,0.</p>
          <p>Cıvata aralığı <b>2a + t = ${f(asme.Bsc, 0)} mm</b> değerini aşarsa ASME flanş momentini √(aralık / (2a + t)) katsayısıyla büyütür. Basınçlı kaplar için geliştirilmiştir; kapaklarda temkinli bir üst sınır olarak kullanılır.</p>`,
        refs: [['asme', 'Bolt spacing (max) = 2a + 6t/(m + 0,5).'], ['tema', 'Aynı ifade TEMA standartlarında da yer alır.']] },
      pmin: { baslik: 'En küçük cıvata aralığı', ciz: CIZIM.yerlesim(),
        metin: `<p>Cıvata başı ve anahtarın sığması için aralık en az <b>${f(pMinT, 0)} mm</b> olmalı (≈ maks(2,3·d, rondela çapı + 2 mm)). TEMA Tablo D-5’te büyük cıvatalar için bu oran ≈ 2,3·d’dir.</p>`, refs: [['tema', 'Anahtar boşluğuna göre en küçük aralık.']] },
      adet: { baslik: 'Cıvata sayısı', ciz: CIZIM.yerlesim(),
        metin: `<p>n = çevre / aralık = ${f(cevre, 0)} / ${f(pOneri, 0)} → <b>${adet}</b> cıvata. Simetri ve köşe yerleşimi için 4’ün katına yuvarlamak pratiktir: <b>${adet4}</b>. Dikdörtgen kapakta her köşeye bir cıvata koyun; köşe cıvatası kanal köşe radyüsünün dışında kalsın.</p>`,
        refs: [['kural', '4’ün katına yuvarlama ve köşe cıvatası – yaygın uygulama.']] },
      kose: { baslik: 'Kanal köşe yarıçapı', ciz: CIZIM.kose({ Rmin: 3 * sb.d, Rtercih: 6 * sb.d }),
        metin: `<p>Kanal ekseninde köşe yarıçapı en az <b>3·d = R${f(3 * sb.d, 1)}</b>, tercihen <b>6·d = R${f(6 * sb.d, 1)}</b>. Dar köşede O-ring katlanır, kanaldan taşar veya köşede sıkışma azalır.</p>`, refs: [['parker', 'Dairesel olmayan yüz contası kanallarında köşe yarıçapı ≥ 3 × kesit.']] }
    };
    const yer = ['delik', 'et', 'eksen', 'kenar', 'tork', 'kose'];
    const ara = ['aralik', 'egilmeC', 'asme', 'pmin', 'adet'];

    $('#civataSonuc').innerHTML = `<p class="small">2. sayfadaki nominal tasarımdan: kesit/kalınlık ${f(sb.d)} mm, kanal genişliği ${f(sb.b)} mm, nominal sıkıştırma ${P(sb.cNom)}, en kötü durumda ${P(sb.cMinWorst)}. Conta çevresi ${f(cevre, 0)} mm${S.cevre > 0 ? '' : oto ? ' (' + oto.kaynak + 'ndan otomatik)' : ' (varsayılan – girin)'}. <b>Kutulara tıklayın</b>: çizim, açıklama ve kaynak açılır.</p>
      <h3 class="mt">Yerleşim ölçüleri</h3>
      <div class="kv">
        ${kvb('delik', 'Ø' + f(pr.delik, 1), `${S.M} geçiş deliği (ISO 273 orta)`)}
        ${kvb('et', '≥ ' + f(pr.eMin, 1) + ' mm', 'kanal kenarı – delik kenarı arası et')}
        ${kvb('eksen', '≥ ' + f(pr.eksen, 1) + ' mm', 'kanal ekseni – cıvata ekseni')}
        ${kvb('kenar', f(pr.kenarMin, 1) + ' – ' + f(pr.kenarTercih, 1) + ' mm', 'delik merkezi – parça kenarı')}
        ${kvb('tork', f(cv.MA, 1) + ' Nm', `${S.M} 8.8 sıkma torku · diş ≥ ${f(disBoy, 0)} mm`)}
        ${kvb('kose', 'R ≥ ' + f(3 * sb.d, 1), 'kanal köşe yarıçapı (öneri R' + f(6 * sb.d, 0) + ')')}
      </div>
      ${kvPanel(yer, DET)}
      <h3 class="mt">Cıvata aralığı</h3>
      <div class="kv">
        ${kvb('aralik', f(pOneri, 0) + ' mm', `önerilen aralık → en az ${adet} cıvata`, true)}
        ${kvb('egilmeC', ca.C ? f(ca.C, 0) + ' mm' : '–', 'kapak eğilmesine göre en büyük')}
        ${kvb('asme', f(asmeEmi, 0) + ' mm', 'ASME VIII-1 Ek 2 / TEMA en büyük' + (emi() ? ' (EMI ×0,75)' : ''))}
        ${kvb('pmin', '≥ ' + f(pMinT, 0) + ' mm', 'en küçük (anahtar boşluğu)')}
        ${kvb('adet', adet4 + ' adet', `simetrik yerleşim (hesap: ${adet})`)}
      </div>
      ${kvPanel(ara, DET)}
      <p class="small mt"><b>${yoneten}</b></p>
      ${ca.uyarilar.map(u => `<div class="warnbox">${esc(u)}</div>`).join('')}
      ${pr.pEmi ? `<div class="okbox">EMI: ${f(S.fGHz, 1)} GHz için λ/20 = ${f(pr.pEmi, 1)} mm. Bu değer, conta temasının koptuğu yerde oluşacak açıklık içindir. İletken conta sürekli temas ettiği sürece cıvata aralığını değil, kapak eğilmesini sınırlar.</div>` : ''}`;

    const d = sb.d;
    const R = [
      { t: 'Contayı basınç tarafına, cıvataları dışına yerleştirin', d: 'Cıvata delikleri sızdırmaz bölgenin dışında kalmalı. Cıvata sızdırmaz bölgeden geçmek zorundaysa her cıvataya ayrı O-ring veya contalı rondela verin.', r: [['parker', 'Statik yüz contası düzenlemesi: conta, basınçlı hacmi cıvata deliklerinden ayırır.']], c: () => CIZIM.yerlesim() },
      { t: `Cıvata aralığı ≈ ${f(pOneri, 0)} mm (${adet4} cıvata), sıkma torku ${f(cv.MA, 1)} Nm`, d: `İki cıvata ortasında kapak eğilir, conta en az orada sıkışır. Aralık, kapak eğilmesi hesabı ile ASME VIII-1 Ek 2 / TEMA üst sınırının küçüğüdür. ${S.M} 8.8 cıvatalar çapraz sırayla, 3 adımda ${f(cv.MA, 1)} Nm’ye sıkılır.`, r: [['ee', ctxEg], ['asme', `B_maks = ${f(asme.Bmax, 0)} mm.`], ['vdi2230', 'Sıkma torku.'], ['amorim', 'Sıkma sırası.']], c: () => CIZIM.egilme({ t: tk, C: pOneri, dH: ca.dH }) },
      { t: 'Kanalı cıvata hattına yakın tutun, et kalınlığını koruyun', d: `Conta ne kadar cıvataya yakınsa kapak eğilmesinin etkisi o kadar az olur. Ancak delikle kanal arasında en az ≈ ${f(pr.eMin, 1)} mm et kalmalı (plastikte ≥ ${f(Math.max(3, 1.5 * d), 1)} mm). Havşa ve rondela izini de hesaba katın.`, r: [['kural', 'Et kalınlığı = maks(2 mm, d) metal; maks(3 mm, 1,5d) plastik – işleme ve dayanım için temkinli başlangıç.'], ['iso273', 'Delik çapı.']], c: () => CIZIM.etKalinlik({ delik: pr.delik, b: sb.b, e: pr.eMin, L: pr.eksen, M: S.M }) },
      { t: 'Köşelerde yeterli yarıçap', d: `Dikdörtgen kanal yolunda köşe yarıçapı kanal ekseninde en az 3 × kesit (≈ R${f(3 * d, 1)}), tercihen 6 × kesit olmalı. Keskin köşede O-ring kanaldan taşar veya katlanır.`, r: [['parker', 'Dairesel olmayan yüz contası kanallarında köşe yarıçapı ≥ 3 × kesit.']], c: () => CIZIM.kose({ Rmin: 3 * d, Rtercih: 6 * d }) },
      { t: 'Kanal kenarları ve taban radyüsü', d: 'Kanal tabanında R0,2–0,4 mm köşe radyüsü, kanal ağzında 0,1–0,2 mm kenar kırma/radyüs. Çapak kesinlikle olmamalı (montajda contayı keser).', r: [['parker', 'Kanal taban ve kenar radyüsleri (gland detail).'], ['iso3601', 'ISO 3601-2 kanal detayları.']], c: () => CIZIM.kenar() },
      { t: 'Yüzey pürüzlülüğü', d: 'Statik yüz contası: kanal tabanı ve karşı yüzey Ra ≤ 0,8 µm (sıvı), gaz ve vakum için Ra ≤ 0,4 µm; kanal yan duvarları Ra ≤ 1,6 µm. Radyal yönlü işleme izleri sızıntı kanalı oluşturur – tornalama izleri çevresel olmalı.', r: [['parker', 'Statik conta yüzey kalitesi: sıvıda 32 µin (0,8 µm) Ra, gaz/vakumda 16 µin (0,4 µm) Ra.']], c: () => CIZIM.yuzey({ gaz: S.ortam.includes('vakum') || S.ortam.includes('hava') }) },
      { t: 'Kanal duvarı açısı / dovetail', d: 'Yan duvarlar 0–5° eğimli olabilir. Ters montajda (kapak aşağı) contayı tutmak için kırlangıç kuyruğu (dovetail) veya yarım dovetail kanal kullanın.', r: [['parker', 'Dovetail ve yarım dovetail kanal tasarımı.']], c: () => CIZIM.dovetail() },
      { t: 'Düzlemsellik ve rijitlik', d: 'Conta temas yüzeyinin düzlemselliği sıkıştırma payının küçük bir kısmı olmalı (tipik ≤ 0,05 mm / 100 mm). Uzun ince kapaklarda nervür veya kalınlık artışı düşünün.', r: [['kural', `Düzlemsellik, ΔH payını (${f(ca.dH, 2)} mm) tüketmemeli.`]], c: () => CIZIM.duzlem() },
      { t: 'Basınç yönüne göre O-ring konumu', d: 'İç basınçta O-ring kanalın dış duvarına, dış basınç/vakumda iç duvarına yaslanacak şekilde boyutlandırın (2. sayfa bunu otomatik yapar). Böylece basınç O-ring’i hareket ettirmez.', r: [['parker', 'Yüz contasında iç/dış basınca göre O-ring konumlandırma.']], c: () => CIZIM.basincYonu() },
      { t: 'Tolerans zinciri', d: 'Kanal derinliği toleransı genelde ±0,05 mm yeterli; EMI conta gibi dar bantlarda ±0,03 mm hedefleyin. Kapak/gövde çarpılması ve kaplama kalınlığı (eloksal, boya) derinliğe eklenir.', r: [['iso3601', 'Kanal derinlik toleransları.']], c: () => CIZIM.tolerans({ h: nk.h || 2, tol: S.hTol || 0.05 }) },
      { t: `Sıkma torku ve diş boyu: ${S.M} → ${f(cv.MA, 1)} Nm, diş ≥ ${f(disBoy, 0)} mm`, d: `8.8, µ = 0,12 için ${f(cv.MA, 1)} Nm (ön yük ≈ ${f(cv.FM, 1)} kN). ${govdeAd} gövdede en az ${f(disBoy, 0)} mm diş boyu bırakın. Kanalsız contada sıkışma torka bağlıdır; stoper kullanın.`, r: [['vdi2230', 'Tork ve ön yük tablo değerleri.'], ['amorim', 'Çapraz sıkma, 3 adım.'], ['kural', 'Diş boyu kuralı.']], c: () => CIZIM.tork({ Lk: Math.min(90, disBoy * 6), MA: cv.MA, FM: cv.FM, dis: disBoy, M: S.M, govdeAd }) },
      { t: 'Montaj ve servis', d: 'Kanalın kolay temizlenebilir olmasını sağlayın; contayı söküp takmak için bir noktada sökme cebi bırakmak faydalıdır. Conta ezilmesini önlemek için kapak kılavuz pimle konumlansın.', r: [['kural', 'Montaj kolaylığı önerisi.']], c: () => CIZIM.servis() }
    ];
    if (emi()) R.push(
      { t: 'EMI: iletken temas yüzeyi', d: 'Alüminyumda conta temas yüzeyi MIL-DTL-5541 Tip II Class 3 kromat (Alodine) kaplama olmalı; eloksal ve boya yalıtkandır, maskeleyin. Galvanik uyum için Al gövdede Ag/Al veya Ni/C dolgulu conta seçin.', r: [['mil5541', 'Class 3: düşük elektrik direnci için kromat kaplama.'], ['chomHb', 'Galvanik uyum ve temas yüzeyi önerileri.']], c: () => CIZIM.emiYuzey() },
      { t: 'EMI: conta sürekliliği', d: 'İletken conta kesintisiz bir halka oluşturmalı; uç birleştirme gerekiyorsa vulkanize ek isteyin. Kapak eğilmesi iletken teması koparmamalı.', r: [['chomHb', 'Conta sürekliliği ve kapak rijitliği.']], c: () => CIZIM.emiSureklilik() }
    );
    const acik = new Set($$('#kuralListe details.rule[open]').map(x => x.dataset.i));
    $('#kuralListe').innerHTML = `<div class="card"><h3>Çizim kontrol listesi <span class="small">– maddeye tıklayın, örnek çizim ve kaynak açılır</span></h3>${R.map((r, i) => `
      <details class="rule" data-i="${i}" ${acik.has(String(i)) ? 'open' : ''}>
        <summary><div class="no">${i + 1}</div><div><p><b>${esc(r.t)}</b></p><p class="small">${esc(r.d)}</p></div><span class="ok">▸</span></summary>
        <div class="rule-govde">${r.c()}<div><p class="small"><b>Kaynak</b> – etikete basınca ayrıntı açılır:</p>${refs(r.r)}</div></div>
      </details>`).join('')}</div>`;
  }

  // ---------------- 5. Yapıştırma ----------------
  function renderYapistirma() {
    const sel = $('#yapMalz');
    const kodlar = D.MALZEMELER.filter(m => !m.emi).map(m => [m.kod, m.ad]).concat([['EMI', 'İletken (EMI) silikon / florosilikon']]);
    const varsayilan = S.yapMalz || (mat() ? (mat().emi ? 'EMI' : mat().kod) : 'NBR');
    sel.innerHTML = kodlar.map(([k, a]) => `<option value="${k}" ${k === varsayilan ? 'selected' : ''}>${esc(a)}</option>`).join('');
    sel.onchange = () => { S.yapMalz = sel.value; save(); renderYapistirma(); };
    const yz = $('[data-sel="yuzey"]');
    if (!yz.options.length) yz.innerHTML = D.YUZEYLER.map(y => `<option value="${y.k}">${esc(y.ad)}</option>`).join('');
    yz.value = S.yuzey;
    const kod = sel.value;
    const liste = C.yapistiriciSirala(kod === 'EMI' ? 'VMQ' : kod, kod === 'EMI', S.yuzey, S.iletkenYap, S.Tmax ?? 20);
    let n = 0;
    $('#yapListe').innerHTML = liste.map(x => {
      if (x.uygun) n++;
      return `<div class="card mat ${x.uygun ? '' : 'dim'}"><div>
        <div class="name">${x.uygun && n <= 3 ? `<span class="badge ok">Öneri ${n}</span> ` : ''}${x.uygun ? '' : '<span class="badge bad">Uygun değil</span> '}${esc(x.a.ad)}</div>
        <div class="pill-row small"><span class="chip">${esc(x.a.tip)}</span><span class="chip">${x.a.tmin} … ${x.a.tmax} °C</span><span class="chip">Bulunurluk ${stars(x.a.bul)}</span>${x.a.iletken ? '<span class="chip"><b>İletken</b></span>' : ''}<span class="chip">Conta uyumu ${stars(x.u, 3)}</span><span class="chip">Yüzey uyumu ${stars(x.y, 3)}</span></div>
        <p class="small">${esc(x.a.not)}</p>
        ${x.sebep.map(s => `<div class="warnbox">${esc(s)}</div>`).join('')}
      </div><div class="mat-actions"><button class="mini ${S.yapSec === x.a.id ? 'on' : ''}" data-yap="${x.a.id}">${S.yapSec === x.a.id ? 'Notta' : 'Nota ekle'}</button></div></div>`;
    }).join('');
    $$('[data-yap]').forEach(b => b.addEventListener('click', () => { S.yapSec = b.dataset.yap; S.yapNot = true; save(); renderYapistirma(); toast('Teknik resim notuna eklendi'); }));
  }

  // ---------------- 6. Teknik resim notu ----------------
  function d2Aktif() {
    const m = mat();
    if (S.d2) return S.d2;
    if (m && m.d2000) { const o = { ...m.d2000 }; if (S.shore) o.sert = Math.round(S.shore / 10); return o; }
    return { grade: 2, type: 'B', cls: 'G', sert: 7, ceki: '10', ek: '' };
  }
  function renderNotGirdi() {
    const m = mat();
    $('#notGirdi').innerHTML = `<h3>Not içeriği</h3>
      <label>Malzeme spesifikasyonu
        <select data-sel="spec">
          <option value="d2000">ASTM D2000 sınıflandırma kodu</option>
          <option value="mil">MIL-DTL-83528 (EMI)</option>
          <option value="uretici">Üretici malzeme kodu / eşdeğeri</option>
        </select></label>
      <div class="row3 mt">
        <label>${S.tip === 'oring' ? 'ISO 3601-1 tolerans sınıfı' : 'ISO 3302-1 tolerans sınıfı'}
          ${S.tip === 'oring' ? `<select data-sel="tolSinif"><option value="A">Sınıf A (hassas)</option><option value="B">Sınıf B (genel)</option></select>` : `<select data-sel="iso3302"><option value="M1">M1 (kalıp, hassas)</option><option value="M2">M2 (kalıp, genel)</option><option value="M3">M3 (kalıp, kaba)</option><option value="E1">E1 (ekstrüzyon, hassas)</option><option value="E2">E2 (ekstrüzyon, genel)</option><option value="E3">E3 (ekstrüzyon, kaba)</option></select>`}</label>
        ${S.tip === 'oring' ? `<label>ISO 3601-3 yüzey kusuru<select data-sel="yuzeyKalite"><option value="N">Grade N (genel)</option><option value="S">Grade S (özel)</option><option value="CS">Grade CS (kritik)</option></select></label>` : '<div></div>'}
        <div></div>
      </div>
      <label class="chk mt"><input type="checkbox" data-chk="yuzeyNot"> Kanal yüzey pürüzlülüğü ve kenar notu</label>
      <label class="chk"><input type="checkbox" data-chk="depolama"> Depolama, kür tarihi, CoC (ISO 2230)</label>
      <label class="chk"><input type="checkbox" data-chk="gres"> Montaj yağlayıcısı notu (malzemeye göre)</label>
      <label class="chk"><input type="checkbox" data-chk="yapNot"> Yapıştırma notu ${S.yapSec ? '(' + esc((D.YAPISTIRICILAR.find(a => a.id === S.yapSec) || {}).ad || '') + ')' : '(5. sayfadan seçin)'}</label>
      <label class="chk"><input type="checkbox" data-chk="rohs"> RoHS / REACH uygunluğu</label>
      ${!m ? '<div class="warnbox">Henüz malzeme seçilmedi – 3. sayfadan seçin.</div>' : ''}`;
    const d2 = d2Aktif();
    const opt = (obj, cur) => Object.entries(obj).map(([k, v]) => `<option value="${k}" ${k === cur ? 'selected' : ''}>${k} – ${v}</option>`).join('');
    $('#d2000Kart').innerHTML = `<h3>ASTM D2000 kod oluşturucu</h3>
      ${m && m.emi ? '<div class="warnbox">İletken (EMI) elastomerler genellikle ASTM D2000 ile değil, MIL-DTL-83528 tipi veya üretici malzeme koduyla çağrılır. Bu oluşturucu iletken olmayan contalar içindir.</div>' : ''}
      <div class="code" id="d2kod">${esc(C.d2000Kod(d2))}</div>
      <p class="small" id="d2acik">${esc(C.d2000Acikla(d2))}</p>
      <div class="row3">
        <label>Grade<select id="d2grade"><option value="1" ${d2.grade == 1 ? 'selected' : ''}>1 (temel)</option><option value="2" ${d2.grade == 2 ? 'selected' : ''}>2 (ek şartlı)</option><option value="3" ${d2.grade == 3 ? 'selected' : ''}>3</option></select></label>
        <label>Tip (ısı)<select id="d2type">${opt(Object.fromEntries(Object.entries(D.D2000_TIP).map(([k, v]) => [k, v + ' °C'])), d2.type)}</select></label>
        <label>Sınıf (yağ şişmesi)<select id="d2cls">${opt(D.D2000_SINIF, d2.cls)}</select></label>
        <label>Sertlik<select id="d2sert">${[4, 5, 6, 7, 8, 9].map(s => `<option value="${s}" ${s == d2.sert ? 'selected' : ''}>${s} → ${s * 10} Shore A</option>`).join('')}</select></label>
        <label>Min. çekme (MPa)<input type="text" id="d2ceki" value="${esc(d2.ceki)}"></label>
        <label>Ek şartlar (suffix)<input type="text" id="d2ek" value="${esc(d2.ek || '')}"></label>
      </div>
      <p class="small mt">Ek şart örnekleri: <code>A</code> ısıl yaşlandırma, <code>B</code> basma kalıcılığı (compression set), <code>EO</code> yağ, <code>EF</code> yakıt, <code>EA</code> su, <code>F</code> düşük sıcaklık kırılganlığı, <code>Z</code> özel şart. Son rakam test sıcaklığını kodlar. Kod malzemeden otomatik doldurulur; nihai kodu tedarikçi veri sayfasıyla teyit edin.</p>
      <button class="ghost" id="d2sifirla">Seçili malzemeden yeniden yükle</button>
      ${refs(['astm'])}`;
    ['d2grade', 'd2type', 'd2cls', 'd2sert', 'd2ceki', 'd2ek'].forEach(id => $('#' + id).addEventListener('input', () => {
      S.d2 = { grade: +$('#d2grade').value, type: $('#d2type').value, cls: $('#d2cls').value, sert: +$('#d2sert').value, ceki: $('#d2ceki').value.replace(/\D/g, '').slice(0, 2) || '10', ek: $('#d2ek').value };
      $('#d2kod').textContent = C.d2000Kod(S.d2); $('#d2acik').textContent = C.d2000Acikla(S.d2); save(); renderNotCikti();
    }));
    $('#d2sifirla').addEventListener('click', () => { S.d2 = null; save(); renderNotGirdi(); renderNotCikti(); });
    syncControls();
  }

  function gresOneri(m, en) {
    if (!m) return null;
    const k = m.emi ? 'VMQ' : m.kod;
    const t = {
      EPDM: ['SİLİKON BAZLI GRES (MİNERAL YAĞ / PETROL BAZLI GRES KULLANILMAYACAKTIR)', 'SILICONE-BASED GREASE (NO MINERAL OIL / PETROLEUM-BASED LUBRICANTS)'],
      VMQ: ['FLORLU (PFPE) GRES VEYA YAĞLAYICISIZ (SİLİKON GRES KULLANILMAYACAKTIR)', 'PFPE (FLUORINATED) GREASE OR DRY (NO SILICONE GREASE)'],
      FVMQ: ['FLORLU (PFPE) GRES', 'PFPE (FLUORINATED) GREASE'],
      FFKM: ['FLORLU (PFPE) GRES', 'PFPE (FLUORINATED) GREASE']
    }[k] || ['ÇALIŞMA AKIŞKANI İLE UYUMLU İNCE TABAKA GRES (SİLİKON VEYA MİNERAL YAĞ BAZLI)', 'A LIGHT FILM OF LUBRICANT COMPATIBLE WITH THE SYSTEM FLUID (SILICONE OR MINERAL-OIL BASED)'];
    return en ? t[1] : t[0];
  }

  function renderNotCikti() {
    const en = S.notDil === 'en';
    const m = mat();
    const sh = S.shore || (m ? m.shore[0] : 70);
    const L = [];
    // 1. Tanım
    if (S.tip === 'oring') {
      const nomB = C.contadanKanal({ sekil: 'oring', t: S.cs, tTol: S.csTol, g: S.g, hTol: S.hTol, bTol: S.bTol, emi: emi() }).satirlar[1].b;
      const sec = S.mod === 'conta' ? oringSecim(nomB) : null;
      let boyut;
      if (sec && sec.as568 && sec.as568.ok) boyut = `Ø${f(sec.as568.id)} × ${f(sec.as568.cs)} mm (AS568${sec.as568.dash})`;
      else if (sec) boyut = `Ø${f(sec.ID)} × ${f(S.cs)} mm`;
      else boyut = `Ø____ × ${f(S.cs)} mm`;
      L.push(en ? `SEAL: O-RING ${boyut}.` : `CONTA: O-RING ${boyut}.`);
      if (sec && sec.kaynak === 'sekilli') L.push(en ? `O-RING SHALL BE INSTALLED INTO THE NON-CIRCULAR GROOVE WITH APPROX. ${f(S.ger ?? 1, 1)} % STRETCH; GROOVE CORNER RADIUS AT CENTERLINE R${f(sec.R, 1)} MIN.` : `O-RING DAİRESEL OLMAYAN KANALA YAKLAŞIK %${f(S.ger ?? 1, 1)} GERDİRİLEREK YERLEŞTİRİLECEKTİR; KANAL KÖŞE RADYÜSÜ (EKSENDE) EN AZ R${f(sec.R, 1)}.`);
    } else {
      const ad = { yuvarlak: ['DOLU YUVARLAK KORDON', 'SOLID ROUND CORD'], D: ['D-PROFİL', 'D-PROFILE'], tup: ['BOŞLUKLU TÜP PROFİL', 'HOLLOW TUBE PROFILE'], duz: ['DÜZ CONTA (LEVHADAN KESİM)', 'FLAT GASKET (CUT FROM SHEET)'], sunger: ['SÜNGER CONTA (KAPALI HÜCRE)', 'CLOSED-CELL SPONGE GASKET'] }[S.sekil];
      const olc = S.sekil === 'yuvarlak' ? `Ø${f(S.gt)} mm` : S.sekil === 'tup' ? `Ø${f(S.gt)} × ${f(S.gs)} mm` : `${f(S.gt)} × ${f(S.gw)} mm`;
      L.push(en ? `SEAL: ${ad[1]}, CROSS-SECTION ${olc}.` : `CONTA: ${ad[0]}, KESİT ${olc}.`);
    }
    // 2. Malzeme
    if (m) {
      const isim = m.ad.split('(')[0].split('–')[0].trim().toUpperCase();
      if (m.emi) {
        const milVar = /^MIL/.test(m.mil || '');
        if (S.spec === 'uretici' || !milVar) L.push(en ? `MATERIAL: ELECTRICALLY CONDUCTIVE ELASTOMER, ${m.ad.toUpperCase()}, ${sh} ± 5 SHORE A, MANUFACTURER COMPOUND ________ OR APPROVED EQUIVALENT; VOLUME RESISTIVITY AND SHIELDING EFFECTIVENESS PER SUPPLIER DATA SHEET.` : `MALZEME: İLETKEN ELASTOMER, ${m.ad.toUpperCase()}, ${sh} ± 5 SHORE A (ASTM D2240); ÜRETİCİ MALZEME KODU ________ VEYA ONAYLI EŞDEĞERİ; HACİM DİRENCİ VE EKRANLAMA ETKİNLİĞİ TEDARİKÇİ VERİ SAYFASINA UYGUN OLACAKTIR.`);
        if (milVar) L.push(en ? `${S.spec === 'uretici' ? 'MATERIAL SHALL ALSO MEET' : `MATERIAL: ELECTRICALLY CONDUCTIVE ELASTOMER, ${m.ad.toUpperCase()}, ${sh} ± 5 SHORE A, PER`} ${m.mil.split(' (')[0]}.` : `${S.spec === 'uretici' ? 'MALZEME AYRICA' : `MALZEME: İLETKEN ELASTOMER, ${m.ad.toUpperCase()}, ${sh} ± 5 SHORE A (ASTM D2240);`} ${m.mil.split(' (')[0]} ŞARTLARINI SAĞLAMALIDIR.`);
      } else if (S.spec === 'uretici' || !m.d2000) {
        L.push(en ? `MATERIAL: ${isim}, ${sh} ± 5 SHORE A (ASTM D2240), MANUFACTURER COMPOUND ________ OR APPROVED EQUIVALENT.` : `MALZEME: ${isim}, ${sh} ± 5 SHORE A (ASTM D2240); ÜRETİCİ MALZEME KODU ________ VEYA ONAYLI EŞDEĞERİ.`);
      } else {
        const kod = C.d2000Kod(d2Aktif());
        L.push(en ? `MATERIAL: ${m.kod}, ${sh} ± 5 SHORE A (ASTM D2240), SHALL MEET ${kod}.` : `MALZEME: ${m.kod}, ${sh} ± 5 SHORE A (ASTM D2240); ${kod} ŞARTLARINI SAĞLAMALIDIR.`);
      }
    } else {
      L.push(en ? 'MATERIAL: ________, __ ± 5 SHORE A (ASTM D2240).' : 'MALZEME: ________, __ ± 5 SHORE A (ASTM D2240).');
    }
    // 3. Tolerans
    if (S.tip === 'oring') L.push(en ? `DIMENSIONAL TOLERANCES PER ISO 3601-1 CLASS ${S.tolSinif}; SURFACE IMPERFECTIONS PER ISO 3601-3 GRADE ${S.yuzeyKalite}.` : `BOYUT TOLERANSLARI ISO 3601-1 SINIF ${S.tolSinif}’YE, YÜZEY KUSURLARI ISO 3601-3 GRADE ${S.yuzeyKalite}’YE GÖRE KABUL EDİLECEKTİR.`);
    else L.push(en ? `UNTOLERANCED DIMENSIONS PER ISO 3302-1 CLASS ${S.iso3302}.` : `TOLERANSSIZ ÖLÇÜLER ISO 3302-1 SINIF ${S.iso3302}’YE GÖREDİR.`);
    // 4. Kanal yüzeyi
    if (S.yuzeyNot) {
      const gaz = S.ortam.includes('vakum') || S.ortam.includes('hava');
      L.push(en ? `GROOVE BOTTOM AND MATING SURFACE Ra ≤ ${gaz ? '0.4' : '0.8'} µm, GROOVE SIDE WALLS Ra ≤ 1.6 µm; NO RADIAL TOOL MARKS. GROOVE EDGES FREE OF BURRS, BREAK 0.1–0.2 mm; GROOVE BOTTOM CORNER R0.2–0.4.` : `KANAL TABANI VE KARŞI YÜZEY Ra ≤ ${gaz ? '0,4' : '0,8'} µm, KANAL YAN DUVARLARI Ra ≤ 1,6 µm OLACAK; RADYAL İŞLEME İZİ OLMAYACAKTIR. KANAL KENARLARI ÇAPAKSIZ, 0,1–0,2 mm KIRILACAK; KANAL TABAN KÖŞESİ R0,2–0,4.`);
    }
    if (m && m.emi) L.push(en ? 'GASKET CONTACT SURFACES: CHROMATE CONVERSION COATING PER MIL-DTL-5541 TYPE II CLASS 3. MASK FROM ANODIZE/PAINT.' : 'CONTA TEMAS YÜZEYLERİ MIL-DTL-5541 TİP II CLASS 3 KROMAT KAPLANACAK; ELOKSAL VE BOYADAN MASKELENECEKTİR.');
    if (S.depolama) L.push(en ? 'SEALS SHALL BE STORED PER ISO 2230. CURE DATE (QUARTER/YEAR) SHALL BE MARKED ON PACKAGING; CERTIFICATE OF CONFORMANCE REQUIRED PER BATCH.' : 'CONTALAR ISO 2230’A GÖRE DEPOLANACAK; KÜR TARİHİ (ÇEYREK/YIL) AMBALAJDA BELİRTİLECEK, HER PARTİ İÇİN UYGUNLUK SERTİFİKASI (CoC) VERİLECEKTİR.');
    if (S.gres && m) L.push(en ? `INSTALL WITH ${gresOneri(m, true)}.` : `MONTAJDA ${gresOneri(m, false)} KULLANILACAKTIR.`);
    if (S.yapNot && S.yapSec) {
      const a = D.YAPISTIRICILAR.find(x => x.id === S.yapSec);
      if (a) L.push(en ? `BOND SEAL WITH ${a.ad.toUpperCase()} OR APPROVED EQUIVALENT. ADHESIVE SHALL NOT EXTEND ONTO THE SEALING SURFACE${a.iletken ? '' : '; SPOT BOND ONLY'}.` : `CONTA ${a.ad.toUpperCase()} VEYA ONAYLI EŞDEĞERİ İLE YAPIŞTIRILACAK; YAPIŞTIRICI SIZDIRMAZLIK YÜZEYİNE TAŞMAYACAKTIR${a.iletken ? '' : ', NOKTASAL UYGULANACAKTIR'}.`);
    }
    if (S.tip === 'oring' && S.cs) L.push(en ? 'O-RING SHALL BE MOLDED ENDLESS; SPLICED CORD NOT ACCEPTABLE.' : 'O-RING KALIPLANMIŞ (EKSİZ) OLACAK; KORDONDAN EK YAPILMIŞ O-RING KABUL EDİLMEZ.');
    if (S.rohs) L.push(en ? 'MATERIAL SHALL BE RoHS (EU 2011/65) AND REACH COMPLIANT.' : 'MALZEME RoHS (AB 2011/65) VE REACH UYUMLU OLACAKTIR.');
    $('#notCikti').textContent = (en ? 'NOTES:\n' : 'NOTLAR:\n') + L.map((l, i) => `${i + 1}. ${l}`).join('\n');
  }
  $('#kopyala').addEventListener('click', async () => {
    const t = $('#notCikti').textContent;
    try { await navigator.clipboard.writeText(t); toast('Not panoya kopyalandı'); }
    catch (e) { const r = document.createRange(); r.selectNodeContents($('#notCikti')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Metni seçtim – Ctrl+C ile kopyalayın'); }
  });

  // ---------------- 7. Tedarikçiler ----------------
  let tedFiltre = 'Tümü';
  function renderTedarik() {
    const G = D.TEDARIKCI_GRUP[S.tedSekme] || D.TEDARIKCI_GRUP.ankara;
    $('#tedarikNot').textContent = {
      ankara: 'Ankara’da doğrudan ulaşabileceğiniz üretici, stokçu ve distribütörler.',
      turkiye: 'Türkiye genelindeki büyük üreticiler ve global firmaların Türkiye şirketleri. Ankara firmaları da bu listede.',
      dunya: 'Türkiye’ye ürün satan dünyanın en büyük sızdırmazlık firmaları. Türkiye’deki satış kanalı kartlarda yazılı.'
    }[S.tedSekme];
    const tags = ['Tümü', ...new Set(G.liste.flatMap(t => t.tags))];
    if (!tags.includes(tedFiltre)) tedFiltre = 'Tümü';
    $('#tedarikFiltre').innerHTML = tags.map(t => `<button class="mini ${t === tedFiltre ? 'on' : ''}" data-tf="${esc(t)}">${esc(t)}</button>`).join('');
    $$('[data-tf]').forEach(b => b.addEventListener('click', () => { tedFiltre = b.dataset.tf; renderTedarik(); }));
    const liste = G.liste.filter(t => tedFiltre === 'Tümü' || t.tags.includes(tedFiltre))
      .sort((a, b) => (b.olcek - a.olcek) || ((a.kurulus || 9999) - (b.kurulus || 9999)));
    $('#tedarikListe').innerHTML = liste.map((t, i) => `<div class="card sup">
      <h3><span class="sira">${i + 1}</span>${esc(t.ad)}</h3><div class="where">${esc(t.bolge)}</div>
      <div class="pill-row small">${t.kurulus ? `<span class="chip">Kuruluş <b>${t.kurulus}</b></span>` : ''}${t.calisan && t.calisan !== '–' ? `<span class="chip">Çalışan <b>${esc(t.calisan)}</b></span>` : ''}</div>
      <p>${esc(t.odak)}</p>
      <p>📍 ${esc(t.adres)}</p>
      ${t.tel.length ? `<p>📞 ${t.tel.map(n => `<a href="tel:${n.replace(/\s/g, '')}">${esc(n)}</a>`).join(' · ')}</p>` : ''}
      ${t.eposta ? `<p>✉️ <a href="mailto:${esc(t.eposta)}">${esc(t.eposta)}</a></p>` : ''}
      ${t.web ? `<p>🌐 <a href="${esc(t.web)}" target="_blank" rel="noopener">${esc(t.web.replace(/^https?:\/\//, ''))}</a></p>` : ''}
      <div class="pill-row">${t.tags.map(x => `<span class="chip">${esc(x)}</span>`).join('')}<a class="ref" href="${esc(t.kaynak)}" target="_blank" rel="noopener">Bilgi kaynağı ↗</a></div>
    </div>`).join('');
  }

  // ---------------- Kolay mod ----------------
  const HIZLI = [1.78, 2.0, 2.62, 3.0, 3.53, 4.0, 5.33, 6.99];
  function renderKolayGirdi() {
    const el = $('#kolayGirdi');
    if (S.kolayMod === 'kontrol') {
      el.innerHTML = `<h3>2 · Conta ve kanal ölçüleriniz</h3>
        <div class="seg" data-bind="kkTip"><button data-v="oring">O-ring / yuvarlak kordon</button><button data-v="gasket">Dikdörtgen kesitli conta (gasket)</button></div>
        <div class="row-inline mt">
          ${S.kkTip === 'oring' ? '<label class="buyuk">O-ring kalınlığı (mm)<input type="number" step="0.01" data-num="kkd"></label>' : '<label class="buyuk">Conta yüksekliği (mm)<input type="number" step="0.01" data-num="kkd"></label><label class="buyuk">Conta genişliği (mm)<input type="number" step="0.1" data-num="kkw"></label>'}
          <label class="buyuk">Kanal derinliği (mm)<input type="number" step="0.01" data-num="kkh"></label>
          <label class="buyuk">Kanal genişliği (mm)<input type="number" step="0.01" data-num="kkb"></label>
        </div>
        <p class="hint">${S.kkTip === 'oring' ? 'O-ring kalınlığı: halkanın et kalınlığı (kumpasla yandan).' : 'Conta yüksekliği: sıkışma yönündeki kalınlık. Genişlik: kanalın içine yatan ölçü.'} Kanal derinliği: tabandan yüzeye; kapak metal metale oturuyorsa conta tam bu yüksekliğe ezilir.</p>`;
    } else if (S.kolayMod === 'oring') {
      el.innerHTML = `<h3>2 · O-ring’inizin ölçüsü</h3>
        <div class="row-inline">
          <label class="buyuk">O-ring kalınlığı (mm)<input type="number" step="0.01" data-num="kd"></label>
          <label class="buyuk">İç çap (mm) – bilmiyorsanız boş bırakın<input type="number" step="0.1" data-num="kID" placeholder="opsiyonel"></label>
        </div>
        <p class="hint">Kalınlık: halkanın et kalınlığıdır, kumpasla yandan ölçülür (iç çap değil). Sık kullanılan ölçüler:</p>
        <div class="hizli">${HIZLI.map(d => `<button class="mini ${Math.abs(S.kd - d) < 0.005 ? 'on' : ''}" data-kd="${d}">${f(d)} mm</button>`).join('')}</div>`;
      $$('[data-kd]').forEach(b => b.addEventListener('click', () => { S.kd = +b.dataset.kd; S.kolaySev = 1; changed(true); }));
    } else {
      el.innerHTML = `<h3>2 · Kanalınızın ölçüsü</h3>
        <div class="row-inline">
          <label class="buyuk">Kanal derinliği (mm)<input type="number" step="0.01" data-num="kh2"></label>
          <label class="buyuk">Kanal genişliği (mm)<input type="number" step="0.01" data-num="kb2"></label>
        </div>
        <p class="hint">Derinlik: kanal tabanından yüzeye kadar. Genişlik: kanalın iki duvarı arası.</p>`;
    }
    syncControls();
  }
  function malzemeKolay() {
    return `<div class="card"><h3>4 · Malzeme ve sertlik</h3>
      <p class="sonucbuyuk">Önerilen: <b>NBR (nitril) – 70 Shore A</b></p>
      <p class="small">En yaygın ve en ucuz O-ring malzemesi; her conta satıcısında stokta bulunur. Yağa, yakıta, suya ve havaya dayanır. Sertlik 70 Shore A, çoğu kapak ve flanş için doğru değerdir.</p>
      <table class="mt"><thead><tr><th>Durumunuz buysa</th><th>Bunu seçin</th></tr></thead><tbody>
        <tr><td>Genel kullanım, yağ, yakıt (−30 … +100 °C)</td><td><b>NBR 70 Shore A</b></td></tr>
        <tr><td>Su, buhar, dış ortam / güneş (yağ YOK)</td><td><b>EPDM 70 Shore A</b></td></tr>
        <tr><td>Yüksek sıcaklık (200 °C’ye kadar), yakıt, kimyasal</td><td><b>FKM (Viton) 75 Shore A</b></td></tr>
        <tr><td>Çok soğuk veya çok sıcak (−60 … +200 °C), gıda, ince/plastik kapak</td><td><b>Silikon (VMQ) 60–70 Shore A</b></td></tr>
        <tr><td>Yüksek basınç (> 100 bar)</td><td><b>NBR veya FKM 90 Shore A</b></td></tr>
      </tbody></table>
      <dl class="sozluk mt">
        <dt>Shore A nedir?</dt><dd>Kauçuğun sertliği. 50 yumuşak (silgi gibi), 70 orta (araba lastiği gibi), 90 serttir. Yumuşak conta az kuvvetle sızdırmazlık sağlar, sert conta yüksek basınca dayanır.</dd>
        <dt>Sıkıştırma oranı nedir?</dt><dd>Kapak kapandığında O-ring’in kalınlığının yüzde kaçı ezildiği. Çok az ezilirse sızdırır, çok ezilirse zamanla kalıcı deforme olup çatlar. Statik contada %18–28 arası iyidir.</dd>
      </dl>
      ${refs([['parker', 'Malzeme seçimi ve statik conta sıkıştırma aralığı.']])}</div>`;
  }
  function renderKolaySonuc() {
    const el = $('#kolaySonuc');
    if (S.kolayMod === 'kontrol') { renderKontrol(el); return; }
    const sevAd = [['Az sıkı', 'Kapak inceyse / plastikse; az kuvvet ister'], ['Önerilen', 'Çoğu uygulama için en iyisi'], ['Sıkı', 'Gaz, vakum veya çok soğuk ortam']];
    if (S.kolayMod === 'oring') {
      if (!(S.kd > 0)) { el.innerHTML = ''; return; }
      const cs = D.CS_LISTE.find(c => Math.abs(c.d - S.kd) < 0.005);
      const r = C.contadanKanal({ sekil: 'oring', t: S.kd, tTol: cs ? cs.tol : 0.08, hTol: 0.05, bTol: 0.1, g: 0 });
      const i = S.kolaySev ?? 1, s = r.satirlar[i];
      const cap = S.kID > 0 ? C.oringdenKanalCap(S.kID, S.kd, s.b, 'ic') : null;
      el.innerHTML = `<div class="card"><h3>3 · Kanalı şu ölçülerde açın</h3>
        <div class="secenek">${r.satirlar.map((x, j) => `<button class="${j === i ? 'on' : ''}" data-ksev="${j}"><b>${sevAd[j][0]}</b><span class="yuzde">%${f(x.c * 100, 0)}</span> sıkıştırma<small>${sevAd[j][1]}</small></button>`).join('')}</div>
        <div class="rule-govde mt" style="padding-left:0; grid-template-columns: minmax(320px, 560px) 1fr">
          ${CIZIM.kolayKesit({ b: s.b, h: s.h, d: S.kd })}
          <div class="sonucbuyuk">
            Kanal derinliği: <b>${f(s.h)} mm</b> <span class="small">(±0,05)</span><br>
            Kanal genişliği: <b>${f(s.b)} mm</b> <span class="small">(+0,1 / 0)</span><br>
            ${cap ? `Kanal dış çapı: <b>Ø${f(cap.kanalDis)} mm</b><br>Kanal iç çapı: <b>Ø${f(cap.kanalIc)} mm</b><br>` : ''}
            <p class="small">Kapak gövdeye tam oturmalı (metal metale). O-ring’in ezilmesini kanal derinliği ayarlar. Kanal köşeleri çapaksız olmalı, köşe yarıçapı en az R${f(3 * S.kd, 1)}.</p>
            ${cap ? '<p class="small">Çaplar, basınç içeriden dışarı doğru kabul edilerek verildi (O-ring dış duvara yaslanır).</p>' : '<p class="small">İç çapı da girerseniz kanalın çaplarını da veririz.</p>'}
          </div>
        </div></div>${malzemeKolay()}
        <div class="card info"><p>Daha fazlası için (tolerans, cıvata aralığı, teknik resim notu) <button class="primary" id="uzmanaAktar">Uzman moduna aktar →</button></p></div>`;
    } else {
      if (!(S.kh2 > 0 && S.kb2 > 0)) { el.innerHTML = ''; return; }
      const k = C.kanaldanOring({ h: S.kh2, b: S.kb2, g: 0, hTol: 0.05 });
      const uy = k.list.filter(x => x.uygun).slice(0, 3);
      if (!uy.length) {
        el.innerHTML = `<div class="card"><h3>3 · Uygun O-ring</h3><div class="warnbox">Bu kanal ölçüsüne standart O-ring uymuyor. Kanal derinliği yaklaşık O-ring kalınlığının ¾’ü, genişliği ise kalınlığın 1,4 katı olmalı. Örneğin 2,62 mm O-ring için derinlik 2,0 mm, genişlik 3,6 mm.</div></div>${malzemeKolay()}`;
      } else {
        const i = Math.min(S.kolaySev ?? 0, uy.length - 1), x = uy[i];
        el.innerHTML = `<div class="card"><h3>3 · Bu kanala uyan O-ring</h3>
          <div class="secenek">${uy.map((y, j) => `<button class="${j === i ? 'on' : ''}" data-ksev="${j}"><b>${f(y.d)} mm kalınlık</b><span class="yuzde">%${f(y.c * 100, 0)}</span> sıkıştırma<small>${j === 0 ? 'En uygun' : y.c > uy[0].c ? 'Daha sıkı' : 'Daha gevşek'}${y.std.startsWith('AS568') ? ' · inç standart (AS568)' : ' · metrik'}</small></button>`).join('')}</div>
          <div class="rule-govde mt" style="padding-left:0; grid-template-columns: minmax(320px, 560px) 1fr">
            ${CIZIM.kolayKesit({ b: S.kb2, h: S.kh2, d: x.d })}
            <div class="sonucbuyuk">Alınacak O-ring kalınlığı: <b>${f(x.d)} mm</b><br>Sıkıştırma: <b>%${f(x.c * 100, 0)}</b> <span class="small">(iyi aralık %18–28)</span><br>Kanal doluluğu: <b>%${f(x.dol * 100, 0)}</b> <span class="small">(en fazla %85)</span>
            <p class="small">Satıcıya kalınlığı ve kanalın çapını söyleyin; iç çapı kanal çapına göre seçerler. O-ring kanala oturunca kanalın dış duvarına hafifçe yaslanmalı.</p></div>
          </div></div>${malzemeKolay()}
          <div class="card info"><p>Daha fazlası için <button class="primary" id="uzmanaAktar">Uzman moduna aktar →</button></p></div>`;
      }
    }
    $$('[data-ksev]').forEach(b => b.addEventListener('click', () => { S.kolaySev = +b.dataset.ksev; changed(false); }));
    const ua = $('#uzmanaAktar');
    if (ua) ua.addEventListener('click', () => {
      S.arayuz = 'uzman'; S.tip = 'oring'; S.sekil = 'oring';
      if (S.kolayMod === 'oring') { S.mod = 'conta'; S.cs = S.kd; S.ozelOring = S.kID > 0; S.ID = S.kID; }
      else { S.mod = 'kanal'; S.kh = S.kh2; S.kb = S.kb2; }
      save(); go('kanal'); toast('Ölçüler uzman moduna aktarıldı');
    });
  }

  // Kolay mod – uyum kontrolü
  function renderKontrol(el) {
    const oring = S.kkTip === 'oring';
    const t = S.kkd, h = S.kkh, b = S.kkb, w = oring ? t : S.kkw;
    if (!(t > 0 && h > 0 && b > 0 && w > 0)) { el.innerHTML = ''; return; }
    const c = (t - h) / t;
    const A = oring ? Math.PI * t * t / 4 : t * w;
    const dol = A / (h * b);
    // Sıkışmış genişlik: hacim korunur (O-ring ≈ elips, dikdörtgen ≈ w·t/h)
    const genis = c > 0 ? (oring ? t * t / h : w * t / h) : w;
    const bant = oring ? { kAlt: 0.12, iAlt: 0.18, iUst: 0.28, kUst: 0.35 } : { kAlt: 0.10, iAlt: 0.15, iUst: 0.25, kUst: 0.30 };
    const M = [];
    let seviye = 0; // 0 iyi, 1 dikkat, 2 kötü
    const ekle = (sv, msg) => { M.push([sv, msg]); seviye = Math.max(seviye, sv); };
    // Sıkıştırma
    if (c <= 0) ekle(2, `Conta hiç sıkışmıyor: kanal derinliği (${f(h)}) conta ${oring ? 'kalınlığından' : 'yüksekliğinden'} (${f(t)}) büyük veya eşit. Kesinlikle sızdırır.`);
    else if (c < bant.kAlt) ekle(2, `Sıkıştırma çok düşük (%${f(c * 100, 1)}). Contada yeterli baskı oluşmaz, sızdırma riski yüksek. En az %${f(bant.iAlt * 100, 0)} olmalı.`);
    else if (c < bant.iAlt) ekle(1, `Sıkıştırma biraz düşük (%${f(c * 100, 1)}). Sıvıda genelde yeterlidir; gaz, vakum veya soğuk ortamda sızdırabilir.`);
    else if (c <= bant.iUst) ekle(0, `Sıkıştırma ideal aralıkta (%${f(c * 100, 1)}; iyi aralık %${f(bant.iAlt * 100, 0)}–${f(bant.iUst * 100, 0)}).`);
    else if (c <= bant.kUst) ekle(1, `Sıkıştırma yüksek (%${f(c * 100, 1)}). Sızdırmaz ama kapağı kapatmak zorlaşır ve conta zamanla kalıcı ezilir.`);
    else ekle(2, `Sıkıştırma çok yüksek (%${f(c * 100, 1)}). Conta aşırı ezilir, çatlayabilir veya kanaldan taşar; kapak da tam kapanmayabilir. En fazla %${f(bant.kUst * 100, 0)} olmalı.`);
    // Doluluk
    if (dol > 1) ekle(2, `Kanal doluluğu %${f(dol * 100, 0)}: conta kanala sığmıyor. Kanalı genişletin veya derinleştirin.`);
    else if (dol > 0.90) ekle(2, `Kanal doluluğu çok yüksek (%${f(dol * 100, 0)}). Sıcakta veya sıvıyla şiştiğinde conta kanaldan taşar ya da kapak kapanmaz. En fazla %85 olmalı.`);
    else if (dol > 0.85) ekle(1, `Kanal doluluğu sınırda (%${f(dol * 100, 0)}). Şişme payı az; en fazla %85 önerilir.`);
    else if (dol < 0.55) ekle(1, `Kanal doluluğu düşük (%${f(dol * 100, 0)}). Kanal gereğinden geniş; conta montajda kayabilir. Sakıncalı değil ama %65–85 daha iyidir.`);
    else ekle(0, `Kanal doluluğu uygun (%${f(dol * 100, 0)}; iyi aralık %65–85).`);
    // Genişlik
    if (c > 0 && genis > b) ekle(dol > 0.85 ? 2 : 1, `Kanal genişliği yetersiz: conta sıkışınca yaklaşık ${f(genis, 2)} mm genişliyor, kanal ise ${f(b, 2)} mm. Conta duvara dayanır, sıkışma kuvveti artar.`);
    else if (c > 0) ekle(0, `Kanal genişliği yeterli: sıkışmış conta ≈ ${f(genis, 2)} mm, kanal ${f(b, 2)} mm.`);
    // Öneri ölçüleri
    const hOn = Math.round(t * (1 - (oring ? 0.23 : 0.20)) * 20) / 20;
    const bOn = Math.ceil(Math.max(A / (0.75 * hOn), (oring ? t * t / hOn : w * t / hOn) * 1.05) * 20) / 20;
    const karar = [['iyi', '✔', 'Uygun', 'Bu ölçüler birbirine uyuyor.'], ['dikkat', '⚠', 'Dikkat', 'Çalışabilir ama sınırda olan değerler var.'], ['kotu', '✖', 'Uygun değil', 'Bu ölçülerle sızdırma veya montaj sorunu beklenir.']][seviye];
    el.innerHTML = `<div class="card"><h3>3 · Sonuç</h3>
      <div class="karar ${karar[0]}"><span class="ikon">${karar[1]}</span><div><b>${karar[2]}</b>${karar[3]}</div></div>
      ${CIZIM.gosterge({ baslik: 'Sıkıştırma oranı', deger: c * 100, maks: 45, birim: '%', cizgiler: [0, 10, 20, 30, 40],
        bolgeler: [[0, bant.kAlt * 100, 'k', 'sızdırır'], [bant.kAlt * 100, bant.iAlt * 100, 's', ''], [bant.iAlt * 100, bant.iUst * 100, 'y', 'ideal'], [bant.iUst * 100, bant.kUst * 100, 's', ''], [bant.kUst * 100, 45, 'k', 'aşırı ezilir']] })}
      ${CIZIM.gosterge({ baslik: 'Kanal doluluğu', deger: dol * 100, maks: 110, birim: '%', cizgiler: [0, 25, 50, 75, 100],
        bolgeler: [[0, 55, 's', 'geniş'], [55, 65, 's', ''], [65, 85, 'y', 'ideal'], [85, 90, 's', ''], [90, 110, 'k', 'taşar']] })}
      <div class="rule-govde mt" style="padding-left:0; grid-template-columns: minmax(320px, 560px) 1fr">
        ${CIZIM.kolayKesit({ b, h, d: t, w, sekil: oring ? 'oring' : 'duz' })}
        <div>${M.map(([sv, m]) => `<div class="madde ${['iyi', 'dikkat', 'kotu'][sv]}">${['✔', '⚠', '✖'][sv]} ${esc(m)}</div>`).join('')}
          ${seviye > 0 ? `<div class="okbox mt"><b>Önerilen kanal</b> (bu ${oring ? 'O-ring' : 'conta'} için, %${oring ? 23 : 20} sıkıştırma): derinlik <b>${f(hOn)} mm</b>, genişlik <b>${f(bOn)} mm</b>.</div>` : ''}
          <p class="small mt">Hesap nominal ölçülerledir ve kapağın metal metale oturduğu kabul edilir. Toleranslı (en kötü durum) kontrol için Uzman mod’a geçin.</p>
          ${refs([['parker', 'Statik conta sıkıştırma aralığı ve kanal doluluğu (≤ %85).'], ['arp1231', 'Kanal doluluğu ve şişme payı.']])}
        </div>
      </div></div>
      <div class="card info"><p>Toleranslarla kontrol için <button class="primary" id="uzmanaAktar">Uzman moduna aktar →</button></p></div>`;
    const ua = $('#uzmanaAktar');
    if (ua) ua.addEventListener('click', () => {
      S.arayuz = 'uzman';
      if (oring) { S.tip = 'oring'; S.sekil = 'oring'; S.mod = 'kanal'; S.kh = h; S.kb = b; }
      else { S.tip = 'gasket'; S.sekil = 'duz'; S.mod = 'conta'; S.gt = t; S.gw = w; S.kanalda = true; }
      save(); go('kanal'); toast('Ölçüler uzman moduna aktarıldı');
    });
  }

  // ---------------- 8. Referanslar ----------------
  function renderRef() {
    $('#refListe').innerHTML = `<div class="card"><table><thead><tr><th>Etiket</th><th>Kaynak</th></tr></thead><tbody>${Object.values(D.REF).map(r => `<tr><td><span class="ref">${esc(r.kisa)}</span></td><td>${esc(r.ad)}${r.url ? `<br><a class="small" href="${r.url}" target="_blank" rel="noopener">${esc(r.url)}</a>` : ''}</td></tr>`).join('')}</tbody></table></div>
      <div class="card info"><h3>Önemli not</h3><p>Bu uygulama ön tasarım ve karar destek aracıdır. Kesin ölçüler için: (1) conta tedarikçisinin malzeme veri sayfası, (2) Parker ORD 5700 ve Chomerics tasarım tabloları, (3) sızdırmazlık / EMI testi ile doğrulama yapılmalıdır.</p></div>`;
  }

  // ---------------- Ana render ----------------
  function aktifSayfa() { if (S.modul !== 'conta') return 'modul-' + S.modul; return S.arayuz === 'kolay' ? 'kolay' : ($('.page.active') || {}).dataset?.page; }
  function renderAll(yapisal) {
    syncControls();
    if (S.modul !== 'conta') { window.MODUL.render(S.modul, yapisal); syncControls(); return; }
    renderOzet();
    const p = aktifSayfa();
    if (p === 'kanal') { if (yapisal || !$('#kanalGirdi').innerHTML) renderKanalGirdi(); renderKanalSonuc(); }
    if (p === 'malzeme') renderMalzeme();
    if (p === 'kurallar') renderKurallar();
    if (p === 'yapistirma') renderYapistirma();
    if (p === 'not') { if (yapisal || !$('#notGirdi').innerHTML) renderNotGirdi(); renderNotCikti(); }
    if (p === 'tedarik') renderTedarik();
    if (p === 'ref') renderRef();
    if (p === 'kolay') { if (yapisal || !$('#kolayGirdi').innerHTML) renderKolayGirdi(); renderKolaySonuc(); }
    syncControls();
  }
  $('#uygunsuzGoster').addEventListener('change', renderMalzeme);
  // Ayarlar paneli
  const panel = $('#ayarPanel');
  $('#ayarAc').addEventListener('click', () => { panel.classList.add('acik'); syncControls(); });
  $$('[data-kapat]').forEach(b => b.addEventListener('click', () => panel.classList.remove('acik')));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') panel.classList.remove('acik'); });
  $('#animDene').addEventListener('click', () => { panel.classList.remove('acik'); changed(false); });

  window.UI = { $, $$, f, P, esc, refs, toast, S: () => S, save, changed, syncControls };
  $('#anaMenu').addEventListener('click', () => { S.modul = 'ana'; changed(true); });
  renderOrtamlar();
  renderAll(true);
})();
