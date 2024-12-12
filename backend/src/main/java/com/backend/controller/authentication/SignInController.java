package com.backend.controller.authentication;


import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.authentication.LoginRequest;
import com.backend.dto.authentication.LoginResponse;
import com.backend.exception.authenticaionException.InvalidCredentialsException;
import com.backend.exception.userException.UserNotFoundException;
import com.backend.service.authService.AuthenticationService;


@RestController
@CrossOrigin
@RequestMapping("/api")
public class SignInController {



    private final AuthenticationService authenticationService;

    public SignInController(@Qualifier("AuthenticationServiceImpl") AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/sign-in")
    public ResponseEntity<LoginResponse> signIn(@RequestBody LoginRequest loginRequest) {
        try {
            String token = authenticationService.verify(loginRequest);
            return buildResponse(token, "Login successful", HttpStatus.OK);
        } catch (InvalidCredentialsException e) {
            return buildResponse(null, e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (UserNotFoundException e) {
            return buildResponse(null, e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildResponse(null, "Login failed, please try again", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    private ResponseEntity<LoginResponse> buildResponse(String token, String message, HttpStatus status) {
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setMessage(message);
        return new ResponseEntity<>(response, status);
    }
}
