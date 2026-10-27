package com.bharathire;

import com.bharathire.dto.AuthRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AdminOperationsTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String candidateToken;

    @BeforeEach
    void setUp() throws Exception {
        // Admin: Aditi Sharma
        MvcResult adminResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AuthRequest("admin@bharathire.in", "Admin@123"))))
                .andReturn();
        adminToken = objectMapper.readTree(adminResult.getResponse().getContentAsString()).get("data").get("token").asText();

        // Candidate: Arun Kumar
        MvcResult candResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AuthRequest("arun.kumar@gmail.com", "Candidate@123"))))
                .andReturn();
        candidateToken = objectMapper.readTree(candResult.getResponse().getContentAsString()).get("data").get("token").asText();
    }

    @Test
    @DisplayName("Admin should successfully retrieve platform-wide statistics")
    void testAdminStatsSuccess() throws Exception {
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.totalUsers", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.totalJobs", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.totalApplications", greaterThanOrEqualTo(1)));
    }

    @Test
    @DisplayName("Candidate must be blocked from admin endpoints with 403 Forbidden")
    void testCandidateBlockedFromAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + candidateToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Admin should successfully verify an employer company")
    void testAdminVerifyCompany() throws Exception {
        mockMvc.perform(patch("/api/admin/companies/1/verify")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("verify", true))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.isVerified", is(true)));
    }
}
