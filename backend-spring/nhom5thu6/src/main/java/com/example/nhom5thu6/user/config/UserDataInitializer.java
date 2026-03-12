package com.example.nhom5thu6.user.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.example.nhom5thu6.user.entity.User;
import com.example.nhom5thu6.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Profile("seed-data")
public class UserDataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        userRepository.saveAll(List.of(
            User.builder().name("Đỗ Thuận Hòa").mssv("DH52200694").build(),
            User.builder().name("Trần Thanh Hoài Phúc").mssv("DH52201258").build(),
            User.builder().name("Võ Văn Sỹ").mssv("DH52201379").build(),
            User.builder().name("Phan Vũ Linh").mssv("DH52200988").build(),
            User.builder().name("Nguyễn Huy Hoàng Anh").mssv("DH52200330").build()
        ));
    }
}