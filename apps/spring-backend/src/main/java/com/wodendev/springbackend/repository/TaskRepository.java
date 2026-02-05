package com.wodendev.springbackend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.wodendev.springbackend.entity.Task;

public interface TaskRepository extends JpaRepository<Task, String> {
    Page<Task> findByTextContainingIgnoreCase(String text, Pageable pageable);
}
