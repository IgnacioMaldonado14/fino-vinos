export const site = {
  name: "Fino",
  tagline: "Elegí tu próximo brindis",
  description: "Descubrí la carta de Fino: tintos, blancos, rosados y espumantes. Vinos, lugares e historias para tu próximo brindis.",
  reference: "https://finovino.my.canva.site/page-2",
  // Complete with verified business details before accepting real orders.
  contact: { whatsapp: null, instagram: null, address: null, hours: null, email: null } as {
    whatsapp: string | null; instagram: string | null; address: string | null; hours: string | null; email: string | null;
  },
  checkoutMode: "preview" as const,
};
export const navigation = [
  ["Inicio", "/#inicio"], ["Carta", "/#carta"], ["Nuestra selección", "/#seleccion"],
  ["Origen", "/#origen"], ["Nosotros", "/#nosotros"], ["Contacto", "/#contacto"],
] as const;
