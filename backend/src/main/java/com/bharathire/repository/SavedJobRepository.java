package com.bharathire.repository;

import com.bharathire.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);
    Optional<SavedJob> findByCandidateIdAndJobId(Long candidateId, Long jobId);
    List<SavedJob> findByCandidateIdOrderBySavedAtDesc(Long candidateId);
}
