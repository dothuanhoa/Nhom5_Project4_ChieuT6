package com.example.nhom5thu6.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.nhom5thu6.entity.Student;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByStudentCode(String studentCode);

    @Query("SELECT e.student FROM Enrollment e WHERE e.courseSection.id = :courseId")
    List<Student> findStudentsByCourseId(@Param("courseId") int courseId);
}
