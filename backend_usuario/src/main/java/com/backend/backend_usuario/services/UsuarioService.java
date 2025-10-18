package com.backend.backend_usuario.services;

import java.util.List;

import com.backend.backend_usuario.dto.SolicitudActualizarUsuario;
import com.backend.backend_usuario.dto.SolicitudCrearUsuario;
import com.backend.backend_usuario.entities.Usuario;

public interface UsuarioService {
    Usuario crear(SolicitudCrearUsuario req);
    Usuario obtenerPorId(Long id);
    List<Usuario> listarTodos();
    Usuario actualizar(Long id, SolicitudActualizarUsuario req);
    void eliminar(Long id);
    Usuario desactivar(Long id);
    List<Usuario> listarActivos();
    List<Usuario> listarInactivos();
}


