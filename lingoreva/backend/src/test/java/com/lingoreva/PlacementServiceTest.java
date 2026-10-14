package com.lingoreva;

import com.lingoreva.dto.TestAnswerSubmission;
import com.lingoreva.entity.TestQuestion;
import com.lingoreva.entity.User;
import com.lingoreva.entity.UserProfile;
import com.lingoreva.repository.TestQuestionRepository;
import com.lingoreva.repository.UserProfileRepository;
import com.lingoreva.repository.UserRepository;
import com.lingoreva.service.PlacementService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PlacementServiceTest {
    private TestQuestionRepository questionRepository;
    private UserProfileRepository profileRepository;
    private UserRepository userRepository;
    private PlacementService service;
    private UserProfile profile;

    @BeforeEach
    void setUp() {
        questionRepository = mock(TestQuestionRepository.class);
        profileRepository = mock(UserProfileRepository.class);
        userRepository = mock(UserRepository.class);
        service = new PlacementService(questionRepository, profileRepository, userRepository);

        User user = new User();
        user.setId(7L);
        user.setEmail("learner@example.com");
        profile = new UserProfile();
        profile.setCurrentLevel("A1");
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("learner@example.com", "n/a")
        );
        when(userRepository.findByEmail("learner@example.com")).thenReturn(Optional.of(user));
        when(profileRepository.findByUserId(7L)).thenReturn(Optional.of(profile));
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void evaluatesPlacementAndPersistsAssignedLevel() {
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question(1L, "A")));
        when(questionRepository.findById(2L)).thenReturn(Optional.of(question(2L, "B")));
        when(questionRepository.findById(3L)).thenReturn(Optional.of(question(3L, "C")));
        when(questionRepository.findById(4L)).thenReturn(Optional.of(question(4L, "D")));

        String level = service.evaluateTest(List.of(answer(1L, "A"), answer(2L, "B"), answer(3L, "X"), answer(4L, "D")));

        assertEquals("B1", level);
        assertEquals("B1", profile.getCurrentLevel());
        verify(profileRepository).save(profile);
    }

    @Test
    void rejectsEmptyPlacementSubmissionsInsteadOfAssigningAnArbitraryLevel() {
        assertThrows(IllegalArgumentException.class, () -> service.evaluateTest(List.of()));
        verifyNoInteractions(userRepository, profileRepository);
    }

    @Test
    void rejectsUnknownAndDuplicateQuestionIds() {
        when(questionRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> service.evaluateTest(List.of(answer(999L, "A"))));
        assertThrows(IllegalArgumentException.class, () -> service.evaluateTest(List.of(answer(1L, "A"), answer(1L, "B"))));
        verify(profileRepository, never()).save(any());
    }

    private static TestQuestion question(Long id, String correctOption) {
        TestQuestion question = new TestQuestion();
        question.setId(id);
        question.setCorrectOption(correctOption);
        return question;
    }

    private static TestAnswerSubmission answer(Long questionId, String selectedOption) {
        TestAnswerSubmission answer = new TestAnswerSubmission();
        answer.setQuestionId(questionId);
        answer.setSelectedOption(selectedOption);
        return answer;
    }
}
