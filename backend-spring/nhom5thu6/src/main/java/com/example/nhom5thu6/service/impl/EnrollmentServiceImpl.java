package com.example.nhom5thu6.service.impl;

import org.springframework.stereotype.Service;

import com.example.nhom5thu6.entity.CourseSection;
import com.example.nhom5thu6.entity.Enrollment;
import com.example.nhom5thu6.entity.Student;
import com.example.nhom5thu6.repository.CourseSectionRepository;
import com.example.nhom5thu6.repository.EnrollmentRepository;
import com.example.nhom5thu6.repository.StudentRepository;
import com.example.nhom5thu6.service.EnrollmentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService{
    private final EnrollmentRepository enrollmentRepository;
    private final CourseSectionRepository courseSectionRepository;
    private final StudentRepository studentRepository;


    public Enrollment enrollClass(int studentId, int classId){
        Student s = studentRepository.getReferenceById(studentId);
        CourseSection c = courseSectionRepository.getReferenceById(classId);

        Enrollment e = new Enrollment(s, c);
        return enrollmentRepository.save(e);
    }
}
