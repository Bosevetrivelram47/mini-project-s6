package com.smarttracker.dto.request;

import com.smarttracker.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateTaskRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    private String description;
    private Task.Priority priority = Task.Priority.MEDIUM;
    private LocalDate dueDate;
}
