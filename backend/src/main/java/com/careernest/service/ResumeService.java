package com.careernest.service;

import com.careernest.dto.response.ResumeResponse;
import com.careernest.entity.Resume;
import com.careernest.entity.User;
import com.careernest.exception.BadRequestException;
import com.careernest.exception.ResourceNotFoundException;
import com.careernest.repository.ResumeRepository;
import com.careernest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    /**
     * Upload a resume PDF for the current user.
     */
    @Transactional
    public ResumeResponse uploadResume(Long userId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new BadRequestException("Only PDF files are allowed");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Delete old resume if exists
            resumeRepository.findByUserId(userId).ifPresent(existing -> {
                try {
                    Files.deleteIfExists(Paths.get(existing.getFilePath()));
                } catch (IOException e) {
                    // Log but don't fail
                }
                resumeRepository.delete(existing);
            });

            Resume resume = Resume.builder()
                    .user(user)
                    .fileName(file.getOriginalFilename())
                    .filePath(targetLocation.toString())
                    .fileType(contentType)
                    .fileSize(file.getSize())
                    .build();

            resumeRepository.save(resume);
            return mapToResponse(resume);

        } catch (IOException e) {
            throw new BadRequestException("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Get resume info for the current user.
     */
    @Transactional(readOnly = true)
    public ResumeResponse getMyResume(Long userId) {
        Resume resume = resumeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "userId", userId));
        return mapToResponse(resume);
    }

    /**
     * Download a resume file.
     */
    @Transactional(readOnly = true)
    public Resource downloadResume(Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", resumeId));

        try {
            Path filePath = Paths.get(resume.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Resume file", "id", resumeId);
            }
        } catch (MalformedURLException e) {
            throw new BadRequestException("Invalid file path");
        }
    }

    private ResumeResponse mapToResponse(Resume resume) {
        return ResumeResponse.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .fileType(resume.getFileType())
                .fileSize(resume.getFileSize())
                .uploadedAt(resume.getUploadedAt())
                .build();
    }
}
