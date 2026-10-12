const categories = [
  { key:'face', name:'臉形', icon:'🙂', hint:'先選喜歡的臉形', styles:['圓圓臉','長長臉','方方臉','愛心臉','澎澎臉'], palette:'skin' },
  { key:'hair', name:'頭髮', icon:'💇', hint:'換個髮型，換個心情', styles:['短頭髮','妹妹頭','長頭髮','雙馬尾','捲捲髮','小平頭','光頭'], palette:'hair' },
  { key:'brows', name:'眉毛', icon:'〰️', hint:'眉毛也有好多表情', styles:['彎彎眉','平平眉','粗粗眉','上揚眉','小短眉'], palette:'hair' },
  { key:'eyes', name:'眼睛', icon:'👀', hint:'亮亮的眼睛，笑笑的眼睛', styles:['圓眼睛','大眼睛','杏仁眼','笑瞇眼','眨眨眼','星星眼'], palette:'feature' },
  { key:'nose', name:'鼻子', icon:'👃', hint:'小鼻子，大變化', styles:['圓鼻子','三角鼻','小鼻頭','長鼻子','翹鼻子'], palette:'skin' },
  { key:'mouth', name:'嘴巴', icon:'👄', hint:'今天想露出哪種表情？', styles:['微微笑','開心笑','小圓嘴','愛心嘴','露齒笑','小貓嘴'], palette:'feature' },
  { key:'ears', name:'耳朵', icon:'👂', hint:'耳朵也能有自己的樣子', styles:['圓耳朵','小耳朵','大耳朵','精靈耳','戴耳環'], palette:'skin' },
  { key:'shirt', name:'衣服', icon:'👕', hint:'挑一件今天想穿的衣服', styles:['短袖上衣','條紋上衣','點點上衣','連帽上衣','小襯衫','長袖上衣'], palette:'clothes' },
  { key:'pants', name:'褲子', icon:'👖', hint:'褲子和裙子，自由搭配', styles:['長褲','短褲','牛仔褲','條紋褲','吊帶褲','小裙子'], styleIds:[0,1,2,3,5], palette:'clothes' },
  { key:'outfit', name:'套裝', icon:'🧥', hint:'整套穿搭，也可以回到分開搭配', styles:['分開搭配','吊帶褲','吊帶短褲','運動套裝'], palette:'clothes' },
];
const wearKeys=['shirt','pants','outfit'];
const mainCategories=[...categories.filter(category=>!wearKeys.includes(category.key)),{key:'wear',name:'穿著',icon:'👗'}];
const palettes = {
  skin: [['奶油','#ffe2bf'],['暖桃','#f3c5a0'],['小麥','#d99b71'],['焦糖','#ac704b'],['可可','#744832'],['莓粉','#f3a6c0'],['薄荷','#a8dfc5'],['薰衣草','#c2afe8']],
  hair: [['栗子','#634438'],['墨黑','#30313e'],['金黃','#e6b756'],['橘紅','#bd6346'],['銀白','#b9bfcc'],['莓粉','#eb90b1'],['海藍','#679fc8'],['葡萄','#9771c0']],
  feature: [['墨黑','#343249'],['咖啡','#80543c'],['海藍','#518db4'],['森林','#4d987b'],['莓紅','#cc6589'],['珊瑚','#e98c73'],['葡萄','#9771c0'],['金黃','#d4aa44']],
  clothes: [['蜜桃','#f19f9b'],['莓粉','#e782ab'],['奶黃','#edca65'],['薄荷','#77baa4'],['海藍','#76a8d1'],['牛仔','#4c6d9e'],['葡萄','#ae91cf'],['奶白','#f4e8d5'],['墨黑','#44475b'],['橘子','#de925b']],
};
const initial = { face:{style:0,color:'#f3c5a0'}, hair:{style:0,color:'#634438'}, brows:{style:0,color:'#634438'}, eyes:{style:1,color:'#343249'}, nose:{style:2,color:'#d99b71'}, mouth:{style:1,color:'#cc6589'}, ears:{style:0,color:'#f3c5a0'}, shirt:{style:0,color:'#77baa4'}, pants:{style:0,color:'#4c6d9e'}, outfit:{style:0,color:'#4c6d9e'} };
const storageKey = 'little-playground-stylist-v1';
let look = structuredClone(initial), activeCategory = 'face', closeUpOverride = null;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  for (const category of categories) {
    const part = saved?.[category.key];
    if (part && Number.isInteger(part.style) && part.style >= 0 && part.style < category.styles.length && /^#[0-9a-f]{6}$/i.test(part.color)) look[category.key] = {style:part.style,color:part.color};
  }
  if(saved?.pants?.style===4 && !saved.outfit){look.outfit={style:1,color:look.pants.color};look.pants.style=0;}
} catch { /* Storage may be disabled; the game still works. */ }
const avatar = document.querySelector('#avatar'), stylesList = document.querySelector('#styles'), colorsList = document.querySelector('#colors');
const status = document.querySelector('#status'), customColor = document.querySelector('#customColor');
function darken(hex) { return '#' + hex.slice(1).match(/../g).map(value => Math.round(parseInt(value,16)*.72).toString(16).padStart(2,'0')).join(''); }
function path(d, fill, stroke = 'none', width = 3) { return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`; }
function ellipse(x,y,rx,ry,fill,stroke='none') { return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`; }
function face(s) {
  const {style:i,color:c}=s.face, edge=darken(c);
  if(i===0)return ellipse(180,137,71,80,c,edge);
  if(i===1)return ellipse(180,135,64,88,c,edge);
  if(i===2)return `<rect x="111" y="58" width="138" height="157" rx="36" fill="${c}" stroke="${edge}" stroke-width="3"/>`;
  if(i===3)return path('M180 70C145 42 107 64 111 115C113 166 145 196 180 223C215 196 247 166 249 115C253 64 215 42 180 70Z',c,edge);
  return path('M180 55C131 55 112 87 113 118C96 150 110 188 142 205Q180 230 218 205C250 188 264 150 247 118C248 87 229 55 180 55Z',c,edge);
}
function hairBack(s) {
 const {style:i,color:c}=s.hair,edge=darken(c);
 if(i===1)return path('M111 78Q100 103 101 229Q180 251 259 229Q260 103 249 78Z',c,edge);
 if(i===2)return path('M113 76Q92 126 98 278Q131 290 150 268L180 148L210 268Q229 290 262 278Q268 126 247 76Z',c,edge);
 if(i===3)return ellipse(97,155,23,68,c,edge)+ellipse(263,155,23,68,c,edge)+ellipse(101,115,17,12,'#edb968')+ellipse(259,115,17,12,'#edb968');
 if(i===4)return [103,124,145,166,187,208,229,250].map((x,i)=>ellipse(x,91+(i%2)*10,24,31,c,edge)).join('');
 return '';
}
function hairFront(s) {
 const {style:i,color:c}=s.hair,edge=darken(c);
 if(i===6)return '';
 if(i===0)return path('M110 139L108 92Q112 57 142 52L151 37L169 48L186 32L197 48Q244 43 252 91L248 136L236 98Q212 99 201 80Q174 104 126 98Z',c,edge);
 if(i===1)return path('M108 140L108 91Q115 44 180 46Q245 44 252 91L252 140L236 133L236 101L194 101L181 83L174 101L124 101L124 135Z',c,edge);
 if(i===2)return path('M108 150L108 89Q114 45 177 48Q235 39 251 85L254 152L238 143L231 88Q190 118 129 108L124 148Z',c,edge);
 if(i===3)return path('M109 139L109 89Q114 47 180 48Q246 47 251 89L251 139L237 116L231 90Q209 109 180 92Q151 109 129 90L123 116Z',c,edge);
 if(i===4)return [112,134,158,183,207,231,248].map((x,i)=>ellipse(x,77-(i%3)*8,20,22,c,edge)).join('');
 return path('M111 113L110 90Q119 48 180 48Q241 48 250 90L249 113L235 84Q180 67 125 84Z',c,edge);
}
function eyebrows(s) {
 const {style:i,color:c}=s.brows;
 const lines=[['M137 111Q151 103 163 109','M197 109Q209 103 223 111'],['M137 109H163','M197 109H223'],['M137 110Q151 103 163 109','M197 109Q209 103 223 110'],['M137 114L162 104','M198 104L223 114'],['M144 108H158','M202 108H216']][i];
 return lines.map(d=>path(d,'none',c,i===2?8:4)).join('');
}
function eyes(s) {
 const {style:i,color:c}=s.eyes;
 function eye(x,side) {
  if(i===3 || (i===4&&side===1))return path(`M${x-12} 134Q${x} 121 ${x+12} 134`,'none',c,4);
  if(i===0)return ellipse(x,135,7,9,c)+ellipse(x-2,132,2,2,'#fff');
  if(i===2)return path(`M${x-15} 134Q${x} 117 ${x+15} 134Q${x} 148 ${x-15} 134Z`,'#fff','#6c5548',2)+ellipse(x,133,7,9,c)+ellipse(x-2,130,2,2,'#fff');
  if(i===5)return path(`M${x} 120L${x+4} 130L${x+15} 130L${x+6} 137L${x+9} 147L${x} 141L${x-9} 147L${x-6} 137L${x-15} 130L${x-4} 130Z`,c)+ellipse(x-2,129,2,2,'#fff');
  return ellipse(x,135,13,16,'#fff')+ellipse(x,135,9,12,c)+ellipse(x-3,131,3,4,'#fff');
 }
 return eye(150,0)+eye(210,1);
}
function nose(s) {
 const {style:i,color:c}=s.nose;
 if(i===0)return ellipse(180,157,9,8,c,darken(c));
 if(i===1)return path('M180 145L170 163H190Z',c,darken(c),2);
 if(i===2)return path('M174 158Q180 164 186 158','none',c,4);
 if(i===3)return path('M181 144L174 163Q181 169 188 162','none',c,4);
 return path('M178 150Q190 147 190 158Q188 166 177 163',c,darken(c),2);
}
function mouth(s) {
 const {style:i,color:c}=s.mouth;
 if(i===0)return path('M161 178Q180 193 199 178','none',c,4);
 if(i===1)return path('M160 177Q180 183 200 177Q199 202 180 203Q161 202 160 177Z',darken(c))+path('M169 198Q180 189 191 198Q180 207 169 198',c);
 if(i===2)return ellipse(180,186,9,12,c,darken(c));
 if(i===3)return path('M180 181C166 169 155 184 167 192L180 198L193 192C205 184 194 169 180 181Z',c);
 if(i===4)return path('M158 177Q180 184 202 177Q197 200 180 199Q163 200 158 177Z',c,darken(c),2)+path('M162 180Q180 187 198 180L194 187Q180 192 166 187Z','#fff');
 return path('M162 181Q168 193 180 182Q192 193 198 181','none',c,4);
}
function ears(s) {
 const {style:i,color:c}=s.ears,edge=darken(c);
 if(i===3)return path('M115 125L89 104Q91 165 115 160Z',c,edge)+path('M245 125L271 104Q269 165 245 160Z',c,edge);
 const rx=i===1?8:i===2?20:13, ry=i===1?15:i===2?27:21;
 let result=ellipse(109,143,rx,ry,c,edge)+ellipse(251,143,rx,ry,c,edge)+path('M107 134Q98 143 109 149','none',edge,2)+path('M253 134Q262 143 251 149','none',edge,2);
 if(i===4)result+=ellipse(103,166,8,10,'none','#d8ab52')+ellipse(257,166,8,10,'none','#d8ab52');
 return result;
}
function shirt(s) {
 const {style:i,color:c}=s.shirt,edge=darken(c);
 const short='M157 244L139 247L112 275L130 301L143 290L143 357Q180 368 217 357L217 290L230 301L248 275L221 247L203 244Q180 264 157 244Z';
 const long='M157 244L139 247L114 278L104 336L126 343L142 295L143 357Q180 368 217 357L218 295L234 343L256 336L246 278L221 247L203 244Q180 264 157 244Z';
 let result = '';
 if(i===3)result+=path('M149 251Q141 224 180 227Q219 224 211 251L201 262H159Z',c,edge);
 result+=path(i>=3?long:short,c,edge);
 if(i===1)result+=[275,294,313,332].map(y=>path(`M145 ${y}H215`,'none','#ffffff88',8)).join('');
 if(i===2)result+=[155,180,205].map((x,k)=>[278,300,323,344].map((y,j)=>ellipse(x+(j%2)*3,y,4,4,'#ffffff99')).join('')).join('');
 if(i===3)result+=path('M167 260L163 294M193 260L197 294','none','#fff7e5',3)+path('M156 326L166 310H194L204 326V342H156Z','none',edge,2);
 if(i===4)result+=path('M157 244L180 262L167 276L152 250M203 244L180 262L193 276L208 250', '#ffffffaa',edge,2)+path('M180 264V357','none',edge,2)+[286,309,332].map(y=>ellipse(180,y,2.5,2.5,'#fff7e5')).join('');
 if(i===5)result+=path('M144 349Q180 360 216 349M109 328L128 334M232 334L251 328','none','#ffffff88',4)+ellipse(180,296,15,15,'#ffffff66')+path('M180 285L184 293L193 294L186 300L188 309L180 304L172 309L174 300L167 294L176 293Z','#ffffffaa');
 return result;
}
function pants(s) {
 const {style:i,color:c}=s.pants,edge=darken(c);
 const d=i===1?'M143 346H217L224 396H188L180 373L172 396H136Z':'M143 346H217L223 451L190 453L180 383L170 453L137 451Z';
 if(i===5)return path('M148 346H212L235 414Q180 433 125 414Z',c,edge)+path('M158 357L145 409M180 357V415M202 357L215 409','none','#ffffff66',3);
 let result=path(d,c,edge);
 if(i===2)result+=path('M145 352Q157 378 174 361M186 361Q203 378 215 352M180 352V379M144 442L169 443M191 443L216 442','none','#ffffff88',3)+ellipse(180,352,3,3,'#e9c267');
 if(i===3)result+=[369,390,411,432].map(y=>path(`M141 ${y}H170M190 ${y}H220`,'none','#ffffff88',5)).join('');
 return result;
}
function overall(s) {
 if(s.pants.style!==4 && s.outfit?.style!==2)return '';
 const c=s.pants.color,edge=darken(c);
 return path('M150 265L160 267L164 303H196L200 267L210 265L207 352H153Z',c,edge)+ellipse(160,305,3,3,'#f1ca69')+ellipse(200,305,3,3,'#f1ca69')+path('M169 322H191V335Q180 343 169 335Z','none','#ffffff88',2);
}
function outfitLook(s) {
 if(!s.outfit?.style)return s;
 const styled={...s,pants:{...s.pants}};
 styled.pants.style=s.outfit.style===2?1:s.outfit.style===1?4:0;
 styled.pants.color=s.outfit.color;
 if(s.outfit.style===3)styled.shirt={style:3,color:s.outfit.color};
 return styled;
}
function character(s) {
 s=outfitLook(s);
 const skin=s.face.color;
 return hairBack(s)+ellipse(180,482,76,10,'#e8d4bf66')+
 path('M158 211H202V258Q180 274 158 258Z',skin,darken(skin))+
 path('M126 279L116 353M234 279L244 353','none',skin,19)+ellipse(115,357,11,14,skin)+ellipse(245,357,11,14,skin)+
 path('M155 350V463M205 350V463','none',skin,25)+
 path('M143 453Q128 454 126 469Q146 479 168 471L167 454Z','#fff8e8','#c9b49d',2)+path('M217 453Q232 454 234 469Q214 479 192 471L193 454Z','#fff8e8','#c9b49d',2)+
 pants(s)+shirt(s)+overall(s)+ears(s)+face(s)+
 ellipse(131,162,12,7,'#ef92944d')+ellipse(229,162,12,7,'#ef92944d')+
 hairFront(s)+eyebrows(s)+eyes(s)+nose(s)+mouth(s);
}
function svg(content,viewBox='0 0 360 510', accessible=false) { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" ${accessible?'role="img" aria-labelledby="characterTitle"':'aria-hidden="true"'}>${accessible?'<title id="characterTitle">你搭配的角色</title>':''}${content}</svg>`; }
function isCloseUp() { return closeUpOverride ?? (window.matchMedia('(max-width:680px)').matches && !wearKeys.includes(activeCategory)); }
function renderAvatar() {
 const close=isCloseUp();avatar.innerHTML=svg(character(look),close?'70 25 220 265':'0 0 360 510',true);
 const button=document.querySelector('#viewToggle');button.textContent=close?'看看全身':'放大看臉';button.setAttribute('aria-pressed',String(close));
}
function thumbnail(key,index) {
 const sample=structuredClone(look);sample[key].style=index;
 const renderers={face, hair:s=>hairBack(s)+face(s)+hairFront(s),brows:eyebrows,eyes,nose,mouth,ears,shirt,pants, outfit:s=>{const dressed=outfitLook(s);return pants(dressed)+shirt(dressed)+overall(dressed);}};
 const boxes={face:'88 30 184 207',hair:'65 25 230 270',brows:'120 84 120 54',eyes:'119 109 122 53',nose:'152 135 56 47',mouth:'145 159 70 58',ears:'76 96 208 92',shirt:'94 219 172 158',pants:'118 338 124 128',outfit:'94 220 172 244'};

 return svg(renderers[key](sample),boxes[key]);
}
function setPartColor(color) {
 look[activeCategory].color=color;
 if(activeCategory==='pants' || (activeCategory==='shirt' && look.outfit.style===3))look.outfit.style=0;
 if(activeCategory==='face')look.ears.color=color;
}
function saveLook() { try{localStorage.setItem(storageKey,JSON.stringify(look));}catch{} }
function renderOptions() {
 const category=categories.find(c=>c.key===activeCategory),part=look[activeCategory];
 document.querySelector('#categoryTitle').textContent=category.name;
 document.querySelector('#categoryHint').textContent=category.hint;
 document.querySelectorAll('.category-tab').forEach(button=>{const active=button.dataset.key===activeCategory || (button.dataset.key==='wear' && wearKeys.includes(activeCategory));button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active));});
 document.querySelector('#wearTabs').hidden=!wearKeys.includes(activeCategory);
 document.querySelectorAll('.wear-tab').forEach(button=>{const active=button.dataset.key===activeCategory;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active));});
 stylesList.replaceChildren();
 (category.styleIds || category.styles.map((_,index)=>index)).forEach(index=>{
  const name=category.styles[index];
  const button=document.createElement('button');button.type='button';button.className='style-option';button.dataset.style=index;button.classList.toggle('selected',part.style===index);button.setAttribute('aria-pressed',String(part.style===index));button.setAttribute('aria-label',`${category.name}：${name}`);
  button.innerHTML=thumbnail(activeCategory,index);const label=document.createElement('span');label.textContent=name;button.append(label);
  button.addEventListener('click',()=>{look[activeCategory].style=index;if(activeCategory==='pants' || (activeCategory==='shirt' && look.outfit.style===3))look.outfit.style=0;changed(`${category.name}換成${name}了！`);});stylesList.append(button);
 });
 renderColors();
}
function renderColors() {
 const category=categories.find(c=>c.key===activeCategory),color=look[activeCategory].color;
 colorsList.replaceChildren();
 for(const [name,value] of palettes[category.palette]){
  const button=document.createElement('button');button.type='button';button.className='color-swatch';button.style.setProperty('--swatch',value);button.dataset.color=value;button.title=name;button.setAttribute('aria-label',`${category.name}顏色：${name}`);button.classList.toggle('selected',color===value);button.setAttribute('aria-pressed',String(color===value));
  button.addEventListener('click',()=>{setPartColor(value);changed(`${category.name}換成${name}色了！`);});colorsList.append(button);
 }
 customColor.value=color;document.querySelector('#colorValue').textContent=color.toUpperCase();
}
function changed(message,options=true) {
 const focused=document.activeElement;
 const restore=focused?.classList.contains('style-option')?`[data-style="${focused.dataset.style}"]`:focused?.classList.contains('color-swatch')?`[data-color="${focused.dataset.color}"]`:null;
 renderAvatar();if(options)renderOptions();saveLook();status.textContent=message;
 if(restore)document.querySelector(restore)?.focus({preventScroll:true});
}
for(const category of mainCategories){
 const button=document.createElement('button');button.type='button';button.className='category-tab';button.dataset.key=category.key;
 const icon=document.createElement('span');icon.textContent=category.icon;icon.setAttribute('aria-hidden','true');button.append(icon,document.createTextNode(category.name));
 button.addEventListener('click',()=>{activeCategory=category.key==='wear'?(wearKeys.includes(activeCategory)?activeCategory:'shirt'):category.key;closeUpOverride=null;renderAvatar();renderOptions();});document.querySelector('#categories').append(button);
}
for(const key of wearKeys){
 const category=categories.find(item=>item.key===key),button=document.createElement('button');button.type='button';button.className='wear-tab';button.dataset.key=key;button.textContent=category.name;
 button.addEventListener('click',()=>{activeCategory=key;closeUpOverride=null;renderAvatar();renderOptions();});document.querySelector('#wearTabs').append(button);
}
customColor.addEventListener('input',()=>{setPartColor(customColor.value);renderAvatar();document.querySelector('#colorValue').textContent=customColor.value.toUpperCase();document.querySelectorAll('.color-swatch').forEach(button=>{const active=button.dataset.color===customColor.value;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active));});saveLook();status.textContent='這個顏色，是你自己選的！';});
document.querySelector('#randomize').addEventListener('click',()=>{
 for(const category of categories){const palette=palettes[category.palette];const ids=category.styleIds || category.styles.map((_,index)=>index);look[category.key]={style:ids[Math.floor(Math.random()*ids.length)],color:palette[Math.floor(Math.random()*palette.length)][1]};}
 look.ears.color=look.face.color;
 changed('驚喜！一個全新的搭配。');
});
document.querySelector('#reset').addEventListener('click',()=>{look=structuredClone(initial);changed('回到最初的樣子，再來玩一次！');});
document.querySelector('#download').addEventListener('click',async()=>{
 const button=document.querySelector('#download');button.disabled=true;let source;
 try{
  const snapshot=svg('<rect width="360" height="510" rx="24" fill="#fff5eb"/>'+character(look)).replace('<svg ', '<svg width="360" height="510" ');
  source=URL.createObjectURL(new Blob([snapshot],{type:'image/svg+xml;charset=utf-8'}));const image=new Image();image.src=source;await image.decode();
  const canvas=document.createElement('canvas');canvas.width=720;canvas.height=1020;canvas.getContext('2d').drawImage(image,0,0,720,1020);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('No image');
  const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='我的小小造型.png';document.body.append(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='圖片準備好了，可以保留你的創作！';
 }catch{status.textContent='這個瀏覽器暫時無法存圖，可以先截圖保留喔。';}
 finally{if(source)URL.revokeObjectURL(source);button.disabled=false;}
});
document.querySelector('#viewToggle').addEventListener('click',()=>{closeUpOverride=!isCloseUp();renderAvatar();});
window.matchMedia('(max-width:680px)').addEventListener('change',renderAvatar);
customColor.addEventListener('change',renderOptions);
renderAvatar();renderOptions();
