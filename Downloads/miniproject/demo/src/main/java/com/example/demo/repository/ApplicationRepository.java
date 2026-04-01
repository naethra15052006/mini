package com.example.demo.repository;

import com.example.demo.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    @Query("SELECT a FROM Application a WHERE a.worker.id = :workerId ORDER BY a.appliedDate DESC")
    List<Application> findByWorkerIdOrderByAppliedDateDesc(@Param("workerId") Long workerId);
    
    boolean existsByWorkerIdAndJobId(Long workerId, Long jobId);
    
    List<Application> findByJobId(Long jobId);
    
    @Modifying
    @Query("DELETE FROM Application a WHERE a.job.id = :jobId")
    void deleteByJobId(@Param("jobId") Long jobId);
}

