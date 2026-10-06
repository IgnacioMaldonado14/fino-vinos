"use client";
import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
export function Reveal({children,className="",delay=0}:{children:ReactNode;className?:string;delay?:number}){
 const reduce=useReducedMotion();
 return <m.div className={className} initial={false} whileInView={reduce?{}:{opacity:[0.45,1],y:[18,0]}} viewport={{once:true,amount:0.12}} transition={{duration:0.55,delay,ease:[0.22,1,0.36,1]}}>{children}</m.div>
}
