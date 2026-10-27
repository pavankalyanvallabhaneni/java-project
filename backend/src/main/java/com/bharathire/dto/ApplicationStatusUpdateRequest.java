package com.bharathire.dto;

import jakarta.validation.constraints.NotBlank;

public class ApplicationStatusUpdateRequest {

    @NotBlank(message = "New status is required")
    private String status;

    private String comments;
    private String recruiterNotes;

    public ApplicationStatusUpdateRequest() {}

    public ApplicationStatusUpdateRequest(String status, String comments) {
        this.status = status;
        this.comments = comments;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getRecruiterNotes() { return recruiterNotes; }
    public void setRecruiterNotes(String recruiterNotes) { this.recruiterNotes = recruiterNotes; }
}
