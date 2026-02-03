package com.wodendev.springbackend.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private final Environment environment;

    public GlobalExceptionHandler(Environment environment) {
        this.environment = environment;
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, Object>> handleDataAccess(DataAccessException ex, HttpServletRequest request) {
        // Database/SQL issues are the most common root cause for 500s here.
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex, request, "Database error");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex, request, "Bad request");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex, request, "Internal server error");
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(
            HttpStatus status,
            Exception ex,
            HttpServletRequest request,
            String error
    ) {
        // Always log full details server-side.
        logger.error("Unhandled exception for {} {}", request.getMethod(), request.getRequestURI(), ex);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("status", status.value());
        body.put("error", error);
        body.put("path", request.getRequestURI());
        body.put("method", request.getMethod());
        body.put("exception", ex.getClass().getName());
        body.put("message", ex.getMessage());

        Throwable root = rootCause(ex);
        if (root != null && root != ex) {
            body.put("rootCause", root.getClass().getName());
            body.put("rootMessage", root.getMessage());
        }

        // In dev, include a short stack trace in the JSON response to speed up debugging.
        if (isDevProfile()) {
            body.put("trace", shortStackTrace(ex, 25));
        }

        return ResponseEntity.status(status).body(body);
    }

    private boolean isDevProfile() {
        try {
            return environment != null && environment.acceptsProfiles("dev");
        } catch (Exception ignored) {
            return false;
        }
    }

    private static Throwable rootCause(Throwable t) {
        Throwable cur = t;
        while (cur != null && cur.getCause() != null && cur.getCause() != cur) {
            cur = cur.getCause();
        }
        return cur;
    }

    private static String shortStackTrace(Throwable t, int maxLines) {
        StackTraceElement[] elements = t.getStackTrace();
        int limit = Math.min(elements.length, Math.max(0, maxLines));
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < limit; i++) {
            sb.append("at ").append(elements[i]).append('\n');
        }
        if (elements.length > limit) {
            sb.append("... ").append(elements.length - limit).append(" more");
        }
        return sb.toString();
    }
}
