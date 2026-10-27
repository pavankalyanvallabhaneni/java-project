package com.bharathire.repository;

import com.bharathire.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiterIdOrderByCreatedAtDesc(Long recruiterId);
    Page<Job> findByRecruiterIdOrderByCreatedAtDesc(Long recruiterId, Pageable pageable);

    long countByStatus(String status);

    @Query("SELECT j FROM Job j WHERE " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:category IS NULL OR LOWER(j.category) = LOWER(:category)) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')) OR LOWER(j.state) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:workMode IS NULL OR LOWER(j.workMode) = LOWER(:workMode)) AND " +
           "(:employmentType IS NULL OR LOWER(j.employmentType) = LOWER(:employmentType)) AND " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(j.company.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(j.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("location") String location,
            @Param("workMode") String workMode,
            @Param("employmentType") String employmentType,
            @Param("status") String status,
            Pageable pageable
    );

    List<Job> findTop6ByStatusOrderByCreatedAtDesc(String status);
}
