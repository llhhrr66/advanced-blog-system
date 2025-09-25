package com.blog.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 错误码枚举
 */
@Getter
@AllArgsConstructor
public enum ErrorCode {
    
    // 通用错误
    SUCCESS(200, "操作成功"),
    PARAM_ERROR(400, "参数错误"),
    UNAUTHORIZED(401, "未授权"),
    FORBIDDEN(403, "禁止访问"),
    NOT_FOUND(404, "资源不存在"),
    INTERNAL_ERROR(500, "服务器内部错误"),
    
    // 用户相关错误
    USER_NOT_FOUND(1001, "用户不存在"),
    USER_PASSWORD_ERROR(1002, "用户名或密码错误"),
    USER_DISABLED(1003, "用户已被禁用"),
    USER_ALREADY_EXISTS(1004, "用户已存在"),
    EMAIL_ALREADY_EXISTS(1005, "邮箱已被注册"),
    
    // 文章相关错误
    ARTICLE_NOT_FOUND(2001, "文章不存在"),
    ARTICLE_ALREADY_EXISTS(2002, "文章已存在"),
    
    // 分类相关错误
    CATEGORY_NOT_FOUND(3001, "分类不存在"),
    CATEGORY_ALREADY_EXISTS(3002, "分类已存在"),
    
    // Token相关错误
    TOKEN_INVALID(4001, "无效的令牌"),
    TOKEN_EXPIRED(4002, "令牌已过期"),
    TOKEN_NOT_FOUND(4003, "令牌不存在"),
    
    // 批量操作相关错误
    BATCH_OPERATION_FAILED(5001, "批量操作失败"),
    BATCH_OPERATION_PARTIAL_FAILED(5002, "批量操作部分失败"),
    BATCH_OPERATION_INVALID_IDS(5003, "批量操作ID列表无效"),
    BATCH_OPERATION_EMPTY_LIST(5004, "批量操作列表为空"),
    BATCH_OPERATION_INSUFFICIENT_PERMISSION(5005, "批量操作权限不足"),
    BATCH_OPERATION_INVALID_TYPE(5006, "无效的批量操作类型");
    
    private final Integer code;
    private final String message;
}
