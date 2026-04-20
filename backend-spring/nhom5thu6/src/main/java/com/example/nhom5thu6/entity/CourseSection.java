package com.example.nhom5thu6.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "course_sections")
@Data
public class CourseSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "course_code", columnDefinition = "varchar(255)", nullable = false)
    private String courseCode;

    @Column(name = "course_name", columnDefinition = "varchar(255)", nullable = false)
    private String courseName;

    @Column(name = "group_number", columnDefinition = "varchar(255)", nullable = false)
    private String groupNumber;
}
