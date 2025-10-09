package com.inventario.backend_inventario.controller;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.inventario.backend_inventario.dto.ProductoRequest;
import com.inventario.backend_inventario.entities.Producto;
import com.inventario.backend_inventario.servicies.ProductoService;

import jakarta.validation.Valid;



@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/productos")
public class ProductoRestControllers {

    @Autowired
    private ProductoService productoServices;

    @PostMapping
    public ResponseEntity<Producto> crearProducto(@Valid @RequestBody ProductoRequest productoRequest) {
        Producto nuevoProducto = productoServices.crearProducto(productoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        Producto producto = productoServices.obtenerId(id);
        return ResponseEntity.ok(producto);
    }

 
    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos() {
        List<Producto> productos = productoServices.listarTodas();
        return ResponseEntity.ok(productos);
    }
   
    @PutMapping("/{id}/actualizar")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @Valid @RequestBody ProductoRequest productoRequest) {

        Producto actualizado = productoServices.actualizarProducto(id, productoRequest);
        return ResponseEntity.ok(actualizado);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Producto> cambiarEstado(@PathVariable Long id, @RequestParam boolean activo) {
        Producto productoActualizado = productoServices.cambiarEstado(id, activo);
        if (productoActualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productoActualizado);
    }

    @GetMapping("/{id}/validar")
    public ResponseEntity<Integer> validarStock(@PathVariable("id") Long idProducto) {
        Producto producto = productoServices.obtenerId(idProducto);

        if (producto == null || producto.getStock() <= 0) {
            return ResponseEntity.ok(0); // Devuelve 0 si no hay stock o no existe
        }

        return ResponseEntity.ok(producto.getStock().intValue());
    }

    // --- SUBIR IMAGEN ---
    @PostMapping("/{id}/imagen")
    public ResponseEntity<Producto> subirImagen( @PathVariable("id") Long idProducto, @RequestParam("archivo") MultipartFile archivo) {

        try {
            String url = productoServices.subirImagen(idProducto, archivo);

            if (url == null) {
                return ResponseEntity.badRequest().build(); // producto no encontrado
            }

            Producto producto = productoServices.obtenerId(idProducto);
            return ResponseEntity.ok(producto);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build(); // error general
        }
    }

    //buscar
    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscar(@RequestParam(required = false) String nombre, @RequestParam(required = false) String categoria) {

    List<Producto> productos;

    if (nombre != null && !nombre.trim().isEmpty()) {
        // Buscar por nombre
        productos = productoServices.buscarPorNombre(nombre);

    } else if (categoria != null && !categoria.trim().isEmpty()) {
        // Buscar por categoría
        productos = productoServices.buscarPorCategoria(categoria);

    } else {
        // Si no hay filtros, devolver todos
        productos = productoServices.listarTodas();
    }

    return ResponseEntity.ok(productos);
}

    // -------------------------------------------------------------------------
    // ⚠️ MOSTRAR STOCK Y DETECTAR SI ESTÁ BAJO (<5 unidades)
    // -------------------------------------------------------------------------
    @GetMapping("/alertas-stock")
    public ResponseEntity<List<Producto>> obtenerProductosConStockBajo() {
        List<Producto> productos = productoServices.listarStockBajo();
        return ResponseEntity.ok(productos);
}
}
    






