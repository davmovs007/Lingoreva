package com.lingoreva.controller;

import com.lingoreva.dto.LessonSubmissionRequest;
import com.lingoreva.entity.Lesson;
import com.lingoreva.entity.UserLesson;
import com.lingoreva.service.LessonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }


    @GetMapping("/trajectory")
    public ResponseEntity<List<Lesson>> getCourseTrajectory() {
        return ResponseEntity.ok(lessonService.getCourseTrajectory());
    }

    @GetMapping("/next")
    public ResponseEntity<Lesson> getNextLesson() {
        return ResponseEntity.ok(lessonService.getNextLesson());
    }

    @PostMapping("/complete")
    public ResponseEntity<UserLesson> completeLesson(@RequestBody LessonSubmissionRequest request) {
        return ResponseEntity.ok(lessonService.completeLesson(request));
    }
}
