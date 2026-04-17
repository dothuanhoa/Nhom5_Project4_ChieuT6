package com.example.nhom5thu6.user.service;

import java.util.List;
import java.util.Optional;

import com.example.nhom5thu6.user.dto.response.UserResponse;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserById(int id);
}
