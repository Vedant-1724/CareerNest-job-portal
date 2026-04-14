package com.careernest.dto.response;

import com.careernest.enums.JobCategory;
import com.careernest.enums.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private JobType type;
    private JobCategory category;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String experienceLevel;
    private String requirements;
    private Boolean active;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;

    // Nested info
    private String companyName;
    private Long companyId;
    private String companyLogoUrl;
    private String postedByName;
    private Long postedById;
    private int applicationCount;
}
