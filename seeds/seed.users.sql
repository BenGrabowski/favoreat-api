BEGIN; 

INSERT INTO favoreat_users (user_name, password)
VALUES
    ('bengrabowski', '$2a$12$6NUyDvgDPay8LbR2tMSuGOzPTQSL8Z48F.EOqupEgtGZbaLOk6Eky'),
    ('testuser', '$2a$12$zxCE8QciE5kyoN/VRMbh5.4RIyLDdaSF8/oHVdvDa/r/kkm3of5zK'),
    ('demo', '$2a$12$g6wLYG4kJHBIq8WhYKVieOlm1XEhy2qPVp6ZOGQRjpfOjK1grH93m');

COMMIT;