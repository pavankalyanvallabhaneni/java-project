package com.bharathire.service;

import com.bharathire.dto.CandidateProfileDto;
import com.bharathire.dto.JobResponse;
import com.bharathire.entity.*;
import com.bharathire.exception.BadRequestException;
import com.bharathire.exception.ResourceNotFoundException;
import com.bharathire.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidateService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final CandidateEducationRepository candidateEducationRepository;
    private final CandidateExperienceRepository candidateExperienceRepository;
    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final JobService jobService;
    private final AuditService auditService;

    public CandidateService(
            CandidateProfileRepository candidateProfileRepository,
            UserRepository userRepository,
            CandidateSkillRepository candidateSkillRepository,
            CandidateEducationRepository candidateEducationRepository,
            CandidateExperienceRepository candidateExperienceRepository,
            SavedJobRepository savedJobRepository,
            JobRepository jobRepository,
            JobService jobService,
            AuditService auditService) {
        this.candidateProfileRepository = candidateProfileRepository;
        this.userRepository = userRepository;
        this.candidateSkillRepository = candidateSkillRepository;
        this.candidateEducationRepository = candidateEducationRepository;
        this.candidateExperienceRepository = candidateExperienceRepository;
        this.savedJobRepository = savedJobRepository;
        this.jobRepository = jobRepository;
        this.jobService = jobService;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public CandidateProfileDto getProfile(Long userId) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
        return mapToDto(profile);
    }

    @Transactional
    public CandidateProfileDto updateProfile(Long userId, CandidateProfileDto dto) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        User user = profile.getUser();
        if (dto.getFullName() != null && !dto.getFullName().isBlank()) {
            user.setFullName(dto.getFullName().trim());
        }
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone().trim());
        }
        userRepository.save(user);

        profile.setHeadline(dto.getHeadline());
        profile.setBio(dto.getBio());
        profile.setCurrentLocation(dto.getCurrentLocation());
        profile.setPreferredLocations(dto.getPreferredLocations());
        profile.setYearsOfExperience(dto.getYearsOfExperience());
        profile.setExpectedSalaryMin(dto.getExpectedSalaryMin());
        profile.setExpectedSalaryMax(dto.getExpectedSalaryMax());
        profile.setNoticePeriodDays(dto.getNoticePeriodDays());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setGithubUrl(dto.getGithubUrl());
        profile.setPortfolioUrl(dto.getPortfolioUrl());

        CandidateProfile saved = candidateProfileRepository.save(profile);
        auditService.logAction(user, "PROFILE_UPDATED", "CandidateProfile", saved.getId(), "Updated profile details", null);
        return mapToDto(saved);
    }

    @Transactional
    public CandidateProfileDto addSkill(Long userId, CandidateSkill skill) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
        skill.setCandidateProfile(profile);
        candidateSkillRepository.save(skill);
        return getProfile(userId);
    }

    @Transactional
    public void deleteSkill(Long userId, Long skillId) {
        CandidateSkill skill = candidateSkillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        if (!skill.getCandidateProfile().getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized to delete this skill");
        }
        candidateSkillRepository.delete(skill);
    }

    @Transactional
    public CandidateProfileDto addEducation(Long userId, CandidateEducation edu) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
        edu.setCandidateProfile(profile);
        candidateEducationRepository.save(edu);
        return getProfile(userId);
    }

    @Transactional
    public void deleteEducation(Long userId, Long educationId) {
        CandidateEducation edu = candidateEducationRepository.findById(educationId)
                .orElseThrow(() -> new ResourceNotFoundException("Education record not found"));
        if (!edu.getCandidateProfile().getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized to delete this education record");
        }
        candidateEducationRepository.delete(edu);
    }

    @Transactional
    public CandidateProfileDto addExperience(Long userId, CandidateExperience exp) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
        exp.setCandidateProfile(profile);
        candidateExperienceRepository.save(exp);
        return getProfile(userId);
    }

    @Transactional
    public void deleteExperience(Long userId, Long experienceId) {
        CandidateExperience exp = candidateExperienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience record not found"));
        if (!exp.getCandidateProfile().getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized to delete this experience record");
        }
        candidateExperienceRepository.delete(exp);
    }

    @Transactional
    public void saveJob(Long userId, Long jobId) {
        CandidateProfile candidate = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!savedJobRepository.existsByCandidateIdAndJobId(candidate.getId(), jobId)) {
            savedJobRepository.save(new SavedJob(candidate, job));
        }
    }

    @Transactional
    public void unsaveJob(Long userId, Long jobId) {
        CandidateProfile candidate = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        savedJobRepository.findByCandidateIdAndJobId(candidate.getId(), jobId)
                .ifPresent(savedJobRepository::delete);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getSavedJobs(Long userId) {
        CandidateProfile candidate = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        return savedJobRepository.findByCandidateIdOrderBySavedAtDesc(candidate.getId())
                .stream()
                .map(sj -> jobService.mapToJobResponse(sj.getJob()))
                .collect(Collectors.toList());
    }

    private CandidateProfileDto mapToDto(CandidateProfile profile) {
        CandidateProfileDto dto = new CandidateProfileDto();
        dto.setFullName(profile.getUser().getFullName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setPhone(profile.getUser().getPhone());
        dto.setHeadline(profile.getHeadline());
        dto.setBio(profile.getBio());
        dto.setCurrentLocation(profile.getCurrentLocation());
        dto.setPreferredLocations(profile.getPreferredLocations());
        dto.setYearsOfExperience(profile.getYearsOfExperience());
        dto.setExpectedSalaryMin(profile.getExpectedSalaryMin());
        dto.setExpectedSalaryMax(profile.getExpectedSalaryMax());
        dto.setNoticePeriodDays(profile.getNoticePeriodDays());
        dto.setLinkedinUrl(profile.getLinkedinUrl());
        dto.setGithubUrl(profile.getGithubUrl());
        dto.setPortfolioUrl(profile.getPortfolioUrl());

        if (profile.getSkills() != null) {
            dto.setSkills(profile.getSkills().stream().map(s -> {
                CandidateProfileDto.SkillDto sd = new CandidateProfileDto.SkillDto();
                sd.setId(s.getId());
                sd.setSkillName(s.getSkillName());
                sd.setProficiencyLevel(s.getProficiencyLevel());
                sd.setYearsOfExperience(s.getYearsOfExperience());
                return sd;
            }).collect(Collectors.toList()));
        }

        if (profile.getEducationList() != null) {
            dto.setEducationList(profile.getEducationList().stream().map(e -> {
                CandidateProfileDto.EducationDto ed = new CandidateProfileDto.EducationDto();
                ed.setId(e.getId());
                ed.setInstitution(e.getInstitution());
                ed.setDegree(e.getDegree());
                ed.setFieldOfStudy(e.getFieldOfStudy());
                ed.setStartYear(e.getStartYear());
                ed.setEndYear(e.getEndYear());
                ed.setPercentageOrCgpa(e.getPercentageOrCgpa());
                return ed;
            }).collect(Collectors.toList()));
        }

        if (profile.getExperienceList() != null) {
            dto.setExperienceList(profile.getExperienceList().stream().map(exp -> {
                CandidateProfileDto.ExperienceDto exd = new CandidateProfileDto.ExperienceDto();
                exd.setId(exp.getId());
                exd.setCompanyName(exp.getCompanyName());
                exd.setDesignation(exp.getDesignation());
                exd.setStartDate(exp.getStartDate());
                exd.setEndDate(exp.getEndDate());
                exd.setIsCurrent(exp.getIsCurrent());
                exd.setDescription(exp.getDescription());
                return exd;
            }).collect(Collectors.toList()));
        }

        if (profile.getResumes() != null) {
            dto.setResumes(profile.getResumes().stream().map(r -> {
                CandidateProfileDto.ResumeDto rd = new CandidateProfileDto.ResumeDto();
                rd.setId(r.getId());
                rd.setFileName(r.getFileName());
                rd.setFileSizeBytes(r.getFileSizeBytes());
                rd.setContentType(r.getContentType());
                rd.setIsPrimary(r.getIsPrimary());
                return rd;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}
