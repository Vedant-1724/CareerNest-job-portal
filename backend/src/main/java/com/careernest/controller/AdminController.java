package com.careernest.controller;

import com.careernest.dto.response.PagedResponse;
import com.careernest.dto.response.UserResponse;
import com.careernest.enums.ApplicationStatus;
import com.careernest.repository.ApplicationRepository;
import com.careernest.repository.CompanyRepository;
import com.careernest.repository.JobRepository;
import com.careernest.repository.UserRepository;
import com.careernest.service.JobService;
import com.careernest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Admin-only endpoints for platform management.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final JobService jobService;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;

    /**
     * Get platform-wide statistics.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("activeJobs", jobRepository.countByActiveTrue());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("totalCompanies", companyRepository.count());
        stats.put("appliedCount", applicationRepository.countByStatus(ApplicationStatus.APPLIED));
        stats.put("shortlistedCount", applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED));
        stats.put("acceptedCount", applicationRepository.countByStatus(ApplicationStatus.ACCEPTED));
        stats.put("rejectedCount", applicationRepository.countByStatus(ApplicationStatus.REJECTED));
        return ResponseEntity.ok(stats);
    }

    /**
     * List all users with pagination.
     */
    @GetMapping("/users")
    public ResponseEntity<PagedResponse<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userService.getAllUsers(page, size));
    }

    /**
     * Delete a user.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete/moderate a job listing.
     */
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}
