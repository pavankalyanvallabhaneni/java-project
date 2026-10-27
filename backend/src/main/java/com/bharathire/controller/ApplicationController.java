package com.bharathire.controller;

import com.bharathire.dto.ApiResponse;
import com.bharathire.dto.ApplicationRequest;
import com.bharathire.dto.ApplicationResponse;
import com.bharathire.dto.ApplicationStatusUpdateRequest;
import com.bharathire.security.UserPrincipal;
import com.bharathire.service.ApplicationService;
import com.bharathire.service.ResumeStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Applications", description = "Application lifecycle management, status transitions, and timeline history")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final ResumeStorageService resumeStorageService;

    public ApplicationController(ApplicationService applicationService, ResumeStorageService resumeStorageService) {
        this.applicationService = applicationService;
        this.resumeStorageService = resumeStorageService;
    }

    @PostMapping("/apply")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Apply for a published job posting")
    public ResponseEntity<ApiResponse<ApplicationResponse>> apply(
            @Valid @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ApplicationResponse response = applicationService.apply(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Application submitted successfully!", response));
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Get application history for logged-in candidate")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getCandidateApplications(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ApplicationResponse> list = applicationService.getCandidateApplications(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Applications retrieved", list));
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get all applications for recruiter's jobs")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getRecruiterApplications(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ApplicationResponse> list = applicationService.getRecruiterApplications(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Applications retrieved", list));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Get applicants for a specific job")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getJobApplicants(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getRole().name().equals("ROLE_ADMIN");
        List<ApplicationResponse> list = applicationService.getJobApplications(jobId, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Job applicants retrieved", list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get application details and status progression timeline")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getApplicationDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ApplicationResponse response = applicationService.getApplicationDetails(id, currentUser.getId(), currentUser.getRole().name());
        return ResponseEntity.ok(ApiResponse.ok("Application details retrieved", response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Update applicant status (Applied, Under Review, Shortlisted, Interview Scheduled, Selected, Rejected)")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getRole().name().equals("ROLE_ADMIN");
        ApplicationResponse response = applicationService.updateStatus(id, request, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Applicant status updated to " + response.getCurrentStatus(), response));
    }

    @PostMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(summary = "Withdraw an active job application")
    public ResponseEntity<ApiResponse<Void>> withdraw(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        applicationService.withdrawApplication(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Application has been withdrawn successfully."));
    }

    @GetMapping("/resume/{resumeId}/download")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Authorized download of candidate PDF resume")
    public ResponseEntity<Resource> downloadResume(
            @PathVariable Long resumeId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Resource resource = resumeStorageService.loadResumeAsResource(resumeId, currentUser.getId(), currentUser.getRole().name());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
