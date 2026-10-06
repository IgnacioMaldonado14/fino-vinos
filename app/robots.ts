import type {MetadataRoute} from "next";
export default function robots():MetadataRoute.Robots{const base=process.env.NEXT_PUBLIC_SITE_URL;return base?.startsWith('https://')?{rules:{userAgent:'*',allow:'/',disallow:['/checkout','/carrito']},sitemap:`${base.replace(/\/$/,'')}/sitemap.xml`}:{rules:{userAgent:'*',disallow:'/'}}}
