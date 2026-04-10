package com.banchan.auth.application;

import com.banchan.auth.domain.DuplicateEmailException;
import com.banchan.auth.domain.InvalidCredentialsException;
import com.banchan.auth.presentation.LoginRequest;
import com.banchan.auth.presentation.LoginResponse;
import com.banchan.auth.presentation.SignupRequest;
import com.banchan.auth.presentation.SignupResponse;
import com.banchan.config.jwt.JwtTokenProvider;
import com.banchan.user.domain.User;
import com.banchan.user.domain.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public SignupResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateEmailException();
        }

        User user = new User(
            request.email(),
            passwordEncoder.encode(request.password())
        );
        if (request.nickname() != null) {
            user.setNickname(request.nickname());
        }

        User saved = userRepository.save(user);
        return new SignupResponse(
            saved.getId(),
            saved.getEmail(),
            saved.getNickname(),
            saved.getRole().name()
        );
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole().name());

        return new LoginResponse(
            user.getId(),
            user.getEmail(),
            user.getNickname(),
            user.getRole().name(),
            token
        );
    }
}
