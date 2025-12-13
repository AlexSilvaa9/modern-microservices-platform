package com.microservices.log.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.microservices.log.model.ApplicationLog;
import com.microservices.log.repository.LogRepository;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    public ApplicationLog saveLog(ApplicationLog log) {
        return logRepository.save(log);
    }

    public Page<ApplicationLog> getLogs(String serviceName, ApplicationLog.LogLevel level, Pageable pageable) {
        if (serviceName != null && level != null) {
            return logRepository.findByServiceNameAndLevel(serviceName, level, pageable);
        } else if (serviceName != null) {
            return logRepository.findByServiceName(serviceName, pageable);
        } else if (level != null) {
            return logRepository.findByLevel(level, pageable);
        } else {
            return logRepository.findAll(pageable);
        }
    }

    public List<ApplicationLog> getLogsByServiceName(String serviceName) {
        return logRepository.findByServiceNameOrderByTimestampDesc(serviceName);
    }

    public List<ApplicationLog> getLogsByLevel(ApplicationLog.LogLevel level) {
        return logRepository.findByLevelOrderByTimestampDesc(level);
    }

    public List<ApplicationLog> getRecentLogs(int limit) {
        return logRepository.findTopByOrderByTimestampDesc(limit);
    }

    public long deleteLogsOlderThan(LocalDateTime cutoffDate) {
        return logRepository.deleteByTimestampBefore(cutoffDate);
    }
}
