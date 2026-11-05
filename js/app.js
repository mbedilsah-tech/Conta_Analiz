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
    as568: '-136', cs: 2.62, csTol: 0.08, ID: 50.47, hTol: 0.05, bTol: 0.10, g: 0,
    // Gasket → kanal
    gt: 3.0, gw: 10, gs: 0.8, gtTol: 0.15, kanalda: true,
    // Kanal → conta
    kh: 2.0, kb: 3.6, kcap: 55, kw: 0,
    // Kurallar
    M: 'M5', cevre: 400, kapakT: 5,
    // Yapıştırma
    yuzey: 'al', iletkenYap: false, yapMalz: null,
    // Not
    notDil: 'tr', spec: 'd2000', tolSinif: 'B', yuzeyKalite: 'N', depolama: true, gres: true, yuzeyNot: true, yapNot: false, rohs: false, iso3302: 'M2',
    d2: null
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
  function refs(keys) {
    return `<div class="refs">${keys.map(k => D.REF[k]).filter(Boolean).map(r => r.url ? `<a class="ref" href="${r.url}" target="_blank" rel="noopener" title="${esc(r.ad)}">${esc(r.kisa)}</a>` : `<span class="ref" title="${esc(r.ad)}">${esc(r.kisa)}</span>`).join('')}</div>`;
  }
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
  const YAPISAL = ['tip', 'sekil', 'emi', 'mod', 'hareket', 'yon', 'malz', 'kanalda', 'spec', 'notDil'];
  document.addEventListener('click', e => {
    const btn = e.target.closest('.seg[data-bind] button');
    if (!btn || btn.disabled) return;
    const key = btn.parentElement.dataset.bind;
    S[key] = btn.dataset.v;
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

  function changed(yapisal) { save(); renderAll(yapisal); }

  function syncControls() {
    $$('.seg[data-bind]').forEach(seg => {
      const v = S[seg.dataset.bind];
      $$('button', seg).forEach(b => b.classList.toggle('on', b.dataset.v === v));
    });
    $$('[data-num]').forEach(el => { if (el !== document.activeElement) el.value = S[el.dataset.num] ?? ''; });
    $$('[data-sel]').forEach(el => { if (S[el.dataset.sel] != null) el.value = S[el.dataset.sel]; });
    $$('[data-chk]').forEach(el => { el.checked = !!S[el.dataset.chk]; });
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

  function renderKanalGirdi() {
    const el = $('#kanalGirdi');
    const lead = $('#kanalLead');
    const tolSatir = `<div class="row4 mt">${num('hTol', 'Derinlik toleransı ± (mm)')}${num('bTol', 'Genişlik toleransı + (mm)')}${num('g', 'Flanş boşluğu g (mm, temas=0)')}<div></div></div>`;
    if (S.tip === 'oring' && S.mod === 'conta') {
      lead.textContent = `O-ring ölçüsünü girin; 3 sıkıştırma oranı için yüz contası kanalı (${yonAd()}) hesaplanır.`;
      el.innerHTML = `<h3>O-ring ölçüsü</h3>
        <div class="row4">
          <label>AS568 numarası (ops.)<input type="text" id="as568In" value="${esc(S.as568 || '')}" placeholder="ör. 136 veya -214"></label>
          <label>Standart kesit<select id="csSel">${D.CS_LISTE.map(c => `<option value="${c.d}" ${Math.abs(c.d - S.cs) < 0.005 ? 'selected' : ''}>${f(c.d)} – ${c.std}</option>`).join('')}<option value="ozel" ${D.CS_LISTE.some(c => Math.abs(c.d - S.cs) < 0.005) ? '' : 'selected'}>Özel…</option></select></label>
          ${num('cs', 'Kesit d (mm)')}
          ${num('csTol', 'Kesit toleransı ± (mm)')}
        </div>
        <div class="row4 mt">${num('ID', 'İç çap ID (mm)')}<div class="small" id="as568Bilgi"></div></div>
        ${tolSatir}`;
      $('#as568In').addEventListener('change', e => {
        const r = C.as568Bul(e.target.value);
        if (r) { S.as568 = r.dash; S.cs = r.cs; S.csTol = r.csTol; S.ID = r.id; save(); renderAll(true); toast(`AS568${r.dash}: Ø${f(r.id)} × ${f(r.cs)} mm`); }
        else { S.as568 = ''; save(); toast('AS568 numarası bulunamadı'); }
      });
    } else if (S.tip === 'oring') {
      lead.textContent = 'Kanal ölçülerini girin; uygun O-ring kesitleri ve AS568 ölçüsü önerilir.';
      el.innerHTML = `<h3>Kanal ölçüleri</h3>
        <div class="row4">${num('kh', 'Kanal derinliği h (mm)')}${num('kb', 'Kanal genişliği b (mm)')}${num('kcap', S.yon === 'ic' ? 'Kanal DIŞ çapı (mm)' : 'Kanal İÇ çapı (mm)')}<div class="small">Basınç yönü: <b>${yonAd()}</b>. ${S.yon === 'ic' ? 'O-ring kanalın dış duvarına yaslanır.' : 'O-ring kanalın iç duvarına yaslanır.'}</div></div>
        ${tolSatir}`;
    } else if (S.mod === 'conta') {
      const sk = S.sekil;
      lead.textContent = 'Conta kesit ölçülerini girin; 3 sıkıştırma oranı için kanal / sıkıştırma limiti hesaplanır.';
      el.innerHTML = `<h3>Conta kesiti</h3>
        <div class="row4">
          ${num('gt', sk === 'tup' ? 'Dış çap (mm)' : sk === 'yuvarlak' ? 'Kordon çapı (mm)' : 'Yükseklik / kalınlık t (mm)')}
          ${sk === 'yuvarlak' || sk === 'tup' ? '' : num('gw', 'Genişlik w (mm)')}
          ${sk === 'tup' ? num('gs', 'Et kalınlığı (mm)') : ''}
          ${num('gtTol', 'Yükseklik toleransı ± (mm)')}
        </div>
        ${sk === 'duz' || sk === 'sunger' ? `<label class="chk mt"><input type="checkbox" data-chk="kanalda" ${S.kanalda ? 'checked' : ''}> Conta bir kanal içinde (işaretsiz: iki düz flanş arasında, burç/stoperle sınırlı)</label>` : ''}
        ${tolSatir}`;
    } else {
      lead.textContent = 'Kanal (veya flanş arası) ölçülerini girin; 3 sıkıştırma oranı için conta kalınlığı önerilir.';
      el.innerHTML = `<h3>Kanal ölçüleri</h3>
        <div class="row4">${num('kh', S.kanalda || !(S.sekil === 'duz' || S.sekil === 'sunger') ? 'Kanal derinliği h (mm)' : 'Stoper/burç yüksekliği (mm)')}${num('kb', 'Kanal genişliği b (mm)')}${S.sekil === 'yuvarlak' || S.sekil === 'tup' ? '' : num('kw', 'Conta genişliği w (mm, boş=0,6·b)')}${S.sekil === 'tup' ? num('gs', 'Tüp et kalınlığı (mm)') : '<div></div>'}</div>
        ${S.sekil === 'duz' || S.sekil === 'sunger' ? `<label class="chk mt"><input type="checkbox" data-chk="kanalda" ${S.kanalda ? 'checked' : ''}> Conta bir kanal içinde</label>` : ''}
        <div class="row4 mt">${num('g', 'Flanş boşluğu g (mm, temas=0)')}</div>`;
    }
    // Kesit seçimi
    const cs = $('#csSel');
    if (cs) cs.addEventListener('change', e => { if (e.target.value !== 'ozel') { const c = D.CS_LISTE.find(x => String(x.d) === e.target.value); S.cs = c.d; S.csTol = c.tol; S.as568 = ''; save(); renderAll(true); } });
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
      const as = S.as568 ? C.as568Bul(S.as568) : null;
      $('#as568Bilgi') && ($('#as568Bilgi').innerHTML = as && Math.abs(as.cs - S.cs) < 0.02 ? `Seçili: <b>AS568${as.dash}</b> (Ø${f(as.id)} × ${f(as.cs)})` : 'AS568 dışı / metrik ölçü');
      const kart = r.satirlar.map((s, i) => {
        const cap = S.ID > 0 ? C.oringdenKanalCap(S.ID, S.cs, s.b, S.yon) : null;
        return levelKart(s, i, `
          <dt>Kanal derinliği h</dt><dd>${f(s.h)} ±${f(S.hTol)}</dd>
          <dt>Kanal genişliği b</dt><dd>${f(s.b)} +${f(S.bTol)}/0</dd>
          ${cap ? `<dt>Kanal dış çapı</dt><dd>Ø${f(cap.kanalDis)}</dd><dt>Kanal iç çapı</dt><dd>Ø${f(cap.kanalIc)}</dd>` : ''}
          <dt>Sıkıştırma aralığı</dt><dd>${P(s.cMin)} – ${P(s.cMax)}</dd>
          <dt>Doluluk nom / maks</dt><dd>${P(s.dolNom)} / ${P(s.dolMaks)}</dd>`);
      }).join('');
      const nom = r.satirlar[1];
      const cap = S.ID > 0 ? C.oringdenKanalCap(S.ID, S.cs, nom.b, S.yon) : null;
      el.innerHTML = `<div class="levels">${kart}</div>
        <div class="card"><h3>Nominal tasarım kesiti</h3>
          <div class="sketch">${svgKesit(nom.b, nom.h, S.g, S.cs, nom.H, S.yon, 'oring')}
          <div>
            <p><b>${r.bant.ad}</b> için kabul bandı (en kötü tolerans dahil): <b>${P(r.bant.bant[0])} – ${P(r.bant.bant[1])}</b> sıkıştırma, en fazla <b>${P(r.bant.dolMaks)}</b> kanal doluluğu.</p>
            ${cap ? `<p>${esc(cap.aciklama)} Nominal: O-ring dış çapı Ø${f(cap.OD)} → kanal ${S.yon === 'ic' ? 'dış çapı Ø' + f(cap.kanalDis) + ' (çevresel sıkışma ' + P(cap.cevreSikisma) + ')' : 'iç çapı Ø' + f(cap.kanalIc) + ' (gerilme ' + P(cap.gerilme) + ')'}.</p>` : ''}
            <p class="small">Doluluk hesabı oda sıcaklığındadır. Ortamda %10’dan fazla şişme veya yüksek sıcaklıkta ısıl genleşme bekleniyorsa kanalı genişletin.</p>
          </div></div>
          ${refs(r.bant.ref)}
        </div>
        ${limitKart(S.cs, r.bant, true)}`;
    } else if (S.tip === 'oring') {
      if (!(S.kh > 0 && S.kb > 0)) { el.innerHTML = ''; return; }
      const k = C.kanaldanOring({ h: S.kh, b: S.kb, g: S.g, hTol: S.hTol, emi: emi() });
      const uygunlar = k.list.filter(x => x.uygun).slice(0, 3);
      const satir = k.list.slice(0, 6).map((x, i) => {
        const best = uygunlar[0] === x;
        let idHucre = '–';
        if (S.kcap > 0) {
          const m = C.kanalCapindanOring(S.kcap, x.d, S.yon);
          if (m.as568 && x.std.startsWith('AS568')) idHucre = `<b>AS568${m.as568.dash}</b> Ø${f(m.as568.id)} <span class="badge ${m.as568.ok ? 'ok' : 'warn'}">${S.yon === 'ic' ? 'çevre sık.' : 'gerilme'} ${P(m.as568.oran)}</span>`;
          else idHucre = `ID ≈ Ø${f(m.hedefID)} <span class="small">(metrik, tedarikçiye sorun)</span>`;
        }
        return `<tr class="${best ? 'best' : ''} ${x.uygun ? '' : 'dim'}">
          <td><b>${f(x.d)}</b> ±${f(x.tol)}<div class="small">${x.std}</div></td>
          <td class="num">${P(x.c)}</td><td class="num">${P(x.cMin)} – ${P(x.cMax)}</td><td class="num">${P(x.dolMaks)}</td>
          <td>${x.uygun ? `<span class="badge ok">${best ? 'En iyi' : 'Uygun'}</span>` : '<span class="badge bad">Uygun değil</span>'}</td>
          <td>${idHucre}</td></tr>`;
      }).join('');
      const b0 = uygunlar[0];
      el.innerHTML = `<div class="card"><h3>Uygun O-ring kesitleri</h3>
        <table><thead><tr><th>Kesit d (mm)</th><th class="num">Sıkıştırma</th><th class="num">Tolerans aralığı</th><th class="num">Maks. doluluk</th><th>Durum</th><th>Önerilen ölçü</th></tr></thead><tbody>${satir}</tbody></table>
        ${uygunlar.length ? '' : '<div class="warnbox">Bu kanal ölçüsü için standart kesitlerden hiçbiri bandın içinde değil. Kanal derinliği ≈ 0,77 × d, genişliği ≈ 1,35–1,45 × d olacak şekilde düzenleyin.</div>'}
        ${refs(k.bant.ref.concat(['as568']))}</div>
        ${b0 ? `<div class="card"><h3>Seçilen kesitle montaj görünümü</h3><div class="sketch">${svgKesit(S.kb, S.kh, S.g, b0.d, k.H, S.yon, 'oring')}<div><p>Önerilen kesit <b>${f(b0.d)} mm</b>: nominal sıkıştırma ${P(b0.c)}, en kötü durumda doluluk ${P(b0.dolMaks)}.</p><p class="small">3 farklı sıkıştırma oranı için kanalı yeniden boyutlandırmak isterseniz Proje girdilerinde “Contayı biliyorum” moduna geçin – kesit otomatik aktarılır.</p><button class="mini" id="aktar">Bu kesiti “conta → kanal” moduna aktar</button></div></div></div>` : ''}
        ${limitKart(b0 ? b0.d : S.kh / 0.77, k.bant, true)}`;
      const ak = $('#aktar');
      if (ak) ak.addEventListener('click', () => {
        S.cs = b0.d; S.csTol = b0.tol; S.mod = 'conta';
        if (S.kcap > 0) { const m = C.kanalCapindanOring(S.kcap, b0.d, S.yon); if (m.as568 && b0.std.startsWith('AS568')) { S.as568 = m.as568.dash; S.ID = m.as568.id; } else { S.as568 = ''; S.ID = m.hedefID; } }
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
  function renderKurallar() {
    const nk = nominalKanal();
    const r = C.civataKurallari({ M: S.M, d: nk.d, b: nk.b, kanalli: nk.kanalli, metalTemas: S.metalTemas, plastik: S.govde === 'plastik' || S.kapakZayif, emi: emi(), fGHz: S.fGHz, cevre: S.cevre });
    $('#civataSonuc').innerHTML = `<p class="small">Hesap, 2. sayfadaki nominal conta ölçüsüne göre yapıldı: kesit/kalınlık ≈ ${f(nk.d)} mm, kanal genişliği ≈ ${f(nk.b)} mm.</p>
      <div class="kv">
        <div><b>Ø${f(r.delik, 1)}</b><span>${S.M} geçiş deliği (ISO 273 orta seri)</span></div>
        <div><b>≥ ${f(r.eMin, 1)} mm</b><span>kanal kenarı ile delik kenarı arası et kalınlığı</span></div>
        <div><b>≥ ${f(r.eksen, 1)} mm</b><span>kanal ekseni – cıvata ekseni mesafesi</span></div>
        <div><b>${f(r.kenarMin, 1)} – ${f(r.kenarTercih, 1)} mm</b><span>delik merkezi – parça dış kenarı (1,5d – 2d)</span></div>
        <div><b>${f(r.pMin, 0)} – ${f(r.pMax, 0)} mm</b><span>cıvatalar arası mesafe (başlangıç değeri)</span></div>
        ${r.adet ? `<div><b>≥ ${r.adet} adet</b><span>${f(S.cevre, 0)} mm çevre için cıvata sayısı (p = ${f(r.pOneri, 0)} mm)</span></div>` : ''}
        ${r.kose ? `<div><b>R ≥ ${f(r.kose.min, 1)} mm</b><span>köşe yarıçapı (kanal ekseninde, 3d; tercihen 6d = R${f(r.kose.tercih, 0)})</span></div>` : ''}
        ${r.pEmi ? `<div><b>${f(r.pEmi, 1)} mm</b><span>λ/20 @ ${f(S.fGHz, 1)} GHz – contasız açıklık sınırı (temkinli kontrol)</span></div>` : ''}
      </div>
      <p class="small mt">${esc(r.aciklama)} Kapak kalınlığı ${f(S.kapakT, 1)} mm${S.kapakT && S.kapakT < r.db ? ' – cıvata çapından ince; cıvatalar arası eğilmeyi FEA ile kontrol edin veya aralığı sıklaştırın.' : '.'} Bu değerler temel kural (rule of thumb) niteliğinde başlangıç değerleridir; kapak eğilmesi ile en uzak noktadaki sıkıştırmanın alt sınırın üstünde kaldığını doğrulayın.</p>
      ${refs(['iso273', 'kural', 'parker'])}`;

    const d = nk.d;
    const R = [
      ['Contayı basınç tarafına, cıvataları dışına yerleştirin', `Cıvata delikleri sızdırmaz bölgenin dışında kalmalı. Cıvata sızdırmaz bölgeden geçmek zorundaysa her cıvataya ayrı O-ring veya contalı rondela verin.`, ['parker']],
      ['Kanalı cıvata hattına yakın tutun', `Conta ne kadar cıvataya yakınsa kapak eğilmesinin etkisi o kadar az olur. Ancak delikle kanal arasında en az ≈ ${f(Math.max(2, d), 1)} mm et kalmalı (plastikte ≥ ${f(Math.max(3, 1.5 * d), 1)} mm). Havşa ve rondela izini de hesaba katın.`, ['kural']],
      ['Köşelerde yeterli yarıçap', `Dikdörtgen kanal yolunda iç köşe yarıçapı kanal ekseninde en az 3 × kesit (≈ R${f(3 * d, 1)}), tercihen 6 × kesit olmalı. Keskin köşede O-ring kanaldan taşar veya katlanır.`, ['parker']],
      ['Kanal kenarları ve taban radyüsü', 'Kanal tabanında R0,2–0,4 mm köşe radyüsü, kanal ağzında 0,1–0,2 mm kenar kırma/radyüs. Çapak kesinlikle olmamalı (montajda contayı keser).', ['parker', 'iso3601']],
      ['Yüzey pürüzlülüğü', 'Statik yüz contası: kanal tabanı ve karşı yüzey Ra ≤ 0,8 µm (sıvı), gaz ve vakum için Ra ≤ 0,4 µm; kanal yan duvarları Ra ≤ 1,6 µm. Radyal yönlü işleme izleri sızıntı kanalı oluşturur – tornalama izleri çevresel olmalı.', ['parker']],
      ['Kanal duvarı açısı', 'Yan duvarlar 0–5° eğimli olabilir. Ters montajda (kapak aşağı) contayı tutmak için kırlangıç kuyruğu (dovetail) veya yarım dovetail kanal kullanın.', ['parker']],
      ['Düzlemsellik ve rijitlik', 'Conta temas yüzeyinin düzlemselliği sıkıştırma toleransının küçük bir kısmı olmalı (tipik ≤ 0,05 mm / 100 mm). Uzun ince kapaklarda nervür veya kalınlık artışı düşünün.', ['kural']],
      ['Basınç yönüne göre O-ring konumu', 'İç basınçta O-ring kanalın dış duvarına, dış basınç/vakumda iç duvarına yaslanacak şekilde boyutlandırın (2. sayfa bunu otomatik yapar). Böylece basınç O-ring’i hareket ettirmez.', ['parker']],
      ['Tolerans zinciri', `Kanal derinliği toleransı genelde ±0,05 mm yeterli; EMI conta gibi dar bantlarda ±0,03 mm hedefleyin. Kapak/gövde çarpılması ve kaplama kalınlığı (eloksal, boya) derinliğe eklenir.`, ['iso3601']],
      ['Montaj ve servis', 'Kanalın kolay temizlenebilir olmasını sağlayın; contayı söküp takmak için bir noktada sökme cebi bırakmak faydalıdır. Conta ezilmesini önlemek için kapak kılavuz pimle konumlansın.', ['kural']]
    ];
    if (emi()) R.push(
      ['EMI: iletken temas yüzeyi', 'Alüminyumda conta temas yüzeyi MIL-DTL-5541 Tip II Class 3 kromat (Alodine) kaplama olmalı; eloksal ve boya yalıtkandır, maskeleyin. Galvanik uyum için Al gövdede Ag/Al veya Ni/C dolgulu conta seçin.', ['mil5541', 'chomHb']],
      ['EMI: conta sürekliliği', 'İletken conta kesintisiz bir halka oluşturmalı; uç birleştirme gerekiyorsa vulkanize ek isteyin. Kapak eğilmesi iletken teması koparmamalı – cıvata aralığını mekanik değerden sık tutun.', ['chomHb']]
    );
    $('#kuralListe').innerHTML = `<div class="card"><h3>Çizim kontrol listesi</h3>${R.map((r, i) => `<div class="rule"><div class="no">${i + 1}</div><div><p><b>${esc(r[0])}</b></p><p class="small">${esc(r[1])}</p>${refs(r[2])}</div></div>`).join('')}</div>`;
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
      const as = S.as568 ? C.as568Bul(S.as568) : null;
      const boyut = as && Math.abs(as.cs - S.cs) < 0.02 && Math.abs(as.id - S.ID) < 0.05 ? `AS568${as.dash} (Ø${f(as.id)} × ${f(as.cs)} mm)` : `Ø${f(S.ID)} × ${f(S.cs)} mm`;
      L.push(en ? `SEAL: O-RING ${boyut}.` : `CONTA: O-RING ${boyut}.`);
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
    const tags = ['Tümü', ...new Set(D.TEDARIKCILER.flatMap(t => t.tags))];
    $('#tedarikFiltre').innerHTML = tags.map(t => `<button class="mini ${t === tedFiltre ? 'on' : ''}" data-tf="${esc(t)}">${esc(t)}</button>`).join('');
    $$('[data-tf]').forEach(b => b.addEventListener('click', () => { tedFiltre = b.dataset.tf; renderTedarik(); }));
    const liste = D.TEDARIKCILER.filter(t => tedFiltre === 'Tümü' || t.tags.includes(tedFiltre))
      .sort((a, b) => (emi() ? (b.tags.includes('EMI') - a.tags.includes('EMI')) : 0));
    $('#tedarikListe').innerHTML = liste.map(t => `<div class="card sup">
      <h3>${esc(t.ad)}</h3><div class="where">${esc(t.bolge)}</div>
      <p>${esc(t.odak)}</p>
      <p>📍 ${esc(t.adres)}</p>
      <p>📞 ${t.tel.map(n => `<a href="tel:${n.replace(/\s/g, '')}">${esc(n)}</a>`).join(' · ')}</p>
      ${t.eposta ? `<p>✉️ <a href="mailto:${esc(t.eposta)}">${esc(t.eposta)}</a></p>` : ''}
      ${t.web ? `<p>🌐 <a href="${esc(t.web)}" target="_blank" rel="noopener">${esc(t.web.replace(/^https?:\/\//, ''))}</a></p>` : ''}
      <div class="pill-row">${t.tags.map(x => `<span class="chip">${esc(x)}</span>`).join('')}<a class="ref" href="${esc(t.kaynak)}" target="_blank" rel="noopener">Kaynak</a></div>
    </div>`).join('');
  }

  // ---------------- 8. Referanslar ----------------
  function renderRef() {
    $('#refListe').innerHTML = `<div class="card"><table><thead><tr><th>Etiket</th><th>Kaynak</th></tr></thead><tbody>${Object.values(D.REF).map(r => `<tr><td><span class="ref">${esc(r.kisa)}</span></td><td>${esc(r.ad)}${r.url ? `<br><a class="small" href="${r.url}" target="_blank" rel="noopener">${esc(r.url)}</a>` : ''}</td></tr>`).join('')}</tbody></table></div>
      <div class="card info"><h3>Önemli not</h3><p>Bu uygulama ön tasarım ve karar destek aracıdır. Kesin ölçüler için: (1) conta tedarikçisinin malzeme veri sayfası, (2) Parker ORD 5700 ve Chomerics tasarım tabloları, (3) sızdırmazlık / EMI testi ile doğrulama yapılmalıdır.</p></div>`;
  }

  // ---------------- Ana render ----------------
  function aktifSayfa() { return ($('.page.active') || {}).dataset?.page; }
  function renderAll(yapisal) {
    syncControls();
    renderOzet();
    const p = aktifSayfa();
    if (p === 'kanal') { if (yapisal || !$('#kanalGirdi').innerHTML) renderKanalGirdi(); renderKanalSonuc(); }
    if (p === 'malzeme') renderMalzeme();
    if (p === 'kurallar') renderKurallar();
    if (p === 'yapistirma') renderYapistirma();
    if (p === 'not') { if (yapisal || !$('#notGirdi').innerHTML) renderNotGirdi(); renderNotCikti(); }
    if (p === 'tedarik') renderTedarik();
    if (p === 'ref') renderRef();
    syncControls();
  }
  $('#uygunsuzGoster').addEventListener('change', renderMalzeme);

  renderOrtamlar();
  renderAll(true);
})();
