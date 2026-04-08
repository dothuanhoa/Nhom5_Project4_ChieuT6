package com.example.nhom5thu6.user.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.nhom5thu6.user.entity.User;
import com.example.nhom5thu6.user.repository.UserRepository;
import com.example.nhom5thu6.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {
    private final UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

}
