package com.backend.service.userService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.backend.model.user.User;
import java.util.Optional;

public interface UserService {
    void createUser(User user);
    Optional<User> findUserByEmail(String email);
    User findUserByUsername(String username);
    User getUser(Authentication authentication) throws UsernameNotFoundException;
}
