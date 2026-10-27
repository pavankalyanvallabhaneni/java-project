package com.bharathire.repository;

import com.bharathire.entity.CandidateProfile;
import com.bharathire.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
    Optional<CandidateProfile> findByUserId(Long userId);
    Optional<CandidateProfile> findByUser(User user);
}
