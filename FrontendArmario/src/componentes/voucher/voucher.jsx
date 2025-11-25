import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Voucher() {
  const [params] = useSearchParams();
  const token = params.get("token_ws");

  const [boleta, setBoleta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("No se recibió token_ws");
      setCargando(false);
      return;
    }

    fetch(`http://localhost:8083/api/webpay/confirmar?token_ws=${token}`)
      .then((res) => res.json())
      .then((data) => {
        setBoleta(data);
        setCargando(false);
      })
      .catch((err) => {
        setError("Error al confirmar pago");
        setCargando(false);
      });
  }, [token]);

  if (cargando) return <h2>Procesando pago...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="container mt-5">
      <h2>Pago exitoso 🎉</h2>

      <h4>Cliente</h4>
      <p><strong>Nombre:</strong> {boleta.nombreCliente}</p>
      <p><strong>Correo:</strong> {boleta.correoCliente}</p>

      <h4>Detalles</h4>
      <ul>
        {boleta.detalles.map((d, i) => (
          <li key={i}>
            {d.producto} — {d.cantidad} x ${d.precioUnitario}
          </li>
        ))}
      </ul>

      <h3 className="mt-3">
        Total: <strong>${boleta.pago.total}</strong>
      </h3>
    </div>
  );
}
