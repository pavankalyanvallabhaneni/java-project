package com.bharathire;

import com.bharathire.dto.AuthRequest;
import com.bharathire.dto.ForgotPasswordRequest;
import com.bharathire.dto.RegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Should successfully register a new candidate")
    void testRegisterCandidateSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Kavita Rao");
        request.setEmail("kavita.rao@example.com");
        request.setPassword("Password@123");
        request.setPhone("+91 9888877777");
        request.setRole("ROLE_CANDIDATE");
        request.setCurrentLocation("Bengaluru, Karnataka");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.email", is("kavita.rao@example.com")))
                .andExpect(jsonPath("$.data.role", is("ROLE_CANDIDATE")));
    }

    @Test
    @DisplayName("Should reject duplicate email registration")
    void testRegisterDuplicateEmailFails() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Duplicate User");
        request.setEmail("arun.kumar@gmail.com"); // Pre-seeded email
        request.setPassword("Password@123");
        request.setRole("ROLE_CANDIDATE");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("already exists")));
    }

    @Test
    @DisplayName("Should login successfully with valid credentials and return JWT token")
    void testLoginSuccess() throws Exception {
        AuthRequest request = new AuthRequest("arun.kumar@gmail.com", "Candidate@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.role", is("ROLE_CANDIDATE")))
                .andExpect(jsonPath("$.data.email", is("arun.kumar@gmail.com")));
    }

    @Test
    @DisplayName("Should reject login with invalid password")
    void testLoginInvalidPasswordFails() throws Exception {
        AuthRequest request = new AuthRequest("arun.kumar@gmail.com", "WrongPassword999");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("Invalid email or password")));
    }

    @Test
    @DisplayName("Should request password reset token successfully")
    void testForgotPassword() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest("arun.kumar@gmail.com");

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", notNullValue()));
    }
}
