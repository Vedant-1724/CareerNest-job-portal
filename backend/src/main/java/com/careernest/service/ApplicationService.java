package com.careernest.service;

import com.careernest.dto.request.ApplicationRequest;
import com.careernest.dto.response.ApplicationResponse;
import com.careernest.dto.response.PagedResponse;
import com.careernest.entity.Application;
import com.careernest.entity.Job;
import com.careernest.entity.User;
import com.careernest.enums.ApplicationStatus;
import com.careernest.exception.BadRequestException;
import com.careernest.exception.ResourceNotFoundException;
import com.careernest.repository.ApplicationRepository;
import com.careernest.repository.JobRepository;
import com.careernest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    /**
     * Apply to a job.
     */
    @Transactional
    public ApplicationResponse applyToJob(Long userId, Long jobId, ApplicationRequest request) {
        if (applicationRepository.existsByUserIdAndJobId(userId, jobId)) {
            throw new BadRequestException("You have already applied to this job");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!job.getActive()) {
            throw new BadRequestException("This job is no longer accepting applications");
        }

        Application application = Application.builder()
                .user(user)
                .job(job)
                .coverLetter(request.getCoverLetter())
                .build();

        applicationRepository.save(application);
        return mapToResponse(application);
    }

    /**
     * Get all applications for the current user.
     */
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationResponse> getUserApplications(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> appPage = applicationRepository.findByUserId(userId, pageable);
        return buildPagedResponse(appPage);
    }

    /**
     * Get all applications for a specific job (recruiter).
     */
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationResponse> getJobApplications(Long jobId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> appPage = applicationRepository.findByJobId(jobId, pageable);
        return buildPagedResponse(appPage);
    }

    /**
     * Update application status (recruiter).
     */
    @Transactional
    public ApplicationResponse updateStatus(Long applicationId, ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        application.setStatus(status);
        applicationRepository.save(application);
        return mapToResponse(application);
    }

    private PagedResponse<ApplicationResponse> buildPagedResponse(Page<Application> appPage) {
        var apps = appPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ApplicationResponse>builder()
                .content(apps)
                .page(appPage.getNumber())
                .size(appPage.getSize())
                .totalElements(appPage.getTotalElements())
                .totalPages(appPage.getTotalPages())
                .last(appPage.isLast())
                .build();
    }

    private ApplicationResponse mapToResponse(Application app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .status(app.getStatus())
                .coverLetter(app.getCoverLetter())
                .appliedAt(app.getAppliedAt())
                .updatedAt(app.getUpdatedAt())
                .userId(app.getUser().getId())
                .userName(app.getUser().getFirstName() + " " + app.getUser().getLastName())
                .userEmail(app.getUser().getEmail())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .companyName(app.getJob().getCompany().getName())
                .build();
    }
}
