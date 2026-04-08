package com.example.nhom5thu6.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegistrationResponse {
    private String faceId;
    private String s3Url;
}
