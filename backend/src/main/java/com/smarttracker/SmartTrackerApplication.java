package com.smarttracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartTrackerApplication.class, args);
        System.out.println("==============================================");
        System.out.println(" Smart User Behavior Tracking System Started!");
        System.out.println(" Swagger UI: http://localhost:8080/swagger-ui.html");
        System.out.println(" H2 Console: http://localhost:8080/h2-console");
        System.out.println(" Default Login: admin@system.com / Admin@123");
        System.out.println("==============================================");
    }
}
