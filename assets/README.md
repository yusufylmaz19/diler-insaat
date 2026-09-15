# Medya klasörleri

- Proje fotoğraflarını `images/projects/` içine ekleyin.
- Videoları `videos/`, video kapaklarını `posters/` içine ekleyin.
- Ardından `data.json` içindeki `projects.items` veya `projects.media` listesine dosya yolunu ekleyin.

Örnek fotoğraf kaydı:

```json
{"title":"Villa Projesi","category":"Anahtar Teslim","location":"İstanbul","year":"2026","image":"assets/images/projects/villa-01.jpg"}
```

Örnek video kaydı:

```json
{"type":"video","src":"assets/videos/proje-01.mp4","poster":"assets/posters/proje-01.jpg","title":"Proje videosu"}
```
