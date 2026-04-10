package com.example.nhom5thu6.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.nhom5thu6.entity.CourseSection;
import com.example.nhom5thu6.entity.Student;
import com.example.nhom5thu6.repository.CourseSectionRepository;
import com.example.nhom5thu6.service.StudentService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/classes")
public class CourseSectionController {
    private final CourseSectionRepository courseSectionRepository;
    private final StudentService studentService;
    
    public CourseSectionController(CourseSectionRepository courseSectionRepository, StudentService studentService) {
        this.courseSectionRepository = courseSectionRepository;
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<CourseSection>> getCourses() {
        return ResponseEntity.ok(courseSectionRepository.findAll());
    }
    
    @GetMapping("/{id}/students")
    public ResponseEntity<List<Student>> getStudentInCourse(@PathVariable int id) {
        List<Student> students = studentService.findByCourseId(id);
        if (students != null) {
            return ResponseEntity.ok(students);
        }
        return ResponseEntity.notFound().build();
        
    }
    
    
}
