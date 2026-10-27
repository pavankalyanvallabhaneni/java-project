package com.bharathire;

import com.bharathire.dto.AuthRequest;
import com.bharathire.dto.AuthResponse;
import com.bharathire.dto.JobCreateRequest;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class JobManagementIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String recruiterToken;
    private String candidateToken;

    @BeforeEach
    void setUp() throws Exception {
        // Login recruiter
        MvcResult recResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AuthRequest("recruiter@tcs.in", "Recruiter@123"))))
                .andReturn();
        JsonNode recJson = objectMapper.readTree(recResult.getResponse().getContentAsString());
        recruiterToken = recJson.get("data").get("token").asText();

        // Login candidate
        MvcResult candResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AuthRequest("arun.kumar@gmail.com", "Candidate@123"))))
                .andReturn();
        JsonNode candJson = objectMapper.readTree(candResult.getResponse().getContentAsString());
        candidateToken = candJson.get("data").get("token").asText();
    }

    @Test
    @DisplayName("Should search jobs and return paginated results")
    void testSearchJobsPublic() throws Exception {
        mockMvc.perform(get("/api/jobs")
                        .param("page", "0")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", not(empty())))
                .andExpect(jsonPath("$.data.totalElements", greaterThanOrEqualTo(1)));
    }

    @Test
    @DisplayName("Should filter jobs by category IT & Software")
    void testFilterJobsByCategory() throws Exception {
        mockMvc.perform(get("/api/jobs")
                        .param("category", "IT & Software"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content[0].category", is("IT & Software")));
    }

    @Test
    @DisplayName("Recruiter should successfully create and publish a new job")
    void testRecruiterCreateJob() throws Exception {
        JobCreateRequest request = new JobCreateRequest();
        request.setTitle("Junior Java Backend Developer");
        request.setCategory("IT & Software");
        request.setDescription("Exciting opportunity for entry level Java engineers to join TCS financial solutions division.");
        request.setLocation("Hyderabad");
        request.setState("Telangana");
        request.setEmploymentType("Full-time");
        request.setWorkMode("Hybrid");
        request.setMinExperience(1);
        request.setMaxExperience(3);
        request.setSalaryMin(new BigDecimal("700000"));
        request.setSalaryMax(new BigDecimal("1100000"));
        request.setVacancies(3);
        request.setApplicationDeadline(LocalDate.now().plusMonths(2));
        request.setSkills(List.of("Java", "Spring Boot", "MySQL"));

        mockMvc.perform(post("/api/recruiter/jobs")
                        .header("Authorization", "Bearer " + recruiterToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.title", is("Junior Java Backend Developer")))
                .andExpect(jsonPath("$.data.location", is("Hyderabad")));
    }

    @Test
    @DisplayName("Candidate should be forbidden from creating a job")
    void testCandidateCannotCreateJob() throws Exception {
        JobCreateRequest request = new JobCreateRequest();
        request.setTitle("Unauthorized Job Posting");
        request.setCategory("IT & Software");
        request.setDescription("This should fail because candidate does not have ROLE_RECRUITER.");
        request.setLocation("Bengaluru");

        mockMvc.perform(post("/api/recruiter/jobs")
                        .header("Authorization", "Bearer " + candidateToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}
