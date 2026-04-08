package com.example.nhom5thu6.service;


import org.springframework.web.multipart.MultipartFile;
import com.example.nhom5thu6.dto.response.RecognitionResponse;
import com.example.nhom5thu6.dto.response.RegistrationResponse;
import java.util.List;

public interface AiService {
    RegistrationResponse registerFace(MultipartFile file);
    List<RecognitionResponse> detectFaces(MultipartFile file);
    String createFaceCollection();
}
