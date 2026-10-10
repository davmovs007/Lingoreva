CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interface_language VARCHAR(10) DEFAULT 'ru',
    timezone VARCHAR(50) DEFAULT 'UTC',
    current_level VARCHAR(10),
    daily_goal_minutes INT DEFAULT 20,
    course_duration_months INT DEFAULT 3,
    streak_days INT DEFAULT 0,
    xp BIGINT DEFAULT 0
);

CREATE TABLE words (
    id BIGSERIAL PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    translation VARCHAR(255) NOT NULL,
    cefr_level VARCHAR(10),
    part_of_speech VARCHAR(50),
    transcription VARCHAR(100),
    example_en TEXT,
    example_translation TEXT,
    category VARCHAR(100)
);

CREATE TABLE user_words (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id BIGINT NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW',
    next_review_date TIMESTAMP,
    correct_answers_count INT DEFAULT 0,
    UNIQUE(user_id, word_id)
);

CREATE TABLE lessons (
    id BIGSERIAL PRIMARY KEY,
    level VARCHAR(10) NOT NULL,
    day_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT
);

CREATE TABLE user_lessons (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    score INT,
    UNIQUE(user_id, lesson_id)
);

-- Insert demo content
INSERT INTO words (word, translation, cefr_level, part_of_speech, example_en, example_translation) VALUES
('apple', 'яблоко', 'A1', 'noun', 'I eat an apple.', 'Я ем яблоко.'),
('run', 'бегать', 'A1', 'verb', 'He runs fast.', 'Он быстро бегает.'),
('ubiquitous', 'вездесущий', 'C1', 'adjective', 'Smartphones have become ubiquitous.', 'Смартфоны стали вездесущими.');
