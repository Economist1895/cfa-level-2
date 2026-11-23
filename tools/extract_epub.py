"""Extract CFA ePub modules to plain text with linearised MathML.
Usage: python3 -I tools/extract_epub.py <epub> <outdir>
   e.g. for v in 1 2 3 4 5 6 7 8 9 10; do python3 -I tools/extract_epub.py cfa-program2027L2V$v.ePub source/v$(printf %02d $v); done"""
import sys, zipfile, re, os
import xml.etree.ElementTree as ET

def local(t): return t.split('}')[-1] if '}' in t else t

def math(el):
    tag = local(el.tag); ch = list(el)
    m = lambda e: math(e)
    if tag in ('mi','mn','mo','mtext','ms'):
        t = (el.text or '').strip()
        return {'−':'-','∑':'Σ','⋅':'·','×':'×'}.get(t, t)
    if tag == 'mfrac' and len(ch)==2: return f"({m(ch[0])})/({m(ch[1])})"
    if tag == 'msub' and len(ch)==2: return f"{m(ch[0])}_{{{m(ch[1])}}}"
    if tag == 'msup' and len(ch)==2: return f"{m(ch[0])}^{{{m(ch[1])}}}"
    if tag == 'msubsup' and len(ch)==3: return f"{m(ch[0])}_{{{m(ch[1])}}}^{{{m(ch[2])}}}"
    if tag in ('munderover',) and len(ch)==3: return f"{m(ch[0])}[{m(ch[1])}→{m(ch[2])}]"
    if tag in ('munder',) and len(ch)==2: return f"{m(ch[0])}[{m(ch[1])}]"
    if tag in ('mover',) and len(ch)==2: return f"{m(ch[0])}^({m(ch[1])})"
    if tag == 'msqrt': return "√(" + ''.join(m(c) for c in ch) + ")"
    if tag == 'mroot' and len(ch)==2: return f"root{m(ch[1])}({m(ch[0])})"
    if tag == 'mtable': return ' ; '.join(m(c) for c in ch)
    if tag == 'mtr': return ' '.join(m(c) for c in ch)
    if tag == 'annotation' or tag == 'annotation-xml': return ''
    if tag == 'semantics': return m(ch[0]) if ch else ''
    return ''.join(m(c) for c in ch)

BLOCK = {'p','div','h1','h2','h3','h4','h5','h6','li','tr','section','table','blockquote','figcaption','dt','dd','caption'}
def text(el, out, cell=False):
    tag = local(el.tag)
    if tag in ('script','style','head'): return
    if tag == 'math':
        out.append(' ⟦' + math(el) + '⟧ ')
        if el.tail: out.append(el.tail)
        return
    if tag in ('td','th'):
        sub=[]
        if el.text: sub.append(el.text)
        for c in el: text(c, sub, True)
        v=' '.join(''.join(sub).split())
        out.append(' | ' + v if v else ' |')
        if el.tail and el.tail.strip(): out.append(el.tail)
        return
    blk = tag in BLOCK and not cell and tag != 'tr'
    if tag == 'tr': out.append('\n')
    elif tag in ('h1','h2','h3','h4','h5','h6') and not cell: out.append('\n\n' + '#'*int(tag[1]) + ' ')
    elif blk: out.append('\n')
    elif cell and tag in BLOCK: out.append(' ')
    if tag == 'li': out.append('- ')
    if el.text: out.append(el.text)
    for c in el: text(c, out, cell)
    if blk or tag == 'tr': out.append('\n')
    if el.tail: out.append(el.tail)

def conv(data):
    data = re.sub(rb'<!DOCTYPE[^>]*>', b'', data)
    root = ET.fromstring(data)
    out=[]; text(root, out)
    s = ''.join(out)
    s = re.sub(r'[ \t ]+', ' ', s); s = re.sub(r'\n\s*\n\s*\n+', '\n\n', s)
    return s.strip()

epub, outdir = sys.argv[1], sys.argv[2]
os.makedirs(outdir, exist_ok=True)
z = zipfile.ZipFile(epub)
names = z.namelist()
for n in names:
    mm = re.match(r'OEBPS/(.+)-R_(CFA\d+)\.xhtml$', n)
    if not mm: continue
    title, code = mm.groups()
    parts = []
    for suffix, label in [(f'{title}-L_{code}-L-s01.xhtml','LEARNING OUTCOMES'),(f'{title}-R_{code}.xhtml','READING'),
                          (f'{code}-eorq-q.xhtml','PRACTICE QUESTIONS'),(f'{code}-eorq-a.xhtml','PRACTICE ANSWERS')]:
        p = 'OEBPS/'+suffix
        if p in names:
            parts.append(f'\n\n======== {label} ========\n\n' + conv(z.read(p)))
    fn = os.path.join(outdir, f'{code}-{title}.txt')
    open(fn,'w').write(''.join(parts))
    print(fn, os.path.getsize(fn))
