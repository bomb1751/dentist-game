const {path:p,ellipse:e,rect:r}=Play;
const foods={tomato:'番茄',pepper:'甜椒',mushroom:'蘑菇',corn:'玉米',cheese:'起司',olive:'橄欖',patty:'漢堡肉',lettuce:'生菜',onion:'洋蔥',top:'上層麵包',berry:'草莓',blueberry:'藍莓',cream:'鮮奶油',candle:'小蠟燭',chocolate:'巧克力',sprinkles:'彩色糖粒'};
const dishes={pizza:{name:'披薩',items:['tomato','pepper','mushroom','corn','cheese','olive']},burger:{name:'漢堡',items:['patty','lettuce','cheese','tomato','onion','top']},cake:{name:'蛋糕',items:['berry','blueberry','cream','candle','chocolate','sprinkles']}};
let dish='pizza',mode='free',selected=null,placed=[],order={};
const scene=document.querySelector('#scene'),hint=document.querySelector('#hint'),dialog=document.querySelector('#celebration');
function foodArt(key){
 if(key==='tomato')return e(0,0,22,17,'#e66f62','#bf4e47')+e(0,0,15,11,'#ffc297')+[-1,1].map(k=>p(`M${k*4} -7L${k*10} 0L${k*4} 7`,'none','#f9e9ad',3)).join('');
 if(key==='pepper')return p('M-20 -11Q-8 -20 0 -9Q10 -20 22 -10L17 9Q4 20 -5 8Q-18 18 -20 -11Z','none','#67ad75',7);
 if(key==='mushroom')return r(-6,-2,12,23,4,'#efd6ad','#b69073')+p('M-26 1Q-23 -28 0 -25Q23 -28 26 1Z','#b98c71','#8b6353')+e(-10,-9,4,3,'#e4c7a9');
 if(key==='corn')return [-12,0,12].map(x=>[-8,5].map(y=>e(x,y,6,8,'#efc352','#d8a737')).join('')).join('');
 if(key==='cheese')return p('M-27 -12L25 -15L29 12L-25 15Z','#f2cb5c','#d5a638')+e(-8,0,4,4,'#dba838')+e(14,4,3,3,'#dba838');
 if(key==='olive')return e(-10,-2,10,12,'#56544a')+e(-10,-2,4,6,'#ead7b3')+e(14,5,10,12,'#56544a')+e(14,5,4,6,'#ead7b3');
 if(key==='patty')return r(-30,-9,60,20,9,'#8b5b47','#68422f')+p('M-19 -2H-11M0 4H8M14 -2H22','none','#b47e5c',3);
 if(key==='lettuce')return p('M-32 4L-27 -7L-17 -3L-7 -12L4 -5L15 -12L22 -3L31 -7L33 6L24 12L12 7L0 14L-12 7L-22 12Z','#80b973','#5e9754');
 if(key==='onion')return e(0,0,28,11,'none','#b190bf',5)+e(0,0,17,6,'none','#e8cce6',3);
 if(key==='top')return p('M-32 13Q-34 -21 0 -23Q34 -21 32 13Z','#e6b273','#bd8d51')+[-16,0,16].map((x,i)=>p(`M${x} ${-8+(i%2)*-5}L${x+4} ${-10+(i%2)*-5}`,'none','#fff0c2',2)).join('');
 if(key==='berry')return p('M-19 -10Q0 -24 19 -10Q14 13 0 23Q-14 13 -19 -10Z','#e97787','#c75068')+p('M-16 -12L-5 -10L0 -20L5 -10L16 -12L8 -3L0 -6L-8 -3Z','#78ad73')+[-8,4].map(x=>[-2,8].map(y=>e(x,y,1.3,2,'#ffe3a9')).join('')).join('');
 if(key==='blueberry')return e(-10,5,12,12,'#788aba','#596c9d')+e(11,-4,12,12,'#788aba','#596c9d')+p('M6 -8L11 -3L16 -8','none','#4f628d',2);
 if(key==='cream')return p('M-22 17Q-30 6 -13 0Q-25 -9 -5 -11Q-9 -22 9 -25Q4 -14 17 -7Q28 0 15 5Q31 12 22 17Z','#fffef7','#d9c9b5')+p('M-13 5Q0 12 15 5','none','#eadfce',2);
 if(key==='candle')return r(-6,-8,12,33,3,'#a496cc')+p('M-5 2L5 -2M-5 14L5 10','none','#fff',3)+p('M0 -32Q-14 -13 0 -10Q14 -13 0 -32Z','#eec366')+p('M0 -22Q-6 -13 0 -12Q6 -13 0 -22Z','#fff2b6');
 if(key==='chocolate')return r(-24,-15,48,31,4,'#765340','#583b2d')+p('M0 -14V15M-23 0H23','none','#ac8363',3);
 return [[-17,-7,'#e88dad'],[0,5,'#8db99b'],[16,-8,'#9c99cf'],[-12,13,'#f0c568'],[20,13,'#ec916a']].map(([x,y,c])=>p(`M${x} ${y}L${x+6} ${y-4}`,'none',c,4)).join('');
}
function sceneArt(){
 let art=r(0,0,480,360,0,'#fff0dd')+e(240,302,193,25,'#edd8ba')+e(240,200,210,140,'#fffaf1','#d5c6ab');
 if(dish==='pizza')art+=e(240,195,172,121,'#e7b474','#c49156',4)+e(240,195,155,106,'#df8170')+e(240,195,145,97,'#f1c56b');
 if(dish==='cake')art+=e(240,287,139,16,'#eddbcf')+r(138,162,204,122,14,'#eac6a1','#cfa980')+p('M140 205Q154 220 168 205Q182 218 198 205Q214 219 230 205Q247 220 264 205Q283 218 300 205Q318 219 340 205V174H140Z','#f2a8b9')+e(240,163,102,28,'#fff4df','#dccbb3')+e(240,165,85,18,'#f4d8c0');
 if(dish==='burger'){
  art+=r(155,268,170,29,15,'#dfab6e','#b5884e');
  placed.forEach((item,index)=>{art+=`<g transform="translate(240 ${254-index*23}) scale(2.7 1.3)">${foodArt(item.key)}</g>`;});
 }else for(const item of placed)art+=`<g transform="translate(${item.x} ${item.y}) rotate(${item.angle}) scale(.9)">${foodArt(item.key)}</g>`;
 return art;
}
function refresh(){
 scene.innerHTML=Play.svg(sceneArt(),'0 0 480 360','你的'+dishes[dish].name);
 document.querySelector('#stageLabel').textContent=dishes[dish].name;
 document.querySelector('#undo').disabled=!placed.length;
 document.querySelectorAll('[data-dish]').forEach(b=>{b.classList.toggle('selected',b.dataset.dish===dish);b.setAttribute('aria-pressed',String(b.dataset.dish===dish));});
 const chips=document.querySelector('#orderChips');chips.replaceChildren();
 for(const [key,count] of Object.entries(order)){const got=placed.filter(item=>item.key===key).length;const chip=document.createElement('span');chip.className='chip'+(got>=count?' complete':'');chip.innerHTML=Play.svg(foodArt(key),'-40 -32 80 64');chip.append(document.createTextNode(`${foods[key]} ${Math.min(got,count)}/${count}`));chips.append(chip);}
}
function makeOrder(){order=dish==='burger'?{patty:1,lettuce:1,cheese:1,top:1}:dish==='cake'?{berry:2,cream:2,candle:1}:Object.fromEntries([...dishes.pizza.items].sort(()=>Math.random()-.5).slice(0,3).map(key=>[key,1+Math.floor(Math.random()*2)]));}
function reset(){Play.endDrag(null,true);placed=[];selected=null;makeOrder();renderPantry();refresh();hint.textContent=mode==='order'?'照小訂單拖曳食材，做完按「上菜」':'把喜歡的食材拖到料理上吧！';}
function setSelected(key){selected=key;document.querySelectorAll('[data-food]').forEach(b=>{b.classList.toggle('selected',b.dataset.food===key);b.setAttribute('aria-pressed',String(b.dataset.food===key));});}
function startIngredient(event,key){
 if(dialog.open)return;setSelected(key);
 Play.startDrag(event,{html:Play.svg(foodArt(key),'-40 -32 80 64'),onDrop(x,y){
  const point=Play.point(scene,x,y);
  const valid=point.inside&&(dish==='pizza'?((point.x-240)/153)**2+((point.y-195)/106)**2<=1:dish==='cake'?point.x>=139&&point.x<=341&&point.y>=112&&point.y<=270:point.x>=115&&point.x<=365&&point.y>=55&&point.y<=300);
  if(!valid){hint.textContent='食材要放在料理上喔，再試一次！';return;}
  if(dish==='burger'&&placed.some(item=>item.key==='top')){hint.textContent='漢堡蓋好了！可以上菜，或先拿掉最上層。';return;}
  if(key==='top'&&placed.length<2){hint.textContent='先放漢堡肉和配料，再蓋上麵包！';return;}
  if(placed.length>=(dish==='burger'?8:24)){hint.textContent='料理裝得滿滿的，可以上菜囉！';return;}
  placed.push({key,x:point.x,y:point.y,angle:key==='candle'?0:Math.random()*24-12});refresh();hint.textContent=`加上${foods[key]}了！`;
 }});
}
function renderPantry(){
 const pantry=document.querySelector('#pantry');pantry.replaceChildren();
 for(const key of dishes[dish].items){const b=document.createElement('button');b.type='button';b.className='tile';b.dataset.food=key;b.setAttribute('aria-pressed','false');b.innerHTML=Play.svg(foodArt(key),'-40 -32 80 64');b.append(document.createTextNode(foods[key]));b.addEventListener('pointerdown',event=>startIngredient(event,key));b.addEventListener('click',()=>setSelected(key));pantry.append(b);}
}
for(const [key,value] of Object.entries(dishes)){const b=document.createElement('button');b.type='button';b.className='tab';b.dataset.dish=key;b.textContent=value.name;b.addEventListener('click',()=>{dish=key;reset();});document.querySelector('#dishTabs').append(b);}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;document.querySelector('#order').hidden=mode!=='order';document.querySelectorAll('[data-mode]').forEach(item=>{item.classList.toggle('selected',item===b);item.setAttribute('aria-pressed',String(item===b));});reset();}));
scene.addEventListener('pointerdown',event=>{if(selected)startIngredient(event,selected);else hint.textContent='先拿一個食材喔！';});
document.querySelector('#undo').addEventListener('click',()=>{placed.pop();refresh();hint.textContent='拿掉一個了，可以重新搭配。';});
document.querySelector('#restart').addEventListener('click',reset);
document.querySelector('#serve').addEventListener('click',()=>{
 if(!placed.length){hint.textContent='先加一點食材，再上菜喔！';return;}
 if(mode==='order'){const missing=Object.entries(order).filter(([key,n])=>placed.filter(item=>item.key===key).length<n);if(missing.length){hint.textContent='還差：'+missing.map(([key,n])=>`${foods[key]} ${n-placed.filter(item=>item.key===key).length} 個`).join('、');return;}}
 if(dish==='burger'&&!placed.some(item=>item.key==='top')){hint.textContent='最後蓋上麵包，漢堡才做好喔！';return;}
 document.querySelector('#result').innerHTML=Play.svg(sceneArt());dialog.showModal();
});
document.querySelector('#nextDish').addEventListener('click',()=>{dialog.close();reset();});
document.querySelector('#saveDish').addEventListener('click',async event=>{event.currentTarget.disabled=true;try{await Play.download(sceneArt(),'我的'+dishes[dish].name);}catch{hint.textContent='暫時無法存圖，可以先截圖保留。';}finally{document.querySelector('#saveDish').disabled=false;}});
reset();
