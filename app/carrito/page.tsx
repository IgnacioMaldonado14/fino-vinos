import type {Metadata} from "next";
import {CartPage} from "@/components/cart";
export const metadata:Metadata={title:"Tu cava",robots:{index:false,follow:true},alternates:{canonical:null}};
export default function Page(){return <CartPage/>}
