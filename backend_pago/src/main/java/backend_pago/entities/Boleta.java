package backend_pago.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "boleta")
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idBoleta;

    private String nombreCliente;
    private String correoCliente;
    private String direccionCliente;
    private LocalDateTime fechaEmision = LocalDateTime.now();

    // Relación 1:1 con Pago
    @OneToOne
    @JoinColumn(name = "pago_id", referencedColumnName = "idPago")
    private Pago pago;

    // Relación 1:N con DetalleBoleta
    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleBoleta> detalles;
}