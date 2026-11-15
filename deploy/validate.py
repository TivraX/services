"""Dependency-free checks for the buildless static deploy artifact."""
from html.parser import HTMLParser
from pathlib import Path
import sys
root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / 'dist'
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.assets = []; self.ids = []; self.lang = False
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs: self.ids.append(attrs['id'])
        if tag == 'html': self.lang = bool(attrs.get('lang'))
        if tag == 'script' and attrs.get('src'): self.assets.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') == 'stylesheet': self.assets.append(attrs['href'])
page = Page(); page.feed((root / 'index.html').read_text(encoding='utf-8'))
assert page.lang, 'Page language is required'
assert len(page.ids) == len(set(page.ids)), 'Duplicate HTML IDs'
for asset in page.assets:
    if asset.startswith(('https://', 'data:')): continue
    target = (root / asset).resolve()
    assert target.is_relative_to(root.resolve()) and target.is_file(), f'Missing/invalid asset: {asset}'
for file in root.rglob('*'):
    assert not file.is_symlink(), f'Symlink in static output: {file}'
    if file.is_file():
        assert not file.name.startswith('.'), f'Hidden file in static output: {file}'
        assert file.suffix.lower() not in ['.pem', '.key', '.p12', '.env'], f'Credential file in static output: {file}'
assert 'language-select' in page.ids, 'Language selector missing'
assert '88878 15793' in (root / 'index.html').read_text(encoding='utf-8'), 'Footer phone missing'
print(f'Static validation passed: {len(page.assets)} referenced assets, {len(page.ids)} unique IDs')