package com.wodendev.springbackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {
    @GetMapping
    public Map<String, String> check() {
        return Map.of(
                "status", "ok",
                "message", "Backend is up and running"
        );
    }
}
