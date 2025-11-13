package com.wodendev.springbackend.config;

import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@Configuration
public class DataSourceConfig {
    
    private boolean isSQLite = false;
    
    @Bean
    public DataSource dataSource(Environment env) {
        String configuredUrl = env.getProperty("spring.datasource.url");

        if (configuredUrl != null && configuredUrl.startsWith("jdbc:sqlite:")) {
            isSQLite = true;
            DriverManagerDataSource ds = new DriverManagerDataSource();
            ds.setDriverClassName("org.sqlite.JDBC");
            ds.setUrl(configuredUrl);
            return ds;
        }

        // Try to locate database.sqlite3 in common repo-root locations (cwd, parent, parent's parent,...)
        List<Path> candidates = List.of(
                Paths.get("database.sqlite3"),
                Paths.get("../database.sqlite3"),
                Paths.get("../../database.sqlite3"),
                Paths.get("../../../database.sqlite3")
        );

        for (Path p : candidates) {
            Path abs = p.toAbsolutePath().normalize();
            if (Files.exists(abs)) {
                isSQLite = true;
                String url = "jdbc:sqlite:" + abs.toString();
                DriverManagerDataSource ds = new DriverManagerDataSource();
                ds.setDriverClassName("org.sqlite.JDBC");
                ds.setUrl(url);
                return ds;
            }
        }

        // Fallback to configured datasource (H2 in-memory)
        // Use default H2 if no datasource URL is configured
        isSQLite = false;
        String fallbackUrl = configuredUrl != null ? configuredUrl : "jdbc:h2:mem:springdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE";
        DriverManagerDataSource ds = new DriverManagerDataSource();
        ds.setDriverClassName(env.getProperty("spring.datasource.driver-class-name", "org.h2.Driver"));
        ds.setUrl(fallbackUrl);
        ds.setUsername(env.getProperty("spring.datasource.username", "sa"));
        ds.setPassword(env.getProperty("spring.datasource.password", ""));
        return ds;
    }
    
    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer() {
        return (hibernateProperties) -> {
            if (isSQLite) {
                hibernateProperties.put("hibernate.dialect", "org.hibernate.community.dialect.SQLiteDialect");
            }
        };
    }
}
