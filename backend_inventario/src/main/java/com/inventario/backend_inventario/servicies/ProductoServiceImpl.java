package com.inventario.backend_inventario.servicies;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.inventario.backend_inventario.dto.ProductoRequest;
import com.inventario.backend_inventario.entities.Categoria;
import com.inventario.backend_inventario.entities.Producto;
import com.inventario.backend_inventario.repositories.CategoriaRepositories;
import com.inventario.backend_inventario.repositories.ProductoRepositories;


@Service
public class ProductoServiceImpl implements ProductoService{

    @Autowired
    private ProductoRepositories productoRepositories;
    @Autowired
    private CategoriaRepositories categoriaRepositories;

    @Override
    public Producto crearProducto(ProductoRequest productoRequest) {
        Producto nuevoProducto = new Producto();

        nuevoProducto.setNombre(productoRequest.getNombre());
        nuevoProducto.setDescripcion(productoRequest.getDescripcion());
        nuevoProducto.setPrecio(productoRequest.getPrecio());
        nuevoProducto.setStock(productoRequest.getStock());
        nuevoProducto.setImagenUrl(productoRequest.getImagenUrl());
        nuevoProducto.setActivo(true);

        Categoria categoria = categoriaRepositories.findById(productoRequest.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + productoRequest.getCategoriaId()));

        nuevoProducto.setCategoria(categoria);
        return productoRepositories.save(nuevoProducto);
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
    public Producto actualizarProducto(Long id, ProductoRequest productoRequest) {
        Producto existente = productoRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        existente.setNombre(productoRequest.getNombre());
        existente.setDescripcion(productoRequest.getDescripcion());
        existente.setPrecio(productoRequest.getPrecio());
        existente.setStock(productoRequest.getStock());
        existente.setImagenUrl(productoRequest.getImagenUrl());

        Categoria categoria = categoriaRepositories.findById(productoRequest.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + productoRequest.getCategoriaId()));

        existente.setCategoria(categoria);

        return productoRepositories.save(existente);
    }

    @Override
    public Producto cambiarEstado(Long id, boolean nuevoEstado) {
        Producto producto = obtenerId(id);
        if (producto != null) {
            producto.setActivo(nuevoEstado);
            return productoRepositories.save(producto);
        }
        return null;
    }

    @Override
    public boolean validarStock(Long idProducto, int cantidadSolicitada) {
        Producto producto = obtenerId(idProducto);
        return producto != null && producto.getStock() >= cantidadSolicitada;
    }

    @Override
    public String subirImagen(Long idProducto, MultipartFile archivo) {
        try {
            String ruta = "uploads/" + archivo.getOriginalFilename();
            File destino = new File(ruta);
            archivo.transferTo(destino);

            Producto producto = obtenerId(idProducto);
            if (producto != null) {
                producto.setImagenUrl(ruta);
                productoRepositories.save(producto);
            }

            return ruta;
        } catch (IOException e) {
            throw new RuntimeException("Error al subir imagen: " + e.getMessage());
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
