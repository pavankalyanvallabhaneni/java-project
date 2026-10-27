package com.bharathire.dto;

public class PlatformStatsDto {
    private long totalUsers;
    private long totalCandidates;
    private long totalRecruiters;
    private long totalCompanies;
    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
    private long shortlistedApplications;
    private long selectedApplications;
    private long pendingReports;

    public PlatformStatsDto() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalCandidates() { return totalCandidates; }
    public void setTotalCandidates(long totalCandidates) { this.totalCandidates = totalCandidates; }

    public long getTotalRecruiters() { return totalRecruiters; }
    public void setTotalRecruiters(long totalRecruiters) { this.totalRecruiters = totalRecruiters; }

    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }

    public long getTotalJobs() { return totalJobs; }
    public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }

    public long getActiveJobs() { return activeJobs; }
    public void setActiveJobs(long activeJobs) { this.activeJobs = activeJobs; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getShortlistedApplications() { return shortlistedApplications; }
    public void setShortlistedApplications(long shortlistedApplications) { this.shortlistedApplications = shortlistedApplications; }

    public long getSelectedApplications() { return selectedApplications; }
    public void setSelectedApplications(long selectedApplications) { this.selectedApplications = selectedApplications; }

    public long getPendingReports() { return pendingReports; }
    public void setPendingReports(long pendingReports) { this.pendingReports = pendingReports; }
}
