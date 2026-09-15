# Diler İnşaat web sitesi

Bağımsız, statik web projesi. Derleme adımı gerekmez.

## Önizleme

Bu klasörde `python -m http.server 8877` çalıştırın ve `http://localhost:8877` adresini açın. Sayfa içeriği `data.json` üzerinden yüklendiği için `index.html` dosyasını doğrudan açmak yerine bir HTTP sunucusu kullanın.

## İçerik ve medya

- Metinler, hizmetler, iletişim bilgileri ve proje kayıtları: `data.json`
- Proje fotoğrafları: `assets/images/projects/`
- Proje videoları: `assets/videos/`
- Video kapakları: `assets/posters/`

Görselde bulunmayan adres, proje adları, konumları ve yılları dummy olarak işaretlenmiştir. Gerçek bilgiler geldiğinde yalnızca `data.json` düzenlenebilir.
