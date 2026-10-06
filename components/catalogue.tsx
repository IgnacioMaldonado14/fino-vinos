"use client";
import { useState } from "react";
import Image from "next/image";
import { categories,wines,type CategoryId } from "@/data/wines";
import { WineCard } from "./wine-card";
import { Icon } from "./icons";
export function Catalogue(){
 const[active,setActive]=useState<CategoryId>('tintos'),[search,setSearch]=useState(''),[sort,setSort]=useState('editorial'),[expanded,setExpanded]=useState(false);
 const category=categories.find(c=>c.id===active)!;
 const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const filtered=wines.filter(w=>w.category===active&&normalize(`${w.name} ${w.winery??''} ${w.varietal??''}`).includes(normalize(search)));
 const ordered=[...filtered].sort((a,b)=>sort==='price-low'?(a.price??Infinity)-(b.price??Infinity):sort==='price-high'?(b.price??-1)-(a.price??-1):sort==='name'?a.name.localeCompare(b.name):Number(b.origin!==null)-Number(a.origin!==null)||Number(a.imagePlaceholder)-Number(b.imagePlaceholder));
 return <section id="carta" className="section catalogue"><div className="section-heading"><div><p className="eyebrow">02 / LA CARTA</p><h2>Una copa.<br/><em>Infinitas posibilidades.</em></h2></div><p>Recorré nuestra cava a tu manera.<br/>Elegí un estilo y dejate sorprender.</p></div>
  <div className="category-tabs" role="tablist" aria-label="Tipos de vino">{categories.map((c,i)=><button key={c.id} id={`tab-${c.id}`} role="tab" aria-selected={active===c.id} aria-controls="category-panel" tabIndex={active===c.id?0:-1} onKeyDown={e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?3:(i+(e.key==='ArrowRight'?1:3))%4;setActive(categories[next].id);setExpanded(false);document.getElementById(`tab-${categories[next].id}`)?.focus();}}} onClick={()=>{setActive(c.id);setExpanded(false);setSearch('');}}><span className="tab-num">0{i+1}</span><span>{c.name}</span><span className="tab-count">{wines.filter(w=>w.category===c.id).length}</span></button>)}</div>
  <div id="category-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="category-panel" tabIndex={0}><div className="category-intro" key={active}><div className={`category-glass ${active}`}><Image src="/images/copas-originales.png" alt={`Copa de vino ${category.name.toLowerCase()}, recurso original de Fino`} width={1536} height={1024} sizes="120px"/></div><div><p className="eyebrow">{category.mood}</p><h3>{category.name}</h3><p>{category.description}</p></div></div>
  <div className="catalogue-tools"><label className="search-field"><Icon name="search"/><span className="sr-only">Buscar en {category.name}</span><input type="search" placeholder="Encontrá tu próximo vino…" value={search} onChange={e=>{setSearch(e.target.value);setExpanded(false);}}/></label><label className="sort-field"><span>Ordenar por</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="editorial">Nuestra selección</option><option value="price-low">Menor precio</option><option value="price-high">Mayor precio</option><option value="name">Nombre</option></select></label></div>
  <p className="catalogue-note">Precios publicados en la carta original. Disponibilidad y valores actuales a confirmar. Carrito de prueba.</p>
  <div className="wine-grid" key={`${active}-${sort}`} aria-live="polite">{(expanded?ordered:ordered.slice(0,6)).map((wine,i)=><WineCard key={wine.id} wine={wine} index={i}/>)}{!ordered.length&&<div className="empty-search"><h3>No encontramos ese vino.</h3><p>Probá con otra etiqueta o varietal.</p><button className="button outline" onClick={()=>setSearch('')}>Limpiar búsqueda</button></div>}</div>
  {ordered.length>6&&!expanded&&<button className="button outline load-more" onClick={()=>setExpanded(true)}>Recorrer los {ordered.length} {category.name.toLowerCase()}<Icon name="arrow"/></button>}
  </div>
 </section>;
}
