-- =========================
-- USERS
-- =========================

INSERT INTO users (
    id,
    email,
    username,
    password_hash,
    created_at,
    account_non_expired,
    account_non_locked,
    credentials_non_expired,
    enabled
) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'admin@test.com',
    'admin',
    '$2a$10$Dow1qzvG3p9fJ5Yzq0wF8u8c0m5cQq7v3o8b2xvJ1mXcZ8qYp8q9K', -- admin123
    CURRENT_TIMESTAMP,
    true,
    true,
    true,
    true
),
(
    '22222222-2222-2222-2222-222222222222',
    'user@test.com',
    'user',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi9z4Z1ZrQ1Gqk9x6QW8Q1Qe1Qe1Qe1', -- user123
    CURRENT_TIMESTAMP,
    true,
    true,
    true,
    true
),
(
    '33333333-3333-3333-3333-333333333333',
    'test@test.com',
    'test',
    '$2a$10$E9Xk8Qm8QwqvZb7nFz2eXOBxQv9cQ1o9z2mLkq1mXcZ8qYp8q9Kaa', -- test123
    CURRENT_TIMESTAMP,
    true,
    true,
    true,
    true
);

-- =========================
-- ROLES
-- =========================

INSERT INTO user_role (user_id, role) VALUES
('11111111-1111-1111-1111-111111111111', 'ADMIN'),
('11111111-1111-1111-1111-111111111111', 'USER'),
('22222222-2222-2222-2222-222222222222', 'USER'),
('33333333-3333-3333-3333-333333333333', 'USER');