package com.careernest.dto.request;

import com.careernest.enums.JobCategory;
import com.careernest.enums.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class JobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String location;

    @NotNull(message = "Job type is required")
    private JobType type;

    @NotNull(message = "Job category is required")
    private JobCategory category;

    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String experienceLevel;
    private String requirements;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    private LocalDateTime deadline;
}
