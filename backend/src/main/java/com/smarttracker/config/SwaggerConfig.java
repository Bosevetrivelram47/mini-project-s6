package com.smarttracker.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.*;
import io.swagger.v3.oas.models.security.*;
import org.springframework.context.annotation.*;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI smartTrackerOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Smart User Behavior Tracking System API")
                .description("RESTful API for tracking user behavior, tasks, assignments, and notifications")
                .version("1.0.0")
                .contact(new Contact().name("Smart Tracker Team").email("admin@system.com")))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .components(new Components()
                .addSecuritySchemes("bearerAuth", new SecurityScheme()
                    .name("bearerAuth")
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }
}
