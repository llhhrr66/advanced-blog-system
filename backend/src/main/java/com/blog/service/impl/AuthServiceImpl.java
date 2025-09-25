package com.blog.service.impl;

import com.blog.domain.dto.LoginRequest;
import com.blog.domain.dto.RegisterRequest;
import com.blog.domain.entity.User;
import com.blog.mapper.UserMapper;
import com.blog.service.AuthService;
import com.blog.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 认证服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final StringRedisTemplate stringRedisTemplate;

    @Override
    public Map<String, Object> login(LoginRequest loginRequest) {
        // 认证
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // 生成token
        String accessToken = jwtUtils.generateTokenFromAuth(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(loginRequest.getUsername());

        // 存储refresh token到Redis
        stringRedisTemplate.opsForValue().set(
                "refresh_token:" + loginRequest.getUsername(),
                refreshToken,
                7, TimeUnit.DAYS
        );

        // 更新最后登录时间
        User user = userMapper.findByUsername(loginRequest.getUsername());
        user.setLastLoginTime(LocalDateTime.now());
        userMapper.updateById(user);

        // 构建响应
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("tokenType", "Bearer");
        response.put("expiresIn", 86400);
        response.put("user", getUserInfo(user));

        log.info("用户 {} 登录成功", loginRequest.getUsername());
        return response;
    }

    @Override
    @Transactional
    public Map<String, Object> register(RegisterRequest registerRequest) {
        // 检查用户名是否存在
        if (userMapper.findByUsername(registerRequest.getUsername()) != null) {
            throw new RuntimeException("用户名已存在");
        }

        // 检查邮箱是否存在
        if (userMapper.findByEmail(registerRequest.getEmail()) != null) {
            throw new RuntimeException("邮箱已被注册");
        }

        // 创建新用户
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setNickname(registerRequest.getNickname() != null ? 
                registerRequest.getNickname() : registerRequest.getUsername());
        user.setRole("USER");
        user.setStatus(1);
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        user.setDeleted(false);

        userMapper.insert(user);

        // 自动登录
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(registerRequest.getUsername());
        loginRequest.setPassword(registerRequest.getPassword());

        log.info("用户 {} 注册成功", registerRequest.getUsername());
        return login(loginRequest);
    }

    @Override
    public Map<String, Object> refreshToken(String refreshToken) {
        // 验证refresh token
        if (!jwtUtils.validateToken(refreshToken)) {
            throw new RuntimeException("无效的刷新令牌");
        }

        String username = jwtUtils.extractUsername(refreshToken);

        // 验证Redis中的refresh token
        String storedToken = stringRedisTemplate.opsForValue().get("refresh_token:" + username);
        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw new RuntimeException("刷新令牌已失效");
        }

        // 生成新的access token
        String newAccessToken = jwtUtils.generateToken(username);

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", newAccessToken);
        response.put("tokenType", "Bearer");
        response.put("expiresIn", 86400);

        return response;
    }

    @Override
    public void logout(String token) {
        if (token != null && jwtUtils.validateToken(token)) {
            String username = jwtUtils.extractUsername(token);
            
            // 删除refresh token
            stringRedisTemplate.delete("refresh_token:" + username);
            
            // 将access token加入黑名单
            stringRedisTemplate.opsForValue().set(
                    "blacklist_token:" + token,
                    "true",
                    24, TimeUnit.HOURS
            );
            
            log.info("用户 {} 退出登录", username);
        }
    }

    @Override
    public Map<String, Object> getCurrentUser(String username) {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        return getUserInfo(user);
    }

    /**
     * 构建用户信息
     */
    private Map<String, Object> getUserInfo(User user) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("email", user.getEmail());
        userInfo.put("nickname", user.getNickname());
        userInfo.put("avatar", user.getAvatar());
        userInfo.put("bio", user.getBio());
        userInfo.put("role", user.getRole());
        return userInfo;
    }
}
