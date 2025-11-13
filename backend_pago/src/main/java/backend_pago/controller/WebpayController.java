package backend_pago.controller;

import backend_pago.dto.DetalleBoletaRequest;
import backend_pago.dto.PagoRequest;
import backend_pago.entities.Boleta;
import backend_pago.entities.DetalleBoleta;
import backend_pago.entities.Pago;
import backend_pago.service.pagoService;
import cl.transbank.common.IntegrationType;
import cl.transbank.webpay.common.WebpayOptions;
import cl.transbank.webpay.exception.TransactionCreateException;
import cl.transbank.webpay.webpayplus.WebpayPlus;
import cl.transbank.webpay.webpayplus.responses.WebpayPlusTransactionCommitResponse;
import cl.transbank.webpay.webpayplus.responses.WebpayPlusTransactionCreateResponse;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/webpay")
@CrossOrigin(origins = "http://localhost:5173")
public class WebpayController {

    private final pagoService pagoService;
    private final WebpayPlus.Transaction transaction;
    private final Map<String, PagoRequest> pagosPendientes = new HashMap<>();

    public WebpayController(pagoService pagoService) {
        this.pagoService = pagoService;

        // Configuración de Webpay en ambiente de pruebas
        WebpayOptions options = new WebpayOptions(
                "597055555532", // Código de comercio
                "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
                IntegrationType.TEST
        );

        this.transaction = new WebpayPlus.Transaction(options);
    }

    // 🧾 1. Crear transacción Webpay
        @PostMapping("/crear")
        public Map<String, Object> crearTransaccion(@RequestBody PagoRequest request) {
            Map<String, Object> response = new HashMap<>();

            try {
        String buyOrder = "ORD-" + UUID.randomUUID().toString().substring(0, 8);
        String sessionId = UUID.randomUUID().toString();
        String returnUrl = "http://localhost:8083/api/webpay/confirmar";

        // Validar monto total
        if (request.getTotal() == null || request.getTotal() <= 0) {
            throw new IllegalArgumentException("El monto total del pago no puede ser nulo o menor o igual a 0");
        }

        // Guardar temporalmente los datos del pago antes de confirmar
        pagosPendientes.put(sessionId, request);

        // Convertir el total a entero (Webpay solo acepta montos enteros en pesos chilenos)
        int monto = (int) Math.round(request.getTotal());

        // Crear la transacción
        WebpayPlusTransactionCreateResponse tx = transaction.create(
                buyOrder,
                sessionId,
                monto,
                returnUrl
        );

        response.put("url", tx.getUrl() + "?token_ws=" + tx.getToken());
        response.put("token", tx.getToken());
        response.put("mensaje", "Transacción creada correctamente");

    } catch (TransactionCreateException e) {
        e.printStackTrace();
        response.put("error", "Error al crear transacción Webpay: " + e.getMessage());
    } catch (Exception e) {
        e.printStackTrace();
        response.put("error", "Error inesperado: " + e.getMessage());
    }

    return response;
}

    // 💳 2. Confirmar pago Webpay
    @GetMapping("/confirmar")
    public Boleta confirmarPago(@RequestParam("token_ws") String token) {
        try {
            WebpayPlusTransactionCommitResponse commit = transaction.commit(token);
            String sessionId = commit.getSessionId();

            // Buscar el pago pendiente
            PagoRequest request = pagosPendientes.get(sessionId);
            if (request == null)
                throw new RuntimeException("Pago no encontrado en sesión");

            // Crear entidad Pago
            Pago pago = new Pago();
            pago.setMetodoPago("WEBPAY");
            pago.setTotal(request.getTotal());
            pago.setFechaPago(java.time.LocalDateTime.now());

            // Crear boleta asociada
            Boleta boleta = new Boleta();
            boleta.setNombreCliente(request.getNombreCliente());
            boleta.setCorreoCliente(request.getCorreoCliente());
            boleta.setDireccionCliente(request.getDireccionCliente());
            boleta.setPago(pago);

            // Crear los detalles
            List<DetalleBoleta> detalles = new ArrayList<>();
            for (DetalleBoletaRequest d : request.getDetalles()) {
                DetalleBoleta detalle = new DetalleBoleta();
                detalle.setProducto(d.getProducto());
                detalle.setCantidad(d.getCantidad());
                detalle.setPrecioUnitario(d.getPrecioUnitario());
                detalle.setBoleta(boleta);
                detalles.add(detalle);
            }

            boleta.setDetalles(detalles);
            pago.setBoleta(boleta);

            // Guardar todo con el servicio
            pagoService.crearPago(pago, boleta, detalles);

            // Limpiar sesión
            pagosPendientes.remove(sessionId);

            return boleta;

        } catch (Exception e) {
            throw new RuntimeException("Error al confirmar pago: " + e.getMessage());
        }
    }
}