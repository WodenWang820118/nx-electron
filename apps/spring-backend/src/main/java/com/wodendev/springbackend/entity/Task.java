package com.wodendev.springbackend.entity;

import jakarta.persistence.*;
import lombok.Data;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "tasks")
public class Task {
    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "text", nullable = false)
    private String text;

    @Column(name = "day")
    private String day;

    @Column(name = "reminder")
    private boolean reminder;

    @CreationTimestamp
    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;
}
