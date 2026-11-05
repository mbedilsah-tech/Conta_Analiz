# Conta Analiz

Statik conta (O-ring ve gasket) tasarımı için Türkçe, tarayıcıda çalışan yardımcı uygulama. Kurulum gerektirmez: `index.html` dosyasını tarayıcıda açmanız yeterli. GitHub Pages ile de yayınlanabilir (Settings → Pages → `main` / root).

## Kolay mod / Uzman mod

Sağ üstten seçilir. **Kolay mod** yeni başlayanlar içindir: yalnızca O-ring kalınlığı (isteğe bağlı iç çap) ya da kanal derinliği ve genişliği girilir. Uygulama açıklamalı bir kesit çizimi üzerinde kanal ölçüsünü veya uygun O-ring'i, 3 sıkıştırma seçeneğini, malzemeyi ve Shore A sertliğini sade bir dille verir. "Uzman moduna aktar" düğmesi ölçüleri ayrıntılı hesaba taşır.

## Sayfalar

1. **Proje girdileri**: Statik/dinamik (dinamik sonraki sürümde), O-ring / gasket (dolu kordon, D-profil, tüp, düz, sünger), EMI var/yok, tasarım yönü, sıcaklık, basınç ve yönü, ortam, gövde malzemesi.
2. **Kanal & sıkıştırma**
   - *Contayı biliyorum → kanal öner*: Yalnızca O-ring kesiti girilir; 3 sıkıştırma oranı (düşük / nominal / yüksek) için kanal derinliği, genişliği, toleranslı en kötü durum sıkıştırması ve kanal doluluğu hesaplanır.
   - **Kanal yolu**: *Dairesel kanal* için eksen çapı Dm, *şekilli kanal* için A×B ölçüleri ve köşe radyüsü R girilir. Uygulama gerekli O-ring iç çapını hesaplar. R için 3d alt sınır, 6d öneri olarak verilir.
   - **Detaylar (opsiyonel)**: AS568 numarası veya belirli bir O-ring iç çapı, kesit/kanal toleransları, flanş boşluğu ve montaj gerilmesi bu bölümdedir. AS568 karşılığı yalnızca bilgi amaçlı gösterilir.
   - *Kanalı biliyorum → conta öner*: uygun O-ring kesitleri ve en yakın AS568 ölçüsü; gasket için gerekli kalınlık ve en yakın stok kalınlık.
   - Sıkıştırma limiti (compression limit): izin verilen en yüksek ve en düşük sıkıştırma, metal-metal temas veya stoper/burç önerisi.
3. **Malzeme & Shore A**: Sıcaklık ve ortam uyumuna göre filtreleme. Sıralama ölçütü seçilebilir: piyasada bulunurluk, ortam uyumu veya maliyet. Basınç ve kapak rijitliğine göre Shore A önerisi verilir. EMI seçiliyse iletken elastomerler (Ag/Al, Ni/C, Ni/Al, Ag/Cu) listelenir.
4. **Kanal çizim kuralları**: Cıvata deliği ile kanal arası et kalınlığı, kanal ekseni ile cıvata ekseni arası mesafe ve kenar mesafesi hesaplanır.
   - **Cıvata aralığı** kapak eğilmesine göre hesaplanır: C = [480·E·a·t³·ΔH / (13·q_min + 2·q_max)]^¼. Formülün kaynakları Engineers Edge, Krishnan & Nair ve Marks' Handbook'tur. Conta kuvveti q Lindley denklemiyle, Shore A → E dönüşümü Gent bağıntısıyla bulunur. Basınç yükü ve cıvata başına yük kontrolü de yapılır. Sonuç, pratik üst sınırla karşılaştırılarak önerilir.
   - Yerleşim ve cıvata aralığı kutuları tıklanınca çizim, hesap ayrıntısı ve kaynak açılır. Cıvata aralığı, kapak eğilmesi hesabı ile ASME VIII-1 Ek 2 / TEMA üst sınırının (B_maks = 2a + 6t/(m+0,5)) küçüğüdür. Alt sınır anahtar boşluğudur. Sıkma torku VDI 2230 tablosundan alınır (8.8, µ = 0,12); gövde malzemesine göre diş boyu da verilir.
   - **Çizim kontrol listesi**: Her madde tıklanınca sade bir teknik resim örneği açılır. Kaynak etiketine basınca kaynağın neyi desteklediği ve bağlantısı görünür.
5. **Conta yapıştırma**: Conta malzemesi, yüzey, sıcaklık ve iletkenlik ihtiyacına göre yapıştırıcı önerisi. Önerilen yapıştırıcı teknik resim notuna eklenebilir.
6. **Teknik resim notu**: ASTM D2000 kod oluşturucu ve TR/EN not metni (ISO 3601, ISO 3302-1, ISO 2230, MIL-DTL-83528, MIL-DTL-5541, yağlayıcı ve yapıştırma notları).
7. **Tedarikçiler**: Ankara, Türkiye (Ankara dahil) ve Dünya sekmeleri. Firmalar büyüklüğe göre sıralanır: önce çalışan sayısı, sonra kuruluş yılı. Her kartta bilgi kaynağı bağlantısı vardır.
8. **Referanslar**: Parker ORD 5700, Parker Chomerics el kitapları, ASTM D2000, AS568, ISO 3601, SAE ARP1231 ve diğer kaynaklar.

## Ayarlar

Sağ üstteki ⚙ **Ayarlar** panelinden:
- Değer değiştirildiğinde ölçüler yenilenirken dönen halka animasyonu açılıp kapatılabilir; süresi de seçilebilir.
- "Detaylar" bölümlerinin her zaman açık gelmesi sağlanabilir.

## Dosya yapısı

```
index.html      arayüz iskeleti
css/style.css   stil
js/as568.js     AS568 ölçü tablosu (001–475)
js/data.js      malzeme, sıkıştırma bandı, yapıştırıcı, tedarikçi ve referans verisi
js/calc.js      hesap motoru (DOM'dan bağımsız, Node ile test edilebilir)
js/app.js       arayüz mantığı (durum tarayıcıda localStorage'da saklanır)
```

Değerleri revize etmek için genellikle yalnızca `js/data.js` dosyasını düzenlemek yeterlidir. Sıkıştırma bantları `SIKISTIRMA`, malzemeler `MALZEMELER`, yapıştırıcılar `YAPISTIRICILAR`, tedarikçiler ise `TEDARIKCILER` altındadır.

## Önemli not

Değerler el kitaplarından derlenmiş **başlangıç değerleridir**. Kesin tasarım için tedarikçinin malzeme veri sayfası, ilgili standart ve sızdırmazlık/EMI testi esas alınmalıdır. Tedarikçi iletişim bilgileri Kasım 2026 tarihlidir; aramadan önce güncel olup olmadığını kontrol edin.
