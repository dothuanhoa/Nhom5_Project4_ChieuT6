package com.example.nhom5thu6.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.nhom5thu6.dto.request.CreateStudentRequest;
import com.example.nhom5thu6.entity.Student;
import com.example.nhom5thu6.service.StudentService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "students")
@CrossOrigin(origins = "*")
public class StudentController {
    
    private final StudentService studentService;

    // Khởi tạo Constructor
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.findAll());
    }

    @GetMapping(value = "{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Integer id) {
        Optional<Student> student = studentService.findById(id);
        return student.map(o -> ResponseEntity.ok(o)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody CreateStudentRequest request) {
        Student item = new Student();
        item.setStudentCode(request.getStudentCode());
        item.setFullName(request.getFullName());
        item.setFaceId(request.getFaceId()); 
        
        return ResponseEntity.ok(studentService.save(item));
    }

    @PutMapping(value = "{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Integer id, @RequestBody CreateStudentRequest request) {
        Optional<Student> existingStudent = studentService.findById(id);
        if (existingStudent.isPresent()) {
            Student item = existingStudent.get();
            item.setStudentCode(request.getStudentCode());
            item.setFullName(request.getFullName());
            item.setFaceId(request.getFaceId());
            
            return ResponseEntity.ok(studentService.save(item));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping(value = "{id}")
    public ResponseEntity deleteStudent(@PathVariable Integer id) {
        studentService.delete(id);
        return ResponseEntity.ok().build();
    }
}
