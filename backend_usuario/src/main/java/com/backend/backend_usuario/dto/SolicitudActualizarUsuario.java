package com.backend.backend_usuario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record SolicitudActualizarUsuario(
    @Size(min = 2, max = 120)
    String nombre,

    @Email
    @Size(max = 180)
    String email,

    @Size(min = 8, max = 100)
    String password,

    Long rolId,
    String rolNombre,
    Boolean estado
) {}