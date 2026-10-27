package com.bharathire.service;

import com.bharathire.entity.AuditLog;
import com.bharathire.entity.User;
import com.bharathire.repository.AuditLogRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void logAction(User user, String action, String entityType, Long entityId, String details, String ipAddress) {
        try {
            AuditLog log = new AuditLog(user, action, entityType, entityId, ipAddress, details);
            auditLogRepository.save(log);
        } catch (Exception ex) {
            // Never break main flow if audit logging encounters a minor error
        }
    }
}
