package com.wodendev.springbackend.repository;

import com.wodendev.springbackend.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, String> {
    Page<Task> findByTextContainingIgnoreCase(String text, Pageable pageable);
}
