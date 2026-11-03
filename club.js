(() => {
  const config=window.PULP_CLUB||{};
  function stripeUrl(value,host){try{const u=new URL(value);return u.protocol==='https:'&&u.hostname===host&&!u.username&&!u.password&&!u.pathname.includes('test_')?u.href:null}catch{return null}}
  const checkout=stripeUrl(config.checkoutUrl,'buy.stripe.com');
  if(checkout){document.getElementById('checkout-area').hidden=false;document.getElementById('prelaunch-area').hidden=true;document.getElementById('checkout-link').href=checkout;document.getElementById('billing-note').textContent=config.billingText||'$8 USD billed today, then monthly. Worldwide postage included. Cancel future renewals through the member portal.'}
  const portal=stripeUrl(config.portalUrl,'billing.stripe.com');
  if(portal){const a=document.getElementById('portal-link');a.hidden=false;a.href=portal}
  const mail=document.getElementById('mail-object'),toggle=document.getElementById('envelope-toggle'),label=document.getElementById('envelope-label'),message=document.getElementById('envelope-message'),insertLink=mail.querySelector('.mail-insert a');
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));mail.classList.toggle('is-open',open);label.textContent=open?'CLICK TO CLOSE':'CLICK TO OPEN';insertLink.tabIndex=open?0:-1;message.textContent=open?'A new envelope. Every month. The first leaves December 1.':'Open the envelope. Move things around. Stay a while.'});
  let topLayer=5;
  document.querySelectorAll('[data-movable]').forEach(piece=>{
    const handle=piece.querySelector('.move-handle');let x=0,y=0,drag=null;
    const position=()=>{piece.style.setProperty('--x',`${x}px`);piece.style.setProperty('--y',`${y}px`)};
    const bounds=()=>({x:Math.max(20,piece.parentElement.clientWidth*.15),y:75});
    handle.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={pointer:event.pointerId,startX:event.clientX,startY:event.clientY,x,y};handle.setPointerCapture(event.pointerId);piece.style.zIndex=String(++topLayer);event.preventDefault()});
    handle.addEventListener('pointermove',event=>{if(!drag||event.pointerId!==drag.pointer)return;const b=bounds();x=Math.max(-b.x,Math.min(b.x,drag.x+event.clientX-drag.startX));y=Math.max(-b.y,Math.min(b.y,drag.y+event.clientY-drag.startY));position()});
    const end=()=>{drag=null};handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);handle.addEventListener('lostpointercapture',end);
    handle.addEventListener('keydown',event=>{const shifts={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]};const delta=shifts[event.key];if(!delta)return;event.preventDefault();const b=bounds();x=Math.max(-b.x,Math.min(b.x,x+delta[0]));y=Math.max(-b.y,Math.min(b.y,y+delta[1]));position()});
    document.getElementById('reset-collage').addEventListener('click',()=>{x=0;y=0;piece.style.zIndex='';position()});
  });
  document.getElementById('reset-collage').addEventListener('click',()=>{mail.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');label.textContent='CLICK TO OPEN';insertLink.tabIndex=-1;message.textContent='Desk reset. Go on, make a little mess.'});
  const audio=document.getElementById('pulp-radio'),radio=document.getElementById('radio-toggle');audio.volume=.3;
  radio.addEventListener('click',async()=>{if(!audio.paused){audio.pause();radio.setAttribute('aria-pressed','false');radio.innerHTML='<span class="radio-dot"></span>Radio off';return}try{await audio.play();radio.setAttribute('aria-pressed','true');radio.innerHTML='<span class="radio-dot"></span>Radio on'}catch{radio.setAttribute('aria-pressed','false');radio.textContent='Radio unavailable';message.textContent='The radio could not play. You can keep exploring with sound off.'}});
})();
