/* Topluluk: modül yorumları + kullanıcının eklediği tedarikçiler.
   Şimdilik veriler bu tarayıcıda (localStorage) saklanır. Ortak veritabanına
   geçmek için yalnızca DEPO nesnesinin oku/yaz fonksiyonlarını değiştirmek yeterli. */
(function (g) {
  'use strict';
  const ANAHTAR = 'contaAnaliz.topluluk.v1';
  const BOS = { ad: '', yorumlar: [], tedarikciler: [] };

  const DEPO = {
    oku() {
      try { const v = JSON.parse(localStorage.getItem(ANAHTAR)); if (v) return { ...BOS, ...v }; } catch (e) { /* depolama yok */ }
      return { ...BOS, yorumlar: [], tedarikciler: [] };
    },
    yaz(v) {
      try { localStorage.setItem(ANAHTAR, JSON.stringify(v)); return true; } catch (e) { return false; }
    }
  };

  const MODUL_AD = { conta: 'Conta', malzeme: 'Malzeme seçimi ve kaplama', civata: 'Cıvatalar ve tork', tolerans: 'Geometrik toleranslandırma', sizdirmazlik: 'Sızdırmazlık' };
  const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = m => (g.UI && g.UI.toast ? g.UI.toast(m) : null);
  const tarihYaz = t => { try { return new Date(t).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
  const harf = ad => (ad.trim()[0] || '?').toLocaleUpperCase('tr-TR');
  const renk = ad => { let h = 0; for (const c of ad) h = (h * 31 + c.charCodeAt(0)) % 360; return `hsl(${h} 45% 42%)`; };

  // ---------------- Yorumlar ----------------
  let siralama = 'yeni';
  let cizilen = null;

  function yorumListe(modul) {
    const v = DEPO.oku();
    const l = v.yorumlar.filter(y => y.modul === modul);
    return l.sort(siralama === 'begeni' ? (a, b) => (b.begeni - a.begeni) || (b.tarih - a.tarih) : (a, b) => b.tarih - a.tarih);
  }

  function yorumHtml(y) {
    return `<article class="yorum" data-yid="${y.id}">
      <div class="avatar" style="background:${renk(y.ad)}">${esc(harf(y.ad))}</div>
      <div class="yorum-g">
        <div class="yorum-ust"><b>${esc(y.ad)}</b><span>${tarihYaz(y.tarih)}</span></div>
        <p>${esc(y.metin).replace(/\n/g, '<br>')}</p>
        <div class="yorum-alt">
          <button class="begen ${y.begendim ? 'on' : ''}" data-begen="${y.id}" aria-pressed="${y.begendim ? 'true' : 'false'}">${y.begendim ? '♥' : '♡'} Faydalı <b>${y.begeni}</b></button>
          <button class="yorum-sil" data-ysil="${y.id}">Sil</button>
        </div>
      </div>
    </article>`;
  }

  function listeyiCiz(modul) {
    const el = document.getElementById('yorumListe');
    if (!el) return;
    const l = yorumListe(modul);
    el.innerHTML = l.length ? l.map(yorumHtml).join('')
      : '<p class="bos">Henüz yorum yok. İlk tecrübeyi siz paylaşın: hangi malzemeyle çalıştınız, nelere dikkat ettiniz, sahada ne sorun yaşadınız?</p>';
    const say = document.getElementById('yorumSay');
    if (say) say.textContent = l.length ? `(${l.length})` : '';
  }

  function yorumPaneli(modul) {
    const v = DEPO.oku();
    return `<div class="card topluluk-kart">
      <div class="topluluk-bas"><h3>💬 Mühendis yorumları <span id="yorumSay"></span></h3>
        <div class="seg kucuk" id="yorumSira"><button data-ys="yeni" class="${siralama === 'yeni' ? 'on' : ''}">En yeni</button><button data-ys="begeni" class="${siralama === 'begeni' ? 'on' : ''}">En faydalı</button></div></div>
      <p class="hint">${esc(MODUL_AD[modul] || '')} konusunda tecrübelerinizi paylaşın: "şu malzemeyle çalıştım, şuna dikkat edin" gibi. Yazmak için adınız yeterli.</p>
      <form id="yorumForm" class="yorum-form" autocomplete="on">
        <label>Adınız<input id="yorumAd" maxlength="60" required value="${esc(v.ad)}" placeholder="Ör. Ahmet Y. – Mekanik tasarım"></label>
        <label>Yorumunuz<textarea id="yorumMetin" maxlength="2000" rows="4" required placeholder="Ör. EPDM contaları yağlı ortamda kullandığımızda 3 ayda şişti; NBR'ye geçince sorun bitti."></textarea></label>
        <div class="yorum-form-alt"><span class="small" id="yorumKalan">2000 karakter</span><button type="submit" class="primary">Paylaş</button></div>
      </form>
      <div id="yorumListe" class="yorum-liste"></div>
      <p class="small mt yerel-not">ℹ️ Şimdilik yorumlar yalnızca bu tarayıcıda saklanıyor; başka kişiler göremez. Ortak veritabanı bağlandığında herkese açık olacak. <button class="linkbtn" data-disa>Verilerimi indir</button> · <button class="linkbtn" data-ice>Dosyadan yükle</button></p>
    </div>`;
  }

  function yerlestir(modul) {
    const dis = document.getElementById('toplulukAlan'), ic = document.getElementById('toplulukConta');
    const alan = modul === 'conta' ? ic : dis, diger = modul === 'conta' ? dis : ic;
    if (!alan) return;
    if (!MODUL_AD[modul]) { alan.innerHTML = ''; if (diger) diger.innerHTML = ''; cizilen = null; return; }
    if (cizilen === modul && alan.innerHTML) return;
    if (diger) diger.innerHTML = '';
    cizilen = modul;
    alan.innerHTML = yorumPaneli(modul);
    listeyiCiz(modul);
  }

  function yorumEkle(modul, ad, metin) {
    ad = ad.trim(); metin = metin.trim();
    if (ad.length < 2) return 'Lütfen adınızı yazın (en az 2 harf).';
    if (metin.length < 5) return 'Yorum çok kısa.';
    const v = DEPO.oku();
    v.ad = ad;
    v.yorumlar.push({ id: id(), modul, ad, metin: metin.slice(0, 2000), tarih: Date.now(), begeni: 0, begendim: false });
    return DEPO.yaz(v) ? null : 'Tarayıcı kayda izin vermedi.';
  }

  function begen(yid) {
    const v = DEPO.oku();
    const y = v.yorumlar.find(x => x.id === yid);
    if (!y) return;
    y.begendim = !y.begendim;
    y.begeni = Math.max(0, y.begeni + (y.begendim ? 1 : -1));
    DEPO.yaz(v);
  }

  function yorumSil(yid) {
    const v = DEPO.oku();
    v.yorumlar = v.yorumlar.filter(x => x.id !== yid);
    DEPO.yaz(v);
  }

  // ---------------- Kullanıcı tedarikçileri ----------------
  const tedarikciler = grup => DEPO.oku().tedarikciler.filter(t => !grup || t.grup === grup || (grup === 'turkiye' && t.grup === 'ankara'));

  function tedarikciKaydet(t) {
    if (!t.ad || t.ad.trim().length < 2) return 'Firma adını yazın.';
    const v = DEPO.oku();
    const temiz = {
      id: t.id || id(), kullanici: true, grup: t.grup || 'ankara',
      ad: t.ad.trim().slice(0, 120), bolge: (t.bolge || '').trim().slice(0, 80), odak: (t.odak || '').trim().slice(0, 400),
      adres: (t.adres || '').trim().slice(0, 200),
      tel: (t.tel || '').split(/[,;]/).map(s => s.trim()).filter(Boolean).slice(0, 4),
      eposta: (t.eposta || '').trim().slice(0, 120),
      web: (() => { const w = (t.web || '').trim(); return !w ? '' : /^https?:\/\//i.test(w) ? w : 'https://' + w; })(),
      tags: (t.tags || '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 6),
      not: (t.not || '').trim().slice(0, 400), ekleyen: (t.ekleyen || '').trim().slice(0, 60), tarih: Date.now()
    };
    if (!temiz.tags.length) temiz.tags = ['Eklediğim'];
    const i = v.tedarikciler.findIndex(x => x.id === temiz.id);
    if (i >= 0) v.tedarikciler[i] = temiz; else v.tedarikciler.push(temiz);
    if (temiz.ekleyen) v.ad = v.ad || temiz.ekleyen;
    return DEPO.yaz(v) ? null : 'Tarayıcı kayda izin vermedi.';
  }

  function tedarikciSil(tid) {
    const v = DEPO.oku();
    v.tedarikciler = v.tedarikciler.filter(x => x.id !== tid);
    DEPO.yaz(v);
  }

  function tedarikciFormu(t) {
    t = t || { grup: (g.UI && g.UI.S().tedSekme) || 'ankara' };
    const opt = (v, a) => `<option value="${v}" ${t.grup === v ? 'selected' : ''}>${a}</option>`;
    return `<form class="card ted-form" id="tedForm" data-tid="${esc(t.id || '')}">
      <h3>${t.id ? 'Tedarikçiyi düzenle' : 'Yeni tedarikçi ekle'}</h3>
      <div class="ted-grid">
        <label>Firma adı *<input name="ad" required maxlength="120" value="${esc(t.ad)}"></label>
        <label>Liste<select name="grup">${opt('ankara', 'Ankara')}${opt('turkiye', 'Türkiye (diğer şehirler)')}${opt('dunya', 'Dünya')}</select></label>
        <label>Şehir / bölge<input name="bolge" maxlength="80" value="${esc(t.bolge)}" placeholder="Ör. OSTİM, İvedik, İstanbul"></label>
        <label>Telefon(lar)<input name="tel" value="${esc((t.tel || []).join(', '))}" placeholder="Virgülle ayırın"></label>
        <label>E-posta<input name="eposta" type="email" maxlength="120" value="${esc(t.eposta)}"></label>
        <label>Web sitesi<input name="web" maxlength="200" value="${esc(t.web)}" placeholder="www.firma.com.tr"></label>
        <label class="genis">Ne yapıyor / ne satıyor<input name="odak" maxlength="400" value="${esc(t.odak)}" placeholder="Ör. O-ring stoku, özel kalıp conta, EMI conta kesimi"></label>
        <label class="genis">Adres<input name="adres" maxlength="200" value="${esc(t.adres)}"></label>
        <label>Etiketler<input name="tags" value="${esc((t.tags || []).filter(x => x !== 'Eklediğim').join(', '))}" placeholder="O-ring, EMI, Stok"></label>
        <label>Ekleyen<input name="ekleyen" maxlength="60" value="${esc(t.ekleyen || DEPO.oku().ad)}" placeholder="Adınız"></label>
        <label class="genis">Not / tecrübe<textarea name="not" rows="2" maxlength="400" placeholder="Ör. Küçük adetlerde hızlı, FKM stoğu var">${esc(t.not)}</textarea></label>
      </div>
      <div class="yorum-form-alt"><button type="button" class="gear" data-tedvazgec>Vazgeç</button><button type="submit" class="primary">${t.id ? 'Kaydet' : 'Listeye ekle'}</button></div>
    </form>`;
  }

  // ---------------- Dışa / içe aktarma ----------------
  function disaAktar() {
    const blob = new Blob([JSON.stringify(DEPO.oku(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'muhendislik-yardimcisi-yorum-tedarikci.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  function iceAktar() {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'application/json,.json';
    inp.addEventListener('change', async () => {
      try {
        const gelen = JSON.parse(await inp.files[0].text());
        const v = DEPO.oku();
        const birlestir = (eski, yeni) => { const m = new Map(eski.map(x => [x.id, x])); (yeni || []).forEach(x => x && x.id && m.set(x.id, x)); return [...m.values()]; };
        v.yorumlar = birlestir(v.yorumlar, gelen.yorumlar);
        v.tedarikciler = birlestir(v.tedarikciler, gelen.tedarikciler);
        DEPO.yaz(v);
        cizilen = null;
        toast('Veriler yüklendi');
        if (g.UI) g.UI.changed(true);
      } catch (e) { toast('Dosya okunamadı'); }
    });
    inp.click();
  }

  // ---------------- Olaylar ----------------
  document.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    const modul = cizilen;
    if (b.dataset.begen) { begen(b.dataset.begen); listeyiCiz(modul); }
    else if (b.dataset.ysil) { if (confirmSil()) { yorumSil(b.dataset.ysil); listeyiCiz(modul); toast('Yorum silindi'); } }
    else if (b.dataset.ys) { siralama = b.dataset.ys; document.querySelectorAll('#yorumSira button').forEach(x => x.classList.toggle('on', x === b)); listeyiCiz(modul); }
    else if (b.hasAttribute('data-disa')) disaAktar();
    else if (b.hasAttribute('data-ice')) iceAktar();
  });
  // Tarayıcı onay penceresi yerine iki tıkla silme
  let silBekleyen = null;
  function confirmSil() {
    const now = Date.now();
    if (silBekleyen && now - silBekleyen < 3000) { silBekleyen = null; return true; }
    silBekleyen = now; toast('Silmek için tekrar tıklayın'); return false;
  }

  document.addEventListener('submit', e => {
    if (e.target.id === 'yorumForm') {
      e.preventDefault();
      const hata = yorumEkle(cizilen, document.getElementById('yorumAd').value, document.getElementById('yorumMetin').value);
      if (hata) { toast(hata); return; }
      document.getElementById('yorumMetin').value = '';
      document.getElementById('yorumKalan').textContent = '2000 karakter';
      siralama = 'yeni';
      document.querySelectorAll('#yorumSira button').forEach(x => x.classList.toggle('on', x.dataset.ys === 'yeni'));
      listeyiCiz(cizilen);
      toast('Yorumunuz eklendi');
    }
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'yorumMetin') document.getElementById('yorumKalan').textContent = `${2000 - e.target.value.length} karakter`;
  });

  g.TOP = { yerlestir, tedarikciler, tedarikciKaydet, tedarikciSil, tedarikciFormu, disaAktar, iceAktar, DEPO, _yorumEkle: yorumEkle };
})(window);
