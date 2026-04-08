package com.example.nhom5thu6.service;

import java.util.List;
import java.util.Optional;

import com.example.nhom5thu6.entity.Student;

public interface StudentService {
    List<Student> findAll();
    
    Optional<Student> findById(Integer id);
    
    Student save(Student student);
    
    void delete(Integer id);

    List<Student> findByCourseId(int courseId);
}
