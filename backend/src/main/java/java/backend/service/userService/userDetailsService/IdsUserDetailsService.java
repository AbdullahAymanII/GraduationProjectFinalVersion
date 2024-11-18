package java.backend.service.userService.userDetailsService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.backend.exception.userException.UserNotFoundException;
import java.backend.model.user.CustomUserDetails;
import java.backend.model.user.User;
import java.backend.repository.user.UserRepository;
import java.util.Optional;

@Service
public class IdsUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UserNotFoundException {
        Optional<User> user = userRepo.findOneByEmail(username);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User with email '" + username + "' not found");
        }
        return new CustomUserDetails(user.get());
    }

}
