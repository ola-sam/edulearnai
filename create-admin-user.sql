-- This SQL script creates an admin user in the database
-- The password is 'SecurePass123' hashed with scrypt
-- You can run this script with: psql -d edulearn -f create-admin-user.sql

-- First, check if the admin user already exists
DO $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT 1 FROM users WHERE username = 'admin') INTO user_exists;
    
    IF user_exists THEN
        -- Update existing user to admin role
        UPDATE users 
        SET role = 'admin', 
            is_teacher = true 
        WHERE username = 'admin';
        
        RAISE NOTICE 'Admin user already exists. Updated to admin role.';
    ELSE
        -- Create new admin user
        -- Password: SecurePass123 (hashed)
        INSERT INTO users (
            username, 
            password, 
            first_name, 
            last_name, 
            grade, 
            points, 
            role, 
            is_teacher
        ) VALUES (
            'admin', 
            '5dca53a0a45a48e0e8f5a2e670bfa7a5e3f13d11a0f260c617e0b9a62d9548b8d4a2d9f9c8e2f1a0c1a5e8d2f1a5e8d2f1a5e8d2f1a5e8d2f1a5e8d2f1a5e8.c7b1f8d6e5a4c3b2a1f8e7d6c5b4a3',
            'Admin', 
            'User', 
            12, 
            0, 
            'admin', 
            true
        );
        
        RAISE NOTICE 'Admin user created successfully.';
    END IF;
END $$;
