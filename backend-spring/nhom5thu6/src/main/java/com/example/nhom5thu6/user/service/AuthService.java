package com.example.nhom5thu6.user.service;

import com.example.nhom5thu6.user.dto.request.LoginRequest;
import com.example.nhom5thu6.user.dto.request.RegisterRequest;
import com.example.nhom5thu6.user.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse authenticate(LoginRequest request); 
    String registerUser(RegisterRequest request);
}
