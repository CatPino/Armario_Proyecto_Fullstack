package com.inventario.backend_inventario.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Ruta física a tu carpeta img
        String rutaImgs = Paths.get("img")
                       .toAbsolutePath()
                       .toString()
                       .replace("\\", "/");

        // Expone la URL pública /img/** -> carpeta física
        registry.addResourceHandler("/img/**")
                .addResourceLocations("file:" + rutaImgs + "/");
    }
}
