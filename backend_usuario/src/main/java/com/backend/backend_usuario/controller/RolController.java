package com.backend.backend_usuario.controller;

import com.backend.backend_usuario.entities.Rol;
import com.backend.backend_usuario.repositories.RolRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RolController {

    private final RolRepository rolRepository;

    /* ========= Crear ========= */
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody @Valid SolicitudCrearRol req) {
        String nombre = req.nombre().trim().toLowerCase();

        if (rolRepository.existeNombre(nombre)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ya existe un rol con ese nombre.");
        }

        Rol rol = new Rol();
        rol.setNombre(nombre);
        if (req.descripcion() != null) rol.setDescripcion(req.descripcion().trim());

        Rol guardado = rolRepository.save(rol);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    /* ========= Listar (q opcional) ========= */
    @GetMapping
    public ResponseEntity<List<Rol>> listar(@RequestParam(required = false) String q) {
        List<Rol> roles = rolRepository.listarTodosOrdenNombre();
        if (q != null && !q.isBlank()) {
            String texto = q.trim().toLowerCase();
            roles = roles.stream()
                    .filter(r -> r.getNombre() != null && r.getNombre().toLowerCase().contains(texto))
                    .toList();
        }
        return ResponseEntity.ok(roles);
    }

    /* ========= Detalle ========= */
    @GetMapping("/{id}")
    public ResponseEntity<Rol> obtener(@PathVariable Long id) {
        return rolRepository.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /* ========= Actualizar (parcial) ========= */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id,
                                        @RequestBody @Valid SolicitudActualizarRol req) {
        Optional<Rol> opt = rolRepository.obtenerPorId(id);
        if (opt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rol no encontrado.");

        Rol rol = opt.get();

        if (req.nombre() != null && !req.nombre().isBlank()) {
            String nuevoNombre = req.nombre().trim().toLowerCase();
            // si cambia y el nombre ya existe en otro rol -> conflicto
            if (!nuevoNombre.equalsIgnoreCase(rol.getNombre()) && rolRepository.existeNombre(nuevoNombre)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe un rol con ese nombre.");
            }
            rol.setNombre(nuevoNombre);
        }
        if (req.descripcion() != null) {
            rol.setDescripcion(req.descripcion().trim());
        }

        Rol actualizado = rolRepository.save(rol);
        return ResponseEntity.ok(actualizado);
    }

    /* ========= Eliminar ========= */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Optional<Rol> opt = rolRepository.obtenerPorId(id);
        if (opt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rol no encontrado.");

        try {
            rolRepository.delete(opt.get());
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            // FK en usuarios (rol en uso)
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("No se puede eliminar el rol porque está siendo utilizado por usuarios.");
        }
    }

    /* ========= DTOs ========= */
    public static record SolicitudCrearRol(
            @NotBlank @Size(min = 3, max = 50) String nombre,
            @Size(max = 200) String descripcion
    ) {}

    public static record SolicitudActualizarRol(
            @Size(min = 3, max = 50) String nombre,
            @Size(max = 200) String descripcion
    ) {}
}
