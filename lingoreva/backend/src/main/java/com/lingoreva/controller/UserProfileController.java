package com.lingoreva.controller;

import com.lingoreva.dto.ProfileUpdateRequest;
import com.lingoreva.entity.UserProfile;
import com.lingoreva.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }


    @GetMapping
    public ResponseEntity<UserProfile> getProfile() {
        return ResponseEntity.ok(userProfileService.getProfile());
    }

    @PutMapping
    public ResponseEntity<UserProfile> updateProfile(@RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(userProfileService.updateProfile(request));
    }
}
