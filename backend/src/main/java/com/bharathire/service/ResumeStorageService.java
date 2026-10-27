package com.bharathire.service;

import com.bharathire.entity.CandidateProfile;
import com.bharathire.entity.Resume;
import com.bharathire.exception.BadRequestException;
import com.bharathire.exception.ResourceNotFoundException;
import com.bharathire.exception.UnauthorizedException;
import com.bharathire.repository.CandidateProfileRepository;
import com.bharathire.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeStorageService {

    private final Path fileStorageLocation;
    private final ResumeRepository resumeRepository;
    private final CandidateProfileRepository candidateProfileRepository;

    public ResumeStorageService(
            @Value("${bharathire.upload.dir:./uploads/resumes}") String uploadDir,
            ResumeRepository resumeRepository,
            CandidateProfileRepository candidateProfileRepository) {
        this.resumeRepository = resumeRepository;
        this.candidateProfileRepository = candidateProfileRepository;

        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Transactional
    public Resume storeResume(Long candidateUserId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Cannot upload empty file");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf");

        // Validate PDF extension
        if (!originalFileName.toLowerCase().endsWith(".pdf")) {
            throw new BadRequestException("Only PDF resumes are supported (.pdf)");
        }

        // Validate MIME type
        String contentType = file.getContentType();
        if (contentType != null && !contentType.equalsIgnoreCase("application/pdf") && !contentType.contains("pdf")) {
            throw new BadRequestException("Invalid file type: file must be a valid PDF document");
        }

        // Max file size: 5MB
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("File size exceeds 5MB limit");
        }

        CandidateProfile candidate = candidateProfileRepository.findByUserId(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        // Generate safe unique filename
        String storedFileName = "resume_" + candidateUserId + "_" + UUID.randomUUID() + ".pdf";

        try {
            Path targetLocation = this.fileStorageLocation.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Mark previous resumes as not primary if new one is primary
            List<Resume> existingResumes = resumeRepository.findByCandidateProfileId(candidate.getId());
            for (Resume r : existingResumes) {
                r.setIsPrimary(false);
            }
            resumeRepository.saveAll(existingResumes);

            Resume resume = new Resume(candidate, originalFileName, storedFileName, file.getSize(), "application/pdf");
            resume.setIsPrimary(true);
            return resumeRepository.save(resume);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public Resource loadResumeAsResource(Long resumeId, Long currentUserId, String userRole) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + resumeId));

        // Security check: Candidate owner or Recruiter/Admin
        boolean isOwner = resume.getCandidateProfile().getUser().getId().equals(currentUserId);
        boolean isRecruiterOrAdmin = "ROLE_RECRUITER".equals(userRole) || "ROLE_ADMIN".equals(userRole);

        if (!isOwner && !isRecruiterOrAdmin) {
            throw new UnauthorizedException("You are not authorized to view or download this resume");
        }

        try {
            Path filePath = this.fileStorageLocation.resolve(resume.getStoredFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Resume file not found on disk");
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("Resume file path is invalid");
        }
    }

    @Transactional
    public void deleteResume(Long resumeId, Long candidateUserId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + resumeId));

        if (!resume.getCandidateProfile().getUser().getId().equals(candidateUserId)) {
            throw new UnauthorizedException("You are not authorized to delete this resume");
        }

        try {
            Path filePath = this.fileStorageLocation.resolve(resume.getStoredFilePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ignored) {}

        resumeRepository.delete(resume);
    }
}
