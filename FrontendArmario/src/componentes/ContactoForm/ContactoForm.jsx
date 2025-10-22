import { useState } from "react";
import "./ContactoForm.css";

export function ContactoForm() {
  const [form, setForm] = useState({ nombre: "", email: "", contenido: "" });
  const [errores, setErrores] = useState({});
  const [ok, setOk] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const correoValido = (email) =>
    /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(
      (email || "").trim()
    );

  const reglas = {
    nombre: {
      test: (v) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{4,100}$/.test((v || "").trim()),
      ok: "Nombre válido.",
      bad: "Debe tener al menos 4 letras sin números.",
    },
    email: {
      test: (v) => v.length <= 100 && correoValido(v),
      ok: "Correo válido.",
      bad: "Solo se aceptan @duoc.cl, @profesor.duoc.cl o @gmail.com.",
    },
    contenido: {
      test: (v) => (v || "").trim().length >= 10,
      ok: "Mensaje válido.",
      bad: "Debe tener al menos 10 caracteres.",
    },
  };

  const validarCampo = (name, valor) => {
    const regla = reglas[name];
    if (!regla) return;

    if (regla.test(valor)) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
      setOk((prev) => ({ ...prev, [name]: regla.ok }));
    } else {
      setOk((prev) => ({ ...prev, [name]: "" }));
      setErrores((prev) => ({ ...prev, [name]: regla.bad }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    validarCampo(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valido = true;
    Object.keys(reglas).forEach((campo) => {
      const valor = form[campo];
      validarCampo(campo, valor);
      if (!reglas[campo].test(valor)) valido = false;
    });

    if (!valido) {
      setMensaje("⚠️ Revisa los campos marcados en rojo.");
      return;
    }
    setMensaje("✅ Formulario validado correctamente (sin envío).");
  };

  return (
    <div className="container-contact">
      <h2><strong>Armario De Sombras</strong></h2>
      <h3 className="text-muted">
        ¡Estamos aquí para ayudarte! Completa el formulario y nos pondremos en contacto contigo lo antes posible.
      </h3>

      <div className="card-contact">
        <form onSubmit={handleSubmit}>
          <h3 className="text-center mb-3">Formulario de Contacto</h3>

          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input name="nombre" placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
              className={`form-control ${
                errores.nombre ? "is-invalid" : ok.nombre ? "is-valid" : ""
              }`}
            />
            {errores.nombre && (
              <div className="invalid-feedback">{errores.nombre}</div>
            )}
            {ok.nombre && <div className="valid-feedback">{ok.nombre}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input type="email" name="email" placeholder="tucorreo@ejemplo.com"
              value={form.email}
              onChange={handleChange}
              className={`form-control ${
                errores.email ? "is-invalid" : ok.email ? "is-valid" : ""
              }`}
            />
            {errores.email && (
              <div className="invalid-feedback">{errores.email}</div>
            )}
            {ok.email && <div className="valid-feedback">{ok.email}</div>}
          </div>

          {/* Mensaje */}
          <div className="mb-3">
            <label className="form-label">Mensaje</label>
            <textarea name="contenido" placeholder="Cuéntanos cómo podemos ayudarte..." rows="5"
              value={form.contenido}
              onChange={handleChange}
              className={`form-control ${
                errores.contenido
                  ? "is-invalid"
                  : ok.contenido
                  ? "is-valid"
                  : ""
              }`}
            ></textarea>
            {errores.contenido && (
              <div className="invalid-feedback">{errores.contenido}</div>
            )}
            {ok.contenido && (
              <div className="valid-feedback">{ok.contenido}</div>
            )}
          </div>
          <button type="submit" className="btn btn-dark w-100">Enviar</button>
          {mensaje && (
            <p
              className={`mt-3 text-center ${
                mensaje.startsWith("✅") ? "text-success" : "text-danger"
              }`}
            >
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}