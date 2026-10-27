package com.bharathire.repository;

import com.bharathire.entity.JobReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobReportRepository extends JpaRepository<JobReport, Long> {
    List<JobReport> findByStatusOrderByCreatedAtDesc(String status);
    long countByStatus(String status);
}
