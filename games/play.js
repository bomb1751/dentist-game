window.Play = {
  svg(content, box='0 0 480 360', label='') { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" ${label?`role="img" aria-label="${label}"`:'aria-hidden="true"'}>${content}</svg>`; },
  path(d,fill,stroke='none',width=3) {return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;},
  ellipse(x,y,rx,ry,fill,stroke='none',width=2) {return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;},
  rect(x,y,w,h,r,fill,stroke='none') {return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;},
  point(element,x,y) {const r=element.getBoundingClientRect();return {x:(x-r.left)/r.width*480,y:(y-r.top)/r.height*360,inside:x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom};},
  save(key,value) {try{localStorage.setItem(key,JSON.stringify(value));}catch{}},
  load(key) {try{return JSON.parse(localStorage.getItem(key));}catch{return null;}},
  startDrag(event,options) {
    if(!event.isPrimary||event.button!==0||this.drag)return;
    event.preventDefault();const source=event.currentTarget;source.setPointerCapture(event.pointerId);
    this.drag={id:event.pointerId,source,...options};
    if(options.html){this.ghost ??= Object.assign(document.body.appendChild(document.createElement('div')),{className:'drag-layer'});this.ghost.hidden=false;this.ghost.innerHTML=options.html;this.ghost.style.left=`${event.clientX}px`;this.ghost.style.top=`${event.clientY}px`;}
  },
  endDrag(event,cancel=false) {
    const d=this.drag;if(!d||(event&&event.pointerId!==d.id))return;this.drag=null;if(this.ghost)this.ghost.hidden=true;
    if(d.source.hasPointerCapture(d.id))d.source.releasePointerCapture(d.id);
    if(cancel)d.onCancel?.();else d.onDrop?.(event.clientX,event.clientY);
  },
  async download(content,name) {
    const source=URL.createObjectURL(new Blob([this.svg(content).replace('<svg ','<svg width="480" height="360" ')],{type:'image/svg+xml'}));
    try{const image=new Image();image.src=source;await image.decode();const canvas=document.createElement('canvas');canvas.width=960;canvas.height=720;canvas.getContext('2d').drawImage(image,0,0,960,720);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Image unavailable');const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}finally{URL.revokeObjectURL(source);}
  },
};
document.addEventListener('pointermove',event=>{const d=Play.drag;if(!d||event.pointerId!==d.id)return;if(Play.ghost){Play.ghost.style.left=`${event.clientX}px`;Play.ghost.style.top=`${event.clientY}px`;}d.onMove?.(event.clientX,event.clientY);});
document.addEventListener('pointerup',event=>Play.endDrag(event));
document.addEventListener('pointercancel',event=>Play.endDrag(event,true));
document.addEventListener('lostpointercapture',event=>Play.endDrag(event,true));
window.addEventListener('blur',()=>Play.endDrag(null,true));
