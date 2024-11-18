package java.backend.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.backend.model.user.User;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findOneByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.username = :username")
    User findOneByUsername(@Param("username") String username);
}