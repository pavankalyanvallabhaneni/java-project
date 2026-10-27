package com.bharathire.service;

import com.bharathire.dto.JobCreateRequest;
import com.bharathire.dto.JobReportRequest;
import com.bharathire.dto.JobResponse;
import com.bharathire.entity.*;
import com.bharathire.exception.BadRequestException;
import com.bharathire.exception.ResourceNotFoundException;
import com.bharathire.exception.UnauthorizedException;
import com.bharathire.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobSkillRepository jobSkillRepository;
    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CompanyRepository companyRepository;
    private final JobReportRepository jobReportRepository;
    private final AuditService auditService;

    public JobService(
            JobRepository jobRepository,
            JobSkillRepository jobSkillRepository,
            UserRepository userRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            CompanyRepository companyRepository,
            JobReportRepository jobReportRepository,
            AuditService auditService) {
        this.jobRepository = jobRepository;
        this.jobSkillRepository = jobSkillRepository;
        this.userRepository = userRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.companyRepository = companyRepository;
        this.jobReportRepository = jobReportRepository;
        this.auditService = auditService;
    }

    public Page<JobResponse> searchJobs(
            String keyword,
            String category,
            String location,
            String workMode,
            String employmentType,
            String status,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        String effectiveStatus = (status == null || status.isBlank()) ? "PUBLISHED" : status;

        Page<Job> jobsPage = jobRepository.searchJobs(
                (keyword != null && !keyword.isBlank()) ? keyword.trim() : null,
                (category != null && !category.isBlank()) ? category.trim() : null,
                (location != null && !location.isBlank()) ? location.trim() : null,
                (workMode != null && !workMode.isBlank()) ? workMode.trim() : null,
                (employmentType != null && !employmentType.isBlank()) ? employmentType.trim() : null,
                effectiveStatus,
                pageable
        );

        return jobsPage.map(this::mapToJobResponse);
    }

    @Transactional
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + id));

        // Increment view count
        job.setViewsCount(job.getViewsCount() + 1);
        jobRepository.save(job);

        return mapToJobResponse(job);
    }

    @Transactional
    public JobResponse createJob(JobCreateRequest request, Long recruiterUserId) {
        User recruiter = userRepository.findById(recruiterUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter user not found"));

        RecruiterProfile recruiterProfile = recruiterProfileRepository.findByUserId(recruiterUserId)
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found. Please complete profile."));

        Company company = recruiterProfile.getCompany();
        if (company == null) {
            company = companyRepository.findAll().stream().findFirst()
                    .orElseGet(() -> companyRepository.save(new Company(
                            "Bharat Enterprise", "https://bharathire.in", "IT Services", "1000+", "Bengaluru, Karnataka", "Premier Indian Enterprise"
                    )));
        }

        Job job = new Job();
        job.setRecruiter(recruiter);
        job.setCompany(company);
        job.setTitle(request.getTitle());
        job.setCategory(request.getCategory());
        job.setDescription(request.getDescription());
        job.setResponsibilities(request.getResponsibilities());
        job.setRequirements(request.getRequirements());
        job.setMinExperience(request.getMinExperience() != null ? request.getMinExperience() : 0);
        job.setMaxExperience(request.getMaxExperience() != null ? request.getMaxExperience() : 0);
        job.setEmploymentType(request.getEmploymentType());
        job.setWorkMode(request.getWorkMode());
        job.setLocation(request.getLocation());
        job.setState(request.getState());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setSalaryCurrency(request.getSalaryCurrency() != null ? request.getSalaryCurrency() : "INR");
        job.setVacancies(request.getVacancies() != null ? request.getVacancies() : 1);
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setStatus(request.getStatus() != null ? request.getStatus().toUpperCase() : "PUBLISHED");

        Job savedJob = jobRepository.save(job);

        if (request.getSkills() != null && !request.getSkills().isEmpty()) {
            for (String skillName : request.getSkills()) {
                if (skillName != null && !skillName.isBlank()) {
                    JobSkill skill = new JobSkill(skillName.trim(), true);
                    savedJob.addSkill(skill);
                }
            }
            savedJob = jobRepository.save(savedJob);
        }

        auditService.logAction(recruiter, "JOB_CREATED", "Job", savedJob.getId(), "Created job: " + savedJob.getTitle(), null);
        return mapToJobResponse(savedJob);
    }

    @Transactional
    public JobResponse updateJob(Long jobId, JobCreateRequest request, Long currentUserId, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        // Ownership enforcement
        if (!isAdmin && !job.getRecruiter().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to update this job posting");
        }

        job.setTitle(request.getTitle());
        job.setCategory(request.getCategory());
        job.setDescription(request.getDescription());
        job.setResponsibilities(request.getResponsibilities());
        job.setRequirements(request.getRequirements());
        job.setMinExperience(request.getMinExperience());
        job.setMaxExperience(request.getMaxExperience());
        job.setEmploymentType(request.getEmploymentType());
        job.setWorkMode(request.getWorkMode());
        job.setLocation(request.getLocation());
        job.setState(request.getState());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setVacancies(request.getVacancies());
        job.setApplicationDeadline(request.getApplicationDeadline());
        if (request.getStatus() != null) {
            job.setStatus(request.getStatus().toUpperCase());
        }

        // Update skills
        if (request.getSkills() != null) {
            job.getSkills().clear();
            for (String s : request.getSkills()) {
                if (s != null && !s.isBlank()) {
                    job.addSkill(new JobSkill(s.trim(), true));
                }
            }
        }

        Job updated = jobRepository.save(job);
        auditService.logAction(job.getRecruiter(), "JOB_UPDATED", "Job", updated.getId(), "Updated job: " + updated.getTitle(), null);
        return mapToJobResponse(updated);
    }

    @Transactional
    public void deleteJob(Long jobId, Long currentUserId, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        if (!isAdmin && !job.getRecruiter().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to delete this job posting");
        }

        jobRepository.delete(job);
        auditService.logAction(job.getRecruiter(), "JOB_DELETED", "Job", jobId, "Deleted job posting", null);
    }

    public List<JobResponse> getRecruiterJobs(Long recruiterUserId) {
        return jobRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiterUserId)
                .stream().map(this::mapToJobResponse).collect(Collectors.toList());
    }

    public List<JobResponse> getFeaturedJobs() {
        return jobRepository.findTop6ByStatusOrderByCreatedAtDesc("PUBLISHED")
                .stream().map(this::mapToJobResponse).collect(Collectors.toList());
    }

    public List<String> getJobCategories() {
        return Arrays.asList(
                "IT & Software",
                "Data & Analytics",
                "Banking & Finance",
                "Engineering",
                "Sales & BD",
                "Marketing & Growth",
                "Healthcare & Pharma",
                "Education & EdTech",
                "Manufacturing & Ops",
                "Customer Support"
        );
    }

    @Transactional
    public void reportJob(JobReportRequest request, Long userId) {
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + request.getJobId()));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        JobReport report = new JobReport(job, user, request.getReason(), request.getDetails());
        jobReportRepository.save(report);

        job.setIsFlagged(true);
        jobRepository.save(job);

        auditService.logAction(user, "JOB_REPORTED", "Job", job.getId(), "Reported reason: " + request.getReason(), null);
    }

    public JobResponse mapToJobResponse(Job job) {
        JobResponse resp = new JobResponse();
        resp.setId(job.getId());
        resp.setTitle(job.getTitle());
        resp.setCategory(job.getCategory());
        resp.setDescription(job.getDescription());
        resp.setResponsibilities(job.getResponsibilities());
        resp.setRequirements(job.getRequirements());
        resp.setMinExperience(job.getMinExperience());
        resp.setMaxExperience(job.getMaxExperience());
        resp.setEmploymentType(job.getEmploymentType());
        resp.setWorkMode(job.getWorkMode());
        resp.setLocation(job.getLocation());
        resp.setState(job.getState());
        resp.setSalaryMin(job.getSalaryMin());
        resp.setSalaryMax(job.getSalaryMax());
        resp.setSalaryCurrency(job.getSalaryCurrency());
        resp.setVacancies(job.getVacancies());
        resp.setApplicationDeadline(job.getApplicationDeadline());
        resp.setStatus(job.getStatus());
        resp.setViewsCount(job.getViewsCount());
        resp.setIsFlagged(job.getIsFlagged());

        if (job.getCompany() != null) {
            resp.setCompanyId(job.getCompany().getId());
            resp.setCompanyName(job.getCompany().getName());
            resp.setCompanyWebsite(job.getCompany().getWebsite());
            resp.setCompanyLogoUrl(job.getCompany().getLogoUrl());
        }

        if (job.getRecruiter() != null) {
            resp.setRecruiterId(job.getRecruiter().getId());
            resp.setRecruiterName(job.getRecruiter().getFullName());
        }

        if (job.getSkills() != null) {
            resp.setSkills(job.getSkills().stream().map(JobSkill::getSkillName).collect(Collectors.toList()));
        }

        resp.setCreatedAt(job.getCreatedAt());
        return resp;
    }
}
