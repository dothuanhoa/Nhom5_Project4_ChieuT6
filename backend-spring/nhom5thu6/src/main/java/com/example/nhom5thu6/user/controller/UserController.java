package com.example.nhom5thu6.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.nhom5thu6.user.entity.User;
import com.example.nhom5thu6.user.service.UserService;

import lombok.RequiredArgsConstructor;

import java.net.http.HttpResponse;
import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;
    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }
}
