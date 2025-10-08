package com.inventario.backend_inventario.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.inventario.backend_inventario.entities.Producto;

public interface ProductoRepositories extends CrudRepository <Producto, Long>{

     // 🔹 Buscar productos por nombre del producto
    List<Producto> findByNombre(String nombre);
    // 🔹 Buscar productos por nombre de la categoría (usa el objeto Categoria)
    List<Producto> findByCategoria_Nombre(String categoriaNombre);
    // 🔹 Buscar productos con stock menor a cierta cantidad
    List<Producto> findByStockLessThan(int stock);
    List<Producto> findByActivoTrue();

}




