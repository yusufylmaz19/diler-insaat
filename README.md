# Diler İnşaat web sitesi

## Yapım animasyonu

`construction.js` yerel Three.js ile iki katlı konutun yapımını gösterir: temel/donatı, alt kolonlar, ara döşeme, üst kolonlar, üst döşeme, duvarlar, kapı/pencereler, cephe ve çatı. Masaüstünde kaydırma ilerlemesi sahneyi yönetir; yapı tamamlanırken alan sabit kalır. Mobilde sahne görünürken 24 saniyelik otomatik oynatım başlar; alan ekran dışındayken veya sekme gizliyken durur. Durdur/devam et ve yeniden oynatma düğmesi vardır.

Metinler ve mobil süre `data.json` → `hero.construction` üzerinden düzenlenir. Hareket azaltma tercihinde tamamlanmış yapı ve isteğe bağlı başlatma sunulur. WebGL yüklenmezse yerel SVG görünümü kullanılır. Stil kuralları `construction.css` içindedir; Three.js `vendor/` klasöründen yüklenir.

Bağımsız, statik web projesi. Derleme adımı gerekmez.

## Önizleme

Bu klasörde `python -m http.server 8877` çalıştırın ve `http://localhost:8877` adresini açın. Sayfa içeriği `data.json` üzerinden yüklendiği için `index.html` dosyasını doğrudan açmak yerine bir HTTP sunucusu kullanın.

## İçerik ve medya

- Metinler, hizmetler, iletişim bilgileri ve proje kayıtları: `data.json`
- Proje fotoğrafları: `assets/images/projects/`
- Proje videoları: `assets/videos/`
- Video kapakları: `assets/posters/`

Dosyaları ekledikten sonra `python3 scripts/sync-media.py` çalıştırın. Komut fotoğrafları ve videoları içerik listesine kaydeder, aynı isimli video kapaklarını eşleştirir. Yayına alırken medya dosyalarıyla birlikte güncel `data.json`, `script.js` ve `style.css` dosyalarını da yükleyin.

Görselde bulunmayan adres, proje adları, konumları ve yılları dummy olarak işaretlenmiştir. Gerçek bilgiler geldiğinde yalnızca `data.json` düzenlenebilir.
