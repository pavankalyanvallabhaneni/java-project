package com.bharathire.service;

import com.bharathire.dto.PlatformStatsDto;
import com.bharathire.entity.*;
import com.bharathire.exception.BadRequestException;
import com.bharathire.exception.ResourceNotFoundException;
import com.bharathire.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final JobReportRepository jobReportRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuditService auditService;

    public AdminService(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            JobReportRepository jobReportRepository,
            AuditLogRepository auditLogRepository,
            AuditService auditService) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.jobReportRepository = jobReportRepository;
        this.auditLogRepository = auditLogRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public PlatformStatsDto getPlatformStats() {
        PlatformStatsDto stats = new PlatformStatsDto();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalCandidates(userRepository.countByRole(Role.ROLE_CANDIDATE));
        stats.setTotalRecruiters(userRepository.countByRole(Role.ROLE_RECRUITER));
        stats.setTotalCompanies(companyRepository.count());
        stats.setTotalJobs(jobRepository.count());
        stats.setActiveJobs(jobRepository.countByStatus("PUBLISHED"));
        stats.setTotalApplications(applicationRepository.count());
        stats.setShortlistedApplications(applicationRepository.countByCurrentStatus(ApplicationStatus.Shortlisted));
        stats.setSelectedApplications(applicationRepository.countByCurrentStatus(ApplicationStatus.Selected));
        stats.setPendingReports(jobReportRepository.countByStatus("PENDING"));
        return stats;
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Transactional
    public User updateUserStatus(Long userId, String status, Long adminUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (user.getId().equals(adminUserId)) {
            throw new BadRequestException("Admins cannot suspend their own account");
        }

        user.setStatus(status.toUpperCase());
        User saved = userRepository.save(user);

        User admin = userRepository.findById(adminUserId).orElse(null);
        auditService.logAction(admin, "USER_STATUS_UPDATED", "User", user.getId(), "Status changed to " + status, null);
        return saved;
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @Transactional
    public Company verifyCompany(Long companyId, boolean verify, Long adminUserId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + companyId));

        company.setIsVerified(verify);
        Company saved = companyRepository.save(company);

        User admin = userRepository.findById(adminUserId).orElse(null);
        auditService.logAction(admin, "COMPANY_VERIFICATION", "Company", company.getId(), "Verification set to " + verify, null);
        return saved;
    }

    public List<JobReport> getReportedJobs() {
        return jobReportRepository.findByStatusOrderByCreatedAtDesc("PENDING");
    }

    @Transactional
    public JobReport resolveJobReport(Long reportId, String status, String resolutionNotes, Long adminUserId) {
        JobReport report = jobReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Job report not found"));

        report.setStatus(status.toUpperCase()); // RESOLVED, DISMISSED
        report.setResolutionNotes(resolutionNotes);
        JobReport saved = jobReportRepository.save(report);

        if ("RESOLVED".equalsIgnoreCase(status)) {
            // Remove the flag on the job or close it if fraudulent
            Job job = report.getJob();
            job.setIsFlagged(false);
            if (resolutionNotes != null && resolutionNotes.toLowerCase().contains("close")) {
                job.setStatus("CLOSED");
            }
            jobRepository.save(job);
        }

        User admin = userRepository.findById(adminUserId).orElse(null);
        auditService.logAction(admin, "JOB_REPORT_RESOLVED", "JobReport", reportId, "Status: " + status + " notes: " + resolutionNotes, null);
        return saved;
    }

    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findTop100ByOrderByCreatedAtDesc();
    }
}
