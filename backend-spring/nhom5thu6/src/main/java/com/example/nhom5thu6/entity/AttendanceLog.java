package com.example.nhom5thu6.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_logs")
@Data
public class AttendanceLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_section_id", nullable = false)
    private CourseSection courseSection;

    @Column(name = "attendance_date")
    private LocalDate attendanceDate;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "similarity_score")
    private Float similarityScore;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(columnDefinition = "varchar(255)")
    private String status;

    @Column(name = "image_proof_url", columnDefinition = "varchar(255)")
    private String imageProofUrl;
}