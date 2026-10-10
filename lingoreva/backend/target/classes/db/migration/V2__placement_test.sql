CREATE TABLE test_questions (
    id BIGSERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option CHAR(1) NOT NULL,
    cefr_level VARCHAR(10) NOT NULL,
    skill_category VARCHAR(50) NOT NULL -- Grammar, Vocabulary, Reading
);

INSERT INTO test_questions (question_text, option_a, option_b, option_c, option_d, correct_option, cefr_level, skill_category) VALUES
('I ___ a student.', 'am', 'is', 'are', 'be', 'A', 'A1', 'Grammar'),
('She ___ to the store yesterday.', 'go', 'goes', 'went', 'gone', 'C', 'A2', 'Grammar'),
('If I ___ you, I would study harder.', 'am', 'was', 'were', 'been', 'C', 'B1', 'Grammar'),
('The project ___ by tomorrow.', 'will finish', 'will be finished', 'finished', 'is finishing', 'B', 'B2', 'Grammar');
