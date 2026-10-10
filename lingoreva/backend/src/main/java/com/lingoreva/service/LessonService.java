package com.lingoreva.service;

import com.lingoreva.dto.LessonSubmissionRequest;
import com.lingoreva.entity.Lesson;
import com.lingoreva.entity.User;
import com.lingoreva.entity.UserLesson;
import com.lingoreva.entity.UserProfile;
import com.lingoreva.repository.LessonRepository;
import com.lingoreva.repository.UserLessonRepository;
import com.lingoreva.repository.UserProfileRepository;
import com.lingoreva.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final UserLessonRepository userLessonRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public LessonService(LessonRepository lessonRepository, UserLessonRepository userLessonRepository, UserProfileRepository userProfileRepository, UserRepository userRepository) {
        this.lessonRepository = lessonRepository;
        this.userLessonRepository = userLessonRepository;
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }


    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    public List<Lesson> getCourseTrajectory() {
        User user = getCurrentUser();
        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElseThrow();
        
        String level = profile.getCurrentLevel() != null ? profile.getCurrentLevel() : "A1";
        return lessonRepository.findByLevelOrderByDayNumberAsc(level);
    }

    public Lesson getNextLesson() {
        User user = getCurrentUser();
        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElseThrow();
        String level = profile.getCurrentLevel() != null ? profile.getCurrentLevel() : "A1";

        List<UserLesson> completedLessons = userLessonRepository.findByUserId(user.getId());
        
        // Find the maximum day number completed for the current level
        int maxDayCompleted = completedLessons.stream()
                .filter(ul -> ul.getLesson().getLevel().equals(level))
                .mapToInt(ul -> ul.getLesson().getDayNumber())
                .max()
                .orElse(0);

        // Next lesson is the one right after the max completed day
        return lessonRepository.findByLevelAndDayNumber(level, maxDayCompleted + 1)
                .orElseThrow(() -> new RuntimeException("No further lessons found for this level. Course might be completed."));
    }

    @Transactional
    public UserLesson completeLesson(LessonSubmissionRequest request) {
        User user = getCurrentUser();
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        if (userLessonRepository.existsByUserIdAndLessonId(user.getId(), lesson.getId())) {
            throw new RuntimeException("Lesson already completed");
        }

        UserLesson userLesson = new UserLesson();
        userLesson.setUser(user);
        userLesson.setLesson(lesson);
        userLesson.setScore(request.getScore());
        userLesson.setCompletedAt(LocalDateTime.now());
        
        // Update user profile streak and xp
        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElseThrow();
        profile.setXp(profile.getXp() + request.getScore());
        profile.setStreakDays(profile.getStreakDays() + 1); // Simple streak logic
        userProfileRepository.save(profile);

        return userLessonRepository.save(userLesson);
    }
}
