export type CategoryId = "tintos" | "blancos" | "rosados" | "espumantes";
export type Wine = {
  id: string; slug: string; name: string; category: CategoryId;
  winery: string | null; varietal: string | null; region: string | null;
  province: string | null; country: string | null; vintage: string | null;
  price: number | null; availability: "unconfirmed" | "out-of-stock" | "available";
  description: string | null; tastingNotes: string[]; pairing: string[];
  temperature: string | null; image: string; imagePlaceholder: boolean;
  source: string; technicalSource: string | null;
  origin: { place: string; terroir: string; altitude: string | null; climate: string; story: string } | null;
};
export const categories: {id: CategoryId; name: string; description: string; mood: string}[] = [
  {id:"tintos",name:"Tintos",description:"Para las sobremesas que se alargan. Descubrí Malbec, Cabernet Franc, Pinot Noir y cortes en nuestra carta.",mood:"Carácter & profundidad"},
  {id:"blancos",name:"Blancos",description:"Otra manera de mirar el vino. Chardonnay, Sauvignon Blanc y blends para descubrir copa a copa.",mood:"Frescura & expresión"},
  {id:"rosados",name:"Rosados",description:"El encuentro entre sutileza y color. Tres etiquetas para recorrer una cara distinta de la carta.",mood:"Sutileza & encuentro"},
  {id:"espumantes",name:"Espumantes",description:"Siempre hay algo para celebrar. Brut Nature, Extra Brut y Rosé para acompañar tu próximo brindis.",mood:"Burbujas & celebración"},
];
const reference = "https://finovino.my.canva.site/page-2";
const rows: [CategoryId,string,number|null][] = [
 ["tintos","Cordero con Piel de Lobo",4500], ["tintos","Portillo Malbec",4790],
 ["tintos","Familia Gascón Malbec",5490], ["tintos","Alamos Malbec",6490],
 ["tintos","Familia Bianchi Malbec",6490], ["tintos","Fabre Montmayou Malbec",6990],
 ["tintos","Fond de Cave Malbec",6990], ["tintos","Perro Callejero Malbec",6990],
 ["tintos","Perro Callejero Pinot Noir",6990], ["tintos","Intocables Malbec",null],
 ["tintos","Nicasia Malbec",7490], ["tintos","Nicasia Cabernet Franc",7490],
 ["tintos","Escorihuela Gascón Malbec",12990], ["tintos","La Linda Malbec",8490],
 ["tintos","Trumpeter Cabernet Sauvignon",8990], ["tintos","Trumpeter Malbec",8990],
 ["tintos","Pispi Blend de Tintas",8990], ["tintos","Saint Felicien Malbec",9490],
 ["tintos","Saint Felicien Cabernet Franc",9490], ["tintos","Fond de Cave Reserva",12990],
 ["tintos","Salentein Reserva Malbec",10490], ["tintos","Nicasia Grand Blend",10990],
 ["tintos","Sapo de Otro Pozo",11490], ["tintos","DV Catena Cab/Mal",12490],
 ["tintos","Luigi Bosca Malbec",14990], ["tintos","Luigi Bosca Cabernet",14990],
 ["tintos","DV Catena Pinot Noir",15990], ["tintos","Rutini Cab/Mal",16490],
 ["tintos","Mosquita Muerta Blend",16490], ["tintos","Mosquita Muerta Pinot Noir",16490],
 ["tintos","DV Catena Malbec/Malbec",18490], ["tintos","El Enemigo Malbec",19990],
 ["tintos","El Enemigo Cabernet Franc",19990], ["tintos","Luigi Bosca Sangre Malbec DOC",23990],
 ["tintos","Angélica Zapata Malbec",26990], ["tintos","Gran Enemigo",null],
 ["tintos","Gran Enemigo Gualtallary",44990], ["tintos","Malbec Argentino",59990],
 ["blancos","Cordero Chardonnay",4490], ["blancos","Portillo Sauvignon Blanc",4790],
 ["blancos","Álamos Chardonnay",6490], ["blancos","Perro Callejero Chardonnay",6990],
 ["blancos","Nicasia Blanc de Blancs",7490], ["blancos","Saint Felicien Chardonnay",9490],
 ["blancos","Trumpeter Chardonnay",8990], ["blancos","Salentein Reserva Chardonnay",10490],
 ["blancos","Luigi Bosca Chardonnay",12490], ["blancos","DV Catena Chardonnay",15990],
 ["blancos","Enemigo Chardonnay",19990],
 ["rosados","Cordero con Piel de Lobo Rosé",4490], ["rosados","Perro Callejero Rosé",6990],
 ["rosados","Salentein Reserva Rosado",10490],
 ["espumantes","Nieto Brut Nature",9990], ["espumantes","Cordero con Piel de Lobo Extra Brut",5490],
 ["espumantes","Salentein Extra Brut",12490], ["espumantes","Salentein Brut Nature",13490],
 ["espumantes","Salentein Brut Rosé",13490], ["espumantes","Nieto Senetiner Extra Brut",12990],
 ["espumantes","Barón B Extra Brut",17990],
];
export const slugify = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const wineryOrigin = {
  terroir:"Suelos pedregosos y agua de deshielo de los Andes.",
  altitude:"Fincas de la bodega: 1.050–1.700 m",
  climate:"Gran amplitud térmica y distintas condiciones según la altura.",
  story:"La altura, la exposición solar y la amplitud térmica forman parte de la identidad del Valle de Uco. Salentein trabaja con fincas a distintas alturas: un mismo valle, múltiples expresiones.",
};
const verified: Record<string,Partial<Wine>> = {
 "Salentein Reserva Malbec": {
  winery:"Bodegas Salentein", varietal:"100% Malbec", region:"Valle de Uco", province:"Mendoza", country:"Argentina",
  description:"Frutado, fresco y jugoso. Un Malbec de buena estructura y largo final, con la expresión del Valle de Uco.",
  tastingNotes:["Frutas rojas", "Rosas y violetas", "Notas balsámicas"], temperature:"16 °C",
  image:"/wines/salentein-reserva-malbec.webp",imagePlaceholder:false,
  technicalSource:"https://www.bodegasalentein.com/es/bodega/vino/18/malbec_2011.html",
  origin:{...wineryOrigin,place:"Tunuyán · Valle de Uco"},
 },
 "Salentein Reserva Chardonnay": {
  winery:"Bodegas Salentein", varietal:"100% Chardonnay", region:"Valle de Uco", province:"Mendoza", country:"Argentina",
  description:"Suave, amplio y fresco. Notas frutales y minerales, con elegancia y untuosidad provenientes del trabajo sobre borras y su paso por roble.",
  tastingNotes:["Cítricos", "Durazno blanco", "Flores y minerales"],temperature:"12 °C",
  image:"/wines/salentein-reserva-chardonnay.webp",imagePlaceholder:false,
  technicalSource:"https://www.bodegasalentein.com/es/bodega/vino/22/chardonnay_2012.html",
  origin:{...wineryOrigin,place:"Los Árboles · IG San Pablo"},
 },
 "Salentein Reserva Rosado": {
  winery:"Bodegas Salentein",varietal:"100% Syrah",region:"Valle de Uco",province:"Mendoza",country:"Argentina",
  description:"Rosa pálido y brillante. Frutado, de equilibrada acidez y un final fresco y persistente.",
  tastingNotes:["Frutillas", "Cerezas", "Sutiles notas florales"],temperature:"10 °C",
  image:"/wines/salentein-reserva-rosado.webp",imagePlaceholder:false,
  technicalSource:"https://www.bodegasalentein.com/es/bodega/vino/84/reserva-ros.html",
  origin:{...wineryOrigin,place:"Tunuyán · Valle de Uco"},
 },
 "Salentein Extra Brut": {
  winery:"Bodegas Salentein",varietal:"65% Chardonnay · 35% Pinot Noir",region:"Valle de Uco",province:"Mendoza",country:"Argentina",
  description:"Un Cuvée Spéciale suave y frutal. Burbujas finas y persistentes, con un aroma fresco y expresivo.",
  tastingNotes:["Manzana verde", "Cítricos", "Pan tostado"],temperature:"7 °C",
  image:"/wines/salentein-extra-brut.webp",imagePlaceholder:false,
  technicalSource:"https://www.bodegasalentein.com/es/bodega/vino/59/salentein-extra-brut.html",
  origin:{...wineryOrigin,place:"Finca El Oasis · Valle de Uco",altitude:"Más de 1.100 m",story:"Chardonnay y Pinot Noir de parcelas seleccionadas de la finca El Oasis. La zona fría del Valle de Uco permite preservar la frescura que caracteriza al vino base de este espumante."},
 },
 "Portillo Malbec": {winery:"Bodegas Salentein",image:"/wines/portillo-malbec.webp",imagePlaceholder:false,region:"Valle de Uco",province:"Mendoza",country:"Argentina",technicalSource:"https://www.bodegasalentein.com/es/bodega/lineas.html"},
 "Portillo Sauvignon Blanc": {winery:"Bodegas Salentein",image:"/wines/portillo-sauvignon-blanc.webp",imagePlaceholder:false,region:"Valle de Uco",province:"Mendoza",country:"Argentina",technicalSource:"https://www.bodegasalentein.com/es/bodega/lineas.html"},
 "Salentein Brut Nature": {winery:"Bodegas Salentein",image:"/wines/salentein-brut-nature.webp",imagePlaceholder:false,region:"Valle de Uco",province:"Mendoza",country:"Argentina",technicalSource:"https://www.bodegasalentein.com/es/bodega/espumantes.html"},
 "Salentein Brut Rosé": {winery:"Bodegas Salentein",image:"/wines/salentein-brut-rose.webp",imagePlaceholder:false,region:"Valle de Uco",province:"Mendoza",country:"Argentina",technicalSource:"https://www.bodegasalentein.com/es/bodega/espumantes.html"},
};
export const wines: Wine[] = rows.map(([category,name,price]) => {
 const slug=slugify(name);
 const varietal=["Cabernet Sauvignon","Cabernet Franc","Sauvignon Blanc","Pinot Noir","Chardonnay","Malbec","Rosé","Blend"].find(v=>name.includes(v)) ?? null;
 return {id:slug,slug,name,category,price,varietal,winery:null,region:null,province:null,country:null,
  vintage:null,availability:"unconfirmed",description:null,tastingNotes:[],pairing:[],temperature:null,
  image:`/wines/${slug}.svg`,imagePlaceholder:true,source:reference,technicalSource:null,origin:null,...verified[name]};
});
export const representativeWines = categories.map(c=>wines.find(w=>w.category===c.id && w.origin)!);
export const selectedWines = representativeWines;
export const formatPrice = (price: number) => `$${new Intl.NumberFormat("es-AR",{maximumFractionDigits:0}).format(price)}`;
export const categoryName = (id: CategoryId) => categories.find(c=>c.id===id)!.name;
