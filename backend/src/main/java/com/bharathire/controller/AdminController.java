package com.bharathire.controller;

import com.bharathire.dto.ApiResponse;
import com.bharathire.dto.PlatformStatsDto;
import com.bharathire.entity.AuditLog;
import com.bharathire.entity.Company;
import com.bharathire.entity.JobReport;
import com.bharathire.entity.User;
import com.bharathire.security.UserPrincipal;
import com.bharathire.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Platform administration, user management, company verification, moderation, and audits")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get platform-wide statistics for admin dashboard")
    public ResponseEntity<ApiResponse<PlatformStatsDto>> getPlatformStats() {
        return ResponseEntity.ok(ApiResponse.ok("Platform stats retrieved", adminService.getPlatformStats()));
    }

    @GetMapping("/users")
    @Operation(summary = "Get paginated user accounts")
    public ResponseEntity<ApiResponse<Page<User>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved", adminService.getAllUsers(pageable)));
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Update user status (ACTIVE, SUSPENDED)")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal admin) {
        String status = body.getOrDefault("status", "ACTIVE");
        User updated = adminService.updateUserStatus(id, status, admin.getId());
        return ResponseEntity.ok(ApiResponse.ok("User status updated to " + status, updated));
    }

    @GetMapping("/companies")
    @Operation(summary = "Get all registered employers and companies")
    public ResponseEntity<ApiResponse<List<Company>>> getCompanies() {
        return ResponseEntity.ok(ApiResponse.ok("Companies retrieved", adminService.getAllCompanies()));
    }

    @PatchMapping("/companies/{id}/verify")
    @Operation(summary = "Verify or unverify an Indian employer")
    public ResponseEntity<ApiResponse<Company>> verifyCompany(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body,
            @AuthenticationPrincipal UserPrincipal admin) {
        boolean verify = body.getOrDefault("verify", true);
        Company updated = adminService.verifyCompany(id, verify, admin.getId());
        return ResponseEntity.ok(ApiResponse.ok("Company verification updated to " + verify, updated));
    }

    @GetMapping("/reports")
    @Operation(summary = "Get reported/flagged job postings")
    public ResponseEntity<ApiResponse<List<JobReport>>> getReportedJobs() {
        return ResponseEntity.ok(ApiResponse.ok("Pending reports retrieved", adminService.getReportedJobs()));
    }

    @PatchMapping("/reports/{id}/resolve")
    @Operation(summary = "Resolve or dismiss reported job posting")
    public ResponseEntity<ApiResponse<JobReport>> resolveReport(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal admin) {
        String status = body.getOrDefault("status", "RESOLVED");
        String notes = body.getOrDefault("notes", "Reviewed by administrator");
        JobReport updated = adminService.resolveJobReport(id, status, notes, admin.getId());
        return ResponseEntity.ok(ApiResponse.ok("Report status updated to " + status, updated));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get recent platform security and audit logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.ok("Audit logs retrieved", adminService.getAuditLogs()));
    }
}
