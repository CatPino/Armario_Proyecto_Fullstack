package com.backend.backend_usuario.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.backend_usuario.dto.SolicitudCrearUsuario;
import com.backend.backend_usuario.entities.Rol;
import com.backend.backend_usuario.entities.Usuario;
import com.backend.backend_usuario.repositories.RolRepository;
import com.backend.backend_usuario.repositories.UsuarioRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    @Autowired
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder encriptador;

    /* ======================= Crear ======================= */
    @Transactional
    public Usuario crearUsuarioCliente(SolicitudCrearUsuario req) {
        String emailNorm = req.email().trim().toLowerCase();

        if (usuarioRepository.existeEmail(emailNorm)) {
            throw new DataIntegrityViolationException("El email ya está registrado");
        }

        Rol rolCliente = rolRepository.buscarPorNombre("cliente")
                .orElseThrow(() -> new IllegalArgumentException("Rol 'cliente' no encontrado en la base de datos"));

        Usuario u = new Usuario();
        u.setNombre(req.nombre().trim());
        u.setEmail(emailNorm);
        u.setPassword(encriptador.encode(req.password()));
        u.setTelefono(req.telefono());
        u.setRegion(req.region());
        u.setComuna(req.comuna());
        u.setEstado(true);
        u.setRol(rolCliente);

        return usuarioRepository.save(u);
    }

    /* ======================= Listar (filtros) ======================= */
    @Transactional(readOnly = true)
    public List<Usuario> listar(String q, Boolean estado, Long rolId, String rolNombre) {
        if (rolId != null && estado != null) {
            return usuarioRepository.listarPorRolYEstado(rolId, estado);
        }
        if (rolNombre != null && !rolNombre.isBlank() && estado != null) {
            Optional<Rol> rol = rolRepository.buscarPorNombre(rolNombre.trim());
            if (rol.isEmpty())
                return List.of();
            return usuarioRepository.listarPorRolYEstado(rol.get().getId(), estado);
        }
        if (estado != null) {
            return estado ? usuarioRepository.listarActivos() : usuarioRepository.listarInactivos();
        }
        if (q != null && !q.isBlank()) {
            return usuarioRepository.buscarPorTexto(q.trim());
        }
        return toList(usuarioRepository.findAll());
    }

    /* ======================= Obtener ======================= */
    @Transactional(readOnly = true)
    public Optional<Usuario> obtener(Long id) {
        return usuarioRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerActivo(Long id) {
        return usuarioRepository.obtenerActivoPorId(id);
    }

    @Transactional
    public Usuario actualizar(Long id, String nombre, String email, String passwordPlano, Long rolId, String rolNombre,
                            Boolean estado, String telefono, String region, String comuna) {

    Usuario u = usuarioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (nombre != null && !nombre.isBlank())
            u.setNombre(nombre.trim());

        if (email != null && !email.isBlank()) {
            String nuevoEmail = normalizarEmail(email);
            if (!nuevoEmail.equalsIgnoreCase(u.getEmail()) && usuarioRepository.existeEmail(nuevoEmail)) {
                throw new DataIntegrityViolationException("El email ya está registrado");
            }
            u.setEmail(nuevoEmail);
        }

        if (passwordPlano != null && !passwordPlano.isBlank()) {
            u.setPassword(encriptador.encode(passwordPlano));
        }

        if (telefono != null && !telefono.isBlank())
            u.setTelefono(telefono.trim());

        if (region != null && !region.isBlank())
            u.setRegion(region.trim());

        if (comuna != null && !comuna.isBlank())
            u.setComuna(comuna.trim());

        if (rolId != null || (rolNombre != null && !rolNombre.isBlank())) {
            Rol rol = resolverRol(rolId, rolNombre);
            if (rol == null)
                throw new IllegalArgumentException("Rol no encontrado");
            u.setRol(rol);
        }

        if (estado != null)
            u.setEstado(estado);

        return usuarioRepository.save(u);
    }

    /* ======================= Inhabilitar (soft delete) ======================= */
    @Transactional
    public void inhabilitar(Long id) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        if (u.isEstado()) {
            u.setEstado(false);
            usuarioRepository.save(u);
        }
    }

    /* ======================= Cambiar estado ======================= */
    @Transactional
    public Usuario cambiarEstado(Long id, boolean estado) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        u.setEstado(estado);
        return usuarioRepository.save(u);
    }

    /* ======================= Guest-as-User (visitante) ======================= */
    @Transactional
    public Usuario obtenerOCrearVisitantePorEmail(String email, String nombreParaMostrar) {
        String emailNorm = normalizarEmail(email);

        return usuarioRepository.buscarPorEmail(emailNorm)
                .map(u -> {
                    if (u.getNombre() == null || u.getNombre().isBlank()) {
                        u.setNombre(nombreParaMostrar != null ? nombreParaMostrar : "Visitante");
                        usuarioRepository.save(u);
                    }
                    return u;
                })
                .orElseGet(() -> {
                    Rol rolVisitante = rolRepository.buscarPorNombre("visitante")
                            .orElseThrow(() -> new IllegalStateException("Falta rol 'visitante' en la tabla roles"));
                    String passRandom = java.util.UUID.randomUUID().toString() + "!";
                    Usuario nuevo = new Usuario();
                    nuevo.setNombre((nombreParaMostrar != null && !nombreParaMostrar.isBlank()) ? nombreParaMostrar
                            : "Visitante");
                    nuevo.setEmail(emailNorm);
                    nuevo.setPassword(encriptador.encode(passRandom));
                    nuevo.setRol(rolVisitante);
                    nuevo.setEstado(true);
                    return usuarioRepository.save(nuevo);
                });
    }

    /* ======================= Helpers ======================= */
    private Rol resolverRol(Long rolId, String rolNombre) {
        if (rolId != null)
            return rolRepository.findById(rolId).orElse(null);
        if (rolNombre != null && !rolNombre.isBlank())
            return rolRepository.buscarPorNombre(rolNombre.trim()).orElse(null);
        return rolRepository.buscarPorNombre("cliente").orElse(null); // default
    }

    private String normalizarEmail(String email) {
        return (email == null) ? null : email.trim().toLowerCase();
    }

    private static <T> List<T> toList(Iterable<T> it) {
        List<T> list = new ArrayList<>();
        for (T t : it) {
            list.add(t);
        }
        return list;
    }
}
