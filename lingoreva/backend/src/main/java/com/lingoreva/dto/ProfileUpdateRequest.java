package com.lingoreva.dto;

import java.util.List;

public class ProfileUpdateRequest {
    private String interfaceLanguage;
    private String timezone;
    private String currentLevel;
    private Integer dailyGoalMinutes;
    private Integer courseDurationMonths;
    private List<String> targetSkills; // e.g. ["Vocabulary", "Grammar"]
    private List<String> learningGoals; // e.g. ["travel", "business"]

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
        this.targetSkills = targetSkills;
    }

    public List<String> getLearningGoals() {
        return learningGoals;
    }

    public void setLearningGoals(List<String> learningGoals) {
        this.learningGoals = learningGoals;
    }
}
