package com.example.nhom5thu6.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.nhom5thu6.dto.request.CreateEnrollmentRequest;
import com.example.nhom5thu6.entity.CourseSection;
import com.example.nhom5thu6.entity.Enrollment;
import com.example.nhom5thu6.service.EnrollmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/enrollment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<Enrollment> addStudentToClass(@RequestBody CreateEnrollmentRequest request ) {
        return ResponseEntity.ok(enrollmentService.enrollClass(request.studentId(), request.classId()));
    }
}
