package com.bharathire.service;

import com.bharathire.dto.ApplicationRequest;
import com.bharathire.dto.ApplicationResponse;
import com.bharathire.dto.ApplicationStatusUpdateRequest;
import com.bharathire.entity.*;
import com.bharathire.exception.BadRequestException;
import com.bharathire.exception.ResourceNotFoundException;
import com.bharathire.exception.UnauthorizedException;
import com.bharathire.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final JobRepository jobRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            ApplicationStatusHistoryRepository statusHistoryRepository,
            JobRepository jobRepository,
            CandidateProfileRepository candidateProfileRepository,
            ResumeRepository resumeRepository,
            UserRepository userRepository,
            NotificationService notificationService,
            AuditService auditService) {
        this.applicationRepository = applicationRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.jobRepository = jobRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }

    @Transactional
    public ApplicationResponse apply(Long candidateUserId, ApplicationRequest request) {
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + request.getJobId()));

        // Check if job is published
        if (!"PUBLISHED".equalsIgnoreCase(job.getStatus())) {
            throw new BadRequestException("This job is no longer accepting applications (Status: " + job.getStatus() + ")");
        }

        // Check deadline
        if (job.getApplicationDeadline() != null && job.getApplicationDeadline().isBefore(LocalDate.now())) {
            throw new BadRequestException("Application deadline for this job has expired");
        }

        CandidateProfile candidate = candidateProfileRepository.findByUserId(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        // Check duplicate application
        if (applicationRepository.existsByJobIdAndCandidateId(job.getId(), candidate.getId())) {
            throw new BadRequestException("You have already applied for this position");
        }

        Resume resume = null;
        if (request.getResumeId() != null) {
            resume = resumeRepository.findById(request.getResumeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Specified resume not found"));
            if (!resume.getCandidateProfile().getId().equals(candidate.getId())) {
                throw new UnauthorizedException("Unauthorized to use this resume");
            }
        } else {
            // Pick primary resume if available
            resume = resumeRepository.findByCandidateProfileIdAndIsPrimaryTrue(candidate.getId()).orElse(null);
        }

        Application application = new Application(job, candidate, resume, request.getCoverLetter());
        application.setCurrentStatus(ApplicationStatus.Applied);
        Application saved = applicationRepository.save(application);

        // Record initial status in history
        ApplicationStatusHistory history = new ApplicationStatusHistory(
                saved,
                null,
                ApplicationStatus.Applied.name(),
                candidate.getUser(),
                "Application submitted by candidate"
        );
        statusHistoryRepository.save(history);

        // Notify recruiter
        notificationService.createNotification(
                job.getRecruiter(),
                "New Applicant: " + job.getTitle(),
                candidate.getUser().getFullName() + " has applied for " + job.getTitle(),
                "APPLICATION",
                saved.getId()
        );

        auditService.logAction(candidate.getUser(), "APPLICATION_SUBMITTED", "Application", saved.getId(), "Applied to job: " + job.getTitle(), null);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getCandidateApplications(Long candidateUserId) {
        CandidateProfile candidate = candidateProfileRepository.findByUserId(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        return applicationRepository.findByCandidateIdOrderByAppliedAtDesc(candidate.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getRecruiterApplications(Long recruiterUserId) {
        return applicationRepository.findByJobRecruiterIdOrderByAppliedAtDesc(recruiterUserId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getJobApplications(Long jobId, Long recruiterUserId, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!isAdmin && !job.getRecruiter().getId().equals(recruiterUserId)) {
            throw new UnauthorizedException("You are not authorized to view applicants for this job");
        }

        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationDetails(Long applicationId, Long currentUserId, String role) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        boolean isCandidateOwner = app.getCandidate().getUser().getId().equals(currentUserId);
        boolean isJobRecruiter = app.getJob().getRecruiter().getId().equals(currentUserId);
        boolean isAdmin = "ROLE_ADMIN".equals(role);

        if (!isCandidateOwner && !isJobRecruiter && !isAdmin) {
            throw new UnauthorizedException("Unauthorized access to application details");
        }

        return mapToResponse(app);
    }

    @Transactional
    public ApplicationResponse updateStatus(Long applicationId, ApplicationStatusUpdateRequest request, Long recruiterUserId, boolean isAdmin) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        if (!isAdmin && !app.getJob().getRecruiter().getId().equals(recruiterUserId)) {
            throw new UnauthorizedException("Unauthorized to update status of applicants for this job");
        }

        ApplicationStatus targetStatus = ApplicationStatus.fromString(request.getStatus());

        // Validate that candidate cannot be updated to Withdrawn by recruiter
        if (targetStatus == ApplicationStatus.Withdrawn) {
            throw new BadRequestException("Recruiter cannot withdraw an application on behalf of candidate");
        }

        String previousStatus = app.getCurrentStatus().name();
        app.setCurrentStatus(targetStatus);
        if (request.getRecruiterNotes() != null) {
            app.setRecruiterNotes(request.getRecruiterNotes());
        }
        Application updated = applicationRepository.save(app);

        User actor = userRepository.findById(recruiterUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ApplicationStatusHistory history = new ApplicationStatusHistory(
                updated,
                previousStatus,
                targetStatus.name(),
                actor,
                request.getComments() != null ? request.getComments() : "Status updated to " + targetStatus.toDisplayString()
        );
        statusHistoryRepository.save(history);

        // Notify candidate of status change
        notificationService.createNotification(
                app.getCandidate().getUser(),
                "Application Update: " + app.getJob().getTitle(),
                "Your application status for " + app.getJob().getTitle() + " has changed to: " + targetStatus.toDisplayString(),
                "APPLICATION",
                updated.getId()
        );

        auditService.logAction(actor, "APPLICATION_STATUS_UPDATED", "Application", updated.getId(), "Status changed from " + previousStatus + " to " + targetStatus.name(), null);
        return mapToResponse(updated);
    }

    @Transactional
    public void withdrawApplication(Long applicationId, Long candidateUserId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        if (!app.getCandidate().getUser().getId().equals(candidateUserId)) {
            throw new UnauthorizedException("Unauthorized to withdraw this application");
        }

        if (app.getCurrentStatus() == ApplicationStatus.Selected) {
            throw new BadRequestException("Selected applications cannot be withdrawn online. Please contact recruiter directly.");
        }

        if (app.getCurrentStatus() == ApplicationStatus.Rejected || app.getCurrentStatus() == ApplicationStatus.Withdrawn) {
            throw new BadRequestException("Application is already " + app.getCurrentStatus().name());
        }

        String previousStatus = app.getCurrentStatus().name();
        app.setCurrentStatus(ApplicationStatus.Withdrawn);
        Application updated = applicationRepository.save(app);

        User candidateUser = app.getCandidate().getUser();
        ApplicationStatusHistory history = new ApplicationStatusHistory(
                updated,
                previousStatus,
                ApplicationStatus.Withdrawn.name(),
                candidateUser,
                "Application withdrawn by candidate"
        );
        statusHistoryRepository.save(history);

        // Notify recruiter
        notificationService.createNotification(
                app.getJob().getRecruiter(),
                "Application Withdrawn: " + app.getJob().getTitle(),
                candidateUser.getFullName() + " has withdrawn their application.",
                "APPLICATION",
                updated.getId()
        );

        auditService.logAction(candidateUser, "APPLICATION_WITHDRAWN", "Application", updated.getId(), "Candidate withdrew application", null);
    }

    private ApplicationResponse mapToResponse(Application app) {
        ApplicationResponse resp = new ApplicationResponse();
        resp.setId(app.getId());

        if (app.getJob() != null) {
            resp.setJobId(app.getJob().getId());
            resp.setJobTitle(app.getJob().getTitle());
            resp.setJobLocation(app.getJob().getLocation());
            resp.setEmploymentType(app.getJob().getEmploymentType());
            if (app.getJob().getCompany() != null) {
                resp.setCompanyName(app.getJob().getCompany().getName());
            }
        }

        if (app.getCandidate() != null) {
            resp.setCandidateId(app.getCandidate().getId());
            resp.setCandidateHeadline(app.getCandidate().getHeadline());
            if (app.getCandidate().getUser() != null) {
                resp.setCandidateName(app.getCandidate().getUser().getFullName());
                resp.setCandidateEmail(app.getCandidate().getUser().getEmail());
                resp.setCandidatePhone(app.getCandidate().getUser().getPhone());
            }
        }

        if (app.getResume() != null) {
            resp.setResumeId(app.getResume().getId());
            resp.setResumeFileName(app.getResume().getFileName());
        }

        resp.setCoverLetter(app.getCoverLetter());
        resp.setCurrentStatus(app.getCurrentStatus().toDisplayString());
        resp.setRecruiterNotes(app.getRecruiterNotes());
        resp.setAppliedAt(app.getAppliedAt());
        resp.setUpdatedAt(app.getUpdatedAt());

        List<ApplicationStatusHistory> historyList = statusHistoryRepository.findByApplicationIdOrderByCreatedAtDesc(app.getId());
        if (historyList != null && !historyList.isEmpty()) {
            resp.setStatusHistory(historyList.stream().map(h -> new ApplicationResponse.StatusHistoryItem(
                    h.getPreviousStatus(),
                    h.getNewStatus(),
                    h.getChangedByUser() != null ? h.getChangedByUser().getFullName() : "System",
                    h.getComments(),
                    h.getCreatedAt()
            )).collect(Collectors.toList()));
        }

        return resp;
    }
}
