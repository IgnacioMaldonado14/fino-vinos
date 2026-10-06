"""Generate a self-contained index.html from the running Next.js app.
Requires Python Playwright and Chromium; production development remains Next.js.
"""
import base64
import json
import mimetypes
import re
import subprocess
import urllib.parse
import urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = 'http://localhost:3000'
CACHE = {}

def embed_url(url):
    url = urllib.parse.urljoin(BASE, url)
    if url in CACHE:
        return CACHE[url]
    parts=urllib.parse.urlsplit(url)
    original=urllib.parse.parse_qs(parts.query).get('url',[''])[0] if parts.path=='/_next/image' else ''
    if original.startswith('/wines/') or original=='/images/ilustracion-fino.png':
        path=ROOT/'public'/original.lstrip('/')
        mime=mimetypes.guess_type(path)[0] or 'image/webp'
        CACHE[url]=f'data:{mime};base64,'+base64.b64encode(path.read_bytes()).decode('ascii')
        return CACHE[url]
    with urllib.request.urlopen(url, timeout=40) as response:
        encoded = base64.b64encode(response.read()).decode('ascii')
        content_type = response.headers.get_content_type()
    CACHE[url] = f'data:{content_type};base64,{encoded}'
    return CACHE[url]

wines = json.loads(subprocess.check_output(['node', '-e', "import('./data/wines.ts').then(d=>process.stdout.write(JSON.stringify(d.wines)))"], cwd=ROOT, text=True))
for wine in wines:
    path = ROOT / 'public' / wine['image'].lstrip('/')
    mime = mimetypes.guess_type(path)[0] or 'image/webp'
    wine['image'] = f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode('ascii')
name_to_id = {w['name']: w['id'] for w in wines}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':1440,'height':1000}, reduced_motion='reduce')
    page.goto(BASE, wait_until='networkidle', timeout=60000)
    page.evaluate('document.fonts.ready')
    styles = []
    for css_url in page.locator('link[rel=stylesheet]').evaluate_all('(els)=>els.map(e=>e.href)'):
        with urllib.request.urlopen(css_url) as response:
            css = response.read().decode('utf-8')
        def replace_url(match):
            url = match.group(1).strip('"\'')
            if url.startswith('data:') or url.startswith('#'):
                return match.group(0)
            return 'url("' + embed_url(urllib.parse.urljoin(css_url, url)) + '")'
        styles.append(re.sub(r'url\(([^)]+)\)', replace_url, css))

    def clean_images_and_ids():
        for image in page.locator('img').all():
            src = image.get_attribute('src')
            if not src or src.startswith('data:'):
                continue
            image.evaluate('(el,src)=>{el.src=src;el.removeAttribute("srcset");el.removeAttribute("sizes");el.removeAttribute("fetchpriority");}', embed_url(src))
        for card in page.locator('.wine-card').all():
            name = card.locator('h3').inner_text()
            card.evaluate('(el,id)=>el.dataset.wineId=id', name_to_id[name])

    clean_images_and_ids()
    body = page.evaluate('''() => {
      const clone=document.body.cloneNode(true);
      clone.querySelectorAll('script,nextjs-portal').forEach(e=>e.remove());
      clone.querySelectorAll('a[href^="/#"]').forEach(e=>e.setAttribute('href',e.getAttribute('href').slice(1)));
      clone.querySelectorAll('.toast-zone').forEach(e=>e.replaceChildren());
      clone.querySelectorAll('.cart-dialog .dialog-inner').forEach(e=>{
        const head=e.querySelector('.dialog-head');e.replaceChildren(head);
        const content=document.createElement('div');content.className='preview-cart-content';e.appendChild(content);
      });
      return clone.innerHTML;
    }''')
    panels = {}
    for id in ['tintos','blancos','rosados','espumantes']:
        page.locator('#tab-'+id).click()
        more = page.locator('#category-panel .load-more')
        if more.count(): more.click()
        clean_images_and_ids()
        panels[id] = page.locator('#category-panel').evaluate('(el)=>el.outerHTML')
    browser.close()

details = '<dialog id="preview-wine-dialog" class="dialog preview-detail-dialog" aria-labelledby="preview-wine-title"><div class="dialog-inner"><div class="dialog-head"><h2 id="preview-wine-title">Descubrir vino</h2><button class="icon-button" data-close-dialog aria-label="Cerrar detalle del vino" autofocus>×</button></div><div class="preview-wine-content"></div></div></dialog>'
extra_css = '''[hidden]{display:none!important}.preview-cart-content{display:flex;flex-direction:column;flex:1;min-height:0}.preview-detail-dialog{width:650px;max-height:90dvh;border-radius:6px;overflow:auto}.preview-wine-content{padding:25px 30px 35px}.preview-detail-photo{height:280px;background:var(--cream);margin-bottom:25px;display:grid;place-items:center;border-radius:100px 100px 4px 4px}.preview-detail-photo img{height:260px;width:120px;object-fit:contain}.preview-wine-content .detail-description{font-size:24px}.preview-wine-content .detail-facts{font-size:11px}.preview-wine-content>.fine-print{margin-top:10px}.preview-detail-dialog h2{font-size:31px}.preview-cart-content .cart-summary .text-link{width:100%;border:0;background:transparent}.preview-cart-content .cart-summary>.button{width:100%;justify-content:space-between}@media(max-width:700px){.preview-detail-dialog{width:calc(100vw - 24px);max-height:90dvh}.preview-wine-content{padding:20px}.preview-detail-dialog h2{font-size:28px}.preview-detail-dialog .quick-add{flex-wrap:wrap}.preview-detail-dialog .add-button{flex-basis:100%}}'''
data = json.dumps({'wines':wines,'panels':panels},ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
js = (ROOT/'scripts/preview-interactions.js').read_text()
html = '<!DOCTYPE html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Fino · Elegí tu próximo brindis</title><meta name="description" content="Vista previa de Fino: tintos, blancos, rosados, espumantes y origen del vino."><style>' + '\n'.join(styles) + extra_css + '</style></head><body>' + body + details + '<script type="application/json" id="fino-preview-data">' + data + '</script><script>' + js + '</script></body></html>'
(ROOT/'index.html').write_text(html)
print(f'index.html generated: {len(html.encode()):,} bytes; {len(wines)} wines, {len(panels)} categories, embedded fonts and images.')
