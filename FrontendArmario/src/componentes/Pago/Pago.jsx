import { useEffect, useState } from "react";
import { useCarrito } from "../Carrito/ContextCarrito";
import { useNavigate } from "react-router-dom";

export default function Pago() {
  const { carrito, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    region: "",
    comuna: "",
    direccion: "",
    departamento: "",
    infoEnvio: "",
  });

  const [errores, setErrores] = useState({});
  const [comunas, setComunas] = useState([]);
  const [procesando, setProcesando] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");

  const [subtotalBackend] = useState(null);
  const [ivaBackend] = useState(null);
  const [totalBackend] = useState(null);

  // ==========================
  // TODAS LAS REGIONES Y COMUNAS
  // ==========================
  const comunasPorRegion = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": [
      "Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe",
      "San Pedro de Atacama", "Tocopilla", "María Elena"
    ],
    "Atacama": [
      "Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro",
      "Vallenar", "Huasco", "Freirina", "Alto del Carmen"
    ],
    "Coquimbo": [
      "La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela",
      "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"
    ],
    "Valparaíso": [
      "Valparaíso", "Viña del Mar", "Concón", "Quintero", "Puchuncaví", "Casablanca", "Juan Fernández",
      "Isla de Pascua", "San Antonio", "Cartagena", "El Quisco", "El Tabo", "Algarrobo", "Santo Domingo",
      "San Felipe", "Llaillay", "Catemu", "Panquehue", "Putaendo", "Santa María", "Los Andes", "Calle Larga",
      "Rinconada", "San Esteban", "Quillota", "La Cruz", "La Calera", "Hijuelas", "Nogales", "Petorca",
      "La Ligua", "Cabildo", "Zapallar", "Papudo", "Quilpué", "Villa Alemana", "Limache", "Olmué"
    ],
    "Región Metropolitana": [
      "Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba",
      "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes",
      "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda",
      "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca",
      "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Colina", "Lampa", "Tiltil", "Puente Alto",
      "Pirque", "San José de Maipo", "San Bernardo", "Buin", "Paine", "Calera de Tango", "Melipilla",
      "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo",
      "Padre Hurtado", "Peñaflor"
    ],
    "O’Higgins": [
      "Rancagua", "Machalí", "Graneros", "Mostazal", "Codegua", "Requínoa", "Rengo", "Malloa",
      "San Vicente", "Pichidegua", "Peumo", "Las Cabras", "San Fernando", "Chimbarongo", "Nancagua",
      "Placilla", "Santa Cruz", "Lolol", "Palmilla", "Peralillo", "Paredones", "Pichilemu", "Marchigüe",
      "Navidad", "Litueche", "La Estrella"
    ],
    "Maule": [
      "Talca", "San Clemente", "Pelarco", "Pencahue", "Maule", "San Rafael", "Curepto", "Constitución",
      "Empedrado", "Curicó", "Teno", "Romeral", "Molina", "Sagrada Familia", "Hualañé", "Licantén",
      "Vichuquén", "Linares", "San Javier", "Villa Alegre", "Yerbas Buenas", "Colbún", "Longaví", "Parral",
      "Retiro"
    ],
    "Ñuble": [
      "Chillán", "Chillán Viejo", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás",
      "Pemuco", "El Carmen", "Pinto", "Quillón", "Bulnes", "San Ignacio", "Yungay", "Treguaco", "Cobquecura",
      "Ninhue", "Quirihue", "Portezuelo", "Coelemu", "Ránquil"
    ],
    "Biobío": [
      "Concepción", "Talcahuano", "Hualpén", "Chiguayante", "San Pedro de la Paz", "Coronel", "Lota",
      "Hualqui", "Santa Juana", "Tomé", "Penco", "Los Ángeles", "Mulchén", "Nacimiento", "Negrete",
      "Santa Bárbara", "Quilaco", "Quilleco", "Antuco", "Cabrero", "Yumbel", "Tucapel", "Alto Biobío",
      "Arauco", "Curanilahue", "Lebu", "Los Álamos", "Tirúa", "Cañete", "Contulmo"
    ],
    "La Araucanía": [
      "Temuco", "Padre Las Casas", "Cunco", "Melipeuco", "Vilcún", "Curacautín", "Lonquimay", "Freire",
      "Pitrufquén", "Gorbea", "Loncoche", "Villarrica", "Pucón", "Toltén", "Teodoro Schmidt", "Saavedra",
      "Carahue", "Nueva Imperial", "Galvarino", "Lautaro", "Perquenco", "Victoria", "Traiguén", "Angol",
      "Purén", "Renaico"
    ],
    "Los Ríos": [
      "Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli",
      "La Unión", "Río Bueno", "Futrono", "Lago Ranco"
    ],
    "Los Lagos": [
      "Puerto Montt", "Calbuco", "Cochamó", "Maullín", "Puerto Varas", "Llanquihue", "Fresia", "Frutillar",
      "Los Muermos", "Osorno", "Río Negro", "Purranque", "San Juan de la Costa", "San Pablo", "Castro",
      "Ancud", "Quellón", "Dalcahue", "Curaco de Vélez", "Quinchao", "Chonchi"
    ],
    "Aysén": [
      "Coyhaique", "Puerto Aysén", "Cisnes", "Guaitecas", "Aysén", "Lago Verde", "Chile Chico",
      "Río Ibáñez", "Cochrane", "O’Higgins", "Tortel"
    ],
    "Magallanes": [
      "Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos", "Laguna Blanca", "Río Verde",
      "San Gregorio", "Primavera", "Timaukel"
    ]
  };

  // ==========================
  // VALIDACIÓN
  // ==========================
  const validarCampo = (name, value) => {
    let error = "";

    if (name === "nombre" && (!value || value.trim().length < 4))
      error = "El nombre debe tener al menos 4 letras.";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@(gmail\.com|duoc\.cl|profesor\.duoc\.cl)$/i;
      if (!emailRegex.test(value.trim())) error = "Correo inválido.";
    }

    if (name === "telefono") {
      const telRegex = /^\d{9,11}$/;
      if (!telRegex.test(value.trim())) error = "Teléfono inválido.";
    }

    if (name === "direccion" && value.trim().length < 4)
      error = "Dirección muy corta.";

    if (name === "region" && !value) error = "Selecciona una región.";
    if (name === "comuna" && !value) error = "Selecciona una comuna.";

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUsuario((prev) => ({ ...prev, [name]: value }));

    const errorMsg = validarCampo(name, value);
    setErrores((prev) => ({ ...prev, [name]: errorMsg }));

    if (name === "region") {
      setComunas(comunasPorRegion[value] || []);
      setUsuario((prev) => ({ ...prev, comuna: "" }));
      setErrores((prev) => ({ ...prev, comuna: "Selecciona una comuna." }));
    }
  };

  // ==========================
  // CARGAR USUARIO LOCALSTORAGE
  // ==========================
  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) {
      const user = JSON.parse(guardado);
      setUsuario((prev) => ({ ...prev, ...user }));

      if (user.region) {
        setComunas(comunasPorRegion[user.region] || []);
      }
    }
  }, []);

  // ==========================
  // CARGAR DESDE BACKEND SI EXISTE
  // ==========================
  useEffect(() => {
    async function cargarDatos() {
      try {
        const email = localStorage.getItem("email");
        if (!email) return;

        const res = await fetch(`http://localhost:8082/api/usuarios/email/${email}`);
        if (!res.ok) return;

        const user = await res.json();

        setUsuario((prev) => ({ ...prev, ...user }));

        if (user.region) {
          setComunas(comunasPorRegion[user.region] || []);
        }
      } catch (err) {
        console.error("Error cargando usuario:", err);
      }
    }

    cargarDatos();
  }, []);

  const validarTodo = () => {
    const nuevosErrores = {};

    for (const campo in usuario) {
      const error = validarCampo(campo, usuario[campo]);
      if (error) nuevosErrores[campo] = error;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const procesarPago = async () => {
    if (!validarTodo()) {
      alert("Corrige los campos marcados en rojo.");
      return;
    }

    if (!metodoPago) return alert("Selecciona un método de pago.");
    if (carrito.length === 0) return alert("No hay productos.");

    try {
      setProcesando(true);

      for (const item of carrito) {
        await fetch(
          `http://localhost:8081/api/productos/${item.id}/descontar?cantidad=${item.cantidad}`,
          { method: "PATCH" }
        );
      }

      // 2️⃣ Crear boleta
      const res = await fetch("http://localhost:8083/api/pagos/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCliente: usuario.nombre,
          correoCliente: usuario.email,
          telefonoCliente: usuario.telefono,
          regionCliente: usuario.region,
          comunaCliente: usuario.comuna,
          direccionCliente: usuario.direccion,
          indicacionesEnvio: usuario.infoEnvio,
          metodoPago,
          detalles: carrito.map((item) => ({
            idProducto: item.id,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precioUnitario: item.precio,
            subtotal: item.precio * item.cantidad,
            imagenUrl: item.imagenUrl,
          })),
          subtotal,
          iva,
          total,
        }),
      });

      const data = await res.json();
      const boletaCompleta = {
        ...data.boleta,
        metodoPago,
        fecha: new Date().toLocaleString("es-CL"),
        subtotal,
        iva,
        total,
      };

      localStorage.setItem("boleta", JSON.stringify(boletaCompleta));

      vaciarCarrito();
      setTimeout(() => {
        navigate("/compra-exitosa");
      }, 2000);

    } catch (err) {
      console.error(err);
      alert("Hubo un error procesando el pago.");
      setProcesando(false);
    }
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  // IVA incluido dentro del total
  const iva = Math.round(total * (19 / 119));

  // Subtotal (neto sin IVA)
  const subtotal = total - iva;
  return (
    <main className="container mt-5">

      {procesando && (
        <div className="text-center mt-5 pt-5">
          <h2 style={{ fontWeight: "bold" }}>Procesando pago… 💳</h2>
        </div>
      )}

      {!procesando && (
        <>
          {/* CARRITO */}
          <div className="card p-4 mb-4">
            <h2 className="mb-5"><strong>Carrito de compra</strong></h2>

            <table className="table mb-3">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.imagenUrl}
                        alt={item.nombre}
                        style={{ width: 80, height: 80, borderRadius: 6 }}
                      />
                    </td>
                    <td>{item.nombre}</td>
                    <td>${item.precio}</td>
                    <td>{item.cantidad}</td>
                    <td>${item.precio * item.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 className="text-end">
              Subtotal: <strong>${subtotal}</strong>
            </h4>
          </div>

          {/* INFORMACIÓN DEL CLIENTE */}
          <div className="card p-4 mb-4 text-start">
            <h2 className="mb-5"><strong>Información del cliente</strong></h2>

            <div className="row">
              {/* Nombre */}
              <div className="col-md-4 mb-3">
                <label>Nombre</label>
                <input
                  className={`form-control ${errores.nombre ? "is-invalid" : usuario.nombre ? "is-valid" : ""}`}
                  name="nombre"
                  value={usuario.nombre}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errores.nombre}</div>
              </div>

              {/* Correo */}
              <div className="col-md-4 mb-3">
                <label>Correo</label>
                <input
                  className={`form-control ${errores.email ? "is-invalid" : usuario.email ? "is-valid" : ""}`}
                  name="email"
                  value={usuario.email}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errores.email}</div>
              </div>

              {/* Teléfono */}
              <div className="col-md-4 mb-3">
                <label>Teléfono</label>
                <input
                  className={`form-control ${errores.telefono ? "is-invalid" : usuario.telefono ? "is-valid" : ""}`}
                  name="telefono"
                  value={usuario.telefono}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errores.telefono}</div>
              </div>
            </div>

            <div className="row">
              {/* Dirección */}
              <div className="col-md-6 mb-3">
                <label>Calle</label>
                <input
                  className={`form-control ${errores.direccion ? "is-invalid" : usuario.direccion ? "is-valid" : ""}`}
                  name="direccion"
                  value={usuario.direccion}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errores.direccion}</div>
              </div>

              {/* Departamento */}
              <div className="col-md-6 mb-3">
                <label>Departamento (Opcional)</label>
                <input
                  className="form-control"
                  name="departamento"
                  value={usuario.departamento}
                  onChange={handleChange}
                />
              </div>

              {/* Región */}
              <div className="col-md-6 mb-3">
                <label>Región</label>
                <select
                  className={`form-select ${errores.region ? "is-invalid" : usuario.region ? "is-valid" : ""}`}
                  name="region"
                  value={usuario.region}
                  onChange={handleChange}
                >
                  <option value="">Selecciona región</option>
                  {Object.keys(comunasPorRegion).map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <div className="invalid-feedback">{errores.region}</div>
              </div>

              {/* Comuna */}
              <div className="col-md-6 mb-3">
                <label>Comuna</label>
                <select
                  className={`form-select ${errores.comuna ? "is-invalid" : usuario.comuna ? "is-valid" : ""}`}
                  name="comuna"
                  value={usuario.comuna}
                  onChange={handleChange}
                >
                  <option value="">Selecciona comuna</option>
                  {comunas.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <div className="invalid-feedback">{errores.comuna}</div>
              </div>

              {/* Indicaciones */}
              <div className="col-12 mb-3">
                <label>Indicaciones adicionales</label>
                <textarea
                  className="form-control"
                  name="infoEnvio"
                  value={usuario.infoEnvio}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* MÉTODO DE PAGO */}
          <div className="card p-4 mb-4 w-100">
            <h2 className="mb-3"><strong>Método de pago</strong></h2>
            <h5 className="mb-3">Selecciona un método</h5>

            <div className="form-check mb-3 text-start">
              <input
                type="radio"
                className="form-check-input"
                id="pagoDebito"
                name="metodoPago"
                value="Débito"
                checked={metodoPago === "Débito"}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              <label className="form-check-label ms-2" htmlFor="pagoDebito">
                Tarjeta Débito
              </label>
            </div>

            <div className="form-check text-start">
              <input
                type="radio"
                className="form-check-input"
                id="pagoCredito"
                name="metodoPago"
                value="Crédito"
                checked={metodoPago === "Crédito"}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              <label className="form-check-label ms-2" htmlFor="pagoCredito">
                Tarjeta Crédito
              </label>
            </div>
          </div>

          {/* RESUMEN FINAL */}
          <div className="card p-4 mb-4 text-end">
            <h4>
              Subtotal: ${subtotalBackend !== null ? subtotalBackend : subtotal}
            </h4>

            <h5 className="text-muted">
              IVA (19%): ${ivaBackend !== null ? ivaBackend : iva}
            </h5>

            <h2 className="text-success mt-2" style={{ fontWeight: "bold" }}>
              Total a pagar: ${totalBackend !== null ? totalBackend : total}
            </h2>

            {metodoPago && (
              <p className="mt-1 text-muted">
                Método seleccionado: <strong>{metodoPago}</strong>
              </p>
            )}
          </div>

          {/* BOTONES */}
          <div className="text-end mt-4 mb-5 d-flex justify-content-end gap-3">
            <button className="btn button1" onClick={() => navigate("/")}>
              Volver al inicio
            </button>

            <button className="btn button2" onClick={procesarPago}>
              Confirmar compra
            </button>
          </div>
        </>
      )}
    </main>
  );
}
