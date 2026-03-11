package com.expensemanager.exception;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        Throwable cause = ex.getCause();
        String message =
                (cause != null && cause.getMessage() != null && !cause.getMessage().isEmpty())
                        ? cause.getMessage()
                        : ex.getMessage();
        return ResponseEntity.badRequest().body(Map.of("message", message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        String message = ex.getMessage();
        return ResponseEntity.badRequest().body(Map.of("message", message));
    }
}


