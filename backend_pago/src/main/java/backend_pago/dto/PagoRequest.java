package backend_pago.dto;

import java.util.List;
import lombok.Data;

@Data
public class PagoRequest {
    private String nombreCliente;
    private String correoCliente;
    private String direccionCliente;
    private Double total;
    private String metodoPago;
    private List<DetalleBoletaRequest> detalles;
}