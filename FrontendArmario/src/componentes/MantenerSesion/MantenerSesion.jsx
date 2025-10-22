import { createContext, useContext, useState, useEffect } from "react";

const SesionContext = createContext();

export function MantenerSesion({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) setUsuario(JSON.parse(guardado));
  }, []);

  const login = (data) => {
    if (data.estado === true) {
      localStorage.setItem("usuario", JSON.stringify(data));
      setUsuario(data);
    } else {
      alert("⚠️ Tu cuenta está desactivada. No puedes iniciar sesión.");
    }
  };

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