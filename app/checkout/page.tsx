import type {Metadata} from "next";
import {Checkout} from "@/components/checkout";
export const metadata:Metadata={title:"Prepará tu selección",robots:{index:false,follow:true},alternates:{canonical:null}};
export default function Page(){return <Checkout/>}
