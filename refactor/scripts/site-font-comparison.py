"""Read-only font reference comparison; matching outlines are not byte identity."""

import argparse
import hashlib
import importlib.metadata
import json
from pathlib import Path

from fontTools.pens.recordingPen import RecordingPen
from fontTools.ttLib import TTFont


def compare(local, reference):
    with TTFont(local, recalcTimestamp=False) as first, TTFont(reference, recalcTimestamp=False) as second:
        equal, different = [], []
        for key in sorted((set(first.keys()) | set(second.keys())) - {"GlyphOrder"}):
            matches = key in first and key in second and first.getTableData(key) == second.getTableData(key)
            (equal if matches else different).append(key)

        def outlines(font):
            result = {}
            glyphs = font.getGlyphSet()
            for name in font.getGlyphOrder():
                pen = RecordingPen()
                glyphs[name].draw(pen)
                result[name] = pen.value
            return hashlib.sha256(json.dumps(result, sort_keys=True).encode()).hexdigest()

        return {
            "localSha256": hashlib.sha256(local.read_bytes()).hexdigest(),
            "referenceSha256": hashlib.sha256(reference.read_bytes()).hexdigest(),
            "sameTables": equal,
            "differentTables": different,
            "glyphCounts": [len(first.getGlyphOrder()), len(second.getGlyphOrder())],
            "glyphOrderEqual": first.getGlyphOrder() == second.getGlyphOrder(),
            "outlineHashes": [outlines(first), outlines(second)],
            "cmapEqual": first.getBestCmap() == second.getBestCmap(),
            "metricsEqual": first["hmtx"].metrics == second["hmtx"].metrics,
        }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("reference_directory", type=Path)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    assert importlib.metadata.version("fonttools") == "4.60.1"
    assert importlib.metadata.version("brotli") == "1.1.0"
    root = Path(__file__).resolve().parents[2]
    pairs = [
        ("liberation", "default.woff2", "liberation.ttf"),
        ("averia-sans", "fonts/Averia Sans Libre Light.ttf", "averia-sans.ttf"),
        ("lato", "fonts/Lato-Regular.ttf", "lato.ttf"),
        ("chawp", "fonts/chawp.otf", "chawp.otf"),
        ("averia-serif-negative", "fonts/Averia Serif Simple Light.ttf", "averia-serif.ttf"),
    ]
    record = json.loads((root / "refactor/baselines/site-font-notices-provenance.json").read_text(encoding="utf-8"))
    expected = {source["id"]: source["comparison"] for source in record["sources"]}
    expected["averia-serif-negative"] = {key: value for key, value in record["negativeComparison"].items() if key != "reference"}
    result = {}
    for name, local, reference in pairs:
        local_path = root / "docs/assets/jassub" / local
        reference_path = args.reference_directory / reference
        assert hashlib.sha256(local_path.read_bytes()).hexdigest() == expected[name]["localSha256"]
        assert hashlib.sha256(reference_path.read_bytes()).hexdigest() == expected[name]["referenceSha256"]
        result[name] = compare(local_path, reference_path)
    if args.check:
        assert result == expected, "Font reference observations changed"
        print("Verified four font references and the distinct Serif Simple negative comparison")
    else:
        print(json.dumps(result, indent=2))
