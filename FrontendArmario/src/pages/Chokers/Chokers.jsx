import { Footer } from "../../componentes/Footer/Footer";
import { ModalProductos } from "../../componentes/MostrarProductos/MostrarProductos";

export function Chokers() {
  return (
    <>
      <div className="container my-5">
        <h1>Conoce todos nuestros productos</h1>
        <h2 class="mb-4">
        Dale a tu outfit un toque gótico auténtico. Cada prenda está diseñada para expresar tu
        personalidad con fuerza, combinando lo clásico y lo alternativo en cada detalle.
        </h2>
        <ModalProductos categoriaNombre="Chokers" />
      </div>
      <Footer />
    </>
  );
}