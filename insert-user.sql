-- Insert admin user
INSERT INTO users (id, email, password, firstName, lastName, role, isActive) 
VALUES (
  UUID(),
  'vikash123@example.com',
  '$2b$10$i7PNTdGq.yIIYfAkXIfDhuL0KnZhWBJUkGc82BNQZ7iPyEVMF8S2u',
  'Vikash',
  'Nagar',
  'admin',
  1
);

-- Verify user was created
SELECT 'USER CREATED SUCCESSFULLY!' as Status;
SELECT id, email, firstName, lastName, role, isActive FROM users WHERE email = 'vikash123@example.com';
