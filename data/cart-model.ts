export type CartLine = { id: string; quantity: number };
export type CartProduct = { id: string; price: number | null; availability: string };
export const MAX_QUANTITY = 99;
export function normalizeCart(input: unknown, catalog: CartProduct[]): CartLine[] {
 if (!Array.isArray(input)) return [];
 const merged = new Map<string,number>();
 for (const value of input) {
  if (!value || typeof value!=="object" || typeof value.id!=="string" || !Number.isSafeInteger(value.quantity) || value.quantity<1) continue;
  const product=catalog.find(w=>w.id===value.id);
  if(!product || product.price===null || product.availability==="out-of-stock") continue;
  merged.set(value.id,Math.min(MAX_QUANTITY,(merged.get(value.id)??0)+value.quantity));
 }
 return [...merged].map(([id,quantity])=>({id,quantity}));
}
export function addCartLine(lines:CartLine[],product:CartProduct,quantity:number):CartLine[]{
 if(product.price===null || product.availability==="out-of-stock") throw new Error("Este vino no está disponible para agregar.");
 if(!Number.isSafeInteger(quantity)||quantity<1||quantity>MAX_QUANTITY) throw new Error("Elegí una cantidad entre 1 y 99.");
 const current=lines.find(l=>l.id===product.id);
 if((current?.quantity??0)+quantity>MAX_QUANTITY) throw new Error("Podés agregar hasta 99 unidades de cada vino.");
 return current?lines.map(l=>l.id===product.id?{...l,quantity:l.quantity+quantity}:l):[...lines,{id:product.id,quantity}];
}
export function cartTotal(lines:CartLine[],catalog:CartProduct[]):number{
 return lines.reduce((sum,l)=>sum+(catalog.find(w=>w.id===l.id)?.price??0)*l.quantity,0);
}
