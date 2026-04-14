package com.careernest.dto.response;

import com.careernest.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class ApplicationResponse {
    private Long id;
    private ApplicationStatus status;
    private String coverLetter;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    // User info
    private Long userId;
    private String userName;
    private String userEmail;

    // Job info
    private Long jobId;
    private String jobTitle;
    private String companyName;
}
