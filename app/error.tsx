"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="section not-found"><p className="eyebrow">ALGO NO SALIÓ COMO ESPERÁBAMOS</p><h1>Retomemos<br/><em>el encuentro.</em></h1><p>No pudimos cargar esta página. Tu carrito guardado permanece en el navegador.</p><button className="button" onClick={reset}>Volver a intentar</button></main>}
