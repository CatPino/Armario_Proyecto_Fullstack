package com.inventario.backend_inventario.controller;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<Producto> crearProducto(@Valid @RequestBody Producto producto) {
        Producto nuevoProducto = productoServices.crear(producto);
        return ResponseEntity.ok(nuevoProducto);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoServices.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id,
            @Valid @RequestBody Producto productoActualizado) {
        Producto producto = productoServices.actualizar(id, productoActualizado);
        return ResponseEntity.ok(producto);
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Producto> desactivar(@PathVariable Long id) {
        return ResponseEntity.ok(productoServices.desactivar(id));
    }

    @GetMapping("/{id}/validar")
    public ResponseEntity<Integer> validarStock(@PathVariable("id") Long idProducto) {
        Producto producto = productoServices.obtenerId(idProducto);

        if (producto == null || producto.getStock() <= 0) {
            return ResponseEntity.ok(0);
        }

        return ResponseEntity.ok(producto.getStock().intValue());
    }

    @PostMapping("/{id}/imagen")
    public ResponseEntity<?> subirImagen(
            @PathVariable Long id,
            @RequestParam("archivo") MultipartFile archivo) {

        try {
            if (archivo == null || archivo.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Archivo vacío o no enviado (campo debe llamarse 'archivo')"));
            }

            String url = productoServices.subirImagen(id, archivo);
            return ResponseEntity.ok(Map.of("imagenUrl", url));

        } catch (NoSuchElementException e) { // si cambiaras obtenerId para que lance esta
            return ResponseEntity.status(404).body(Map.of("error", "Producto no encontrado: " + id));
        } catch (RuntimeException e) { // errores controlados de service
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) { // errores inesperados
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error inesperado"));
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscar(@RequestParam(required = false) String nombre,
            @RequestParam(required = false) String categoria) {

        List<Producto> productos;

        if (nombre != null && !nombre.trim().isEmpty()) {
            productos = productoServices.buscarPorNombre(nombre);

        } else if (categoria != null && !categoria.trim().isEmpty()) {
            productos = productoServices.buscarPorCategoria(categoria);

        } else {
            productos = productoServices.listarTodas();
        }

        return ResponseEntity.ok(productos);
    }

    @GetMapping("/alertas-stock")
    public ResponseEntity<List<Producto>> obtenerProductosConStockBajo() {
        List<Producto> productos = productoServices.listarStockBajo();
        return ResponseEntity.ok(productos);
    }
}
