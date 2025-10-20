import { createContext, useContext, useState, useEffect } from "react";

// ✅ 1. Creamos el contexto
const SesionContext = createContext();

// ✅ 2. Componente principal que maneja la sesión
export function MantenerSesion({ children }) {
  const [usuario, setUsuario] = useState(null);

  // Al abrir la app, recuperar la sesión guardada
  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) setUsuario(JSON.parse(guardado));
  }, []);

  // Iniciar sesión y guardar datos del usuario
  const login = (data) => {
    if (data.estado === true) {
      localStorage.setItem("usuario", JSON.stringify(data));
      setUsuario(data);
    } else {
      alert("⚠️ Tu cuenta está desactivada. No puedes iniciar sesión.");
    }
  };

  // Cerrar sesión y limpiar datos
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

// ✅ 3. Hook para usar la sesión en cualquier componente
export function useSesion() {
  return useContext(SesionContext);
}