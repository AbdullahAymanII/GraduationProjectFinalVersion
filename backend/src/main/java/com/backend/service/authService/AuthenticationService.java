package com.backend.service.authService;


import com.backend.dto.authentication.LoginRequest;

public interface AuthenticationService {
    String verify(LoginRequest loginRequest);
}
