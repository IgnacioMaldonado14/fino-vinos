"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { m } from "framer-motion";
import { navigation } from "@/data/site";
import { useCart } from "./cart-provider";
import { Icon } from "./icons";
import { Dialog } from "./dialog";
export function Header(){
 const {count,setOpen}=useCart();const[menu,setMenu]=useState(false),[scrolled,setScrolled]=useState(false);
 useEffect(()=>{const update=()=>setScrolled(window.scrollY>25);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);
 return <>
  <header className={`header ${scrolled?'scrolled':''}`}><div className="header-inner">
   <Link href="/" className="logo" aria-label="Fino, inicio">fino<span>VINOS & ENCUENTROS</span></Link>
   <nav className="desktop-nav" aria-label="Navegación principal">{navigation.map(([name,href])=><Link key={name} href={href}>{name}</Link>)}</nav>
   <div className="header-actions"><button className="cart-trigger" data-cart-anchor aria-label={`Abrir carrito, ${count} productos`} onClick={()=>setOpen(true)}><Icon name="bag"/><span className="cart-word">Tu cava</span><m.span key={count} initial={false} animate={{scale:[1,1.15,1]}} transition={{duration:.3}} className="cart-count">{count}</m.span></button><button className="icon-button mobile-menu-trigger" aria-label="Abrir menú" aria-expanded={menu} aria-controls="mobile-navigation" onClick={()=>setMenu(true)}><Icon name="menu"/></button></div>
  </div></header>
  <Dialog open={menu} onClose={()=>setMenu(false)} title="fino" id="mobile-navigation" className="menu-dialog"><nav className="mobile-nav" aria-label="Navegación móvil">{navigation.map(([name,href],i)=><Link key={href} href={href} onClick={()=>setMenu(false)}><span>0{i+1}</span>{name}<Icon name="arrow"/></Link>)}</nav><p className="menu-signoff">Elegí tu próximo brindis.</p></Dialog>
 </>;
}
