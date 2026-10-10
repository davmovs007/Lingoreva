package com.lingoreva.entity;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private String interfaceLanguage = "ru";
    private String timezone = "UTC";
    private String currentLevel;
    private Integer dailyGoalMinutes = 20;
    private Integer courseDurationMonths = 3;
    
    @ElementCollection
    @CollectionTable(name = "user_profile_skills", joinColumns = @JoinColumn(name = "user_profile_id"))
    @Column(name = "skill")
    private List<String> targetSkills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_profile_goals", joinColumns = @JoinColumn(name = "user_profile_id"))
    @Column(name = "goal")
    private List<String> learningGoals = new ArrayList<>();
    
    private Integer streakDays = 0;
    private Long xp = 0L;

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

    public String getInterfaceLanguage() {
        return interfaceLanguage;
    }

    public void setInterfaceLanguage(String interfaceLanguage) {
        this.interfaceLanguage = interfaceLanguage;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(String currentLevel) {
        this.currentLevel = currentLevel;
    }

    public Integer getDailyGoalMinutes() {
        return dailyGoalMinutes;
    }

    public void setDailyGoalMinutes(Integer dailyGoalMinutes) {
        this.dailyGoalMinutes = dailyGoalMinutes;
    }

    public Integer getCourseDurationMonths() {
        return courseDurationMonths;
    }

    public void setCourseDurationMonths(Integer courseDurationMonths) {
        this.courseDurationMonths = courseDurationMonths;
    }

    public List<String> getTargetSkills() {
        return targetSkills;
    }

    public void setTargetSkills(List<String> targetSkills) {
        this.targetSkills = targetSkills == null ? new ArrayList<>() : targetSkills;
    }

    public List<String> getLearningGoals() {
        return learningGoals;
    }

    public void setLearningGoals(List<String> learningGoals) {
        this.learningGoals = learningGoals == null ? new ArrayList<>() : learningGoals;
    }

    public Integer getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(Integer streakDays) {
        this.streakDays = streakDays;
    }

    public Long getXp() {
        return xp;
    }

    public void setXp(Long xp) {
        this.xp = xp;
    }
}
