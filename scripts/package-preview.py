"""Package the actual TMT runtime and remake mod, without the unused legacy layers."""
from html.parser import HTMLParser
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = Path(sys.argv[1] if len(sys.argv) > 1 else 'preview').resolve()
if OUTPUT == ROOT or ROOT in OUTPUT.parents and OUTPUT.parts[len(ROOT.parts)] in ('js', 'css', '.git'):
    raise SystemExit('Choose a separate output directory.')

class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.files = {'index.html', 'LICENSE', 'Prestige-tree-license'}
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        source = attrs.get('src') if tag in ('script', 'img') else attrs.get('href') if tag == 'link' else None
        if source and not source.startswith(('http:', 'https:', 'data:')):
            self.files.add(source)

parser = Assets()
parser.feed((ROOT / 'index.html').read_text())
parser.files.update(str(f.relative_to(ROOT)) for f in (ROOT / 'js/remake').glob('*.js'))
for filename in sorted(parser.files):
    source = (ROOT / filename).resolve()
    if not source.is_relative_to(ROOT) or not source.is_file():
        raise SystemExit(f'Missing or invalid asset: {filename}')
    target = OUTPUT / filename
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)
(OUTPUT / 'README.txt').write_text('Tree of Life Remake / 原生 TMT 氢层\n\n在此目录运行 / Run here:\npython3 -m http.server 4173 --bind 127.0.0.1\n\n中文: http://127.0.0.1:4173/?lang=zh\nEnglish: http://127.0.0.1:4173/?lang=en\n\n请通过 HTTP 服务运行，不要双击 index.html。\nServe over HTTP rather than opening index.html as a file.\n')
print(f'Packaged {len(parser.files)} native TMT assets into {OUTPUT}')
