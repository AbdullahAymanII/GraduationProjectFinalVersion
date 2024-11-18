package java.backend.service.authService;


import java.backend.dto.authentication.LoginRequest;

public interface AuthenticationService {
    String verify(LoginRequest loginRequest);
}
