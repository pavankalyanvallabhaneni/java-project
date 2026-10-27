package com.bharathire;

import com.bharathire.dto.ApplicationRequest;
import com.bharathire.dto.ApplicationStatusUpdateRequest;
import com.bharathire.dto.AuthRequest;
import com.fasterxml.jackson.databind.JsonNode;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ApplicationWorkflowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String candidate1Token;
    private String candidate2Token;
    private String recruiterToken;

    @BeforeEach
    void setUp() throws Exception {
        // Candidate 1: Arun Kumar (pre-applied to Job 1 in seeder)
        MvcResult cand1Result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AuthRequest("arun.kumar@gmail.com", "Candidate@123"))))
                .andReturn();
        candidate1Token = objectMapper.readTree(cand1Result.getResponse().getContentAsString()).get("data").get("token").asText();

        // Candidate 2: Neha Singh
        MvcResult cand2Result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AuthRequest("neha.singh@gmail.com", "Candidate@123"))))
                .andReturn();
        candidate2Token = objectMapper.readTree(cand2Result.getResponse().getContentAsString()).get("data").get("token").asText();

        // Recruiter: Rajesh Verma (TCS, owner of Job 1)
        MvcResult recResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AuthRequest("recruiter@tcs.in", "Recruiter@123"))))
                .andReturn();
        recruiterToken = objectMapper.readTree(recResult.getResponse().getContentAsString()).get("data").get("token").asText();
    }

    @Test
    @DisplayName("Candidate 2 should successfully apply for Job 2")
    void testApplyForJobSuccess() throws Exception {
        ApplicationRequest request = new ApplicationRequest();
        request.setJobId(2L);
        request.setCoverLetter("I am an experienced DevOps engineer ready to contribute to AWS/Kubernetes infrastructure.");

        mockMvc.perform(post("/api/applications/apply")
                        .header("Authorization", "Bearer " + candidate2Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.jobTitle", containsString("DevOps")))
                .andExpect(jsonPath("$.data.currentStatus", is("Applied")));
    }

    @Test
    @DisplayName("Should reject duplicate application by Candidate 1 to Job 1")
    void testDuplicateApplicationRejection() throws Exception {
        // Candidate 1 already applied to Job 1 in seed data
        ApplicationRequest request = new ApplicationRequest();
        request.setJobId(1L);
        request.setCoverLetter("Applying again for Job 1.");

        mockMvc.perform(post("/api/applications/apply")
                        .header("Authorization", "Bearer " + candidate1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("already applied")));
    }

    @Test
    @DisplayName("Recruiter should successfully update application status to Shortlisted")
    void testRecruiterUpdateApplicationStatus() throws Exception {
        ApplicationStatusUpdateRequest request = new ApplicationStatusUpdateRequest("Shortlisted", "Candidate shortlisted for technical round 1.");

        mockMvc.perform(patch("/api/applications/1/status")
                        .header("Authorization", "Bearer " + recruiterToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.currentStatus", is("Shortlisted")))
                .andExpect(jsonPath("$.data.statusHistory", not(empty())));
    }

    @Test
    @DisplayName("Candidate 2 should be forbidden from accessing Candidate 1's private application")
    void testCandidateDataIsolation() throws Exception {
        // Candidate 2 attempts to inspect application ID 1 (which belongs to Candidate 1)
        mockMvc.perform(get("/api/applications/1")
                        .header("Authorization", "Bearer " + candidate2Token))
                .andExpect(status().isForbidden());
    }
}
