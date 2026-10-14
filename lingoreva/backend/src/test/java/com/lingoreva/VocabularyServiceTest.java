package com.lingoreva;

import com.lingoreva.dto.WordReviewRequest;
import com.lingoreva.entity.User;
import com.lingoreva.entity.UserWord;
import com.lingoreva.entity.Word;
import com.lingoreva.repository.UserRepository;
import com.lingoreva.repository.UserWordRepository;
import com.lingoreva.repository.WordRepository;
import com.lingoreva.service.VocabularyService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class VocabularyServiceTest {
    private UserWordRepository userWordRepository;
    private WordRepository wordRepository;
    private UserRepository userRepository;
    private VocabularyService service;
    private User user;
    private Word word;

    @BeforeEach
    void setUp() {
        userWordRepository = mock(UserWordRepository.class);
        wordRepository = mock(WordRepository.class);
        userRepository = mock(UserRepository.class);
        service = new VocabularyService(userWordRepository, wordRepository, userRepository);
        user = new User();
        user.setId(3L);
        user.setEmail("learner@example.com");
        word = new Word();
        word.setId(12L);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("learner@example.com", "n/a")
        );
        when(userRepository.findByEmail("learner@example.com")).thenReturn(Optional.of(user));
        when(wordRepository.findById(12L)).thenReturn(Optional.of(word));
        when(userWordRepository.save(any(UserWord.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void correctReviewsUseSpacedIntervals() {
        UserWord first = review(true, 0, 0);
        assertEquals(1, first.getCorrectAnswersCount());
        assertTrue(first.getNextReviewDate().isAfter(LocalDateTime.now().plusHours(23)));
        assertEquals("LEARNING", first.getStatus());

        UserWord second = review(true, 1, 0);
        assertEquals(2, second.getCorrectAnswersCount());
        assertTrue(second.getNextReviewDate().isAfter(LocalDateTime.now().plusDays(2).plusHours(23)));
    }

    @Test
    void incorrectReviewResetsStreakAndSchedulesSoonRetry() {
        UserWord result = review(false, 4, 0);
        assertEquals(0, result.getCorrectAnswersCount());
        assertEquals("LEARNING", result.getStatus());
        assertTrue(result.getNextReviewDate().isAfter(LocalDateTime.now().plusHours(3)));
        assertTrue(result.getNextReviewDate().isBefore(LocalDateTime.now().plusHours(5)));
    }

    @Test
    void dueWordSelectionExcludesFutureReviews() {
        UserWord due = new UserWord();
        due.setNextReviewDate(LocalDateTime.now().minusMinutes(1));
        UserWord future = new UserWord();
        future.setNextReviewDate(LocalDateTime.now().plusDays(1));
        UserWord unscheduled = new UserWord();
        when(userWordRepository.findByUserId(3L)).thenReturn(List.of(due, future, unscheduled));

        assertEquals(List.of(due, unscheduled), service.getWordsToReview());
    }

    private UserWord review(boolean correct, int previousCorrectCount, int difficulty) {
        UserWord existing = new UserWord();
        existing.setId(40L);
        existing.setUser(user);
        existing.setWord(word);
        existing.setCorrectAnswersCount(previousCorrectCount);
        when(userWordRepository.findByUserId(3L)).thenReturn(List.of(existing));

        WordReviewRequest request = new WordReviewRequest();
        request.setWordId(12L);
        request.setCorrect(correct);
        request.setDifficultyScore(difficulty);
        return service.submitReview(request);
    }
}
