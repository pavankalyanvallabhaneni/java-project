package com.bharathire.controller;

import com.bharathire.dto.ApiResponse;
import com.bharathire.dto.JobReportRequest;
import com.bharathire.dto.JobResponse;
import com.bharathire.security.UserPrincipal;
import com.bharathire.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Jobs", description = "Public job search, filters, details, and moderation reports")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    @Operation(summary = "Search jobs with keyword, category, location, workMode, employmentType filters and pagination")
    public ResponseEntity<ApiResponse<Page<JobResponse>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String workMode,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Page<JobResponse> results = jobService.searchJobs(
                keyword, category, location, workMode, employmentType, status, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.ok("Jobs retrieved successfully", results));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed information for a single job posting")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable Long id) {
        JobResponse job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.ok("Job details retrieved", job));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get list of available job categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok("Categories retrieved", jobService.getJobCategories()));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get top featured recently posted jobs for home page")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getFeaturedJobs() {
        return ResponseEntity.ok(ApiResponse.ok("Featured jobs retrieved", jobService.getFeaturedJobs()));
    }

    @PostMapping("/{id}/report")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Report a job posting for fraudulent or inappropriate content")
    public ResponseEntity<ApiResponse<Void>> reportJob(
            @PathVariable Long id,
            @Valid @RequestBody JobReportRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        request.setJobId(id);
        jobService.reportJob(request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Job report submitted successfully. Our trust and safety team will review it."));
    }
}
