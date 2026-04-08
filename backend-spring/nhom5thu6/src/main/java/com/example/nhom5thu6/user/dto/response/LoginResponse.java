package com.example.nhom5thu6.user.dto.response;

import com.example.nhom5thu6.user.entity.enums.RoleEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    String token;
    RoleEnum role;
    String fullName; 
}
