import { useEffect, useState } from "react";

export function ModalProductos({ categoriaNombre }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch("http://localhost:8081/api/productos"),
          fetch("http://localhost:8081/api/categorias"),
        ]);

        const dataProd = await resProd.json();
        const dataCat = await resCat.json();
        setCategorias(dataCat);

        if (categoriaNombre) {
          const categoria = dataCat.find(
            (c) => c.nombre.toLowerCase() === categoriaNombre.toLowerCase()
          );

          if (categoria) {
            const filtrados = dataProd.filter(
              (p) =>
                p.categoria?.id === categoria.id ||
                p.categoria_id === categoria.id
            );
            setProductos(filtrados);
          } else {
            setProductos([]);
          }
        } else {
          setProductos(dataProd);
        }
      } catch (error) {
        console.error("❌ Error al cargar productos o categorías:", error);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [categoriaNombre]);

  if (cargando)
    return <div className="text-center mt-5">🕐 Cargando productos...</div>;

  const obtenerNombreCategoria = (categoriaId) => {
    const categoria = categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  return (
    <div className="container my-5">
      <div className="row g-4">
        {productos.length === 0 ? (
          <p className="text-center">No hay productos disponibles.</p>
        ) : (
          productos.map((p) => (
            <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div
                className="card"
                role="button"
                data-bs-toggle="modal"
                data-bs-target={`#modal${p.id}`}
              >
                {p.imagenUrl ? (
                  <img
                    src={p.imagenUrl}
                    alt={p.nombre}
                    className="card-img-top"
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{ height: "200px" }}
                  >
                    <span className="text-muted">Sin imagen</span>
                  </div>
                )}

                <div className="card-body">
                  <h5 className="card-title">{p.nombre}</h5>
                  <p className="card-text text-muted">{p.descripcion}</p>
                  <h5 className="fw-bold">
                    ${Number(p.precio).toLocaleString()} CLP
                  </h5>

                  {/*  Aviso de stock bajo */}
                  {p.stock < 5 && (
                    <p className="text-danger fw-bold mt-2">
                      ⚠️ Quedan solo {p.stock} unidades
                    </p>
                  )}
                </div>

                <div className="card-footer bg-transparent border-0 text-center p-2">
                  <button
                    className="button2 w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`🛒 ${p.nombre} agregado al carrito!`);
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>

              {/* Modal de detalle */}
              <div
                className="modal fade"
                id={`modal${p.id}`}
                tabIndex="-1"
                aria-labelledby={`tituloModal${p.id}`}
                aria-hidden="true"
              >
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h2 className="modal-title" id={`tituloModal${p.id}`}>
                        {p.nombre}
                      </h2>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                      ></button>
                    </div>

                    <div className="modal-body text-center">
                      <img
                        src={p.imagenUrl}
                        alt={p.nombre}
                        className="img-fluid rounded mb-3"
                      />
                      <p>
                        <strong>Descripción:</strong> {p.descripcion}
                      </p>
                      <p>
                        <strong>Precio:</strong> $
                        {Number(p.precio).toLocaleString()} CLP
                      </p>
                      <p>
                        <strong>Stock:</strong> {p.stock}
                      </p>
                      {p.stock < 5 && (
                        <p className="text-danger fw-bold">
                          ⚠️ Quedan pocas unidades disponibles
                        </p>
                      )}
                      <p>
                        <strong>Categoría:</strong>{" "}
                        {p.categoria?.nombre ||
                          obtenerNombreCategoria(p.categoria_id) ||
                          "-"}
                      </p>
                    </div>

                    <div className="modal-footer d-flex justify-content-between">
                      <button className="button1" data-bs-dismiss="modal">
                        Cerrar
                      </button>
                      <button
                        className="button2"
                        onClick={() =>
                          alert(`🛒 ${p.nombre} agregado al carrito!`)
                        }
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
