package com.example.nhom5thu6.user.dto.request;

import com.example.nhom5thu6.user.entity.enums.RoleEnum;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class RegisterRequest {
    private String username;
    private String password;
    private RoleEnum role;     // Ví dụ: "admin", "teacher"
    private String fullName;
}
