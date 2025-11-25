package backend_pago.controller;

import backend_pago.dto.PagoRequest;
import backend_pago.entities.Boleta;
import backend_pago.entities.DetalleBoleta;
import backend_pago.entities.Pago;
import backend_pago.service.pagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    private pagoService pagoService;

    @RequestMapping(value = "/confirmar", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> preflight() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/confirmar")
    public ResponseEntity<Boleta> confirmarPago(@RequestBody PagoRequest request) {

        Pago pago = new Pago();
        pago.setMetodoPago(request.getMetodoPago());
        pago.setTotal(request.getTotal());

        Boleta boleta = new Boleta();
        boleta.setNombreCliente(request.getNombreCliente());
        boleta.setCorreoCliente(request.getCorreoCliente());
        boleta.setTelefonoCliente(request.getTelefonoCliente());
        boleta.setDireccionCliente(
                request.getDireccionCliente() + ", " +
                request.getComunaCliente() + ", " +
                request.getRegionCliente()
        );
        boleta.setIndicacionesEnvio(request.getIndicacionesEnvio());
        boleta.setPago(pago);

        List<DetalleBoleta> detalles = new ArrayList<>();
        for (var d : request.getDetalles()) {
            DetalleBoleta det = new DetalleBoleta();
            det.setProducto(d.getProducto());
            det.setCantidad(d.getCantidad());
            det.setPrecioUnitario(d.getPrecioUnitario());
            det.setSubtotal(d.getSubtotal());
            det.setBoleta(boleta);
            detalles.add(det);
        }

        boleta.setDetalles(detalles);
        pago.setBoleta(boleta);

        Pago pagoGuardado = pagoService.crearPago(pago, boleta, detalles);

        Boleta boletaReal = pagoGuardado.getBoleta();
        return ResponseEntity.ok(boletaReal);
    }
}
