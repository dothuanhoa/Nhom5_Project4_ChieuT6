package com.example.nhom5thu6.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.nhom5thu6.user.dto.request.LoginRequest;
import com.example.nhom5thu6.user.dto.request.RegisterRequest;
import com.example.nhom5thu6.user.dto.response.LoginResponse;
import com.example.nhom5thu6.user.service.AuthService;
import com.example.nhom5thu6.user.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String result = authService.registerUser(request);
        if (result.startsWith("Lỗi")) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        LoginResponse loginResponse = authService.authenticate(request);
        if (loginResponse !=null) {
            return ResponseEntity.ok(loginResponse);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body("Sai tên đăng nhập hoặc mật khẩu");
    }
}
