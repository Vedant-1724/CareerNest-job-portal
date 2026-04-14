package com.careernest.service;

import com.careernest.dto.request.JobRequest;
import com.careernest.dto.response.JobResponse;
import com.careernest.dto.response.PagedResponse;
import com.careernest.entity.Company;
import com.careernest.entity.Job;
import com.careernest.entity.User;
import com.careernest.enums.JobCategory;
import com.careernest.enums.JobType;
import com.careernest.exception.BadRequestException;
import com.careernest.exception.ResourceNotFoundException;
import com.careernest.repository.CompanyRepository;
import com.careernest.repository.JobRepository;
import com.careernest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    /**
     * Create a new job posting (recruiter only).
     */
    @Transactional
    public JobResponse createJob(Long recruiterId, JobRequest request) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", recruiterId));

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));

        // Verify recruiter owns the company
        if (!company.getCreatedBy().getId().equals(recruiterId)) {
            throw new BadRequestException("You can only post jobs for your own company");
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .type(request.getType())
                .category(request.getCategory())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .experienceLevel(request.getExperienceLevel())
                .requirements(request.getRequirements())
                .company(company)
                .postedBy(recruiter)
                .deadline(request.getDeadline())
                .build();

        jobRepository.save(job);
        return mapToResponse(job);
    }

    /**
     * Update an existing job posting.
     */
    @Transactional
    public JobResponse updateJob(Long recruiterId, Long jobId, JobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!job.getPostedBy().getId().equals(recruiterId)) {
            throw new BadRequestException("You can only update your own job postings");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setType(request.getType());
        job.setCategory(request.getCategory());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setRequirements(request.getRequirements());
        job.setDeadline(request.getDeadline());

        jobRepository.save(job);
        return mapToResponse(job);
    }

    /**
     * Delete a job posting (recruiter owner or admin).
     */
    @Transactional
    public void deleteJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        jobRepository.delete(job);
    }

    /**
     * Get a single job by ID.
     */
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        return mapToResponse(job);
    }

    /**
     * List all active jobs with pagination.
     */
    @Transactional(readOnly = true)
    public PagedResponse<JobResponse> getAllActiveJobs(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Page<Job> jobPage = jobRepository.findByActiveTrue(pageable);
        return buildPagedResponse(jobPage);
    }

    /**
     * Get jobs posted by a specific recruiter.
     */
    @Transactional(readOnly = true)
    public PagedResponse<JobResponse> getJobsByRecruiter(Long recruiterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobPage = jobRepository.findByPostedById(recruiterId, pageable);
        return buildPagedResponse(jobPage);
    }

    /**
     * Advanced job search with filters.
     */
    @Transactional(readOnly = true)
    public PagedResponse<JobResponse> searchJobs(String keyword, String location, JobType type,
                                                  JobCategory category, BigDecimal minSalary,
                                                  String experienceLevel, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobPage = jobRepository.searchJobs(keyword, location, type, category,
                minSalary, experienceLevel, pageable);
        return buildPagedResponse(jobPage);
    }

    private PagedResponse<JobResponse> buildPagedResponse(Page<Job> jobPage) {
        var jobs = jobPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<JobResponse>builder()
                .content(jobs)
                .page(jobPage.getNumber())
                .size(jobPage.getSize())
                .totalElements(jobPage.getTotalElements())
                .totalPages(jobPage.getTotalPages())
                .last(jobPage.isLast())
                .build();
    }

    public JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .type(job.getType())
                .category(job.getCategory())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .experienceLevel(job.getExperienceLevel())
                .requirements(job.getRequirements())
                .active(job.getActive())
                .deadline(job.getDeadline())
                .createdAt(job.getCreatedAt())
                .companyName(job.getCompany().getName())
                .companyId(job.getCompany().getId())
                .companyLogoUrl(job.getCompany().getLogoUrl())
                .postedByName(job.getPostedBy().getFirstName() + " " + job.getPostedBy().getLastName())
                .postedById(job.getPostedBy().getId())
                .applicationCount(job.getApplications() != null ? job.getApplications().size() : 0)
                .build();
    }
}
