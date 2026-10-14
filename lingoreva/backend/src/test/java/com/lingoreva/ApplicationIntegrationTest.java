package com.lingoreva;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.flywaydb.core.Flyway;

import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApplicationIntegrationTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private Flyway flyway;

    @Test
    void flywayMigrationsCreateApplicationTables() {
        Integer users = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'PUBLIC' AND UPPER(table_name) = 'USERS'",
                Integer.class
        );
        Integer skills = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'PUBLIC' AND UPPER(table_name) = 'USER_PROFILE_SKILLS'",
                Integer.class
        );
        org.junit.jupiter.api.Assertions.assertTrue(users >= 1);
        org.junit.jupiter.api.Assertions.assertTrue(skills >= 1);
        org.junit.jupiter.api.Assertions.assertEquals(
                "4",
                flyway.info().current().getVersion().getVersion()
        );
    }

    @Test
    void protectedEndpointsRejectRequestsWithoutToken() throws Exception {
        mockMvc.perform(get("/api/v1/profile"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void registrationLoginPlacementCourseAndLessonCompletionWorkEndToEnd() throws Exception {
        String email = "integration-" + UUID.randomUUID() + "@example.com";
        String registration = objectMapper.writeValueAsString(
                java.util.Map.of("email", email, "password", "ValidPass1!")
        );

        MvcResult registrationResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registration))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn();
        String token = objectMapper.readTree(registrationResult.getResponse().getContentAsString())
                .get("token").asText();

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                java.util.Map.of("email", "weak-" + UUID.randomUUID() + "@example.com", "password", "weak")
                        )))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                java.util.Map.of("email", email, "password", "ValidPass1!")
                        )))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());

        mockMvc.perform(get("/api/v1/profile").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.xp").value(0));

        MvcResult questionsResult = mockMvc.perform(get("/api/v1/placement")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)))
                .andExpect(jsonPath("$[0].correctOption").doesNotExist())
                .andReturn();
        JsonNode questions = objectMapper.readTree(questionsResult.getResponse().getContentAsString());
        StringBuilder answerJson = new StringBuilder("[");
        for (int i = 0; i < questions.size(); i++) {
            if (i > 0) answerJson.append(',');
            long questionId = i + 1L;
            String correctOption = switch (i) {
                case 0 -> "A";
                case 1 -> "C";
                case 2 -> "C";
                default -> "B";
            };
            answerJson.append("{\"questionId\":").append(questionId)
                    .append(",\"selectedOption\":\"").append(correctOption).append("\"}");
        }
        answerJson.append(']');

        mockMvc.perform(post("/api/v1/placement/evaluate")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(answerJson.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assignedLevel").value("B2"));

        mockMvc.perform(post("/api/v1/placement/evaluate")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[]"))
                .andExpect(status().isBadRequest());

        MvcResult trajectoryResult = mockMvc.perform(get("/api/v1/lessons/trajectory")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andReturn();
        JsonNode trajectory = objectMapper.readTree(trajectoryResult.getResponse().getContentAsString());
        long firstLessonId = trajectory.get(0).get("id").asLong();

        mockMvc.perform(get("/api/v1/lessons/next").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dayNumber").value(1));

        mockMvc.perform(post("/api/v1/lessons/complete")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                java.util.Map.of("lessonId", firstLessonId, "score", 95)
                        )))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(95));

        mockMvc.perform(get("/api/v1/profile").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.xp").value(95))
                .andExpect(jsonPath("$.streakDays").value(1));

        mockMvc.perform(get("/api/v1/lessons/next").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dayNumber").value(2));

        mockMvc.perform(post("/api/v1/vocabulary/review")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                java.util.Map.of("wordId", 1, "correct", true, "difficultyScore", 0)
                        )))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correctAnswersCount").value(1));

        Integer persistedUser = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE email = ?",
                Integer.class,
                email
        );
        org.junit.jupiter.api.Assertions.assertEquals(1, persistedUser);
        Integer persistedWordReview = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM user_words uw JOIN users u ON u.id = uw.user_id WHERE u.email = ?",
                Integer.class,
                email
        );
        org.junit.jupiter.api.Assertions.assertEquals(1, persistedWordReview);
    }
}
