import type {MetadataRoute} from "next";
import {wines} from "@/data/wines";
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_SITE_URL;if(!base?.startsWith('https://'))return [];return [{url:base,changeFrequency:'weekly',priority:1},...wines.map(w=>({url:`${base.replace(/\/$/,'')}/vinos/${w.slug}`,changeFrequency:'monthly' as const,priority:.7}))]}
