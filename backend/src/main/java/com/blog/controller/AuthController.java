package com.blog.controller;

import com.blog.common.Result;
import com.blog.domain.dto.LoginRequest;
import com.blog.domain.dto.RegisterRequest;
import com.blog.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 认证控制器
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("用户登录请求: {}", loginRequest.getUsername());
        Map<String, Object> result = authService.login(loginRequest);
        return Result.success(result, "登录成功");
    }

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public Result<Map<String, Object>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("用户注册请求: {}", registerRequest.getUsername());
        Map<String, Object> result = authService.register(registerRequest);
        return Result.success(result, "注册成功");
    }

    /**
     * 刷新Token
     */
    @PostMapping("/refresh")
    public Result<Map<String, Object>> refreshToken(@RequestParam String refreshToken) {
        Map<String, Object> result = authService.refreshToken(refreshToken);
        return Result.success(result, "令牌刷新成功");
    }

    /**
     * 退出登录
     */
    @PostMapping("/logout")
    public Result<Void> logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7);
            authService.logout(token);
        }
        return Result.success(null, "退出成功");
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/current")
    public Result<Map<String, Object>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return Result.error(401, "未登录");
        }
        Map<String, Object> userInfo = authService.getCurrentUser(authentication.getName());
        return Result.success(userInfo);
    }
}
