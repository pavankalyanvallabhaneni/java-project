package com.bharathire.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "candidate_skills")
public class CandidateSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    @JsonIgnore
    private CandidateProfile candidateProfile;

    @Column(name = "skill_name", nullable = false, length = 100)
    private String skillName;

    @Column(name = "proficiency_level", length = 50)
    private String proficiencyLevel = "Intermediate";

    @Column(name = "years_of_experience", precision = 4, scale = 1)
    private BigDecimal yearsOfExperience = BigDecimal.ONE;

    public CandidateSkill() {}

    public CandidateSkill(String skillName, String proficiencyLevel, BigDecimal yearsOfExperience) {
        this.skillName = skillName;
        this.proficiencyLevel = proficiencyLevel;
        this.yearsOfExperience = yearsOfExperience;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CandidateProfile getCandidateProfile() { return candidateProfile; }
    public void setCandidateProfile(CandidateProfile candidateProfile) { this.candidateProfile = candidateProfile; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(String proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public BigDecimal getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(BigDecimal yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
}
