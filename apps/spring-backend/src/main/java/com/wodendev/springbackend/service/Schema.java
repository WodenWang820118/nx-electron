package com.wodendev.springbackend.service;

import com.wodendev.springbackend.exception.DatabaseExceptionHelper;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Data
public class Schema implements InitializingBean {
    private String createdAtColumn;
    private String updatedAtColumn;

    private final JdbcTemplate jdbc;
    private final Environment env;
    private boolean isSQLite;

    @Override
    public void afterPropertiesSet() {
        this.isSQLite = env.getProperty("spring.datasource.url", "").startsWith("jdbc:sqlite:");
        ensureTasksTableExists();
        detectAndMigrateColumns();
    }

    private void ensureTasksTableExists() {
        try {
            jdbc.execute(
                    "CREATE TABLE IF NOT EXISTS tasks (" +
                            "id VARCHAR(64) PRIMARY KEY, " +
                            "text VARCHAR(255) NOT NULL, " +
                            "\"day\" VARCHAR(255), " +
                            "reminder INTEGER DEFAULT 0, " +
                            "\"createdAt\" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                            "\"updatedAt\" TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                            ")"
            );
        } catch (DataAccessException ex) {
            if (isSQLite) {
                throw DatabaseExceptionHelper.schemaInvalid(resolveDatabasePath(), "Failed to initialize SQLite schema");
            }
            throw ex;
        }
    }

    private void detectAndMigrateColumns() {
        List<java.util.Map<String, Object>> columns;
        try {
            columns = jdbc.queryForList("PRAGMA table_info(tasks)");
        } catch (Exception ex) {
            if (isSQLite) {
                throw DatabaseExceptionHelper.schemaInvalid(resolveDatabasePath(), "Failed to read SQLite schema information");
            }
            this.createdAtColumn = "createdAt";
            this.updatedAtColumn = "updatedAt";
            return;
        }

        Set<String> names = columns.stream()
                .map(row -> row.get("name"))
                .filter(Objects::nonNull)
                .map(Object::toString)
                .map(s -> s.toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());

        String createdColumn = names.contains("createdat") ? "createdAt" : (names.contains("created_at") ? "created_at" : null);
        String updatedColumn = names.contains("updatedat") ? "updatedAt" : (names.contains("updated_at") ? "updated_at" : null);

        if (createdColumn == null) {
            try {
                jdbc.execute("ALTER TABLE tasks ADD COLUMN createdAt TEXT DEFAULT CURRENT_TIMESTAMP");
                createdColumn = "createdAt";
            } catch (Exception e) {
                if (isSQLite) {
                    throw DatabaseExceptionHelper.migrationFailed(resolveDatabasePath(), "Failed to add createdAt column");
                }
            }
        }

        if (updatedColumn == null) {
            try {
                jdbc.execute("ALTER TABLE tasks ADD COLUMN updatedAt TEXT DEFAULT CURRENT_TIMESTAMP");
                updatedColumn = "updatedAt";
            } catch (Exception e) {
                if (isSQLite) {
                    throw DatabaseExceptionHelper.migrationFailed(resolveDatabasePath(), "Failed to add updatedAt column");
                }
            }
        }

        this.createdAtColumn = createdColumn;
        this.updatedAtColumn = updatedColumn;
    }

    private String resolveDatabasePath() {
        String databasePath = env.getProperty("DATABASE_PATH");
        if (databasePath != null && !databasePath.isBlank()) {
            return databasePath;
        }
        String url = env.getProperty("spring.datasource.url", "");
        if (url.startsWith("jdbc:sqlite:")) {
            return url.substring("jdbc:sqlite:".length());
        }
        return "unknown";
    }
}
