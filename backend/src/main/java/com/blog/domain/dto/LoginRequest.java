package com.blog.domain.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 登录请求DTO
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoginRequest {
    
    @NotBlank(message = "用户名不能为空")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    private String password;
    
    /**
     * 记住我
     * 支持remember和rememberMe两种字段名
     */
    @JsonAlias({"remember", "rememberMe"})
    private Boolean rememberMe = false;
}
