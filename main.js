const CHROMATIC=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const NOTE_DISPLAY={'C#':'C#','D#':'D#','F#':'F#','G#':'G#','A#':'Bb'};
const MAJOR_INTERVALS=[0,2,4,5,7,9,11];
const STRING_NAMES=["6ª (E)","5ª (A)","4ª (D)","3ª (G)","2ª (B)","1ª (e)"];
const OPEN_FRETS=[0,5,10,15,19,24];

const FORMS_DEF=[
  {label:"1ª",startName:"7° grado (s sotto Root)",shift:[4],
   degrees:[[6,0,1],[2,3,4],[5,6,0],[1,2,3],[4,5,6],[0,1,2]]},
  {label:"2ª",startName:"Root (1° grado)",shift:[2,4],
   degrees:[[0,1,2],[3,4,5],[6,0,1],[2,3,4],[5,6,0],[1,2,3]]},
  {label:"3ª",startName:"2° grado (+1T dalla Root)",shift:[4],
   degrees:[[1,2,3],[4,5,6],[0,1,2],[3,4,5],[6,0,1],[2,3,4]]},
  {label:"4ª",startName:"3° grado (+2T dalla Root)",shift:[4],
   degrees:[[2,3,4],[5,6,0],[1,2,3],[4,5,6],[0,1,2],[3,4,5]]},
  {label:"5ª",startName:"4° grado (+2T+s dalla Root)",shift:[4],
   degrees:[[3,4,5],[6,0,1],[2,3,4],[5,6,0],[1,2,3],[4,5,6]]},
  {label:"6ª",startName:"5° grado (+3T+s dalla Root)",shift:[4],
   degrees:[[4,5,6],[0,1,2],[3,4,5],[6,0,1],[2,3,4],[5,6,0]]},
  {label:"7ª",startName:"6° grado (+4T+s dalla Root)",shift:[4],
   degrees:[[5,6,0],[1,2,3],[4,5,6],[0,1,2],[3,4,5],[6,0,1]]},
];

const MODES=[
  {name:"Ionian",num:"I",degree:0,color:"#6fcf6f",type:"Maggiore",
   intervals:"T · T · s · T · T · T · s",formula:"1  2  3  4  5  6  7",
   sound:"Luminoso, stabile, classico",use:"Accordi maggiori, progressioni diatoniche",
   vibe:"Il suono 'di casa' — caldo, risolto, ottimista. Base di tutta la musica occidentale.",
   chords:["I maj7","ii m7","iii m7","IV maj7","V 7","vi m7","vii m7b5"],semis:[0,2,4,5,7,9,11]},
  {name:"Dorian",num:"II",degree:2,color:"#4a9eff",type:"Minore",
   intervals:"T · s · T · T · T · s · T",formula:"1  2  b3  4  5  6  b7",
   sound:"Minore con sesto maggiore",use:"Jazz, funk, rock — su accordi minori",
   vibe:"Minore sofisticato. Malinconico ma non buio — quel b3 con il 6 naturale lo rende elegante.",
   chords:["i m7","ii m7b5","bIII maj7","IV 7","v m7","vi m7b5","bVII maj7"],semis:[0,2,3,5,7,9,10]},
  {name:"Phrygian",num:"III",degree:4,color:"#e05252",type:"Minore",
   intervals:"s · T · T · T · s · T · T",formula:"1  b2  b3  4  5  b6  b7",
   sound:"Scuro, esotico, flamenco",use:"Metal, flamenco, musica spagnola",
   vibe:"Oscuro e misterioso. Quel b2 iniziale crea tensione immediata — suono spagnolo o metal.",
   chords:["i m7","bII maj7","bIII 7","iv m7","v m7b5","bVI maj7","bvii m7"],semis:[0,1,3,5,7,8,10]},
  {name:"Lydian",num:"IV",degree:5,color:"#d4c24a",type:"Maggiore",
   intervals:"T · T · T · s · T · T · s",formula:"1  2  3  #4  5  6  7",
   sound:"Maggiore con quarta aumentata — onirico",use:"Film scores, jazz fusion, suono sognante",
   vibe:"Come il maggiore ma con un #4 che galleggia. Suono magico, usatissimo da Morricone.",
   chords:["I maj7#11","II 7","iii m7","#iv m7b5","V maj7","vi m7","vii m7"],semis:[0,2,4,6,7,9,11]},
  {name:"Mixolydian",num:"V",degree:7,color:"#e0925a",type:"Maggiore (b7)",
   intervals:"T · T · s · T · T · s · T",formula:"1  2  3  4  5  6  b7",
   sound:"Maggiore con settima minore",use:"Blues, rock, country, accordi dominanti",
   vibe:"Maggiore con quel b7 che lo rende grintoso. Il modo del blues e del rock classico.",
   chords:["I 7","ii m7","iii m7b5","IV maj7","v m7","vi m7","bVII maj7"],semis:[0,2,4,5,7,9,10]},
  {name:"Aeolian",num:"VI",degree:9,color:"#9b6fe0",type:"Minore naturale",
   intervals:"T · s · T · T · s · T · T",formula:"1  2  b3  4  5  b6  b7",
   sound:"Minore naturale — triste, emotivo",use:"Rock, pop, ballate — il minore standard",
   vibe:"La scala minore naturale. Emotiva, nostalgica, malinconica. La più usata nel pop e rock.",
   chords:["i m7","ii m7b5","bIII maj7","iv m7","v m7","bVI maj7","bVII 7"],semis:[0,2,3,5,7,8,10]},
  {name:"Locrian",num:"VII",degree:11,color:"#e05298",type:"Diminuito",
   intervals:"s · T · T · s · T · T · T",formula:"1  b2  b3  4  b5  b6  b7",
   sound:"Instabile, teso, raramente usato da solo",use:"Jazz, metal — su accordi m7b5",
   vibe:"Il modo più oscuro e instabile. Quella b5 toglie ogni stabilità. Usato sopra ii m7b5 nel jazz.",
   chords:["i m7b5","bII maj7","biii m7","iv m7","bV maj7","bVI 7","bvii m7"],semis:[0,1,3,5,6,8,10]},
];

let rootIdx=7, curForm=0, curView='pos', expandedMode=null;

function nn(c){return NOTE_DISPLAY[CHROMATIC[c%12]]||CHROMATIC[c%12];}
function getScaleNotes(r){return MAJOR_INTERVALS.map(i=>CHROMATIC[(r+i)%12]);}

function renderRootGrid(){
  document.getElementById('root-grid').innerHTML=CHROMATIC.map((n,i)=>{
    const d=NOTE_DISPLAY[n]||n;
    return `<button class="root-btn ${i===rootIdx?'active':''}" onclick="setRoot(${i})">${d}</button>`;
  }).join('');
}

function renderTabs(){
  document.getElementById('tabs').innerHTML=FORMS_DEF.map((f,i)=>
    `<button class="tab ${i===curForm?'active':''}" onclick="setForm(${i})">${f.label}</button>`
  ).join('');
}

function getInterval(c1,c2){
  const d=(c2-c1+12)%12;
  if(d===1)return 's';if(d===2)return 'T';if(d===3)return 'Ts';if(d===4)return 'TT';return d+'st';
}

function renderPositions(){
  const scale=getScaleNotes(rootIdx);
  const form=FORMS_DEF[curForm];
  document.getElementById('key-badge').textContent=nn(rootIdx)+' MAJ';
  document.getElementById('scale-subtitle').textContent=scale.map(n=>NOTE_DISPLAY[n]||n).join(' · ');

  const recalc=form.degrees.map((degs,si)=>{
    const open=OPEN_FRETS[si];
    return degs.map(d=>{
      const chromatic=(rootIdx+MAJOR_INTERVALS[d%7])%12;
      let fret=(chromatic-(open%12)+12)%12;
      if(fret===0)fret=12;
      return {note:nn(chromatic),fret,chromatic,isRoot:chromatic===rootIdx};
    });
  });
  recalc.forEach(str=>{for(let ni=1;ni<str.length;ni++)while(str[ni].fret<=str[ni-1].fret)str[ni].fret+=12;});
  const refFret=recalc[0].find(n=>n.isRoot)?.fret||recalc[0][0].fret;
  const shiftOct=refFret>12?-12:0;
  recalc.forEach(str=>str.forEach(n=>{n.fret+=shiftOct;if(n.fret<=0)n.fret+=12;}));

  let html=`<div class="card"><div class="form-header"><div class="form-title">${form.label} Forma</div><div class="form-start">${form.startName}</div></div>`;
  recalc.forEach((str,si)=>{
    if(form.shift.includes(si))html+=`<div class="shift-row"><span class="shift-badge">↓ shift posizione</span></div>`;
    html+=`<div class="str-row"><div class="str-name">${STRING_NAMES[si]}</div><div class="cells">`;
    str.forEach((note,ni)=>{
      const prev=ni>0?str[ni-1]:null;
      const intv=prev?getInterval(prev.chromatic,note.chromatic):'';
      html+=`<div class="cell"><div class="cell-meta">${ni>0?`<span>${intv}</span><span>→</span>`:''}</div><div class="dot ${note.isRoot?'dot-r':'dot-n'}">${note.note}<span class="fret-n">${note.fret}</span></div></div>`;
    });
    html+=`</div></div>`;
  });
  html+=`<div class="scale-notes"><span class="scale-label">Scala</span>`;
  scale.forEach(n=>{
    const disp=NOTE_DISPLAY[n]||n;
    const isR=CHROMATIC.indexOf(n)===rootIdx;
    html+=`<span class="scale-note ${isR?'is-root':''}">${disp}</span>`;
  });
  html+=`</div></div>`;
  document.getElementById('content').innerHTML=html;
}

function renderModi(){
  document.getElementById('key-badge').textContent=nn(rootIdx)+' MAJ';
  const scale=getScaleNotes(rootIdx);
  document.getElementById('scale-subtitle').textContent=scale.map(n=>NOTE_DISPLAY[n]||n).join(' · ');

  let html='<div class="modes-grid">';
  MODES.forEach((m,mi)=>{
    const mrc=(rootIdx+m.degree)%12;
    const mrn=nn(mrc);
    const modeNotes=m.semis.map(s=>nn((mrc+s)%12));
    const isExp=expandedMode===mi;
    html+=`<div class="mode-card ${isExp?'expanded':''}" onclick="toggleMode(${mi})">
      <div class="mode-header">
        <div class="mode-dot" style="background:${m.color}"></div>
        <div class="mode-num">${m.num}</div>
        <div class="mode-name" style="color:${m.color}">${m.name}</div>
        <div class="mode-root-badge">${mrn}</div>
        <div class="mode-type">${m.type}</div>
        <div class="mode-chevron">▶</div>
      </div>
      <div class="mode-body">
        <div class="mode-notes-row">`;
    modeNotes.forEach((n,ni)=>{
      const isR=ni===0;
      html+=`<span class="mode-note-pill" style="${isR?`background:${m.color}20;color:${m.color};border-color:${m.color};border-width:1.5px`:''}">${n}</span>`;
    });
    html+=`</div>
        <div class="mode-intervals">${m.intervals}</div>
        <div class="mode-info-grid">
          <div class="mode-info-item"><div class="mode-info-label">Formula</div><div class="mode-info-val">${m.formula}</div></div>
          <div class="mode-info-item"><div class="mode-info-label">Carattere</div><div class="mode-info-val">${m.sound}</div></div>
          <div class="mode-info-item" style="grid-column:1/-1"><div class="mode-info-label">Uso tipico</div><div class="mode-info-val">${m.use}</div></div>
        </div>
        <div class="mode-vibe">${m.vibe}</div>
        <div class="mode-info-label" style="margin-bottom:6px">Accordi diatonici</div>
        <div class="mode-chords-row">`;
    m.chords.forEach(c=>{html+=`<span class="chord-pill">${c}</span>`;});
    html+=`</div></div></div>`;
  });
  html+='</div>';
  document.getElementById('modes-content').innerHTML=html;
}

function toggleMode(idx){expandedMode=expandedMode===idx?null:idx;renderModi();}

function setView(v){
  curView=v;
  document.querySelectorAll('.view-btn').forEach((b,i)=>b.classList.toggle('active',(i===0&&v==='pos')||(i===1&&v==='modi')));
  document.getElementById('view-pos').style.display=v==='pos'?'':'none';
  document.getElementById('view-modi').style.display=v==='modi'?'':'none';
  if(v==='modi')renderModi();else renderPositions();
}

function setRoot(idx){rootIdx=idx;renderRootGrid();if(curView==='pos')renderPositions();else renderModi();}
function setForm(idx){curForm=idx;renderTabs();renderPositions();}

renderRootGrid();renderTabs();renderPositions();