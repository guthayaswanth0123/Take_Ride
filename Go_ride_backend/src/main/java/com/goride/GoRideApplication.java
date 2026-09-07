package com.goride;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoAuditing
@EnableMongoRepositories(basePackages = "com.goride.repository")
public class GoRideApplication {

    public static void main(String[] args) {
        SpringApplication.run(GoRideApplication.class, args);
    }
}
