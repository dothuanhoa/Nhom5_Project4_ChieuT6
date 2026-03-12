package com.example.nhom5thu6.user.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.nhom5thu6.user.entity.User;
import com.example.nhom5thu6.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {
    private final UserRepository repository;
    


    @Override
    public List<User> getAllUsers() {
        return repository.findAll();
    }

}
