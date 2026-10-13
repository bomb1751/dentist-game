const $=id=>document.getElementById(id), E=Play.ellipse, P=Play.path, R=Play.rect;
const cases=[
 {name:'感冒',person:'小米',skin:'#f5caa9',hair:'#714c39',symptom:'鼻子一直流鼻水，喉嚨也不舒服。',steps:['temp','throat','listen','medicine','water']},
 {name:'肚子痛',person:'小樂',skin:'#dca67b',hair:'#493b37',symptom:'肚子怪怪的，想請醫生幫忙看看。',steps:['temp','belly','water','rest']},
 {name:'耳朵不舒服',person:'小安',skin:'#f0bd99',hair:'#313c52',symptom:'耳朵悶悶的，有點不舒服。',steps:['temp','ear','medicine','water']},
 {name:'咳嗽',person:'小晴',skin:'#efcfb5',hair:'#a66f41',symptom:'咳咳！請幫我看看喉嚨，聽聽呼吸。',steps:['temp','throat','listen','water','rest']},
 {name:'打預防針',person:'小豆',skin:'#c68f6b',hair:'#554237',symptom:'今天來打預防針，請溫柔陪著我。',steps:['temp','swab','shot','bandage']}
];
const tasks={temp:['量耳溫','耳溫槍','拖耳溫槍到耳朵，停留一下。',[[322,147]],'hold'],ear:['看看耳朵','耳鏡','把耳鏡拖到耳朵，沿著耳朵慢慢看看。',[[322,147]],'hold'],throat:['看看喉嚨','小手電筒','把手電筒拖到嘴巴，照亮喉嚨。',[[240,176]],'hold'],listen:['聽聽呼吸','聽診器','拖聽診器到胸前的兩個圈圈，各聽一下。',[[213,236],[272,236]],'hold'],belly:['聽聽肚子','聽診器','拖聽診器到肚子的三個圈圈，慢慢聽。',[[213,268],[268,268],[240,294]],'hold'],medicine:['吃準備好的藥','小藥匙','拖藥匙到嘴巴，慢慢停一下。',[[240,176]],'hold'],water:['喝一口水','水杯','拖水杯到嘴巴，喝一小口水。',[[240,176]],'hold'],rest:['蓋好小毯子','小毯子','拖毯子到身體，陪病人好好休息。',[[240,270]],'drop'],swab:['擦擦手臂','棉球','拖棉球到手臂，在圈圈裡來回擦。',[[319,243]],'rub'],shot:['打預防針','注射器','拖注射器到手臂，停留並慢慢完成。',[[319,243]],'hold'],bandage:['貼上小貼布','小貼布','拖貼布到手臂，貼好就完成了。',[[319,243]],'drop']};
let selected=0,step=0,amount=[],lastTime=0,lastPoint=null,done=false,transition=null,toolDown=false,zoom=false;
function toolArt(kind){
 const ink='#46536c',mint='#79caba',blue='#81c8e8';
 switch(kind){
 case 'temp':return R(24,28,24,50,9,mint,ink)+R(28,39,16,17,3,'#ecfff6')+P('M36 29V16H60V26H44V36',mint,ink)+R(30,64,12,6,3,'white');
 case 'ear':return R(34,37,18,45,7,mint,ink)+E(43,28,20,18,ink)+E(43,28,12,11,blue)+P('M61 21L79 27L61 34',ink);
 case 'throat':return R(30,38,22,44,6,'#efc769',ink)+P('M29 40L22 18H60L53 40Z',ink)+R(26,17,30,7,3,'#fff3a6');
 case 'listen':case 'belly':return P('M24 17V37Q24 58 43 58Q62 58 62 37V17','none',ink,6)+P('M43 58V67Q43 84 69 77V52','none',mint,6)+E(70,49,12,12,ink)+E(70,49,8,8,blue)+E(24,17,5,7,mint)+E(62,17,5,7,mint);
 case 'medicine':return P('M44 46V84','none',ink,8)+E(44,32,18,22,'#dae5ef',ink)+E(44,31,13,15,'#f5b86a');
 case 'water':return P('M24 24H68L63 80H29Z','#deeffa',ink)+P('M28 47H65L62 76H31Z',blue)+P('M29 29H61','none','white',4);
 case 'rest':return R(15,25,65,50,8,'#a6cbbb',ink)+P('M27 27V73M43 27V73M59 27V73','none','#d8eee6',4)+E(64,42,5,5,'#f7df9b');
 case 'swab':return E(43,49,25,23,'#fff', '#cad8e1')+E(33,39,12,10,'#f4f8fb')+P('M30 57Q44 65 58 50','none','#e4ecf0',3);
 case 'shot':return P('M67 18L19 77','none',ink,2)+P('M31 38L44 23L66 42L51 59Z','#d6edf4',ink)+P('M37 34L59 51','none',blue,10)+P('M58 32L71 18M66 13L77 23M26 43L48 63','none',ink,4);
 case 'bandage':return R(13,30,72,33,12,'#f2bb95',ink)+R(38,32,23,29,5,'#ffe1c7')+[23,30,70,77].map(x=>E(x,41,1.5,1.5,ink)+E(x,52,1.5,1.5,ink)).join('');
 }
}
function patientArt(){const c=cases[selected],skin=c.skin,hair=c.hair;
 return R(22,19,436,317,24,'#f6fbf8')+R(45,39,110,74,12,'#d3eae3')+P('M94 54V94M74 74H114','none','#fff',12)+R(343,43,85,55,9,'#e7edf6')+P('M354 70H369L376 57L384 82L392 69H414','none','#93c7bb',3)+E(240,330,105,13,'#d4e5e3')+R(183,275,48,55,15,'#7188ac')+R(249,275,48,55,15,'#7188ac')+R(174,210,132,91,27,'#f5c76f')+R(152,217,31,74,15,skin)+R(303,217,31,74,15,skin)+R(222,184,36,35,12,skin)+E(160,147,17,25,skin)+E(320,147,17,25,skin)+E(240,138,79,81,skin)+P('M163 128Q151 56 230 48Q318 41 320 122Q289 114 275 84Q236 112 163 128Z',hair)+E(208,140,6,8,'#34425b')+E(271,140,6,8,'#34425b')+P('M195 123Q207 118 220 123M260 123Q272 118 284 124','none',hair,4)+P('M239 148L235 158H245','none','#cc967f',3)+E(189,163,13,7,'#eea5a1')+E(291,163,13,7,'#eea5a1')+(done?P('M222 175Q240 192 258 175','none','#995e58',4):E(240,176,12,8,'#995e58'))+(selected===0&&!done?P('M244 159Q256 176 247 177Q241 174 244 159Z','#c4e7f4'):'');
}
function draw(){let art=patientArt();const key=cases[selected].steps[step];if(!done){const targets=tasks[key][3];targets.forEach(([x,y],i)=>art+=`<circle class="${amount[i]>=1?'':'target'}" cx="${x}" cy="${y}" r="${key==='rest'?49:22}" fill="${amount[i]>=1?'#99ddbd':'#fff8cd'}" fill-opacity=".55" stroke="${amount[i]>=1?'#42a583':'#d6a35c'}" stroke-width="3" stroke-dasharray="5 5"/>`);if(zoom&&(key==='ear'||key==='throat'))art+=R(30,133,115,122,18,'#fff','#a5cec3')+(key==='ear'?P('M71 156Q112 148 119 185Q124 222 91 236Q59 239 58 211Q59 186 77 183Q102 178 103 200Q101 215 87 214','none','#dea690',7):E(88,190,39,43,'#ba747f')+E(88,215,29,16,'#ef9aab')+P('M83 159V181Q88 194 93 181V159','#efb7ba'))+`<text x="88" y="274" text-anchor="middle" font-size="12">${key==='ear'?'耳朵放大看看':'喉嚨放大看看'}</text>`;}else art+=R(154,244,173,75,18,'#98cbb7')+`<text x="240" y="280" text-anchor="middle" font-size="21">謝謝小醫生！</text>`;
 $('scene').innerHTML=Play.svg(art);$('progress').style.width=(done?100:amount.reduce((a,b)=>a+Math.min(b,1),0)/amount.length*100)+'%';
}
function render(){Play.endDrag(null,true);toolDown=false;clearTimeout(transition);transition=null;zoom=false;lastPoint=null;amount=tasks[cases[selected].steps[Math.min(step,cases[selected].steps.length-1)]][3].map(()=>0);done=step>=cases[selected].steps.length;
 $('patientName').textContent=cases[selected].person+'的看診時間';$('symptom').textContent=cases[selected].symptom;$('counter').textContent=done?'照顧完成':`${step+1} / ${cases[selected].steps.length}`;
 $('cases').querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('selected',i===selected);b.setAttribute('aria-pressed',String(i===selected));});
 $('steps').innerHTML=cases[selected].steps.map((k,i)=>`<span class="step ${i<step?'done':i===step?'current':''}">${i<step?'✓ ':''}${tasks[k][0]}</span>`).join('');$('result').hidden=!done;$('tools').innerHTML='';
 if(done){$('taskTitle').textContent='你完成了溫柔的照顧';$('hint').textContent='可以換下一位病人，繼續當小醫生。';draw();return;}
 const key=cases[selected].steps[step],t=tasks[key];$('taskTitle').textContent=t[0];$('hint').textContent=t[2];const b=document.createElement('button');b.className='tile';b.innerHTML=Play.svg(toolArt(key),'0 0 96 96')+`<span>${t[1]}</span>`;b.setAttribute('aria-label',t[1]+'，'+t[2]);$('tools').append(b);
 b.addEventListener('pointerdown',event=>{toolDown=true;lastTime=performance.now();lastPoint=null;Play.startDrag(event,{html:Play.svg(toolArt(key),'0 0 96 96'),onMove:(x,y)=>work(x,y),onDrop:(x,y)=>{toolDown=false;if(t[4]==='drop')work(x,y,true);lastPoint=null;},onCancel:()=>{toolDown=false;lastPoint=null;}});});draw();
}
function work(x,y,drop=false){if(done||transition)return;const t=tasks[cases[selected].steps[step]],p=Play.point($('scene'),x,y),now=performance.now();const elapsed=Math.min((now-lastTime)/1000,.08);lastTime=now;if(!p.inside){lastPoint=null;return;}let index=t[3].findIndex(([tx,ty])=>Math.hypot(tx-p.x,ty-p.y)<(t[4]==='drop'?65:31));if(index<0){lastPoint=p;return;}if(t[4]==='drop'){if(drop)amount[index]=1;}else if(t[4]==='rub'){if(lastPoint)amount[index]+=Math.min(Math.hypot(p.x-lastPoint.x,p.y-lastPoint.y),15)/120;}else amount[index]+=elapsed/1.3;lastPoint=p;zoom=true;draw();if(amount.every(a=>a>=1)){toolDown=false;Play.endDrag(null,true);$('hint').textContent='✓ '+t[0]+'完成！';transition=setTimeout(()=>{step++;render();},700);}}
setInterval(()=>{if(toolDown&&Play.drag&&Play.ghost){const x=parseFloat(Play.ghost.style.left),y=parseFloat(Play.ghost.style.top);work(x,y);}},40);
function choose(i){selected=i;step=0;render();}
cases.forEach((c,i)=>{const b=document.createElement('button');b.className='tab';b.textContent=c.name;b.onclick=()=>choose(i);$('cases').append(b);});$('restart').onclick=()=>choose(selected);$('next').onclick=$('again').onclick=()=>choose((selected+1)%cases.length);
for(const b of document.querySelectorAll('.tab,.action')){let lastTouch=-Infinity;b.addEventListener('click',e=>{if(e.isTrusted&&e.detail>0&&performance.now()-lastTouch<700){e.preventDefault();e.stopImmediatePropagation();}},true);b.addEventListener('pointerup',e=>{if(e.pointerType==='touch'&&!b.disabled){lastTouch=performance.now();e.preventDefault();b.click();}});}
render();
