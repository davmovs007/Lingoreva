package com.lingoreva.service;

import com.lingoreva.dto.TestAnswerSubmission;
import com.lingoreva.dto.PlacementQuestionResponse;
import com.lingoreva.entity.TestQuestion;
import com.lingoreva.entity.User;
import com.lingoreva.entity.UserProfile;
import com.lingoreva.repository.TestQuestionRepository;
import com.lingoreva.repository.UserProfileRepository;
import com.lingoreva.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.HashSet;
import java.util.Set;

@Service
public class PlacementService {

    private final TestQuestionRepository questionRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public PlacementService(TestQuestionRepository questionRepository, UserProfileRepository userProfileRepository, UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }


    public List<PlacementQuestionResponse> generateTest() {
        return questionRepository.findAll().stream()
                .map(question -> new PlacementQuestionResponse(
                        question.getId(),
                        question.getQuestionText(),
                        question.getOptionA(),
                        question.getOptionB(),
                        question.getOptionC(),
                        question.getOptionD(),
                        question.getCefrLevel(),
                        question.getSkillCategory()
                ))
                .toList();
    }

    @Transactional
    public String evaluateTest(List<TestAnswerSubmission> answers) {
        if (answers == null || answers.isEmpty()) {
            throw new IllegalArgumentException("At least one placement answer is required");
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElseThrow();

        int score = 0;
        int total = answers.size();
        Set<Long> answeredQuestionIds = new HashSet<>();

        for (TestAnswerSubmission answer : answers) {
            if (answer == null || answer.getQuestionId() == null || answer.getSelectedOption() == null
                    || !answeredQuestionIds.add(answer.getQuestionId())) {
                throw new IllegalArgumentException("Placement answers must contain unique question IDs and selected options");
            }
            TestQuestion question = questionRepository.findById(answer.getQuestionId())
                    .orElseThrow(() -> new IllegalArgumentException("Unknown placement question: " + answer.getQuestionId()));
            if (question.getCorrectOption().equalsIgnoreCase(answer.getSelectedOption())) {
                score++;
            }
        }

        double percentage = (double) score / total;
        String level = "A1";
        if (percentage > 0.8) level = "B2";
        else if (percentage > 0.6) level = "B1";
        else if (percentage > 0.4) level = "A2";

        profile.setCurrentLevel(level);
        userProfileRepository.save(profile);

        return level;
    }
}
