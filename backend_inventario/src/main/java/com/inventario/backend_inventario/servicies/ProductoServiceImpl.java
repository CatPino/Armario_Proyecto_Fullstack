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
public class ProductoServiceImpl implements ProductoService{

    @Autowired
    private ProductoRepositories productoRepositories;

    @Override
    public Producto crear(Producto producto){
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
        existente.setDescripcion(productoActualizado.getDescripcion());
        existente.setPrecio(productoActualizado.getPrecio());
        return productoRepositories.save(existente);
    }

    @Override
    public Producto desactivar(Long id){
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
            // 📁 Crear carpeta si no existe
            String directorio = "img/";
            File carpeta = new File(directorio);
            if (!carpeta.exists()) carpeta.mkdirs();

            // 🧾 Crear nombre único para evitar reemplazos accidentales
            String nombreArchivo = System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
            String rutaCompleta = directorio + nombreArchivo;

            // 💾 Guardar el archivo físicamente
            archivo.transferTo(new File(rutaCompleta));

            // 🌐 Construir URL pública (gracias al WebMvcConfigurer)
            String urlPublica = "http://localhost:8081/" + rutaCompleta;

            // 🧠 Actualizar el producto con la nueva imagen
            Producto producto = obtenerId(idProducto);
            if (producto != null) {
                producto.setImagenUrl(urlPublica);
                productoRepositories.save(producto);
            }

            return urlPublica;

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
