import { useEffect, useMemo, useState } from "react";

export function ModalUsuario({ modo, usuario, onGuardar, roles }) {
  const esEditar = modo === "editar";

  // === regiones → comunas (mismo contenido de tu RegistroForm) ===
  const comunasPorRegion = useMemo(() => ({
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Huasco", "Freirina", "Alto del Carmen"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quintero", "Puchuncaví", "Casablanca", "Juan Fernández", "Isla de Pascua", "San Antonio", "Cartagena", "El Quisco", "El Tabo", "Algarrobo", "Santo Domingo", "San Felipe", "Llaillay", "Catemu", "Panquehue", "Putaendo", "Santa María", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "Quillota", "La Cruz", "La Calera", "Hijuelas", "Nogales", "Petorca", "La Ligua", "Cabildo", "Zapallar", "Papudo", "Quilpué", "Villa Alemana", "Limache", "Olmué"],
    "Región Metropolitana": ["Santiago","Cerrillos","Cerro Navia","Conchalí","El Bosque","Estación Central","Huechuraba","Independencia","La Cisterna","La Florida","La Granja","La Pintana","La Reina","Las Condes","Lo Barnechea","Lo Espejo","Lo Prado","Macul","Maipú","Ñuñoa","Pedro Aguirre Cerda","Peñalolén","Providencia","Pudahuel","Quilicura","Quinta Normal","Recoleta","Renca","San Joaquín","San Miguel","San Ramón","Vitacura","Colina","Lampa","Tiltil","Puente Alto","Pirque","San José de Maipo","San Bernardo","Buin","Paine","Calera de Tango","Melipilla","Alhué","Curacaví","María Pinto","San Pedro","Talagante","El Monte","Isla de Maipo","Padre Hurtado","Peñaflor"],
    "O’Higgins": ["Rancagua","Machalí","Graneros","Mostazal","Codegua","Coinco","Coltauco","Doñihue","Las Cabras","Malloa","Olivar","Peumo","Pichidegua","Quinta de Tilcoco","Rengo","Requínoa","San Vicente","Pichilemu","Marchigüe","La Estrella","Litueche","Navidad","Paredones","San Fernando","Chimbarongo","Nancagua","Palmilla","Peralillo","Placilla","Pumanque","Santa Cruz"],
    "Maule": ["Talca","Constitución","Curepto","Empedrado","Maule","Pencahue","Río Claro","San Clemente","San Rafael","Linares","Colbún","Longaví","Parral","Retiro","Villa Alegre","Yerbas Buenas","Curicó","Hualañé","Licantén","Molina","Rauco","Romeral","Sagrada Familia","Teno","Vichuquén","Cauquenes","Chanco","Pelluhue"],
    "Ñuble": ["Chillán","Chillán Viejo","Coihueco","Pinto","San Ignacio","El Carmen","Pemuco","Yungay","Quillón","San Nicolás","Bulnes","Quirihue","Cobquecura","Ninhue","Portezuelo","Ránquil","Trehuaco","Coelemu"],
    "Biobío": ["Concepción","Talcahuano","Hualpén","San Pedro de la Paz","Chiguayante","Penco","Tomé","Florida","Hualqui","Santa Juana","Coronel","Lota","Los Ángeles","Cabrero","Laja","San Rosendo","Yumbel","Alto Biobío","Mulchén","Nacimiento","Negrete","Quilaco","Quilleco","Santa Bárbara","Tucapel","Antuco","Arauco","Cañete","Contulmo","Curanilahue","Lebu","Los Álamos","Tirúa"],
    "La Araucanía": ["Temuco","Padre Las Casas","Lautaro","Perquenco","Vilcún","Cunco","Melipeuco","Curarrehue","Pucón","Villarrica","Freire","Gorbea","Toltén","Loncoche","Teodoro Schmidt","Carahue","Nueva Imperial","Saavedra","Cholchol","Angol","Renaico","Collipulli","Ercilla","Los Sauces","Purén","Lumaco","Traiguén","Victoria","Lonquimay","Curacautín","Galvarino"],
    "Los Ríos": ["Valdivia","Corral","Lanco","Los Lagos","Máfil","Mariquina","Paillaco","Panguipulli","La Unión","Futrono","Lago Ranco","Río Bueno"],
    "Los Lagos": ["Puerto Montt","Puerto Varas","Llanquihue","Frutillar","Los Muermos","Calbuco","Maullín","Cochamó","Osorno","San Pablo","Puyehue","Río Negro","Purranque","San Juan de la Costa","Castro","Ancud","Chonchi","Dalcahue","Puqueldón","Queilén","Quellón","Quemchi","Quinchao","Chaitén","Futaleufú","Hualaihué","Palena"],
    "Aysén": ["Coyhaique","Aysén","Cisnes","Guaitecas","Lago Verde","Cochrane","O’Higgins","Tortel","Chile Chico","Río Ibáñez"],
    "Magallanes y la Antártica": ["Punta Arenas","Laguna Blanca","Río Verde","San Gregorio","Natales","Torres del Paine","Porvenir","Primavera","Timaukel","Cabo de Hornos","Antártica"]
  }), []);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "",        // guarda ID del rol
    estado: true,
    region: "",
    comuna: "",
  });
  const [mensaje, setMensaje] = useState(null);

  // Comunas disponibles según la región seleccionada
  const comunasDisponibles = useMemo(
    () => (form.region ? comunasPorRegion[form.region] ?? [] : []),
    [form.region, comunasPorRegion]
  );

  // Si cambia la región y la comuna actual no pertenece, la reseteamos
  useEffect(() => {
    if (form.region && form.comuna && !comunasDisponibles.includes(form.comuna)) {
      setForm((f) => ({ ...f, comuna: "" }));
    }
  }, [form.region, comunasDisponibles]);

  // Carga inicial (editar / crear)
  useEffect(() => {
    if (usuario) {
      setForm({
        id: usuario.id,
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        password: "",
        rol: usuario.rol_id ?? usuario.rol?.id ?? "",
        estado: usuario.estado ?? true,
        region: usuario.region ?? "",
        comuna: usuario.comuna ?? "",
      });
    } else {
      setForm({
        nombre: "",
        email: "",
        password: "",
        rol: "",
        estado: true,
        region: "",
        comuna: "",
      });
    }
  }, [usuario, modo]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje(null);

    try {
      const url = esEditar
        ? `http://localhost:8082/api/usuarios/${form.id}`
        : "http://localhost:8082/api/usuarios";
      const metodo = esEditar ? "PUT" : "POST";

      // Lo que tu backend (DTO) valida: nombre, email, password (crear), rol, estado, region, comuna
      const base = {
        nombre: form.nombre?.trim(),
        email: form.email?.trim(),
        estado: !!form.estado,
        region: form.region,     // requerido por tu DTO
        comuna: form.comuna,     // requerido por tu DTO
        rol: form.rol ? { id: Number(form.rol) } : null,
      };
      const payload = esEditar ? base : { ...base, password: form.password };

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Respuesta backend:", res.status, txt);
        throw new Error("Error al guardar el usuario");
      }

      const data = await res.json();
      setMensaje({ tipo: "exito", texto: "✅ Usuario guardado correctamente." });
      onGuardar?.(data);
    } catch (error) {
      console.error("Error al guardar:", error);
      setMensaje({ tipo: "error", texto: "❌ No se pudo guardar el usuario." });
    }
  }

  return (
    <div className="modal fade" id="modalUsuario" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{esEditar ? "Editar Usuario" : "Agregar Usuario"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
            </div>

            <div className="modal-body">
              {mensaje && (
                <div className={`alert ${mensaje.tipo === "error" ? "alert-danger" : "alert-success"}`}>
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

                {!esEditar && (
                  <div className="col-md-6">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="form-control"
                      required
                      minLength={8}
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

                {/* Región */}
                <div className="col-md-6">
                  <label className="form-label">Región</label>
                  <select
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Selecciona una región</option>
                    {Object.keys(comunasPorRegion).map((reg) => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>

                {/* Comuna */}
                <div className="col-md-6">
                  <label className="form-label">Comuna</label>
                  <select
                    name="comuna"
                    value={form.comuna}
                    onChange={handleChange}
                    className="form-select"
                    required
                    disabled={!form.region}
                  >
                    <option value="">Selecciona una comuna</option>
                    {comunasDisponibles.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <div className="form-check mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="estado"
                      checked={!!form.estado}
                      onChange={handleChange}
                      id="estado"
                    />
                    <label className="form-check-label" htmlFor="estado">Activo</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {esEditar ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 