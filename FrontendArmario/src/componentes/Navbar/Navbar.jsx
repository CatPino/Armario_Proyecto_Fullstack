import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../Carrito/ContextCarrito";

export function Navbar() {
  const navigate = useNavigate();
  const {
    carrito,
    eliminarProducto,
    totalProductos,
    actualizarCantidad,
    errores,
  } = useCarrito();

  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const cargarSesion = () => {
      const guardado = localStorage.getItem("usuario");
      if (guardado) {
        try {
          const user = JSON.parse(guardado);
          const rolNormalizado =
            typeof user.rol === "string"
              ? user.rol.toLowerCase()
              : user.rol?.nombre?.toLowerCase() || "cliente";

          setUsuarioActivo(user);
          setRol(rolNormalizado);
        } catch {
          setUsuarioActivo(null);
          setRol(null);
        }
      } else {
        setUsuarioActivo(null);
        setRol(null);
      }
    };

    cargarSesion();
    window.addEventListener("storage", cargarSesion);

    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments);
      if (key === "usuario") cargarSesion();
    };

    return () => {
      window.removeEventListener("storage", cargarSesion);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rolUsuario");
    localStorage.removeItem("nombreUsuario");
    setUsuarioActivo(null);
    setRol(null);
    navigate("/");
  };

  return (
    <>
      {/* ======== NAVBAR ======== */}
      <nav className="navbar navbar-expand-sm mi-navbar position-relative">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#Menu"
          >
            <img src="/img/Menu.png" alt="Menu" />
          </button>

          <Link className="navbar-brand mx-auto order-0" to="/">
            <img src="/img/Logo.png" alt="Logo" width="60" />
          </Link>

          <div className="iconos-navbar d-flex align-items-center gap-3">
            {/* Carrito */}
            <button
              type="button"
              className="btn btn-transparent p-0 position-relative"
              data-bs-toggle="modal"
              data-bs-target="#carritoModal"
            >
              <img src="/img/carrito1.png" alt="Carrito" />
              {totalProductos() > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalProductos()}
                </span>
              )}
            </button>

            {/* Usuario */}
            <button
              type="button"
              className="btn btn-transparent p-0"
              data-bs-toggle="modal"
              data-bs-target="#usuarioModal"
            >
              <img src="/img/user.png" alt="Usuario" />
            </button>
          </div>

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
                  data-bs-toggle="dropdown"
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
                    <Link className="dropdown-item" to="/Chokers">
                      Chokers
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/Arnés">
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

              {(rol === "admin" || rol === "administrador") && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/inventario">
                      Inventario
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/usuario">
                      Usuarios
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* ============ MODAL CARRITO ============ */}
      <div className="modal fade" id="carritoModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: "600px" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Carrito de Compras</h2>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {carrito.length === 0 ? (
                <h3>No hay productos en el carrito.</h3>
              ) : (
                <ul className="list-group">
                  {carrito.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {/* Imagen */}
                      <div className="d-flex align-items-center gap-3">
                        {item.imagenUrl && (
                          <img
                            src={item.imagenUrl}
                            alt={item.nombre}
                            style={{
                              width: "100px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        )}

                        {/* Nombre + botones */}
                        <div className="flex-grow-1">
                          <strong>{item.nombre}</strong>

                          <div
                            className="d-flex align-items-center gap-2 mt-2 position-relative"
                            style={{ minHeight: "28px" }}
                          >
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                actualizarCantidad(
                                  item.id,
                                  item.cantidad - 1
                                )
                              }
                              disabled={item.cantidad <= 1}
                            >
                              -
                            </button>

                            <span>{item.cantidad}</span>

                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                actualizarCantidad(
                                  item.id,
                                  item.cantidad + 1
                                )
                              }
                            >
                              +
                            </button>

                            {errores[item.id] && (
                              <span
                                className="text-danger"
                                style={{
                                  position: "absolute",
                                  left: "120px",
                                  fontSize: "0.85rem",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {errores[item.id]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarProducto(item.id)}
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn button2" data-bs-dismiss="modal">
                Cerrar
              </button>
              <button
                className="btn button1"
                disabled={carrito.length === 0}
                onClick={() => navigate("/pago")}
              >
                Ir al pago
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ MODAL USUARIO ============ */}
      <div className="modal fade" id="usuarioModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title titulo w-100 text-center">Usuario</h2>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body text-center">
              {!usuarioActivo ? (
                <>
                  <h3>Inicia sesión o regístrate.</h3>

                  <button
                    className="btn btn-sm w-50 d-block mx-auto mb-2 button1"
                    onClick={() => {
                      navigate("/Login");
                      window.bootstrap.Modal.getInstance(
                        document.getElementById("usuarioModal")
                      ).hide();
                    }}
                  >
                    Iniciar sesión
                  </button>

                  <button
                    className="btn btn-sm w-50 d-block mx-auto button2"
                    onClick={() => {
                      navigate("/registro");
                      window.bootstrap.Modal.getInstance(
                        document.getElementById("usuarioModal")
                      ).hide();
                    }}
                  >
                    Regístrate
                  </button>
                </>
              ) : (
                <>
                  <h3>👋 Bienvenido, {usuarioActivo.nombre}</h3>

                  <div className="d-flex justify-content-center gap-3 mt-3">
                    <button
                      className="btn button1"
                      onClick={() => {
                        navigate("/productos");
                        window.bootstrap.Modal.getInstance(
                          document.getElementById("usuarioModal")
                        ).hide();
                      }}
                    >
                      Ir a comprar
                    </button>

                    <button
                      className="btn button2"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}