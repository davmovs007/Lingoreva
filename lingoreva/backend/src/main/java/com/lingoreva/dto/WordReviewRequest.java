package com.lingoreva.dto;


public class WordReviewRequest {
    private Long wordId;
    private boolean correct;
    private int difficultyScore; // 0 (easy) to 3 (hard)

    public Long getWordId() {
        return wordId;
    }

    public void setWordId(Long wordId) {
        this.wordId = wordId;
    }

    public boolean getCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public int getDifficultyScore() {
        return difficultyScore;
    }

    public void setDifficultyScore(int difficultyScore) {
        this.difficultyScore = difficultyScore;
    }
}
