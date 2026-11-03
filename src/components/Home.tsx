import { useEffect, useState } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { ArrowForward, Pause, PlayArrow } from "@mui/icons-material";
import { Link } from "react-router-dom";
import logo from "../assets/wavyCarpetPNG.png";
import "./Home.css";

const base = import.meta.env.BASE_URL;
const photos = [1, 2, 3, 4].map((n) => `${base}assets/banner${n}.jpg`);
const questions = [
  ["¿Puedo pedir una alfombra con mi diseño?", "Sí. En el formulario de alfombras personalizadas podés subir una imagen y elegir forma, medidas y colores. Revisamos la propuesta para preparar un presupuesto."],
  ["¿Qué es el tufting?", "Es una técnica para crear alfombras insertando el hilo en una tela tensada. Permite trabajar dibujos, curvas y combinaciones de color con un acabado con relieve."],
  ["¿Cuánto cuesta una alfombra personalizada?", "El presupuesto depende del tamaño, la forma y el detalle del diseño. Mandanos una referencia y las medidas para evaluar tu proyecto."],
  ["¿Cómo elijo el tamaño?", "Medí el lugar donde la querés poner y pensá cómo se relaciona con los muebles. En la solicitud podés indicar el ancho y el alto en centímetros."],
];

export default function Home() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [paused, setPaused] = useState(false);
  const [photo, setPhoto] = useState(0);
  const moving = !paused && !reducedMotion;
  useEffect(() => {
    if (!moving) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setPhoto((current) => (current + 1) % photos.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [moving]);
  return (
    <Box component="main" className={`wavy-home ${moving ? "is-moving" : "is-still"}`}>
      <section className="rug-hero" aria-labelledby="rug-title">
        <div className="rug-hero-copy">
          <img className="rug-wordmark" src={logo} alt="Wavy Carpets" width="156" />
          <p className="rug-kicker">ALFOMBRAS DE DISEÑO / HECHAS A MANO</p>
          <Typography component="h1" id="rug-title" className="rug-title">Alfombras<br />personalizadas.<br /><span>A tu manera.</span></Typography>
          <p className="rug-lead">Tu dibujo, tus colores, tu rincón favorito. Creamos alfombras con técnica tufting para darle a tu casa una personalidad bien tuya.</p>
          <div className="rug-actions">
            <Button component={Link} to="/personalizada" variant="contained" size="large" endIcon={<ArrowForward />}>Diseñá tu alfombra</Button>
            <Button component={Link} to="/shop" variant="outlined" size="large">Ver alfombras</Button>
          </div>
          <p className="rug-footnote">Oficio artesanal. Colores con historia. Diseño propio.</p>
        </div>
        <div className="rug-scrapbook">
          <div className="rug-sun" aria-hidden="true">✳</div>
          <div className="rug-postcard">
            <div className="rug-photo-stack" aria-label="Galería del universo Wavy Carpets">
              {photos.map((src, index) => <img key={src} src={src} alt={index === photo ? "Texturas y diseños de alfombras Wavy Carpets" : ""} aria-hidden={index !== photo} className={index === photo ? "is-current" : ""} loading={index === 0 ? "eager" : "lazy"} />)}
            </div>
            <div className="rug-photo-caption"><span>POSTALES DEL TALLER</span><span>0{photo + 1} / 04</span></div>
          </div>
          <span className="rug-tape" aria-hidden="true" />
          <div className="rug-stamp"><span>HECHO A MANO</span><strong>CON<br />CARÁCTER</strong><span>WAVY CARPETS</span></div>
          <div className="rug-gallery-controls" role="group" aria-label="Controles de la galería">
            {photos.map((_, index) => <button key={index} type="button" aria-label={`Ver foto ${index + 1}`} aria-pressed={index === photo} onClick={() => setPhoto(index)}>0{index + 1}</button>)}
          </div>
        </div>
        <button className="rug-motion" type="button" aria-pressed={paused || reducedMotion} onClick={() => setPaused(!paused)} disabled={reducedMotion}>
          {moving ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}{reducedMotion ? "Movimiento reducido" : moving ? "Pausar movimiento" : "Activar movimiento"}
        </button>
      </section>
      <div className="rug-ribbon" aria-label="Tufting artesanal, diseño propio y espíritu vintage">
        <div className="rug-ribbon-track" aria-hidden="true">{[0, 1].map((i) => <span key={i}>TUFTING ARTESANAL <b>✳</b> TU IDEA, HECHA ALFOMBRA <b>✳</b> ESPÍRITU VINTAGE <b>✳</b> DISEÑO PROPIO <b>✳</b> </span>)}</div>
      </div>
      <section className="rug-editorial" aria-labelledby="rug-choice-title">
        <div className="rug-section-heading"><p className="rug-kicker">EL PRÓXIMO DETALLE DE TU CASA</p><h2 id="rug-choice-title">Un poco de color.<br /><em>Mucho de vos.</em></h2><p>Para el living, al lado de la cama o en ese rincón que todavía no encontraste cómo vestir. Elegí una alfombra de diseño o contanos la que tenés en mente.</p></div>
        <div className="rug-cards">
          <Link to="/shop" className="rug-editorial-card"><div className="rug-card-image"><img src={`${base}en-stock.jpg`} alt="Inspiración para elegir una alfombra de diseño" loading="lazy" /><span className="rug-card-tag">01 / EXPLORAR</span></div><div><h3>Encontrá tu favorita <span>↗</span></h3><p>Recorré el catálogo de alfombras y descubrí formas, texturas y combinaciones de color.</p></div></Link>
          <Link to="/personalizada" className="rug-editorial-card"><div className="rug-card-image"><img src={`${base}personalizadas.jpg`} alt="Inspiración para una alfombra personalizada hecha a mano" loading="lazy" /><span className="rug-card-tag">02 / CREAR</span></div><div><h3>Traé esa idea <span>↗</span></h3><p>Una imagen, una forma, una paleta. Dale el primer paso a tu alfombra a medida.</p></div></Link>
        </div>
      </section>
      <section className="rug-workshop" aria-labelledby="rug-workshop-title">
        <div><p className="rug-kicker">DEL BOCETO A TU ESPACIO</p><h2 id="rug-workshop-title">Tu idea tiene<br /><em>su proceso.</em></h2><Link to="/info" className="rug-text-link">Conocé el taller y la técnica tufting ↗</Link></div>
        <ol className="rug-process">
          <li><span>01</span><div><h3>Nos contás el diseño</h3><p>Subí una referencia y elegí los colores, la forma y las medidas de tu alfombra.</p></div></li>
          <li><span>02</span><div><h3>Revisamos tu propuesta</h3><p>Evaluamos los detalles y te respondemos con un presupuesto para ese proyecto.</p></div></li>
          <li><span>03</span><div><h3>Definimos el pedido</h3><p>Antes de comenzar, acordamos el diseño final y las condiciones de elaboración.</p></div></li>
        </ol>
      </section>
      <section className="rug-faq" aria-labelledby="rug-faq-title"><div><p className="rug-kicker">ANTES DE ELEGIR</p><h2 id="rug-faq-title">¿Lo charlamos?</h2><p>Algunas respuestas para empezar a imaginar tu alfombra.</p></div><div>{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">＋</span></summary><p>{answer}</p></details>)}</div></section>
    </Box>
  );
}
