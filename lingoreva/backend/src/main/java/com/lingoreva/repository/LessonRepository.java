package com.lingoreva.repository;

import com.lingoreva.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByLevelOrderByDayNumberAsc(String level);
    Optional<Lesson> findByLevelAndDayNumber(String level, Integer dayNumber);
}
