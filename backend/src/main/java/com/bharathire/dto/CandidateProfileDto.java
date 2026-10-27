package com.bharathire.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class CandidateProfileDto {
    private String fullName;
    private String email;
    private String phone;
    private String headline;
    private String bio;
    private String currentLocation;
    private String preferredLocations;
    private BigDecimal yearsOfExperience;
    private BigDecimal expectedSalaryMin;
    private BigDecimal expectedSalaryMax;
    private Integer noticePeriodDays;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;

    private List<SkillDto> skills;
    private List<EducationDto> educationList;
    private List<ExperienceDto> experienceList;
    private List<ResumeDto> resumes;

    public static class SkillDto {
        private Long id;
        private String skillName;
        private String proficiencyLevel;
        private BigDecimal yearsOfExperience;

        public SkillDto() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getSkillName() { return skillName; }
        public void setSkillName(String skillName) { this.skillName = skillName; }
        public String getProficiencyLevel() { return proficiencyLevel; }
        public void setProficiencyLevel(String proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }
        public BigDecimal getYearsOfExperience() { return yearsOfExperience; }
        public void setYearsOfExperience(BigDecimal yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
    }

    public static class EducationDto {
        private Long id;
        private String institution;
        private String degree;
        private String fieldOfStudy;
        private Integer startYear;
        private Integer endYear;
        private String percentageOrCgpa;

        public EducationDto() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getInstitution() { return institution; }
        public void setInstitution(String institution) { this.institution = institution; }
        public String getDegree() { return degree; }
        public void setDegree(String degree) { this.degree = degree; }
        public String getFieldOfStudy() { return fieldOfStudy; }
        public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }
        public Integer getStartYear() { return startYear; }
        public void setStartYear(Integer startYear) { this.startYear = startYear; }
        public Integer getEndYear() { return endYear; }
        public void setEndYear(Integer endYear) { this.endYear = endYear; }
        public String getPercentageOrCgpa() { return percentageOrCgpa; }
        public void setPercentageOrCgpa(String percentageOrCgpa) { this.percentageOrCgpa = percentageOrCgpa; }
    }

    public static class ExperienceDto {
        private Long id;
        private String companyName;
        private String designation;
        private LocalDate startDate;
        private LocalDate endDate;
        private Boolean isCurrent;
        private String description;

        public ExperienceDto() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
        public String getDesignation() { return designation; }
        public void setDesignation(String designation) { this.designation = designation; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public Boolean getIsCurrent() { return isCurrent; }
        public void setIsCurrent(Boolean isCurrent) { this.isCurrent = isCurrent; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class ResumeDto {
        private Long id;
        private String fileName;
        private Long fileSizeBytes;
        private String contentType;
        private Boolean isPrimary;

        public ResumeDto() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public Long getFileSizeBytes() { return fileSizeBytes; }
        public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }
        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }
        public Boolean getIsPrimary() { return isPrimary; }
        public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }
    }

    public CandidateProfileDto() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }

    public String getPreferredLocations() { return preferredLocations; }
    public void setPreferredLocations(String preferredLocations) { this.preferredLocations = preferredLocations; }

    public BigDecimal getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(BigDecimal yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

    public BigDecimal getExpectedSalaryMin() { return expectedSalaryMin; }
    public void setExpectedSalaryMin(BigDecimal expectedSalaryMin) { this.expectedSalaryMin = expectedSalaryMin; }

    public BigDecimal getExpectedSalaryMax() { return expectedSalaryMax; }
    public void setExpectedSalaryMax(BigDecimal expectedSalaryMax) { this.expectedSalaryMax = expectedSalaryMax; }

    public Integer getNoticePeriodDays() { return noticePeriodDays; }
    public void setNoticePeriodDays(Integer noticePeriodDays) { this.noticePeriodDays = noticePeriodDays; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public List<SkillDto> getSkills() { return skills; }
    public void setSkills(List<SkillDto> skills) { this.skills = skills; }

    public List<EducationDto> getEducationList() { return educationList; }
    public void setEducationList(List<EducationDto> educationList) { this.educationList = educationList; }

    public List<ExperienceDto> getExperienceList() { return experienceList; }
    public void setExperienceList(List<ExperienceDto> experienceList) { this.experienceList = experienceList; }

    public List<ResumeDto> getResumes() { return resumes; }
    public void setResumes(List<ResumeDto> resumes) { this.resumes = resumes; }
}
