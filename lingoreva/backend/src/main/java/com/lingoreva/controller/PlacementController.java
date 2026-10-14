package com.lingoreva.controller;

import com.lingoreva.dto.TestAnswerSubmission;
import com.lingoreva.dto.PlacementQuestionResponse;
import com.lingoreva.service.PlacementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/placement")
public class PlacementController {

    private final PlacementService placementService;

    public PlacementController(PlacementService placementService) {
        this.placementService = placementService;
    }


    @GetMapping
    public ResponseEntity<List<PlacementQuestionResponse>> getTest() {
        return ResponseEntity.ok(placementService.generateTest());
    }

    @PostMapping("/evaluate")
    public ResponseEntity<Map<String, String>> evaluateTest(@RequestBody List<TestAnswerSubmission> answers) {
        String level = placementService.evaluateTest(answers);
        return ResponseEntity.ok(Map.of("assignedLevel", level));
    }
}
