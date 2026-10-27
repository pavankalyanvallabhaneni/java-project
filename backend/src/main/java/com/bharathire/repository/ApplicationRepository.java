package com.bharathire.repository;

import com.bharathire.entity.Application;
import com.bharathire.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
    Optional<Application> findByJobIdAndCandidateId(Long jobId, Long candidateId);
    List<Application> findByCandidateIdOrderByAppliedAtDesc(Long candidateId);
    List<Application> findByJobIdOrderByAppliedAtDesc(Long jobId);
    List<Application> findByJobRecruiterIdOrderByAppliedAtDesc(Long recruiterId);
    long countByCurrentStatus(ApplicationStatus currentStatus);
    long countByJobRecruiterId(Long recruiterId);
}
