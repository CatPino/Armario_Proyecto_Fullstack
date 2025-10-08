package com.backend.backend_usuario.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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

import com.backend.backend_usuario.entities.Rol;
import com.backend.backend_usuario.entities.Usuario;
import com.backend.backend_usuario.repositories.RolRepository;
import com.backend.backend_usuario.repositories.UsuarioRepository;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder encriptador;

    /* ========= Crear ========= */
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody @Valid SolicitudCrearUsuario req) {
        String email = req.email().trim().toLowerCase();

        if (usuarioRepository.existeEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El email ya está registrado.");
        }

        Rol rol = resolverRol(req.rolId(), req.rolNombre());
        if (rol == null)
            return ResponseEntity.badRequest().body("Rol no encontrado.");

        Usuario u = new Usuario();
        u.setNombre(req.nombre().trim());
        u.setEmail(email);
        u.setPassword(encriptador.encode(req.password()));
        u.setRol(rol);
        if (req.estado() != null)
            u.setEstado(req.estado()); // por defecto es true en la entidad

        Usuario guardado = usuarioRepository.save(u);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    /* === Listar con filtros (sin paginación, CrudRepository) === */
    @GetMapping
    public ResponseEntity<List<Usuario>> listar(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean estado,
            @RequestParam(required = false) Long rolId,
            @RequestParam(required = false) String rolNombre) {
        List<Usuario> resultado;

        if (rolId != null && estado != null) {
            resultado = usuarioRepository.listarPorRolYEstado(rolId, estado);
            return ResponseEntity.ok(resultado);
        }

        if (rolNombre != null && !rolNombre.isBlank() && estado != null) {
            Optional<Rol> rol = rolRepository.buscarPorNombre(rolNombre.trim());
            if (rol.isEmpty())
                return ResponseEntity.badRequest().build();
            resultado = usuarioRepository.listarPorRolYEstado(rol.get().getId(), estado);
            return ResponseEntity.ok(resultado);
        }

        if (estado != null) {
            resultado = estado ? usuarioRepository.listarActivos() : usuarioRepository.listarInactivos();
            return ResponseEntity.ok(resultado);
        }

        if (q != null && !q.isBlank()) {
            resultado = usuarioRepository.buscarPorTexto(q.trim());
            return ResponseEntity.ok(resultado);
        }

        resultado = toList(usuarioRepository.findAll());
        return ResponseEntity.ok(resultado);
    }

    /* ========= Detalle ========= */
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtener(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /* ========= Actualizar (parcial) ========= */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id,
            @RequestBody @Valid SolicitudActualizarUsuario req) {
        Optional<Usuario> opt = usuarioRepository.findById(id);
        if (opt.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");

        Usuario u = opt.get();

        if (req.nombre() != null && !req.nombre().isBlank()) {
            u.setNombre(req.nombre().trim());
        }

        if (req.email() != null && !req.email().isBlank()) {
            String nuevoEmail = req.email().trim().toLowerCase();
            if (!nuevoEmail.equalsIgnoreCase(u.getEmail()) && usuarioRepository.existeEmail(nuevoEmail)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("El email ya está registrado.");
            }
            u.setEmail(nuevoEmail);
        }

        if (req.password() != null && !req.password().isBlank()) {
            u.setPassword(encriptador.encode(req.password()));
        }

        if (req.rolId() != null || (req.rolNombre() != null && !req.rolNombre().isBlank())) {
            Rol rol = resolverRol(req.rolId(), req.rolNombre());
            if (rol == null)
                return ResponseEntity.badRequest().body("Rol no encontrado.");
            u.setRol(rol);
        }

        if (req.estado() != null) {
            u.setEstado(req.estado());
        }

        Usuario actualizado = usuarioRepository.save(u);
        return ResponseEntity.ok(actualizado);
    }

    /* ========= Inhabilitar (soft delete) ========= */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> inhabilitar(@PathVariable Long id) {
        Optional<Usuario> opt = usuarioRepository.findById(id);
        if (opt.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");

        Usuario u = opt.get();
        if (!u.isEstado())
            return ResponseEntity.noContent().build(); // ya estaba inhabilitado
        u.setEstado(false);
        usuarioRepository.save(u);
        return ResponseEntity.noContent().build();
    }

    /* ========= Cambiar estado explícitamente ========= */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id,
            @RequestBody @Valid SolicitudCambiarEstado req) {
        Optional<Usuario> opt = usuarioRepository.findById(id);
        if (opt.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");

        Usuario u = opt.get();
        u.setEstado(req.estado());
        return ResponseEntity.ok(usuarioRepository.save(u));
    }

    /* ========= DTOs (en español) ========= */
    public static record SolicitudCrearUsuario(
            @NotBlank @Size(min = 2, max = 120) String nombre,
            @NotBlank @Email @Size(max = 180) String email,
            @NotBlank @Size(min = 8, max = 100) String password,
            Long rolId,
            String rolNombre,
            Boolean estado) {
    }

    public static record SolicitudActualizarUsuario(
            @Size(min = 2, max = 120) String nombre,
            @Email @Size(max = 180) String email,
            @Size(min = 8, max = 100) String password,
            Long rolId,
            String rolNombre,
            Boolean estado) {
    }

    public static record SolicitudCambiarEstado(
            @NotNull Boolean estado) {
    }

    /* ========= Helpers ========= */
    private Rol resolverRol(Long rolId, String rolNombre) {
        if (rolId != null) {
            return rolRepository.findById(rolId).orElse(null);
        }
        if (rolNombre != null && !rolNombre.isBlank()) {
            return rolRepository.buscarPorNombre(rolNombre.trim()).orElse(null);
        }
        // por defecto "cliente"
        return rolRepository.buscarPorNombre("cliente").orElse(null);
    }

    private static <T> List<T> toList(Iterable<T> it) {
        List<T> list = new ArrayList<>();
        for (T t : it) {
            list.add(t);
        }
        return list;
    }
}
