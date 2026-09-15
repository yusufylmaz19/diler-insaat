# Medya klasörleri

- Proje fotoğraflarını `images/projects/` içine ekleyin.
- Videoları `videos/`, video kapaklarını `posters/` içine ekleyin.
- Ardından proje klasöründe `python3 scripts/sync-media.py` çalıştırın. Fotoğraf ve videolar `data.json` içindeki `projects.media` listesine eklenir; aynı isimli video kapağı eşleştirilir (ör. `1.mp4` → `1.jpg`). Mevcut kayıtlar korunur ve tekrar eklenmez.
- Site statiktir: yalnızca klasöre dosya kopyalamak yeterli değildir. Yeni medya eklediğinizde komutu yeniden çalıştırın ve güncellenen `data.json` dosyasını da siteyle birlikte yükleyin.
- Alternatif olarak `projects.items` veya `projects.media` listesine dosya yolunu elle ekleyebilirsiniz.

Örnek fotoğraf kaydı:

```json
{"title":"Villa Projesi","category":"Anahtar Teslim","location":"İstanbul","year":"2026","image":"assets/images/projects/villa-01.jpg"}
```

Örnek video kaydı:

```json
{"type":"video","src":"assets/videos/proje-01.mp4","poster":"assets/posters/proje-01.jpg","title":"Proje videosu"}
```
