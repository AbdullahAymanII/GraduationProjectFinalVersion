package com.backend;

import com.backend.controller.authentication.SignInController;
import com.backend.dto.authentication.LoginRequest;
import com.backend.dto.authentication.LoginResponse;
import com.backend.exception.authenticaionException.InvalidCredentialsException;
import com.backend.exception.userException.UserNotFoundException;
import com.backend.service.authService.AuthenticationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SignInControllerTest {

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private SignInController signInController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void signIn_ShouldReturnOkResponse_WhenCredentialsAreValid() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("user@example.com", "password123");
        String token = "validToken";

        when(authenticationService.verify(loginRequest)).thenReturn(token);

        // Act
        ResponseEntity<LoginResponse> response = signInController.signIn(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(token, response.getBody().getToken());
        assertEquals("Login successful", response.getBody().getMessage());

        verify(authenticationService, times(1)).verify(loginRequest);
    }

    @Test
    void signIn_ShouldReturnUnauthorizedResponse_WhenCredentialsAreInvalid() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("user@example.com", "wrongPassword");

        when(authenticationService.verify(loginRequest)).thenThrow(new InvalidCredentialsException("Invalid credentials"));

        // Act
        ResponseEntity<LoginResponse> response = signInController.signIn(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNull(response.getBody().getToken());
        assertEquals("Invalid credentials", response.getBody().getMessage());

        verify(authenticationService, times(1)).verify(loginRequest);
    }

    @Test
    void signIn_ShouldReturnNotFoundResponse_WhenUserDoesNotExist() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("nonexistent@example.com", "password123");

        when(authenticationService.verify(loginRequest)).thenThrow(new UserNotFoundException("User not found with email: nonexistent@example.com"));

        // Act
        ResponseEntity<LoginResponse> response = signInController.signIn(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNull(response.getBody().getToken());
        assertEquals("User not found with email: nonexistent@example.com", response.getBody().getMessage());

        verify(authenticationService, times(1)).verify(loginRequest);
    }

    @Test
    void signIn_ShouldReturnInternalServerError_WhenUnexpectedErrorOccurs() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("user@example.com", "password123");

        when(authenticationService.verify(loginRequest)).thenThrow(new RuntimeException("Unexpected error"));

        // Act
        ResponseEntity<LoginResponse> response = signInController.signIn(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNull(response.getBody().getToken());
        assertEquals("Login failed, please try again", response.getBody().getMessage());

        verify(authenticationService, times(1)).verify(loginRequest);
    }
}
