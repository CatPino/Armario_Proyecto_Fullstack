package com.inventario.backend_inventario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class BackendInventarioApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendInventarioApplication.class, args);
	}
 // ✅ Permitir acceso público a la carpeta /img/
    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/img/**")
                        .addResourceLocations("file:img/"); 
            }
        };
    }
}