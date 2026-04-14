package com.careernest.controller;

import com.careernest.dto.request.ApplicationRequest;
import com.careernest.dto.response.ApplicationResponse;
import com.careernest.dto.response.PagedResponse;
import com.careernest.enums.ApplicationStatus;
import com.careernest.security.UserPrincipal;
import com.careernest.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Application endpoints — apply to jobs and manage applications.
 */
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/{jobId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApplicationResponse> applyToJob(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long jobId,
            @Valid @RequestBody(required = false) ApplicationRequest request) {
        if (request == null) request = new ApplicationRequest();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.applyToJob(principal.getId(), jobId, request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PagedResponse<ApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(applicationService.getUserApplications(principal.getId(), page, size));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<PagedResponse<ApplicationResponse>> getJobApplications(
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(applicationService.getJobApplications(jobId, page, size));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status));
    }
}
