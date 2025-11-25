import { useEffect, useState } from "react";
import { useCarrito } from "../Carrito/ContextCarrito";
import { useNavigate } from "react-router-dom";

export default function Pago() {
  const { carrito } = useCarrito();
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

  const [comunas, setComunas] = useState([]);

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
    "Atacama": ["Copiapó","Caldera","Tierra Amarilla","Chañaral","Diego de Almagro","Vallenar","Huasco","Freirina","Alto del Carmen"],
    "Coquimbo": ["La Serena","Coquimbo","Andacollo","La Higuera","Paihuano","Vicuña","Illapel","Canela","Los Vilos","Salamanca","Ovalle","Combarbalá","Monte Patria","Punitaqui","Río Hurtado"],
    "Valparaíso": [
      "Valparaíso","Viña del Mar","Concón","Quintero","Puchuncaví","Casablanca","Juan Fernández","Isla de Pascua",
      "San Antonio","Cartagena","El Quisco","El Tabo","Algarrobo","Santo Domingo","San Felipe","Llaillay",
      "Catemu","Panquehue","Putaendo","Santa María","Los Andes","Calle Larga","Rinconada","San Esteban",
      "Quillota","La Cruz","La Calera","Hijuelas","Nogales","Petorca","La Ligua","Cabildo","Zapallar",
      "Papudo","Quilpué","Villa Alemana","Limache","Olmué"
    ],
    "Región Metropolitana": [
      "Santiago","Cerrillos","Cerro Navia","Conchalí","El Bosque","Estación Central","Huechuraba","Independencia",
      "La Cisterna","La Florida","La Granja","La Pintana","La Reina","Las Condes","Lo Barnechea","Lo Espejo",
      "Lo Prado","Macul","Maipú","Ñuñoa","Pedro Aguirre Cerda","Peñalolén","Providencia","Pudahuel","Quilicura",
      "Quinta Normal","Recoleta","Renca","San Joaquín","San Miguel","San Ramón","Vitacura","Colina","Lampa",
      "Tiltil","Puente Alto","Pirque","San José de Maipo","San Bernardo","Buin","Paine","Calera de Tango",
      "Melipilla","Alhué","Curacaví","María Pinto","San Pedro","Talagante","El Monte","Isla de Maipo",
      "Padre Hurtado","Peñaflor"
    ]
  };

  // ==========================
  // CARGAR DATOS SI EL USUARIO ESTÁ LOGEADO
  // ==========================
  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) {
      const user = JSON.parse(guardado);

      setUsuario((prev) => ({
        ...prev,
        nombre: user.nombre || "",
        email: user.email || "",
        telefono: user.telefono || "",
        region: user.region || "",
        comuna: user.comuna || "",
        direccion: user.direccion || "",
        departamento: user.departamento || "",
        infoEnvio: user.infoEnvio || "",
      }));

      if (user.region) {
        setComunas(comunasPorRegion[user.region] || []);
      }
    }
  }, []);

  // ==========================
  // HANDLE CHANGE
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));

    if (name === "region") {
      setComunas(comunasPorRegion[value] || []);
      setUsuario((prev) => ({ ...prev, comuna: "" }));
    }
  };

  // ==========================
  // PROCESAR PAGO (WEBPAY REAL)
  // ==========================
  const procesarPago = async () => {
    try {
      if (carrito.length === 0) {
        alert("No hay productos en el carrito.");
        return;
      }

      const total = carrito.reduce(
        (acc, p) => acc + p.precio * p.cantidad,
        0
      );

      const user = JSON.parse(localStorage.getItem("usuario"));
      const tokenUsuario = user?.token;

      const body = {
        nombreCliente: usuario.nombre,
        correoCliente: usuario.email,
        telefonoCliente: usuario.telefono,

        direccionCliente: usuario.direccion + " " + usuario.departamento,
        regionCliente: usuario.region,
        comunaCliente: usuario.comuna,
        indicacionesEnvio: usuario.infoEnvio,

        total: total,
        metodoPago: "WEBPAY",

        detalles: carrito.map((p) => ({
          producto: p.nombre,
          cantidad: p.cantidad,
          precioUnitario: p.precio,
          subtotal: p.precio * p.cantidad
        }))
      };

      const res = await fetch("http://localhost:8083/api/webpay/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: tokenUsuario ? `Bearer ${tokenUsuario}` : ""
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!data.url) {
        alert("❌ Error creando transacción Webpay");
        return;
      }

      localStorage.setItem("jwt_pago", data.jwt);

      // 🔥 REDIRECCIÓN AL BANCO REAL
      window.location.href = data.url;

    } catch (error) {
      console.error(error);
      alert("Error al procesar el pago");
    }
  };

  // ==========================
  // JSX
  // ==========================
  return (
    <main className="container mt-5">
      <h2 className="mb-4"><strong>Carrito de compra</strong></h2>

      {/* CARRITO */}
      <div className="card p-4 mb-4">
        {carrito.length === 0 ? (
          <h4>No hay productos en el carrito.</h4>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.imagenUrl}
                      alt={item.nombre}
                      style={{ width: "100px", height: "100px", borderRadius: "8px" }}
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
        )}

        <h3 className="text-end mt-3">
          Total a pagar:{" "}
          <span className="text-success">
            <strong>
              ${carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)}
            </strong>
          </span>
        </h3>
      </div>

      {/* INFORMACIÓN DEL CLIENTE */}
      <h2><strong>Información del cliente</strong></h2>

      <div className="card p-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Nombre</label>
            <input
              className="form-control"
              name="nombre"
              value={usuario.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Correo</label>
            <input
              className="form-control"
              name="email"
              value={usuario.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Teléfono</label>
            <input
              className="form-control"
              name="telefono"
              value={usuario.telefono}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* DIRECCIÓN */}
        <h4 className="mt-4">Dirección de entrega</h4>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Calle</label>
            <input
              className="form-control"
              name="direccion"
              value={usuario.direccion}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Departamento (Opcional)</label>
            <input
              className="form-control"
              name="departamento"
              value={usuario.departamento}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Región</label>
            <select
              className="form-select"
              name="region"
              value={usuario.region}
              onChange={handleChange}
            >
              <option value="">Selecciona región</option>
              {Object.keys(comunasPorRegion).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label>Comuna</label>
            <select
              className="form-select"
              name="comuna"
              value={usuario.comuna}
              onChange={handleChange}
            >
              <option value="">Selecciona comuna</option>
              {comunas.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="col-12 mb-3">
            <label>Indicaciones (opcional)</label>
            <textarea
              className="form-control"
              name="infoEnvio"
              value={usuario.infoEnvio}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* BOTÓN */}
      <div className="text-end mt-4">
        <button className="btn btn-success btn-lg" onClick={procesarPago}>
          Procesar pago
        </button>
      </div>
    </main>
  );
}
