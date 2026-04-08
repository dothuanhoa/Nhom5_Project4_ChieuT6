package com.example.nhom5thu6.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecognitionResponse {
    private String faceId;
    private Float similarity;
}