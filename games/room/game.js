const {path:p,ellipse:e,rect:r}=Play;
const furnitureTypes={bed:{name:'小床'},desk:{name:'書桌'},chair:{name:'椅子'},rug:{name:'地毯'},window:{name:'窗戶',wall:true},shelf:{name:'書架'},plant:{name:'盆栽'},lamp:{name:'立燈'},toys:{name:'玩具籃'},picture:{name:'掛畫',wall:true}};
const palette=[['奶油','#f6dfb7'],['蜜桃','#edaaa2'],['莓粉','#dc93ad'],['薄荷','#a3c8b1'],['天空','#9dbdd6'],['葡萄','#b6a3cd'],['木頭','#c99b73'],['森林','#669f88'],['牛仔','#667fa6'],['奶白','#fff2df']];
let activeTab='furniture',selectedId=null,nextId=10,exampleIndex=0;
const scene=document.querySelector('#scene'),hint=document.querySelector('#hint'),custom=document.querySelector('#customColor');
const storageKey='little-playground-room-v1';
let room={wall:'#f5e1d8',floor:'#dfbd94',items:[{id:1,type:'bed',x:130,y:292,color:'#dc93ad',variant:0},{id:2,type:'window',x:331,y:119,color:'#a3c8b1',variant:0},{id:3,type:'rug',x:310,y:321,color:'#b6a3cd',variant:0},{id:4,type:'desk',x:329,y:266,color:'#c99b73',variant:0},{id:5,type:'plant',x:422,y:278,color:'#edaaa2',variant:0}]};
const initial=structuredClone(room),saved=Play.load(storageKey);
if(saved&&/^#[0-9a-f]{6}$/i.test(saved.wall)&&/^#[0-9a-f]{6}$/i.test(saved.floor)&&Array.isArray(saved.items)){
 room={wall:saved.wall,floor:saved.floor,items:saved.items.filter(item=>furnitureTypes[item.type]&&Number.isFinite(item.x)&&Number.isFinite(item.y)&&item.x>=0&&item.x<=480&&item.y>=0&&item.y<=360&&Number.isInteger(item.variant)&&item.variant>=0&&item.variant<3&&/^#[0-9a-f]{6}$/i.test(item.color)).slice(0,16).map((item,index)=>({...item,id:index+1}))};nextId=room.items.length+1;
}
function furnitureArt(type,c,variant=0){
 const edge='#977967';let art='';
 if(type==='bed'){
  art=p('M-65 -52L-72 14M66 -52L73 14','none',edge,8)+r(-69,-72,138,62,12,'#e1bb94',edge)+r(-69,-67,138,39,9,'#fff8e9',edge)+r(-62,-62,42,29,7,'#fffef9')+p('M-13 -66H68V-18L-13 -12Z',c,edge,2)+r(-69,-21,138,14,3,'#d6ad83',edge);
  if(variant===1)art+=[3,23,43,60].map(x=>[-53,-35].map(y=>e(x,y,3,3,'#fff7')).join('')).join('');
  if(variant===2)art+=p('M-5 -56H63M-5 -38H63','none','#fff8',6);
 }else if(type==='desk'){
  art=p('M-48 -51L-53 15M48 -51L53 15','none',edge,7)+r(-57,-70,114,23,5,c,edge)+r(13,-45,36,40,4,c,edge)+p('M18 -24H43M28 -33H33M28 -12H33','none',edge,2);
  if(variant===1)art+=r(-33,-92,39,25,3,'#91bcd1',edge)+p('M-13 -67V-61M-22 -60H-4','none',edge,3);
  else art+=r(-35,-84,32,12,2,variant===2?'#a894c7':'#cf8ea4')+r(-28,-92,27,8,2,'#ecd39b');
 }else if(type==='chair'){
  if(variant===2)return p('M-39 7Q-53 -36 -18 -54Q25 -69 42 -22Q58 13 20 17Q-19 25 -39 7Z',c,edge)+p('M-30 -12Q0 7 31 -10','none','#fff7',4);
  art=p('M-27 -13L-34 16M27 -13L34 16','none',edge,6)+r(-35,-33,70,23,8,c,edge);
  if(variant===0)art+=p('M-26 -31V-70M26 -31V-70','none',edge,6)+r(-33,-91,66,39,9,c,edge);
 }else if(type==='rug'){
  art=variant===1?r(- 70,-12,140,38,9,c):e(0,7,77,27,c);
  art+=e(0,7,58,17,'none','#fff8',3);
  if(variant===2)art+=p('M0 -7L5 2L17 4L8 12L10 21L0 17L-10 21L-8 12L-17 4L-5 2Z','#fff9');
 }else if(type==='window'){
  art=r(-46,-51,92,82,6,'#c7e7ee',c)+r(-43,-48,86,76,4,'#c6e4ed')+e(18,-28,11,11,'#f5d48a')+p('M-43 7Q-24 -12 -3 9Q14 -4 43 10V26H-43Z','#aecab9')+p('M0 -48V27M-43 -9H43','none',c,7)+r(-53,29,106,8,3,c);
  if(variant===1)art+=p('M-51 -49L-34 -49L-38 25L-52 27Z',c)+p('M51 -49L34 -49L38 25L52 27Z',c);
  if(variant===2)art+=p('M-47 -51Q0 -79 47 -51Z',c);
 }else if(type==='shelf'){
  art=r(-38,-107,76,121,5,c,edge)+p('M-35 -68H35M-35 -28H35','none',edge,5);
  for(let row=0;row<2;row++)for(let col=0;col<4;col++)art+=r(-29+col*15,-94+row*40,10,24,2,['#d291a1','#98bba5','#e6cc85','#9aaac8'][(col+variant)%4]);
  art+=e(-14,-5,8,9,'#fff0d6')+r(5,-16,22,24,3,'#cda3b6');
 }else if(type==='plant'){
  art=p('M-22 -22H22L16 14H-16Z',c,edge)+p('M0 -20V-73','none','#66997e',4);
  if(variant===1)art+=r(-14,-82,28,56,14,'#7bab82')+p('M-13 -43Q-31 -34 -27 -62M13 -52Q29 -42 27 -71','none','#7bab82',12);
  else art+=e(-14,- 50,18,9,'#84b295')+e(15,-68,19,10,'#76a788')+e(-12,-86,17,10,variant===2?'#e8a0b2':'#99bca1');
 }else if(type==='lamp'){
  art=p('M0 -70V14','none',edge,5)+e(0,16,26,7,c,edge);
  art+=variant===1?e(0,-85,29,25,c,edge):p('M-17 -111H17L35 -66H-35Z',c,edge);
  if(variant===2)art+=p('M-15 -105L-25 -73M0 -106V-73M15 -105L25 -73','none','#fff8',3);
 }else if(type==='toys'){
  art=e(-14,-29,17,19,variant===1?'#ecd596':'#d4b294')+e(-26,-44,8,8,'#d4b294')+e(-2,-44,8,8,'#d4b294')+e(-20,-33,2,2,'#53443c')+e(-8,-33,2,2,'#53443c')+r(7,-29,26,26,4,variant===2?'#98b6cf':'#d29ead')+p('M-43 -17H43L34 16H-34Z',c,edge)+p('M-29 -7H29M-25 5H25','none','#fff8',3);
 }else{
  art=r(-41,-51,82,78,5,c,edge)+r(-33,-43,66,62,2,'#fff5df');
  if(variant===0)art+=e(16,-24,9,9,'#eacb7b')+p('M-30 15L-5 -17L15 8L24 -6L31 15Z','#93bbaa');
  if(variant===1)art+=p('M0 -29C-24 -47 -40 -17 0 9C40 -17 24 -47 0 -29Z','#dd9eab');
  if(variant===2)art+=p('M0 -34L7 -17L25 -16L12 -3L17 14L0 5L-17 14L-12 -3L-25 -16L-7 -17Z','#e7c574');
 }
 return art;
}
function selected(){return room.items.find(item=>item.id===selectedId);}
function sceneArt(showSelection=true){
 let art=r(0,0,480,360,0,room.wall)+r(0,224,480,136,0,room.floor)+p('M0 224H480','none','#fff7',7)+[260,299,338].map(y=>p(`M0 ${y}H480`,'none','#b8957344',2)).join('')+[105,245,385].map(x=>p(`M${x} 226L${x-35} 360`,'none','#b8957333',2)).join('');
 const rank=item=>furnitureTypes[item.type].wall?0:item.type==='rug'?1:2;
 for(const item of [...room.items].sort((a,b)=>rank(a)-rank(b)||a.y-b.y)){
  const select=showSelection&&item.id===selectedId;
  art+=`<g class="room-item${select?' selected':''}" data-id="${item.id}" transform="translate(${item.x} ${item.y})">${select?r(-80,-114,160,146,12,'#ffffff22','#e38ba5'):''}${furnitureArt(item.type,item.color,item.variant)}</g>`;
 }
 return art;
}
function refresh(save=false){scene.innerHTML=Play.svg(sceneArt(),'0 0 480 360','你佈置的小房間');document.querySelector('#stageLabel').textContent=room.items.length+' 件家具';renderColors();if(save)Play.save(storageKey,room);}
function clampPosition(type,x,y){return{x:Math.max(80,Math.min(400,x)),y:Math.max(furnitureTypes[type].wall?85:245,Math.min(furnitureTypes[type].wall?180:326,y))};}
function addFurniture(event,type){
 Play.startDrag(event,{html:Play.svg(furnitureArt(type,'#d7ad88'),'-85 -120 170 155'),onDrop(x,y){const point=Play.point(scene,x,y);if(!point.inside){hint.textContent='家具要放進房間裡喔！';return;}if(room.items.length>=16){hint.textContent='房間滿滿的，先移走一件再加吧！';return;}const item={id:nextId++,type,...clampPosition(type,point.x,point.y),color:'#d7ad88',variant:0};room.items.push(item);selectedId=item.id;refresh(true);hint.textContent=furnitureTypes[type].name+'放好了！還能移動或換顏色。';}});
}
function renderColors(){
 const item=selected(),enabled=activeTab!=='furniture'||!!item,color=activeTab==='furniture'?item?.color:room[activeTab];
 document.querySelector('#colorTitle').textContent=activeTab==='wall'?'牆壁顏色':activeTab==='floor'?'地板顏色':'家具顏色';
 document.querySelector('#selectionName').textContent=activeTab==='furniture'?(item?furnitureTypes[item.type].name:'先選一件家具'):'自由換配色';
 const colors=document.querySelector('#colors');colors.replaceChildren();
 for(const [name,value] of palette){const b=document.createElement('button');b.type='button';b.className='swatch'+(value===color?' selected':'');b.style.setProperty('--color',value);b.setAttribute('aria-label',name);b.setAttribute('aria-pressed',String(value===color));b.disabled=!enabled;b.addEventListener('click',()=>setColor(value));colors.append(b);}
 custom.disabled=!enabled;custom.value=color||'#d7ad88';document.querySelector('#variant').disabled=!item;document.querySelector('#remove').disabled=!item;
}
function setColor(color){if(activeTab==='furniture'){const item=selected();if(!item)return;item.color=color;}else room[activeTab]=color;refresh(true);hint.textContent='換好顏色了，你的房間很有個性！';}
for(const [type,info] of Object.entries(furnitureTypes)){const b=document.createElement('button');b.type='button';b.className='tile';b.dataset.furniture=type;b.innerHTML=Play.svg(furnitureArt(type,'#d7ad88'),'-85 -120 170 155');b.append(document.createTextNode(info.name));b.addEventListener('pointerdown',event=>addFurniture(event,type));document.querySelector('#furniture').append(b);}
scene.addEventListener('pointerdown',event=>{
 const element=event.target.closest('[data-id]');if(!element){selectedId=null;refresh();return;}
 const item=room.items.find(item=>item.id===Number(element.dataset.id));if(!item)return;selectedId=item.id;activeTab='furniture';syncTabs();refresh();const origin={x:item.x,y:item.y},point=Play.point(scene,event.clientX,event.clientY),offset={x:point.x-item.x,y:point.y-item.y};
 Play.startDrag(event,{onMove(x,y){const point=Play.point(scene,x,y);Object.assign(item,clampPosition(item.type,point.x-offset.x,point.y-offset.y));refresh();},onDrop(x,y){if(!Play.point(scene,x,y).inside)Object.assign(item,origin);refresh(true);hint.textContent='搬好了！也能換樣子、換顏色。';},onCancel(){Object.assign(item,origin);refresh();}});
});
function syncTabs(){document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('selected',b.dataset.tab===activeTab);b.setAttribute('aria-pressed',String(b.dataset.tab===activeTab));});document.querySelector('#furniturePanel').hidden=activeTab!=='furniture';renderColors();}
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{activeTab=b.dataset.tab;syncTabs();}));
custom.addEventListener('input',()=>setColor(custom.value));document.querySelector('#variant').addEventListener('click',()=>{const item=selected();if(item){item.variant=(item.variant+1)%3;refresh(true);hint.textContent='同一件家具，換一個樣子！';}});
document.querySelector('#remove').addEventListener('click',()=>{room.items=room.items.filter(item=>item.id!==selectedId);selectedId=null;refresh(true);hint.textContent='移走了，空出一個新位置！';});
document.querySelector('#clear').addEventListener('click',()=>{Play.endDrag(null,true);room.items=[];selectedId=null;refresh(true);hint.textContent='空房間準備好了，開始佈置吧！';});
document.querySelector('#example').addEventListener('click',()=>{Play.endDrag(null,true);room=structuredClone(initial);exampleIndex++;room.wall=['#f5e1d8','#e4eddc','#e5e0f1'][exampleIndex%3];room.items.forEach((item,index)=>{item.variant=exampleIndex%3;item.color=palette[(index+exampleIndex)%palette.length][1];});nextId=10;selectedId=null;refresh(true);hint.textContent='一個新的範例！可以繼續改成自己的樣子。';});
document.querySelector('#download').addEventListener('click',async event=>{event.currentTarget.disabled=true;try{await Play.download(sceneArt(false),'我的小房間');hint.textContent='圖片準備好了，保留你的房間作品！';}catch{hint.textContent='暫時無法存圖，可以先截圖保留。';}finally{document.querySelector('#download').disabled=false;}});
refresh();hint.textContent='把家具拖進房間，或搬動已經放好的家具。';
