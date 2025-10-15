import { Footer } from "../../componentes/Footer/Footer";

export function Nosotros() {
  return (
    <>
      <div className="container mt-5 mb-5">
        <h1>Sobre nosotros...</h1>
        <hr />
        <br />
        <h2>
          Desde el año <strong>2023</strong>, en <em>Armario de Sombras</em> hemos buscado crear un espacio único
          donde la moda alternativa y el estilo gótico encuentren su lugar.
          Nuestra inspiración nació del deseo de ofrecer <strong>prendas y accesorios diferentes</strong>, capaces de
          reflejar la esencia y personalidad de cada persona que los lleva.
        </h2>
        <br />
        <h2>
          Creemos que la ropa no solo es una forma de vestir, sino también una manera de{" "}
          <strong>expresarse y destacar lo auténtico</strong> en cada uno.
          Por eso, cada colección está pensada para quienes buscan algo más que lo convencional:
          detalles oscuros, elegantes y rebeldes que nunca pasan desapercibidos.
        </h2>
        <br />
        <h2>
          Más que una tienda, somos una{" "}
          <strong>comunidad apasionada por lo único, lo alternativo y lo auténtico</strong>.
          Queremos acompañarte a crear un estilo propio, lleno de fuerza y personalidad.
        </h2>
        <img src="/img/Nosotros.png" alt="Sobre nosotros" className="img-fluid mt-4 rounded shadow"/>
      </div>
      <Footer />
    </>
  );
}
