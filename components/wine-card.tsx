import Image from "next/image";
import Link from "next/link";
import {type Wine,formatPrice,categoryName} from "@/data/wines";
import {Icon} from "./icons";
import {QuickAdd} from "./quick-add";
export function WineCard({wine,index=0}:{wine:Wine;index?:number}){return <article className={`wine-card ${wine.category}`} data-product>
 <div className="wine-image"><span className="wine-index">{String(index+1).padStart(2,'0')}</span><span className="wine-category">{categoryName(wine.category)}</span><Link href={`/vinos/${wine.slug}`} aria-label={`Descubrir ${wine.name}`} className="bottle-link"><Image data-bottle src={wine.image} alt={wine.imagePlaceholder?`Imagen provisoria de ${wine.name}`:`Botella de ${wine.name}`} width={180} height={450} sizes="(max-width: 600px) 150px, 180px" unoptimized={wine.imagePlaceholder}/></Link>{wine.imagePlaceholder&&<span className="image-placeholder-label">Imagen provisoria</span>}<svg className="wine-watermark" viewBox="0 0 180 200" width="180" height="200" aria-hidden="true" focusable="false"><text x="10" y="180" fill="currentColor" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="200">f.</text></svg></div>
 <div className="wine-content"><p className="eyebrow">{wine.winery??'De nuestra carta'}{wine.region&&` · ${wine.region}`}</p><h3><Link href={`/vinos/${wine.slug}`}>{wine.name}</Link></h3><p className="wine-varietal">{wine.varietal??'Varietal a confirmar'}</p><div className="wine-price-row"><strong>{wine.price===null?'Consultar':formatPrice(wine.price)}</strong><span>{wine.availability==='out-of-stock'?'Sin stock':'Stock a confirmar'}</span></div><QuickAdd wine={wine}/><Link href={`/vinos/${wine.slug}`} className="text-link wine-detail-link">Ver vino<Icon name="arrow" width="16" height="16"/></Link></div>
 </article>}
