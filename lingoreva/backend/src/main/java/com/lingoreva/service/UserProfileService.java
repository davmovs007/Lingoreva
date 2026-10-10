package com.lingoreva.service;

import com.lingoreva.dto.ProfileUpdateRequest;
import com.lingoreva.entity.User;
import com.lingoreva.entity.UserProfile;
import com.lingoreva.repository.UserProfileRepository;
import com.lingoreva.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileService(UserProfileRepository userProfileRepository, UserRepository userRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }


    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public UserProfile getProfile() {
        User currentUser = getCurrentUser();
        return userProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    @Transactional
    public UserProfile updateProfile(ProfileUpdateRequest request) {
        UserProfile profile = getProfile();

        if (request.getInterfaceLanguage() != null) profile.setInterfaceLanguage(request.getInterfaceLanguage());
        if (request.getTimezone() != null) profile.setTimezone(request.getTimezone());
        if (request.getCurrentLevel() != null) profile.setCurrentLevel(request.getCurrentLevel());
        if (request.getDailyGoalMinutes() != null) profile.setDailyGoalMinutes(request.getDailyGoalMinutes());
        if (request.getCourseDurationMonths() != null) profile.setCourseDurationMonths(request.getCourseDurationMonths());
        if (request.getTargetSkills() != null) profile.setTargetSkills(request.getTargetSkills());
        if (request.getLearningGoals() != null) profile.setLearningGoals(request.getLearningGoals());

        return userProfileRepository.save(profile);
    }
}
