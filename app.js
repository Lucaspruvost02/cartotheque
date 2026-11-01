/* Cartothèque — logique de l'application */

/* ============================ OUTILS ============================ */
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today = ()=>fmt(new Date());
const addDays = (ds,n)=>{const [y,m,d]=ds.split('-').map(Number);return fmt(new Date(y,m-1,d+n));};
const shuffle = a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const pick = a=>a[Math.floor(Math.random()*a.length)];
function seeded(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}
  return ()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296;};}
const hashN = s=>{let h=7;for(const x of s)h=(h*31+x.charCodeAt(0))|0;return Math.abs(h);};
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const norm = s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\(.*?\)/g,'').replace(/[’']/g,"'").replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
function lev(a,b){ const m=a.length,n=b.length; if(!m) return n; if(!n) return m; let p=[...Array(n+1).keys()];
  for(let i=1;i<=m;i++){ const c=[i]; for(let j=1;j<=n;j++) c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1)); p=c; } return p[n]; }
const ART = /^(to|the|a|an|el|la|los|las|un|una) /;
function checkTyped(input, answer){
  const u=norm(input); if(!u) return 'no';
  const exp=x=>[x, x.replace(ART,''), x.replace(/'m /g,' am ').replace(/n't /g,' not ').replace(/'s /g,' is ')];
  const alts=answer.split(/\s*[\/→]\s*/).map(norm).filter(Boolean).flatMap(exp), cand=exp(u);
  if(cand.some(x=>alts.includes(x))) return 'ok';
  if(alts.some(a=>{ const tol=a.length>=12?2:a.length>=5?1:0; return cand.some(x=>lev(a,x)<=tol); })) return 'near';
  return 'no';
}
function shade(hex,amt){ const n=parseInt(hex.slice(1),16); let r=n>>16,g=n>>8&255,b=n&255;
  const t=amt<0?0:255, p=Math.abs(amt); r=Math.round(r+(t-r)*p); g=Math.round(g+(t-g)*p); b=Math.round(b+(t-b)*p);
  return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1); }
const lum = hex=>{ const n=parseInt(hex.slice(1),16); return (0.299*(n>>16)+0.587*(n>>8&255)+0.114*(n&255))/255; };

if(typeof PHOTOS!=='undefined') DOMAINS.forEach(d=>d.coll.forEach(c=>{ const p=PHOTOS[c.id]; if(p){ c.img=p.img; c.credit=p.credit; c.src=p.src; } }));

/* ============================ ÉTAT ============================ */
const KEY='cartotheque.v1';
const DEF = ()=>({xp:0, coins:150, packs:2, streak:0, best:0, lastGoal:null, hist:[], freezes:0, goal:50, sound:true, theme:'auto',
  day:null, daily:{}, quests:[], chest:false, stars:{}, srs:{}, coll:{}, serial:{}, custom:[], badges:{}, lastCh:null, lvl:{}, scanLang:'en',
  records:{}, spinDay:null, boostUntil:0,
  stats:{lessons:0, correct:0, wrong:0, packs:0, bestCombo:0, scans:0, duels:0, duelWins:0}, level:1, v:3});
let S;
try{ S = Object.assign(DEF(), JSON.parse(localStorage.getItem(KEY)||'{}')); }catch(e){ S = DEF(); }
S.stats = Object.assign(DEF().stats, S.stats); S.lvl=S.lvl||{}; S.serial=S.serial||{}; S.records=S.records||{};
if((S.v||1)<3){ S.v=3; S.packs+=1; }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
const UI = {tab:'home', dom:null, dtab:'path', cards:'coll', collDom:'all', group:'team', learnCat:'Tous', shopDom:'fo', gameDom:'lo', duelDom:'fo', confirmReset:false, scan:{}};
function applyTheme(){ const r=document.documentElement; if(S.theme==='auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme',S.theme); }
applyTheme();

function newDay(){
  const t=today(); if(S.day===t) return;
  if(S.lastGoal && S.lastGoal<addDays(t,-1) && S.streak>0){
    if(S.freezes>0 && S.lastGoal===addDays(t,-2)){ S.freezes--; S.lastGoal=addDays(t,-1); queueToast('Gel de série utilisé : ta série est sauvée'); }
    else S.streak=0;
  }
  S.day=t; S.chest=false;
  S.daily={xp:0, lessons:0, maxCombo:0, perfect:0, review:0, memory:0, correct:0, typed:0, games:0, rgames:0};
  const r=seeded(t), pool=QPOOL.slice(), qs=[];
  while(qs.length<3){ const q=pool.splice(Math.floor(r()*pool.length),1)[0]; const n=q.n[Math.floor(r()*q.n.length)]; qs.push({t:q.t,n,txt:q.txt(n),r:q.r,claimed:false}); }
  S.quests=qs; save();
}

function domains(){
  return DOMAINS.concat(S.custom.map(c=>{
    const chunks=[]; for(let i=0;i<c.items.length;i+=8) chunks.push(c.items.slice(i,i+8));
    if(chunks.length>1 && chunks[chunks.length-1].length<4){ const last=chunks.pop(); chunks[chunks.length-1]=chunks[chunks.length-1].concat(last); }
    if(!chunks.length) chunks.push([]);
    return {id:c.id, cat:'Mes domaines', name:c.name, icon:c.icon, c:'#8a5bd6', lang:c.lang||null, custom:true, coll:[],
      levels:[{name:'Parcours', chapters:chunks.map((it,i)=>ch(c.id+'-'+(i+1),'Série '+(i+1),it))}]};
  }));
}
const getDom = id=>domains().find(d=>d.id===id);
const lvlIdx = d=>Math.min(d.levels.length-1, S.lvl[d.id] ?? d.defLvl ?? 0);
const allCh = d=>d.levels.flatMap((l,li)=>l.chapters.map(c=>Object.assign(c,{li})));
function findCh(id){ for(const d of domains()) for(const c of allCh(d)) if(c.id===id) return {d,c}; return null; }
function itemMap(){ const m={}; domains().forEach(d=>allCh(d).forEach(c=>c.items.forEach((it,i)=>{m[c.id+':'+i]={k:c.id+':'+i,q:it[0],a:it[1],ch:c,d};}))); return m; }
const allItems = d=>allCh(d).flatMap(c=>c.items.map((it,i)=>({k:c.id+':'+i,q:it[0],a:it[1],ch:c,d})));
const allColl = ()=>DOMAINS.flatMap(d=>d.coll);
const ownedIn = d=>d.coll.filter(c=>S.coll[c.id]).length;
function chapterState(d, chs, idx){
  const c=chs[idx], stars=S.stars[c.id]||0;
  if(c.items.length<4) return {open:false, stars, why:`Ajoute encore ${4-c.items.length} carte${4-c.items.length>1?'s':''} pour jouer`};
  if(idx>0 && (S.stars[chs[idx-1].id]||0)<1) return {open:false, stars, why:'Termine le chapitre précédent'};
  if(c.boss && d.coll.length && ownedIn(d)<BOSS_NEED) return {open:false, stars, why:`Boss : il te faut ${BOSS_NEED} cartes ${d.name} (${ownedIn(d)}/${BOSS_NEED})`};
  return {open:true, stars};
}
function lvlInfo(xp){ let n=1, need=100, base=0; while(xp>=base+need){ base+=need; n++; need=100+(n-1)*50; } return {n, cur:xp-base, need}; }
function dueKeys(){ const t=today(), m=itemMap(); return Object.keys(S.srs).filter(k=>m[k] && S.srs[k].due<=t); }
const boostOn = ()=>Date.now()<(S.boostUntil||0);

/* ============================ SON, VOIX, EFFETS ============================ */
let AC=null;
function tone(seq){ if(!S.sound) return; try{
  AC = AC || new (window.AudioContext||window.webkitAudioContext)();
  let t=AC.currentTime;
  seq.forEach(([f,d,type='triangle',v=.12,gap])=>{ const o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.value=f;
    g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.0001,t+d); o.connect(g).connect(AC.destination); o.start(t); o.stop(t+d); t+=gap??d*.8; });
}catch(e){} }
const SFX = {good:()=>tone([[660,.09],[990,.16]]), bad:()=>tone([[220,.18,'sawtooth',.06],[165,.22,'sawtooth',.05]]),
  flip:()=>tone([[1200,.04,'square',.03]]), win:()=>tone([[523,.12],[659,.12],[784,.12],[1047,.3]]),
  coin:()=>tone([[1320,.06,'square',.04],[1760,.12,'square',.04]]), rare:()=>tone([[784,.1],[988,.1],[1319,.1],[1568,.35]]),
  boom:()=>tone([[90,.5,'sine',.3,0],[60,.7,'sine',.25,.05]]),
  rise:()=>tone([[220,.16,'sawtooth',.04],[277,.16,'sawtooth',.04],[330,.16,'sawtooth',.04],[440,.16,'sawtooth',.05],[554,.16,'sawtooth',.05],[659,.4,'triangle',.12]]),
  tick:()=>tone([[1800,.03,'square',.03]])};
const canSpeak = 'speechSynthesis' in window;
function speak(text, lang){ try{ if(!canSpeak) return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang=lang; u.rate=.92; speechSynthesis.speak(u); }catch(e){} }

const fx=$('#fx'), ctx=fx.getContext('2d'); let parts=[], fxRun=false;
function confetti(n=120, colors=['#374df5','#0fa968','#e9a100','#ff6b2c','#a35bff','#e5383b','#ffffff']){
  if(reduced) return;
  fx.width=innerWidth*devicePixelRatio; fx.height=innerHeight*devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  for(let i=0;i<n;i++) parts.push({x:innerWidth/2+(Math.random()-.5)*80, y:innerHeight*.4, vx:(Math.random()-.5)*14, vy:-Math.random()*13-4, r:Math.random()*6+4, c:pick(colors), a:Math.random()*6, va:(Math.random()-.5)*.3, life:110+Math.random()*60});
  if(!fxRun){ fxRun=true; requestAnimationFrame(tick); }
}
function tick(){ ctx.clearRect(0,0,innerWidth,innerHeight);
  parts=parts.filter(p=>p.life-->0); parts.forEach(p=>{ p.vy+=.35; p.vx*=.99; p.x+=p.vx; p.y+=p.vy; p.a+=p.va;
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.fillStyle=p.c; ctx.globalAlpha=Math.min(1,p.life/40); ctx.fillRect(-p.r/2,-p.r/4,p.r,p.r/2); ctx.restore(); });
  if(parts.length) requestAnimationFrame(tick); else { fxRun=false; ctx.clearRect(0,0,innerWidth,innerHeight); } }
let pendingToasts=[];
const queueToast = m=>pendingToasts.push(m);
function toast(msg){ const el=document.createElement('div'); el.className='toast'; el.textContent=msg; $('#toasts').appendChild(el); setTimeout(()=>el.remove(),3300); }
function flushToasts(){ pendingToasts.forEach((m,i)=>setTimeout(()=>toast(m),i*700)); pendingToasts=[]; }
function floatXP(text, x, y){ const el=document.createElement('div'); el.className='floatxp'; el.textContent=text; el.style.left=(x-20)+'px'; el.style.top=(y-20)+'px'; document.body.appendChild(el); setTimeout(()=>el.remove(),1000); }
function flash(color){ if(reduced) return; const f=document.createElement('div'); f.className='flash'; f.style.setProperty('--fc',color); document.body.appendChild(f); setTimeout(()=>f.remove(),700); }

/* ============================ PROGRESSION ============================ */
function gainXP(n){
  if(boostOn()) n*=2;
  S.xp+=n; S.daily.xp+=n;
  const t=today();
  if(S.daily.xp>=S.goal && S.lastGoal!==t){
    S.streak = S.lastGoal===addDays(t,-1) ? S.streak+1 : 1;
    S.best=Math.max(S.best,S.streak); S.lastGoal=t; S.hist=(S.hist||[]).concat(t).slice(-60);
    queueToast(`Objectif du jour atteint · série de ${S.streak} jour${S.streak>1?'s':''}`);
  }
  const L=lvlInfo(S.xp).n;
  if(L>S.level){ S.packs+=L-S.level; queueToast(`Niveau ${L} ! Un booster offert`); S.level=L; }
  return n;
}
function checkBadges(){
  const give=id=>{ const b=BADGES.find(x=>x.id===id); if(b && !S.badges[id]){ S.badges[id]=today(); queueToast(`Badge débloqué : ${b.n}`); } };
  if(S.stats.lessons>=1) give('first');
  if(Object.values(S.stars).some(s=>s>=3)) give('perfect');
  if(S.stats.bestCombo>=10) give('combo10');
  if(S.streak>=3) give('streak3');
  if(S.streak>=7) give('streak7');
  const owned=allColl().filter(c=>S.coll[c.id]);
  if(owned.length>=10) give('coll10');
  if(owned.some(c=>c.r==='l')) give('legend');
  if(owned.some(c=>c.r==='i')) give('icon');
  if(DOMAINS.some(d=>allCh(d).some(c=>c.boss && S.stars[c.id]>=1))) give('boss');
  if(DOMAINS.some(d=>d.levels.length>2 && d.levels[d.levels.length-1].chapters.some(c=>S.stars[c.id]>=1))) give('advanced');
  const dStar=id=>allCh(getDom(id)).some(c=>S.stars[c.id]>=1);
  if(dStar('en') && dStar('es')) give('polyglot');
  if(S.stats.scans>=1) give('scanner');
  if(S.custom.some(c=>!c.photo)) give('creator');
  if(S.stats.duelWins>=1) give('gamer');
  if(Object.entries(S.records).some(([k,v])=>k.startsWith('blitz')&&v>=20)) give('blitz20');
  if(S.xp>=1000) give('xp1000');
}
const qProgress = q=>Math.min(q.n, S.daily[q.t]||0);
function grantCard(c){ const isNew=!S.coll[c.id]; S.coll[c.id]=(S.coll[c.id]||0)+1; if(!S.serial[c.id]) S.serial[c.id]=1+Math.floor(Math.random()*RAR[c.r].sup); return isNew; }

/* ============================ ICÔNES ============================ */
const sv = p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const IC = {
 fire:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s5 4.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 1-3.5S9 11 11 11c0-4 1-9 1-9zm0 20a7 7 0 0 0 7-7c0-1.6-.4-3-1-4.2.1 3.4-2.4 5.2-4 5.2.6-2-.5-4-2-5 0 2.5-4 3.5-4 6a4 4 0 0 0 4 5z"/></svg>',
 coin:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 7v10M9.5 9.5h3.5a1.5 1.5 0 0 1 0 3h-2a1.5 1.5 0 0 0 0 3H14.5" fill="none" stroke="#3a2500" stroke-width="1.6" stroke-linecap="round" opacity=".55"/></svg>',
 home:sv('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
 learn:sv('<path d="M4 19.5V5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2zm0 0A2 2 0 0 0 6 22h13v-4"/><path d="M9 7h6"/>'),
 games:sv('<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r=".6" fill="currentColor"/><circle cx="18" cy="13.5" r=".6" fill="currentColor"/>'),
 scan:sv('<path d="M3 8V6a3 3 0 0 1 3-3h2M16 3h2a3 3 0 0 1 3 3v2M21 16v2a3 3 0 0 1-3 3h-2M8 21H6a3 3 0 0 1-3-3v-2"/><circle cx="12" cy="12" r="3.5"/>'),
 cards:sv('<rect x="8" y="3" width="12" height="17" rx="2.5"/><path d="M5 6.5 4 7a2 2 0 0 0-.9 2.5l4.5 11"/>'),
 me:sv('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>'),
 camera:sv('<path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/>')
};
const coinSm = IC.coin.replace('<svg','<svg width="14" height="14" style="color:#e9a100"');

/* ============================ ÉCUSSONS & ILLUSTRATIONS ============================ */
function crestSVG(name){
  const t=TEAMS[name];
  if(!t){ const ini=String(name).split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
    return `<svg viewBox="0 0 24 28"><circle cx="12" cy="14" r="11" fill="#8a93a3"/><text x="12" y="17.5" text-anchor="middle" font-size="9" font-weight="800" fill="#fff" font-family="Figtree,sans-serif">${esc(ini)}</text></svg>`; }
  const ink=lum(t.c1)>.6?'#14161c':'#ffffff', fs=t.s.length>3?5.6:7.2;
  return `<svg viewBox="0 0 24 28"><path d="M12 1.2 22 4.2v8.6c0 7-4.6 11.6-10 13.9C6.6 24.4 2 19.8 2 12.8V4.2z" fill="${t.c1}" stroke="${t.c2}" stroke-width="1.6"/><path d="M2.8 9h18.4" stroke="${t.c2}" stroke-width="1.2" opacity=".7"/><text x="12" y="18.2" text-anchor="middle" font-size="${fs}" font-weight="900" fill="${ink}" font-family="Figtree,sans-serif">${esc(t.s)}</text></svg>`;
}
const crest = (name, flag)=> flag ? `<span class="crest flag">${flag}</span>` : `<span class="crest">${crestSVG(name)}</span>`;
function cardCols(c){
  if(c.r==='i') return ['#2b2147','#ffd27a'];
  if(c.team && TEAMS[c.team]) return [TEAMS[c.team].c1, TEAMS[c.team].c2];
  if(c.nat && NAT[c.nat]) return [NAT[c.nat][1], NAT[c.nat][2]];
  return [c.dom.c, '#ffffff'];
}
function playerArt(c){
  let [c1,c2]=cardCols(c); if(lum(c1)>.8) c1=shade(c1,-.18);
  const id='a'+c.id.replace(/\W/g,''), h=hashN(c.id), sport=c.dom.id, fem=c.pos==='ACTRICE'||c.pos==='WTA';
  const hair = fem ? 2 : sport==='te' ? (h%2?1:0) : h%4;
  const sil=`url(#${id}s)`;
  let body;
  if(sport==='ci'){
    body=`<path d="M18 280C20 196 52 160 100 152C148 160 180 196 182 280Z" fill="#14161d"/>
      <path d="M86 153 100 200 114 153Z" fill="#f1f1f1"/><path d="M86 153 70 200M114 153 130 200" stroke="${c1}" stroke-width="3" opacity=".8"/>
      <path d="M91 160 100 164 109 160V169L100 165 91 169Z" fill="${c2}"/>`;
  } else {
    const collar = sport==='nba' ? `<path d="M80 154Q100 176 120 154" fill="none" stroke="${c2}" stroke-width="6"/>`
      : sport==='te' ? `<path d="M86 152 96 170 100 158 104 170 114 152" fill="${shade(c1,.25)}" stroke="${c2}" stroke-width="2.5"/>`
      : `<path d="M84 153 100 178 116 153" fill="none" stroke="${c2}" stroke-width="6"/>`;
    const arms = sport==='nba' ? `<path d="M18 280C20 214 36 186 58 172L66 230 60 280Z" fill="${sil}"/><path d="M182 280C180 214 164 186 142 172L134 230 140 280Z" fill="${sil}"/>` : '';
    body=`${arms}<path d="${sport==='nba'?'M52 280C54 210 66 170 100 160C134 170 146 210 148 280Z':'M18 280C20 196 52 160 100 152C148 160 180 196 182 280Z'}" fill="url(#${id}j)"/>
      ${sport==='nba'?'':`<path d="M30 215C40 196 52 184 66 176" stroke="${c2}" stroke-width="5" opacity=".9"/><path d="M170 215C160 196 148 184 134 176" stroke="${c2}" stroke-width="5" opacity=".9"/>`}${collar}`;
  }
  const hairBack = hair===2 ? `<ellipse cx="100" cy="104" rx="37" ry="50" fill="${sil}"/>` : '';
  const hairFront = hair===0 ? `<path d="M73 86C73 58 127 58 127 86C121 71 79 71 73 86Z" fill="#05070b"/>`
    : hair===1 ? `<rect x="72" y="76" width="56" height="8" rx="3" fill="${c2}"/>`
    : hair===2 ? `<path d="M72 92C70 60 130 60 128 92C120 74 80 74 72 92Z" fill="#05070b"/>` : '';
  const prop={fo:'⚽',nba:'🏀',te:'🎾',ci:'🎬'}[sport]||'';
  return `<svg class="art" viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
    <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(c1,.08)}"/><stop offset=".55" stop-color="${c1}"/><stop offset="1" stop-color="${shade(c1,-.62)}"/></linearGradient>
    <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c1,-.62)}"/><stop offset=".55" stop-color="#151925"/><stop offset="1" stop-color="#07090e"/></linearGradient>
    <linearGradient id="${id}j" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(c1,.12)}"/><stop offset="1" stop-color="${shade(c1,-.45)}"/></linearGradient>
    <pattern id="${id}p" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(32)"><rect width="5" height="14" fill="#fff" opacity=".07"/></pattern></defs>
    <rect width="200" height="280" fill="url(#${id}b)"/>
    <g class="bgl"><rect x="-20" y="-20" width="240" height="320" fill="url(#${id}p)"/>
      <circle cx="100" cy="96" r="78" fill="${c2}" opacity=".22"/><circle cx="100" cy="96" r="52" fill="${c2}" opacity=".18"/>
      <text x="100" y="150" text-anchor="middle" font-family="Figtree,sans-serif" font-weight="900" font-size="132" fill="#fff" opacity=".1">${c.ovr}</text>
      <path d="M-10 40 210 0M-10 70 210 30" stroke="#fff" stroke-width="2" opacity=".12"/></g>
    <g class="fig">${hairBack}${body}
      <rect x="88" y="114" width="24" height="42" rx="11" fill="${sil}"/>
      <ellipse cx="75" cy="95" rx="4" ry="7" fill="${sil}"/><ellipse cx="125" cy="95" rx="4" ry="7" fill="${sil}"/>
      <path d="M100 60C116 60 126 72 126 90C126 108 116 123 100 125C84 123 74 108 74 90C74 72 84 60 100 60Z" fill="${sil}"/>${hairFront}
      <path d="M74 104A27 33 0 0 1 100 59" fill="none" stroke="${c2}" stroke-width="2.5" opacity=".75"/>
      <path d="M26 235C30 196 56 168 90 157" fill="none" stroke="${c2}" stroke-width="2.5" opacity=".55"/></g>
    <text x="178" y="138" text-anchor="end" font-size="22" opacity=".9">${prop}</text></svg>`;
}
function cardHTML(c, opts={}){
  if(!c) return `<div class="sc missing" style="--rc:transparent"><span class="q">?</span><div class="sc-foot"><small>À trouver</small><b>???</b></div></div>`;
  const tagN=opts.nobtn?'div':'button', n=S.coll[c.id]||0, rc=RAR[c.r].col;
  const [c1]=cardCols(c);
  const art = c.img ? `<div class="sc-photo"><img src="${esc(c.img)}" alt="" loading="lazy"></div>` : c.ovr ? playerArt(c) : `<div class="sc-obj" style="--c1:${c.dom.c}"><span>${c.art}</span></div>`;
  const cr = c.ovr ? (c.team&&TEAMS[c.team] ? crestSVG(c.team) : `<span class="flag">${c.r==='i'?'🌟':c.nat}</span>`) : `<span class="flag">${c.dom.icon}</span>`;
  const parts=c.n.split(' '), first=parts.length>1?parts.slice(0,-1).join(' '):'', last=parts.length>1?parts[parts.length-1]:c.n;
  const ser=S.serial[c.id], sup=RAR[c.r].sup;
  const meta = c.ovr ? `<span class="sc-ovr">${c.ovr}</span><span>${esc(c.pos)}</span><span class="sc-serial">${ser?`${ser}/${sup}`:SEASON}</span>`
                     : `<span>${esc(c.dom.name)}</span><span class="sc-serial">${ser?`${ser}/${sup}`:''}</span>`;
  return `<${tagN} class="sc r-${c.r}" style="--rc:${rc};--c1:${c1}" ${opts.nobtn?'':`data-card="${c.id}" aria-label="${esc(c.n)}"`}>${art}
    <div class="sc-top"><span class="sc-badge"><i></i>${RAR[c.r].n}</span><span class="sc-crest">${cr}</span></div>
    ${opts.count&&n>1?`<span class="sc-cnt">×${n}</span>`:''}
    <div class="sc-foot"><small>${esc(first||(c.ovr?c.team||'':RAR[c.r].n))}</small><b style="font-size:${Math.min(12.5,104/Math.max(1,last.length)).toFixed(1)}cqw">${esc(last)}</b><div class="sc-meta">${meta}</div></div></${tagN}>`;
}
/* inclinaison 3D au doigt / à la souris */
document.addEventListener('pointermove', e=>{
  const sc=e.target.closest && e.target.closest('.sc:not(.missing)'); if(!sc || reduced) return;
  const r=sc.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
  sc.style.setProperty('--mx',(x*100)+'%'); sc.style.setProperty('--my',(y*100)+'%');
  sc.style.setProperty('--ry',((x-.5)*18)+'deg'); sc.style.setProperty('--rx',((.5-y)*18)+'deg');
  sc.style.setProperty('--px',((x-.5)*10).toFixed(1)); sc.style.setProperty('--py',((y-.5)*10).toFixed(1));
});
document.addEventListener('pointerout', e=>{ const sc=e.target.closest && e.target.closest('.sc'); if(sc && !sc.contains(e.relatedTarget)) ['--mx','--my','--rx','--ry','--px','--py'].forEach(p=>sc.style.removeProperty(p)); });

/* groupes « par équipe » */
function groupOf(c, mode){
  if(mode==='rar') return {k:RAR[c.r].n, ord:-RORDER.indexOf(c.r), icon:`<span class="crest flag" style="color:${RAR[c.r].col}">●</span>`, sub:''};
  if(mode==='dom') return {k:c.dom.name, ord:DOMAINS.indexOf(c.dom), icon:`<span class="crest flag">${c.dom.icon}</span>`, sub:''};
  if(c.r==='i') return {k:'Icônes · '+c.dom.name, ord:-1, icon:'<span class="crest flag">🌟</span>', sub:'Légendes'};
  if(c.team && TEAMS[c.team]) return {k:c.team, ord:0, icon:crest(c.team), sub:TEAMS[c.team].l};
  if(c.pos==='ATP'||c.pos==='WTA') return {k:'Circuit '+c.pos, ord:1, icon:'<span class="crest flag">🎾</span>', sub:'Tennis'};
  if(c.dom.id==='ci') return {k:'Cinéma · '+(NAT[c.nat]?NAT[c.nat][0]:'Monde'), ord:2, icon:crest(null,c.nat), sub:'Films & séries'};
  if(c.ovr) return {k:'Sélection · '+(NAT[c.nat]?NAT[c.nat][0]:''), ord:2, icon:crest(null,c.nat), sub:c.dom.name+' · club non confirmé'};
  return {k:c.dom.name, ord:3, icon:`<span class="crest flag">${c.dom.icon}</span>`, sub:'Objets de collection'};
}
function groupedCards(list, mode){
  const g={};
  list.forEach(c=>{ const o=groupOf(c,mode); (g[o.k]=g[o.k]||{...o,items:[]}).items.push(c); });
  const own=x=>x.items.filter(c=>S.coll[c.id]).length;
  return Object.values(g).sort((a,b)=>a.ord-b.ord||own(b)-own(a)||a.k.localeCompare(b.k)).map(gr=>
    `<div class="group-h">${gr.icon}<b>${esc(gr.k)}${gr.sub?`<br><small>${esc(gr.sub)}</small>`:''}</b><small class="num">${own(gr)}/${gr.items.length}</small></div>
     <div class="cgrid">${sortColl(gr.items).map(c=>S.coll[c.id]?cardHTML(c,{count:true}):cardHTML(null)).join('')}</div>`).join('');
}
const sortColl = list=>list.slice().sort((a,b)=>(S.coll[b.id]?1:0)-(S.coll[a.id]?1:0)||RORDER.indexOf(b.r)-RORDER.indexOf(a.r)||(b.ovr||0)-(a.ovr||0));

/* lignes de match façon appli de scores */
function matchRows(d, limit){
  const ms=(d.matches||[]).slice(0,limit||99); let out='', last='';
  ms.forEach(m=>{
    if(m.comp!==last){ out+=`<div class="comp"><span>${COMP_ICON[m.comp]||d.icon}</span>${esc(m.comp)}</div>`; last=m.comp; }
    const wa = m.w ? m.w==='a' : m.sa>m.sb, wb = m.w ? m.w==='b' : m.sb>m.sa;
    out+=`<div class="match"><div class="m-time">${esc(m.d)}<br>Terminé</div>
      <div class="m-teams"><div class="${wa?'w':''}">${crest(m.a,m.fa)}<span>${esc(m.a)}</span></div><div class="${wb?'w':''}">${crest(m.b,m.fb)}<span>${esc(m.b)}</span></div></div>
      <div class="m-score"><span class="${wa?'w':''}">${m.sa??(wa?'✓':'')}</span><span class="${wb?'w':''}">${m.sb??(wb?'✓':'')}</span></div>
      ${m.note?`<div class="m-note">${esc(m.note)}</div>`:''}</div>`;
  });
  return out;
}

/* ============================ RENDU ============================ */
function render(){
  newDay();
  const li=lvlInfo(S.xp), bmin=Math.ceil(((S.boostUntil||0)-Date.now())/60000);
  $('#top').innerHTML = `<div class="logo"><i>C</i><span>Cartothèque</span></div>
    ${boostOn()?`<span class="pill boost" title="Bonus XP actif">XP ×2 · ${bmin} min</span>`:''}
    <span class="pill fire ${S.lastGoal===today()?'on':''}" title="Série de jours">${IC.fire}<span class="num">${S.streak}</span></span>
    <span class="pill coin" title="Pièces">${IC.coin}<span class="num">${S.coins}</span></span>
    <button class="avatar" data-tab="me" aria-label="Profil, niveau ${li.n}">${IC.me}</button>`;
  const qReady = S.quests.some(q=>!q.claimed&&qProgress(q)>=q.n)||(S.quests.every(q=>q.claimed)&&!S.chest);
  const tabs=[['home','Accueil',IC.home,qReady?'!':''],['learn','Apprendre',IC.learn,''],['games','Jeux',IC.games,S.spinDay!==today()?'1':''],['scan','Scanner',IC.scan,''],['cards','Cartes',IC.cards,S.packs||'']];
  $('#nav').innerHTML = tabs.map(([id,l,ic,b])=>`<button data-tab="${id}" ${UI.tab===id?'aria-current="page"':''}>${ic}${l}${b?`<span class="dot">${b}</span>`:''}</button>`).join('');
  const v=$('#view');
  v.innerHTML = ({home:vHome, learn:vLearn, games:vGames, scan:vScan, cards:vCards, me:vMe})[UI.tab]();
  v.style.animation='none'; void v.offsetWidth; v.style.animation='';
  if(UI.tab==='scan') bindScan();
  flushToasts();
}

function vHome(){
  const t=today(), pct=Math.min(1,S.daily.xp/S.goal), C=2*Math.PI*42;
  const days=['L','M','M','J','V','S','D'], dow=(new Date().getDay()+6)%7;
  const week=days.map((l,i)=>{ const ds=addDays(t,i-dow); return `<span class="${(S.hist||[]).includes(ds)?'on':''} ${i===dow?'now':''}"><i></i>${l}</span>`; }).join('');
  const qs=S.quests.map((q,i)=>{ const p=qProgress(q), done=p>=q.n;
    return `<div class="quest"><p>${esc(q.txt)}</p>
      ${q.claimed?'<span class="tag good">Réclamée</span>':done?`<button class="btn gold sm" data-claim="${i}">+${q.r} 🪙</button>`:`<span class="xs muted num">${p}/${q.n}</span>`}
      <div class="prog ${done?'good':''}"><i style="width:${p/q.n*100}%"></i></div></div>`; }).join('');
  const allClaimed=S.quests.every(q=>q.claimed);
  const due=dueKeys().length, seen=Object.keys(S.srs).length;
  const last=S.lastCh && findCh(S.lastCh);
  const fo=getDom('fo'), nba=getDom('nba');
  return `
  <section class="card today">
    <div class="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface-2)" stroke-width="10"/>
      <circle cx="50" cy="50" r="42" fill="none" stroke="${pct>=1?'var(--good)':'var(--pri)'}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct)}" style="transition:stroke-dashoffset .8s"/></svg>
      <b class="num">${Math.round(pct*100)}%</b></div>
    <div style="min-width:0"><p class="eyebrow">${new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</p>
      <h1 style="font-size:20px;margin-top:2px"><span class="num">${Math.min(S.daily.xp,S.goal)}</span> / <span class="num">${S.goal}</span> XP aujourd’hui</h1>
      <p class="small muted" style="margin:2px 0 0">${S.streak?`🔥 Série de ${S.streak} jour${S.streak>1?'s':''}`:'Atteins l’objectif pour lancer ta série'}</p>
      <div class="week">${week}</div></div></section>
  <div class="quick">
    <button class="qa main" data-go="continue"><span class="ic">▶</span><b>${last?'Continuer':'Commencer'}</b><small>${last?esc(last.c.name):'1re leçon'}</small></button>
    <button class="qa" data-review ${seen?'':'disabled'}><span class="ic">🔁</span><b>Réviser</b><small>${seen?(due?`${due} à revoir`:'Révision libre'):'Après une leçon'}</small></button>
    <button class="qa" data-wheel><span class="ic">🎡</span><b>Roue</b><small>${S.spinDay===t?'Demain':'1 tour gratuit'}</small></button>
  </div>
  ${S.packs?`<section class="card"><div class="offer"><div class="pack">🎁</div><div><b>${S.packs} booster${S.packs>1?'s':''} à ouvrir</b><br><small class="muted small">Joueurs, acteurs et objets de collection</small></div><button class="btn gold sm" data-open>Ouvrir</button></div></section>`:''}
  <section class="card"><div class="card-h"><h2>Quêtes du jour</h2><span class="xs faint">Nouvelles demain</span></div>${qs}
    <div class="offer"><div class="ic" style="background:var(--gold-soft)">🧰</div><div><b>Coffre du jour</b><br><small class="muted small">${S.chest?'Ouvert. Reviens demain !':allClaimed?'Toutes les quêtes sont faites !':'Réclame les 3 quêtes pour l’ouvrir'}</small></div>
    <button class="btn gold sm" data-chest ${allClaimed&&!S.chest?'':'disabled'}>Ouvrir</button></div></section>
  <section class="card"><div class="card-h"><h2>Derniers résultats</h2><button class="link" data-gores="fo">Voir tout</button></div>${matchRows(fo,3)}${matchRows(nba,2)}</section>`;
}

function vLearn(){
  if(UI.dom){ const d=getDom(UI.dom); if(d) return vDomain(d); UI.dom=null; }
  const ds=domains(), cats=['Tous',...CATS].concat(S.custom.length?['Mes domaines']:[]);
  const shown=ds.filter(d=>UI.learnCat==='Tous'||d.cat===UI.learnCat);
  const row=d=>{ const chs=allCh(d), done=chs.filter(c=>S.stars[c.id]).length, pc=Math.round(done/Math.max(1,chs.length)*100);
    return `<button class="list-row" data-dom="${d.id}"><span class="ic" style="background:color-mix(in srgb,${d.c} 16%,transparent)">${esc(d.icon)}</span>
      <span class="grow"><b>${esc(d.name)}</b><small>${d.levels.length>1?`Niveau ${esc(d.levels[lvlIdx(d)].name)} · `:''}${done}/${chs.length} chapitres${d.coll.length?` · ${ownedIn(d)}/${d.coll.length} cartes`:''}</small></span>
      <span class="num small" style="font-weight:800;color:${pc?'var(--good)':'var(--fg-3)'}">${pc}%</span><span class="chev">›</span></button>`; };
  const byCat = UI.learnCat==='Tous' ? CATS.concat(S.custom.length?['Mes domaines']:[]).map(cat=>{ const l=ds.filter(d=>d.cat===cat); return l.length?`<div class="comp">${cat}</div>${l.map(row).join('')}`:''; }).join('') : shown.map(row).join('');
  return `<h1 class="title">Apprendre</h1>
    <div class="chips">${cats.map(c=>`<button data-lcat="${c}" aria-pressed="${UI.learnCat===c}">${c}</button>`).join('')}</div>
    <section class="card">${byCat}</section>
    <section class="card"><button class="list-row" data-create><span class="ic" style="background:var(--pri-soft);color:var(--pri);font-weight:900">+</span><span class="grow"><b>Créer mon domaine</b><small>Tes propres cartes, sur n’importe quel sujet</small></span><span class="chev">›</span></button></section>`;
}
function vDomain(d){
  const hasRes=d.matches||d.news, hasColl=d.coll.length;
  const tabs=[['path','Parcours']].concat(hasRes?[['res','Résultats']]:[]).concat(hasColl?[['coll',d.stl?(d.id==='ci'?'Acteurs':'Joueurs'):'Cartes']]:[]).concat((d.pages||[]).map(p=>[p.id,p.label]));
  if(!tabs.some(t=>t[0]===UI.dtab)) UI.dtab='path';
  let body='';
  if(UI.dtab==='path'){
    const li=lvlIdx(d), chs=d.levels[li].chapters;
    let cur=-1; chs.forEach((c,i)=>{ if(cur<0 && chapterState(d,chs,i).open && !S.stars[c.id]) cur=i; });
    const nodes=chs.map((c,i)=>{ const st=chapterState(d,chs,i);
      const stars=[1,2,3].map(s=>`<span class="${st.stars>=s?'':'off'}">★</span>`).join('');
      return `<button class="node ${c.boss?'boss':''} ${st.open?'':'locked'} ${st.stars?'done':''} ${i===cur?'current':''}" style="--c:${d.c}" data-ch="${c.id}" ${st.open?'':`data-why="${esc(st.why)}"`}>
        <span class="disc">${st.open?(c.boss?'★':st.stars?'✓':i+1):'🔒'}</span>
        <span class="grow"><b>${esc(c.name)}${c.boss?' · Boss':''}</b><small>${st.open?`${c.items.length} cartes`:esc(st.why)}</small></span><span class="stars">${stars}</span></button>`; }).join('');
    const notes=d.id==='lo'?['Les bases du métier et de l’entrepôt.','Préparation, expédition, retours et pic d’activité d’un entrepôt e-commerce.','Stocks, indicateurs, Lean et Incoterms : le niveau chef d’équipe.','Management, sécurité, planification et cas chiffrés : le niveau responsable.']
      :['Questions à choix et cartes à retourner.','Tu dois écrire certaines réponses toi-même.','Plus de réponses à écrire, vocabulaire de niveau B2-C1.'];
    const lvlUI = d.levels.length>1 ? `<div class="lvl"><div class="row between"><p class="eyebrow">Niveau</p>${li<d.levels.length-1?`<button class="btn soft sm" data-lvl="${li+1}">Monter le niveau ↑</button>`:'<span class="tag good">Niveau max</span>'}</div>
      <div class="seg">${d.levels.map((l,i)=>`<button data-lvl="${i}" aria-pressed="${i===li}">${esc(l.name)}</button>`).join('')}</div>
      <small class="muted small">${notes[li]||''}</small></div>`:'';
    body = lvlUI + `<div class="path">${nodes}</div>` + (d.custom?`<div class="pad"><button class="btn line sm" data-delcustom="${d.id}">Supprimer ce domaine</button></div>`:'');
  } else if(UI.dtab==='res'){
    body = `${matchRows(d)}${(d.news||[]).length?`<div class="comp">Actu</div>${d.news.map(([t,x])=>`<div class="news"><time>${esc(t)}</time><p>${esc(x)}</p></div>`).join('')}`:''}
      <div class="pad xs faint">Résultats au ${RES_DATE}. Ils ne se mettent pas à jour tout seuls.</div>`;
  } else if(UI.dtab==='coll'){
    body = groupedCards(d.coll,'team') + `<div class="offer"><div class="pack" style="--pc:${d.c}">${esc(d.icon)}</div><div><b>Booster ${esc(d.name)}</b><br><small class="muted small">3 cartes de ce domaine</small></div>
      <button class="btn gold sm" data-buydom="${d.id}" ${S.coins<DPACK_PRICE?'disabled':''}>${DPACK_PRICE} 🪙</button></div>`;
  } else {
    const p=d.pages.find(x=>x.id===UI.dtab);
    body = `<div class="card-h"><h2>${esc(p.title)}</h2></div>`+p.rows.map(([a,b],i)=>p.id==='carriere'&&i<6?`<div class="info-row step"><i>${i+1}</i><div><b>${esc(a)}</b><span>${esc(b)}</span></div></div>`:`<div class="info-row"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')
      + (p.id==='formules'?`<div class="pad"><button class="btn soft sm" data-blitz="lo">S’entraîner au Défi minute</button></div>`:'');
  }
  return `<section class="card"><div class="dhead" style="--c:${d.c}"><span class="wm">${esc(d.icon)}</span><button class="back" data-back>‹ Apprendre</button>
      <h1>${esc(d.icon)} ${esc(d.name)}</h1><small>${d.coll.length?`${ownedIn(d)}/${d.coll.length} cartes · les boss demandent ${BOSS_NEED} cartes`:d.custom?'Domaine personnel':''}</small></div>
    ${tabs.length>1?`<div class="utabs">${tabs.map(([id,l])=>`<button data-dtab="${id}" aria-pressed="${UI.dtab===id}">${l}</button>`).join('')}</div>`:''}
    ${body}</section>`;
}

function vCards(){
  const head=`<h1 class="title">Cartes</h1><section class="card"><div class="utabs"><button data-cards="coll" aria-pressed="${UI.cards==='coll'}">Collection</button><button data-cards="shop" aria-pressed="${UI.cards==='shop'}">Boutique${S.packs?` · ${S.packs}`:''}</button></div>`;
  if(UI.cards==='shop') return head+vShop()+'</section>';
  const all=allColl(), owned=all.filter(c=>S.coll[c.id]).length;
  const doms=DOMAINS.filter(d=>d.coll.length);
  const list=UI.collDom==='all'?all:getDom(UI.collDom).coll;
  return head+`<div class="pad" style="display:flex;flex-direction:column;gap:10px">
      <div class="row between"><span class="small muted"><b class="num" style="color:var(--fg)">${owned}</b> / ${all.length} cartes</span><span class="xs faint">Touche une carte pour l’inspecter</span></div>
      <div class="prog"><i style="width:${owned/all.length*100}%"></i></div>
      <div class="chips"><button data-colldom="all" aria-pressed="${UI.collDom==='all'}">Toutes</button>${doms.map(d=>`<button data-colldom="${d.id}" aria-pressed="${UI.collDom===d.id}">${d.icon} ${d.name}</button>`).join('')}</div>
      <div class="seg"><button data-group="team" aria-pressed="${UI.group==='team'}">Par équipe</button><button data-group="rar" aria-pressed="${UI.group==='rar'}">Par rareté</button><button data-group="dom" aria-pressed="${UI.group==='dom'}">Par domaine</button></div>
    </div>${groupedCards(list, UI.group)}</section>`;
}
function vShop(){
  const sd=getDom(UI.shopDom), totW=RORDER.reduce((s,x)=>s+RAR[x].w,0);
  return `${S.packs?`<div class="offer"><div class="pack">🎁</div><div><b>${S.packs} booster${S.packs>1?'s':''} gratuit${S.packs>1?'s':''}</b><br><small class="muted small">Gagnés en jouant</small></div><button class="btn gold sm" data-open>Ouvrir</button></div>`:''}
  <div class="offer"><div class="pack" style="--pc:#5b4bd6">🎴</div><div><b>Booster surprise</b><br><small class="muted small">3 cartes, dont au moins une rare</small></div>
    <button class="btn gold sm" data-buy ${S.coins<PACK_PRICE?'disabled':''}>${PACK_PRICE} 🪙</button></div>
  <div class="offer"><div class="pack" style="--pc:${sd.c}">${sd.icon}</div><div><b>Booster ${esc(sd.name)}</b><br><small class="muted small">Pour débloquer les boss du domaine</small></div>
    <button class="btn gold sm" data-buydom="${sd.id}" ${S.coins<DPACK_PRICE?'disabled':''}>${DPACK_PRICE} 🪙</button></div>
  <div class="pad" style="padding-top:0"><div class="chips">${DOMAINS.map(d=>`<button data-shopdom="${d.id}" aria-pressed="${UI.shopDom===d.id}">${d.icon} ${d.name}</button>`).join('')}</div></div>
  <div class="offer"><div class="pack" style="--pc:#2b88c8">🧊</div><div><b>Gel de série</b><br><small class="muted small">Protège ta série si tu rates un jour · ${S.freezes}/2</small></div>
    <button class="btn gold sm" data-freeze ${S.coins<FREEZE_PRICE||S.freezes>=2?'disabled':''}>${FREEZE_PRICE} 🪙</button></div>
  <div class="comp">Chances par carte</div>
  ${RORDER.map(r=>`<div class="list-row" style="min-height:44px"><span class="crest flag" style="color:${RAR[r].col}">●</span><span class="grow"><b style="font-size:14px">${RAR[r].n}</b></span><span class="num small muted">${Math.max(1,Math.round(RAR[r].w/totW*100))} % · tirage /${RAR[r].sup}</span></div>`).join('')}
  <div class="pad xs faint">Les cartes notées 90 et plus, les légendaires et les Icônes ont droit à une entrée spéciale à l’ouverture.</div>`;
}
function vMe(){
  const li=lvlInfo(S.xp), st=S.stats, acc=st.correct+st.wrong?Math.round(st.correct/(st.correct+st.wrong)*100):0;
  return `<h1 class="title">Profil</h1>
  <section class="card"><div class="pad"><div class="row between"><h2 style="font-size:20px">Niveau <span class="num">${li.n}</span></h2><span class="num small muted">${li.cur}/${li.need} XP</span></div>
    <div class="prog" style="margin-top:10px"><i style="width:${li.cur/li.need*100}%"></i></div><p class="xs muted" style="margin:8px 0 0">Chaque niveau gagné offre un booster.</p></div>
    <div class="stats" style="border-top:1px solid var(--line)">
      <div class="stat"><b class="num">${S.xp}</b><small>XP total</small></div><div class="stat"><b class="num">${S.best}</b><small>Meilleure série</small></div><div class="stat"><b class="num">${st.lessons}</b><small>Leçons</small></div>
      <div class="stat"><b class="num">${acc}%</b><small>Réussite</small></div><div class="stat"><b class="num">${Object.keys(S.srs).length}</b><small>Cartes apprises</small></div><div class="stat"><b class="num">${allColl().filter(c=>S.coll[c.id]).length}</b><small>Collection</small></div>
    </div></section>
  <section class="card"><div class="card-h"><h2>Badges</h2><span class="num small muted">${Object.keys(S.badges).length}/${BADGES.length}</span></div>
    <div class="badges">${BADGES.map(b=>`<div class="bdg ${S.badges[b.id]?'on':''}"><i>${b.i}</i>${esc(b.n)}<small>${esc(b.d)}</small></div>`).join('')}</div></section>
  <section class="card"><div class="card-h"><h2>Transférer ma progression</h2></div><div class="pad" style="display:flex;flex-direction:column;gap:10px;padding-top:0">
    <p class="small muted" style="margin:0">Pour passer de la version Claude à l’appli installée (ou l’inverse) : copie ton code ici, puis colle-le dans l’autre version.</p>
    <button class="btn soft sm" data-export style="align-self:flex-start">Copier mon code de progression</button>
    <textarea id="xcode" class="xcode" rows="3" readonly hidden aria-label="Ton code de progression"></textarea>
    <label class="f" for="icode" style="font-size:13px">Coller un code venant de l’autre version<textarea id="icode" rows="3" placeholder="CARTO1:…"></textarea></label>
    ${UI.confirmImport?`<div class="card pad" style="display:flex;flex-direction:column;gap:8px"><b>Remplacer ta progression actuelle ?</b><small class="muted">Celle de cette version sera écrasée par celle du code.</small><div class="row"><button class="btn bad sm" data-import="yes">Remplacer</button><button class="btn line sm" data-import="no">Annuler</button></div></div>`
      :`<button class="btn line sm" data-import="ask" style="align-self:flex-start">Importer ce code</button>`}
    <small class="xs" id="imsg"></small></div></section>
  <section class="card"><div class="card-h"><h2>Réglages</h2></div><div class="pad" style="display:flex;flex-direction:column;gap:14px;padding-top:0">
    <div><p class="eyebrow" style="margin-bottom:6px">Objectif quotidien</p><div class="seg">${[[20,'20 XP'],[50,'50 XP'],[100,'100 XP']].map(([g,l])=>`<button data-goal="${g}" aria-pressed="${S.goal===g}">${l}</button>`).join('')}</div></div>
    <div><p class="eyebrow" style="margin-bottom:6px">Thème</p><div class="seg">${[['auto','Automatique'],['light','Clair'],['dark','Sombre']].map(([t,l])=>`<button data-theme="${t}" aria-pressed="${S.theme===t}">${l}</button>`).join('')}</div></div>
    <div><p class="eyebrow" style="margin-bottom:6px">Son</p><div class="seg"><button data-sound="1" aria-pressed="${S.sound}">Activé</button><button data-sound="0" aria-pressed="${!S.sound}">Coupé</button></div></div>
    ${UI.confirmReset?`<div class="card pad" style="display:flex;flex-direction:column;gap:10px"><b>Effacer toute ta progression ?</b><small class="muted">XP, cartes, série et domaines perso seront supprimés.</small><div class="row"><button class="btn bad sm" data-reset="yes">Tout effacer</button><button class="btn line sm" data-reset="no">Annuler</button></div></div>`
      :`<button class="btn line sm" data-reset="ask" style="align-self:flex-start">Réinitialiser la progression</button>`}
  </div></section>`;
}

/* ============================ JEUX ============================ */
const REWARDED_GAMES = 3;
const WHEEL=[{l:'20 🪙',t:'c',v:20,w:20,col:'#374df5'},{l:'Booster',t:'p',v:1,w:8,col:'#8a3ffc'},{l:'50 🪙',t:'c',v:50,w:14,col:'#0fa968'},{l:'XP ×2',t:'b',v:15,w:12,col:'#ff6b2c'},
  {l:'30 🪙',t:'c',v:30,w:18,col:'#1e88e5'},{l:'Gel',t:'f',v:1,w:10,col:'#13a89e'},{l:'100 🪙',t:'c',v:100,w:5,col:'#e9a100'},{l:'40 🪙',t:'c',v:40,w:13,col:'#e5383b'}];
function vGames(){
  const left=Math.max(0,REWARDED_GAMES-(S.daily.rgames||0));
  const bdoms=domains().filter(d=>allItems(d).length>=8);
  const sports=DOMAINS.filter(d=>d.stl);
  const rec=S.records['blitz-'+UI.gameDom]||0, dd=getDom(UI.duelDom), owned=dd.coll.filter(c=>S.coll[c.id]&&c.st).length;
  return `<h1 class="title">Jeux</h1>
  <div class="row between"><span class="small muted">Parties récompensées aujourd’hui</span><span class="tag ${left?'pri':''} num">${left}/${REWARDED_GAMES} restantes</span></div>
  <section class="card">
    <div class="game"><span class="gi" style="--gc:var(--gold-soft)">🎡</span><div><b>Roue du jour</b><br><small class="muted small">Un tour gratuit par jour : pièces, booster, gel de série ou XP ×2 pendant 15 min.</small></div>
      <div class="acts"><button class="btn ${S.spinDay===today()?'line':''} sm" data-wheel>${S.spinDay===today()?'Déjà tournée · revient demain':'Tourner la roue'}</button></div></div>
    <div class="game"><span class="gi" style="--gc:var(--pri-soft)">⏱️</span><div><b>Défi minute</b><br><small class="muted small">Un maximum de bonnes réponses en 60 secondes. Une erreur coûte 3 secondes. 2 pièces et 2 XP par point.</small></div>
      <div class="acts" style="flex-direction:column;align-items:stretch"><div class="chips">${bdoms.map(d=>`<button data-gamedom="${d.id}" aria-pressed="${UI.gameDom===d.id}">${d.icon} ${esc(d.name)}</button>`).join('')}</div>
      <div class="row between"><span class="small muted">Record : <b class="num" style="color:var(--fg)">${rec}</b></span><button class="btn sm" data-blitz="${UI.gameDom}">Jouer</button></div></div></div>
    <div class="game"><span class="gi" style="--gc:var(--good-soft)">🛒</span><div><b>Tournée de picking</b><br><small class="muted small">3 commandes à préparer dans un entrepôt. Trouve le parcours le plus court : on compare ton trajet au trajet optimal. 7 pièces par étoile.</small></div>
      <div class="acts" style="justify-content:space-between"><span class="small muted">Record : <b class="num" style="color:var(--fg)">${S.records.pick||0}/9</b></span><button class="btn sm" data-pick>Jouer</button></div></div>
    <div class="game"><span class="gi" style="--gc:var(--bad-soft)">♟️</span><div><b>Duel tactique</b><br><small class="muted small">Tu vois les 5 stats qui seront comparées et toute la main adverse. Choisis quelle carte jouer à chaque manche et quand utiliser ton boost. Victoire : 40 pièces, 5-0 : un booster.</small></div>
      <div class="acts" style="flex-direction:column;align-items:stretch"><div class="chips">${sports.map(d=>`<button data-dueldom="${d.id}" aria-pressed="${UI.duelDom===d.id}">${d.icon} ${d.name}</button>`).join('')}</div>
      <div class="row between"><span class="small muted">${owned} carte${owned>1?'s':''} à toi · ${Math.max(0,5-owned)} prêtée${5-owned>1?'s':''}</span><button class="btn sm" data-duel="${UI.duelDom}">Jouer</button></div></div></div>
  </section>
  <p class="xs faint" style="margin:0">Au-delà de ${REWARDED_GAMES} parties par jour, tu peux continuer à jouer pour t’entraîner, sans récompense.</p>`;
}
let G=null;
function overlayShell(dark){
  $('#overlay').innerHTML=`<div class="ov ${dark?'dark':''}"><div class="ov-in" id="ovin"></div></div>`; document.body.classList.add('ov-clip'); return $('#ovin');
}
function closeOverlay(){ if(G&&G.timer) clearInterval(G.timer); G=null; L=null; clearTimers(); P=null; $('#overlay').innerHTML=''; document.body.classList.remove('ov-clip'); render(); }
function gameReward(coins, xp){
  const rewarded=(S.daily.rgames||0)<REWARDED_GAMES; S.daily.games=(S.daily.games||0)+1;
  if(!rewarded) return {coins:0,xp:0,rewarded};
  S.daily.rgames=(S.daily.rgames||0)+1; S.coins+=coins; xp=xp?gainXP(xp):0; return {coins,xp,rewarded};
}
function endScreen(title, sub, rw, extra=''){
  return `<div class="stage end"><h1 style="font-size:30px">${title}</h1><p class="muted" style="margin:0;font-weight:600">${sub}</p>
    ${rw.rewarded?`<div class="rewards"><div class="reward"><b class="num">+${rw.coins}</b><small>Pièces</small></div><div class="reward"><b class="num">+${rw.xp}</b><small>XP</small></div><div class="reward"><b class="num">${Math.max(0,REWARDED_GAMES-(S.daily.rgames||0))}</b><small>Parties récompensées restantes</small></div></div>`
      :'<p class="small muted" style="margin:0">Partie d’entraînement : les 3 parties récompensées du jour sont déjà jouées.</p>'}
    ${extra}<button class="btn wide" data-endok>Terminer</button></div>`;
}

/* --- Roue --- */
function openWheel(){
  const el=overlayShell(false), used=S.spinDay===today();
  const grad=`conic-gradient(${WHEEL.map((s,i)=>`${s.col} ${i*45}deg ${(i+1)*45}deg`).join(',')})`;
  el.innerHTML=`<div class="lhead"><button class="x" data-endok aria-label="Fermer">✕</button><b style="flex:1">Roue du jour</b></div>
    <div class="stage" style="align-items:center;justify-content:center;text-align:center">
      <div class="wheel-wrap"><span class="wheel-pin"></span><div class="wheel" id="wheel" style="background:${grad}">${WHEEL.map((s,i)=>{ const a=i*45+22.5; return a>180?`<span class="flipl" style="transform:rotate(${a+90}deg) translateX(-100%)">${esc(s.l)}</span>`:`<span style="transform:rotate(${a-90}deg)">${esc(s.l)}</span>`; }).join('')}</div><span class="wheel-hub">C</span></div>
      <p class="small muted" id="wmsg" style="margin:8px 0 0">${used?'Tu as déjà tourné la roue aujourd’hui. Reviens demain !':'Un tour gratuit par jour.'}</p>
      <button class="btn wide" id="spin" ${used?'disabled':''} style="max-width:320px">Tourner</button></div>`;
  $('#spin').onclick=()=>{
    if(S.spinDay===today()) return; S.spinDay=today(); save(); $('#spin').disabled=true;
    let x=Math.random()*WHEEL.reduce((s,w)=>s+w.w,0), idx=0; for(let i=0;i<WHEEL.length;i++){ if((x-=WHEEL[i].w)<0){ idx=i; break; } }
    const deg=360*6-(idx*45+22.5)+(Math.random()*20-10);
    const w=$('#wheel'); w.style.transform=`rotate(${deg}deg)`;
    let k=0; const tk=setInterval(()=>{ SFX.tick(); if(++k>14) clearInterval(tk); },220);
    setTimeout(()=>{ const s=WHEEL[idx]; let msg='';
      if(s.t==='c'){ S.coins+=s.v; msg=`+${s.v} pièces`; }
      else if(s.t==='p'){ S.packs+=1; msg='Un booster gratuit !'; }
      else if(s.t==='b'){ S.boostUntil=Math.max(Date.now(),S.boostUntil||0)+s.v*60000; msg='XP ×2 pendant 15 minutes !'; }
      else if(s.t==='f'){ if(S.freezes<2){ S.freezes++; msg='Un gel de série !'; } else { S.coins+=50; msg='Gel de série (stock plein) : +50 pièces'; } }
      save(); SFX.win(); confetti(140,[s.col,'#ffffff','#e9a100']); $('#wmsg').innerHTML=`<b style="color:var(--fg);font-size:18px">${msg}</b>`;
      $('#spin').outerHTML='<button class="btn wide" data-endok style="max-width:320px">Récupérer</button>'; }, reduced?100:4500);
  };
}

/* --- Défi minute --- */
function startBlitz(domId){
  const d=getDom(domId), items=d?allItems(d):[]; if(items.length<8){ toast('Ce domaine n’a pas assez de cartes pour ce jeu'); return; }
  const el=overlayShell(false);
  G={type:'blitz', d, items, score:0, combo:0, end:Date.now()+60000, lock:false};
  el.innerHTML=`<div class="lhead"><button class="x" data-quitgame aria-label="Quitter">✕</button><div class="timer"><i id="tbar" style="width:100%"></i></div><span class="tag pri num" id="tsec">60 s</span></div>
    <div class="row between"><span class="eyebrow">${esc(d.icon)} ${esc(d.name)} · Défi minute</span><span style="font-weight:900;font-size:22px" class="num" id="bscore">0</span></div>
    <div class="stage" id="stage"></div>`;
  G.timer=setInterval(()=>{ if(!G) return; const left=G.end-Date.now(), p=Math.max(0,left/60000), b=$('#tbar'); if(!b) return;
    b.style.width=(p*100)+'%'; b.style.background=p<.2?'var(--bad)':p<.5?'var(--gold)':'var(--good)'; $('#tsec').textContent=Math.max(0,Math.ceil(left/1000))+' s';
    if(left<=0) endBlitz(); },100);
  nextBlitz();
}
function nextBlitz(){
  if(!G||G.type!=='blitz') return; G.lock=false;
  const it=pick(G.items), rev=!!G.d.lang&&Math.random()<.5, ask=rev?'a':'q', ans=rev?'q':'a';
  const opts=shuffle([it[ans]].concat(distractors(it,ans)));
  $('#stage').innerHTML=`${G.combo>=3?`<div class="combo">🔥 ×${G.combo}</div>`:''}<div class="qcard" style="padding:22px 18px"><div class="big" style="font-size:clamp(19px,5.6vw,26px)">${esc(it[ask])}</div></div>
    <div class="opts">${opts.map((o,i)=>`<button class="opt" data-bi="${i}">${esc(o)}</button>`).join('')}</div>`;
  $$('[data-bi]').forEach(b=>b.onclick=()=>{ if(G.lock) return; G.lock=true; const ok=opts[+b.dataset.bi]===it[ans];
    $$('[data-bi]').forEach(x=>{ if(opts[+x.dataset.bi]===it[ans]) x.classList.add('ok'); });
    if(ok){ G.score++; G.combo++; SFX.good(); $('#bscore').textContent=G.score; setTimeout(nextBlitz,220); }
    else { b.classList.add('ko'); G.combo=0; G.end-=3000; SFX.bad(); setTimeout(nextBlitz,700); } });
}
function endBlitz(){
  if(!G||G.type!=='blitz') return; clearInterval(G.timer);
  const key='blitz-'+G.d.id, prev=S.records[key]||0, rec=G.score>prev; if(rec) S.records[key]=G.score;
  const rw=gameReward(G.score*2+(rec&&G.score>0?20:0), G.score*2); S.stats.correct+=G.score; checkBadges(); save();
  if(G.score>0){ SFX.win(); if(rec) confetti(); }
  $('#ovin').innerHTML=endScreen(`${G.score} point${G.score>1?'s':''}`, rec&&G.score>0?`Nouveau record en ${esc(G.d.name)} ! (+20 pièces)`:`Record : ${Math.max(prev,G.score)}`, rw,
    `<button class="btn soft wide" data-blitz="${G.d.id}">Rejouer</button>`);
  G={type:'done'};
}

/* --- Duel tactique --- */
const statVal=(c,k)=>k?c.st[k-1]:c.ovr;
const statName=(d,k)=>k?d.stl[k-1]:'NOTE';
const BOOST=8;
function startDuel(domId){
  const d=getDom(domId), pool=d.coll.filter(c=>c.st);
  const hand=shuffle(pool.filter(c=>S.coll[c.id])).sort((a,b)=>b.ovr-a.ovr).slice(0,5).map(c=>({c,loan:false,used:false}));
  const rest=shuffle(pool.filter(c=>!hand.some(h=>h.c===c) && c.r!=='i' && c.r!=='l'));
  while(hand.length<5 && rest.length) hand.push({c:rest.pop(),loan:true,used:false});
  let oppPool=shuffle(pool.filter(c=>c.r!=='i' && !hand.some(h=>h.c===c))).slice(0,5); if(oppPool.length<5) oppPool=oppPool.concat(shuffle(pool.filter(c=>c.r==='i')).slice(0,5-oppPool.length));
  const cats=shuffle([0,1,2,3,Math.floor(Math.random()*4)]);
  G={type:'duel', d, hand, opp:oppPool.map(c=>({c,used:false})), cats, i:0, me:0, them:0, boostLeft:true, boostOn:false, res:[], shown:null};
  overlayShell(false); renderDuel();
}
function oppPick(k){
  const av=G.opp.filter(o=>!o.used).sort((a,b)=>statVal(b.c,k)-statVal(a.c,k));
  return (av.length>1 && Math.random()<.25) ? av[1] : av[0];
}
function duelRows(list, k, mine){
  const d=G.d, cols=[0,1,2,3];
  return `<div class="drow dhead-row"><span>${mine?'Ta main':'Main adverse'}</span>${cols.map(c=>`<span class="${c===k?'hl':''}">${statName(d,c)}</span>`).join('')}</div>`+
    list.map((h,idx)=>{ const c=h.c, tag=mine&&!h.used&&!G.shown?'button':'div';
      return `<${tag} class="drow ${h.used?'used':''} ${mine?'mine':''}" ${tag==='button'?`data-play="${idx}"`:''}><span class="dn">${c.team&&TEAMS[c.team]?crest(c.team):crest(null,c.r==='i'?'🌟':c.nat)}<b>${esc(c.n.split(' ').slice(-1)[0])}</b>${h.loan?'<em>prêt</em>':''}</span>${cols.map(x=>`<span class="num ${x===k?'hl':''}">${statVal(c,x)}</span>`).join('')}</${tag}>`; }).join('');
}
function renderDuel(){
  const {d,i,cats}=G, k=cats[Math.min(i,4)];
  const strip=cats.map((c,j)=>`<span class="rchip ${j===i&&!G.shown?'cur':''} ${G.res[j]||''}">${j+1}. ${statName(d,c)}</span>`).join('');
  let mid='';
  if(G.shown){ const s=G.shown;
    mid=`<div class="duel"><div><div class="lbl">Toi · ${s.mv}${s.boost?` (dont +${BOOST})`:''}</div>${cardHTML(s.mine,{nobtn:true})}</div><div><div class="lbl">Adversaire · ${s.tv}</div>${cardHTML(s.theirs,{nobtn:true})}</div></div>
      <p class="prompt" style="text-align:center;color:${s.r==='w'?'var(--good)':s.r==='l'?'var(--bad)':'var(--fg-2)'}">${s.r==='w'?'Manche gagnée':s.r==='l'?'Manche perdue':'Égalité'} · ${statName(d,s.k)}</p>
      <button class="btn wide" id="dgo">${G.i<5?'Manche suivante':'Voir le résultat'}</button>`;
  } else {
    mid=`<div class="row between"><p class="prompt">Manche ${i+1} : on compare <b style="color:var(--pri)">${statName(d,k)}</b></p>
      <button class="btn sm ${G.boostOn?'':'soft'}" id="boost" ${G.boostLeft?'':'disabled'}>⚡ Boost +${BOOST}${G.boostLeft?'':' utilisé'}</button></div>
      <p class="xs muted" style="margin:-6px 0 0">Touche une de tes cartes pour la jouer. L’adversaire joue en général sa meilleure carte sur la stat de la manche : sacrifie une carte faible là où il est trop fort.</p>`;
  }
  $('#ovin').innerHTML=`<div class="lhead"><button class="x" data-quitgame aria-label="Quitter">✕</button><b style="flex:1">${d.icon} Duel tactique</b>
      <span class="tag pri num">Toi ${G.me} – ${G.them}</span></div>
    <div class="stage"><div class="rstrip">${strip}</div>${mid}
      <div class="card">${duelRows(G.hand,G.shown?G.shown.k:k,true)}</div>
      <div class="card">${duelRows(G.opp,G.shown?G.shown.k:k,false)}</div></div>`;
  if(G.shown){ $('#dgo').onclick=()=>{ G.shown=null; if(G.i<5) renderDuel(); else endDuel(); }; return; }
  const b=$('#boost'); if(b) b.onclick=()=>{ G.boostOn=!G.boostOn; renderDuel(); };
  $$('[data-play]').forEach(btn=>btn.onclick=()=>{
    const h=G.hand[+btn.dataset.play]; if(h.used) return;
    const o=oppPick(k); h.used=true; o.used=true;
    const boost=G.boostOn&&G.boostLeft; if(boost){ G.boostLeft=false; G.boostOn=false; }
    const mv=statVal(h.c,k)+(boost?BOOST:0), tv=statVal(o.c,k);
    const r=mv>tv?'w':mv<tv?'l':'d'; if(r==='w'){ G.me++; SFX.good(); } else if(r==='l'){ G.them++; SFX.bad(); } else SFX.flip();
    G.res[G.i]=r; G.shown={mine:h.c, theirs:o.c, mv, tv, k, r, boost}; G.i++; renderDuel();
  });
}
function endDuel(){
  const win=G.me>G.them, draw=G.me===G.them, sweep=G.me===5;
  S.stats.duels++; if(win) S.stats.duelWins++; if(sweep) S.badges.tactician||(S.badges.tactician=today(),queueToast('Badge débloqué : Tacticien'));
  const rw=gameReward(win?40:draw?15:10, win?20:5); if(rw.rewarded&&sweep) S.packs++;
  checkBadges(); save(); if(win){ SFX.win(); confetti(sweep?200:100); } else SFX.bad();
  $('#ovin').innerHTML=endScreen(win?'Victoire !':draw?'Match nul':'Défaite', `${G.me} – ${G.them} contre l’adversaire`, rw,
    `${rw.rewarded&&sweep?'<p style="margin:0;font-weight:800;color:var(--good)">5-0 : un booster offert !</p>':''}<button class="btn soft wide" data-duel="${G.d.id}">Rejouer</button>`);
  G={type:'done'}; flushToasts();
}

/* --- Tournée de picking (entrepôt) --- */
const AISLES='ABCDEF', DEPTH=8, MV=2, MH=6;
const pkX=a=>40+a*52, pkY=y=>372-y*34;
function pkDist(p,q){ if(p.a===q.a) return MV*Math.abs(p.y-q.y); return MH*Math.abs(p.a-q.a)+MV*Math.min(p.y+q.y,2*(DEPTH+1)-p.y-q.y); }
function pkSeg(p,q){ if(p.a===q.a) return [p,q]; const yc=(p.y+q.y)<=(2*(DEPTH+1)-p.y-q.y)?0:DEPTH+1; return [p,{a:p.a,y:yc},{a:q.a,y:yc},q]; }
const DEPOT={a:0,y:0};
function pkTotal(order){ let t=0, cur=DEPOT; order.forEach(p=>{ t+=pkDist(cur,p); cur=p; }); return t+pkDist(cur,DEPOT); }
function pkBest(items){ let best=Infinity, bestO=null;
  const perm=(arr,used,acc)=>{ if(acc.length===arr.length){ const t=pkTotal(acc); if(t<best){best=t;bestO=acc.slice();} return; }
    arr.forEach((x,i)=>{ if(!used[i]){ used[i]=1; acc.push(x); perm(arr,used,acc); acc.pop(); used[i]=0; } }); };
  perm(items,[],[]); return {best,order:bestO}; }
function startPick(){ G={type:'pick', round:0, sizes:[4,5,6], stars:[]}; overlayShell(false); newPickRound(); }
function newPickRound(){
  const n=G.sizes[G.round], set=new Set(), items=[];
  while(items.length<n){ const a=Math.floor(Math.random()*6), y=1+Math.floor(Math.random()*DEPTH), k=a+'-'+y; if(!set.has(k)){ set.add(k); items.push({a,y,code:AISLES[a]+'-'+String(y).padStart(2,'0')}); } }
  const opt=pkBest(items); Object.assign(G,{items, route:[], opt:opt.best, optOrder:opt.order, done:false}); renderPick();
}
function pkPath(order, closed=true){ const pts=[DEPOT,...order,...(closed?[DEPOT]:[])]; let out=[];
  for(let i=0;i<pts.length-1;i++){ const s=pkSeg(pts[i],pts[i+1]); out=out.concat(i?s.slice(1):s); }
  return out.map(p=>`${pkX(p.a)},${pkY(p.y)}`).join(' '); }
function renderPick(){
  const g=G, cur=g.route.length?g.route[g.route.length-1]:DEPOT;
  let dist=0, c=DEPOT; g.route.forEach(p=>{ dist+=pkDist(c,p); c=p; }); if(g.done) dist=pkTotal(g.route);
  const racks=[...Array(6)].map((_,a)=>`<rect x="${pkX(a)-24}" y="${pkY(DEPTH)-14}" width="11" height="${pkY(1)-pkY(DEPTH)+28}" rx="2" class="rack"/><rect x="${pkX(a)+13}" y="${pkY(DEPTH)-14}" width="11" height="${pkY(1)-pkY(DEPTH)+28}" rx="2" class="rack"/>
    <text x="${pkX(a)}" y="${pkY(DEPTH+1)-10}" text-anchor="middle" class="alab">${AISLES[a]}</text>`+[...Array(DEPTH)].map((_,y)=>`<circle cx="${pkX(a)}" cy="${pkY(y+1)}" r="2" class="slot"/>`).join('')).join('');
  const items=g.items.map((it,i)=>{ const idx=g.route.indexOf(it); return `<g data-pk="${i}" class="pk ${idx>=0?'on':''}" role="button" tabindex="0" aria-label="Emplacement ${it.code}"><circle cx="${pkX(it.a)}" cy="${pkY(it.y)}" r="13"/><text x="${pkX(it.a)}" y="${pkY(it.y)+4}" text-anchor="middle">${idx>=0?idx+1:'•'}</text></g>`; }).join('');
  const svg=`<svg viewBox="0 0 340 400" class="wh" id="wh">${racks}
    <rect x="4" y="${pkY(0)+8}" width="72" height="20" rx="5" class="dock"/><text x="40" y="${pkY(0)+22}" text-anchor="middle" class="docklab">QUAI</text>
    <polyline points="${pkPath(g.route,g.done)}" class="mypath ${g.done?'faded':''}"/>
    ${g.done?`<polyline points="${pkPath(g.optOrder)}" class="optpath"/>`:''}
    <circle cx="${pkX(cur.a)}" cy="${pkY(cur.y)}" r="6" class="me"/>${items}</svg>`;
  const ratio=g.done?g.opt/dist:0, st=g.done?(dist<=g.opt?3:ratio>=1/1.12?2:ratio>=1/1.3?1:0):0;
  $('#ovin').innerHTML=`<div class="lhead"><button class="x" data-quitgame aria-label="Quitter">✕</button><b style="flex:1">🛒 Tournée de picking · ${g.round+1}/3</b><span class="tag pri num">${dist} m</span></div>
    <div class="stage">
      <p class="xs muted" style="margin:0">Touche les emplacements dans l’ordre de ta tournée, départ et retour au quai. Pour changer d’allée, il faut passer par l’allée transversale du haut ou du bas.</p>
      <div class="chips" style="flex-wrap:wrap">${g.items.map(it=>`<span class="tag ${g.route.includes(it)?'good':''}">${it.code}</span>`).join('')}</div>
      <div class="card" style="padding:6px">${svg}</div>
      ${g.done?`<div class="card pad" style="text-align:center"><div class="bigstars" style="font-size:34px">${[1,2,3].map(s=>`<span class="${st>=s?'':'off'}">★</span>`).join('')}</div>
        <p style="margin:4px 0 0;font-weight:700">Ton parcours : ${dist} m · optimal : ${g.opt} m</p><p class="xs muted" style="margin:4px 0 0">En vert pointillé : le meilleur parcours. ${dist<=g.opt?'Parfait, tu as trouvé le chemin le plus court.':'Astuce : vide une allée avant d’en changer et choisis le bon passage, en haut ou en bas.'}</p></div>
        <button class="btn wide" id="pnext">${g.round<2?'Commande suivante':'Voir le résultat'}</button>`
      :`<div class="row"><button class="btn line sm" id="pundo" ${g.route.length?'':'disabled'}>Annuler le dernier</button><span class="xs faint">${g.route.length}/${g.items.length} articles</span></div>`}
    </div>`;
  if(g.done){ $('#pnext').onclick=()=>{ g.stars.push(st); if(g.round<2){ g.round++; newPickRound(); } else endPick(); }; return; }
  $('#pundo').onclick=()=>{ g.route.pop(); renderPick(); };
  const tap=e=>{ const t=e.target.closest('[data-pk]'); if(!t) return; const it=g.items[+t.dataset.pk]; if(g.route.includes(it)) return;
    g.route.push(it); SFX.tick(); if(g.route.length===g.items.length){ g.done=true; const d=pkTotal(g.route); if(d<=g.opt){ SFX.win(); confetti(80); } else SFX.good(); } renderPick(); };
  $('#wh').onclick=tap; $('#wh').onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); tap(e); } };
}
function endPick(){
  const total=G.stars.reduce((a,b)=>a+b,0), key='pick', prev=S.records[key]||0; if(total>prev) S.records[key]=total;
  if(total>=9 && !S.badges.picker){ S.badges.picker=today(); queueToast('Badge débloqué : Pro du picking'); }
  const rw=gameReward(total*7, total*4); checkBadges(); save(); if(total>=6){ SFX.win(); confetti(); }
  $('#ovin').innerHTML=endScreen(`${total}/9 étoiles`, total>=9?'Tournées parfaites, c’est le chemin le plus court à chaque fois !':`Record : ${Math.max(prev,total)}/9`, rw, `<button class="btn soft wide" data-pick>Rejouer</button>`);
  G={type:'done'}; flushToasts();
}

/* ============================ SCANNER ============================ */
let SAMPLE=null, sampleReady=false;
if(window.claude && typeof window.claude.use==='function'){ window.claude.use('sample').then(s=>{ SAMPLE=s; sampleReady=true; if(UI.tab==='scan'&&!UI.scan.busy) render(); }).catch(()=>{ sampleReady=true; if(UI.tab==='scan') render(); }); }
else sampleReady=true;
const scanLang = ()=>SCAN_LANGS.find(l=>l[0]===S.scanLang)||SCAN_LANGS[0];
function vScan(){
  const sc=UI.scan, Lg=scanLang(), unavailable = sampleReady && !SAMPLE;
  let out='';
  if(sc.busy) out=`<p class="small muted" style="margin:0">Claude regarde ta photo…</p>`;
  else if(sc.err) out=`<section class="card pad"><b style="color:var(--bad)">${esc(sc.err)}</b></section>`;
  else if(sc.res){ const r=sc.res;
    out=`<section class="card"><div class="pad" style="display:flex;flex-direction:column;gap:8px"><p class="eyebrow">${esc(r.fr)} · en ${esc(sc.langName)}</p>
      <div class="row between" style="align-items:flex-start"><div class="tr-word">${esc(r.mot)}</div>${canSpeak?`<button class="btn soft sm" data-say="${esc(r.mot)}" data-lang="${sc.langCode}" aria-label="Écouter">🔊</button>`:''}</div>
      ${r.prononciation?`<p class="small muted" style="margin:0">Se prononce : <b style="color:var(--fg)">${esc(r.prononciation)}</b></p>`:''}</div>
      ${r.exemple?`<div class="info-row" style="border-top:1px solid var(--line)"><b>${esc(r.exemple)}</b><span>${esc(r.exemple_fr||'')}</span></div>`:''}
      ${(r.autres||[]).length?`<div class="comp">Aussi sur la photo</div>${r.autres.map(a=>`<div class="list-row" style="min-height:44px"><span class="grow"><b style="font-size:14px">${esc(a.mot)}</b></span><span class="small muted">${esc(a.fr)}</span></div>`).join('')}`:''}
      <div class="pad"><button class="btn wide" data-scanadd ${sc.added?'disabled':''}>${sc.added?'Ajouté à tes cartes ✓':'Ajouter à mes cartes'}</button></div></section>`;
  }
  return `<h1 class="title">Scanner</h1>
  <p class="small muted" style="margin:-4px 0 0">Prends un objet en photo : Claude te donne son nom, la prononciation et une phrase d’exemple, puis tu l’ajoutes à tes cartes.</p>
  <div class="chips">${SCAN_LANGS.map(l=>`<button data-scanlang="${l[0]}" aria-pressed="${S.scanLang===l[0]}">${l[3]} ${l[1]}</button>`).join('')}</div>
  ${unavailable?`<section class="card pad"><b>Le scanner fonctionne dans Claude</b><p class="small muted" style="margin:6px 0 0">Ouvre l’application depuis claude.ai ou l’app Claude, puis autorise-la à interroger Claude quand on te le demande.</p></section>`:`
  <label class="shot ${sc.img?'has':''}" for="photo">${sc.img?`<img src="${sc.img}" alt="Ta photo">${sc.busy?'<span class="scanline"></span>':''}`:`<span class="cam">${IC.camera}</span><b>Prendre une photo</b><small class="muted small">L’appareil photo s’ouvre sur ton téléphone</small>`}</label>
  <input type="file" id="photo" accept="image/*" capture="environment" hidden>
  <div class="row"><label class="btn line sm" for="photo2" style="flex:1">Choisir dans la galerie</label>${sc.img&&!sc.busy?`<button class="btn sm" data-scanrun style="flex:1">Traduire en ${Lg[1]}</button>`:''}</div>
  <input type="file" id="photo2" accept="image/*" hidden>`}
  ${out}
  ${S.custom.some(c=>c.photo)?`<section class="card"><button class="list-row" data-gophoto><span class="ic">📸</span><span class="grow"><b>Tes cartes photo</b><small>${S.custom.filter(c=>c.photo).map(c=>`${esc(c.name)} (${c.items.length})`).join(' · ')}</small></span><span class="chev">›</span></button></section>`:''}`;
}
function bindScan(){
  ['photo','photo2'].forEach(id=>{ const inp=$('#'+id); if(inp) inp.onchange=async()=>{ const f=inp.files&&inp.files[0]; if(!f) return;
    try{ const {blob,url}=await shrink(f); UI.scan={img:url, blob}; runScan(); }catch(e){ UI.scan={err:'Impossible de lire cette image.'}; render(); } }; });
}
function shrink(file){ return new Promise((res,rej)=>{ const img=new Image(), u=URL.createObjectURL(file);
  img.onload=()=>{ const m=1024, k=Math.min(1,m/Math.max(img.width,img.height)), c=document.createElement('canvas'); c.width=Math.round(img.width*k); c.height=Math.round(img.height*k);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height); URL.revokeObjectURL(u); const url=c.toDataURL('image/jpeg',.85); c.toBlob(b=>b?res({blob:b,url}):rej(),'image/jpeg',.85); };
  img.onerror=rej; img.src=u; }); }
const SCAN_ERR = {not_granted:"Tu as refusé l'accès à Claude. Recharge la page pour qu'il te soit redemandé.", rate_limited:'Trop de demandes d’un coup. Réessaie dans une minute.',
  images_unavailable:"L'envoi de photos n'est pas disponible dans cette vue.", image_rejected:'Cette photo n’a pas été acceptée (format ou taille).', refused:'Claude n’a pas pu traiter cette photo.', invalid_json:'Réponse illisible. Réessaie.'};
async function runScan(){
  if(!SAMPLE || !UI.scan.blob) return;
  const Lg=scanLang(); Object.assign(UI.scan,{busy:true,res:null,err:null,added:false}); render();
  const lang=Lg[1].toLowerCase();
  const prompt=`Tu aides un francophone à apprendre le vocabulaire. Regarde la photo jointe et identifie l'objet principal (ou l'élément le plus visible).
Réponds UNIQUEMENT avec un objet JSON, sans texte autour, de cette forme :
{"fr":"nom de l'objet en français avec son article (ex. une tasse)","mot":"traduction en ${lang} avec l'article usuel de la langue","prononciation":"prononciation approximative écrite pour un francophone","exemple":"phrase courte et naturelle en ${lang} avec ce mot","exemple_fr":"traduction française de cette phrase","autres":[{"fr":"autre objet visible, en français","mot":"sa traduction en ${lang}"}]}
La liste "autres" contient de 0 à 4 autres objets bien visibles. Si rien n'est identifiable, réponds {"erreur":"explication courte en français"}.`;
  try{
    const r=await SAMPLE.json(prompt,{images:[UI.scan.blob], modelTier:'default'});
    if(!r || r.erreur || !r.mot){ UI.scan.err=r&&r.erreur?String(r.erreur):'Je n’ai pas reconnu d’objet. Essaie une photo plus nette, plus proche.'; }
    else { UI.scan.res={fr:String(r.fr||''), mot:String(r.mot), prononciation:r.prononciation?String(r.prononciation):'', exemple:r.exemple?String(r.exemple):'', exemple_fr:r.exemple_fr?String(r.exemple_fr):'',
      autres:Array.isArray(r.autres)?r.autres.slice(0,4).filter(a=>a&&a.mot&&a.fr).map(a=>({fr:String(a.fr),mot:String(a.mot)})):[]};
      Object.assign(UI.scan,{langName:Lg[1], langCode:Lg[2], langId:Lg[0]});
      S.stats.scans++; gainXP(5); checkBadges(); save(); SFX.good(); }
  }catch(e){ UI.scan.err = SCAN_ERR[e&&e.code] || 'La traduction n’a pas abouti. Réessaie.'; }
  UI.scan.busy=false; render();
}
function addScanToDeck(){
  const sc=UI.scan; if(!sc.res||sc.added) return;
  const id='photo-'+sc.langId; let deck=S.custom.find(c=>c.id===id);
  if(!deck){ deck={id, name:'Photos · '+sc.langName, icon:'📸', lang:sc.langCode, photo:true, items:[]}; S.custom.push(deck); }
  const pairs=[[sc.res.fr,sc.res.mot]].concat(sc.res.autres.map(a=>[a.fr,a.mot]));
  let n=0; pairs.forEach(p=>{ if(p[0]&&p[1]&&!deck.items.some(x=>norm(x[1])===norm(p[1]))){ deck.items.push(p); n++; } });
  sc.added=true; save(); render(); toast(n?`${n} carte${n>1?'s':''} ajoutée${n>1?'s':''} à « ${deck.name} »`:'Ces mots sont déjà dans tes cartes');
}

/* ============================ LEÇON ============================ */
let L=null;
function startLesson(chId){
  const f=findCh(chId); if(!f) return; const {d,c}=f;
  const hard = !!d.lang && (d.custom ? true : c.li>=1);
  const items=shuffle(c.items.map((it,i)=>({k:c.id+':'+i,q:it[0],a:it[1],ch:c,d})));
  const pool = hard ? (c.li>=2?['qcm','type','type','vf','recall']:['qcm','type','vf','qcm','recall']) : ['qcm','qcm','vf','recall'];
  const rounds=[];
  for(let i=0;i<items.length;i+=2){
    const pair=items.slice(i,i+2);
    pair.forEach(it=>{ if(!S.srs[it.k]) rounds.push({t:'intro',it}); });
    shuffle(pair).forEach(it=>rounds.push({t:pick(pool),it}));
  }
  if(items.length>=4) rounds.push({t:'memory', its:shuffle(items).slice(0,5)});
  S.lastCh=c.id; save();
  L={d, ch:c, rounds, i:0, hearts:3, combo:0, maxCombo:0, ok:0, ko:0, xp:0, review:false, retry:new Set()};
  openLessonUI();
}
function startReview(){
  const m=itemMap(); let keys=dueKeys();
  if(!keys.length) keys=Object.keys(S.srs).filter(k=>m[k]);
  keys=shuffle(keys).slice(0,10); if(!keys.length) return;
  L={d:{name:'Révision'}, ch:{name:'Cartes du jour'}, rounds:keys.map(k=>({t:pick(m[k].d.lang&&(m[k].d.custom||m[k].ch.li>=1)?['qcm','type','vf','recall']:['qcm','vf','qcm','recall']),it:m[k]})), i:0, hearts:3, combo:0, maxCombo:0, ok:0, ko:0, xp:0, review:true, retry:new Set()};
  openLessonUI();
}
function openLessonUI(){
  overlayShell(false).innerHTML=`<div class="lhead"><button class="x" data-quit aria-label="Quitter">✕</button><div class="prog"><i id="lprog"></i></div><div class="hearts" id="hearts"></div></div>
    <div class="stage" id="stage"></div><div class="fb" id="fb" hidden></div>`;
  round();
}
function hud(){ $('#lprog').style.width=(L.i/L.rounds.length*100)+'%'; $('#hearts').innerHTML=[0,1,2].map(i=>`<span class="${i<L.hearts?'':'lost'}">♥</span>`).join(''); }
function distractors(it, field, n=3){
  const val=x=>field==='a'?x[1]:x[0];
  let out=shuffle([...new Set(it.ch.items.map(val))].filter(v=>v!==it[field])).slice(0,n);
  if(out.length<n){ const more=shuffle(allCh(it.d).flatMap(c=>c.items.map(val))).filter(v=>v!==it[field]&&!out.includes(v)); out=out.concat(more.slice(0,n-out.length)); }
  return out;
}
const spk = (text, it)=> it.d.lang && canSpeak ? `<button class="speak" data-say="${esc(text)}" data-lang="${it.d.lang}" aria-label="Écouter">🔊</button>` : '';
function round(){
  hud(); const r=L.rounds[L.i], st=$('#stage'); $('#fb').hidden=true; $('#fb').className='fb';
  if(!r) return endLesson();
  const combo = L.combo>=3?`<div class="combo">🔥 Combo ×${L.combo}</div>`:'';
  const tg = r.it?`<span class="tg">${esc(r.it.d.name)}</span>`:'';
  if(r.t==='intro'){
    st.innerHTML=`<p class="prompt">Nouvelle carte · touche pour retourner</p>
      <div class="flip" id="flip"><div class="flip-in"><div class="face qcard"><span class="tg">Recto</span><div class="big">${esc(r.it.q)}</div></div>
      <div class="face qcard b"><span class="tg">Verso</span>${spk(r.it.a,r.it)}<div class="big">${esc(r.it.a)}</div><div class="sub">${esc(r.it.q)}</div></div></div></div>`;
    const f=$('#flip'); f.onclick=e=>{ if(e.target.closest('[data-say]')) return; f.classList.toggle('on'); SFX.flip(); if(f.classList.contains('on')&&r.it.d.lang) speak(r.it.a,r.it.d.lang); showFB(null); };
  } else if(r.t==='qcm'){
    const rev = !!r.it.d.lang && Math.random()<.5; const ask=rev?'a':'q', ans=rev?'q':'a';
    const opts=shuffle([r.it[ans]].concat(distractors(r.it,ans)));
    st.innerHTML=`${combo}<p class="prompt">Choisis la bonne réponse</p><div class="qcard">${tg}${rev?spk(r.it.a,r.it):''}<div class="big">${esc(r.it[ask])}</div></div>
      <div class="opts">${opts.map((o,i)=>`<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
    $$('.opt',st).forEach(b=>b.onclick=e=>{ const ok=opts[+b.dataset.i]===r.it[ans];
      $$('.opt',st).forEach(x=>{ x.disabled=true; if(opts[+x.dataset.i]===r.it[ans]) x.classList.add('ok'); });
      if(!ok) b.classList.add('ko'); answer(ok, r.it, r.it[ans], e); });
  } else if(r.t==='vf'){
    const truth=Math.random()<.5, shown=truth?r.it.a:(distractors(r.it,'a',1)[0]||r.it.a), real=shown===r.it.a;
    st.innerHTML=`${combo}<p class="prompt">Vrai ou faux ?</p><div class="qcard">${tg}<div class="big">${esc(r.it.q)}</div><div class="sub" style="font-size:19px;color:var(--fg)">= ${esc(shown)}</div></div>
      <div class="vf"><button class="btn good" data-v="1">Vrai</button><button class="btn bad" data-v="0">Faux</button></div>`;
    $$('[data-v]',st).forEach(b=>b.onclick=e=>{ $$('[data-v]',st).forEach(x=>x.disabled=true); answer((b.dataset.v==='1')===real, r.it, `${r.it.q} = ${r.it.a}`, e); });
  } else if(r.t==='type'){
    st.innerHTML=`${combo}<p class="prompt">Écris la traduction</p><div class="qcard">${tg}<div class="big">${esc(r.it.q)}</div><div class="sub">en ${esc(r.it.d.custom?'langue cible':r.it.d.name.toLowerCase())}</div></div>
      <form id="tf" style="display:flex;flex-direction:column;gap:8px" autocomplete="off"><input class="answer-in" id="ti" type="text" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Ta réponse…">
      <button class="btn wide" id="tsub">Valider</button><button type="button" class="btn line wide" id="tskip">Je ne sais pas</button></form>`;
    const ti=$('#ti'); setTimeout(()=>ti.focus({preventScroll:true}),80);
    const done=(res,e)=>{ ti.disabled=true; $('#tsub').disabled=true; $('#tskip').disabled=true; ti.classList.add(res==='no'?'ko':'ok');
      if(res==='no') answer(false,r.it,r.it.a,e); else { S.daily.typed=(S.daily.typed||0)+1; answer(true,r.it,r.it.a,e,res==='near'?`On écrit : ${r.it.a}`:null); } };
    $('#tf').onsubmit=e=>{ e.preventDefault(); if(!ti.value.trim()) return; const rc=ti.getBoundingClientRect(); done(checkTyped(ti.value,r.it.a),{clientX:rc.left+rc.width/2,clientY:rc.top}); };
    $('#tskip').onclick=()=>done('no');
  } else if(r.t==='recall'){
    st.innerHTML=`${combo}<p class="prompt">Te souviens-tu du verso ?</p>
      <div class="flip" id="flip"><div class="flip-in"><div class="face qcard">${tg}<div class="big">${esc(r.it.q)}</div><div class="sub">Réfléchis, puis retourne la carte</div></div>
      <div class="face qcard b"><span class="tg">Réponse</span>${spk(r.it.a,r.it)}<div class="big">${esc(r.it.a)}</div></div></div></div>
      <div id="rc"><button class="btn line wide" id="turn">Retourner la carte</button></div>`;
    const turn=()=>{ $('#flip').classList.add('on'); SFX.flip();
      $('#rc').innerHTML=`<div class="vf"><button class="btn good" data-k="1">Je savais</button><button class="btn bad" data-k="0">Pas encore</button></div>`;
      $$('[data-k]',$('#rc')).forEach(b=>b.onclick=e=>{ $$('[data-k]',$('#rc')).forEach(x=>x.disabled=true); answer(b.dataset.k==='1', r.it, r.it.a, e); }); };
    $('#turn').onclick=turn; $('#flip').onclick=e=>{ if(e.target.closest('[data-say]')) return; if(!$('#flip').classList.contains('on')) turn(); };
  } else if(r.t==='memory'){
    const tiles=shuffle(r.its.flatMap((it,i)=>[{p:i,s:'q',txt:it.q},{p:i,s:'a',txt:it.a}]));
    let sel=null, left=r.its.length, miss=0;
    st.innerHTML=`${combo}<p class="prompt">Memory · associe chaque paire</p><div class="memo">${tiles.map((t,i)=>`<button class="tile ${t.s}" data-t="${i}">${esc(t.txt)}</button>`).join('')}</div>`;
    $$('.tile',st).forEach(b=>b.onclick=e=>{
      const t=tiles[+b.dataset.t];
      if(sel===null){ sel=b; b.classList.add('sel'); SFX.flip(); return; }
      if(sel===b){ b.classList.remove('sel'); sel=null; return; }
      const t0=tiles[+sel.dataset.t];
      if(t0.p===t.p && t0.s!==t.s){ [sel,b].forEach(x=>{x.classList.remove('sel');x.classList.add('done');}); left--; L.combo++; L.maxCombo=Math.max(L.maxCombo,L.combo); L.ok++; L.xp+=3; SFX.good(); floatXP('+3',e.clientX,e.clientY);
        if(!left){ S.daily.memory++; setTimeout(()=>showFB(true,'Memory gagné !', miss?`${miss} erreur${miss>1?'s':''} d’association`:'Parfait, aucune erreur'),350); }
      } else { const a=sel; [a,b].forEach(x=>{x.classList.remove('sel');x.classList.add('ko');}); setTimeout(()=>[a,b].forEach(x=>x.classList.remove('ko')),420); miss++; L.combo=0; SFX.bad(); }
      sel=null; });
  }
}
function answer(ok, it, solution, e, note){
  const s=S.srs[it.k]||{b:0,due:today()};
  if(ok){ L.combo++; L.ok++; L.maxCombo=Math.max(L.maxCombo,L.combo); const g=5+(L.combo>=3?2:0)+(L.combo>=6?3:0); L.xp+=g; s.b=Math.min(5,s.b+1); s.due=addDays(today(),IV[s.b]);
    SFX.good(); if(e) floatXP('+'+g, e.clientX||innerWidth/2, e.clientY||innerHeight/2);
    showFB(true, note?'Presque !':pick(['Bien joué !','Excellent !','Parfait !','Bravo !','Exact !']), (note?note+' · ':'')+(L.combo>=3?`Combo ×${L.combo} · +${g} XP`:`+${g} XP`));
  } else { L.combo=0; L.ko++; L.hearts--; s.b=0; s.due=today(); SFX.bad();
    if(!L.retry.has(it.k) && L.hearts>0){ L.retry.add(it.k); L.rounds.push({t:'qcm',it}); }
    showFB(false, 'Pas tout à fait', `Bonne réponse : ${solution}`); }
  S.srs[it.k]=s; hud();
}
function showFB(ok, title, text){
  const fb=$('#fb'); fb.hidden=false;
  if(ok===null){ fb.className='fb'; fb.innerHTML=`<button class="btn wide" id="next">Compris</button>`; const k=L.rounds[L.i].it.k; S.srs[k]=S.srs[k]||{b:0,due:today()}; }
  else { fb.className='fb '+(ok?'ok':'ko'); fb.innerHTML=`<h3>${esc(title)}</h3><p>${esc(text)}</p><button class="btn ${ok?'good':'bad'} wide" id="next">${!ok&&L.hearts<=0?'Voir le résultat':'Continuer'}</button>`; }
  $('#next').onclick=()=>{ if(L.hearts<=0) return endLesson(); L.i++; round(); };
  $('#next').focus({preventScroll:true});
}
function endLesson(){
  const failed=L.hearts<=0, stars=failed?0:L.hearts;
  const bonus=failed?0:10+stars*5, coins=failed?2:5+stars*5;
  S.stats.correct+=L.ok; S.stats.wrong+=L.ko; S.stats.bestCombo=Math.max(S.stats.bestCombo,L.maxCombo);
  S.daily.correct+=L.ok; S.daily.maxCombo=Math.max(S.daily.maxCombo,L.maxCombo);
  if(L.review) S.daily.review+=L.ok+L.ko;
  else if(!failed){ S.stats.lessons++; S.daily.lessons++; if(stars===3) S.daily.perfect++; S.stars[L.ch.id]=Math.max(S.stars[L.ch.id]||0,stars); }
  S.coins+=coins; const totalXP=gainXP(L.xp+bonus); checkBadges(); save();
  $('#hearts').innerHTML=''; $('#lprog').style.width='100%'; $('#fb').hidden=true;
  const st=$('#stage'); st.className='stage end';
  st.innerHTML=`<p class="eyebrow">${esc(L.d.name)} · ${esc(L.ch.name)}</p>
    <h1 style="font-size:32px">${failed?'Plus de cœurs…':L.review?'Révision terminée':stars===3?'Sans faute !':'Leçon réussie !'}</h1>
    ${L.review||failed?'':`<div class="bigstars">${[1,2,3].map(s=>`<span class="${stars>=s?'':'off'}" style="animation-delay:${s*.18}s">★</span>`).join('')}</div>`}
    <p class="muted small" style="margin:0">${failed?'Tes réponses sont enregistrées : retente le chapitre pour gagner tes étoiles.':`${L.ok} bonne${L.ok>1?'s':''} réponse${L.ok>1?'s':''} · ${L.ko} erreur${L.ko>1?'s':''}`}</p>
    <div class="rewards"><div class="reward"><b class="num">+${totalXP}</b><small>XP${boostOn()?' (×2)':''}</small></div><div class="reward"><b class="num">+${coins}</b><small>Pièces</small></div><div class="reward"><b class="num">×${L.maxCombo}</b><small>Meilleur combo</small></div></div>
    <button class="btn wide" data-endok>Continuer</button>`;
  if(!failed){ SFX.win(); confetti(stars===3?180:90); } else SFX.bad();
}

/* ============================ BOOSTERS ============================ */
function roll(pool, minR){
  const rs=RORDER.filter(r=>RORDER.indexOf(r)>=RORDER.indexOf(minR||'c') && pool.some(c=>c.r===r));
  const tot=rs.reduce((s,r)=>s+RAR[r].w,0); let x=Math.random()*tot, rr=rs[0];
  for(const r of rs){ if((x-=RAR[r].w)<0){ rr=r; break; } }
  return pick(pool.filter(c=>c.r===rr));
}
const isWalkout = c=>c.r==='l'||c.r==='i'||(c.ovr||0)>=90;
let P=null;
function clearTimers(){ if(P&&P.timers){ P.timers.forEach(clearTimeout); P.timers=[]; } }
function openPack(domId){
  const pool = domId?allColl().filter(c=>c.dom.id===domId):allColl();
  const cards=[roll(pool),roll(pool),roll(pool,'r')];
  const res=cards.map(c=>{ const isNew=grantCard(c); let dup=0; if(!isNew){ dup=RAR[c.r].dup; S.coins+=dup; } return {c,isNew,dup}; })
    .sort((a,b)=>RORDER.indexOf(a.c.r)-RORDER.indexOf(b.c.r)||(a.c.ovr||0)-(b.c.ovr||0));
  S.stats.packs++; checkBadges(); save();
  const d=domId?getDom(domId):null, best=res[res.length-1].c, bc=RAR[best.r].col;
  const glow = best.r==='i'?1:best.r==='l'?.8:best.r==='e'?.45:0;
  P={res, i:-1, timers:[]};
  overlayShell(true).innerHTML=`<div class="lhead"><span style="flex:1"></span><button class="x" data-closepack aria-label="Fermer">✕</button></div>
    <div class="pstage" id="ps"><div class="beams" id="beams" style="--bc:${glow?bc:'rgba(255,255,255,.25)'}"></div><p class="eyebrow">Touche le booster pour l’ouvrir</p>
    <div class="bigpack" id="bp" style="--pc:${d?d.c:'#4b3fd6'};--glow:${glow};--gc:${bc}" role="button" tabindex="0"><small>Booster ${SEASON}</small><span class="e">${d?d.icon:'🎴'}</span><b>${d?esc(d.name):'Surprise'}</b><small>3 cartes</small></div>
    ${glow?`<p class="small" style="color:${bc};font-weight:800;margin:0">✨ Ce booster brille…</p>`:''}</div>`;
  if(glow) setTimeout(()=>{ const b=$('#beams'); if(b) b.classList.add('on'); },300);
  const bp=$('#bp'); const go=()=>{ if(bp.classList.contains('tear')) return; bp.classList.add('tear');
    tone([[300,.08,'square',.05],[600,.08,'square',.05],[900,.12,'square',.05]]);
    setTimeout(()=>{ if(!P) return; flash(glow?bc:'#ffffff'); nextCard(); },650); };
  bp.onclick=go; bp.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } };
}
function nextCard(){
  if(!P) return; clearTimers(); P.i++;
  if(P.i>=P.res.length) return packSummary();
  const x=P.res[P.i];
  if(isWalkout(x.c) && !reduced) walkout(x); else showReveal(x,false);
}
function walkout(x){
  const c=x.c, col=RAR[c.r].col, ps=$('#ps');
  let steps;
  if(c.ovr){ const club=c.team&&TEAMS[c.team];
    steps=[[c.nat,'flag'],[c.pos==='ATP'||c.pos==='WTA'?'Circuit '+c.pos:c.pos,''],[club?`<span class="crest">${crestSVG(c.team)}</span>`:(c.r==='i'?'🌟':c.dom.icon),'flag raw'],[c.team||c.dom.name,'']]; }
  else steps=[[c.dom.icon,'flag'],[RAR[c.r].n,''],[c.dom.name,'']];
  ps.innerHTML=`<div class="beams on" style="--bc:${col}"></div><div class="walkout" id="wo"></div><p class="wo-hint">Touche pour passer</p>`;
  ps.onclick=()=>{ ps.onclick=null; showReveal(x,true); };
  SFX.rise();
  steps.forEach(([t,cls],k)=>P.timers.push(setTimeout(()=>{ const w=$('#wo'); if(!w) return; w.innerHTML=`<div class="wo-step ${cls}" style="--bc:${col}">${cls.includes('raw')?t:esc(t)}</div>`; SFX.tick(); }, 250+k*950)));
  P.timers.push(setTimeout(()=>{ ps.onclick=null; showReveal(x,true); }, 250+steps.length*950+200));
}
function showReveal(x, big){
  if(!P) return; clearTimers();
  const c=x.c, col=RAR[c.r].col, ps=$('#ps'); ps.onclick=null;
  const last=P.i===P.res.length-1;
  ps.innerHTML=`<div class="beams ${c.r!=='c'?'on':''}" style="--bc:${col}"></div>${big?`<span class="shock" style="--bc:${col}"></span>`:''}
    <p class="eyebrow">Carte ${P.i+1}/${P.res.length} · <span style="color:${col}">${RAR[c.r].n}</span></p>
    <div class="reveal-one ${big?'slam':''}">${cardHTML(c,{nobtn:true})}</div>
    <div class="rlabel ${x.isNew?'new':'dup'}">${x.isNew?'Nouvelle carte !':`Doublon · +${x.dup} pièces`}</div>
    <p class="small" style="margin:0;max-width:340px;color:#a9b0bd">${c.news?'📰 '+esc(c.news):esc(c.f)}</p>
    <button class="btn ${last?'gold':''}" id="nextc">${last?'Voir mes 3 cartes':'Carte suivante'}</button>`;
  $('#nextc').onclick=nextCard;
  if(big){ flash(col); SFX.boom(); setTimeout(()=>SFX.rare(),150); confetti(c.r==='i'?220:160, c.r==='i'?['#ff7ad9','#7ae1ff','#fff27a','#ffffff']:[col,'#ffffff','#fff3c4']); }
  else if(c.r==='e'){ SFX.rare(); confetti(70,[col,'#ffffff']); }
  else if(c.r==='r'){ tone([[880,.08],[1320,.16]]); }
  else SFX.flip();
}
function packSummary(){
  $('#ps').innerHTML=`<p class="eyebrow">Ton booster</p><div class="summary">${P.res.map(x=>`<div>${cardHTML(x.c,{nobtn:true})}<div class="rlabel ${x.isNew?'new':'dup'}">${x.isNew?'Nouvelle':`+${x.dup} pièces`}</div></div>`).join('')}</div>
    <button class="btn gold" data-closepack>Ajouter à ma collection</button>`;
}

/* ============================ MODALES ============================ */
function modal(html){ $('#modal').innerHTML=`<div class="modal-bg" data-mclose><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`; }
function closeModal(){ $('#modal').innerHTML=''; }
function showCard(id){ const c=allColl().find(x=>x.id===id); if(!c) return;
  const g=groupOf(c,'team');
  modal(`<div class="tilt">${cardHTML(c,{nobtn:true})}</div>
    <div class="row" style="justify-content:center;gap:8px;flex-wrap:wrap"><span class="tag" style="color:${RAR[c.r].col}">● ${RAR[c.r].n}</span><span class="tag">${g.icon} ${esc(g.k)}</span>${S.serial[c.id]?`<span class="tag num">n° ${S.serial[c.id]}/${RAR[c.r].sup}</span>`:''}<span class="tag">×${S.coll[c.id]||0}</span></div>
    ${c.st?`<div class="kv"><div><small>NOTE</small><b class="num">${c.ovr}</b></div>${c.dom.stl.map((l,i)=>`<div><small>${l}</small><b class="num">${c.st[i]}</b></div>`).join('')}</div>`:''}
    <p style="margin:0;font-weight:600;font-size:15px;text-align:center">${esc(c.f)}</p>
    ${c.news?`<div class="card"><div class="news" style="border-top:0"><time>${RES_DATE.split(' ').slice(0,2).join(' ')}</time><p>${esc(c.news)}</p></div></div>`:''}
    ${c.credit?`<p class="xs faint" style="margin:0;text-align:center">Photo : ${esc(c.credit)}${c.src?` · <a href="${esc(c.src)}" target="_blank" rel="noopener" style="color:inherit">source</a>`:''}</p>`:''}
    ${c.ovr?`<p class="xs faint" style="margin:0;text-align:center">${c.img?'Notes':'Illustration et notes'} créées pour le jeu, pas des statistiques officielles.</p>`:''}
    <button class="btn line wide" data-mclose>Fermer</button>`);
}
function createForm(){
  const icons=['📚','🎸','🧪','🏀','🌍','🍳','💻','🎨','🇮🇹','🇩🇪','🧠','♟️'];
  modal(`<h2 style="font-size:20px">Créer mon domaine</h2>
    <label class="f" for="cname">Nom du domaine<input type="text" id="cname" maxlength="30" placeholder="Ex. Italien, Histoire, Code de la route…"></label>
    <div><p class="eyebrow" style="margin-bottom:6px">Icône</p><div class="chips" id="cicons" style="flex-wrap:wrap">${icons.map((ic,i)=>`<button data-ic="${ic}" aria-pressed="${i===0}">${ic}</button>`).join('')}</div></div>
    <label class="f" for="citems">Tes cartes : une par ligne, « question = réponse »
      <textarea id="citems" placeholder="Bonjour = Ciao&#10;Merci = Grazie&#10;Oui = Sì&#10;Non = No"></textarea></label>
    <small class="xs muted" id="cmsg">Au moins 4 cartes. Elles seront rangées par séries de 8.</small>
    <div class="row"><button class="btn" id="csave">Créer</button><button class="btn line" data-mclose>Annuler</button></div>`);
  let icon=icons[0];
  $('#cicons').onclick=e=>{ const b=e.target.closest('[data-ic]'); if(!b) return; icon=b.dataset.ic; $$('#cicons button').forEach(x=>x.setAttribute('aria-pressed',x===b)); };
  $('#csave').onclick=()=>{
    const name=$('#cname').value.trim(), msg=$('#cmsg');
    const items=$('#citems').value.split('\n').map(l=>l.split(/\s*[=;\t]\s*/)).filter(p=>p.length>=2&&p[0].trim()&&p[1].trim()).map(p=>[p[0].trim(),p.slice(1).join(' = ').trim()]);
    if(!name){ msg.textContent='Donne un nom à ton domaine.'; msg.style.color='var(--bad)'; return; }
    if(items.length<4){ msg.textContent=`Il faut au moins 4 cartes valides (${items.length} pour l’instant). Format : question = réponse.`; msg.style.color='var(--bad)'; return; }
    const id='c'+Date.now().toString(36); S.custom.push({id,name,icon,items}); checkBadges(); save(); closeModal(); UI.tab='learn'; UI.dom=id; UI.dtab='path'; render(); toast(`Domaine « ${name} » créé · ${items.length} cartes`);
  };
  setTimeout(()=>$('#cname').focus(),50);
}

/* ============================ ÉVÉNEMENTS ============================ */
document.addEventListener('click', e=>{
  const t=e.target.closest('button,[data-mclose]'); if(!t) return;
  const ds=t.dataset;
  if('mclose' in ds){ if(t.classList.contains('modal-bg') && e.target!==t) return; return closeModal(); }
  if(ds.say){ speak(ds.say, ds.lang); return; }
  if(ds.tab){ UI.tab=ds.tab; UI.confirmReset=false; if(ds.tab!=='learn') UI.dom=null; render(); scrollTo(0,0); return; }
  if(ds.claim!==undefined){ const q=S.quests[+ds.claim]; if(q&&!q.claimed&&qProgress(q)>=q.n){ q.claimed=true; S.coins+=q.r; save(); SFX.coin(); floatXP('+'+q.r, e.clientX, e.clientY); render(); } return; }
  if('chest' in ds){ if(S.quests.every(q=>q.claimed)&&!S.chest){ S.chest=true; S.packs++; S.coins+=30; save(); SFX.win(); confetti(); toast('Coffre ouvert : +30 pièces et un booster'); render(); } return; }
  if(ds.go==='continue'){ if(S.lastCh && findCh(S.lastCh)) startLesson(S.lastCh); else { UI.tab='learn'; render(); } return; }
  if('review' in ds) return startReview();
  if('wheel' in ds) return openWheel();
  if(ds.blitz){ closeModal(); if(G) { clearInterval(G.timer); G=null; } return startBlitz(ds.blitz); }
  if(ds.duel){ G=null; return startDuel(ds.duel); }
  if('pick' in ds){ G=null; return startPick(); }
  if(ds.gamedom){ UI.gameDom=ds.gamedom; render(); return; }
  if(ds.dueldom){ UI.duelDom=ds.dueldom; render(); return; }
  if('quitgame' in ds){ modal(`<h2 style="font-size:20px">Quitter la partie ?</h2><p class="muted small" style="margin:0">Cette partie ne sera pas comptée.</p><div class="row"><button class="btn bad" data-quitok>Quitter</button><button class="btn line" data-mclose>Continuer</button></div>`); return; }
  if(ds.gores){ UI.tab='learn'; UI.dom=ds.gores; UI.dtab='res'; render(); scrollTo(0,0); return; }
  if('open' in ds){ if(S.packs>0){ S.packs--; save(); openPack(null); } return; }
  if('buy' in ds){ if(S.coins>=PACK_PRICE){ S.coins-=PACK_PRICE; SFX.coin(); openPack(null); } return; }
  if(ds.buydom){ if(S.coins>=DPACK_PRICE){ S.coins-=DPACK_PRICE; SFX.coin(); openPack(ds.buydom); } return; }
  if(ds.shopdom){ UI.shopDom=ds.shopdom; render(); return; }
  if(ds.cards){ UI.cards=ds.cards; render(); return; }
  if(ds.colldom){ UI.collDom=ds.colldom; render(); return; }
  if(ds.group){ UI.group=ds.group; render(); return; }
  if(ds.lcat){ UI.learnCat=ds.lcat; render(); return; }
  if('freeze' in ds){ if(S.coins>=FREEZE_PRICE&&S.freezes<2){ S.coins-=FREEZE_PRICE; S.freezes++; save(); SFX.coin(); toast('Gel de série ajouté'); render(); } return; }
  if(ds.dom){ UI.dom=ds.dom; UI.dtab='path'; render(); scrollTo(0,0); return; }
  if(ds.dtab){ UI.dtab=ds.dtab; render(); return; }
  if(ds.lvl!==undefined){ const d=getDom(UI.dom); if(d){ S.lvl[d.id]=+ds.lvl; save(); render(); if(+ds.lvl>0) toast(`Niveau ${d.levels[+ds.lvl].name} activé`); } return; }
  if('back' in ds){ UI.dom=null; render(); return; }
  if(ds.ch){ if(ds.why){ toast(ds.why); return; } return startLesson(ds.ch); }
  if('create' in ds) return createForm();
  if(ds.delcustom){ S.custom=S.custom.filter(c=>c.id!==ds.delcustom); UI.dom=null; save(); render(); toast('Domaine supprimé'); return; }
  if(ds.card) return showCard(ds.card);
  if(ds.goal){ S.goal=+ds.goal; save(); render(); return; }
  if(ds.theme){ S.theme=ds.theme; applyTheme(); save(); render(); return; }
  if(ds.sound!==undefined){ S.sound=ds.sound==='1'; save(); render(); return; }
  if('export' in ds){ const code='CARTO1:'+btoa(unescape(encodeURIComponent(JSON.stringify(S)))); const ta=$('#xcode'); ta.hidden=false; ta.value=code; ta.select();
    try{ navigator.clipboard.writeText(code).then(()=>toast('Code copié'),()=>toast('Sélectionne le code et copie-le')); }catch(_){ toast('Sélectionne le code et copie-le'); } return; }
  if(ds.import==='ask'){ const v=($('#icode').value||'').trim(); if(!v.startsWith('CARTO1:')){ $('#imsg').textContent='Colle d’abord un code qui commence par CARTO1:'; $('#imsg').style.color='var(--bad)'; return; } UI.pendingImport=v; UI.confirmImport=true; render(); return; }
  if(ds.import==='no'){ UI.confirmImport=false; UI.pendingImport=null; render(); return; }
  if(ds.import==='yes'){ try{ const o=JSON.parse(decodeURIComponent(escape(atob(UI.pendingImport.slice(7))))); if(!o||typeof o!=='object'||typeof o.xp!=='number') throw 0;
      S=Object.assign(DEF(),o); S.stats=Object.assign(DEF().stats,S.stats); save(); applyTheme(); toast('Progression importée'); }catch(_){ toast('Code invalide : vérifie qu’il est complet'); }
    UI.confirmImport=false; UI.pendingImport=null; render(); return; }
  if(ds.reset==='ask'){ UI.confirmReset=true; render(); return; }
  if(ds.reset==='no'){ UI.confirmReset=false; render(); return; }
  if(ds.reset==='yes'){ S=DEF(); UI.confirmReset=false; applyTheme(); save(); render(); toast('Progression effacée'); return; }
  if(ds.scanlang){ S.scanLang=ds.scanlang; save(); render(); return; }
  if('scanrun' in ds) return runScan();
  if('scanadd' in ds) return addScanToDeck();
  if('gophoto' in ds){ const c=S.custom.find(x=>x.photo); if(c){ UI.tab='learn'; UI.dom=c.id; UI.dtab='path'; render(); scrollTo(0,0); } return; }
  if('quit' in ds){ if(!L) return; modal(`<h2 style="font-size:20px">Quitter la leçon ?</h2><p class="muted small" style="margin:0">Les XP et les étoiles de cette leçon ne seront pas comptés.</p><div class="row"><button class="btn bad" data-quitok>Quitter</button><button class="btn line" data-mclose>Rester</button></div>`); return; }
  if('quitok' in ds){ closeModal(); return closeOverlay(); }
  if('endok' in ds) return closeOverlay();
  if('closepack' in ds) return closeOverlay();
});
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && $('#modal').innerHTML) closeModal(); });
document.addEventListener('visibilitychange', ()=>{ if(!document.hidden && !L && !P && !G && S.day!==today()) render(); });
setInterval(()=>{ if(!L&&!P&&!G&&(S.boostUntil||0)>0&&Math.abs(S.boostUntil-Date.now())<61000) render(); },60000);

render();
