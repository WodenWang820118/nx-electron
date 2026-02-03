package com.wodendev.springbackend.service;

import com.wodendev.springbackend.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Locale;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskService {
    private final JdbcTemplate jdbc;

    private volatile Schema schema;

    @Autowired
    public TaskService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private Schema schema() {
        Schema cached = schema;
        if (cached != null) return cached;

        synchronized (this) {
            if (schema != null) return schema;
            schema = loadSchema();
            return schema;
        }
    }

    private Schema loadSchema() {
        // Make sure the table exists for fresh DBs.
        // For existing DBs (e.g. created by other backends), we adapt to whatever columns exist.
        jdbc.execute(
                "CREATE TABLE IF NOT EXISTS tasks (" +
                        "id TEXT PRIMARY KEY, " +
                        "text TEXT NOT NULL, " +
                        "day TEXT, " +
                        "reminder INTEGER DEFAULT 0" +
                        ")"
        );

        // Discover actual columns (SQLite supports PRAGMA table_info).
        List<java.util.Map<String, Object>> columns;
        try {
            columns = jdbc.queryForList("PRAGMA table_info(tasks)");
        } catch (Exception ex) {
            // Non-SQLite fallback: assume camelCase names.
            return new Schema("createdAt", "updatedAt");
        }

        boolean hasCreatedAt = false;
        boolean hasUpdatedAt = false;
        boolean hasCreatedAtSnake = false;
        boolean hasUpdatedAtSnake = false;

        for (var row : columns) {
            Object nameObj = row.get("name");
            String name = nameObj == null ? "" : nameObj.toString();
            String lower = name.toLowerCase(Locale.ROOT);
            if (lower.equals("createdat")) hasCreatedAt = true;
            if (lower.equals("updatedat")) hasUpdatedAt = true;
            if (lower.equals("created_at")) hasCreatedAtSnake = true;
            if (lower.equals("updated_at")) hasUpdatedAtSnake = true;
        }

        // Prefer existing columns instead of adding duplicates.
        String createdColumn = hasCreatedAt ? "createdAt" : (hasCreatedAtSnake ? "created_at" : null);
        String updatedColumn = hasUpdatedAt ? "updatedAt" : (hasUpdatedAtSnake ? "updated_at" : null);

        // If neither exists, add our expected columns.
        if (createdColumn == null) {
            try {
                jdbc.execute("ALTER TABLE tasks ADD COLUMN createdAt TEXT DEFAULT CURRENT_TIMESTAMP");
                createdColumn = "createdAt";
            } catch (Exception ignored) {
                // Ignore if ALTER fails (older SQLite or permissions). We'll just omit the column.
            }
        }
        if (updatedColumn == null) {
            try {
                jdbc.execute("ALTER TABLE tasks ADD COLUMN updatedAt TEXT DEFAULT CURRENT_TIMESTAMP");
                updatedColumn = "updatedAt";
            } catch (Exception ignored) {
                // Ignore
            }
        }

        return new Schema(createdColumn, updatedColumn);
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
        if (task == null) {
            throw new IllegalArgumentException("Task must not be null");
        }

        if (!StringUtils.hasText(task.getId())) {
            task.setId(UUID.randomUUID().toString());
        }

        Schema s = schema();
        StringBuilder cols = new StringBuilder("id, text, day, reminder");
        StringBuilder vals = new StringBuilder("?, ?, ?, ?");
        if (s.createdAtColumn != null) {
            cols.append(", ").append(s.createdAtColumn);
            vals.append(", CURRENT_TIMESTAMP");
        }
        if (s.updatedAtColumn != null) {
            cols.append(", ").append(s.updatedAtColumn);
            vals.append(", CURRENT_TIMESTAMP");
        }

        String sql = "INSERT INTO tasks(" + cols + ") VALUES(" + vals + ")";
        jdbc.update(sql, task.getId(), task.getText(), task.getDay(), task.isReminder() ? 1 : 0);
        return task;
    }

    public Page<Task> findAll(Integer page, Integer limit, String search) {
        int p = (page == null || page < 1) ? 1 : page;
        int l = (limit == null || limit < 1) ? 10 : limit;
        int offset = (p - 1) * l;

        Schema s = schema();

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

        String orderBy;
        if (s.createdAtColumn != null) {
            orderBy = s.createdAtColumn;
        } else if (s.updatedAtColumn != null) {
            orderBy = s.updatedAtColumn;
        } else {
            orderBy = "id";
        }

        // Only select columns we actually map, to stay compatible with legacy schemas.
        String sql = "SELECT id, text, day, reminder FROM tasks" + where + " ORDER BY " + orderBy + " DESC LIMIT ? OFFSET ?";
        List<Task> rows = (where.isEmpty()) ? jdbc.query(sql, ROW_MAPPER, paramsRows) : jdbc.query(sql, paramsRows, ROW_MAPPER);

        return new PageImpl<>(rows, org.springframework.data.domain.PageRequest.of(p - 1, l), total);
    }

    public Optional<Task> findOne(String id) {
        String sql = "SELECT id, text, day, reminder FROM tasks WHERE id = ?";
        List<Task> list = jdbc.query(sql, new Object[]{id}, ROW_MAPPER);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public Optional<Task> update(String id, Task task) {
        Schema s = schema();
        String setUpdatedAt = (s.updatedAtColumn != null) ? (", " + s.updatedAtColumn + " = CURRENT_TIMESTAMP") : "";
        String sql = "UPDATE tasks SET text = ?, day = ?, reminder = ?" + setUpdatedAt + " WHERE id = ?";
        int updated = jdbc.update(sql, task.getText(), task.getDay(), task.isReminder() ? 1 : 0, id);
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

    private static final class Schema {
        private final String createdAtColumn;
        private final String updatedAtColumn;

        private Schema(String createdAtColumn, String updatedAtColumn) {
            this.createdAtColumn = createdAtColumn;
            this.updatedAtColumn = updatedAtColumn;
        }
    }
}
