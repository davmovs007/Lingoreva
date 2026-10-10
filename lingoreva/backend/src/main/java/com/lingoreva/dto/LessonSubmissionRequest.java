package com.lingoreva.dto;


public class LessonSubmissionRequest {
    private Long lessonId;
    private Integer score; // e.g. out of 100

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}
