package com.bharathire.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    @JsonIgnore
    private CandidateProfile candidateProfile;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "stored_file_path", nullable = false, length = 500)
    private String storedFilePath;

    @Column(name = "file_size_bytes", nullable = false)
    private Long fileSizeBytes;

    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = true;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();

    public Resume() {}

    public Resume(CandidateProfile candidateProfile, String fileName, String storedFilePath, Long fileSizeBytes, String contentType) {
        this.candidateProfile = candidateProfile;
        this.fileName = fileName;
        this.storedFilePath = storedFilePath;
        this.fileSizeBytes = fileSizeBytes;
        this.contentType = contentType;
        this.isPrimary = true;
    }

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CandidateProfile getCandidateProfile() { return candidateProfile; }
    public void setCandidateProfile(CandidateProfile candidateProfile) { this.candidateProfile = candidateProfile; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getStoredFilePath() { return storedFilePath; }
    public void setStoredFilePath(String storedFilePath) { this.storedFilePath = storedFilePath; }

    public Long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
