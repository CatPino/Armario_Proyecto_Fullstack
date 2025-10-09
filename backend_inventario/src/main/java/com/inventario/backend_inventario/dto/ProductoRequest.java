package com.inventario.backend_inventario.dto;

import jakarta.validation.constraints.*; 
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoRequest {

    @NotBlank
    private String nombre;

    private String descripcion;

    @NotNull
    private Long precio;

    @NotNull
    private Long stock;

    private String imagenUrl;

    @NotNull
    private Long categoriaId;
}
