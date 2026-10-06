"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import { wines, type Wine } from "@/data/wines";
import { addCartLine, normalizeCart, cartTotal, MAX_QUANTITY, type CartLine } from "@/data/cart-model";
const KEY="fino-cart-v1";
type CartContextValue={lines:CartLine[];hydrated:boolean;count:number;total:number;open:boolean;setOpen:(v:boolean)=>void;add:(wine:Wine,quantity:number,source?:HTMLElement|null)=>Promise<boolean>;change:(id:string,quantity:number)=>void;remove:(id:string)=>void;toast:{message:string;error:boolean}|null;notify:(message:string,error?:boolean)=>void};
const Context=createContext<CartContextValue|null>(null);
export function useCart(){const value=useContext(Context);if(!value)throw new Error("CartProvider requerido");return value;}
function flyToCart(wine:Wine,source?:HTMLElement|null){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!source) return Promise.resolve();
 const image=source.closest('[data-product]')?.querySelector<HTMLImageElement>('[data-bottle]');
 const target=document.querySelector<HTMLElement>('[data-cart-anchor]');
 if(!image||!target)return Promise.resolve();
 const a=image.getBoundingClientRect(),b=target.getBoundingClientRect();
 if(a.bottom<0||a.top>window.innerHeight)return Promise.resolve();
 const clone=document.createElement('img');clone.src=wine.image;clone.alt='';clone.setAttribute('aria-hidden','true');
 Object.assign(clone.style,{position:'fixed',pointerEvents:'none',zIndex:'10000',objectFit:'contain',left:`${a.left}px`,top:`${a.top}px`,width:`${a.width}px`,height:`${a.height}px`});
 document.body.appendChild(clone);
 const dx=b.left+b.width/2-a.left-a.width/2,dy=b.top+b.height/2-a.top-a.height/2;
 const animation=clone.animate([{transform:'translate(0,0) scale(1)',opacity:0.8},{transform:`translate(${dx*.45}px,${dy*.4-45}px) scale(.6)`,opacity:.7,offset:.5},{transform:`translate(${dx}px,${dy}px) scale(.05)`,opacity:0}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
 return animation.finished.catch(()=>{}).then(()=>clone.remove());
}
export function Providers({children}:{children:ReactNode}){
 const [lines,setLines]=useState<CartLine[]>([]),[hydrated,setHydrated]=useState(false),[open,setOpen]=useState(false);
 const [toast,setToast]=useState<{message:string;error:boolean}|null>(null);
 const current=useRef(lines),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const notify=useCallback((message:string,error=false)=>{setToast({message,error});if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setToast(null),4000);},[]);
 useEffect(()=>{
  try{const saved=localStorage.getItem(KEY);const loaded=normalizeCart(saved?JSON.parse(saved):[],wines);current.current=loaded;setLines(loaded);}
  catch{notify("No pudimos recuperar tu carrito anterior. Podés volver a elegir tus vinos.",true);}
  setHydrated(true);return ()=>{if(timer.current)clearTimeout(timer.current);};
 },[notify]);
 useEffect(()=>{if(hydrated){try{localStorage.setItem(KEY,JSON.stringify(lines));}catch{notify("El carrito funciona, pero este navegador no permite guardarlo al cerrar.",true);}}},[lines,hydrated,notify]);
 const update=(next:CartLine[])=>{current.current=next;setLines(next);};
 const add=async(wine:Wine,quantity:number,source?:HTMLElement|null)=>{
  try{const next=addCartLine(current.current,wine,quantity);update(next);notify(`${wine.name} agregado a tu cava`);await flyToCart(wine,source);return true;}
  catch(e){notify(e instanceof Error?e.message:"No pudimos agregar este vino.",true);return false;}
 };
 const change=(id:string,quantity:number)=>{if(!Number.isSafeInteger(quantity)||quantity<1||quantity>MAX_QUANTITY)return;update(current.current.map(l=>l.id===id?{...l,quantity}:l));};
 const remove=(id:string)=>{update(current.current.filter(l=>l.id!==id));notify("Vino eliminado del carrito");};
 return <LazyMotion features={domAnimation}><MotionConfig reducedMotion="user"><Context.Provider value={{lines,hydrated,count:lines.reduce((s,l)=>s+l.quantity,0),total:cartTotal(lines,wines),open,setOpen,add,change,remove,toast,notify}}>{children}</Context.Provider></MotionConfig></LazyMotion>;
}
