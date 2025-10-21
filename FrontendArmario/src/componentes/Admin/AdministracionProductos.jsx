import { useEffect, useState, useMemo } from "react";
import { ModalProducto } from "./ModalProducto";

export function AdministracionProductos() {
  const [productos, setProductos] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [modo, setModo] = useState("crear");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  async function cargarProductos() {
    setCargando(true);
    setMensaje(null);
    try {
      const res = await fetch("http://localhost:8081/api/productos");
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setMensaje({
        tipo: "error",
        texto: "No se pudieron cargar los productos.",
      });
    } finally {
      setCargando(false);
    }
  }

  async function subirImagenProducto(id, archivo) {
    if (!archivo) return;

    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      const res = await fetch(`http://localhost:8081/api/productos/${id}/imagen`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("❌ Error al subir la imagen");
        return;
      }

      alert("✅ Imagen subida correctamente");
      await cargarProductos();
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("⚠️ No se pudo subir la imagen");
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  const filtrados = useMemo(() => {
    const texto = filtroTexto.toLowerCase().trim();
    const cat = filtroCategoria.trim();
    return productos.filter((p) => {
      const okCat = !cat || p.categoria?.nombre === cat;
      const okTxt =
        !texto ||
        p.nombre?.toLowerCase().includes(texto) ||
        p.descripcion?.toLowerCase().includes(texto);
      return okCat && okTxt;
    });
  }, [productos, filtroTexto, filtroCategoria]);

  // ======== Modal (crear / editar) ==========
  function abrirModalCrear() {
    setModo("crear");
    setProductoSeleccionado(null);
    const modal = new bootstrap.Modal(document.getElementById("modalProducto"));
    modal.show();
  }

  function abrirModalEditar(prod) {
    setModo("editar");
    setProductoSeleccionado(prod);
    const modal = new bootstrap.Modal(document.getElementById("modalProducto"));
    modal.show();
  }

  // ======== Eliminar producto ==========
  async function eliminarProducto(id) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      const res = await fetch(`http://localhost:8081/api/productos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      setMensaje({
        tipo: "exito",
        texto: "Producto eliminado correctamente.",
      });
      cargarProductos();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMensaje({
        tipo: "error",
        texto: "Error al eliminar producto.",
      });
    }
  }

  // ======== Callback del modal ==========
  function onGuardar() {
    cargarProductos();
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("modalProducto")
    );
    modal.hide();
  }

  // ======== Render ==========
  return (
    <div className="container my-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <h1 className="m-0">ADMINISTRACIÓN DE PRODUCTOS</h1>
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          ＋ Agregar producto
        </button>
      </div>

      <div className="row g-2 mb-3 mt-2">
        <div className="col-md-3">
          <input
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="form-control"
            placeholder="Buscar por nombre/descripción"
          />
        </div>
        <div className="col-md-3">
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="form-select"
          >
            <option value="">Todas las categorías</option>
            <option>Poleras</option>
            <option>Calzas</option>
            <option>Faldas</option>
            <option>Choker</option>
            <option>Arnés</option>
          </select>
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => {
              setFiltroTexto("");
              setFiltroCategoria("");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {mensaje && (
        <div
          className={`alert ${
            mensaje.tipo === "error" ? "alert-danger" : "alert-success"
          } mt-2`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Cargando...
                </td>
              </tr>
            ) : filtrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Sin resultados
                </td>
              </tr>
            ) : (
              filtrados.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.imagenUrl ? (
                      <img
                        src={p.imagenUrl}
                        alt={p.nombre}
                        style={{
                          width: 58,
                          height: 58,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria?.nombre || "-"}</td>
                  <td>${Number(p.precio || 0).toLocaleString()} CLP</td>
                  <td className="text-center">
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => abrirModalEditar(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => eliminarProducto(p.id)}
                      >
                        Eliminar
                      </button>
                      <label className="btn btn-outline-primary">
                        Subir imagen
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            subirImagenProducto(p.id, e.target.files[0])
                          }
                        />
                      </label>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* === MODAL === */}
      <ModalProducto
        modo={modo}
        producto={productoSeleccionado}
        onGuardar={onGuardar}
      />
    </div>
  );
}
