package com.lingoreva.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_words")
public class UserWord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id")
    private Word word;
    
    private String status = "NEW";
    private LocalDateTime nextReviewDate;
    private Integer correctAnswersCount = 0;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Word getWord() {
        return word;
    }

    public void setWord(Word word) {
        this.word = word;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getNextReviewDate() {
        return nextReviewDate;
    }

    public void setNextReviewDate(LocalDateTime nextReviewDate) {
        this.nextReviewDate = nextReviewDate;
    }

    public Integer getCorrectAnswersCount() {
        return correctAnswersCount;
    }

    public void setCorrectAnswersCount(Integer correctAnswersCount) {
        this.correctAnswersCount = correctAnswersCount;
    }
}
