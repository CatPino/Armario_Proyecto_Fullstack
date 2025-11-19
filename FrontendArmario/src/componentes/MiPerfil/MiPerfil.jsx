import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MiPerfil.css"; 

export function MiPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [comunas, setComunas] = useState([]);

  // === Cargar usuario desde localStorage ===
  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) {
      setUsuario(JSON.parse(guardado));
    }
  }, []);

  // === Tabla de regiones/comunas (misma que en tu Registro) ===
  const comunasPorRegion = {
    "Región Metropolitana": ["Santiago","Cerrillos","Cerro Navia","Conchalí","La Florida","Maipú"],
    "Valparaíso": ["Valparaíso","Viña del Mar","Concón","Quilpué"],
    "Maule": ["Talca","Curicó","Linares","Constitución"],
    // 👉 Pon aquí el resto igual que en tu Registro
  };

  // Cargar comunas según la región del usuario
  useEffect(() => {
    if (usuario?.region && comunasPorRegion[usuario.region]) {
      setComunas(comunasPorRegion[usuario.region]);
    }
  }, [usuario?.region]);

  if (!usuario) return <h2>Cargando...</h2>;

  // === Cuando el usuario cambia algo ===
  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });

    if (e.target.name === "region") {
      setComunas(comunasPorRegion[e.target.value] || []);
      setUsuario((prev) => ({ ...prev, comuna: "" }));
    }
  };

  // === Guardar cambios al backend ===
  const guardarCambios = async () => {
    try {
      const res = await fetch(
        `http://localhost:8082/api/usuarios/${usuario.id}/perfil`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usuario.token}`,
          },
          body: JSON.stringify({
            nombre: usuario.nombre,
            telefono: usuario.telefono,
            region: usuario.region,
            comuna: usuario.comuna,
            direccion: usuario.direccion,
            departamento: usuario.departamento,
            infoEnvio: usuario.infoEnvio,
          }),
        }
      );

      if (!res.ok) throw new Error("No se pudo actualizar");

      const actualizado = await res.json();

      // Guardar actualizado en localStorage
      localStorage.setItem("usuario", JSON.stringify(actualizado));
      setUsuario(actualizado);

      setMensaje("✔ Datos actualizados correctamente");
      setEditando(false);
    } catch (error) {
      setMensaje("❌ Error al guardar los cambios");
    }
  };

  return (
    <main className="container container-perfil" style={{ maxWidth: "700px" }}>
      <h2 className="mb-2">
        <strong>Mi Perfil – {usuario.nombre}</strong>
      </h2>
      <h3 className="text-muted mb-4">Información de tu cuenta</h3>

      {mensaje && (
        <div className="alert alert-info text-center">{mensaje}</div>
      )}

      <div>
        <form>

          {/* ================= Nombre ================= */}
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              disabled={!editando}
              type="text"
              name="nombre"
              value={usuario.nombre || ""}
              className="form-control"
              onChange={handleChange}
            />
          </div>

          {/* ================= Email (NO EDITABLE) ================= */}
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              disabled
              type="email"
              value={usuario.email}
              className="form-control"
            />
            <small className="text-muted">No se puede modificar</small>
          </div>

          {/* ================= Teléfono ================= */}
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              disabled={!editando}
              type="text"
              name="telefono"
              className="form-control"
              value={usuario.telefono || ""}
              onChange={handleChange}
            />
          </div>

          {/* ================= Región ================= */}
          <div className="mb-3">
            <label className="form-label">Región</label>
            <select
              disabled={!editando}
              name="region"
              className="form-select"
              value={usuario.region || ""}
              onChange={handleChange}
            >
              <option value="">Selecciona una región</option>
              {Object.keys(comunasPorRegion).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* ================= Comuna ================= */}
          <div className="mb-3">
            <label className="form-label">Comuna</label>
            <select
              disabled={!editando || comunas.length === 0}
              name="comuna"
              className="form-select"
              value={usuario.comuna || ""}
              onChange={handleChange}
            >
              <option value="">Selecciona una comuna</option>
              {comunas.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* ================= Dirección ================= */}
          <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input
              disabled={!editando}
              type="text"
              name="direccion"
              className="form-control"
              value={usuario.direccion || ""}
              onChange={handleChange}
            />
          </div>

          {/* ================= Departamento ================= */}
          <div className="mb-3">
            <label className="form-label">Departamento</label>
            <input
              disabled={!editando}
              type="text"
              name="departamento"
              className="form-control"
              value={usuario.departamento || ""}
              onChange={handleChange}
            />
          </div>

          {/* ================= Información de envío ================= */}
          <div className="mb-3">
            <label className="form-label">Información adicional de envío</label>
            <textarea
              disabled={!editando}
              name="infoEnvio"
              className="form-control"
              value={usuario.infoEnvio || ""}
              onChange={handleChange}
            />
          </div>

          {/* ================= BOTONES ================= */}
          {!editando ? (
            <button
              type="button"
              className="btn button1 w-100"
              onClick={() => setEditando(true)}
            >
              Editar perfil
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success w-100"
              onClick={guardarCambios}
            >
              Guardar cambios
            </button>
          )}

          <Link to="/" className="btn btn-secondary w-100 mt-3">
            Volver
          </Link>
        </form>
      </div>
    </main>
  );
}