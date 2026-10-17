"""Build Veyra's geometric SVG identity. Letterforms are outlined from the bundled OFL font."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / 'public/brand'
DOCS = ROOT / 'docs/assets'
BRAND.mkdir(parents=True, exist_ok=True)
DOCS.mkdir(parents=True, exist_ok=True)
FONT = instantiateVariableFont(TTFont(ROOT / 'public/fonts/Inter.ttf'), {'wght': 550, 'opsz': 32}, inplace=False)
GLYPHS = FONT.getGlyphSet()
CMAP = FONT.getBestCmap()
UPM = FONT['head'].unitsPerEm
INK = '#111114'
PAPER = '#f2efe8'
VIOLET = '#c4afff'
# 26-unit outer radius, 11-unit counter; radial opening above, 8-unit release below.
HALF = 'M23.107 7.568A26 26 0 0 0 28 57.690L28 42.247A11 11 0 0 1 28.238 21.663Z'

def mark(color=VIOLET, x=0, y=0, size=64):
    return f'<g transform="translate({x} {y}) scale({size / 64})" fill="{color}"><path d="{HALF}"/><path d="{HALF}" transform="translate(64 0) scale(-1 1)"/></g>'

def text(value, x, baseline, size, color=PAPER, spacing=0):
    scale = size / UPM
    out = []
    for char in value:
        glyph = CMAP.get(ord(char), '.notdef')
        pen = SVGPathPen(GLYPHS)
        GLYPHS[glyph].draw(pen)
        out.append(f'<path fill="{color}" d="{pen.getCommands()}" transform="translate({x:.3f} {baseline}) scale({scale:.6f} {-scale:.6f})"/>')
        x += FONT['hmtx'][glyph][0] * scale + spacing
    return ''.join(out)

def svg(width, height, content, title, description, background=None):
    bg = f'<rect width="{width}" height="{height}" fill="{background}"/>' if background else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc"><title id="title">{title}</title><desc id="desc">{description}</desc>{bg}{content}</svg>\n'

for name, color in [('mark', VIOLET), ('mark-ink', INK), ('mark-paper', PAPER)]:
    (BRAND / f'{name}.svg').write_text(svg(64, 64, mark(color), 'Veyra mark', 'A split circular seal with a V-shaped opening.'))

for name, color in [('wordmark', PAPER), ('wordmark-ink', INK)]:
    content = mark(color, 0, 12, 84) + text('veyra', 104, 89, 98, color, -4.5)
    (BRAND / f'{name}.svg').write_text(svg(360, 116, content, 'Veyra', 'Veyra horizontal wordmark, with outlined lettering.'))

cover = mark(VIOLET, 62, 46, 42) + text('veyra', 116, 82, 44, PAPER, -2)
cover += text('COLLECTING, REIMAGINED.', 832, 74, 11, '#a69bac', 1.3)
cover += text('A little luck.', 64, 215, 76, PAPER, -3)
cover += text('A rare feeling.', 64, 300, 76, VIOLET, -3)
cover += text('Agent-native collecting. Powered by PayBox and x402.', 68, 351, 17, '#aaa0b4', -.15)
cover += mark(VIOLET, 874, 132, 250)
cover += '<path d="M64 400H1136" stroke="#37313f"/>'
cover += text('VEYRA / COLLECTING PROTOCOL', 68, 435, 9, '#a396b2', 1.2)
cover += text('DISCOVER. AUTHORIZE. REVEAL.', 875, 435, 9, '#a396b2', .6)
(DOCS / 'cover.svg').write_text(svg(1200, 470, cover, 'Veyra — A little luck. A rare feeling.', 'The Veyra wordmark and split-seal symbol on an ink background.', INK))

board = text('The split seal.', 56, 82, 38, INK, -1)
board += text('One idea. Three essential expressions.', 58, 119, 16, '#655d6c')
board += '<rect x="48" y="160" width="336" height="300" rx="16" fill="#111114"/>' + mark(VIOLET, 132, 226, 168)
board += '<rect x="402" y="160" width="336" height="300" rx="16" fill="#c4afff"/>' + mark(INK, 486, 226, 168)
board += '<rect x="756" y="160" width="396" height="300" rx="16" fill="#e8e4dc"/>' + mark(INK, 808, 260, 72) + text('veyra', 900, 321, 79, INK, -3.5)
board += text('01 / PRIMARY', 70, 495, 11, '#655d6c', 1)
board += text('02 / REVERSED', 424, 495, 11, '#655d6c', 1)
board += text('03 / WORDMARK', 778, 495, 11, '#655d6c', 1)
(DOCS / 'identity.svg').write_text(svg(1200, 550, board, 'Veyra visual identity', 'Primary violet mark, ink reversed mark, and horizontal wordmark.', PAPER))

icon = '<rect width="64" height="64" rx="16" fill="#111114"/>' + mark(VIOLET, 6, 6, 52)
(ROOT / 'public/icon.svg').write_text(svg(64, 64, icon, 'Veyra', 'Veyra application icon.'))
(ROOT / 'src/lib/brand.ts').write_text('/** Geometric master shared by the browser and Remotion. See public/brand for SVG exports. */\nexport const SEAL_HALF = "' + HALF + '";\n')
print('Built vector marks, outlined wordmarks, repository cover, identity board, and favicon.')
