package com.backend.model.user;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.Id;

import com.backend.model.user.constants.AccountSource;
import com.backend.model.user.constants.Role;


@Getter
@Setter
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "source")
    @Enumerated(EnumType.STRING)
    private AccountSource source;
}
