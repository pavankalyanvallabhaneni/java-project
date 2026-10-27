package com.bharathire.repository;

import com.bharathire.entity.RecruiterProfile;
import com.bharathire.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecruiterProfileRepository extends JpaRepository<RecruiterProfile, Long> {
    Optional<RecruiterProfile> findByUserId(Long userId);
    Optional<RecruiterProfile> findByUser(User user);
}
