# Medya klasörleri

- Fotoğrafları `inşaat/`, `iç mimari/`, `asma tavan-alçıpan/` ve `laminant parke/` klasörlerine ekleyin.
- Videoları `videos/`, video kapaklarını `posters/` içine ekleyin.
- Bağlantı önizleme görseli `preview/95.jpeg` dosyasındadır.
- Ardından proje klasöründe `python scripts/sync-media.py` çalıştırın. Fotoğraf ve videolar `data.json` içindeki `projects.media` listesini kategori sırasına göre yeniden oluşturur; aynı isimli video kapağı eşleştirilir (ör. `1.mp4` → `1.jpg`).
- Site statiktir: yalnızca klasöre dosya kopyalamak yeterli değildir. Yeni medya eklediğinizde komutu yeniden çalıştırın ve güncellenen `data.json` dosyasını da siteyle birlikte yükleyin.
- `projects.media` listesi her eşitlemede yeniden oluşturulur; kalıcı değişiklikler için medya dosyalarını ilgili klasöre ekleyin.

Örnek fotoğraf kaydı:

```json
{"type":"image","src":"assets/inşaat/1.jpeg","title":"İnşaat uygulaması 1","category":"İnşaat"}
```

Örnek video kaydı:

```json
{"type":"video","src":"assets/videos/proje-01.mp4","poster":"assets/posters/proje-01.jpg","title":"Proje videosu"}
```
