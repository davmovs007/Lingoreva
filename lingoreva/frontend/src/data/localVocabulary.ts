export type ReviewWord = {
  word: {
    id: number;
    word: string;
    translation: string;
    partOfSpeech: string;
    cefrLevel: string;
    exampleEn: string;
    exampleTranslation: string;
  };
};

export const localVocabulary: ReviewWord[] = [
  { word: { id: 1, word: 'hello', translation: 'привет', partOfSpeech: 'interjection', cefrLevel: 'A1', exampleEn: 'Hello, how are you?', exampleTranslation: 'Привет, как дела?' } },
  { word: { id: 2, word: 'apple', translation: 'яблоко', partOfSpeech: 'noun', cefrLevel: 'A1', exampleEn: 'I like to eat apples.', exampleTranslation: 'Я люблю есть яблоки.' } },
  { word: { id: 3, word: 'run', translation: 'бежать', partOfSpeech: 'verb', cefrLevel: 'A1', exampleEn: 'I run every morning.', exampleTranslation: 'Я бегаю каждое утро.' } },
  { word: { id: 4, word: 'resilient', translation: 'устойчивый', partOfSpeech: 'adjective', cefrLevel: 'B2', exampleEn: 'She is resilient to change.', exampleTranslation: 'Она устойчива к переменам.' } },
  { word: { id: 5, word: 'pragmatic', translation: 'прагматичный', partOfSpeech: 'adjective', cefrLevel: 'B2', exampleEn: 'He took a pragmatic approach.', exampleTranslation: 'Он выбрал прагматичный подход.' } },
  { word: { id: 6, word: 'ubiquitous', translation: 'вездесущий', partOfSpeech: 'adjective', cefrLevel: 'C1', exampleEn: 'Smartphones are ubiquitous.', exampleTranslation: 'Смартфоны повсюду.' } },
  { word: { id: 7, word: 'ephemeral', translation: 'недолговечный', partOfSpeech: 'adjective', cefrLevel: 'C1', exampleEn: 'Fame can be ephemeral.', exampleTranslation: 'Слава может быть недолговечной.' } },
  { word: { id: 8, word: 'serendipity', translation: 'счастливая случайность', partOfSpeech: 'noun', cefrLevel: 'C2', exampleEn: 'They met by pure serendipity.', exampleTranslation: 'Они встретились по счастливой случайности.' } },
];
