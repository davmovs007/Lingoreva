package com.lingoreva.repository;
import com.lingoreva.entity.UserWord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserWordRepository extends JpaRepository<UserWord, Long> {
    List<UserWord> findByUserId(Long userId);
}
