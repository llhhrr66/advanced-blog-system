package com.blog.service;

import com.blog.domain.dto.LoginRequest;
import com.blog.domain.dto.RegisterRequest;

import java.util.Map;

/**
 * 认证服务接口
 */
public interface AuthService {

    /**
     * 用户登录
     */
    Map<String, Object> login(LoginRequest loginRequest);

    /**
     * 用户注册
     */
    Map<String, Object> register(RegisterRequest registerRequest);

    /**
     * 刷新Token
     */
    Map<String, Object> refreshToken(String refreshToken);

    /**
     * 退出登录
     */
    void logout(String token);

    /**
     * 获取当前用户信息
     */
    Map<String, Object> getCurrentUser(String username);
}
