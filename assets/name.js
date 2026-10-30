// Restores Mahir's original English → Hindi → Gujarati scramble.
export function startName(){
 const el=document.getElementById('nameScramble');if(!el)return;
 const phrases=[['Mahir Patel','en'],['माहिर पटेल','hi'],['માહિર પટેલ','gu']],chars='!<>-_\\/[]{}—=+*^?#_____';
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const segment=typeof Intl.Segmenter==='function'?new Intl.Segmenter(undefined,{granularity:'grapheme'}):null;
 const split=s=>segment?[...segment.segment(s)].map(v=>v.segment):Array.from(s);
 let counter=0,timer,frame,active=true,queue=[],started=0,lastFrame=-1;
 function stop(){clearTimeout(timer);cancelAnimationFrame(frame)}
 function settle(){el.textContent=phrases[counter][0];el.lang=phrases[counter][1];el.dataset.language=el.lang;}
 function schedule(){stop();if(!active||document.hidden||reduce.matches)return;timer=setTimeout(next,3000)}
 function next(){if(!active||document.hidden||reduce.matches)return;const old=split(el.textContent);counter=(counter+1)%phrases.length;const to=split(phrases[counter][0]);el.lang=phrases[counter][1];el.dataset.language=el.lang;queue=Array.from({length:Math.max(old.length,to.length)},(_,i)=>{const start=Math.random()*40|0;return {from:old[i]||'',to:to[i]||'',start,end:start+(Math.random()*40|0),char:''}});started=performance.now();lastFrame=-1;frame=requestAnimationFrame(draw)}
 function draw(t){if(!active||document.hidden||reduce.matches){settle();return}const n=Math.floor((t-started)/16.67);if(n!==lastFrame){lastFrame=n;let complete=0;const frag=document.createDocumentFragment();for(const item of queue){if(n>=item.end){complete++;frag.append(document.createTextNode(item.to))}else if(n>=item.start){if(!item.char||Math.random()<.28)item.char=chars[Math.random()*chars.length|0];const dud=document.createElement('span');dud.className='name-dud';dud.textContent=item.char;frag.append(dud)}else frag.append(document.createTextNode(item.from))}el.replaceChildren(frag);if(complete===queue.length){settle();schedule();return}}frame=requestAnimationFrame(draw)}
 function resume(){stop();settle();schedule()}
 new IntersectionObserver(es=>{active=es[0].isIntersecting;resume()}).observe(el);
 document.addEventListener('visibilitychange',resume);reduce.addEventListener('change',()=>{if(reduce.matches)counter=0;resume()});settle();schedule();
}
