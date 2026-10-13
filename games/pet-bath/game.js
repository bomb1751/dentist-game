const {path:p,ellipse:e,rect:r}=Play;
const pets=[{name:'豆豆狗',fur:'#d3a47c',kind:'dog'},{name:'咪咪貓',fur:'#c1b0a0',kind:'cat'},{name:'棉花兔',fur:'#fff1de',kind:'rabbit'},{name:'啾啾鳥',fur:'#8fc7c0',kind:'bird'},{name:'粉粉紅鶴',fur:'#edacc2',kind:'flamingo'},{name:'條條斑馬',fur:'#f5f1e9',kind:'zebra'},{name:'圓圓熊貓',fur:'#f7f0dc',kind:'panda'},{name:'大耳象',fur:'#b7bfce',kind:'elephant'},{name:'橘橘狐',fur:'#d89b71',kind:'fox'}];
const stepNames=['搓洗','沖水','吹乾','打扮'];
const accessoryKeys=['pink','blue','gold','bandana','flower','daisy','crown','hat','glasses','scarf'];
const toolNames={soap:'泡泡海綿',rinse:'小蓮蓬頭',dry:'吹風機',pink:'粉紅結',blue:'藍色結',gold:'黃色結',bandana:'紅領巾',flower:'小花朵',daisy:'小雛菊',crown:'小皇冠',hat:'小禮帽',glasses:'圓眼鏡',scarf:'薄荷圍巾'};
let petIndex=0,stage=0,selected=null,totalPixels=1,celebrationTimer,equipped=[];
const scene=document.querySelector('#scene'),hint=document.querySelector('#hint'),dialog=document.querySelector('#celebration');
let canvas,ctx,furMask,lather,latherCtx;
function bowArt(color){return p('M0 0L-30 -17Q-38 0 -30 17Z',color,'#8e6b77',2)+p('M0 0L30 -17Q38 0 30 17Z',color,'#8e6b77',2)+e(0,0,7,8,color,'#8e6b77',2);}
function toolArt(key){
 if(key==='soap')return r(-28,-17,56,34,10,'#f3ce65','#cba044')+[-13,3,17].map((x,i)=>e(x,-15-i%2*6,7,7,'#fffdf0','#eadab8')).join('')+e(-15,2,3,3,'#dcae45')+e(7,6,3,3,'#dcae45');
 if(key==='rinse')return p('M22 27L2 0','none','#8bafbd',10)+p('M-21 -9Q-8 -23 7 -8L-6 7Z','#c0dde6','#7493a1')+[-18,-9,0].map(x=>p(`M${x} 6L${x-8} 18`,'none','#72bad6',3)).join('');
 if(key==='dry')return r(-25,-13,43,26,12,'#e99aac','#bd6a86')+p('M15 -10L30 -13V13L15 10Z','#e99aac','#bd6a86')+p('M-4 10L5 29L-7 33L-14 12Z','#c888a1')+p('M-23 -5V5M-17 -5V5','none','#fff0e9',2);
 if(key==='bandana')return p('M-34 -11Q0 2 34 -11L0 28Z','#dd8e9a','#b8677c',2)+p('M-20 -4L0 16L20 -4','none','#ffe1bf',3);
 if(key==='scarf')return r(-31,-12,62,21,7,'#a7d1c0','#7cae9a')+p('M5 5L23 29L6 32L-6 5Z','#a7d1c0','#7cae9a',2)+p('M8 25L17 23','none','#edf4d8',3);
 if(key==='flower'||key==='daisy')return Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return e(Math.cos(a)*16,Math.sin(a)*16,11,9,key==='flower'?'#eaa4bf':'#fff7e7','#d8b2ba',1);}).join('')+e(0,0,8,8,'#efca70','#cbac60');
 if(key==='crown')return p('M-29 15L-34 -17L-13 -3L0 -26L13 -3L34 -17L29 15Z','#edc86a','#c69f48',2)+r(-29,7,58,13,4,'#e3b65b')+e(0,1,5,6,'#df8daa')+e(-19,2,3,4,'#a5cbbf')+e(19,2,3,4,'#a5cbbf');
 if(key==='hat')return e(0,17,37,8,'#7390b1','#536c8e')+r(-24,-21,48,38,9,'#88a5c2','#536c8e')+r(-24,5,48,9,1,'#e3a1b4');
 if(key==='glasses')return e(-21,0,18,15,'#dff5f733','#826888',3)+e(21,0,18,15,'#dff5f733','#826888',3)+p('M-3 -1Q0 -6 3 -1M-40 -4L-48 -9M40 -4L48 -9','none','#826888',3);
 return bowArt({pink:'#ed9db4',blue:'#8fb8dc',gold:'#edc566'}[key]);
}
function animalArt(pet=pets[petIndex]){
 const base=pet.fur;
 const shade=amount=>'#'+base.slice(1).match(/../g).map(value=>Math.round(parseInt(value,16)*amount).toString(16).padStart(2,'0')).join('');
 let art=`<defs><radialGradient id="furCoat" cx="36%" cy="22%" r="85%"><stop offset="0" stop-color="${base}"/><stop offset=".58" stop-color="${base}"/><stop offset="1" stop-color="${shade(.88)}"/></radialGradient></defs>`;const c='url(#furCoat)';
 if(!['dog','cat','rabbit'].includes(pet.kind)){
  const definition=extraAnimal(pet);
  return art+`<defs><clipPath id="animalOutline">${animalOutlineArt(definition.parts)}</clipPath></defs>`+animalPartsArt(definition.parts)+definition.details;
 }
 if(pet.kind==='rabbit')art+=e(200, 65,20,52,c,'#c9aa90')+e(280,65,20,52,c,'#c9aa90')+e(200,63,10,36,'#e8b5bb')+e(280,63,10,36,'#e8b5bb');
 if(pet.kind==='dog')art+=p('M181 95Q126 97 151 184Q176 205 193 166Z','#a97555','#926345')+p('M299 95Q354 97 329 184Q304 205 287 166Z','#a97555','#926345');
 if(pet.kind==='cat')art+=p('M169 126L170 63L221 103Z',c,'#9c8676')+p('M311 126L310 63L259 103Z',c,'#9c8676')+p('M178 111L178 78L202 104Z','#e9b8b5')+p('M302 111L302 78L278 104Z','#e9b8b5');
 art+=e(240,216,82,76,c,'#b99375')+e(240,140,77,66,c,'#b99375')+e(197,276,25,18,c,'#b99375')+e(283,276,25,18,c,'#b99375')+e(240,178,38,24,'#fff0d9');
 art+=e(212,141,8,10,'#3e3845')+e(268,141,8,10,'#3e3845')+e(210,138,2.5,3,'#fff')+e(266,138,2.5,3,'#fff')+p('M230 168Q240 162 250 168L240 178Z',pet.kind==='dog'?'#645044':'#cf8d99')+p('M240 178Q228 192 220 182M240 178Q252 192 260 182','none','#765c51',3)+e(192,162,11,6,'#edb3ad66')+e(288,162,11,6,'#edb3ad66');
 if(pet.kind==='cat')art+=p('M188 168L164 163M188 176L160 177M292 168L316 163M292 176L320 177','none','#a38a78',2);
 return art;
}
function accessorySlot(key){return ['crown','hat','flower','daisy'].includes(key)?'head':key==='glasses'?'eyes':'neck';}
function accessoryAnchor(key){
 const slot=accessorySlot(key),pet=pets[petIndex],anchors=['dog','cat','rabbit'].includes(pet.kind)?{neck:[240,245],head:[240,68],eyes:[240,141]}:extraAnimal(pet).anchors;
 return{slot,x:anchors[slot][0],y:anchors[slot][1],scale:pet.kind==='flamingo'?.63:slot==='eyes'?.68:.8};
}
function accessoryArt(){
 let art=equipped.map(key=>{const a=accessoryAnchor(key);return `<g transform="translate(${a.x} ${a.y}) scale(${a.scale})">${toolArt(key)}</g>`;}).join('');
 if(stage===3&&accessoryKeys.includes(selected)){const a=accessoryAnchor(selected);art+=e(a.x,a.y,45,27,'none','#e1a869',2);}
 return art;
}
function drawScene(){scene.querySelector('svg').innerHTML=sceneArt();}
function finishDressing(){
 if(stage!==3)return;
 if(!equipped.length){hint.textContent='先幫小客人戴上一個配件喔！';return;}
 stage=4;selected=null;drawScene();updateProgress(100);renderUI();hint.textContent='乾淨又漂亮，謝謝你的照顧！';document.querySelector('#thanks').textContent=pets[petIndex].name+'說：謝謝你，好喜歡我的新造型！';celebrationTimer=setTimeout(()=>dialog.showModal(),500);
}function sceneArt(){return r(0,0,480,360,0,'#e7f5f4')+e(74,65,20,20,'#fff8')+e(405,107,12,12,'#fff8')+e(240,289,192,37,'#d2dfef','#afc3dc')+animalArt()+accessoryArt()+p('M49 283Q240 342 431 283L406 335Q240 381 74 335Z','#c2d4eb','#9cb6d5',3)+p('M66 288Q240 337 414 288','none','#f7fcff',8);}
// Use the actual animal silhouette, including ears and paws, as a material mask.
function makeFurMask(){
 const mask=document.createElement('canvas');mask.width=480;mask.height=360;const m=mask.getContext('2d');const shape=new Path2D();
 function oval(x,y,rx,ry){const part=new Path2D();part.ellipse(x,y,rx,ry,0,0,Math.PI*2);m.fillStyle='#fff';m.fill(part);}
 oval(240,216,82,76);oval(240,140,77,66);oval(197,276,25,18);oval(283,276,25,18);
 const kind=pets[petIndex].kind;
 if(!['dog','cat','rabbit'].includes(kind)){
  m.clearRect(0,0,480,360);m.fillStyle='#fff';const definition=extraAnimal(pets[petIndex]);
  for(const part of definition.parts){if(part.type==='ellipse'){m.beginPath();m.ellipse(part.x,part.y,part.rx,part.ry,0,0,Math.PI*2);m.fill();}else m.fill(new Path2D(part.d));}
  m.globalCompositeOperation='destination-out';for(const [x,y,rx,ry]of definition.protectedAreas){m.beginPath();m.ellipse(x,y,rx,ry,0,0,Math.PI*2);m.fill();}return mask;
 }
 if(kind==='rabbit'){oval(200,65,20,52);oval(280,65,20,52);}
 if(kind==='dog'){shape.addPath(new Path2D('M181 95Q126 97 151 184Q176 205 193 166Z'));shape.addPath(new Path2D('M299 95Q354 97 329 184Q304 205 287 166Z'));}
 if(kind==='cat'){shape.addPath(new Path2D('M169 126L170 63L221 103Z'));shape.addPath(new Path2D('M311 126L310 63L259 103Z'));}
 m.fillStyle='#fff';m.fill(shape);m.globalCompositeOperation='destination-out';
 // Keep expressions visible instead of plastering dirt and foam over the eyes.
 for(const [x,y,rx,ry] of [[212,141,12,14],[268,141,12,14],[240,179,42,27]]){m.beginPath();m.ellipse(x,y,rx,ry,0,0,Math.PI*2);m.fill();}
 if(kind==='rabbit')for(const x of [200,280]){m.beginPath();m.ellipse(x,63,9,35,0,0,Math.PI*2);m.fill();}
 return mask;
}
function randomGenerator(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function clipToFur(context){context.globalCompositeOperation='destination-in';context.drawImage(furMask,0,0);context.globalCompositeOperation='source-over';}
function bubble(context,x,y,radius){
 const fill=context.createRadialGradient(x-radius*.32,y-radius*.38,1,x,y,radius);fill.addColorStop(0,'#fffffff5');fill.addColorStop(.7,'#f8fcf0e8');fill.addColorStop(1,'#c4dcd8b0');
 context.beginPath();context.arc(x,y,radius,0,Math.PI*2);context.fillStyle=fill;context.fill();context.strokeStyle='#ffffffbc';context.lineWidth=1.1;context.stroke();
 context.beginPath();context.arc(x-radius*.22,y-radius*.23,radius*.48,Math.PI*1.06,Math.PI*1.55);context.strokeStyle='#fff';context.lineWidth=Math.max(1,radius*.13);context.stroke();
}
function countPixels(){const data=ctx.getImageData(0,0,480,360).data;let n=0;for(let i=3;i<data.length;i+=4)if(data[i]>20)n++;return n;}
function seedOverlay(){
 ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,480,360);latherCtx.clearRect(0,0,480,360);
 if(stage>2){totalPixels=1;return;}
 const random=randomGenerator(7121+petIndex*899+stage*3109);
 ctx.fillStyle=['#92734c48','#f7fbf2c4','#6dacc63a'][stage];ctx.fillRect(0,0,480,360);
 // Jittered, stratified coverage avoids both empty body regions and rows of stamps.
 for(let y=13;y<=294;y+=21)for(let x=115;x<=365;x+=21){
  const px=x+(random()-.5)*19,py=y+(random()-.5)*19;
  if(stage===0){
   const radius=10+random()*13,gradient=ctx.createRadialGradient(px,py,1,px,py,radius);
   gradient.addColorStop(0,'#86603aa8');gradient.addColorStop(.52,'#9c784b70');gradient.addColorStop(1,'#9c784b00');
   ctx.save();ctx.translate(px,py);ctx.rotate(random()*Math.PI);ctx.scale(1,.5+random()*.45);ctx.translate(-px,-py);ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(px,py,radius,0,Math.PI*2);ctx.fill();ctx.restore();
   for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(px+(random()-.5)*16,py+(random()-.5)*14,.7+random()*1.9,0,Math.PI*2);ctx.fillStyle='#77523055';ctx.fill();}
  }else if(stage===1){
   bubble(ctx,px,py,8+random()*9);bubble(ctx,px+8,py-5,3+random()*5);
  }else{
   // Wet sheen, narrow water trails and tiny rounded beads follow the coat.
   const size=2+random()*3;ctx.beginPath();ctx.moveTo(px,py-size*1.7);ctx.bezierCurveTo(px-size*1.4,py,px-size,py+size*1.6,px,py+size*1.7);ctx.bezierCurveTo(px+size,py+size*1.6,px+size*1.4,py,px,py-size*1.7);
   const wet=ctx.createLinearGradient(px-size,py-size,px+size,py+size);wet.addColorStop(0,'#eafffff0');wet.addColorStop(.45,'#8bc9dec9');wet.addColorStop(1,'#559cbfa0');ctx.fillStyle=wet;ctx.fill();
   ctx.beginPath();ctx.moveTo(px-size*.25,py-size*.5);ctx.lineTo(px-size*.25,py+size*.5);ctx.strokeStyle='#fff9';ctx.lineWidth=1;ctx.stroke();
   if(random()>.62){ctx.beginPath();ctx.moveTo(px,py+size*2);ctx.quadraticCurveTo(px+2,py+size*3,px,py+size*4);ctx.strokeStyle='#79b4cd55';ctx.lineWidth=1.3;ctx.stroke();}
  }
 }
 clipToFur(ctx);totalPixels=Math.max(1,countPixels());
}function updateProgress(percent){const value=stage>=4?100:Math.round((stage+percent/100)/4*100);document.querySelector('#progressFill').style.width=value+'%';document.querySelector('#progress').setAttribute('aria-valuenow',String(value));document.querySelector('#stageLabel').textContent=stage>=4?'洗好囉！':`${stepNames[stage]} ${percent}%`;}
function renderUI(){
 document.querySelectorAll('[data-pet]').forEach(b=>{const active=Number(b.dataset.pet)===petIndex;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
 const steps=document.querySelector('#steps');steps.replaceChildren();stepNames.forEach((name,index)=>{const s=document.createElement('span');s.className='step'+(index===stage?' current':index<stage?' done':'');s.textContent=`${index+1} ${name}`;steps.append(s);});
 document.querySelector('#finishDress').hidden=stage!==3;document.querySelector('#toolTitle').textContent=stage<3?'洗澡小工具':'打扮小衣櫥';
 const tools=document.querySelector('#tools');tools.replaceChildren();
 for(const key of (stage<3?['soap','rinse','dry']:accessoryKeys)){const b=document.createElement('button');b.type='button';b.className='tile';b.dataset.tool=key;b.innerHTML=Play.svg(toolArt(key),'-40 -38 80 76');b.append(document.createTextNode(toolNames[key]));b.disabled=stage>=4 || (stage<3 && stage!==['soap','rinse','dry'].indexOf(key));b.setAttribute('aria-pressed','false');b.addEventListener('pointerdown',event=>startTool(event,key));b.addEventListener('click',()=>selectTool(key));tools.append(b);}
}
function selectTool(key){selected=key;if(stage===3){const a=accessoryAnchor(key);drawScene();hint.textContent=accessorySlot(key)==='neck'?'拖到胸前的圈圈，可以再搭配帽子和眼鏡。':accessorySlot(key)==='eyes'?'把眼鏡拖到眼睛前的圈圈。':'把配件拖到頭上的圈圈。';}document.querySelectorAll('[data-tool]').forEach(b=>{b.classList.toggle('selected',b.dataset.tool===key);b.setAttribute('aria-pressed',String(b.dataset.tool===key));});}
function reset(){clearTimeout(celebrationTimer);Play.endDrag(null,true);stage=0;selected=null;equipped=[];scene.innerHTML=Play.svg(sceneArt(),'0 0 480 360',pets[petIndex].name);canvas=document.createElement('canvas');canvas.width=480;canvas.height=360;scene.append(canvas);ctx=canvas.getContext('2d',{willReadFrequently:true});furMask=makeFurMask();lather=document.createElement('canvas');lather.width=480;lather.height=360;lather.setAttribute('aria-hidden','true');scene.append(lather);latherCtx=lather.getContext('2d');seedOverlay();renderUI();updateProgress(0);hint.textContent='拿泡泡海綿，來回搓掉髒髒的地方！';}
function scrub(x,y){const point=Play.point(scene,x,y);if(!point.inside)return;const rect=scene.getBoundingClientRect();ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(point.x,point.y,22/rect.width*480,0,Math.PI*2);ctx.fill();
 if(stage===0){
  const random=randomGenerator(Math.round(point.x)*711+Math.round(point.y)*39);bubble(latherCtx,point.x,point.y,12+random()*6);bubble(latherCtx,point.x-10,point.y+7,5+random()*4);clipToFur(latherCtx);
 }
}
function startTool(event,key){
 if(stage>=4||dialog.open)return;
 const expected=['soap','rinse','dry'][stage];if(stage<3&&key!==expected){hint.textContent='先完成現在的步驟喔！';return;}
 selectTool(key);let last={x:event.clientX,y:event.clientY};
 Play.startDrag(event,{html:Play.svg(toolArt(key),'-40 -38 80 76'),onMove(x,y){
  if(stage>=3)return;const distance=Math.hypot(x-last.x,y-last.y);if(distance<1)return;const steps=Math.ceil(distance/5);for(let i=1;i<=steps;i++)scrub(last.x+(x-last.x)*i/steps,last.y+(y-last.y)*i/steps);last={x,y};const percent=Math.round((1-countPixels()/totalPixels)*100);updateProgress(percent);
  if(percent>=98){Play.endDrag(null,true);stage++;selected=null;seedOverlay();renderUI();updateProgress(0);hint.textContent=['','髒污搓掉了！拿蓮蓬頭把泡泡沖乾淨。','泡泡沖掉了！拿吹風機，把水滴全部吹乾。','乾乾的了！選配件打扮，可以搭配頭飾、眼鏡和領巾。'][stage];}
 },onDrop(x,y){
  if(stage!==3||!accessoryKeys.includes(key))return;
  const point=Play.point(scene,x,y),a=accessoryAnchor(key);
  if(!point.inside||Math.abs(point.x-a.x)>55||Math.abs(point.y-a.y)>35){hint.textContent='放到圈圈裡再鬆開喔，配件要戴在適合的位置！';return;}
  equipped=equipped.filter(item=>accessorySlot(item)!==a.slot);equipped.push(key);drawScene();hint.textContent='戴上'+toolNames[key]+'了！還能搭配其他配件，最後按「打扮好了」。';
 }});
}
for(let i=0;i<pets.length;i++){const b=document.createElement('button');b.type='button';b.className='tab';b.dataset.pet=i;b.textContent=pets[i].name;b.addEventListener('click',()=>{petIndex=i;reset();});document.querySelector('#petTabs').append(b);}
scene.addEventListener('pointerdown',event=>{if(selected)startTool(event,selected);else hint.textContent='先拿起現在要用的工具喔！';});
document.querySelector('#finishDress').addEventListener('click',finishDressing);
document.querySelector('#restart').addEventListener('click',reset);document.querySelector('#nextPet').addEventListener('click',()=>{dialog.close();petIndex=(petIndex+1)%pets.length;reset();});for(const button of document.querySelectorAll('.tab,.action')){
 let lastTouch=-Infinity;
 button.addEventListener('click',event=>{if(event.isTrusted&&event.detail>0&&performance.now()-lastTouch<700){event.preventDefault();event.stopImmediatePropagation();}},true);
 button.addEventListener('pointerup',event=>{if(event.pointerType==='touch'&&!button.disabled){lastTouch=performance.now();event.preventDefault();button.click();}});
}
reset();
