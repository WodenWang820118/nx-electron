package com.wodendev.springbackend.config;

import com.wodendev.springbackend.exception.DatabaseInitializationException;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Configuration
public class DataSourceConfig {
    
    private boolean isSQLite = false;
    
    @Bean
    public DataSource dataSource(Environment env) {
        String configuredUrl = env.getProperty("spring.datasource.url");
        String databasePath = env.getProperty("DATABASE_PATH");

        if (databasePath != null && !databasePath.isBlank()) {
            Path dbPath = Paths.get(databasePath).toAbsolutePath().normalize();
            
            // Create the database file if it doesn't exist (SQLite will handle this)
            // but check if the parent directory exists and is writable
            if (!Files.exists(dbPath)) {
                Path parentDir = dbPath.getParent();
                if (parentDir != null && !Files.exists(parentDir)) {
                    throw new DatabaseInitializationException(
                            "DB_FILE_NOT_FOUND",
                            dbPath.toString(),
                            "Parent directory does not exist for database file"
                    );
                }
                if (parentDir != null && !Files.isWritable(parentDir)) {
                    throw new DatabaseInitializationException(
                            "DB_PERMISSION_DENIED",
                            dbPath.toString(),
                            "Cannot create database file (parent directory not writable)"
                    );
                }
            } else {
                // File exists, check permissions
                if (!Files.isReadable(dbPath) || !Files.isWritable(dbPath)) {
                    throw new DatabaseInitializationException(
                            "DB_PERMISSION_DENIED",
                            dbPath.toString(),
                            "SQLite database file is not readable/writable"
                    );
                }
            }

            isSQLite = true;
            DriverManagerDataSource ds = new DriverManagerDataSource();
            ds.setDriverClassName("org.sqlite.JDBC");
            ds.setUrl("jdbc:sqlite:" + dbPath.toString());
            return ds;
        }

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
            if (!Files.isReadable(abs) || !Files.isWritable(abs)) {
                throw new DatabaseInitializationException(
                    "DB_PERMISSION_DENIED",
                    abs.toString(),
                    "SQLite database file is not readable/writable"
                );
            }
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
    @DependsOn("dataSource")
    public JpaVendorAdapter jpaVendorAdapter() {
        HibernateJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
        if (isSQLite) {
            adapter.setDatabasePlatform("org.hibernate.community.dialect.SQLiteDialect");
        }
        return adapter;
    }
}
