package com.example.nhom5thu6.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ErrorResponse {
    private int status;
    private String message;
    private long timestamp = System.currentTimeMillis();
    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }
    
}
