import { useState, useEffect } from "react";

export function ModalProducto({ modo, producto, onGuardar }) {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    descripcion: "",
    imagen: "",
    stock: "",
  });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (producto) setForm(producto);
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje(null);

    try {
      const url =
        modo === "editar"
          ? `http://localhost:8081/api/productos/${form.id}`
          : "http://localhost:8081/api/productos";

      const metodo = modo === "editar" ? "PUT" : "POST";

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al guardar el producto");

      const data = await res.json();
      setMensaje({ tipo: "exito", texto: "✅ Producto guardado correctamente." });

      // Avisar al componente padre que se guardó correctamente
      onGuardar(data);
    } catch (error) {
      console.error("Error al guardar:", error);
      setMensaje({
        tipo: "error",
        texto: "❌ No se pudo guardar el producto.",
      });
    }
  }

  return (
    <div
      className="modal fade"
      id="modalProducto"
      tabIndex="-1"
      aria-labelledby="modalProductoLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalProductoLabel">
                {modo === "editar" ? "Editar producto" : "Agregar producto"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>

            <div className="modal-body">
              {mensaje && (
                <div
                  className={`alert ${
                    mensaje.tipo === "error" ? "alert-danger" : "alert-success"
                  }`}
                >
                  {mensaje.texto}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Categoría</label>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option>Poleras</option>
                    <option>Calzas</option>
                    <option>Faldas</option>
                    <option>Accesorios</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={form.precio}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    className="form-control"
                    rows="2"
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label">URL Imagen</label>
                  <input
                    type="text"
                    name="imagen"
                    value={form.imagen}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {modo === "editar" ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
