package com.example.nhom5thu6.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.nhom5thu6.dto.response.RecognitionResponse;
import com.example.nhom5thu6.dto.response.RegistrationResponse;
import com.example.nhom5thu6.service.AiService;

import java.util.List;

@RestController
@RequestMapping(value = "ai-vision")
@CrossOrigin(origins = "*")
public class AiController {
    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping(value = "register")
    public ResponseEntity<RegistrationResponse> registerFace(@RequestParam("image") MultipartFile image) {
        return ResponseEntity.ok(aiService.registerFace(image));
    }

    @PostMapping(value = "identify")
    public ResponseEntity<List<RecognitionResponse>> identifyFaces(@RequestParam("image") MultipartFile image) {
        return ResponseEntity.ok(aiService.detectFaces(image));
    }
    @GetMapping(value = "setup-collection")
    public String setupAwsCollection() {
        return aiService.createFaceCollection();
    }
}