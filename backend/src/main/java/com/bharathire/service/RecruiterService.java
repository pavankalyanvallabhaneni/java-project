package com.bharathire.service;

import com.bharathire.dto.InterviewResponse;
import com.bharathire.dto.InterviewScheduleRequest;
import com.bharathire.dto.RecruiterProfileDto;
import com.bharathire.entity.*;
import com.bharathire.exception.BadRequestException;
import com.bharathire.exception.ResourceNotFoundException;
import com.bharathire.exception.UnauthorizedException;
import com.bharathire.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecruiterService {

    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    public RecruiterService(
            RecruiterProfileRepository recruiterProfileRepository,
            CompanyRepository companyRepository,
            UserRepository userRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            InterviewRepository interviewRepository,
            ApplicationStatusHistoryRepository statusHistoryRepository,
            NotificationService notificationService,
            AuditService auditService) {
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public RecruiterProfileDto getProfile(Long userId) {
        RecruiterProfile profile = recruiterProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
        return mapToDto(profile);
    }

    @Transactional
    public RecruiterProfileDto updateProfile(Long userId, RecruiterProfileDto dto) {
        RecruiterProfile profile = recruiterProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        User user = profile.getUser();
        if (dto.getFullName() != null && !dto.getFullName().isBlank()) {
            user.setFullName(dto.getFullName().trim());
        }
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone().trim());
        }
        userRepository.save(user);

        profile.setDesignation(dto.getDesignation());
        profile.setDepartment(dto.getDepartment());

        // Update company
        Company company = profile.getCompany();
        if (company == null) {
            company = new Company();
            company.setName(dto.getCompanyName() != null ? dto.getCompanyName() : "Company");
        }

        if (dto.getCompanyName() != null && !dto.getCompanyName().isBlank()) {
            company.setName(dto.getCompanyName().trim());
        }
        company.setWebsite(dto.getCompanyWebsite());
        company.setIndustry(dto.getCompanyIndustry());
        company.setCompanySize(dto.getCompanySize());
        company.setHeadquarters(dto.getCompanyHeadquarters());
        company.setDescription(dto.getCompanyDescription());
        company = companyRepository.save(company);

        profile.setCompany(company);
        RecruiterProfile saved = recruiterProfileRepository.save(profile);

        auditService.logAction(user, "RECRUITER_PROFILE_UPDATED", "RecruiterProfile", saved.getId(), "Updated profile & company details", null);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getRecruiterAnalytics(Long recruiterUserId) {
        List<Job> jobs = jobRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiterUserId);
        long totalJobs = jobs.size();
        long activeJobs = jobs.stream().filter(j -> "PUBLISHED".equalsIgnoreCase(j.getStatus())).count();

        List<Application> apps = applicationRepository.findByJobRecruiterIdOrderByAppliedAtDesc(recruiterUserId);
        long totalApplications = apps.size();

        Map<String, Long> statusCounts = new HashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusCounts.put(status.toDisplayString(), apps.stream().filter(a -> a.getCurrentStatus() == status).count());
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJobs", totalJobs);
        stats.put("activeJobs", activeJobs);
        stats.put("totalApplications", totalApplications);
        stats.put("statusCounts", statusCounts);
        return stats;
    }

    @Transactional
    public InterviewResponse scheduleInterview(InterviewScheduleRequest request, Long recruiterUserId) {
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!application.getJob().getRecruiter().getId().equals(recruiterUserId)) {
            throw new UnauthorizedException("Unauthorized to schedule interview for this candidate");
        }

        Interview interview = new Interview(
                application,
                request.getScheduledTime(),
                request.getDurationMinutes(),
                request.getInterviewRound(),
                request.getMeetingLinkOrLocation(),
                request.getInterviewerNotes()
        );
        Interview saved = interviewRepository.save(interview);

        // Update application status to Interview Scheduled
        String prevStatus = application.getCurrentStatus().name();
        application.setCurrentStatus(ApplicationStatus.Interview_Scheduled);
        applicationRepository.save(application);

        User recruiter = userRepository.findById(recruiterUserId).orElse(null);
        ApplicationStatusHistory history = new ApplicationStatusHistory(
                application,
                prevStatus,
                ApplicationStatus.Interview_Scheduled.name(),
                recruiter,
                "Interview scheduled for " + request.getInterviewRound() + " at " + request.getScheduledTime()
        );
        statusHistoryRepository.save(history);

        // Notify candidate
        notificationService.createNotification(
                application.getCandidate().getUser(),
                "Interview Scheduled: " + application.getJob().getTitle(),
                "Interview scheduled for " + request.getInterviewRound() + " on " + request.getScheduledTime() + ". Details: " + request.getMeetingLinkOrLocation(),
                "INTERVIEW",
                saved.getId()
        );

        auditService.logAction(recruiter, "INTERVIEW_SCHEDULED", "Interview", saved.getId(), "Scheduled interview for application ID: " + application.getId(), null);
        return mapToInterviewResponse(saved);
    }

    public List<InterviewResponse> getRecruiterInterviews(Long recruiterUserId) {
        return interviewRepository.findByApplicationJobRecruiterIdOrderByScheduledTimeAsc(recruiterUserId)
                .stream().map(this::mapToInterviewResponse).collect(Collectors.toList());
    }

    public List<InterviewResponse> getCandidateInterviews(Long candidateUserId) {
        return interviewRepository.findByApplicationCandidateIdOrderByScheduledTimeAsc(candidateUserId)
                .stream().map(this::mapToInterviewResponse).collect(Collectors.toList());
    }

    private InterviewResponse mapToInterviewResponse(Interview interview) {
        InterviewResponse resp = new InterviewResponse();
        resp.setId(interview.getId());
        resp.setApplicationId(interview.getApplication().getId());
        resp.setJobId(interview.getApplication().getJob().getId());
        resp.setJobTitle(interview.getApplication().getJob().getTitle());
        resp.setCompanyName(interview.getApplication().getJob().getCompany().getName());
        resp.setCandidateId(interview.getApplication().getCandidate().getId());
        resp.setCandidateName(interview.getApplication().getCandidate().getUser().getFullName());
        resp.setCandidateEmail(interview.getApplication().getCandidate().getUser().getEmail());
        resp.setScheduledTime(interview.getScheduledTime());
        resp.setDurationMinutes(interview.getDurationMinutes());
        resp.setInterviewRound(interview.getInterviewRound());
        resp.setMeetingLinkOrLocation(interview.getMeetingLinkOrLocation());
        resp.setInterviewerNotes(interview.getInterviewerNotes());
        resp.setStatus(interview.getStatus());
        return resp;
    }

    private RecruiterProfileDto mapToDto(RecruiterProfile profile) {
        RecruiterProfileDto dto = new RecruiterProfileDto();
        dto.setFullName(profile.getUser().getFullName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setPhone(profile.getUser().getPhone());
        dto.setDesignation(profile.getDesignation());
        dto.setDepartment(profile.getDepartment());
        dto.setIsRecruiterVerified(profile.getIsVerified());

        if (profile.getCompany() != null) {
            Company c = profile.getCompany();
            dto.setCompanyId(c.getId());
            dto.setCompanyName(c.getName());
            dto.setCompanyWebsite(c.getWebsite());
            dto.setCompanyIndustry(c.getIndustry());
            dto.setCompanySize(c.getCompanySize());
            dto.setCompanyHeadquarters(c.getHeadquarters());
            dto.setCompanyDescription(c.getDescription());
            dto.setCompanyLogoUrl(c.getLogoUrl());
            dto.setIsCompanyVerified(c.getIsVerified());
        }

        return dto;
    }
}
