import type { SVGProps } from "react";
type Name = "arrow" | "bag" | "menu" | "close" | "plus" | "minus" | "check" | "search" | "pin" | "trash";
const paths: Record<Name,React.ReactNode> = {
 arrow:<><path d="M4 12h16M13 5l7 7-7 7"/></>,
 bag:<><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></>,
 menu:<><path d="M3 8h18M3 16h18"/></>, close:<path d="m6 6 12 12M6 18 18 6"/>,
 plus:<path d="M12 5v14M5 12h14"/>,minus:<path d="M5 12h14"/>,
 check:<path d="m5 12 4 4L19 6"/>,search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
 pin:<><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>,
 trash:<><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/></>,
};
export function Icon({name,...props}:SVGProps<SVGSVGElement>&{name:Name}){return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>}
export function GrapeIllustration({className=""}:{className?:string}) {return <svg className={className} viewBox="0 0 200 240" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M98 98c-5-32 8-53 36-68M102 77c-21-43-69-49-84-17 18 8 23 34 65 31M114 64c4-23 26-34 57-22-2 28-14 48-50 42M78 66c-5-17-23-15-25-6M135 63l21-10"/>{[[77,112],[108,109],[139,113],[63,143],[95,141],[126,143],[154,144],[79,172],[111,173],[141,172],[96,202],[127,202],[111,228]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="15"/>)}<path d="M96 55c-7-15-3-37 5-47"/></svg>}
