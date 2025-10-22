import { useState, useEffect } from "react";

export function ModalProducto({ modo, producto, onGuardar }) {
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    imagen: "",        // URL opcional (no se envía si vas a subir archivo)
    categoriaId: "",   // << usamos ID, no nombre
  });

  const [categorias, setCategorias] = useState([]);   // << cargar desde API
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  // Cargar categorías
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:8081/api/categorias");
        if (!r.ok) throw new Error("No se pudieron cargar categorías");
        const data = await r.json();
        setCategorias(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setCategorias([]);
      }
    })();
  }, []);

  // Rellenar formulario si editas
  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || "",
        precio: producto.precio ?? "",
        stock: producto.stock ?? "",
        descripcion: producto.descripcion || "",
        imagen: producto.imagenUrl || producto.imagen || "",
        categoriaId: producto.categoria?.id || producto.categoriaId || "",
      });
      setPreview(producto.imagenUrl || producto.imagen || null);
      setArchivo(null);
    } else {
      setForm({
        nombre: "",
        precio: "",
        stock: "",
        descripcion: "",
        imagen: "",
        categoriaId: "",
      });
      setPreview(null);
      setArchivo(null);
    }
  }, [producto, modo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setArchivo(f);
    setPreview(f ? URL.createObjectURL(f) : form.imagen || null);
  };

  async function handleSubmit(e) {
  e.preventDefault();
  setMensaje(null);

  try {
    const url =
      modo === "editar"
        ? `http://localhost:8081/api/productos/${producto.id}`
        : "http://localhost:8081/api/productos";
    const metodo = modo === "editar" ? "PUT" : "POST";

    // Construye el payload que Spring espera:
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoria: form.categoriaId
        ? { id: Number(form.categoriaId) }
        : null, // <- debe venir NO nulo
      // Si quieres permitir URL directa cuando NO subes archivo:
      // imagenUrl: form.imagen && !archivo ? form.imagen.trim() : undefined,
    };

    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      console.error("Respuesta 400/errores del backend:", msg);
      throw new Error("Error al guardar el producto");
    }

    const prodGuardado = await res.json();
    const productId = prodGuardado.id ?? producto?.id;

    // Si seleccionaste archivo en el modal, súbelo ahora:
    if (archivo && productId) {
      const fd = new FormData();
      fd.append("archivo", archivo);
      const up = await fetch(`http://localhost:8081/api/productos/${productId}/imagen`, {
        method: "POST",
        body: fd,
      });
      if (!up.ok) {
        const msg = await up.text().catch(() => "");
        console.error("Error al subir imagen:", msg);
        throw new Error("Error al subir la imagen");
      }
    }

    setMensaje({ tipo: "exito", texto: "✅ Producto guardado correctamente." });
    onGuardar(prodGuardado);
  } catch (error) {
    console.error("Error al guardar:", error);
    setMensaje({ tipo: "error", texto: "❌ No se pudo guardar el producto." });
  }
}


  return (
    <div className="modal fade" id="modalProducto" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            {/* header ... */}

            <div className="modal-body">
              {mensaje && (
                <div className={`alert ${mensaje.tipo === "error" ? "alert-danger" : "alert-success"}`}>
                  {mensaje.texto}
                </div>
              )}

              <div className="row g-3">
                {/* nombre */}
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} className="form-control" required />
                </div>

                {/* categoriaId */}
                <div className="col-md-6">
                  <label className="form-label">Categoría</label>
                  <select
                    name="categoriaId"
                    value={form.categoriaId}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Seleccione...</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* precio / stock */}
                <div className="col-md-6">
                  <label className="form-label">Precio</label>
                  <input type="number" name="precio" value={form.precio} onChange={handleChange} className="form-control" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Stock</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} className="form-control" required />
                </div>

                {/* descripción */}
                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="form-control" rows="2" />
                </div>

                {/* URL opcional */}
                <div className="col-12">
                  <label className="form-label">URL Imagen (opcional si no subes archivo)</label>
                  <input
                    type="text"
                    name="imagen"
                    value={form.imagen}
                    onChange={(e) => {
                      handleChange(e);
                      if (!archivo) setPreview(e.target.value || null);
                    }}
                    className="form-control"
                    placeholder="https://..."
                  />
                </div>

                {/* archivo dentro del modal */}
                <div className="col-12">
                  <label className="form-label">Subir imagen</label>
                  <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
                  {preview && (
                    <div className="mt-2">
                      <img
                        src={preview}
                        alt="Vista previa"
                        style={{ width: 90, height: 90, borderRadius: 8, objectFit: "cover", border: "1px solid #ddd" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* footer ... */}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
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
