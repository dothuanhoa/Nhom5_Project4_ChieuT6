package com.example.nhom5thu6.service.impl;

import org.springframework.stereotype.Service;

import com.example.nhom5thu6.entity.Student;
import com.example.nhom5thu6.repository.StudentRepository;
import com.example.nhom5thu6.service.StudentService;

import java.util.List;
import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {
    
    private final StudentRepository studentRepository;

    // Giống y hệt cách bạn viết BlogServiceimpl
    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public Optional<Student> findById(Integer id) {
        return studentRepository.findById(id);
    }

    public Student save(Student student) {
        return studentRepository.save(student);
    }

    public void delete(Integer id) {
        studentRepository.deleteById(id);
    }
}
