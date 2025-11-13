package com.wodendev.springbackend.service;

import com.wodendev.springbackend.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final JdbcTemplate jdbc;

    @Autowired
    public TaskService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<Task> ROW_MAPPER = new RowMapper<>() {
        @Override
        public Task mapRow(ResultSet rs, int rowNum) throws SQLException {
            Task t = new Task();
            t.setId(rs.getString("id"));
            t.setText(rs.getString("text"));
            t.setDay(rs.getString("day"));
            t.setReminder(rs.getBoolean("reminder"));
            return t;
        }
    };

    public Task create(Task task) {
        String sql = "INSERT INTO tasks(id, text, day, reminder, createdAt, updatedAt) VALUES(?,?,?,?,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
        jdbc.update(sql, task.getId(), task.getText(), task.getDay(), task.isReminder());
        return task;
    }

    public Page<Task> findAll(Integer page, Integer limit, String search) {
        int p = (page == null || page < 1) ? 1 : page;
        int l = (limit == null || limit < 1) ? 10 : limit;
        int offset = (p - 1) * l;

        String where = "";
        Object[] paramsCount = new Object[]{};
        Object[] paramsRows = new Object[]{};
        if (search != null && !search.trim().isEmpty()) {
            where = " WHERE text LIKE ? ";
            String like = "%" + search.trim() + "%";
            paramsCount = new Object[]{like};
            paramsRows = new Object[]{like, l, offset};
        } else {
            paramsCount = new Object[]{};
            paramsRows = new Object[]{l, offset};
        }

        String countSql = "SELECT COUNT(*) FROM tasks" + where;
        long total = (where.isEmpty()) ? jdbc.queryForObject(countSql, Long.class) : jdbc.queryForObject(countSql, paramsCount, Long.class);

        String sql = "SELECT id, text, day, reminder, createdAt, updatedAt FROM tasks" + where + " ORDER BY createdAt DESC LIMIT ? OFFSET ?";
        List<Task> rows = (where.isEmpty()) ? jdbc.query(sql, ROW_MAPPER, paramsRows) : jdbc.query(sql, paramsRows, ROW_MAPPER);

        return new PageImpl<>(rows, org.springframework.data.domain.PageRequest.of(p - 1, l), total);
    }

    public Optional<Task> findOne(String id) {
        String sql = "SELECT id, text, day, reminder, createdAt, updatedAt FROM tasks WHERE id = ?";
        List<Task> list = jdbc.query(sql, new Object[]{id}, ROW_MAPPER);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public Optional<Task> update(String id, Task task) {
        String sql = "UPDATE tasks SET text = ?, day = ?, reminder = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?";
        int updated = jdbc.update(sql, task.getText(), task.getDay(), task.isReminder(), id);
        return updated > 0 ? findOne(id) : Optional.empty();
    }

    public boolean remove(String id) {
        String sql = "DELETE FROM tasks WHERE id = ?";
        int affected = jdbc.update(sql, id);
        return affected > 0;
    }

    public long removeByName(String name) {
        String sql = "DELETE FROM tasks WHERE text = ?";
        return jdbc.update(sql, name);
    }
}
