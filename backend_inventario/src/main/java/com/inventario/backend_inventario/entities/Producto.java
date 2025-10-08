package com.inventario.backend_inventario.entities;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Producto {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String descripcion;
    private Long precio;
    private Long stock;
    private String imagenUrl;
    private Boolean activo = true;
    private LocalDate fechaCreacion;

    @PrePersist
    public void asignarFechaCreacion() {
        this.fechaCreacion = LocalDate.now();
    }
    
    @ManyToOne
    @JoinColumn(name="categoria_id")
    @JsonBackReference
    private Categoria categoria;

}
