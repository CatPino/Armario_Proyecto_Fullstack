package com.backend.backend_usuario.controller;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.backend_usuario.entities.Rol;
import com.backend.backend_usuario.services.RolService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class RolController {

    private final RolService rolService;

    /** 🟢 Crear un nuevo rol */
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Rol req) {
        try {
            Rol nuevo = rolService.crear(req.getNombre(), req.getDescripcion());
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /** 🟡 Listar todos los roles (con búsqueda opcional) */
    @GetMapping
    public ResponseEntity<List<Rol>> listar(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(rolService.listar(q));
    }

    /** 🔵 Obtener rol por ID */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        try {
            Rol rol = rolService.obtener(id);
            return ResponseEntity.ok(rol);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /** 🟠 Actualizar un rol existente */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Rol req) {
        try {
            Rol actualizado = rolService.actualizar(id, req.getNombre(), req.getDescripcion());
            return ResponseEntity.ok(actualizado);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /** 🔴 Eliminar un rol */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            rolService.eliminar(id);
            return ResponseEntity.noContent().build(); // 204
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}