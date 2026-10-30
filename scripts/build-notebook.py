"""Validate owner-published entries and build the static GitHub Pages artifact."""
from pathlib import Path
import datetime,json,re,shutil,argparse

def validate(p):
    if p.stat().st_size>100_000: raise ValueError(f'{p.name}: entry too large')
    if not re.fullmatch(r'[a-z0-9-]{1,140}',p.stem): raise ValueError(f'{p.name}: invalid filename')
    d=json.loads(p.read_text())
    if not isinstance(d,dict): raise ValueError(f'{p.name}: expected an object')
    for key,limit in [('title',140),('body',20000)]:
        if not isinstance(d.get(key),str) or not d[key].strip() or len(d[key])>limit: raise ValueError(f'{p.name}: invalid {key}')
    datetime.date.fromisoformat(d['date'])
    if not isinstance(d.get('tags',[]),list) or len(d.get('tags',[]))>8 or any(not isinstance(t,str) or len(t)>180 for t in d.get('tags',[])): raise ValueError(f'{p.name}: invalid tags')
    if not isinstance(d.get('media',[]),list) or len(d.get('media',[]))>12: raise ValueError(f'{p.name}: invalid media')
    for m in d.get('media',[]):
        if m.get('type') not in ['image','video','youtube'] or not isinstance(m.get('url'),str) or not m['url'].startswith(('https://','http://')) or not isinstance(m.get('caption',''),str): raise ValueError(f'{p.name}: invalid media item')
    return {'id':p.stem,'date':d['date'],'title':d['title'],'excerpt':re.sub(r'\s+',' ',d['body'].replace('#','')).strip()[:190],'tags':d.get('tags',[])}

def build(source,output):
    if source.resolve()==output.resolve() or source.resolve().is_relative_to(output.resolve()): raise ValueError('The output must not replace the source or its parent directories.')
    if output.name!='_site': raise ValueError('Use a dedicated _site output folder.')
    if output.exists(): shutil.rmtree(output)
    output.mkdir(parents=True)
    for p in source.glob('*.html'): shutil.copy2(p,output/p.name)
    for name in ['assets','projects','notebook']:
        if (source/name).exists(): shutil.copytree(source/name,output/name)
    entries=source/'notebook/entries'; posts=[validate(p) for p in entries.glob('*.json') if p.name!='index.json']
    posts.sort(key=lambda d:(d['date'],d['id']),reverse=True)
    (output/'notebook/entries/index.json').write_text(json.dumps(posts,ensure_ascii=False,indent=2)+'\n')
    (output/'.nojekyll').touch()
    print(f'Built {len(list(output.glob("*.html")))} root pages and {len(posts)} notebook entries in {output}')

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--source',type=Path,default=Path(__file__).resolve().parent.parent);parser.add_argument('--output',type=Path);args=parser.parse_args();build(args.source,args.output or args.source/'_site')
