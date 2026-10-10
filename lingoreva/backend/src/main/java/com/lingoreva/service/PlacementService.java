package com.lingoreva.service;

import com.lingoreva.dto.TestAnswerSubmission;
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


    public List<TestQuestion> generateTest() {
        // In a real app, this would be adaptive. For now, fetch a mix of all levels.
        return questionRepository.findAll();
    }

    @Transactional
    public String evaluateTest(List<TestAnswerSubmission> answers) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElseThrow();

        int score = 0;
        int total = answers.size();

        for (TestAnswerSubmission answer : answers) {
            TestQuestion q = questionRepository.findById(answer.getQuestionId()).orElse(null);
            if (q != null && q.getCorrectOption().equalsIgnoreCase(answer.getSelectedOption())) {
                score++;
            }
        }

        // Simple evaluation logic
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
