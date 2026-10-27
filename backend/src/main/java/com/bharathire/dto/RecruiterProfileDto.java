package com.bharathire.dto;

public class RecruiterProfileDto {
    private String fullName;
    private String email;
    private String phone;
    private Long companyId;
    private String companyName;
    private String companyWebsite;
    private String companyIndustry;
    private String companySize;
    private String companyHeadquarters;
    private String companyDescription;
    private String companyLogoUrl;
    private Boolean isCompanyVerified;
    private String designation;
    private String department;
    private Boolean isRecruiterVerified;

    public RecruiterProfileDto() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyWebsite() { return companyWebsite; }
    public void setCompanyWebsite(String companyWebsite) { this.companyWebsite = companyWebsite; }

    public String getCompanyIndustry() { return companyIndustry; }
    public void setCompanyIndustry(String companyIndustry) { this.companyIndustry = companyIndustry; }

    public String getCompanySize() { return companySize; }
    public void setCompanySize(String companySize) { this.companySize = companySize; }

    public String getCompanyHeadquarters() { return companyHeadquarters; }
    public void setCompanyHeadquarters(String companyHeadquarters) { this.companyHeadquarters = companyHeadquarters; }

    public String getCompanyDescription() { return companyDescription; }
    public void setCompanyDescription(String companyDescription) { this.companyDescription = companyDescription; }

    public String getCompanyLogoUrl() { return companyLogoUrl; }
    public void setCompanyLogoUrl(String companyLogoUrl) { this.companyLogoUrl = companyLogoUrl; }

    public Boolean getIsCompanyVerified() { return isCompanyVerified; }
    public void setIsCompanyVerified(Boolean isCompanyVerified) { this.isCompanyVerified = isCompanyVerified; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Boolean getIsRecruiterVerified() { return isRecruiterVerified; }
    public void setIsRecruiterVerified(Boolean isRecruiterVerified) { this.isRecruiterVerified = isRecruiterVerified; }
}
