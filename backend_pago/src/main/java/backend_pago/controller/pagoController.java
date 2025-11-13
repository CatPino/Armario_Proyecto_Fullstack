package backend_pago.controller;

import backend_pago.dto.PagoRequest;
import backend_pago.entities.Boleta;
import backend_pago.entities.DetalleBoleta;
import backend_pago.entities.Pago;
import backend_pago.service.pagoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pago")
@CrossOrigin(origins = "http://localhost:5173")
public class pagoController {

    @Autowired
    private pagoService pagoService;

    @PostMapping("/crear")
    public Pago crearPago(@RequestBody PagoRequest request) {
        // Crear Pago
        Pago pago = new Pago();
        pago.setMetodoPago(request.getMetodoPago());
        pago.setTotal(request.getTotal());

        // Crear Boleta
        Boleta boleta = new Boleta();
        boleta.setNombreCliente(request.getNombreCliente());
        boleta.setCorreoCliente(request.getCorreoCliente());
        boleta.setDireccionCliente(request.getDireccionCliente());

        // Mapear Detalles desde DTO
        List<DetalleBoleta> detalles = request.getDetalles().stream().map(d -> {
            DetalleBoleta detalle = new DetalleBoleta();
            detalle.setProducto(d.getProducto());
            detalle.setCantidad(d.getCantidad());
            detalle.setPrecioUnitario(d.getPrecioUnitario());
            detalle.setSubtotal(d.getSubtotal());
            return detalle;
        }).collect(Collectors.toList());

        return pagoService.crearPago(pago, boleta, detalles);
    }

    @GetMapping("/listar")
    public List<Pago> listarPagos() {
        return pagoService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Pago obtenerPago(@PathVariable Long id) {
        return pagoService.obtenerPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminarPago(@PathVariable Long id) {
        pagoService.eliminarPago(id);
    }
}