package com.bharathire.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class InterviewScheduleRequest {

    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Scheduled time is required")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime scheduledTime;

    private Integer durationMinutes = 45;

    @NotBlank(message = "Interview round is required")
    private String interviewRound = "Technical Round 1";

    @NotBlank(message = "Meeting link or location is required")
    private String meetingLinkOrLocation;

    private String interviewerNotes;

    public InterviewScheduleRequest() {}

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getInterviewRound() { return interviewRound; }
    public void setInterviewRound(String interviewRound) { this.interviewRound = interviewRound; }

    public String getMeetingLinkOrLocation() { return meetingLinkOrLocation; }
    public void setMeetingLinkOrLocation(String meetingLinkOrLocation) { this.meetingLinkOrLocation = meetingLinkOrLocation; }

    public String getInterviewerNotes() { return interviewerNotes; }
    public void setInterviewerNotes(String interviewerNotes) { this.interviewerNotes = interviewerNotes; }
}
