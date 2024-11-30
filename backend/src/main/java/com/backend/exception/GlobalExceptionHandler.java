package com.backend.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.backend.exception.authenticaionException.InvalidCredentialsException;
import com.backend.exception.userException.UserNotFoundException;
import java.nio.file.FileAlreadyExistsException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleUserNotFoundException(UserNotFoundException ex) {
        logger.warn("User not found: {}", ex.getMessage(), ex);
        return createErrorResponse("User Not Found", ex.getMessage(), "USER_NOT_FOUND");
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, String> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        logger.warn("Invalid credentials attempt: {}", ex.getMessage(), ex);
        return createErrorResponse("Invalid Credentials", ex.getMessage(), "INVALID_CREDENTIALS");
    }

    @ExceptionHandler(FileAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleFileAlreadyExistsException(FileAlreadyExistsException ex) {
        logger.warn("File already exists: {}", ex.getMessage(), ex);
        return createErrorResponse("File Already Exists", ex.getMessage(), "FILE_ALREADY_EXISTS");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleGeneralException(Exception ex) {
        logger.error("An internal server error occurred: {}", ex.getMessage(), ex);

        return createErrorResponse(
                "Internal Server Error",
                "An unexpected error occurred." + " Please try again later.",
                "INTERNAL_SERVER_ERROR"
        );
    }

    private Map<String, String> createErrorResponse(String error, String message, String code) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", error);
        errorResponse.put("message", message);
        errorResponse.put("code", code);
        return errorResponse;
    }
}
