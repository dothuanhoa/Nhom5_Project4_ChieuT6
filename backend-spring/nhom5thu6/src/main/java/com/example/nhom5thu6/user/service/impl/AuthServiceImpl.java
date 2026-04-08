package com.example.nhom5thu6.user.service.impl;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.nhom5thu6.user.dto.request.LoginRequest;
import com.example.nhom5thu6.user.dto.request.RegisterRequest;
import com.example.nhom5thu6.user.dto.response.LoginResponse;
import com.example.nhom5thu6.user.entity.User;
import com.example.nhom5thu6.user.repository.UserRepository;
import com.example.nhom5thu6.user.service.AuthService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class AuthServiceImpl implements AuthService{

    private final UserRepository userRepository;
    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    @Value("${jwt.expiration.millis}")
    private int EXPIRATION_TIME;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }



    @Override
    public LoginResponse authenticate(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername());
        if (user != null && BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
            String token = Jwts.builder()
                .setSubject(request.getUsername())
                .claim("role", user.getRole())
                .claim("fullName", user.getFullName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
            return new LoginResponse(token, user.getRole(), user.getFullName());
        }
        return null;
    }



    @Override
    public String registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return "Lỗi: Tên đăng nhập đã tồn tại!";
        }
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setRole(request.getRole());
        newUser.setFullName(request.getFullName());
        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());
        newUser.setPassword(hashedPassword);
        userRepository.save(newUser);
        return "Thành công: Đã tạo tài khoản!";
    }

}
