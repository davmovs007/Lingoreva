package com.lingoreva;

import com.lingoreva.dto.AuthRequest;
import com.lingoreva.dto.AuthResponse;
import com.lingoreva.entity.Role;
import com.lingoreva.entity.User;
import com.lingoreva.repository.UserProfileRepository;
import com.lingoreva.repository.UserRepository;
import com.lingoreva.security.JwtUtil;
import com.lingoreva.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private UserProfileRepository userProfileRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserDetailsService userDetailsService;

    @InjectMocks
    private AuthService authService;

    private AuthRequest request;

    @BeforeEach
    void setUp() {
        request = new AuthRequest();
        request.setEmail("test@test.com");
        request.setPassword("password");
    }

    @Test
    void testRegister_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed");
        
        User user = new User();
        user.setId(1L);
        user.setEmail(request.getEmail());
        user.setRole(Role.USER);
        
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtUtil.generateToken(any())).thenReturn("token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("token", response.getToken());
        verify(userProfileRepository, times(1)).save(any());
    }

    @Test
    void testRegister_EmailExists() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        assertThrows(RuntimeException.class, () -> authService.register(request));
    }
}
