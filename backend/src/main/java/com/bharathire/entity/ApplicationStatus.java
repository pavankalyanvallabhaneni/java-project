package com.bharathire.entity;

public enum ApplicationStatus {
    Applied,
    Under_Review,
    Shortlisted,
    Interview_Scheduled,
    Selected,
    Rejected,
    Withdrawn;

    public static ApplicationStatus fromString(String statusStr) {
        if (statusStr == null) return Applied;
        String clean = statusStr.trim().replace(" ", "_");
        for (ApplicationStatus s : ApplicationStatus.values()) {
            if (s.name().equalsIgnoreCase(clean)) {
                return s;
            }
        }
        return Applied;
    }

    public String toDisplayString() {
        return this.name().replace("_", " ");
    }
}
