package com.example.nhom5thu6.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.nhom5thu6.entity.Student;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByStudentCode(String studentCode);
}
