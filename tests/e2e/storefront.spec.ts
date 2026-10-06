import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('cart supports category discovery, add, persistence, quantity, removal and empty state',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await page.getByRole('tab',{name:/Blancos/}).click();
 const card=page.locator('#carta .wine-card').filter({hasText:'Salentein Reserva Chardonnay'});
 await expect(card).toHaveCount(1);
 await card.getByRole('button',{name:'Agregar al carrito'}).click();
 await expect(page.locator('.cart-count')).toHaveText('1');
 await expect(card.getByRole('button',{name:'Agregado',exact:true})).toBeVisible();
 await page.reload();await expect(page.locator('.cart-count')).toHaveText('1');
 await page.getByRole('button',{name:/Abrir carrito/}).click();
 const dialog=page.locator('.cart-dialog');
 await expect(dialog).toBeVisible();
 await dialog.getByRole('button',{name:'Aumentar cantidad de Salentein Reserva Chardonnay'}).click();
 await expect(page.locator('.cart-count')).toHaveText('2');
 await expect(dialog.getByText('$20.980',{exact:true}).first()).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.goto('/carrito');await page.getByRole('button',{name:'Eliminar Salentein Reserva Chardonnay'}).click();
 await expect(page.getByRole('heading',{name:'Tu cava todavía está vacía.'})).toBeVisible();
 expect(errors).toEqual([]);
});
test('wine detail and checkout produce a downloadable preview without pretending to charge',async({page})=>{
 await page.goto('/vinos/salentein-reserva-malbec');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Salentein Reserva Malbec');
 await expect(page.getByText('16 °C',{exact:true})).toBeVisible();
 await page.locator('.wine-detail-copy').getByRole('button',{name:'Agregar al carrito'}).click();
 await page.goto('/checkout');
 await page.getByLabel('Nombre',{exact:true}).fill('Prueba de usuario');
 await page.getByLabel('Email',{exact:true}).fill('prueba@example.com');
 await page.getByLabel('Entiendo que esto es un resumen de prueba y no una compra confirmada.').check();
 await page.getByRole('button',{name:'Preparar resumen'}).click();
 await expect(page.getByRole('heading',{name:'Tu selección está preparada.'})).toBeVisible();
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar resumen'}).click();
 const download=await downloadPromise;expect(download.suggestedFilename()).toBe('fino-mi-seleccion.txt');
 await expect(page.locator('pre')).toContainText('No se envió ningún pedido ni se realizó un pago.');
});
test('responsive layouts do not overflow at target phone and tablet widths',async({page})=>{
 await page.goto('/');
 for(const width of [375,390,430,768,1440]){
  await page.setViewportSize({width,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`).toBe(true);
 }
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Abrir menú'}).click();
 const menu=page.getByRole('dialog',{name:'fino'});await expect(menu).toBeVisible();
 await menu.getByRole('link',{name:/Carta/}).click();await expect(menu).not.toBeVisible();
 await expect(page.getByRole('tab',{name:/Tintos/})).toBeVisible();
});
test('search, tabs, keyboard, missing prices and corrupt cart have valid states',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('fino-cart-v1','{broken'));
 await page.goto('/');await expect(page.locator('.cart-count')).toHaveText('0');
 await page.getByRole('tab',{name:/Tintos/}).focus();await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('tab',{name:/Blancos/})).toHaveAttribute('aria-selected','true');
 await page.getByRole('searchbox').fill('no-existe-este-vino');
 await expect(page.getByRole('heading',{name:'No encontramos ese vino.'})).toBeVisible();
 await page.getByRole('button',{name:'Limpiar búsqueda'}).click();
 await page.goto('/vinos/intocables-malbec');
 await expect(page.getByRole('button',{name:'Precio a consultar'}).first()).toBeDisabled();
 await page.goto('/vinos/no-existe');await expect(page.getByRole('heading',{name:'Este vino no está por acá.'})).toBeVisible();
});
test('reduced motion skips fly animation and pages have no serious accessibility violations',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 await page.locator('#carta .wine-card').first().getByRole('button',{name:'Agregar al carrito'}).click();
 await expect(page.locator('.cart-count')).toHaveText('1');
 expect(await page.locator('body>img').count()).toBe(0);
 await page.getByRole('button',{name:/Abrir carrito/}).click();
 const drawerResults=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(drawerResults.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});
