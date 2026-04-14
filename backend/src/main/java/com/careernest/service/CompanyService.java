package com.careernest.service;

import com.careernest.dto.request.CompanyRequest;
import com.careernest.dto.response.CompanyResponse;
import com.careernest.entity.Company;
import com.careernest.entity.User;
import com.careernest.exception.BadRequestException;
import com.careernest.exception.ResourceNotFoundException;
import com.careernest.repository.CompanyRepository;
import com.careernest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    @Transactional
    public CompanyResponse createCompany(Long recruiterId, CompanyRequest request) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", recruiterId));

        Company company = Company.builder()
                .name(request.getName())
                .description(request.getDescription())
                .website(request.getWebsite())
                .logoUrl(request.getLogoUrl())
                .location(request.getLocation())
                .industry(request.getIndustry())
                .companySize(request.getCompanySize())
                .createdBy(recruiter)
                .build();

        companyRepository.save(company);

        // Link recruiter to company
        recruiter.setCompany(company);
        userRepository.save(recruiter);

        return mapToResponse(company);
    }

    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));
        return mapToResponse(company);
    }

    @Transactional
    public CompanyResponse updateCompany(Long recruiterId, Long companyId, CompanyRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        if (!company.getCreatedBy().getId().equals(recruiterId)) {
            throw new BadRequestException("You can only update your own company");
        }

        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setWebsite(request.getWebsite());
        company.setLogoUrl(request.getLogoUrl());
        company.setLocation(request.getLocation());
        company.setIndustry(request.getIndustry());
        company.setCompanySize(request.getCompanySize());

        companyRepository.save(company);
        return mapToResponse(company);
    }

    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CompanyResponse> getCompaniesByRecruiter(Long recruiterId) {
        return companyRepository.findByCreatedById(recruiterId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CompanyResponse mapToResponse(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .website(company.getWebsite())
                .logoUrl(company.getLogoUrl())
                .location(company.getLocation())
                .industry(company.getIndustry())
                .companySize(company.getCompanySize())
                .jobCount(company.getJobs() != null ? company.getJobs().size() : 0)
                .createdAt(company.getCreatedAt())
                .build();
    }
}
