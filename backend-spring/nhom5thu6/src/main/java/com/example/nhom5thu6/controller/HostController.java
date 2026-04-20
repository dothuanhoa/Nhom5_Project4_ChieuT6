package com.example.nhom5thu6.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class HostController {
    @GetMapping
    public String host(){
        return "Spring api";
    }
}
