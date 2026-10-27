package com.bharathire.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class JobReportRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @NotBlank(message = "Reason is required")
    private String reason;

    private String details;

    public JobReportRequest() {}

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
