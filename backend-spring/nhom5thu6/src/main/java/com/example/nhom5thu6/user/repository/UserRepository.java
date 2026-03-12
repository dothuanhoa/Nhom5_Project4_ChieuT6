package com.example.nhom5thu6.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.nhom5thu6.user.entity.User;

public interface UserRepository extends JpaRepository<User, Integer>{
    
}
