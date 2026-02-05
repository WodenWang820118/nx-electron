package com.wodendev.springbackend.exception;

public class DatabaseOperationException extends RuntimeException {
    private final String errorCode;
    private final String operation;

    public DatabaseOperationException(String errorCode, String operation, Throwable cause) {
        super(cause == null ? null : cause.getMessage(), cause);
        this.errorCode = errorCode;
        this.operation = operation;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getOperation() {
        return operation;
    }
}
