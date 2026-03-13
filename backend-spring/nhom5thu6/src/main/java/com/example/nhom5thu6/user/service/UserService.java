package com.example.nhom5thu6.user.service;

import java.util.List;

import com.example.nhom5thu6.user.entity.User;

public interface UserService {
    List<User> getAllUsers();
    User createUser(User user);

}
