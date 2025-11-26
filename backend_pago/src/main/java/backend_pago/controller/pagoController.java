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
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
public class pagoController {

    @Autowired
    private pagoService pagoService;

    @RequestMapping(value = "/confirmar", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> preflight() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/confirmar")
    public ResponseEntity<Map<String, Object>> confirmarPago(@RequestBody PagoRequest request) {

        // ===== CREAR PAGO =====
        Pago pago = new Pago();
        pago.setMetodoPago(request.getMetodoPago());

        // ===== CREAR BOLETA =====
        Boleta boleta = new Boleta();
        boleta.setNombreCliente(request.getNombreCliente());
        boleta.setCorreoCliente(request.getCorreoCliente());
        boleta.setTelefonoCliente(request.getTelefonoCliente());

        boleta.setDireccionCliente(
                request.getDireccionCliente() + " " +
                request.getComunaCliente() + " " +
                request.getRegionCliente()
        );

        boleta.setIndicacionesEnvio(request.getIndicacionesEnvio());
        boleta.setPago(pago);

        List<DetalleBoleta> detalles = new ArrayList<>();
        double subtotal = 0.0;

        for (var d : request.getDetalles()) {

            DetalleBoleta det = new DetalleBoleta();
            det.setProducto(d.getProducto());
            det.setCantidad(d.getCantidad());
            det.setPrecioUnitario(d.getPrecioUnitario());
            det.setImagenUrl(d.getImagenUrl());

            // Cálculo
            double sub = d.getCantidad() * d.getPrecioUnitario();
            det.setSubtotal(sub);
            subtotal += sub;

            det.setBoleta(boleta);
            detalles.add(det);
        }

        // ===== CALCULAR TOTALES =====
        double iva = Math.round(subtotal * 0.19);
        double total = subtotal + iva;

        pago.setSubtotal(subtotal);
        pago.setIva(iva);
        pago.setTotal(total);

        boleta.setDetalles(detalles);
        pago.setBoleta(boleta);

        Pago pagoGuardado = pagoService.crearPago(pago, boleta, detalles);

        Map<String, Object> response = new HashMap<>();
        response.put("pago", pagoGuardado);
        response.put("boleta", pagoGuardado.getBoleta());

        return ResponseEntity.ok(response);
    }

 
    @GetMapping
    public ResponseEntity<List<Pago>> obtenerTodosLosPagos() {
        return ResponseEntity.ok(pagoService.obtenerTodos());
    }
}
