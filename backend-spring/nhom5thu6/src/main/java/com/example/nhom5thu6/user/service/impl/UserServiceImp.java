package com.example.nhom5thu6.user.service.impl;

import java.io.FileNotFoundException;
import java.lang.module.ModuleDescriptor.Builder;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.nhom5thu6.user.dto.response.UserResponse;
import com.example.nhom5thu6.user.entity.User;
import com.example.nhom5thu6.user.exception.ResourceNotFoundException;
import com.example.nhom5thu6.user.repository.UserRepository;
import com.example.nhom5thu6.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {
    private final UserRepository userRepository;

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users =  userRepository.findAll();
        return users.stream()
                    .map(user -> (
                        new UserResponse(
                            user.getFullName(),
                            user.getRole()
                        )
                    )).collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(int id) {
        return userRepository.findById(id)
            .map(user ->(
                new UserResponse(user.getFullName(), user.getRole())
            ))
            .orElseThrow(()-> new ResourceNotFoundException("Không tìm được user"));
    }


}
