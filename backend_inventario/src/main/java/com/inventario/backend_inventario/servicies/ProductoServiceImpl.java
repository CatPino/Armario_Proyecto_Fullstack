package com.inventario.backend_inventario.servicies;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.inventario.backend_inventario.entities.Producto;
import com.inventario.backend_inventario.repositories.ProductoRepositories;

@Service
public class ProductoServiceImpl implements ProductoService {

    @Autowired
    private ProductoRepositories productoRepositories;

    @Override
    public Producto crear(Producto producto) {
        return productoRepositories.save(producto);
    }

    @Override
    public Producto obtenerId(Long id) {
        return productoRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @Override
    public List<Producto> listarTodas() {
        return (List<Producto>) productoRepositories.findAll();
    }

    @Override
    public void eliminar(Long id) {
        if (!productoRepositories.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
        productoRepositories.deleteById(id);
    }

    @Override

    public Producto actualizar(Long id, Producto productoActualizado) {
        Producto existente = obtenerId(id);
        existente.setNombre(productoActualizado.getNombre());
        existente.setDescripcion(productoActualizado.getDescripcion());
        existente.setPrecio(productoActualizado.getPrecio());
        existente.setStock(productoActualizado.getStock());
        existente.setCategoria(productoActualizado.getCategoria()); 
        existente.setActivo(productoActualizado.getActivo()); 
        return productoRepositories.save(existente);
    }

    @Override
    public Producto desactivar(Long id) {
        Producto producto = obtenerId(id);
        producto.setActivo(false);
        return productoRepositories.save(producto);
    }

    @Override
    public boolean validarStock(Long idProducto, int cantidadSolicitada) {
        Producto producto = obtenerId(idProducto);
        return producto != null && producto.getStock() >= cantidadSolicitada;
    }

   
    @Override
    public String subirImagen(Long idProducto, MultipartFile archivo) {
        try {
            // 1) Carpeta "img" relativa al proyecto
            File carpeta = new File("img");
            if (!carpeta.exists())
                carpeta.mkdirs();

            // 2) Nombre único
            String original = archivo.getOriginalFilename();
            String ext = (original != null && original.contains(".")) ? original.substring(original.lastIndexOf("."))
                    : "";
            String nombreArchivo = "prod_" + idProducto + "_" + System.currentTimeMillis() + ext;

            // 3) Guardar físicamente
            File destino = new File(carpeta, nombreArchivo);
            archivo.transferTo(destino);

            // 4) URL pública (coincide con tu WebConfig /img/**)
            String urlPublica = "http://localhost:8081/img/" + nombreArchivo;

            // 5) Persistir en BD
            Producto producto = obtenerId(idProducto);
            producto.setImagenUrl(urlPublica);
            productoRepositories.save(producto);

            return urlPublica;
        } catch (IOException e) {
            throw new RuntimeException("Error al subir imagen: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Producto> buscarPorCategoria(String categoriaNombre) {
        return productoRepositories.findByCategoria_Nombre(categoriaNombre);
    }

    @Override
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepositories.findByNombre(nombre);
    }

    @Override
    public List<Producto> listarStockBajo() {
        return productoRepositories.findByStockLessThan(5);
    }

    @Override
    public List<Producto> listarActivos() {
        return productoRepositories.findByActivoTrue();
    }

}
