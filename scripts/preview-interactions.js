/* Standalone HTML preview. The production app remains Next.js. */
(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('fino-preview-data').textContent);
  const wines = data.wines;
  const key = 'fino-preview-cart-v1';
  let cart = [];
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) cart = saved.filter(l => wines.some(w => w.id === l.id && w.price !== null) && Number.isInteger(l.quantity) && l.quantity > 0 && l.quantity <= 99);
  } catch { cart = []; }
  const price = n => '$' + new Intl.NumberFormat('es-AR').format(n);
  const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let active = 'tintos';
  let noticeTimer;
  const quantity = (id,q) => `<div class="quantity"><button type="button" data-step="-1" ${q <= 1 ? 'disabled' : ''} aria-label="Disminuir cantidad de ${escape(id)}">−</button><output>${q}</output><button type="button" data-step="1" ${q >= 99 ? 'disabled' : ''} aria-label="Aumentar cantidad de ${escape(id)}">+</button></div>`;
  function toast(message) {
    const zone = document.querySelector('.toast-zone');
    zone.innerHTML = `<div class="toast"><span>${escape(message)}</span><button data-open-cart>Ver carrito</button></div>`;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => zone.replaceChildren(), 4000);
  }
  function closeDialog(dialog) { if (dialog?.open) dialog.close(); }
  function showDialog(dialog) {
    document.querySelectorAll('dialog[open]').forEach(d => { if (d !== dialog) d.close(); });
    if (!dialog.open) dialog.showModal();
  }
  function total() { return cart.reduce((sum,l)=>sum+wines.find(w=>w.id===l.id).price*l.quantity,0); }
  function refreshCart() {
    const count = cart.reduce((s,l)=>s+l.quantity,0);
    document.querySelectorAll('.cart-count').forEach(e=>e.textContent=String(count));
    const trigger=document.querySelector('[data-cart-anchor]');
    trigger.setAttribute('aria-label',`Abrir carrito, ${count} productos`);
    const dialog=document.querySelector('.cart-dialog');
    dialog.querySelector('h2').textContent=`Tu cava (${count})`;
    const content=dialog.querySelector('.preview-cart-content');
    if (!cart.length) content.innerHTML='<div class="empty-cart"><h3>Tu cava todavía<br/><em>está vacía.</em></h3><p>Hay una historia esperando en cada botella.</p><a href="#carta" data-close-dialog class="button">Explorar vinos →</a></div>';
    else content.innerHTML=`<div class="cart-scroll"><ul class="cart-items">${cart.map(l=>{
      const w=wines.find(w=>w.id===l.id);
      return `<li class="cart-item" data-cart-id="${w.id}"><div class="cart-item-image"><img src="${w.image}" alt="${escape(w.name)}" width="70" height="160"></div><div class="cart-item-info"><p class="eyebrow">${w.category}</p><span class="cart-item-name">${escape(w.name)}</span><p>${escape(w.winery||'Bodega a confirmar')}</p><span class="unit-price">${price(w.price)} / unidad</span><div class="cart-item-controls">${quantity(w.name,l.quantity)}<button class="icon-button" data-remove="${w.id}" aria-label="Eliminar ${escape(w.name)}">×</button></div></div><strong class="item-subtotal">${price(w.price*l.quantity)}</strong></li>`;
    }).join('')}</ul></div><div class="cart-summary"><div><span>Subtotal de referencia</span><strong>${price(total())}</strong></div><p class="fine-print">Vista de prueba. Precios y stock a confirmar; no se procesan pagos ni se envían pedidos.</p><button class="button" data-preview-checkout>Preparar resumen →</button><button class="text-link" data-close-dialog>Seguir comprando</button></div>`;
    try { localStorage.setItem(key,JSON.stringify(cart)); } catch { /* In-memory fallback on restricted file origins. */ }
  }
  function filterAndSort() {
    const panel=document.getElementById('category-panel');
    const searchInput=panel.querySelector('input[type=search]');
    if(panel.querySelector('.load-more')) {
      const query=searchInput.value,sort=panel.querySelector('select').value,focused=document.activeElement===searchInput;
      category(active);const next=document.querySelector('#category-panel input[type=search]');next.value=query;document.querySelector('#category-panel select').value=sort;if(focused)next.focus();return filterAndSort();
    }
    const query=normalize(searchInput.value);
    const sort=panel.querySelector('select').value;
    const cards=[...panel.querySelectorAll('.wine-card')];
    cards.forEach(card=>{card.hidden=!normalize(card.textContent).includes(query);});
    const byWine=card=>wines.find(w=>w.id===card.dataset.wineId);
    cards.sort((a,b)=>{
      const x=byWine(a),y=byWine(b);
      return sort==='price-low'?(x.price??Infinity)-(y.price??Infinity):sort==='price-high'?(y.price??-1)-(x.price??-1):sort==='name'?x.name.localeCompare(y.name):Number(!!y.origin)-Number(!!x.origin)||Number(x.imagePlaceholder)-Number(y.imagePlaceholder);
    });
    const grid=panel.querySelector('.wine-grid');cards.forEach(card=>grid.appendChild(card));
    let empty=panel.querySelector('.preview-empty-search');
    if(!cards.some(c=>!c.hidden)) {
      if(!empty){empty=document.createElement('div');empty.className='empty-search preview-empty-search';empty.innerHTML='<h3>No encontramos ese vino.</h3><p>Probá con otra etiqueta o varietal.</p><button class="button outline" data-clear-search>Limpiar búsqueda</button>';grid.appendChild(empty);}
    } else empty?.remove();
  }
  function category(id) {
    active=id;
    document.querySelectorAll('[role=tab]').forEach(tab=>{const chosen=tab.id===`tab-${id}`;tab.setAttribute('aria-selected',String(chosen));tab.tabIndex=chosen?0:-1;});
    document.getElementById('category-panel').outerHTML=data.panels[id];
    document.getElementById('category-panel').setAttribute('aria-labelledby',`tab-${id}`);
  }
  function details(id) {
    const w=wines.find(w=>w.id===id);if(!w)return;
    const dialog=document.getElementById('preview-wine-dialog');
    dialog.querySelector('h2').textContent=w.name;
    dialog.querySelector('.preview-wine-content').innerHTML=`<div class="preview-detail-photo"><img src="${w.image}" alt="${escape(w.imagePlaceholder?'Imagen provisoria de '+w.name:w.name)}" width="180" height="450"></div><p class="eyebrow">${escape(w.winery||'Bodega por confirmar')} · ${escape(w.category)}</p><p class="detail-varietal">${escape(w.varietal||'Varietal por confirmar')}</p><p class="detail-description">${escape(w.description||'La ficha técnica de este vino está pendiente de confirmación.')}</p><dl class="detail-facts"><div><dt>Región</dt><dd>${escape(w.region||'Por confirmar')}</dd></div><div><dt>Temperatura</dt><dd>${escape(w.temperature||'Por confirmar')}</dd></div><div><dt>Añada</dt><dd>Por confirmar</dd></div><div><dt>Notas de cata</dt><dd>${escape(w.tastingNotes.join(' · ')||'Por confirmar')}</dd></div></dl><strong>${w.price===null?'Precio a consultar':price(w.price)}</strong><p class="fine-print">${w.imagePlaceholder?'Imagen provisoria. ':''}Precio publicado en la carta original; stock a confirmar.</p><div class="quick-add" data-product data-wine-id="${w.id}">${quantity(w.name,1)}<button class="button add-button" ${w.price===null?'disabled':''}>${w.price===null?'Precio a consultar':'Agregar al carrito'}</button></div>`;
    showDialog(dialog);
  }
  function add(button) {
    if(button.disabled||button.dataset.busy)return;
    const product=button.closest('[data-product]');const w=wines.find(w=>w.id===product.dataset.wineId);if(!w||w.price===null)return;
    const qty=Number(product.querySelector('.quick-add output').textContent);const line=cart.find(l=>l.id===w.id);
    if((line?.quantity||0)+qty>99){toast('Podés agregar hasta 99 unidades de cada vino.');return;}
    if(line)line.quantity+=qty;else cart.push({id:w.id,quantity:qty});
    button.dataset.busy='true';button.disabled=true;button.textContent='Agregando…';
    refreshCart();toast(`${w.name} agregado a tu cava`);
    const source=product.querySelector('[data-bottle]'), target=document.querySelector('[data-cart-anchor]');
    if(source&&target&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      const a=source.getBoundingClientRect(),b=target.getBoundingClientRect(),clone=source.cloneNode();
      clone.alt='';clone.setAttribute('aria-hidden','true');
      Object.assign(clone.style,{position:'fixed',pointerEvents:'none',zIndex:10000,left:a.left+'px',top:a.top+'px',width:a.width+'px',height:a.height+'px',objectFit:'contain'});document.body.appendChild(clone);
      const x=b.left-a.left,y=b.top-a.top;
      clone.animate([{transform:'translate(0,0) scale(1)',opacity:.8},{transform:`translate(${x*.45}px,${y*.4-40}px) scale(.6)`,opacity:.7},{transform:`translate(${x}px,${y}px) scale(.05)`,opacity:0}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'}).finished.then(()=>clone.remove(),()=>clone.remove());
    }
    setTimeout(()=>{button.disabled=false;delete button.dataset.busy;button.textContent='✓ Agregado';setTimeout(()=>{if(!button.dataset.busy)button.textContent='Agregar al carrito';},1500);},650);
  }
  function checkout() {
    if(!cart.length)return;
    const text=['FINO · SELECCIÓN DE PRUEBA',...cart.map(l=>{const w=wines.find(w=>w.id===l.id);return `${l.quantity} × ${w.name} · ${price(w.price*l.quantity)}`;}),`Total de referencia: ${price(total())}`,'Precios y stock a confirmar. No se envió un pedido ni se realizó un pago.'].join('\n');
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='fino-mi-seleccion.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Resumen preparado. No se procesó ningún pago.');
  }
  document.addEventListener('click',e=>{
    const button=e.target.closest('button'),link=e.target.closest('a');
    if(button?.matches('.load-more')){category(active);return;}
    if(button?.matches('[role=tab]')){category(button.id.replace('tab-',''));return;}
    if(button?.matches('.mobile-menu-trigger')){showDialog(document.querySelector('.menu-dialog'));return;}
    if(button?.matches('[data-cart-anchor],[data-open-cart]')){refreshCart();showDialog(document.querySelector('.cart-dialog'));return;}
    if(button?.matches('[data-close-dialog],.dialog-head .icon-button,.drawer-continue')){closeDialog(button.closest('dialog'));return;}
    if(button?.matches('.add-button')){add(button);return;}
    if(button?.closest('.quantity')){
      const q=button.closest('.quantity'),output=q.querySelector('output');
      const step=button.dataset.step?Number(button.dataset.step):button.getAttribute('aria-label').startsWith('Aumentar')?1:-1;
      const value=Math.max(1,Math.min(99,Number(output.textContent)+step));
      const item=button.closest('[data-cart-id]');
      if(item){cart.find(l=>l.id===item.dataset.cartId).quantity=value;refreshCart();}
      else {output.textContent=String(value);q.querySelector('button:first-child').disabled=value<=1;q.querySelector('button:last-child').disabled=value>=99;}
      return;
    }
    if(button?.dataset.remove){cart=cart.filter(l=>l.id!==button.dataset.remove);refreshCart();toast('Vino eliminado del carrito');return;}
    if(button?.matches('[data-preview-checkout]')){checkout();return;}
    if(button?.matches('[data-clear-search]')){document.querySelector('#category-panel input[type=search]').value='';filterAndSort();return;}
    if(link){
      const href=link.getAttribute('href');
      if(href?.startsWith('/vinos/')){e.preventDefault();details(href.split('/').pop());return;}
      if(href==='/carrito'){e.preventDefault();refreshCart();showDialog(document.querySelector('.cart-dialog'));return;}
      if(href==='/checkout'){e.preventDefault();checkout();return;}
      if(href==='/'){e.preventDefault();window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
      if(link.closest('dialog'))closeDialog(link.closest('dialog'));
    }
  });
  document.addEventListener('input',e=>{if(e.target.matches('#category-panel input[type=search]'))filterAndSort();});
  document.addEventListener('change',e=>{if(e.target.matches('#category-panel select'))filterAndSort();});
  document.addEventListener('keydown',e=>{
    if(!e.target.matches('[role=tab]'))return;
    if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){
      e.preventDefault();const ids=['tintos','blancos','rosados','espumantes'];const index=ids.indexOf(active);const next=e.key==='Home'?0:e.key==='End'?3:(index+(e.key==='ArrowRight'?1:3))%4;category(ids[next]);document.getElementById(`tab-${ids[next]}`).focus();
    }
  });
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.addEventListener('click',e=>{if(e.target===dialog)closeDialog(dialog);});
  });
  window.addEventListener('scroll',()=>document.querySelector('.header').classList.toggle('scrolled',scrollY>25),{passive:true});
  refreshCart();
})();
