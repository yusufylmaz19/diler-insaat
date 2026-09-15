"""Register local photos and videos in the static site's data.json."""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}
VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov"}


def files(folder, extensions):
    return sorted(
        (path for path in (ROOT / folder).iterdir()
         if path.is_file() and path.suffix.lower() in extensions),
        key=lambda path: [int(part) if part.isdigit() else part.lower()
                          for part in re.split(r"(\d+)", path.name)],
    )


def main():
    data_path = ROOT / "data.json"
    data = json.loads(data_path.read_text())
    media = data["projects"].setdefault("media", [])
    existing = {item["src"]: item for item in media}
    posters = {path.stem: path.relative_to(ROOT).as_posix()
               for path in files("assets/posters", IMAGE_EXTENSIONS)}
    added = 0
    for kind, folder, extensions in (
        ("image", "assets/images/projects", IMAGE_EXTENSIONS),
        ("video", "assets/videos", VIDEO_EXTENSIONS),
    ):
        for path in files(folder, extensions):
            src = path.relative_to(ROOT).as_posix()
            if src not in existing:
                label = "Proje videosu" if kind == "video" else "Proje fotoğrafı"
                item = {"type": kind, "src": src, "title": f"{label} {path.stem}"}
                media.append(item)
                existing[src] = item
                added += 1
            if kind == "video" and path.stem in posters:
                existing[src].setdefault("poster", posters[path.stem])
    data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"{added} yeni medya eklendi. Toplam: {len(media)}")


if __name__ == "__main__":
    main()
