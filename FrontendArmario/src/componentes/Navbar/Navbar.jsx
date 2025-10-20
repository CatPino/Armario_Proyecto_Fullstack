import { Link, useNavigate } from "react-router-dom";
import { useSesion } from "../../componentes/MantenerSesion/MantenerSesion";

export function Navbar() {
  const navigate = useNavigate();
  const { usuario, logout } = useSesion(); // 👈 acceso al usuario y función para cerrar sesión

  return (
    <>
      <nav className="navbar navbar-expand-sm mi-navbar position-relative">
        <div className="container-fluid">
          {/* Botón hamburguesa */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#Menu"
            aria-controls="Menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <img src="/img/Menu.png" alt="Menu" />
          </button>

          {/* Logo */}
          <Link className="navbar-brand mx-auto order-0" to="/">
            <img src="/img/Logo.png" alt="Logo" width="60" />
          </Link>

          {/* Iconos derecha */}
          <div className="iconos-navbar d-flex align-items-center gap-3">
            {/* 🛒 Carrito */}
            <div className="position-relative">
              <button
                type="button"
                className="btn btn-transparent p-0"
                data-bs-toggle="modal"
                data-bs-target="#carritoModal"
              >
                <img src="/img/carrito1.png" alt="Carrito" />
              </button>

              <span
                id="cartCount"
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none"
                style={{ fontSize: ".65rem" }}
              >
                0
              </span>
            </div>

            {/* 👤 Usuario */}
            <button
              type="button"
              className="btn btn-transparent p-0"
              data-bs-toggle="modal"
              data-bs-target="#usuarioModal"
            >
              <img src="/img/user.png" alt="Usuario" />
            </button>
          </div>

          {/* Menú principal */}
          <div className="collapse navbar-collapse" id="Menu">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="/productos"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Productos
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/productos">
                      Todos los productos
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/poleras">
                      Poleras
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/calzas">
                      Calzas
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/faldas">
                      Faldas
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/accesorios">
                      Chockers
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/accesorios">
                      Arnés
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/nosotros">
                  Nosotros
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/blogs">
                  Blogs
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contacto">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* 🛒 Modal Carrito (sin cambios) */}
      <div
        className="modal fade"
        id="carritoModal"
        tabIndex="-1"
        aria-labelledby="carritoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="carritoModalLabel">
                Carrito de Compras
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>

            <div className="modal-body">
              <h3>No hay productos en el carrito.</h3>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn button2"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button type="button" className="btn button1" disabled>
                Ir al pago
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 👤 Modal Usuario (dinámico según sesión) */}
      <div
        className="modal fade"
        id="usuarioModal"
        tabIndex="-1"
        aria-labelledby="usuarioModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center">
            <div className="modal-header">
              <h2
                className="modal-title titulo w-100 text-center"
                id="usuarioModalLabel"
              >
                Usuario
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>

            <div className="modal-body text-center">
              {/* Si HAY sesión activa */}
              {usuario ? (
                <>
                  <h3 className="mb-3">👋 Hola, {usuario.nombre}</h3>
                  <p className="text-muted">
                    Bienvenido de nuevo a <strong>Armario de Sombra</strong>.
                  </p>

                  <button
                    className="btn btn-sm w-50 d-block mx-auto mb-2 button1"
                    onClick={() => {
                      navigate("/productos");
                      const modal = bootstrap.Modal.getInstance(
                        document.getElementById("usuarioModal")
                      );
                      modal?.hide();
                    }}
                  >
                    Ir a comprar
                  </button>

                  <button
                    className="btn btn-sm w-50 d-block mx-auto button2"
                    onClick={() => {
                      logout(); // cierra sesión
                      const modal = bootstrap.Modal.getInstance(
                        document.getElementById("usuarioModal")
                      );
                      modal?.hide(); // cierra modal
                    }}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                // Si NO hay sesión
                <>
                  <h3>Inicia sesión o regístrate</h3>
                  <button
                    className="btn btn-sm w-50 d-block mx-auto mb-2 button1"
                    onClick={() => navigate("/Login")}
                    data-bs-dismiss="modal"
                  >
                    Iniciar sesión
                  </button>

                  <button
                    className="btn btn-sm w-50 d-block mx-auto button2"
                    onClick={() => navigate("/Registro")}
                    data-bs-dismiss="modal"
                  >
                    Regístrate
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
