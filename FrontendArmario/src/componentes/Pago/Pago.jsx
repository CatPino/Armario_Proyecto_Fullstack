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

  const [comunas, setComunas] = useState([]);
  const [procesando, setProcesando] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");

  // ==========================
  // TODAS LAS REGIONES Y COMUNAS
  // ==========================
  const comunasPorRegion = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": [
      "Antofagasta","Mejillones","Sierra Gorda","Taltal","Calama",
      "Ollagüe","San Pedro de Atacama","Tocopilla","María Elena"
    ],
    "Atacama": [
      "Copiapó","Caldera","Tierra Amarilla","Chañaral","Diego de Almagro",
      "Vallenar","Huasco","Freirina","Alto del Carmen"
    ],
    "Coquimbo": [
      "La Serena","Coquimbo","Andacollo","La Higuera","Paihuano","Vicuña","Illapel",
      "Canela","Los Vilos","Salamanca","Ovalle","Combarbalá","Monte Patria",
      "Punitaqui","Río Hurtado"
    ],
    "Valparaíso": [
      "Valparaíso","Viña del Mar","Concón","Quintero","Puchuncaví","Casablanca",
      "Juan Fernández","Isla de Pascua","San Antonio","Cartagena","El Quisco",
      "El Tabo","Algarrobo","Santo Domingo","San Felipe","Llaillay","Catemu",
      "Panquehue","Putaendo","Santa María","Los Andes","Calle Larga","Rinconada",
      "San Esteban","Quillota","La Cruz","La Calera","Hijuelas","Nogales",
      "Petorca","La Ligua","Cabildo","Zapallar","Papudo","Quilpué",
      "Villa Alemana","Limache","Olmué"
    ],
    "Región Metropolitana": [
      "Santiago","Cerrillos","Cerro Navia","Conchalí","El Bosque","Estación Central",
      "Huechuraba","Independencia","La Cisterna","La Florida","La Granja","La Pintana",
      "La Reina","Las Condes","Lo Barnechea","Lo Espejo","Lo Prado","Macul","Maipú",
      "Ñuñoa","Pedro Aguirre Cerda","Peñalolén","Providencia","Pudahuel","Quilicura",
      "Quinta Normal","Recoleta","Renca","San Joaquín","San Miguel","San Ramón",
      "Vitacura","Colina","Lampa","Tiltil","Puente Alto","Pirque","San José de Maipo",
      "San Bernardo","Buin","Paine","Calera de Tango","Melipilla","Alhué",
      "Curacaví","María Pinto","San Pedro","Talagante","El Monte","Isla de Maipo",
      "Padre Hurtado","Peñaflor"
    ],
    "O’Higgins": [
      "Rancagua","Machalí","Graneros","Mostazal","Codegua","Requínoa","Rengo",
      "Malloa","San Vicente","Pichidegua","Peumo","Las Cabras","San Fernando",
      "Chimbarongo","Nancagua","Placilla","Santa Cruz","Lolol","Palmilla",
      "Peralillo","Paredones","Pichilemu","Marchigüe","Navidad","Litueche",
      "La Estrella"
    ],
    "Maule": [
      "Talca","San Clemente","Pelarco","Pencahue","Maule","San Rafael","Curepto",
      "Constitución","Empedrado","Curicó","Teno","Romeral","Molina","Sagrada Familia",
      "Hualañé","Licantén","Vichuquén","Linares","San Javier","Villa Alegre",
      "Yerbas Buenas","Colbún","Longaví","Parral","Retiro"
    ],
    "Ñuble": [
      "Chillán","Chillán Viejo","San Carlos","Coihueco","Ñiquén","San Fabián",
      "San Nicolás","Pemuco","El Carmen","Pinto","Quillón","Bulnes","San Ignacio",
      "Yungay","Treguaco","Cobquecura","Ninhue","Quirihue","Portezuelo","Coelemu",
      "Ránquil"
    ],
    "Biobío": [
      "Concepción","Talcahuano","Hualpén","Chiguayante","San Pedro de la Paz",
      "Coronel","Lota","Hualqui","Santa Juana","Tomé","Penco","Los Ángeles",
      "Mulchén","Nacimiento","Negrete","Santa Bárbara","Quilaco","Quilleco",
      "Antuco","Cabrero","Yumbel","Tucapel","Alto Biobío","Arauco","Curanilahue",
      "Lebu","Los Álamos","Tirúa","Cañete","Contulmo"
    ],
    "La Araucanía": [
      "Temuco","Padre Las Casas","Cunco","Melipeuco","Vilcún","Curacautín","Lonquimay",
      "Freire","Pitrufquén","Gorbea","Loncoche","Villarrica","Pucón","Toltén",
      "Teodoro Schmidt","Saavedra","Carahue","Nueva Imperial","Galvarino","Lautaro",
      "Perquenco","Victoria","Traiguén","Angol","Purén","Renaico"
    ],
    "Los Ríos": [
      "Valdivia","Corral","Lanco","Los Lagos","Máfil","Mariquina","Paillaco",
      "Panguipulli","La Unión","Río Bueno","Futrono","Lago Ranco"
    ],
    "Los Lagos": [
      "Puerto Montt","Calbuco","Cochamó","Maullín","Puerto Varas","Llanquihue",
      "Fresia","Frutillar","Los Muermos","Osorno","Río Negro","Purranque",
      "San Juan de la Costa","San Pablo","Castro","Ancud","Quellón","Dalcahue",
      "Curaco de Vélez","Quinchao","Chonchi"
    ],
    "Aysén": [
      "Coyhaique","Puerto Aysén","Cisnes","Guaitecas","Aysén","Lago Verde",
      "Chile Chico","Río Ibáñez","Cochrane","O’Higgins","Tortel"
    ],
    "Magallanes": [
      "Punta Arenas","Puerto Natales","Porvenir","Cabo de Hornos","Laguna Blanca",
      "Río Verde","San Gregorio","Primavera","Timaukel"
    ]
  };

  // ==========================
  // Cargar Usuario
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
  // Cálculos
  // ==========================
  const subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  // ==========================
  // PROCESAR PAGO CON DELAY
  // ==========================
  const procesarPago = async () => {
    if (!metodoPago) return alert("Selecciona un método de pago.");
    if (carrito.length === 0) return alert("No hay productos.");

    setProcesando(true); // Mostrar mensaje

    // Esperar 3 segundos ANTES del fetch
    setTimeout(async () => {

      const body = {
        nombreCliente: usuario.nombre,
        correoCliente: usuario.email,
        telefonoCliente: usuario.telefono,
        direccionCliente: usuario.direccion + " " + usuario.departamento,
        regionCliente: usuario.region,
        comunaCliente: usuario.comuna,
        indicacionesEnvio: usuario.infoEnvio,
        metodoPago,
        total,
        detalles: carrito.map((p) => ({
          producto: p.nombre,
          cantidad: p.cantidad,
          precioUnitario: p.precio,
          subtotal: p.precio * p.cantidad,
        }))
      };

       try {

      const res = await fetch("http://localhost:8083/api/pagos/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        alert("Error al procesar el pago");
        setProcesando(false);
        return;
      }

      const data = await res.json();
      console.log("Boleta guardada:", data);

      localStorage.setItem("boleta", JSON.stringify({
        idBoleta: data.idBoleta,
        nombreCliente: usuario.nombre,
        correoCliente: usuario.email,
        telefonoCliente: usuario.telefono,
        direccionCliente: usuario.direccion + " " + usuario.departamento,
        regionCliente: usuario.region,
        comunaCliente: usuario.comuna,
        indicacionesEnvio: usuario.infoEnvio,
        metodoPago,
        total,
        fecha: new Date().toLocaleString("es-CL"),
        detalles: carrito.map((p) => ({
          idProducto: p.id,
          nombre: p.nombre,
          cantidad: p.cantidad,
          precioUnitario: p.precio,
          subtotal: p.precio * p.cantidad,
          imagenUrl: p.imagenUrl
        })),
      }));

      for (const p of carrito) {
        await fetch(`http://localhost:8081/api/productos/${p.id}/descontar?cantidad=${p.cantidad}`, {
          method: "PATCH"
        });
      }

      if (typeof vaciarCarrito === "function") {
        vaciarCarrito();
      }
      navigate("/compra-exitosa");

    } catch (error) {
      console.error(error);
      alert("Error inesperado.");
      setProcesando(false);
    }

  }, 2000);
};

  return (
    <main className="container mt-5">
      {procesando && (
        <div className="text-center mt-5 pt-5">
          <h2 style={{ fontWeight: "bold" }}>Procesando pago… 💳</h2>
        </div>
      )}

    {!procesando && (
      <>
        <div className="card p-4 mb-4">
          <h2 className="mb-5"><strong>Carrito de compra</strong></h2>

          <table className="table mb-3">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
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

        <div className="card p-4 mb-4 text-start">
          <h2 className="mb-5"><strong>Información del cliente</strong></h2>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label>Nombre</label>
              <input className="form-control" name="nombre" value={usuario.nombre} onChange={handleChange} />
            </div>

            <div className="col-md-4 mb-3">
              <label>Correo</label>
              <input className="form-control" name="email" value={usuario.email} onChange={handleChange} />
            </div>

            <div className="col-md-4 mb-3">
              <label>Teléfono</label>
              <input className="form-control" name="telefono" value={usuario.telefono} onChange={handleChange} />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Calle</label>
              <input className="form-control" name="direccion" value={usuario.direccion} onChange={handleChange} />
            </div>

            <div className="col-md-6 mb-3">
              <label>Departamento (Opcional)</label>
              <input className="form-control" name="departamento" value={usuario.departamento} onChange={handleChange} />
            </div>

            <div className="col-md-6 mb-3">
              <label>Región</label>
              <select className="form-select" name="region" value={usuario.region} onChange={handleChange}>
                <option value="">Selecciona región</option>
                {Object.keys(comunasPorRegion).map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label>Comuna</label>
              <select className="form-select" name="comuna" value={usuario.comuna} onChange={handleChange}>
                <option value="">Selecciona comuna</option>
                {comunas.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="col-12 mb-3">
              <label>Indicaciones adicionales</label>
              <textarea className="form-control" name="infoEnvio" value={usuario.infoEnvio} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="card p-4 mb-4 w-100">
          <h2 className="mb-3"><strong>Método de pago</strong></h2>

          <h5 className="mb-3">Selecciona un método</h5>

          {/* Débito */}
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

          {/* Crédito */}
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

        <div className="card p-4 mb-4 text-end">
          <h4>Subtotal: ${subtotal}</h4>
          <h5 className="text-muted">IVA (19%): ${iva}</h5>

          <h2 className="text-success mt-2" style={{ fontWeight: "bold" }}>
            Total a pagar: ${total}
          </h2>

          {metodoPago && (
            <p className="mt-1 text-muted">
              Método seleccionado: <strong>{metodoPago}</strong>
            </p>
          )}
        </div>

        <div className="text-end mt-4 mb-5 d-flex justify-content-end gap-3">

        <button
          className="btn button1"
          onClick={() => navigate("/")}
        >Volver al inicio
        </button>

        {/* Botón confirmar compra (Morado principal) */}
        <button
          className="btn button2"
          onClick={procesarPago}
        >
          Confirmar compra
        </button>

      </div>

      </>
    )}
  </main>
);
}