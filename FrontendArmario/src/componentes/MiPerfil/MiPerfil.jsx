import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MiPerfil.css";

export function MiPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [comunas, setComunas] = useState([]);

  // ==========================
  // CARGAR USUARIO
  // ==========================
  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) {
      setUsuario(JSON.parse(guardado));
    }
  }, []);

  // ==========================
  // REGIONES Y COMUNAS
  // ==========================
  const comunasPorRegion = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": [
      "Antofagasta","Mejillones","Sierra Gorda","Taltal","Calama",
      "Ollagüe","San Pedro de Atacama","Tocopilla","María Elena"
    ],
    // ...
    // (TU LISTA COMPLETA AQUÍ)
    // ...
  };

  // ==========================
  // ACTUALIZAR COMUNAS
  // ==========================
  useEffect(() => {
    if (usuario && usuario.region) {
      setComunas(comunasPorRegion[usuario.region] || []);
    }
  }, [usuario]);

  // ==========================
  // LOADING (DEBE IR AHORA)
  // ==========================
  if (!usuario) {
    return <h2>Cargando...</h2>;
  }

  // ==========================
  // HANDLERS
  // ==========================
  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
  try {
    const token = usuario.token;
    if (!token) {
      setMensaje("❌ No hay sesión activa");
      return;
    }

    const res = await fetch(
      `http://localhost:8082/api/usuarios/${usuario.id}/perfil`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

    if (!res.ok) throw new Error("Error al actualizar");

    const actualizado = await res.json();

    // 🔥 Mantener el token
    const usuarioConToken = {
      ...actualizado,
      token: usuario.token
    };

    localStorage.setItem("usuario", JSON.stringify(usuarioConToken));
    setUsuario(usuarioConToken);

    setMensaje("✔ Datos actualizados correctamente");
    setEditando(false);

  } catch (e) {
    setMensaje("❌ Error al guardar los cambios");
  }
};

  // ==========================
  // UI
  // ==========================
  return (
    <main className="container container-perfil" style={{ maxWidth: "700px" }}>
      <h2><strong>Mi Perfil – {usuario.nombre}</strong></h2>
      <h3 className="text-muted mb-3">Información de tu cuenta</h3>

      <form>

        {/* NOMBRE */}
        <div className="mb-3">
          <label>Nombre</label>
          <input
            id="nombre"
            name="nombre"
            disabled={!editando}
            type="text"
            className="form-control"
            value={usuario.nombre}
            onChange={handleChange}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label>Correo electrónico</label>
          <input disabled type="email" className="form-control" value={usuario.email} />
          <small className="text-muted">No se puede modificar</small>
        </div>

        {/* TELEFONO */}
        <div className="mb-3">
          <label>Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            disabled={!editando}
            type="text"
            className="form-control"
            value={usuario.telefono || ""}
            onChange={handleChange}
          />
        </div>

        {/* REGION */}
        <div className="mb-3">
          <label>Región</label>
          <select
            id="region"
            name="region"
            disabled={!editando}
            className="form-select"
            value={usuario.region || ""}
            onChange={handleChange}
          >
            <option value="">Selecciona una región</option>
            {Object.keys(comunasPorRegion).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* COMUNA */}
        <div className="mb-3">
          <label>Comuna</label>
          <select
            id="comuna"
            name="comuna"
            disabled={!editando}
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

        <div className="mb-3">
          <label>Dirección</label>
          <input
            id="direccion"
            disabled={!editando}
            name="direccion"
            type="text"
            className="form-control"
            value={usuario.direccion || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Departamento</label>
          <input
            id="departamento"
            disabled={!editando}
            name="departamento"
            type="text"
            className="form-control"
            value={usuario.departamento || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Información adicional</label>
          <textarea
            id="infoEnvio"
            disabled={!editando}
            name="infoEnvio"
            className="form-control"
            value={usuario.infoEnvio || ""}
            onChange={handleChange}
          />
        </div>

        {!editando ? (
          <button className="btn button1 w-100" type="button" onClick={() => setEditando(true)}>
            Editar perfil
          </button>
        ) : (
          <button className="btn btn-success w-100" type="button" onClick={guardarCambios}>
            Guardar cambios
          </button>
        )}

        {mensaje && <div className="alert alert-info text-center mt-3">{mensaje}</div>}

        <Link to="/" className="btn btn-secondary w-100 mt-3">Volver</Link>
      </form>
    </main>
  );
}
