package com.bharathire.controller;

import com.bharathire.dto.ApiResponse;
import com.bharathire.dto.CandidateProfileDto;
import com.bharathire.dto.InterviewResponse;
import com.bharathire.dto.JobResponse;
import com.bharathire.entity.CandidateEducation;
import com.bharathire.entity.CandidateExperience;
import com.bharathire.entity.CandidateSkill;
import com.bharathire.entity.Resume;
import com.bharathire.security.UserPrincipal;
import com.bharathire.service.CandidateService;
import com.bharathire.service.RecruiterService;
import com.bharathire.service.ResumeStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/candidate")
@PreAuthorize("hasRole('CANDIDATE')")
@Tag(name = "Candidate", description = "Candidate profile, skills, education, experience, resumes, and saved jobs")
public class CandidateController {

    private final CandidateService candidateService;
    private final ResumeStorageService resumeStorageService;
    private final RecruiterService recruiterService;

    public CandidateController(
            CandidateService candidateService,
            ResumeStorageService resumeStorageService,
            RecruiterService recruiterService) {
        this.candidateService = candidateService;
        this.resumeStorageService = resumeStorageService;
        this.recruiterService = recruiterService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current candidate profile")
    public ResponseEntity<ApiResponse<CandidateProfileDto>> getProfile(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok("Profile retrieved", candidateService.getProfile(user.getId())));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update candidate profile")
    public ResponseEntity<ApiResponse<CandidateProfileDto>> updateProfile(
            @RequestBody CandidateProfileDto dto,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", candidateService.updateProfile(user.getId(), dto)));
    }

    @PostMapping("/skills")
    @Operation(summary = "Add candidate skill")
    public ResponseEntity<ApiResponse<CandidateProfileDto>> addSkill(
            @RequestBody CandidateSkill skill,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok("Skill added", candidateService.addSkill(user.getId(), skill)));
    }

    @DeleteMapping("/skills/{id}")
    @Operation(summary = "Delete candidate skill")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user) {
        candidateService.deleteSkill(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Skill removed"));
    }

    @PostMapping("/education")
    @Operation(summary = "Add candidate education record")
    public ResponseEntity<ApiResponse<CandidateProfileDto>> addEducation(
            @RequestBody CandidateEducation edu,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok("Education record added", candidateService.addEducation(user.getId(), edu)));
    }

    @DeleteMapping("/education/{id}")
    @Operation(summary = "Delete candidate education record")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user) {
        candidateService.deleteEducation(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Education record removed"));
    }

    @PostMapping("/experience")
    @Operation(summary = "Add candidate experience record")
    public ResponseEntity<ApiResponse<CandidateProfileDto>> addExperience(
            @RequestBody CandidateExperience exp,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok("Experience record added", candidateService.addExperience(user.getId(), exp)));
    }

    @DeleteMapping("/experience/{id}")
    @Operation(summary = "Delete candidate experience record")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user) {
        candidateService.deleteExperience(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Experience record removed"));
    }

    @PostMapping(value = "/resumes/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload PDF resume (Max 5MB)")
    public ResponseEntity<ApiResponse<Resume>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal user) {
        Resume resume = resumeStorageService.storeResume(user.getId(), file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Resume uploaded successfully", resume));
    }

    @DeleteMapping("/resumes/{id}")
    @Operation(summary = "Delete candidate resume")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user) {
        resumeStorageService.deleteResume(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Resume deleted"));
    }

    @GetMapping("/saved-jobs")
    @Operation(summary = "Get list of candidate's saved/bookmarked jobs")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getSavedJobs(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok("Saved jobs retrieved", candidateService.getSavedJobs(user.getId())));
    }

    @PostMapping("/saved-jobs/{jobId}")
    @Operation(summary = "Save/bookmark a job")
    public ResponseEntity<ApiResponse<Void>> saveJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserPrincipal user) {
        candidateService.saveJob(user.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.ok("Job saved to your bookmarks"));
    }

    @DeleteMapping("/saved-jobs/{jobId}")
    @Operation(summary = "Remove a job from saved/bookmarked jobs")
    public ResponseEntity<ApiResponse<Void>> unsaveJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserPrincipal user) {
        candidateService.unsaveJob(user.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.ok("Job removed from saved"));
    }

    @GetMapping("/interviews")
    @Operation(summary = "Get scheduled interviews for candidate")
    public ResponseEntity<ApiResponse<List<InterviewResponse>>> getCandidateInterviews(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok("Scheduled interviews retrieved", recruiterService.getCandidateInterviews(user.getId())));
    }
}
