package com.wodendev.springbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class SpringBackendApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(SpringBackendApplication.class);
    
    @Autowired
    private Environment environment;
    
    public static void main(String[] args) {
        SpringApplication.run(SpringBackendApplication.class, args);
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        String port = environment.getProperty("server.port", "8080");
        logger.info("Spring Backend Application is running on port: {}", port);
        logger.info("Application URL: http://localhost:{}", port);
    }
}
