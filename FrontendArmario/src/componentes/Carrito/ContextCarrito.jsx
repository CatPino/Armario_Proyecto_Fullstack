import { createContext, useContext, useEffect, useState } from "react";

const CarritoContext = createContext();
const CARRITO_STORAGE_KEY = "contextcarrito";

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem(CARRITO_STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  const [errores, setErrores] = useState({}); // errores por producto

  useEffect(() => {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito));
  }, [carrito]);

  // Obtiene el id real del producto
  const obtenerId = (producto) => {
    return Number(
      producto.id ??
      producto.idProducto ??
      producto.productoId ??
      producto.ID ??
      null
    );
  };

  // Pide stock real desde el microservicio
  const obtenerStockBackend = async (idProducto) => {
    try {
      const res = await fetch(`http://localhost:8081/api/productos/${idProducto}`);
      const data = await res.json();
      return data.stock;
    } catch (e) {
      console.error("Error consultando stock:", e);
      return 0;
    }
  };

  // ============================
  // AGREGAR PRODUCTO AL CARRITO
  // ============================
  const agregarProducto = async (producto) => {
    const idReal = obtenerId(producto);

    // FIX: antes usaba (!idReal) y bloqueaba IDs válidos
    if (idReal === null || idReal === undefined || isNaN(idReal)) {
      console.error("Producto sin ID válido:", producto);
      return;
    }

    const productoEnCarrito = carrito.find((p) => p.id === idReal);

    const cantidadActual = productoEnCarrito ? productoEnCarrito.cantidad : 0;
    const cantidadNueva = cantidadActual + 1;

    const stockDisponible = await obtenerStockBackend(idReal);

    if (cantidadNueva > stockDisponible) {
      setErrores((prev) => ({
        ...prev,
        [idReal]: "No hay más stock disponible",
      }));
      return;
    }

    // limpiar error si hay stock suficiente
    setErrores((prev) => ({ ...prev, [idReal]: null }));

    if (productoEnCarrito) {
      setCarrito((prev) =>
        prev.map((item) =>
          item.id === idReal
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito((prev) => [
        ...prev,
        { ...producto, id: idReal, cantidad: 1 },
      ]);
    }
  };

  // ==================================
  // ACTUALIZAR CANTIDAD DESDE EL MODAL
  // ==================================
  const actualizarCantidad = async (idProducto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    const stockDisponible = await obtenerStockBackend(idProducto);

    if (nuevaCantidad > stockDisponible) {
      setErrores((prev) => ({
        ...prev,
        [idProducto]: "No hay más stock disponible",
      }));
      return;
    }

    // limpiar error si la cantidad es válida
    setErrores((prev) => ({ ...prev, [idProducto]: null }));

    setCarrito((prev) =>
      prev.map((item) =>
        item.id === idProducto
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  // ===============================
  // ELIMINAR PRODUCTO DEL CARRITO
  // ===============================
  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));

    // borrar error asociado
    setErrores((prev) => {
      const copia = { ...prev };
      delete copia[id];
      return copia;
    });
  };

  const totalProductos = () =>
    carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        actualizarCantidad,
        eliminarProducto,
        totalProductos,
        errores,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);