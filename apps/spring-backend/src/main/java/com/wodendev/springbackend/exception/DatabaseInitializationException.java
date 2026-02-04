package com.wodendev.springbackend.exception;

public class DatabaseInitializationException extends RuntimeException {
    private final String errorCode;
    private final String databasePath;

    public DatabaseInitializationException(String errorCode, String databasePath, String message) {
        super(message);
        this.errorCode = errorCode;
        this.databasePath = databasePath;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getDatabasePath() {
        return databasePath;
    }
}
