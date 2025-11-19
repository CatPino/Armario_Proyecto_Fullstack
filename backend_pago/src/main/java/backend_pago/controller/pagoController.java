package backend_pago.controller;

import backend_pago.entities.Pago;
import backend_pago.service.pagoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pago")
@CrossOrigin(origins = "http://localhost:5173")
public class pagoController {

    @Autowired
    private pagoService pagoService;

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