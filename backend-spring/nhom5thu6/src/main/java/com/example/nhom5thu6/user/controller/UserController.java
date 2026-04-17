package com.example.nhom5thu6.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.nhom5thu6.user.dto.response.UserResponse;
import com.example.nhom5thu6.user.entity.User;
import com.example.nhom5thu6.user.service.UserService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;
    @GetMapping
    public List<UserResponse> getAllUsers() {
        return service.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponse getAllUsers(@PathVariable int id) {
        return service.getUserById(id);
    }
}
