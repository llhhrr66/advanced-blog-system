package com.blog.common.result;

/**
 * 结果状态枚举
 */
public enum ResultEnum {
    
    /**
     * 成功
     */
    SUCCESS(200, "操作成功"),
    
    /**
     * 通用错误
     */
    ERROR(500, "系统错误"),
    
    /**
     * 参数错误
     */
    PARAMETER_ERROR(400, "参数错误"),
    
    /**
     * 数据不存在
     */
    DATA_NOT_FOUND(404, "数据不存在"),
    
    /**
     * 数据已存在
     */
    DATA_ALREADY_EXISTS(409, "数据已存在"),
    
    /**
     * 操作失败
     */
    OPERATION_FAILED(500, "操作失败"),
    
    /**
     * 权限不足
     */
    PERMISSION_DENIED(403, "权限不足"),
    
    /**
     * 未授权
     */
    UNAUTHORIZED(401, "未授权"),
    
    /**
     * 请求方法不支持
     */
    METHOD_NOT_SUPPORTED(405, "请求方法不支持"),
    
    /**
     * 请求参数缺失
     */
    MISSING_PARAMETER(400, "请求参数缺失"),
    
    /**
     * 请求参数类型错误
     */
    PARAMETER_TYPE_ERROR(400, "请求参数类型错误"),
    
    /**
     * 业务逻辑错误
     */
    BUSINESS_ERROR(500, "业务逻辑错误");
    
    private final Integer code;
    private final String message;
    
    ResultEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
    
    public Integer getCode() {
        return code;
    }
    
    public String getMessage() {
        return message;
    }
}
