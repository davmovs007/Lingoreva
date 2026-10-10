package com.lingoreva.controller;

import com.lingoreva.dto.WordReviewRequest;
import com.lingoreva.entity.UserWord;
import com.lingoreva.service.VocabularyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vocabulary")
public class VocabularyController {

    private final VocabularyService vocabularyService;

    public VocabularyController(VocabularyService vocabularyService) {
        this.vocabularyService = vocabularyService;
    }


    @GetMapping("/review")
    public ResponseEntity<List<UserWord>> getWordsToReview() {
        return ResponseEntity.ok(vocabularyService.getWordsToReview());
    }

    @PostMapping("/review")
    public ResponseEntity<UserWord> submitReview(@RequestBody WordReviewRequest request) {
        return ResponseEntity.ok(vocabularyService.submitReview(request));
    }
}
