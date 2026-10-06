import type {Metadata,Viewport} from "next";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@/styles/globals.css";
import {site} from "@/data/site";
import {Providers} from "@/components/cart-provider";
import {Header} from "@/components/header";
import {Footer} from "@/components/footer";
import {CartDrawer,Toast} from "@/components/cart";
const url=process.env.NEXT_PUBLIC_SITE_URL;
const published=url&&/^https:\/\//.test(url)?new URL(url):null;
export const metadata:Metadata={
 metadataBase:published,
 title:{default:"Fino · Elegí tu próximo brindis",template:"%s · Fino"},
 description:site.description,
 icons:{icon:"/icon.svg"},
 openGraph:{title:"Fino · Elegí tu próximo brindis",description:site.description,type:"website",locale:"es_AR",siteName:"Fino",images:[{url:"/images/brindis.webp",width:1400,height:933,alt:"Un brindis, una invitación a disfrutar"}]},
 twitter:{card:"summary_large_image",title:"Fino · Elegí tu próximo brindis",description:site.description,images:["/images/brindis.webp"]},
 robots:{index:!!published,follow:true},
 ...(published?{alternates:{canonical:"/"}}:{}),
};
export const viewport:Viewport={width:"device-width",initialScale:1,themeColor:"#641b1b"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es-AR"><body><Providers><a href="#main" className="skip-link">Saltar al contenido</a><div className="reference-banner">LA CARTA DE SIEMPRE. UNA NUEVA FORMA DE DESCUBRIRLA.<span> · PRECIOS Y STOCK A CONFIRMAR</span></div><Header/>{children}<Footer/><CartDrawer/><Toast/></Providers></body></html>}
