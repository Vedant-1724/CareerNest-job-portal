package com.careernest.entity;

import com.careernest.enums.RoleName;
import jakarta.persistence.*;
import lombok.*;

/**
 * Role entity — defines authorization levels (USER, RECRUITER, ADMIN).
 */
@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 20)
    private RoleName name;
}
