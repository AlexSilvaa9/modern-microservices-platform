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
('11111111-1111-1111-1111-111111111111','alexsilvaebg9@gmail.com','alejandro',
 '$2a$10$cOyY2sdfwOxJXq3U40nX6.2cci6XRzohoSZrGP5PqQKvoIRuVBPje',CURRENT_TIMESTAMP,true,true,true,true),

('22222222-2222-2222-2222-222222222222','alejandrosilvarodriguez9@gmail.com','user1',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true),

('33333333-3333-3333-3333-333333333333','user2@test.com','user2',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true),

('44444444-4444-4444-4444-444444444444','user3@test.com','user3',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true),

('55555555-5555-5555-5555-555555555555','user4@test.com','user4',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true),

('66666666-6666-6666-6666-666666666666','user5@test.com','user5',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true),

('77777777-7777-7777-7777-777777777777','user6@test.com','user6',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true),

('88888888-8888-8888-8888-888888888888','user7@test.com','user7',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true),

('99999999-9999-9999-9999-999999999999','user8@test.com','user8',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','user9@test.com','user9',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','user10@test.com','user10',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true),

('cccccccc-cccc-cccc-cccc-cccccccccccc','user11@test.com','user11',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true),

('dddddddd-dddd-dddd-dddd-dddddddddddd','user12@test.com','user12',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','user13@test.com','user13',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true),

('ffffffff-ffff-ffff-ffff-ffffffffffff','user14@test.com','user14',
 '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiK2G8zY5Z6c6k3p5b8Y2q5p9v5y3a',CURRENT_TIMESTAMP,true,true,true,true);

 INSERT INTO user_role (user_id, role) VALUES
 ('11111111-1111-1111-1111-111111111111','ADMIN'),

 ('22222222-2222-2222-2222-222222222222','ADMIN'),
 ('33333333-3333-3333-3333-333333333333','USER'),
 ('44444444-4444-4444-4444-444444444444','USER'),
 ('55555555-5555-5555-5555-555555555555','USER'),
 ('66666666-6666-6666-6666-666666666666','USER'),
 ('77777777-7777-7777-7777-777777777777','USER'),
 ('88888888-8888-8888-8888-888888888888','USER'),
 ('99999999-9999-9999-9999-999999999999','USER'),
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','USER'),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','USER'),
 ('cccccccc-cccc-cccc-cccc-cccccccccccc','USER'),
 ('dddddddd-dddd-dddd-dddd-dddddddddddd','USER'),
 ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','USER'),
 ('ffffffff-ffff-ffff-ffff-ffffffffffff','USER');

 INSERT INTO user_provider (user_id, provider) VALUES
 ('11111111-1111-1111-1111-111111111111','GOOGLE'),
 ('22222222-2222-2222-2222-222222222222','GOOGLE'),
 ('33333333-3333-3333-3333-333333333333','DATABASE'),
 ('44444444-4444-4444-4444-444444444444','DATABASE'),
 ('55555555-5555-5555-5555-555555555555','DATABASE'),
 ('66666666-6666-6666-6666-666666666666','DATABASE'),
 ('77777777-7777-7777-7777-777777777777','DATABASE'),
 ('88888888-8888-8888-8888-888888888888','DATABASE'),
 ('99999999-9999-9999-9999-999999999999','DATABASE'),
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','DATABASE'),
 ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','DATABASE'),
 ('cccccccc-cccc-cccc-cccc-cccccccccccc','DATABASE'),
 ('dddddddd-dddd-dddd-dddd-dddddddddddd','DATABASE'),
 ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','DATABASE'),
 ('ffffffff-ffff-ffff-ffff-ffffffffffff','DATABASE');