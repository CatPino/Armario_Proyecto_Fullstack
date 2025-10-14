package com.inventario.backend_inventario.entities;

import java.time.LocalDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nombre;

    @NotBlank
    private String descripcion;

    @NotNull
    @Positive
    private Long precio;

    @NotNull
    private Long stock;

    @NotBlank
    private String imagenUrl;

    @NotNull
    private Boolean activo = true;

    private LocalDate fechaCreacion;

    @PrePersist
    public void asignarFechaCreacion() {
        this.fechaCreacion = LocalDate.now();
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id")
    @NotNull
    private Categoria categoria;
}