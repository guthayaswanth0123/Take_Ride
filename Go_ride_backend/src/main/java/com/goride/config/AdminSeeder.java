package com.goride.config;

import com.goride.enums.Enums.IsBlock;
import com.goride.enums.Enums.Role;
import com.goride.model.User;
import com.goride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email:admin@goride.com}")
    private String adminEmail;

    @Value("${admin.password:admin@123}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        try {
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = User.builder()
                        .name("Super Admin")
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .role(Role.ADMIN)
                        .isBlock(IsBlock.UNBLOCK)
                        .isDeleted(false)
                        .isVerified(true)
                        .build();

                userRepository.save(admin);
                log.info("Admin account seeded successfully: {}", adminEmail);
            } else {
                log.info("Admin account already exists.");
            }
        } catch (Exception e) {
            log.error("Error seeding admin user: ", e);
        }
    }
}
