package com.backend.backend_usuario.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.backend_usuario.dto.SolicitudCrearUsuario;
import com.backend.backend_usuario.entities.Usuario;
import com.backend.backend_usuario.services.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UsuarioController {


    @Autowired
    private final UsuarioService usuarioService;

    /* ========= Crear ========= */
    @PostMapping
    public ResponseEntity<Usuario> crear(@Valid @RequestBody SolicitudCrearUsuario req) {
        Usuario guardado = usuarioService.crearUsuarioCliente(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    /* === Listar con filtros (sin paginación, CrudRepository) === */
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean estado,
            @RequestParam(required = false) Long rolId,
            @RequestParam(required = false) String rolNombre) {

        List<Usuario> usuarios = usuarioService.listar(q, estado, rolId, rolNombre);
        return ResponseEntity.ok(usuarios);
    }

    /* ======================= OBTENER ======================= */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.obtener(id);
        return usuario.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado"));
    }

    /* ======================= OBTENER ACTIVO ======================= */
    @GetMapping("/{id}/activo")
    public ResponseEntity<?> obtenerActivo(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.obtenerActivo(id);
        return usuario.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no activo o no encontrado"));
    }

    /* ======================= ACTUALIZAR (parcial) ======================= */
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody Usuario usuarioActualizado) {

        Usuario usuario = usuarioService.actualizar(
                id,
                usuarioActualizado.getNombre(),
                usuarioActualizado.getEmail(),
                usuarioActualizado.getPassword(),
                usuarioActualizado.getRol() != null ? usuarioActualizado.getRol().getId() : null,
                usuarioActualizado.getRol() != null ? usuarioActualizado.getRol().getNombre() : null,
                usuarioActualizado.isEstado(),
                usuarioActualizado.getTelefono(),
                usuarioActualizado.getRegion(),
                usuarioActualizado.getComuna()
        );

    return ResponseEntity.ok(usuario);
}

    /* ======================= INHABILITAR (soft delete) ======================= */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> inhabilitar(@PathVariable Long id) {
        try {
            usuarioService.inhabilitar(id);
            return ResponseEntity.ok("Usuario inhabilitado correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /* ======================= CAMBIAR ESTADO ======================= */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam boolean estado) {
        try {
            Usuario actualizado = usuarioService.cambiarEstado(id, estado);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /* ======================= CREAR O OBTENER VISITANTE ======================= */
    @PostMapping("/visitante")
    public ResponseEntity<?> obtenerOCrearVisitante(
            @RequestParam String email,
            @RequestParam(required = false) String nombre) {

        try {
            Usuario visitante = usuarioService.obtenerOCrearVisitantePorEmail(email, nombre);
            return ResponseEntity.ok(visitante);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
