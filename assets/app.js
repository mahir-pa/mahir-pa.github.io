(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)');const base=new URL('.',document.currentScript.src);
document.addEventListener('visibilitychange',()=>root.classList.toggle('motion-paused',document.hidden));const hero=$('.hero');if(hero)new IntersectionObserver(es=>hero.classList.toggle('motion-paused',!es[0].isIntersecting)).observe(hero);
const theme=$('.theme-switch');function syncTheme(){let light=root.dataset.theme!=='dark';theme.setAttribute('aria-checked',String(light));theme.setAttribute('aria-label',light?'Lights on':'Lights off');$('.switch-label').textContent=light?'LIGHTS ON':'LIGHTS OFF'}syncTheme();theme.onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('workbench-theme',root.dataset.theme)}catch{}syncTheme()};
// Actual KiCad board explorer; independent of unrelated portfolio interactions.
if($('#board-scene')){import(new URL('board.js',base)).then(m=>m.startBoard()).catch(()=>{$('.scene-caption').textContent='STATIC PCB VIEW · OPEN THE SCHEMATIC BELOW';document.querySelector('#board-select').onchange=e=>{document.querySelector('.board-fallback').src=new URL('pcb/'+e.target.value+'-front.svg',base);document.querySelector('#component-link').href=new URL('pcb/'+e.target.value+'-schematic.svg',base)};});}
if($('#nameScramble'))import(new URL('name.js',base)).then(m=>m.startName()).catch(()=>{});
import(new URL('field.js',base)).then(m=>m.startField()).catch(()=>{});
$$('[data-filter]').forEach(b=>b.onclick=()=>{$$('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});let n=0;$$('.work-card').forEach(c=>{c.hidden=b.dataset.filter!=='all'&&c.dataset.category!==b.dataset.filter;if(!c.hidden)n++});$('.filter-status').textContent=`Showing ${n} project${n===1?'':'s'}`});
// Function and signal laboratory.
if($('#scope'))import(new URL('scope.js',base)).then(m=>m.startScope()).catch(()=>{});
if($('#journal-list')||$('#journal-article'))import(new URL('notebook.js',base)).then(m=>m.startNotebook()).catch(()=>{});
// Keep readable content in the document; reveal only nearby sections.
if(!reduce.matches){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('waiting');io.unobserve(e.target)}}),{threshold:.06});$$('.work-card,.experience-list article,.notebook-hubs>a').forEach(el=>{el.classList.add('reveal','waiting');io.observe(el)})}
// The record collection is shared by the homepage and every notebook page.
import(new URL('music.js?v=catalog-2',base)).then(m=>m.startMusic()).catch(()=>{});
})();
