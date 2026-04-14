package com.careernest.repository;

import com.careernest.entity.Job;
import com.careernest.enums.JobCategory;
import com.careernest.enums.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByActiveTrue(Pageable pageable);

    Page<Job> findByCompanyId(Long companyId, Pageable pageable);

    Page<Job> findByPostedById(Long userId, Pageable pageable);

    /**
     * Advanced search with optional filters.
     */
    @Query("SELECT j FROM Job j WHERE j.active = true " +
            "AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
            "AND (:type IS NULL OR j.type = :type) " +
            "AND (:category IS NULL OR j.category = :category) " +
            "AND (:minSalary IS NULL OR j.salaryMin >= :minSalary) " +
            "AND (:experienceLevel IS NULL OR LOWER(j.experienceLevel) = LOWER(:experienceLevel))")
    Page<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("type") JobType type,
            @Param("category") JobCategory category,
            @Param("minSalary") BigDecimal minSalary,
            @Param("experienceLevel") String experienceLevel,
            Pageable pageable
    );

    long countByActiveTrue();
}
