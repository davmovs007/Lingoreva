package com.lingoreva.service;

import com.lingoreva.dto.WordReviewRequest;
import com.lingoreva.entity.User;
import com.lingoreva.entity.UserWord;
import com.lingoreva.entity.Word;
import com.lingoreva.repository.UserRepository;
import com.lingoreva.repository.UserWordRepository;
import com.lingoreva.repository.WordRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VocabularyService {

    private final UserWordRepository userWordRepository;
    private final WordRepository wordRepository;
    private final UserRepository userRepository;

    public VocabularyService(UserWordRepository userWordRepository, WordRepository wordRepository, UserRepository userRepository) {
        this.userWordRepository = userWordRepository;
        this.wordRepository = wordRepository;
        this.userRepository = userRepository;
    }


    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public List<UserWord> getWordsToReview() {
        User user = getCurrentUser();
        List<UserWord> allUserWords = userWordRepository.findByUserId(user.getId());
        LocalDateTime now = LocalDateTime.now();
        
        return allUserWords.stream()
                .filter(uw -> uw.getNextReviewDate() == null || uw.getNextReviewDate().isBefore(now))
                .toList();
    }

    @Transactional
    public UserWord submitReview(WordReviewRequest request) {
        User user = getCurrentUser();
        Word word = wordRepository.findById(request.getWordId())
                .orElseThrow(() -> new RuntimeException("Word not found"));

        UserWord userWord = userWordRepository.findByUserId(user.getId()).stream()
                .filter(uw -> uw.getWord().getId().equals(word.getId()))
                .findFirst()
                .orElseGet(() -> {
                    UserWord nw = new UserWord();
                    nw.setUser(user);
                    nw.setWord(word);
                    return nw;
                });

        // Simple SM-2 inspired spacing logic
        if (request.getCorrect()) {
            userWord.setCorrectAnswersCount(userWord.getCorrectAnswersCount() + 1);
            userWord.setStatus("LEARNING");
            
            // Calculate next review interval in days based on streak
            int daysToAdd = calculateInterval(userWord.getCorrectAnswersCount(), request.getDifficultyScore());
            userWord.setNextReviewDate(LocalDateTime.now().plusDays(daysToAdd));
            
            if (userWord.getCorrectAnswersCount() > 5) {
                userWord.setStatus("KNOWN");
            }
        } else {
            userWord.setCorrectAnswersCount(0); // reset streak
            userWord.setStatus("LEARNING");
            userWord.setNextReviewDate(LocalDateTime.now().plusHours(4)); // review again soon
        }

        return userWordRepository.save(userWord);
    }

    private int calculateInterval(int correctCount, int difficulty) {
        if (correctCount == 1) return 1;
        if (correctCount == 2) return 3;
        if (correctCount == 3) return 7;
        
        // Dynamic interval calculation based on ease
        double easeFactor = 2.5 - (difficulty * 0.15); // Simple ease factor
        return (int) Math.max(7, Math.round(7 * easeFactor * (correctCount - 2)));
    }
}
