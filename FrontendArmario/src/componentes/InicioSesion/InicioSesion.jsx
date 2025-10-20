import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./InicioSesion.css";

export function InicioSesion() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  // ======== VALIDACIONES ==========
  const emailPermitido = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

  const validarCampo = (id, valor) => {
    const input = document.getElementById(id);
    const err = document.getElementById(`err-${id}`);
    const ok = document.getElementById(`ok-${id}`);

    if (!input) return false;
    input.classList.remove("is-invalid", "is-valid");
    if (err) err.textContent = "";
    if (ok) ok.textContent = "";

    if (id === "email") {
      if (!valor || !emailPermitido.test(valor.trim())) {
        input.classList.add("is-invalid");
        if (err)
          err.textContent =
            "Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com)";
        return false;
      } else {
        input.classList.add("is-valid");
        if (ok) ok.textContent = "Correo válido.";
        return true;
      }
    }

    if (id === "password") {
      if (!valor || valor.trim().length < 8) {
        input.classList.add("is-invalid");
        if (err)
          err.textContent = "La contraseña debe tener al menos 8 caracteres.";
        return false;
      } else {
        input.classList.add("is-valid");
        if (ok) ok.textContent = "Contraseña válida.";
        return true;
      }
    }

    return true;
  };

  // ======== AUTO-COMPLETAR CORREO RECORDADO ==========
  useEffect(() => {
    const emailRecordado = localStorage.getItem("emailRecordado");
    if (emailRecordado) {
      setEmail(emailRecordado);
      const check = document.getElementById("Recordar");
      if (check) check.checked = true;
    }
  }, []);

  // ======== LOGIN ==========
  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje(null);

    const validoEmail = validarCampo("email", email);
    const validoPass = validarCampo("password", password);
    if (!validoEmail || !validoPass) return;

    setCargando(true);

    try {
      const respuesta = await fetch("http://localhost:8082/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        const mensajeError =
          typeof data === "object" && data !== null
            ? data.error || JSON.stringify(data)
            : data;

        setMensaje({
          tipo: "error",
          texto: mensajeError || "⚠️ Credenciales incorrectas.",
        });
        return;
      }

      // ✅ Detectar nombre y rol (el backend devuelve rol como string)
      const nombreUsuario = data.nombre || "Usuario";
      const rolUsuario =
        typeof data.rol === "string" ? data.rol.toLowerCase() : "cliente";

      // ✅ Guardar la sesión simplificada
      const usuarioGuardado = {
        id: data.id,
        nombre: nombreUsuario,
        email: data.email || email,
        rol: rolUsuario, // 👈 string plano: "admin" o "cliente"
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioGuardado));
      localStorage.setItem("rolUsuario", rolUsuario);
      localStorage.setItem("nombreUsuario", nombreUsuario);
      localStorage.setItem("mostrarModalUsuario", "true");

      // 🔥 Forzar actualización en Navbar sin recargar
      window.dispatchEvent(new Event("storage"));

      // ✅ Recordar correo si está marcado
      const recordar = document.getElementById("Recordar");
      if (recordar && recordar.checked) {
        localStorage.setItem("emailRecordado", email);
      } else {
        localStorage.removeItem("emailRecordado");
      }

      // ✅ Mostrar mensaje de éxito
      setMensaje({
        tipo: "exito",
        texto: "✅ Inicio de sesión exitoso. Redirigiendo...",
      });

      // ✅ Redirigir al Home
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      console.error("Error de login:", error);
      setMensaje({
        tipo: "error",
        texto: "❌ Error de conexión con el servidor. Inténtalo más tarde.",
      });
    } finally {
      setCargando(false);
    }
  };

  // ======== RENDER ==========
  return (
    <main className="container container-login">
      <h2 className="mb-3"><strong>Inicio de Sesión</strong></h2>
      <h3 className="text-muted mb-4">
        Inicia sesión para acceder a tu cuenta y continuar tu experiencia en
        Armario De Sombra.
      </h3>

      <div className="card card-login">
        <form
          onSubmit={handleLogin}
          id="loginForm"
          method="post"
          style={{ marginTop: "15px" }}
        >
          {/* === EMAIL === */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => validarCampo("email", e.target.value)}
            />
            <div id="err-email" className="invalid-feedback"></div>
            <div id="ok-email" className="valid-feedback"></div>
          </div>

          {/* === PASSWORD === */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => validarCampo("password", e.target.value)}
            />
            <div id="err-password" className="invalid-feedback"></div>
            <div id="ok-password" className="valid-feedback"></div>
          </div>

          {/* === RECORDAR === */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="Recordar" />
              <label className="form-check-label" htmlFor="Recordar">
                Recordarme
              </label>
            </div>
            <Link to="#" className="text-decoration-none">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* === BOTÓN === */}
          <button type="submit" className="btn w-100 button1" disabled={cargando}>
            {cargando ? "Verificando..." : "Iniciar Sesión"}
          </button>

          {/* === MENSAJE === */}
          {mensaje && (
            <div
              className={`alert mt-3 ${
                mensaje.tipo === "error" ? "alert-danger" : "alert-success"
              }`}
            >
              {mensaje.texto}
            </div>
          )}

          <p className="text-center mt-3 mb-0">
            ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
