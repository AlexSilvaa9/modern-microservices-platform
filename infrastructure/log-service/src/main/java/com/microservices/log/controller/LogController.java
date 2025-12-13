package com.microservices.log.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.microservices.log.model.ApplicationLog;
import com.microservices.log.service.LogService;

@RestController
@RequestMapping("/logs")
@CrossOrigin(origins = "*")
public class LogController {

    @Autowired
    private LogService logService;

    @PostMapping
    public ResponseEntity<ApplicationLog> createLog(@RequestBody ApplicationLog log) {
        ApplicationLog savedLog = logService.saveLog(log);
        return ResponseEntity.ok(savedLog);
    }

    @GetMapping
    public ResponseEntity<Page<ApplicationLog>> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String serviceName,
            @RequestParam(required = false) ApplicationLog.LogLevel level) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<ApplicationLog> logs = logService.getLogs(serviceName, level, pageable);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/service/{serviceName}")
    public ResponseEntity<List<ApplicationLog>> getLogsByService(@PathVariable String serviceName) {
        List<ApplicationLog> logs = logService.getLogsByServiceName(serviceName);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<List<ApplicationLog>> getLogsByLevel(@PathVariable ApplicationLog.LogLevel level) {
        List<ApplicationLog> logs = logService.getLogsByLevel(level);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ApplicationLog>> getRecentLogs(
            @RequestParam(defaultValue = "100") int limit) {
        List<ApplicationLog> logs = logService.getRecentLogs(limit);
        return ResponseEntity.ok(logs);
    }

    @DeleteMapping("/cleanup")
    public ResponseEntity<String> cleanupOldLogs(@RequestParam int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        long deletedCount = logService.deleteLogsOlderThan(cutoffDate);
        return ResponseEntity.ok("Deleted " + deletedCount + " log entries older than " + days + " days");
    }
}
