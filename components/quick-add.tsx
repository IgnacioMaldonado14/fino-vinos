"use client";
import {useEffect,useRef,useState} from "react";
import type {Wine} from "@/data/wines";
import {useCart} from "./cart-provider";
import {Icon} from "./icons";
export function Quantity({value,onChange,label}:{value:number;onChange:(value:number)=>void;label:string}){return <div className="quantity"><button type="button" onClick={()=>onChange(value-1)} disabled={value<=1} aria-label={`Disminuir cantidad de ${label}`}><Icon name="minus" width="14" height="14"/></button><output aria-label={`Cantidad de ${label}`}>{value}</output><button type="button" onClick={()=>onChange(value+1)} disabled={value>=99} aria-label={`Aumentar cantidad de ${label}`}><Icon name="plus" width="14" height="14"/></button></div>}
export function QuickAdd({wine}:{wine:Wine}){
 const[quantity,setQuantity]=useState(1),[state,setState]=useState<'idle'|'adding'|'added'>('idle');const{add,hydrated}=useCart();const locked=useRef(false),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 const unavailable=wine.price===null||wine.availability==='out-of-stock';
 return <div className="quick-add"><Quantity value={quantity} onChange={setQuantity} label={wine.name}/><button className="button add-button" disabled={unavailable||!hydrated||state==='adding'} onClick={async e=>{
  if(locked.current)return;if(timer.current)clearTimeout(timer.current);locked.current=true;const started=performance.now();setState('adding');const success=await add(wine,quantity,e.currentTarget);await new Promise(resolve=>setTimeout(resolve,Math.max(0,450-(performance.now()-started))));locked.current=false;setState(success?'added':'idle');if(success)timer.current=setTimeout(()=>setState('idle'),1800);
 }}>{unavailable?(wine.availability==='out-of-stock'?'Sin stock':'Precio a consultar'):state==='adding'?'Agregando…':state==='added'?<><Icon name="check" width="16" height="16"/>Agregado</>:'Agregar al carrito'}</button></div>;
}
