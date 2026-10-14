package com.lingoreva.dto;

public record PlacementQuestionResponse(
        Long id,
        String questionText,
        String optionA,
        String optionB,
        String optionC,
        String optionD,
        String cefrLevel,
        String skillCategory
) {
}
