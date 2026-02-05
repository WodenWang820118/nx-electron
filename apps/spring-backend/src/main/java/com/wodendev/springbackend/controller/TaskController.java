package com.wodendev.springbackend.controller;

import com.wodendev.springbackend.entity.Task;
import com.wodendev.springbackend.service.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.HashMap;
import java.util.Map;

@RestController
public class TaskController {
    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/tasks")
    public ResponseEntity<Map<String, Object>> getTasks(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String search
    ) {
        Page<Task> result = taskService.findAll(page, limit, search);

        Map<String, Object> resp = new HashMap<>();
        resp.put("data", result.getContent());
        resp.put("total", result.getTotalElements());
        int currentPage = (page == null || page < 1) ? 1 : page;
        int pageSize = (limit == null || limit < 1) ? result.getSize() : limit;
        resp.put("page", currentPage);
        resp.put("limit", pageSize);
        resp.put("totalPages", result.getTotalPages());

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<Task> getTask(@PathVariable String id) {
        return taskService.findOne(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/tasks/create")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task created = taskService.create(task);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task task) {
        return taskService.update(id, task)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Map<String, Object>> deleteTask(@PathVariable String id) {
        boolean removed = taskService.remove(id);
        Map<String, Object> resp = Map.of("affected", removed ? 1 : 0);
        return ResponseEntity.ok(resp);
    }
}
