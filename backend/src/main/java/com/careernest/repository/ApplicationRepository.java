package com.careernest.repository;

import com.careernest.entity.Application;
import com.careernest.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Page<Application> findByUserId(Long userId, Pageable pageable);

    Page<Application> findByJobId(Long jobId, Pageable pageable);

    boolean existsByUserIdAndJobId(Long userId, Long jobId);

    Optional<Application> findByUserIdAndJobId(Long userId, Long jobId);

    long countByStatus(ApplicationStatus status);
}
