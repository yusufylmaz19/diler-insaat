"""Build the categorized photo and video gallery in data.json."""

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
    data = json.loads(data_path.read_text(encoding="utf-8"))
    media = []
    categories = (
        ("İnşaat", "assets/inşaat"),
        ("İç Mimari", "assets/iç mimari"),
        ("Alçıpan Asma Tavan", "assets/asma tavan-alçıpan"),
        ("Laminant Parke", "assets/laminant parke"),
    )
    groups = []
    for label, folder in categories:
        groups.append([
            {"type": "image", "src": path.relative_to(ROOT).as_posix(),
             "title": f"{label} uygulaması {path.stem}", "category": label}
            for path in files(folder, IMAGE_EXTENSIONS)
        ])
    # Mix categories so the first gallery page shows every area of work.
    for index in range(max(map(len, groups))):
        for group in groups:
            if index < len(group):
                media.append(group[index])
    posters = {path.stem: path.relative_to(ROOT).as_posix()
               for path in files("assets/posters", IMAGE_EXTENSIONS)}
    for path in files("assets/videos", VIDEO_EXTENSIONS):
        item = {"type": "video", "src": path.relative_to(ROOT).as_posix(),
                "title": f"Proje videosu {path.stem}", "category": "Videolar"}
        if path.stem in posters:
            item["poster"] = posters[path.stem]
        media.append(item)
    data["projects"]["media"] = media
    data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Galeri güncellendi: {len(media)} medya")


if __name__ == "__main__":
    main()
