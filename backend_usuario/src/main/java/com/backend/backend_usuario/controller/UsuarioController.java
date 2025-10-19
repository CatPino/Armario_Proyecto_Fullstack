package com.backend.backend_usuario.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.backend_usuario.dto.SolicitudActualizarUsuario;
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
    private UsuarioService usuarioService;

    // ======================= CREAR =======================
    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@Valid @RequestBody SolicitudCrearUsuario req) {
        Usuario nuevo = usuarioService.crear(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    // ======================= OBTENER POR ID =======================
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.obtenerPorId(id);
        return ResponseEntity.ok(usuario);
    }

    // ======================= LOGIN =======================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String password = req.get("password");

        Usuario usuario = usuarioService.buscarPorEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("❌ Usuario no encontrado");
        }

        // Aquí asumo que usas BCrypt o similar en tu registro
        if (!usuarioService.verificarPassword(password, usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("❌ Contraseña incorrecta");
        }

    // Si llega aquí, el login fue exitoso
    return ResponseEntity.ok(usuario);
}

    // ======================= LISTAR TODOS =======================
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    // ======================= ACTUALIZAR =======================
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody SolicitudActualizarUsuario req) {

        Usuario actualizado = usuarioService.actualizar(id, req);
        return ResponseEntity.ok(actualizado);
    }

    // ======================= ELIMINAR =======================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ======================= DESACTIVAR =======================
    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Usuario> desactivarUsuario(@PathVariable Long id) {
        Usuario desactivado = usuarioService.desactivar(id);
        return ResponseEntity.ok(desactivado);
    }

    // ======================= LISTAR ACTIVOS =======================
    @GetMapping("/activos")
    public ResponseEntity<List<Usuario>> listarActivos() {
        List<Usuario> activos = usuarioService.listarActivos();
        return ResponseEntity.ok(activos);
    }

    // ======================= LISTAR INACTIVOS =======================
    @GetMapping("/inactivos")
    public ResponseEntity<List<Usuario>> listarInactivos() {
        List<Usuario> inactivos = usuarioService.listarInactivos();
        return ResponseEntity.ok(inactivos);
    }
}