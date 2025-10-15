import { Footer } from '../../componentes/Footer/Footer'
import { Link } from 'react-router-dom'
import './Login.css'

export function Login() {
  return (
    <>
      <div className="container container-login">
        <h2><strong>Inicio de sesión</strong></h2>
        <h3 className="text-muted">
          Inicia sesión para acceder a tu cuenta y continuar tu experiencia en Armario De Sombra.
        </h3>

        <div className="card card-login">
          <form id="loginForm" method="post" action="" style={{ marginTop: '15px' }}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input type="email" className="form-control" id="email" name="email" placeholder="tucorreo@ejemplo.com"/>
              <div id="err-email" className="invalid-feedback"></div>
              <div id="ok-email" className="valid-feedback"></div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input type="password" className="form-control" id="password" name="password" placeholder="Contraseña"/>
              <div id="err-password" className="invalid-feedback"></div>
              <div id="ok-password" className="valid-feedback"></div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="Recordar" />
                <label className="form-check-label" htmlFor="Recordar">Recordarme</label>
              </div>
              <Link to="#" className="text-decoration-none">¿Olvidaste tu contraseña?</Link>
            </div>

            <button type="submit" className="btn w-100 button1">Iniciar sesión</button>

            <p className="text-center mt-3 mb-0">
              ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </>
  )
}