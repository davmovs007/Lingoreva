CREATE TABLE user_profile_skills (
    user_profile_id BIGINT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    skill VARCHAR(100) NOT NULL
);

CREATE TABLE user_profile_goals (
    user_profile_id BIGINT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    goal VARCHAR(100) NOT NULL
);
