package com.example.nhom5thu6.user.dto.response;

import com.example.nhom5thu6.user.entity.enums.RoleEnum;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    String fullName;
    RoleEnum role;
}
