"use client";
import { useEffect,useRef,type ReactNode } from "react";
import { Icon } from "./icons";
export function Dialog({open,onClose,title,id,children,className=""}:{open:boolean;onClose:()=>void;title:string;id:string;children:ReactNode;className?:string}){
 const ref=useRef<HTMLDialogElement>(null),close=useRef(onClose);close.current=onClose;
 useEffect(()=>{const d=ref.current;if(!d)return;if(open&&!d.open)d.showModal();else if(!open&&d.open)d.close();
  if(open){const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous;};}
 },[open]);
 return <dialog ref={ref} className={`dialog ${className}`} aria-labelledby={`${id}-title`} onCancel={()=>close.current()} onClose={()=>close.current()} onClick={e=>{if(e.target===e.currentTarget)close.current();}}>
  <div className="dialog-inner"><div className="dialog-head"><h2 id={`${id}-title`}>{title}</h2><button className="icon-button" onClick={onClose} aria-label={`Cerrar ${title}`} autoFocus><Icon name="close"/></button></div>{children}</div>
 </dialog>;
}
