"""Read font metadata only; embedded notices do not establish acquisition rights."""

import hashlib
import importlib.metadata
import json
from pathlib import Path

from fontTools.ttLib import TTFont


def inspect_fonts():
    root = Path(__file__).resolve().parents[2]
    records = []
    for file in sorted((root / "docs/assets/jassub").rglob("*")):
        if file.suffix.lower() not in {".ttf", ".otf", ".woff", ".woff2"}:
            continue
        with TTFont(file, lazy=True) as font:
            names = {}
            for record in font["name"].names:
                if record.nameID in {0, 1, 2, 4, 5, 6, 8, 9, 11, 13, 14}:
                    names.setdefault(str(record.nameID), set()).add(record.toUnicode())
            records.append({
                "file": file.relative_to(root).as_posix(),
                "bytes": file.stat().st_size,
                "sha256": hashlib.sha256(file.read_bytes()).hexdigest(),
                "names": {key: sorted(values) for key, values in names.items()},
                "fsType": font["OS/2"].fsType if "OS/2" in font else None,
            })
    return {
        "schemaVersion": 1,
        "task": "PKG-JASSUB-01",
        "tools": {name: importlib.metadata.version(name) for name in ["fonttools", "brotli"]},
        "scope": "Read-only embedded OpenType names and OS/2 fsType. These are source clues, not proof of original acquisition or redistribution authorization.",
        "fonts": records,
    }


if __name__ == "__main__":
    print(json.dumps(inspect_fonts(), ensure_ascii=True, indent=2))
