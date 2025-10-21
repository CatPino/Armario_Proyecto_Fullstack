import { useState, useEffect } from "react";

export function ModalUsuario({ modo, usuario, onGuardar, roles }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "",
    estado: true,
  });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (usuario) {
      setForm({
        id: usuario.id,
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        password: "",
        rol: usuario.rol?.id || "",
        estado: usuario.estado ?? true,
      });
    } else {
      setForm({
        nombre: "",
        email: "",
        password: "",
        rol: "",
        estado: true,
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje(null);

    try {
      const url =
        modo === "editar"
          ? `http://localhost:8082/api/usuarios/${form.id}`
          : "http://localhost:8082/api/usuarios";

      const metodo = modo === "editar" ? "PUT" : "POST";

      const payload =
        modo === "editar"
          ? {
              nombre: form.nombre,
              email: form.email,
              rol_id: form.rol, // se envía el id
              estado: form.estado,
            }
          : {
              nombre: form.nombre,
              email: form.email,
              password: form.password,
              rol_id: form.rol, // se envía el id
              estado: form.estado,
            };

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar el usuario");

      const data = await res.json();
      setMensaje({ tipo: "exito", texto: "✅ Usuario guardado correctamente." });
      onGuardar(data);
    } catch (error) {
      console.error("Error al guardar:", error);
      setMensaje({
        tipo: "error",
        texto: "❌ No se pudo guardar el usuario.",
      });
    }
  }

  return (
    <div
      className="modal fade"
      id="modalUsuario"
      tabIndex="-1"
      aria-labelledby="modalUsuarioLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalUsuarioLabel">
                {modo === "editar" ? "Editar Usuario" : "Agregar Usuario"}
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
                    mensaje.tipo === "error"
                      ? "alert-danger"
                      : "alert-success"
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
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                {modo === "crear" && (
                  <div className="col-md-6">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                )}

                <div className="col-md-6">
                  <label className="form-label">Rol</label>
                  <select
                    name="rol"
                    value={form.rol}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Seleccione rol...</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <div className="form-check mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="estado"
                      checked={form.estado}
                      onChange={handleChange}
                      id="estado"
                    />
                    <label className="form-check-label" htmlFor="estado">
                      Activo
                    </label>
                  </div>
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
                {modo === "editar" ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}