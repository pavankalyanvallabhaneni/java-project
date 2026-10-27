package com.bharathire.controller;

import com.bharathire.dto.*;
import com.bharathire.security.UserPrincipal;
import com.bharathire.service.JobService;
import com.bharathire.service.RecruiterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiter")
@PreAuthorize("hasRole('RECRUITER')")
@Tag(name = "Recruiter", description = "Recruiter company profile, job postings, candidate management, and analytics")
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final JobService jobService;

    public RecruiterController(RecruiterService recruiterService, JobService jobService) {
        this.recruiterService = recruiterService;
        this.jobService = jobService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get recruiter and company profile details")
    public ResponseEntity<ApiResponse<RecruiterProfileDto>> getProfile(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok("Profile retrieved", recruiterService.getProfile(user.getId())));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update recruiter and company details")
    public ResponseEntity<ApiResponse<RecruiterProfileDto>> updateProfile(
            @RequestBody RecruiterProfileDto dto,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", recruiterService.updateProfile(user.getId(), dto)));
    }

    @GetMapping("/jobs")
    @Operation(summary = "Get all jobs posted by the logged-in recruiter")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getMyJobs(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok("Jobs retrieved", jobService.getRecruiterJobs(user.getId())));
    }

    @PostMapping("/jobs")
    @Operation(summary = "Create and publish a new job posting")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @Valid @RequestBody JobCreateRequest request,
            @AuthenticationPrincipal UserPrincipal user) {
        JobResponse created = jobService.createJob(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Job posted successfully!", created));
    }

    @PutMapping("/jobs/{id}")
    @Operation(summary = "Update an existing job posting")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobCreateRequest request,
            @AuthenticationPrincipal UserPrincipal user) {
        JobResponse updated = jobService.updateJob(id, request, user.getId(), false);
        return ResponseEntity.ok(ApiResponse.ok("Job updated successfully", updated));
    }

    @DeleteMapping("/jobs/{id}")
    @Operation(summary = "Delete or archive a job posting")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user) {
        jobService.deleteJob(id, user.getId(), false);
        return ResponseEntity.ok(ApiResponse.ok("Job deleted successfully"));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get recruitment pipeline analytics and statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok("Analytics retrieved", recruiterService.getRecruiterAnalytics(user.getId())));
    }

    @PostMapping("/interviews")
    @Operation(summary = "Schedule candidate interview round")
    public ResponseEntity<ApiResponse<InterviewResponse>> scheduleInterview(
            @Valid @RequestBody InterviewScheduleRequest request,
            @AuthenticationPrincipal UserPrincipal user) {
        InterviewResponse response = recruiterService.scheduleInterview(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Interview scheduled successfully", response));
    }

    @GetMapping("/interviews")
    @Operation(summary = "List all scheduled interviews for recruiter")
    public ResponseEntity<ApiResponse<List<InterviewResponse>>> getInterviews(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok("Interviews retrieved", recruiterService.getRecruiterInterviews(user.getId())));
    }
}
