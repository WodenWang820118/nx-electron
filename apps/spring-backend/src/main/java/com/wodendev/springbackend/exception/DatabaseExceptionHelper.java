package com.wodendev.springbackend.exception;

import org.springframework.dao.DataAccessException;

public final class DatabaseExceptionHelper {
    private DatabaseExceptionHelper() {
    }

    public static DatabaseOperationException wrapOperation(
            String defaultCode,
            String operation,
            DataAccessException ex
    ) {
        if (isConnectionFailed(ex)) {
            return new DatabaseOperationException("DB_CONNECTION_FAILED", operation, ex);
        }
        if (isDatabaseLocked(ex)) {
            return new DatabaseOperationException("DB_LOCKED", operation, ex);
        }
        return new DatabaseOperationException(defaultCode, operation, ex);
    }

    public static DatabaseInitializationException schemaInvalid(String databasePath, String message) {
        return new DatabaseInitializationException("DB_SCHEMA_INVALID", databasePath, message);
    }

    public static DatabaseInitializationException migrationFailed(String databasePath, String message) {
        return new DatabaseInitializationException("DB_MIGRATION_FAILED", databasePath, message);
    }

    private static boolean isDatabaseLocked(DataAccessException ex) {
        Throwable cause = ex.getMostSpecificCause();
        String message = cause == null ? ex.getMessage() : cause.getMessage();
        if (message == null) return false;
        String lower = message.toLowerCase();
        return lower.contains("database is locked")
                || lower.contains("sqlite_busy")
                || lower.contains("database locked");
    }

    private static boolean isConnectionFailed(DataAccessException ex) {
        Throwable cause = ex.getMostSpecificCause();
        String message = cause == null ? ex.getMessage() : cause.getMessage();
        if (message == null) return false;
        String lower = message.toLowerCase();
        return lower.contains("connection refused")
                || lower.contains("could not open")
                || lower.contains("unable to open database file")
                || lower.contains("no suitable driver")
                || lower.contains("connection is closed")
                || lower.contains("connection failed");
    }
}
