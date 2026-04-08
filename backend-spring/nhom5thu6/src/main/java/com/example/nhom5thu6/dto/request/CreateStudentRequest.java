package com.example.nhom5thu6.dto.request;

import lombok.Data;

@Data
public class CreateStudentRequest {
    private String studentCode;
    private String fullName;
    private String faceId; 
}