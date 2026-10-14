package com.lingoreva;

import com.lingoreva.dto.LessonSubmissionRequest;
import com.lingoreva.entity.Lesson;
import com.lingoreva.entity.User;
import com.lingoreva.entity.UserLesson;
import com.lingoreva.entity.UserProfile;
import com.lingoreva.repository.LessonRepository;
import com.lingoreva.repository.UserLessonRepository;
import com.lingoreva.repository.UserProfileRepository;
import com.lingoreva.repository.UserRepository;
import com.lingoreva.service.LessonService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class LessonServiceTest {
    private LessonRepository lessonRepository;
    private UserLessonRepository userLessonRepository;
    private UserProfileRepository profileRepository;
    private UserRepository userRepository;
    private LessonService service;
    private User user;
    private UserProfile profile;

    @BeforeEach
    void setUp() {
        lessonRepository = mock(LessonRepository.class);
        userLessonRepository = mock(UserLessonRepository.class);
        profileRepository = mock(UserProfileRepository.class);
        userRepository = mock(UserRepository.class);
        service = new LessonService(lessonRepository, userLessonRepository, profileRepository, userRepository);
        user = new User();
        user.setId(3L);
        user.setEmail("learner@example.com");
        profile = new UserProfile();
        profile.setCurrentLevel("A1");
        profile.setXp(15L);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("learner@example.com", "n/a")
        );
        when(userRepository.findByEmail("learner@example.com")).thenReturn(Optional.of(user));
        when(profileRepository.findByUserId(3L)).thenReturn(Optional.of(profile));
        when(userLessonRepository.findByUserId(3L)).thenReturn(List.of());
        when(userLessonRepository.save(any(UserLesson.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void completesNextLessonAndPersistsScoreAndProgress() {
        Lesson lesson = lesson(10L, "A1", 1);
        when(lessonRepository.findById(10L)).thenReturn(Optional.of(lesson));
        when(userLessonRepository.existsByUserIdAndLessonId(3L, 10L)).thenReturn(false);

        UserLesson result = service.completeLesson(submission(10L, 80));

        assertEquals(lesson, result.getLesson());
        assertEquals(80, result.getScore());
        assertEquals(user, result.getUser());
        assertEquals(95L, profile.getXp());
        assertEquals(1, profile.getStreakDays());
        verify(profileRepository).save(profile);
    }

    @Test
    void refusesToCompleteLessonsOutOfSequence() {
        Lesson lessonTwo = lesson(11L, "A1", 2);
        when(lessonRepository.findById(11L)).thenReturn(Optional.of(lessonTwo));
        when(userLessonRepository.existsByUserIdAndLessonId(3L, 11L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> service.completeLesson(submission(11L, 100)));
        verify(userLessonRepository, never()).save(any());
        verify(profileRepository, never()).save(any());
    }

    @Test
    void rejectsInvalidScores() {
        Lesson lesson = lesson(10L, "A1", 1);
        when(lessonRepository.findById(10L)).thenReturn(Optional.of(lesson));
        when(userLessonRepository.existsByUserIdAndLessonId(3L, 10L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> service.completeLesson(submission(10L, 101)));
        assertThrows(IllegalArgumentException.class, () -> service.completeLesson(submission(10L, -1)));
        verify(userLessonRepository, never()).save(any());
    }

    private static Lesson lesson(Long id, String level, int day) {
        Lesson lesson = new Lesson();
        lesson.setId(id);
        lesson.setLevel(level);
        lesson.setDayNumber(day);
        return lesson;
    }

    private static LessonSubmissionRequest submission(Long lessonId, int score) {
        LessonSubmissionRequest request = new LessonSubmissionRequest();
        request.setLessonId(lessonId);
        request.setScore(score);
        return request;
    }
}
