-- V2__seed_demo_data.sql
-- Seed initial verified companies

INSERT INTO companies (id, name, website, industry, company_size, headquarters, description, is_verified, logo_url, created_at, updated_at)
VALUES 
(1, 'Tata Consultancy Services', 'https://www.tcs.com', 'IT Services & Consulting', '10000+', 'Mumbai, Maharashtra', 'Global leader in IT services, consulting, and business solutions with a huge presence across India.', TRUE, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Infosys Technologies', 'https://www.infosys.com', 'Information Technology', '10000+', 'Bengaluru, Karnataka', 'A global leader in next-generation digital services and consulting navigating enterprise transformations.', TRUE, 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=100&h=100&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Swiggy Technologies', 'https://www.swiggy.com', 'Consumer Internet / Food Tech', '5000-10000', 'Bengaluru, Karnataka', 'India leading on-demand convenience platform connecting consumers with favorite restaurants and stores.', TRUE, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'HDFC Bank', 'https://www.hdfcbank.com', 'Banking & Financial Services', '10000+', 'Mumbai, Maharashtra', 'Premier private sector bank providing cutting-edge digital banking and financial services in India.', TRUE, 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=100&h=100&fit=crop', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
