package com.bharathire.service;

import com.bharathire.dto.*;
import com.bharathire.entity.*;
import com.bharathire.exception.BadRequestException;
import com.bharathire.exception.ResourceNotFoundException;
import com.bharathire.repository.*;
import com.bharathire.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CompanyRepository companyRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AuditService auditService;

    public AuthService(
            UserRepository userRepository,
            CandidateProfileRepository candidateProfileRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            CompanyRepository companyRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            AuditService auditService) {
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.companyRepository = companyRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.auditService = auditService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid role specified. Must be ROLE_CANDIDATE or ROLE_RECRUITER");
        }

        if (role == Role.ROLE_ADMIN) {
            throw new BadRequestException("Admin accounts cannot be registered publicly");
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role,
                request.getFullName(),
                request.getPhone()
        );
        user = userRepository.save(user);

        if (role == Role.ROLE_CANDIDATE) {
            CandidateProfile profile = new CandidateProfile(user);
            profile.setCurrentLocation(request.getCurrentLocation() != null ? request.getCurrentLocation() : "India");
            candidateProfileRepository.save(profile);
        } else if (role == Role.ROLE_RECRUITER) {
            Company company = null;
            if (request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
                company = companyRepository.findByNameIgnoreCase(request.getCompanyName().trim())
                        .orElseGet(() -> companyRepository.save(new Company(
                                request.getCompanyName().trim(),
                                request.getCompanyWebsite(),
                                "Information Technology",
                                "50-200",
                                request.getCurrentLocation() != null ? request.getCurrentLocation() : "India",
                                "Registered employer on BharatHire platform."
                        )));
            }
            RecruiterProfile recruiterProfile = new RecruiterProfile(
                    user,
                    company,
                    request.getDesignation() != null ? request.getDesignation() : "Talent Acquisition Specialist",
                    request.getDepartment() != null ? request.getDepartment() : "Human Resources"
            );
            recruiterProfileRepository.save(recruiterProfile);
        }

        auditService.logAction(user, "USER_REGISTERED", "User", user.getId(), "Registered with role " + role, null);

        String token = tokenProvider.generateTokenForUser(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(), user.getFullName());
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new BadRequestException("Your account is " + user.getStatus().toLowerCase() + ". Please contact administrator.");
        }

        auditService.logAction(user, "USER_LOGIN", "User", user.getId(), "User logged in successfully", null);

        String token = tokenProvider.generateToken(authentication);
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(), user.getFullName());
    }

    @Transactional
    public String requestPasswordReset(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        // Security best practice: Do not reveal whether email exists or not
        if (user != null) {
            passwordResetTokenRepository.deleteByUserId(user.getId());

            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken(user, token, LocalDateTime.now().plusHours(2));
            passwordResetTokenRepository.save(resetToken);

            auditService.logAction(user, "PASSWORD_RESET_REQUESTED", "User", user.getId(), "Reset token generated", null);
            logger.info("==================================================================");
            logger.info("DEVELOPMENT PASSWORD RESET TOKEN FOR {}: {}", user.getEmail(), token);
            logger.info("==================================================================");

            return token; // Returned for development/testing ease
        }
        return null;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token"));

        if (resetToken.getIsUsed() || resetToken.isExpired()) {
            throw new BadRequestException("Reset token is expired or has already been used");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setIsUsed(true);
        passwordResetTokenRepository.save(resetToken);

        auditService.logAction(user, "PASSWORD_RESET_COMPLETED", "User", user.getId(), "Password updated via reset token", null);
    }
}
