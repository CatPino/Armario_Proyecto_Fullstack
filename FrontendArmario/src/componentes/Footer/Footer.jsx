import { Link } from "react-router-dom";

export function Footer() {
  return (
    <>
      <footer className="mi-footer">
        <div className="container text-center py-4">
          <h3 style={{ color: "white" }}>Armario de Sombra | desde 2020 &copy;</h3>
          <h3 style={{ color: "white" }}>Contáctanos</h3>
          <Link to="https://www.instagram.com/">
            <img src="/img/instagram.png" alt="Instagram" width="35" height="35" style={{ marginTop: "10px" }} />
          </Link>
        </div>
      </footer>
    </>
  );
}