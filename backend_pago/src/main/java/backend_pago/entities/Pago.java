package backend_pago.entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pago")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPago;

    private String metodoPago;
    private Double total;
    private LocalDateTime fechaPago = LocalDateTime.now();

    // Relación 1:1 con Boleta (bidireccional)
    @OneToOne(mappedBy = "pago", cascade = CascadeType.ALL)
    private Boleta boleta;
}