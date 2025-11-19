package com.backend.backend_usuario.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.backend_usuario.dto.ActualizarPerfil;
import com.backend.backend_usuario.dto.ActualizarUsuarioAdmin;
import com.backend.backend_usuario.dto.SolicitudCrearUsuario;
import com.backend.backend_usuario.entities.Usuario;
import com.backend.backend_usuario.security.JwtUtil;
import com.backend.backend_usuario.services.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@Valid @RequestBody SolicitudCrearUsuario req) {
        Usuario nuevo = usuarioService.crear(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.obtenerPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String password = req.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email y password son requeridos"));
        }

        Usuario usuario = usuarioService.buscarPorEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Usuario no encontrado"));
        }

        if (!usuarioService.verificarPassword(password, usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Contraseña incorrecta"));
        }

        if (!usuario.isEstado()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Usuario inactivo"));
        }

        String token = jwtUtil.generateToken(usuario);

        Map<String, Object> respuesta = Map.of(
                "token", token,
                "id", usuario.getId(),
                "nombre", usuario.getNombre(),
                "email", usuario.getEmail(),
                "rol", usuario.getRol().getNombre(),
                "estado", usuario.isEstado()
        );

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarUsuarioAdmin req) {

        Usuario actualizado = usuarioService.actualizar(id, req);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }


    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Usuario> desactivarUsuario(@PathVariable Long id) {
        Usuario desactivado = usuarioService.desactivar(id);
        return ResponseEntity.ok(desactivado);
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Usuario>> listarActivos() {
        List<Usuario> activos = usuarioService.listarActivos();
        return ResponseEntity.ok(activos);
    }

    @GetMapping("/inactivos")
    public ResponseEntity<List<Usuario>> listarInactivos() {
        List<Usuario> inactivos = usuarioService.listarInactivos();
        return ResponseEntity.ok(inactivos);
    }

    @PatchMapping("/{id}/perfil")
    public ResponseEntity<Usuario> actualizarPerfil(
            @PathVariable Long id,
            @RequestBody ActualizarPerfil req
    ) {
        Usuario actualizado = usuarioService.actualizarPerfil(id, req);
        return ResponseEntity.ok(actualizado);
    }
}
