const {path:p,ellipse:e,rect:r}=Play;
const pets=[{name:'豆豆狗',fur:'#d3a47c',kind:'dog'},{name:'咪咪貓',fur:'#c1b0a0',kind:'cat'},{name:'棉花兔',fur:'#fff1de',kind:'rabbit'}];
const stepNames=['搓洗','沖水','吹乾','打扮'];
const toolNames={soap:'泡泡海綿',rinse:'小蓮蓬頭',dry:'吹風機',pink:'粉紅結',blue:'藍色結',gold:'黃色結'};
let petIndex=0,stage=0,selected=null,bow=null,totalPixels=1,celebrationTimer;
const scene=document.querySelector('#scene'),hint=document.querySelector('#hint'),dialog=document.querySelector('#celebration');
let canvas,ctx;
function bowArt(color){return p('M0 0L-30 -17Q-38 0 -30 17Z',color,'#8e6b77',2)+p('M0 0L30 -17Q38 0 30 17Z',color,'#8e6b77',2)+e(0,0,7,8,color,'#8e6b77',2);}
function toolArt(key){
 if(key==='soap')return r(-28,-17,56,34,10,'#f3ce65','#cba044')+[-13,3,17].map((x,i)=>e(x,-15-i%2*6,7,7,'#fffdf0','#eadab8')).join('')+e(-15,2,3,3,'#dcae45')+e(7,6,3,3,'#dcae45');
 if(key==='rinse')return p('M22 27L2 0','none','#8bafbd',10)+p('M-21 -9Q-8 -23 7 -8L-6 7Z','#c0dde6','#7493a1')+[-18,-9,0].map(x=>p(`M${x} 6L${x-8} 18`,'none','#72bad6',3)).join('');
 if(key==='dry')return r(-25,-13,43,26,12,'#e99aac','#bd6a86')+p('M15 -10L30 -13V13L15 10Z','#e99aac','#bd6a86')+p('M-4 10L5 29L-7 33L-14 12Z','#c888a1')+p('M-23 -5V5M-17 -5V5','none','#fff0e9',2);
 return bowArt({pink:'#ed9db4',blue:'#8fb8dc',gold:'#edc566'}[key]);
}
function animalArt(pet=pets[petIndex]){
 let art='';const c=pet.fur;
 if(pet.kind==='rabbit')art+=e(200, 65,20,52,c,'#c9aa90')+e(280,65,20,52,c,'#c9aa90')+e(200,63,10,36,'#e8b5bb')+e(280,63,10,36,'#e8b5bb');
 if(pet.kind==='dog')art+=p('M181 95Q126 97 151 184Q176 205 193 166Z','#a97555','#926345')+p('M299 95Q354 97 329 184Q304 205 287 166Z','#a97555','#926345');
 if(pet.kind==='cat')art+=p('M169 126L170 63L221 103Z',c,'#9c8676')+p('M311 126L310 63L259 103Z',c,'#9c8676')+p('M178 111L178 78L202 104Z','#e9b8b5')+p('M302 111L302 78L278 104Z','#e9b8b5');
 art+=e(240,216,82,76,c,'#b99375')+e(240,140,77,66,c,'#b99375')+e(197,276,25,18,c,'#b99375')+e(283,276,25,18,c,'#b99375')+e(240,178,38,24,'#fff0d9');
 art+=e(212,141,8,10,'#3e3845')+e(268,141,8,10,'#3e3845')+e(210,138,2.5,3,'#fff')+e(266,138,2.5,3,'#fff')+p('M230 168Q240 162 250 168L240 178Z',pet.kind==='dog'?'#645044':'#cf8d99')+p('M240 178Q228 192 220 182M240 178Q252 192 260 182','none','#765c51',3)+e(192,162,11,6,'#edb3ad66')+e(288,162,11,6,'#edb3ad66');
 if(pet.kind==='cat')art+=p('M188 168L164 163M188 176L160 177M292 168L316 163M292 176L320 177','none','#a38a78',2);
 return art;
}
function sceneArt(){return r(0,0,480,360,0,'#e7f5f4')+e(74, 65,20,20,'#fff8')+e(405,107,12,12,'#fff8')+e(240,289,192,37,'#d2dfef','#afc3dc')+animalArt()+(bow?`<g transform="translate(240 245) scale(.85)">${toolArt(bow)}</g>`:'')+p('M49 283Q240 342 431 283L406 335Q240 381 74 335Z','#c2d4eb','#9cb6d5',3)+p('M66 288Q240 337 414 288','none','#f7fcff',8);}
function inFur(x,y){return ((x-240)/73)**2+((y-141)/59)**2<=1 || ((x-240)/78)**2+((y-216)/67)**2<=1;}
function countPixels(){const data=ctx.getImageData(0,0,480,360).data;let n=0;for(let i=3;i<data.length;i+=4)if(data[i]>20)n++;return n;}
function seedOverlay(){
 ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,480,360);
 for(let y=100;y<=260;y+=27)for(let x=175;x<=307;x+=27){if(!inFur(x,y))continue;const shift=(x+y)%9;
  ctx.beginPath();
  if(stage===0){if((x+y)%3===1)continue;ctx.ellipse(x+shift-4,y,9+(x%5),6+(y%5),.4,0,Math.PI*2);ctx.fillStyle='#9b704ccc';ctx.fill();}
  if(stage===1){ctx.arc(x,y,16,0,Math.PI*2);ctx.fillStyle='#fffef2ee';ctx.fill();ctx.strokeStyle='#dae8e3';ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(x-5,y-5,4,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();}
  if(stage===2){ctx.moveTo(x,y-10);ctx.quadraticCurveTo(x-12,y+4,x,y+8);ctx.quadraticCurveTo(x+12,y+4,x,y-10);ctx.fillStyle='#68b9d3bb';ctx.fill();}
 }
 totalPixels=Math.max(1,countPixels());
}
function updateProgress(percent){const value=stage>=4?100:Math.round((stage+percent/100)/4*100);document.querySelector('#progressFill').style.width=value+'%';document.querySelector('#progress').setAttribute('aria-valuenow',String(value));document.querySelector('#stageLabel').textContent=stage>=4?'洗好囉！':`${stepNames[stage]} ${percent}%`;}
function renderUI(){
 document.querySelectorAll('[data-pet]').forEach(b=>{const active=Number(b.dataset.pet)===petIndex;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
 const steps=document.querySelector('#steps');steps.replaceChildren();stepNames.forEach((name,index)=>{const s=document.createElement('span');s.className='step'+(index===stage?' current':index<stage?' done':'');s.textContent=`${index+1} ${name}`;steps.append(s);});
 const tools=document.querySelector('#tools');tools.replaceChildren();
 for(const key of ['soap','rinse','dry','pink','blue','gold']){const b=document.createElement('button');b.type='button';b.className='tile';b.dataset.tool=key;b.innerHTML=Play.svg(toolArt(key),'-40 -38 80 76');b.append(document.createTextNode(toolNames[key]));b.disabled=stage!==(['soap','rinse','dry'].indexOf(key)===-1?3:['soap','rinse','dry'].indexOf(key));b.setAttribute('aria-pressed','false');b.addEventListener('pointerdown',event=>startTool(event,key));b.addEventListener('click',()=>selectTool(key));tools.append(b);}
}
function selectTool(key){selected=key;document.querySelectorAll('[data-tool]').forEach(b=>{b.classList.toggle('selected',b.dataset.tool===key);b.setAttribute('aria-pressed',String(b.dataset.tool===key));});}
function reset(){clearTimeout(celebrationTimer);Play.endDrag(null,true);stage=0;selected=null;bow=null;scene.innerHTML=Play.svg(sceneArt(),'0 0 480 360',pets[petIndex].name);canvas=document.createElement('canvas');canvas.width=480;canvas.height=360;scene.append(canvas);ctx=canvas.getContext('2d',{willReadFrequently:true});seedOverlay();renderUI();updateProgress(0);hint.textContent='拿泡泡海綿，來回搓掉髒髒的地方！';}
function scrub(x,y){const point=Play.point(scene,x,y);if(!point.inside)return;const rect=scene.getBoundingClientRect();ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(point.x,point.y,22/rect.width*480,0,Math.PI*2);ctx.fill();}
function startTool(event,key){
 if(stage>=4||dialog.open)return;
 const expected=['soap','rinse','dry'][stage];if(stage<3&&key!==expected){hint.textContent='先完成現在的步驟喔！';return;}
 selectTool(key);let last={x:event.clientX,y:event.clientY};
 Play.startDrag(event,{html:Play.svg(toolArt(key),'-40 -38 80 76'),onMove(x,y){
  if(stage>=3)return;const distance=Math.hypot(x-last.x,y-last.y);if(distance<1)return;const steps=Math.ceil(distance/5);for(let i=1;i<=steps;i++)scrub(last.x+(x-last.x)*i/steps,last.y+(y-last.y)*i/steps);last={x,y};const percent=Math.round((1-countPixels()/totalPixels)*100);updateProgress(percent);
  if(percent>=98){Play.endDrag(null,true);stage++;selected=null;seedOverlay();renderUI();updateProgress(0);hint.textContent=['','髒污搓掉了！拿蓮蓬頭把泡泡沖乾淨。','泡泡沖掉了！拿吹風機，把水滴全部吹乾。','毛毛乾了！把蝴蝶結拖到胸前。'][stage];}
 },onDrop(x,y){if(stage!==3)return;const point=Play.point(scene,x,y);if(!point.inside||Math.abs(point.x-240)>65||Math.abs(point.y-245)>35){hint.textContent='蝴蝶結要放在胸前喔，再試一次！';return;}bow=key;stage=4;scene.querySelector('svg').innerHTML=sceneArt();updateProgress(100);renderUI();hint.textContent='乾淨又漂亮，謝謝你的照顧！';document.querySelector('#thanks').textContent=pets[petIndex].name+'說：謝謝你，我的毛毛好舒服！';celebrationTimer=setTimeout(()=>dialog.showModal(),500);}});
}
for(let i=0;i<pets.length;i++){const b=document.createElement('button');b.type='button';b.className='tab';b.dataset.pet=i;b.textContent=pets[i].name;b.addEventListener('click',()=>{petIndex=i;reset();});document.querySelector('#petTabs').append(b);}
scene.addEventListener('pointerdown',event=>{if(selected)startTool(event,selected);else hint.textContent='先拿起現在要用的工具喔！';});
document.querySelector('#restart').addEventListener('click',reset);document.querySelector('#nextPet').addEventListener('click',()=>{dialog.close();petIndex=(petIndex+1)%pets.length;reset();});reset();
