package com.bharathire.config;

import com.bharathire.entity.*;
import com.bharathire.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            CandidateProfileRepository candidateProfileRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            ApplicationStatusHistoryRepository statusHistoryRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already contains user records. Skipping seeding.");
            return;
        }

        logger.info("Seeding BharatHire initial realistic Indian recruitment demo data...");

        // 1. Companies
        Company tcs = companyRepository.findByNameIgnoreCase("Tata Consultancy Services")
                .orElseGet(() -> companyRepository.save(new Company(
                        "Tata Consultancy Services", "https://www.tcs.com", "IT Services & Consulting",
                        "10000+", "Mumbai, Maharashtra", "Global leader in IT services, consulting, and digital solutions."
                )));
        tcs.setIsVerified(true);
        tcs.setLogoUrl("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop");
        tcs = companyRepository.save(tcs);

        Company infosys = companyRepository.findByNameIgnoreCase("Infosys Technologies")
                .orElseGet(() -> companyRepository.save(new Company(
                        "Infosys Technologies", "https://www.infosys.com", "Information Technology",
                        "10000+", "Bengaluru, Karnataka", "A global leader in next-generation digital services and consulting."
                )));
        infosys.setIsVerified(true);
        infosys.setLogoUrl("https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=100&h=100&fit=crop");
        infosys = companyRepository.save(infosys);

        Company swiggy = companyRepository.findByNameIgnoreCase("Swiggy Technologies")
                .orElseGet(() -> companyRepository.save(new Company(
                        "Swiggy Technologies", "https://www.swiggy.com", "Consumer Internet / Food Tech",
                        "5000-10000", "Bengaluru, Karnataka", "India's premier on-demand convenience platform."
                )));
        swiggy.setIsVerified(true);
        swiggy.setLogoUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop");
        swiggy = companyRepository.save(swiggy);

        // 2. Users
        // Admin
        User admin = new User("admin@bharathire.in", passwordEncoder.encode("Admin@123"), Role.ROLE_ADMIN, "Aditi Sharma", "+91 9876543210");
        admin = userRepository.save(admin);

        // Recruiters
        User recUser1 = new User("recruiter@tcs.in", passwordEncoder.encode("Recruiter@123"), Role.ROLE_RECRUITER, "Rajesh Verma", "+91 9822334455");
        recUser1 = userRepository.save(recUser1);
        RecruiterProfile recProfile1 = new RecruiterProfile(recUser1, tcs, "Lead Talent Acquisition", "Engineering Hiring");
        recProfile1.setIsVerified(true);
        recruiterProfileRepository.save(recProfile1);

        User recUser2 = new User("recruiter@infosys.in", passwordEncoder.encode("Recruiter@123"), Role.ROLE_RECRUITER, "Priya Iyer", "+91 9711223344");
        recUser2 = userRepository.save(recUser2);
        RecruiterProfile recProfile2 = new RecruiterProfile(recUser2, infosys, "Campus & Lateral Recruitment Lead", "Global HR");
        recProfile2.setIsVerified(true);
        recruiterProfileRepository.save(recProfile2);

        // Candidates
        User candUser1 = new User("arun.kumar@gmail.com", passwordEncoder.encode("Candidate@123"), Role.ROLE_CANDIDATE, "Arun Kumar", "+91 9845012345");
        candUser1 = userRepository.save(candUser1);
        CandidateProfile candProfile1 = new CandidateProfile(candUser1);
        candProfile1.setHeadline("Full Stack Java & React Engineer | 3.5 Yrs Exp");
        candProfile1.setBio("Passionate software engineer experienced with Spring Boot microservices, React, and cloud native architectures across Indian startups.");
        candProfile1.setCurrentLocation("Bengaluru, Karnataka");
        candProfile1.setPreferredLocations("Bengaluru, Hyderabad, Remote");
        candProfile1.setYearsOfExperience(new BigDecimal("3.5"));
        candProfile1.setExpectedSalaryMin(new BigDecimal("1600000"));
        candProfile1.setExpectedSalaryMax(new BigDecimal("2200000"));
        candProfile1.setNoticePeriodDays(30);
        candProfile1.setLinkedinUrl("https://linkedin.com/in/arun-kumar-dev");
        candProfile1.setGithubUrl("https://github.com/arun-kumar-dev");
        candProfile1 = candidateProfileRepository.save(candProfile1);

        // Candidate 2
        User candUser2 = new User("neha.singh@gmail.com", passwordEncoder.encode("Candidate@123"), Role.ROLE_CANDIDATE, "Neha Singh", "+91 9988776655");
        candUser2 = userRepository.save(candUser2);
        CandidateProfile candProfile2 = new CandidateProfile(candUser2);
        candProfile2.setHeadline("Data Analyst & Python Specialist | 2 Yrs Exp");
        candProfile2.setBio("Analytical problem solver skilled in SQL, Python, PowerBI, and data pipelines.");
        candProfile2.setCurrentLocation("Pune, Maharashtra");
        candProfile2.setPreferredLocations("Pune, Mumbai, Remote");
        candProfile2.setYearsOfExperience(new BigDecimal("2.0"));
        candProfile2.setExpectedSalaryMin(new BigDecimal("1000000"));
        candProfile2.setExpectedSalaryMax(new BigDecimal("1500000"));
        candProfile2.setNoticePeriodDays(15);
        candProfile2 = candidateProfileRepository.save(candProfile2);

        // 3. Candidate Skills & Education
        CandidateSkill s1 = new CandidateSkill("Java", "Advanced", new BigDecimal("3.5"));
        s1.setCandidateProfile(candProfile1);
        CandidateSkill s2 = new CandidateSkill("Spring Boot", "Advanced", new BigDecimal("3.0"));
        s2.setCandidateProfile(candProfile1);
        CandidateSkill s3 = new CandidateSkill("React.js", "Intermediate", new BigDecimal("2.0"));
        s3.setCandidateProfile(candProfile1);
        candProfile1.getSkills().addAll(Arrays.asList(s1, s2, s3));

        CandidateEducation edu1 = new CandidateEducation("Visvesvaraya Technological University (VTU)", "B.Tech in Computer Science", "Computer Engineering", 2017, 2021, "8.6 CGPA");
        edu1.setCandidateProfile(candProfile1);
        candProfile1.getEducationList().add(edu1);

        CandidateExperience exp1 = new CandidateExperience("Wipro Digital", "Software Engineer", LocalDate.of(2021, 8, 1), null, true, "Designed microservices using Spring Boot and PostgreSQL.");
        exp1.setCandidateProfile(candProfile1);
        candProfile1.getExperienceList().add(exp1);
        candProfile1 = candidateProfileRepository.save(candProfile1);

        // 4. Jobs
        Job job1 = new Job();
        job1.setTitle("Senior Full Stack Java Developer");
        job1.setCategory("IT & Software");
        job1.setDescription("We are seeking a seasoned Full Stack Java Developer to architect and deliver mission-critical banking platforms. You will work with distributed microservices, Spring Boot, React, and high-throughput databases.");
        job1.setResponsibilities("Design robust REST APIs, mentor junior developers, participate in code reviews, optimize database queries, ensure 99.9% availability.");
        job1.setRequirements("3+ years of experience with Core Java (17/21), Spring Boot, React, MySQL/PostgreSQL, RESTful services, Docker.");
        job1.setMinExperience(3);
        job1.setMaxExperience(7);
        job1.setEmploymentType("Full-time");
        job1.setWorkMode("Hybrid");
        job1.setLocation("Bengaluru");
        job1.setState("Karnataka");
        job1.setSalaryMin(new BigDecimal("1800000"));
        job1.setSalaryMax(new BigDecimal("2800000"));
        job1.setSalaryCurrency("INR");
        job1.setVacancies(4);
        job1.setApplicationDeadline(LocalDate.now().plusMonths(2));
        job1.setStatus("PUBLISHED");
        job1.setCompany(tcs);
        job1.setRecruiter(recUser1);
        job1 = jobRepository.save(job1);
        job1.addSkill(new JobSkill("Java 21", true));
        job1.addSkill(new JobSkill("Spring Boot", true));
        job1.addSkill(new JobSkill("React", true));
        job1.addSkill(new JobSkill("MySQL", true));
        job1 = jobRepository.save(job1);

        Job job2 = new Job();
        job2.setTitle("Cloud DevOps Engineer (AWS & Kubernetes)");
        job2.setCategory("Engineering");
        job2.setDescription("Infosys Cloud Practice is hiring an experienced DevOps engineer to automate CI/CD pipelines, manage Kubernetes clusters on AWS/Azure, and enforce zero-downtime deployments.");
        job2.setResponsibilities("Maintain Kubernetes infrastructure, write Terraform modules, monitor production with Prometheus and Grafana, resolve cloud security audits.");
        job2.setRequirements("2+ years experience in AWS, Kubernetes, Terraform, Docker, Linux administration.");
        job2.setMinExperience(2);
        job2.setMaxExperience(5);
        job2.setEmploymentType("Full-time");
        job2.setWorkMode("Remote");
        job2.setLocation("Pune");
        job2.setState("Maharashtra");
        job2.setSalaryMin(new BigDecimal("1400000"));
        job2.setSalaryMax(new BigDecimal("2200000"));
        job2.setSalaryCurrency("INR");
        job2.setVacancies(2);
        job2.setApplicationDeadline(LocalDate.now().plusMonths(1));
        job2.setStatus("PUBLISHED");
        job2.setCompany(infosys);
        job2.setRecruiter(recUser2);
        job2 = jobRepository.save(job2);
        job2.addSkill(new JobSkill("Kubernetes", true));
        job2.addSkill(new JobSkill("AWS", true));
        job2.addSkill(new JobSkill("Terraform", true));
        job2 = jobRepository.save(job2);

        Job job3 = new Job();
        job3.setTitle("React Frontend Architect");
        job3.setCategory("IT & Software");
        job3.setDescription("Join Swiggy's consumer tech team to build hyper-responsive, state-of-the-art web experiences used by tens of millions of Indian users everyday.");
        job3.setResponsibilities("Spearhead frontend design system, enhance web vitals performance, implement complex animations, ensure accessibility.");
        job3.setRequirements("4+ years in modern React, TypeScript, Next.js or Vite, state management, CSS architectures.");
        job3.setMinExperience(4);
        job3.setMaxExperience(8);
        job3.setEmploymentType("Full-time");
        job3.setWorkMode("On-site");
        job3.setLocation("Bengaluru");
        job3.setState("Karnataka");
        job3.setSalaryMin(new BigDecimal("2400000"));
        job3.setSalaryMax(new BigDecimal("3500000"));
        job3.setSalaryCurrency("INR");
        job3.setVacancies(2);
        job3.setApplicationDeadline(LocalDate.now().plusMonths(2));
        job3.setStatus("PUBLISHED");
        job3.setCompany(swiggy);
        job3.setRecruiter(recUser1);
        job3 = jobRepository.save(job3);
        job3.addSkill(new JobSkill("React", true));
        job3.addSkill(new JobSkill("JavaScript/ES6", true));
        job3.addSkill(new JobSkill("Web Performance", true));
        job3 = jobRepository.save(job3);

        Job job4 = new Job();
        job4.setTitle("Data Analyst & BI Specialist");
        job4.setCategory("Data & Analytics");
        job4.setDescription("Analyze enterprise transactional data, deliver executive KPI dashboards, and support product experimentation pipelines.");
        job4.setResponsibilities("Build SQL pipelines, create interactive Tableau/PowerBI reports, conduct cohort analysis.");
        job4.setRequirements("Strong SQL, Python, Excel, PowerBI/Tableau.");
        job4.setMinExperience(1);
        job4.setMaxExperience(4);
        job4.setEmploymentType("Full-time");
        job4.setWorkMode("Hybrid");
        job4.setLocation("Hyderabad");
        job4.setState("Telangana");
        job4.setSalaryMin(new BigDecimal("900000"));
        job4.setSalaryMax(new BigDecimal("1500000"));
        job4.setSalaryCurrency("INR");
        job4.setVacancies(3);
        job4.setApplicationDeadline(LocalDate.now().plusMonths(1));
        job4.setStatus("PUBLISHED");
        job4.setCompany(infosys);
        job4.setRecruiter(recUser2);
        job4 = jobRepository.save(job4);
        job4.addSkill(new JobSkill("SQL", true));
        job4.addSkill(new JobSkill("Python", true));
        job4.addSkill(new JobSkill("PowerBI", true));
        job4 = jobRepository.save(job4);

        // 5. Pre-seed sample application
        Application app1 = new Application(job1, candProfile1, null, "Dear hiring team, I am eager to apply for the Senior Java Developer role. My 3.5 years in Spring Boot and cloud microservices makes me a strong match.");
        app1.setCurrentStatus(ApplicationStatus.Under_Review);
        app1.setRecruiterNotes("Strong candidate profile from VTU with solid Java and Spring Boot experience.");
        app1 = applicationRepository.save(app1);

        ApplicationStatusHistory h1 = new ApplicationStatusHistory(app1, null, "Applied", candUser1, "Application submitted");
        ApplicationStatusHistory h2 = new ApplicationStatusHistory(app1, "Applied", "Under_Review", recUser1, "Profile moved to Under Review for technical screening");
        statusHistoryRepository.saveAll(Arrays.asList(h1, h2));

        logger.info("BharatHire demo data seeded successfully with realistic accounts, jobs, and applications!");
    }
}
