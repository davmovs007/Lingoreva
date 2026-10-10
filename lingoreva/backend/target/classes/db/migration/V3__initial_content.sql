-- Insert initial Words
INSERT INTO words (word, translation, cefr_level, part_of_speech, example_en, example_translation, category) VALUES
('ubiquitous', 'вездесущий', 'C1', 'adjective', 'Smartphones have become ubiquitous.', 'Смартфоны стали вездесущими.', 'technology'),
('ephemeral', 'эфемерный, недолговечный', 'C1', 'adjective', 'Fame in the world of rock and pop is largely ephemeral.', 'Слава в мире рока и попа во многом недолговечна.', 'abstract'),
('serendipity', 'интуитивная прозорливость, счастливая случайность', 'C2', 'noun', 'They found each other by pure serendipity.', 'Они нашли друг друга по чистой случайности.', 'abstract'),
('resilient', 'устойчивый, жизнерадостный', 'B2', 'adjective', 'She is very resilient to change.', 'Она очень устойчива к переменам.', 'personality'),
('pragmatic', 'прагматичный', 'B2', 'adjective', 'He took a pragmatic approach to the problem.', 'Он применил прагматичный подход к проблеме.', 'personality'),
('hello', 'привет', 'A1', 'interjection', 'Hello, how are you?', 'Привет, как дела?', 'basics'),
('apple', 'яблоко', 'A1', 'noun', 'I like to eat apples.', 'Я люблю есть яблоки.', 'food'),
('run', 'бежать', 'A1', 'verb', 'I run every morning.', 'Я бегаю каждое утро.', 'action');

-- Insert initial Lessons
INSERT INTO lessons (level, day_number, title, content) VALUES
('A1', 1, 'Basics: Greetings and Introductions', 'In this lesson, you will learn how to say hello and introduce yourself. \n\nVocabulary:\n- Hello\n- My name is...\n- Nice to meet you.'),
('A1', 2, 'Basics: Numbers and Colors', 'Learn how to count to 10 and identify basic colors. \n\nColors: Red, Blue, Green.'),
('B2', 1, 'Professional Communication', 'Learn how to write a formal email and address colleagues appropriately in a business setting.'),
('B2', 2, 'Negotiation Tactics', 'Learn phrases used in negotiations: "I understand your position, but...", "Could we consider an alternative?"'),
('C1', 1, 'Advanced Idioms', 'Understanding idiomatic expressions used in daily native speech. E.g., "Bite the bullet", "Under the weather".');

