"""Prepare web-sized copies of the supplied photos; leave assets/ unchanged.

Run on macOS with: python3 scripts/import-photos.py
Video copies are prepared separately with avconvert (see README).
"""
from pathlib import Path
import argparse
import subprocess

ROOT = Path(__file__).resolve().parent.parent
PHOTO_MAP = {
    'Image.jpeg': 'hero/portrait.jpg',
    '066631c3-398e-48d6-ad5c-443c6cb54274.jpeg': 'math-hosa/state-statistics.jpg',
    '20260909_213744_32C65F.jpeg': 'scale-coin/fall-2026.jpg',
    '13f46769-40d1-442c-9d62-c248f9969981.jpeg': 'concert-band/concert-performance.jpg',
    '91866964-e898-4f05-b515-7ede40d7b8a1.jpeg': 'concert-band/senior-speech.jpg',
    'A3714F2F-213B-48E3-B394-81E723C9744C.jpeg': 'math-hosa/anatomy-team.jpg',
    'IMG_0502.jpeg': 'duke-marching-band/el-paso.jpg',
    'IMG_3914.jpeg': 'food/japan-sriracha.jpg',
    'IMG_8622.jpeg': 'math-hosa/hosa-siblings.jpg',
    'IMG_2170.jpeg': 'beyblades/collection-wide.jpg',
    'IMG_2171.jpeg': 'beyblades/collection-detail.jpg',
    'IMG_8048 (1).jpeg': 'concert-band/musical-team.jpg',
    'images.jpeg': 'concert-band/parkland-tribute.jpg',
    'IMG_0834.jpeg': 'sports/soccer-team.jpg',
    'IMG_0450.jpeg': 'food/discovery-01.jpg',
    'IMG_1524.jpeg': 'food/discovery-02.jpg',
    'IMG_2137.jpeg': 'food/discovery-03.jpg',
    'IMG_2208.jpeg': 'food/discovery-04.jpg',
    'IMG_2327.jpeg': 'food/discovery-05.jpg',
    'IMG_0448.jpeg': 'food/discovery-06.jpg',
    'IMG_1341.jpeg': 'food/discovery-07.jpg',
    'IMG_1914.jpeg': 'food/discovery-08.jpg',
    'IMG_2788.jpeg': 'food/discovery-09.jpg',
    '20260414_212629_E72CD0.jpeg': 'scale-coin/initiation-chapel.jpg',
    '20260414_234525_E62AB5.jpeg': 'scale-coin/initiation-night.jpg',
    '20260415_012011_E167B3.jpeg': 'scale-coin/initiation-friends.jpg',
}


def strip_private_metadata(data: bytes) -> bytes:
    # sips has already decoded/resized the supplied, upright photos.
    # Preserve the JPEG image stream and color profile; omit EXIF/XMP,
    # Photoshop metadata and comments from the public copy.
    assert data[:2] == b'\xff\xd8', 'Expected a JPEG'
    result = bytearray(data[:2])
    offset = 2
    while offset < len(data):
        assert data[offset] == 0xff, 'Unexpected JPEG marker'
        marker = data[offset + 1]
        if marker in (0xda, 0xd9):
            result.extend(data[offset:])
            break
        length = int.from_bytes(data[offset + 2:offset + 4], 'big')
        end = offset + 2 + length
        assert length >= 2 and end <= len(data), 'Invalid JPEG segment'
        if marker not in (0xe1, 0xed, 0xfe):
            result.extend(data[offset:end])
        offset = end
    return bytes(result)


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--force', action='store_true', help='Regenerate all web copies')
args = parser.parse_args()

for original, destination in PHOTO_MAP.items():
    source = ROOT / 'assets' / original
    output = ROOT / 'public/media' / destination
    if not args.force and output.exists() and output.stat().st_mtime >= source.stat().st_mtime:
        continue
    output.parent.mkdir(parents=True, exist_ok=True)
    dimensions = subprocess.run([
        'sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(source),
    ], check=True, capture_output=True, text=True).stdout
    longest = max(int(line.split(':')[-1]) for line in dimensions.splitlines() if 'pixelWidth:' in line or 'pixelHeight:' in line)
    limit = 1000 if destination.startswith('food/') else 1800
    subprocess.run([
        'sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '82',
        '--resampleHeightWidthMax', str(min(limit, longest)), str(source), '--out', str(output),
    ], check=True, capture_output=True)
    output.write_bytes(strip_private_metadata(output.read_bytes()))
    print(f'{destination}: {output.stat().st_size // 1024} KB')
