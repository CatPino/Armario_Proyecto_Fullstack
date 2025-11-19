import { createContext, useContext, useState, useEffect } from "react";

const SesionContext = createContext();

export function MantenerSesion({ children }) {
  const [usuario, setUsuario] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) {
      setUsuario(JSON.parse(guardado));
    }
  }, []);

  // LOGIN corregido con token
  const login = (data) => {
    if (data.estado === true) {

      // 🔥 Muy importante: aseguramos que el usuario tenga el token adentro
      const usuarioConToken = {
        ...data,
        token: data.token   // <-- el token queda dentro del usuario
      };

      // Guardamos en localStorage el usuario completo con token
      localStorage.setItem("usuario", JSON.stringify(usuarioConToken));

      // Actualizamos el estado
      setUsuario(usuarioConToken);

    } else {
      alert("⚠️ Tu cuenta está desactivada. No puedes iniciar sesión.");
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <SesionContext.Provider value={{ usuario, login, logout }}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  return useContext(SesionContext);
}
